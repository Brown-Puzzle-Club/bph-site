import type { Puzzle } from "@/utils/django_types";

import IllicitAffairsPano from "./exile/IllicitAffairsPano";
import LabyrinthBook from "./labyrinth/LabyrinthBook";
import LockboxIframe from "./lockbox/LockboxIframe";
import Connections from "./nyt-games/Connections";
import LetterBoxedPuzzle from "./nyt-games/LetterBoxed";
import Obituary from "./nyt-games/Obituary";
import Wordle from "./nyt-games/Wordle";

// import PennyPDF from "./penny/PennyPDF";

export function ALT_PUZZLE_ROUTES(): {
  [key: string]: JSX.Element;
} {
  // if any puzzle has no markdown, it will attempt to route using this
  // puzzle_slug -> JSX.Element
  return {
    lettertroxd: <LetterBoxedPuzzle />,
    connection: <Connections />,
    wordle: <Wordle />,
    obituary: <Obituary />,
    "labyrinth-puzz": <LabyrinthBook />,
    "illicit-affairs": <IllicitAffairsPano />,
    lockbox: <LockboxIframe />,
    // "penny-puzz": <PennyPDF />,
  };
}

export default function AltPuzzleRoute({ puzzle }: { puzzle: Puzzle }) {
  return <div className="puzzle-content">{ALT_PUZZLE_ROUTES()[puzzle.slug]}</div>;
}
