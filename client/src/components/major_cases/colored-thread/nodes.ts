import type { DjangoContext } from "@/utils/django_types";

import type { INode, NodeAnswer } from "./types/BoardTypes";

export const collectNodes = (context: DjangoContext | undefined) => {
  const consistent_nodes: NodeAnswer[] = [
    {
      node: { id: "wasting-illness", x: 68.7, y: 13.5 },
      answer: "WASTING ILLNESS",
    },
    { node: { id: "trampled", x: 73.5, y: 41 }, answer: "TRAMPLED" },
    { node: { id: "ennui", x: 62, y: 58 }, answer: "ENNUI" },
    { node: { id: "forced-regeneration", x: 62, y: 65 }, answer: "FORCED REGENERATION" },
    { node: { id: "internal-lacerations", x: 34, y: 58 }, answer: "INTERNAL LACERATIONS" },
    { node: { id: "shot-out-of-cannon", x: 27, y: 66 }, answer: "SHOT OUT OF CANNON" },
    { node: { id: "crushed-neck", x: 36, y: 74 }, answer: "CRUSHED NECK" },
  ];

  if (!context) {
    return consistent_nodes;
  }

  // ids here are the slugs for the puzzles
  const puzzle_nodes: INode[] = [
    { id: "whaling-ships", x: 47, y: 77 },
    { id: "mr-cat", x: 21, y: 15 },
    { id: "penny-puzz", x: 19, y: 39 },
    { id: "birbs-at-brown", x: 54, y: 73 },
  ];

  const answered_puzzle_nodes: NodeAnswer[] = [];
  for (const node of puzzle_nodes) {
    if (context.team_context.solves[node.id]) {
      answered_puzzle_nodes.push({
        node: node,
        answer: context.team_context.solves[node.id].submitted_answer,
      });
    }
  }

  return [...consistent_nodes, ...answered_puzzle_nodes];
};
