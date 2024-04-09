import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";

import CasePageArt from "@/components/minor_cases/CasePageArt";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { useTheme } from "@/hooks/useTheme";
import { IS_MINOR_CASE_UNLOCKED } from "@/utils/auth";
import type { MajorCaseEnum } from "@/utils/constants";
import { CASE_PALETTE } from "@/utils/constants";
import { DEFAULT_THEME } from "@/utils/themes";
import type { PuzzleAnswer } from "@/utils/utils";
import { getUnlockedPuzzles } from "@/utils/utils";

import { Error404 } from "./ErrorPage";

function MinorCasePage() {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(DEFAULT_THEME);
  }, [setTheme]);

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

  console.log(MAJOR_CASE_SLUG);

  const unlocked_puzzles: PuzzleAnswer[] | null = useMemo(() => {
    if (!MAJOR_CASE_SLUG || !MINOR_CASE_SLUG || !context?.team_context) {
      return null;
    }

    return getUnlockedPuzzles(MAJOR_CASE_SLUG, MINOR_CASE_SLUG, context);
  }, [MAJOR_CASE_SLUG, MINOR_CASE_SLUG, context]);

  if (!context?.team_context) {
    return <BeatLoader className="justify-center content-center p-4" color={"#fff"} size={12} />;
  }

  if (!MINOR_CASE_SLUG || !IS_MINOR_CASE_UNLOCKED(MINOR_CASE_SLUG)(context)) {
    return <Error404 />;
  }

  return (
    <div>
      <CasePageArt case_slug={MINOR_CASE_SLUG} />
      {context && context.team_context.unlocks && (
        <section className="minorcase-info">
          <div
            className="text-left dark pb-2 pt-2 no-underline outline-none focus:shadow-md border-4 rounded-xl relative mx-[10%] md:mx-[25%] my-8"
            style={{
              borderColor: CASE_PALETTE[MAJOR_CASE_SLUG as MajorCaseEnum].primary,
              backgroundImage: `linear-gradient(to bottom, ${CASE_PALETTE[MAJOR_CASE_SLUG as MajorCaseEnum].backgroundStart}, ${CASE_PALETTE[MAJOR_CASE_SLUG as MajorCaseEnum].backgroundEnd})`,
            }}
          >
            <div className="contact-content custom-scroll h-full max-h-[65dvh] overflow-y-auto">
              {unlocked_puzzles?.map((puzzle_answer, index, array) => (
                <div
                  key={puzzle_answer.puzzle.slug}
                  className={`team-box px-6 pt-3 pb-3 flex justify-between items-center space-x-4 text-slate-800`}
                  style={
                    index !== array.length - 1
                      ? {
                          borderBottomColor: CASE_PALETTE[MAJOR_CASE_SLUG as MajorCaseEnum].primary,
                          borderBottomWidth: "4px",
                        }
                      : {}
                  }
                >
                  <div className="flex items-center space-x-4">
                    <span
                      className="text-xl font-bold w-9"
                      style={{
                        color: CASE_PALETTE[MAJOR_CASE_SLUG as MajorCaseEnum].textColor,
                      }}
                    >
                      {index + 1}
                    </span>
                    <Link
                      className={`text-md underline ${puzzle_answer.puzzle.is_meta ? "font-bold" : ""}`}
                      to={`/puzzle/${puzzle_answer.puzzle.slug}`}
                      style={{ color: CASE_PALETTE[MAJOR_CASE_SLUG as MajorCaseEnum].textColor }}
                    >
                      {puzzle_answer.puzzle.name.toUpperCase()}
                    </Link>
                  </div>
                  <span
                    className="pl-3 font-mono font-bold"
                    style={{ color: CASE_PALETTE[MAJOR_CASE_SLUG as MajorCaseEnum].answerColor }}
                  >
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
