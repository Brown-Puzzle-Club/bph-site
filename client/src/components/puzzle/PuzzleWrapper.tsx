import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import MarkdownWrapper from "@/components/puzzle/MarkdownWrapper";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { Error404 } from "@/routes/ErrorPage";
import AltPuzzleRoute, { ALT_PUZZLE_ROUTES } from "@/routes/minor_cases/AltPuzzleRoute";
import type { MajorCaseEnum } from "@/utils/constants";
import { toPuzzleStyle } from "@/utils/constants";
import type { Puzzle } from "@/utils/django_types";

import { Button } from "../ui/button";
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

  const ADMIN_REMOTE_VISIBLE = useMemo(() => {
    // if the body_remote exists in the fetch, this means that the user has admin access. This saves a query :P
    return puzzle.body_remote && puzzle.body_remote != "";
  }, [puzzle]);

  const ADMIN_SOLUTION_VISIBLE = useMemo(() => {
    return puzzle.solution && puzzle.solution != "";
  }, [puzzle]);

  const clipboard_content = useMemo(() => {
    return puzzle.body_remote && puzzle.body_remote != "" && puzzleContent == puzzle.body_remote
      ? puzzle.clipboard_remote
      : puzzle.clipboard;
  }, [puzzle, puzzleContent]);

  if (errorPage) {
    window.location.href = "/eventpage";
    return <Error404 />;
  }

  return (
    <div className="puzzle-page">
      <div>
        {ADMIN_REMOTE_VISIBLE && (
          <>
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
          </>
        )}
        {ADMIN_SOLUTION_VISIBLE && (
          <button
            className="p-2 m-2 bg-slate-600 hover:bg-slate-800 text-white"
            onClick={() => setPuzzleContent(puzzle.solution)}
          >
            Solution
          </button>
        )}
      </div>

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
        <div className="flex flex-col items-center">
          <MarkdownWrapper
            markdown={puzzleContent}
            puzzleStyle={toPuzzleStyle(puzzle?.round?.major_case.slug)}
          />
          {clipboard_content && (
            <Button
              className="py-4 transition cursor-context-menu hover:bg-[white] hover:text-black"
              onClick={() => {
                navigator.clipboard.writeText(clipboard_content);
                toast.success("Copied to clipboard");
              }}
            >
              copy to clipboard
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default PuzzleWrapper;
