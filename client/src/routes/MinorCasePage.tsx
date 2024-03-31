import { IS_MINOR_CASE_UNLOCKED } from "@/components/LockedContent";
import CasePageArt from "@/components/minor_cases/CasePageArt";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { PuzzleAnswer, getUnlockedPuzzles } from "@/utils/utils";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { Error404 } from "./ErrorPage";

function MinorCasePage() {
  const MINOR_CASE_SLUG = window.location.pathname.split("/").pop();
  const { context } = useDjangoContext();

  const MAJOR_CASE_SLUG = useMemo(() => {
    // return the unlocks slug that contains the minor case MINOR_CASE_SLUG
    if (!context?.team_context || !MINOR_CASE_SLUG) {
      return null;
    }

    for (const [major_case, rounds] of Object.entries(context.team_context.unlocks)) {
      if (rounds[MINOR_CASE_SLUG]) {
        return major_case;
      }
    }
  }, [MINOR_CASE_SLUG, context?.team_context]);

  const unlocked_puzzles: PuzzleAnswer[] | null = useMemo(() => {
    if (!MAJOR_CASE_SLUG || !MINOR_CASE_SLUG || !context?.team_context) {
      return null;
    }

    return getUnlockedPuzzles(MAJOR_CASE_SLUG, MINOR_CASE_SLUG, context);
  }, [MAJOR_CASE_SLUG, MINOR_CASE_SLUG, context]);

  if (!context?.team_context) {
    return <BeatLoader className="justify-center content-center p-4" color={"#fff"} size={12} />;
  }

  if (!MINOR_CASE_SLUG || IS_MINOR_CASE_UNLOCKED(MINOR_CASE_SLUG)(context) === false) {
    return <Error404 />;
  }

  return (
    <div>
      <CasePageArt case_slug={MINOR_CASE_SLUG} />
      {context && context.team_context.unlocks && (
        <section className="minorcase-info">
          <div className="text-left dark bg-gradient-to-b from-[#b3957c] to-[#a28369] pb-2 pt-2 no-underline outline-none focus:shadow-md border-4 border-[#957a62] rounded-xl relative mx-[10%] md:mx-[25%] my-8">
            <div className="contact-content custom-scroll h-full max-h-[65dvh] overflow-y-auto">
              {unlocked_puzzles?.map((puzzle_answer, index, array) => (
                <div
                  key={puzzle_answer.puzzle.slug}
                  className={`team-box px-6 pt-3 pb-3 flex justify-between items-center space-x-4 text-slate-800 ${index !== array.length - 1 ? "border-b-4 border-[#957a62]" : ""}`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold w-9 text-[#392f27]">{index + 1}</span>
                    <Link
                      className={`text-md underline ${puzzle_answer.puzzle.is_meta ? "font-bold" : ""}`}
                      to={`/puzzle/${puzzle_answer.puzzle.slug}`}
                    >
                      {puzzle_answer.puzzle.name.toUpperCase()}
                    </Link>
                  </div>
                  <span className="pl-3 font-mono text-[#98ff98] font-bold">
                    {puzzle_answer.answer}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default MinorCasePage;
