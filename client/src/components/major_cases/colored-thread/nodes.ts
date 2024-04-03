import { DjangoContext } from "@/utils/django_types";
import { INode, NodeAnswer } from "./board_types";

export const collectNodes = ({ context }: { context: DjangoContext }) => {
  // TODO: fix coordinates
  const consistent_nodes: NodeAnswer[] = [
    { node: { id: "wasting-illness", x: 60.2, y: 12 }, answer: "WASTING ILLNESS" },
    { node: { id: "trampled", x: 62.75, y: 39 }, answer: "TRAMPLED" },
    { node: { id: "ennui", x: 41, y: 57 }, answer: "ENNUI" },
    { node: { id: "internal-lacerations", x: 37.75, y: 63 }, answer: "INTERNAL LACERATIONS" },
    { node: { id: "shot-out-of-cannon", x: 47.2, y: 73 }, answer: "SHOT OUT OF CANNON" },
    { node: { id: "forced-regeneration", x: 54.25, y: 58 }, answer: "FORCED REGENERATION" },
    { node: { id: "crushed-neck", x: 57, y: 62.5 }, answer: "CRUSHED NECK" },
  ];

  if (!context) {
    return consistent_nodes;
  }

  // ids here are the slugs for the puzzles
  const puzzle_nodes: INode[] = [
    { id: "whaling-ships", x: 33, y: 13 },
    { id: "mr-cat", x: 32, y: 38 },
    { id: "birbs-at-brown", x: 41, y: 57 },
    { id: "penny-puzz", x: 54.25, y: 58 },
  ];

  const answered_puzzle_nodes: NodeAnswer[] = [];
  for (const node of puzzle_nodes) {
    const answer = context.team_context.solves[node.id].submitted_answer;
    if (answer) {
      answered_puzzle_nodes.push({ node, answer });
    }
  }

  return [...consistent_nodes, ...answered_puzzle_nodes];
};
