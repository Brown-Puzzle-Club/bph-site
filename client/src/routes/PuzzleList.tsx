import CaseVoting from "@/components/websockets/CaseVoting";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { CASE_PALETTE, MAJOR_CASE_NAMES, MajorCaseEnum } from "@/utils/constants";
import { SetStateAction, useState } from "react";

export default function PuzzleList() {
  const { context } = useDjangoContext();
  const [curTab, setTab] = useState<MajorCaseEnum>(MajorCaseEnum.COLORED_THREAD);

  const handleTabChange = (tab: SetStateAction<string>) => {
    setTab(tab as MajorCaseEnum);
  };

  return (
    <div>
      <CaseVoting path="ws/puzzles" />
      <div className="tabs flex items-center justify-end gap-4 mx-[12%] md:mx-[26%] pr-2 md:pr-10 z-10 text-[1.45vw] md:text-[1vw] sm:text-sm">
        {Object.keys(CASE_PALETTE).map((tab) => (
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
        ))}
      </div>
      {context?.team_context && context.team_context.unlocks && (
        <div
          className={`text-left dark pb-2 pt-2 no-underline outline-none focus:shadow-md border-4 rounded-xl relative mx-[10%] md:mx-[25%]`}
          style={{
            borderColor: CASE_PALETTE[curTab].primary,
            backgroundImage: `linear-gradient(to bottom, ${CASE_PALETTE[curTab].backgroundStart}, ${CASE_PALETTE[curTab].backgroundEnd})`,
          }}
        >
          <div className="custom-scroll h-full max-h-[65dvh] overflow-y-auto">
            <ul className="ml-4">
              {Object.entries(context.team_context.unlocks[curTab]).map(
                ([round, puzzles], index, array) => (
                  <li
                    key={round}
                    className={`text-[black] pt-3`}
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
                      <a
                        href={`/minorcase/${round}`}
                        className="underline text-center text-xl font-extrabold tracking-wider"
                        style={{ color: CASE_PALETTE[curTab].textColor }}
                      >
                        {context?.team_context.case_unlocks[round] &&
                          context?.team_context.case_unlocks[round].name}
                      </a>
                    </div>
                    <ul className="ml-4">
                      {puzzles &&
                        Object.entries(puzzles).map(([slug, puzzle], index, array) => (
                          <li key={slug}>
                            {/* PUZZLE TITLE */}
                            <div
                              className={`team-box px-6 pt-3 pb-3 flex justify-between items-center space-x-4 text-slate-800`}
                              style={
                                index !== array.length - 1
                                  ? {
                                      borderBottomColor: CASE_PALETTE[curTab].primary,
                                      borderBottomWidth: "1px",
                                    }
                                  : {}
                              }
                            >
                              <div className="flex items-center space-x-4">
                                <a
                                  href={`/puzzle/${puzzle.slug}`}
                                  className={`text-md underline ${puzzle.is_meta ? "font-bold" : ""}`}
                                  style={{ color: CASE_PALETTE[curTab].textColor }}
                                >
                                  {puzzle.name  }
                                </a>
                              </div>
                              {/* ANSWER */}
                              <span
                                className="pl-3 font-mono font-bold text-right"
                                style={{ color: CASE_PALETTE[curTab].answerColor }}
                              >
                                {puzzle.round.major_case.slug in
                                  context.team_context.solves_by_case &&
                                puzzle.round.slug in
                                  context.team_context.solves_by_case[
                                    puzzle.round.major_case.slug
                                  ] &&
                                puzzle.slug in
                                  context.team_context.solves_by_case[puzzle.round.major_case.slug][
                                    puzzle.round.slug
                                  ]
                                  ? context.team_context.solves_by_case[
                                      puzzle.round.major_case.slug
                                    ][puzzle.round.slug][puzzle.slug].submitted_answer.toUpperCase()
                                  : ""}
                              </span>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
