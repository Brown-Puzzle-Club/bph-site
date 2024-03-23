import { Puzzle } from "@/utils/django_types";
import AlexGame from "./red-thread/AlexGame";

export function ALT_PUZZLE_ROUTES(puzzle: Puzzle): {
  [key: string]: JSX.Element;
} {
  // if any puzzle has no markdown, it will attempt to route using this
  // puzzle_slug -> JSX.Element
  return {
    "alex-game": <AlexGame puzzle={puzzle} />,
  };
}

export default function AltPuzzleRoute({ puzzle }: { puzzle: Puzzle }) {
  return <div>{ALT_PUZZLE_ROUTES(puzzle)[puzzle.slug]}</div>;
}
