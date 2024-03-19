import { useEffect, useMemo, useState } from "react";

import MarkdownWrapper from "@/components/puzzle/MarkdownWrapper";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import AltPuzzleRoute, { ALT_PUZZLE_ROUTES } from "@/routes/minor_cases/AltPuzzleRoute";
import { toPuzzleStyle } from "@/utils/constants";
import { Puzzle } from "@/utils/django_types";

function PuzzleWrapper({ puzzle_slug }: { puzzle_slug: string }) {
  const [puzzle, setPuzzle] = useState({} as Puzzle);
  
  const [puzzleContent, setPuzzleContent] = useState("");

  const { FetchPuzzle } = useDjangoContext();

  useEffect(() => {
    FetchPuzzle(puzzle_slug).then((puzzle) => {
      setPuzzle(puzzle);
      console.log(puzzle);
      setPuzzleContent(puzzle.body);
    });
  }, [FetchPuzzle, puzzle_slug]);

  const ADMIN_BYPASS = useMemo(() => {
    // if the body_remote exists in the fetch, this means that the user has admin access. This saves a query :P
    return puzzle.body_remote && puzzle.body_remote != "";
  }, [puzzle]);

  return (
    <div className="puzzle-page">
      {ADMIN_BYPASS && (
        <div>
          <button className="p-2 m-2 bg-slate-600 hover:bg-slate-800 text-white" onClick={() => setPuzzleContent(puzzle.body)}>Body</button>
          <button className="p-2 m-2 bg-slate-600 hover:bg-slate-800 text-white" onClick={() => setPuzzleContent(puzzle.body_remote)}>Body Remote</button>
        </div>
      )}
      {ALT_PUZZLE_ROUTES[puzzle_slug] ? (
        <AltPuzzleRoute puzzle_slug={puzzle_slug} />
      ) : (
        <MarkdownWrapper
          markdown={puzzleContent}
          puzzleStyle={toPuzzleStyle(puzzle?.round?.major_case.slug)}
        />
      )}
    </div>
  );
}

export default PuzzleWrapper;
