import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

import MarkdownWrapper from "@/components/puzzle/MarkdownWrapper";
import { usePuzzle } from "@/hooks/useDjangoContext";
import { Error404 } from "@/routes/ErrorPage";
import AltPuzzleRoute, { ALT_PUZZLE_ROUTES } from "@/routes/minor_cases/AltPuzzleRoute";
import useBPHStore, { BOTTOM_LEFT } from "@/stores/useBPHStore";
import { getMinorCaseIdleDialogue } from "@/utils/bluenoir_dialogue";
import type { MajorCaseEnum } from "@/utils/constants";
import { toPuzzleStyle } from "@/utils/constants";
import type { Erratum } from "@/utils/django_types";
import { cn } from "@/utils/utils";

import BackButton from "../BackButton";
import { Button } from "../ui/button";
import AnswerSubmit from "./AnswerSubmission";

const Errata = ({ errata }: { errata: Erratum[] }) => {
  if (!errata || errata.length == 0) {
    return null;
  }
  return (
    <div className="flex justify-center h-full my-5 border border-slate-500 rounded lg:mx-[35vw] md:mx-[25vw] mx-[15vw] max-h-[12rem] ">
      <div className="w-full">
        <h3 className="text-center text-white dark border-b font-bold">ERRATA</h3>
        <div className="max-h-[10rem] overflow-auto">
          <table className="table-auto w-full">
            <tbody>
              {errata.map((erratum, i) => (
                <tr key={`erratum-${i}`}>
                  <td className="border-b border-slate-500 px-4 py-2 text-left">
                    {erratum.updates_text}
                  </td>
                  <td
                    className={cn(
                      "border-b border-slate-500 px-4 py-2 font-mono text-xs text-right",
                    )}
                  >
                    {new Date(erratum.timestamp).toLocaleString("en-US")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const NO_ANSWER_SUBMIT = new Set(["wordle", "connection", "lettertroxd"]);

function PuzzleWrapper({ puzzle_slug }: { puzzle_slug: string }) {
  const { data: puzzle, isError } = usePuzzle(puzzle_slug);
  const setPosition = useBPHStore((state) => state.setBluenoirPosition);
  const [puzzleContent, setPuzzleContent] = useState(puzzle?.body);
  const setBluenoirDialogue = useBPHStore((state) => state.setRandomDialogueFunction);

  useEffect(() => {
    setPuzzleContent(puzzle?.body);
  }, [puzzle]);

  useEffect(() => {
    setPosition(BOTTOM_LEFT);
  });

  useEffect(() => {
    setBluenoirDialogue(() => {
      return getMinorCaseIdleDialogue(puzzle_slug);
    });
  });

  const navigate = useNavigate();

  const ADMIN_REMOTE_VISIBLE = useMemo(() => {
    // if the body_remote exists in the fetch, this means that the user has admin access. This saves a query :P
    return puzzle?.body_remote && puzzle.body_remote != "";
  }, [puzzle]);

  const ADMIN_SOLUTION_VISIBLE = useMemo(() => {
    return puzzle?.solution && puzzle.solution != "";
  }, [puzzle]);

  const clipboard_content = useMemo(() => {
    return puzzle?.body_remote && puzzle.body_remote != "" && puzzleContent == puzzle.body_remote
      ? puzzle.clipboard_remote
      : puzzle?.clipboard;
  }, [puzzle, puzzleContent]);

  if (isError) {
    navigate("/eventpage");
    return <Error404 />;
  }

  if (!puzzle) {
    return <BeatLoader className="justify-center content-center p-4" color={"#fff"} size={12} />;
  }

  return (
    <div className="puzzle-page">
      <BackButton to={`/minorcase/${puzzle.round.slug}`} />
      <div>
        {ADMIN_REMOTE_VISIBLE && (
          <>
            <button
              className="p-2 m-2 bg-slate-600 hover:bg-slate-800 text-white"
              onClick={() => setPuzzleContent(puzzle?.body)}
            >
              Body
            </button>
            <button
              className="p-2 m-2 bg-slate-600 hover:bg-slate-800 text-white"
              onClick={() => setPuzzleContent(puzzle?.body_remote)}
            >
              Body Remote
            </button>
          </>
        )}
        {ADMIN_SOLUTION_VISIBLE && (
          <button
            className="p-2 m-2 bg-slate-600 hover:bg-slate-800 text-white"
            onClick={() => setPuzzleContent(puzzle?.solution)}
          >
            Solution
          </button>
        )}
      </div>
      {!NO_ANSWER_SUBMIT.has(puzzle.slug) ? (
        <AnswerSubmit
          puzzle={puzzle}
          major_case={puzzle?.round?.major_case.slug as MajorCaseEnum}
        />
      ) : (
        <p className="text-center py-4">Completion of the game will solve this puzzle</p>
      )}
      <Errata errata={puzzle.errata} />
      {ALT_PUZZLE_ROUTES()[puzzle_slug] ? (
        <AltPuzzleRoute puzzle={puzzle} />
      ) : (
        <div className="flex flex-col items-center">
          <MarkdownWrapper
            markdown={puzzleContent || ""}
            puzzleStyle={toPuzzleStyle(puzzle.round.major_case.slug)}
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
