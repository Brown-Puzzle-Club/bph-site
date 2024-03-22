import { useEffect, useMemo, useState } from "react";

import MarkdownWrapper from "@/components/puzzle/MarkdownWrapper";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import AltPuzzleRoute, { ALT_PUZZLE_ROUTES } from "@/routes/minor_cases/AltPuzzleRoute";
import { MajorCaseEnum, toPuzzleStyle } from "@/utils/constants";
import { DjangoContext, Puzzle } from "@/utils/django_types";
import AnswerSubmit from "./AnswerSubmission";

function PuzzleWrapper({ puzzle_slug }: { puzzle_slug: string }) {
  const [puzzle, setPuzzle] = useState({} as Puzzle);
  const [context, setContext] = useState({} as DjangoContext);

  const [puzzleContent, setPuzzleContent] = useState("");

  const { FetchPuzzle, FetchContext } = useDjangoContext();

  useEffect(() => {
    if (puzzle == null) {
      FetchPuzzle(puzzle_slug).then((puzzle) => {
        setPuzzle(puzzle);
        console.log(puzzle);
        setPuzzleContent(puzzle.body);
      });
    }
  }, [puzzle, FetchPuzzle, puzzle_slug]);

  useEffect(() => {
    console.log(context);
    if (context == null || context.team_context == null) {
      FetchContext().then((context) => {
        setContext(context);
        console.log(context);
      });
    }
  }, [context, FetchContext]);

  const ADMIN_BYPASS = useMemo(() => {
    // if the body_remote exists in the fetch, this means that the user has admin access. This saves a query :P
    return puzzle.body_remote && puzzle.body_remote != "";
  }, [puzzle]);

  return (
    <div className="puzzle-page">
      {ADMIN_BYPASS && (
        <div>
          <button
            className="p-2 m-2 bg-slate-600 hover:bg-slate-800 text-white"
            onClick={() => setPuzzleContent(puzzle.body)}
          >
            Body
          </button>
          <button
            className="p-2 m-2 bg-slate-600 hover:bg-slate-800 text-white"
            onClick={() => setPuzzleContent(puzzle.body_remote)}
          >
            Body Remote
          </button>
        </div>
      )}
      <AnswerSubmit puzzle={puzzle} major_case={puzzle?.round?.major_case.slug as MajorCaseEnum} />
      {ALT_PUZZLE_ROUTES({ puzzle, context })[puzzle_slug] ? (
        <AltPuzzleRoute puzzle={puzzle} context={context} />
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
