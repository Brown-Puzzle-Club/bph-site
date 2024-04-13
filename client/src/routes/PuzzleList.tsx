import { useLocalStorage } from "@uidotdev/usehooks";
import type { SetStateAction } from "react";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import { useDjangoContext } from "@/hooks/useDjangoContext";
import { useTheme } from "@/hooks/useTheme";
import { CASE_PALETTE, MAJOR_CASE_NAMES, MajorCaseEnum } from "@/utils/constants";
import { DEFAULT_THEME } from "@/utils/themes";
import { getMinorCases } from "@/utils/utils";

export default function PuzzleList() {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(DEFAULT_THEME);
  });

  const { data: context } = useDjangoContext();
  const [curTab, setTab] = useLocalStorage<MajorCaseEnum>(
    "puzzles-tab",
    MajorCaseEnum.COLORED_THREAD,
  );

  console.log(curTab);

  const handleTabChange = (tab: SetStateAction<string>) => {
    setTab(tab as MajorCaseEnum);
  };

  // round_slug -> (round: Round, answer: string)
  const minor_cases = useMemo(() => {
    if (!context) return null;
    return getMinorCases(context);
  }, [context]);

  return (
    <div>
      {context?.team_context && context.team_context.unlocks && minor_cases && (
        <>
          <div className="tabs flex items-center justify-end gap-4 mx-[12%] md:mx-[26%] pr-2 md:pr-10 z-10 text-[1.45vw] md:text-[1vw] sm:text-sm pt-6">
            {Object.keys(CASE_PALETTE).map(
              (tab) =>
                context.team_context.unlocks[tab] && (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`select-none rounded-t-md transition-colors py-2 px-6 hover:text-white`}
                    style={
                      curTab === tab
                        ? {
                            backgroundColor: CASE_PALETTE[tab].primary,
                            color: "white",
                            fontWeight: "bold",
                          }
                        : {
                            backgroundColor: CASE_PALETTE[tab as MajorCaseEnum].secondary,
                          }
                    }
                  >
                    {MAJOR_CASE_NAMES[tab as MajorCaseEnum]}
                  </button>
                ),
            )}
          </div>
          <div
            className={`text-left dark pb-2 pt-2 no-underline outline-none focus:shadow-md border-4 rounded-xl relative mx-[10%] md:mx-[25%]`}
            style={{
              borderColor: CASE_PALETTE[curTab].primary,
              backgroundImage: `linear-gradient(to bottom, ${CASE_PALETTE[curTab].backgroundStart}, ${CASE_PALETTE[curTab].backgroundEnd})`,
            }}
          >
            <div className="custom-scroll h-full max-h-[65dvh] overflow-y-auto">
              {context.team_context.major_case_puzzles[curTab] && (
                <div
                  className="majorcase-puzzle text-center font-bold text-black font-serif pb-2"
                  style={{
                    borderBottomColor: CASE_PALETTE[curTab].primary,
                    borderBottomWidth: "8px",
                  }}
                >
                  <Link to={`/majorcase/${curTab}`} className="underline text-2xl">
                    The Case of {context.team_context.major_case_unlocks[curTab].name}
                  </Link>
                  {context.team_context.solves[curTab] && (
                    <p
                      className="font-mono pt-1"
                      style={{
                        color: CASE_PALETTE[curTab].answerColor,
                      }}
                    >
                      {context.team_context.solves[curTab].submitted_answer}
                    </p>
                  )}
                </div>
              )}
              <ul className="ml-4">
                {context.team_context.unlocks[curTab] &&
                  Object.entries(context.team_context.unlocks[curTab]).map(
                    ([round], index, array) => (
                      <li
                        key={round}
                        className={`text-[black] px-6 pt-3 pb-3 flex justify-between items-center space-x-4 text-slate-800`}
                        style={
                          index !== array.length - 1
                            ? {
                                borderBottomColor: CASE_PALETTE[curTab].primary,
                                borderBottomWidth: "4px",
                              }
                            : {}
                        }
                      >
                        <div className={`flex justify-between items-center`}>
                          <Link
                            to={`/minorcase/${round}`}
                            className="underline text-center text-xl font-extrabold tracking-wider"
                            style={{ color: CASE_PALETTE[curTab].textColor }}
                          >
                            {minor_cases[round] && minor_cases[round].minor_case.name}
                          </Link>
                        </div>
                        {/* ANSWER */}
                        <span
                          className="pl-3 font-mono font-bold text-right"
                          style={{ color: CASE_PALETTE[curTab].answerColor }}
                        >
                          {minor_cases[round].answer?.toUpperCase()}
                        </span>
                      </li>
                    ),
                  )}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
