import { useEffect, useMemo, useState } from "react";

import MarkdownWrapper from "@/components/markdown/MarkdownWrapper";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { toPuzzleStyle } from "@/utils/constants";
import { Puzzle } from "@/utils/django_types";

function PuzzlePage() {
  const [puzzle, setPuzzle] = useState({} as Puzzle);

  const { FetchPuzzle } = useDjangoContext();

  const puzzle_slug = useMemo(() => {
    return window.location.pathname.split("/").pop() || "";
  }, []);

  useEffect(() => {
    FetchPuzzle(puzzle_slug).then((puzzle) => {
      console.log("current puzzle:", puzzle);
      setPuzzle(puzzle);
    });
  }, [FetchPuzzle, puzzle_slug]);

  return (
    <div className="puzzle-page">
      <p>Using style for MC {puzzle?.round?.major_case.slug}</p>
      <MarkdownWrapper
        markdown={puzzle.body}
        puzzleStyle={toPuzzleStyle(puzzle?.round?.major_case.slug)}
      />
    </div>
  );
}

export default PuzzlePage;
