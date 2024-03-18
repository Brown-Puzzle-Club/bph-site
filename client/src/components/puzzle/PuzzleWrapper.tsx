import { useEffect, useState } from "react";

import MarkdownWrapper from "@/components/puzzle/MarkdownWrapper";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import AltPuzzleRoute, { ALT_PUZZLE_ROUTES } from "@/routes/minor_cases/AltPuzzleRoute";
import { toPuzzleStyle } from "@/utils/constants";
import { Puzzle } from "@/utils/django_types";

function PuzzleWrapper({ puzzle_slug }: { puzzle_slug: string }) {
  const [puzzle, setPuzzle] = useState({} as Puzzle);

  const { FetchPuzzle } = useDjangoContext();

  useEffect(() => {
    FetchPuzzle(puzzle_slug).then((puzzle) => {
      setPuzzle(puzzle);
    });
  }, [FetchPuzzle, puzzle_slug]);

  return (
    <div className="puzzle-page">
      <p>Using style for MC {puzzle?.round?.major_case.slug}</p>

      {/* IF ALT_PUZZLE_ROUTES contains the puzzle_slug, use the alterantive route, else markdown wrap the body content. */}
      {ALT_PUZZLE_ROUTES[puzzle_slug] ? (
        <AltPuzzleRoute puzzle_slug={puzzle_slug} />
      ) : (
        <MarkdownWrapper
          markdown={puzzle.body}
          puzzleStyle={toPuzzleStyle(puzzle?.round?.major_case.slug)}
        />
      )}
    </div>
  );
}

export default PuzzleWrapper;
