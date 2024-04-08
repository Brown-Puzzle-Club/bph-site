import Connections from "./nyt-games/Connections";
import LetterBoxedPuzzle from "./nyt-games/LetterBoxed";
import Obituary from "./nyt-games/Obituary";
import Wordle from "./nyt-games/Wordle";
import AlexGame from "./red-thread/AlexGame";
import { Puzzle } from "@/utils/django_types";
import Connections from "./nyt-games/Connections";
import LetterBoxedPuzzle from "./nyt-games/LetterBoxed";
import Obituary from "./nyt-games/Obituary";
import Wordle from "./nyt-games/Wordle";
import AlexGame from "./red-thread/AlexGame";
import { Puzzle } from "@/utils/django_types";

export function ALT_PUZZLE_ROUTES(puzzle: Puzzle): {
  [key: string]: JSX.Element;
} {
  // if any puzzle has no markdown, it will attempt to route using this
  // puzzle_slug -> JSX.Element
  return {
    "alex-game": <AlexGame puzzle={puzzle} />,
    lettertroxd: <LetterBoxedPuzzle />,
    connection: <Connections />,
    wordle: <Wordle />,
    obituary: <Obituary />,
  };
}

export default function AltPuzzleRoute({ puzzle }: { puzzle: Puzzle }) {
  return <div className="puzzle-content">{ALT_PUZZLE_ROUTES(puzzle)[puzzle.slug]}</div>;
}
