import { useEffect, useMemo, useState } from "react";

import MarkdownWrapper from "@/components/puzzle/MarkdownWrapper";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { Error404 } from "@/routes/ErrorPage";
import AltPuzzleRoute, { ALT_PUZZLE_ROUTES } from "@/routes/minor_cases/AltPuzzleRoute";
import type { MajorCaseEnum } from "@/utils/constants";
import { toPuzzleStyle } from "@/utils/constants";
import type { Puzzle } from "@/utils/django_types";

import AnswerSubmit from "./AnswerSubmission";

const NO_ANSWER_SUBMIT = new Set(["wordle", "connection", "lettertroxd"]);

function PuzzleWrapper({ puzzle_slug }: { puzzle_slug: string }) {
  const [puzzle, setPuzzle] = useState<Puzzle>({} as Puzzle);

  const [puzzleContent, setPuzzleContent] = useState("");

  const [errorPage, setErrorPage] = useState(false);

  const { FetchPuzzle } = useDjangoContext();

  useEffect(() => {
    if (puzzle == null || puzzle.body == null) {
      FetchPuzzle(puzzle_slug).then((puzzle) => {
        if (puzzle.name) {
          setPuzzle(puzzle);
          console.log(puzzle);
          setPuzzleContent(puzzle.body);
        } else {
          console.error("Puzzle not found");
          setErrorPage(true);
        }
      });
    }
  }, [puzzle, FetchPuzzle, puzzle_slug]);

  const ADMIN_BYPASS = useMemo(() => {
    // if the body_remote exists in the fetch, this means that the user has admin access. This saves a query :P
    return puzzle.body_remote && puzzle.body_remote != "";
  }, [puzzle]);

  return (
    (errorPage && <Error404 />) || (
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
        {!NO_ANSWER_SUBMIT.has(puzzle?.slug) ? (
          <AnswerSubmit
            puzzle={puzzle}
            major_case={puzzle?.round?.major_case.slug as MajorCaseEnum}
          />
        ) : (
          <p className="text-center py-4">Completion of the game will solve this puzzle</p>
        )}
        {ALT_PUZZLE_ROUTES(puzzle)[puzzle_slug] ? (
          <AltPuzzleRoute puzzle={puzzle} />
        ) : (
          <MarkdownWrapper
            markdown={puzzleContent}
            puzzleStyle={toPuzzleStyle(puzzle?.round?.major_case.slug)}
          />
        )}
      </div>
    )
  );
}

export default PuzzleWrapper;
