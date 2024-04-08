import { INode, NodeAnswer } from "./board_types";
import { DjangoContext } from "@/utils/django_types";
import { INode, NodeAnswer } from "./board_types";
import { DjangoContext } from "@/utils/django_types";

export const collectNodes = (context: DjangoContext) => {
  // TODO: fix coordinates
  const consistent_nodes: NodeAnswer[] = [
    { node: { id: "wasting-illness", x: 608, y: 90 }, answer: "WASTING ILLNESS" },
    { node: { id: "trampled", x: 550, y: 350 }, answer: "TRAMPLED" },
    { node: { id: "ennui", x: 415, y: 342 }, answer: "ENNUI" },
    { node: { id: "internal-lacerations", x: 478, y: 435 }, answer: "INTERNAL LACERATIONS" },
    { node: { id: "shot-out-of-cannon", x: 478, y: 435 }, answer: "SHOT OUT OF CANNON" },
    { node: { id: "forced-regeneration", x: 528, y: 420 }, answer: "FORCED REGENERATION" },
    { node: { id: "crushed-neck", x: 580, y: 378 }, answer: "CRUSHED NECK" },
  ];

  if (!context) {
    return consistent_nodes;
  }

  // ids here are the slugs for the puzzles
  const puzzle_nodes: INode[] = [
    { id: "whaling-ships", x: 632, y: 245 },
    { id: "mr-cat", x: 335, y: 95 },
    { id: "birbs-at-brown", x: 418, y: 420 },
    { id: "penny-puzz", x: 326, y: 235 },
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
