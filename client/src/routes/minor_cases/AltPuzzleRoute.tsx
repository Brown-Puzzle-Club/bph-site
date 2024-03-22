import { PuzzleParams } from "@/utils/interface";
import AlexGame from "./red-thread/AlexGame";

export function ALT_PUZZLE_ROUTES(params: PuzzleParams): {
  [key: string]: JSX.Element;
} {
  // if any puzzle has no markdown, it will attempt to route using this
  // puzzle_slug -> JSX.Element
  return {
    "alex-game": <AlexGame {...params} />,
  };
}

export default function AltPuzzleRoute({ puzzle, context }: PuzzleParams) {
  return <div>{ALT_PUZZLE_ROUTES({ puzzle, context })[puzzle.slug]}</div>;
}
