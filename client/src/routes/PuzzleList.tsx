import CaseVoting from "@/components/websockets/CaseVoting";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { SetStateAction, useState } from "react";

export default function PuzzleList() {
  const { context } = useDjangoContext();
  const [curTab, setTab] = useState("colored-thread"); // Default tab

  const handleTabChange = (tab: SetStateAction<string>) => {
    setTab(tab);
  };

  return (
    <div>
      <CaseVoting path="ws/puzzles" />
      <div className="tabs flex items-center justify-end gap-4 mx-[10%] md:mx-[25%] pr-10 z-10 text-md sm:text-sm xs:text-xs">
        <button
          onClick={() => handleTabChange("colored-thread")}
          className={`select-none rounded-t-md transition-colors py-2 px-6 hover:text-white ${
            curTab === "colored-thread"
              ? "bg-[#957a62] text-white font-bold"
              : "bg-[#745a45] text-[#ffffffb8]"
          }`}
        >
          Colored Thread
        </button>
        <button
          onClick={() => handleTabChange("social-deduction")}
          className={`select-none rounded-t-md transition-colors py-2 px-6 hover:text-white ${
            curTab === "social-deduction"
              ? "bg-[#957a62] text-white font-bold"
              : "bg-[#745a45] text-[#ffffffb8]"
          }`}
        >
          Social Deduction
        </button>
        <button
          onClick={() => handleTabChange("data")}
          className={`select-none rounded-t-md transition-colors py-2 px-6 hover:text-white ${
            curTab === "data"
              ? "bg-[#957a62] text-white font-bold"
              : "bg-[#745a45] text-[#ffffffb8]"
          }`}
        >
          Data
        </button>
      </div>
      {context?.team_context && (
        <div className="text-left dark bg-gradient-to-b from-[#b3957c] to-[#a28369] pb-2 pt-2 no-underline outline-none focus:shadow-md border-4 border-[#957a62] rounded-xl relative mx-[10%] md:mx-[25%]">
          <div className="contact-content custom-scroll h-full max-h-[65dvh] overflow-y-auto">
            <ul className="ml-4">
              {Object.entries(context.team_context.unlocks[curTab]).map(([round, puzzles]) => (
                <li key={round} className="text-[black]">
                  <a href={`/minorcase/${round}`} className="underline">
                    {round}
                  </a>
                  <ul className="ml-4">
                    {Object.entries(puzzles).map(([slug, puzzle]) => (
                      <li key={slug}>
                        <div className="team-box px-6 pt-3 pb-3 flex justify-between items-center space-x-4 text-slate-800">
                          <div className="flex items-center space-x-4">
                            <a
                              href={`/puzzle/${puzzle.slug}`}
                              className={`text-md underline ${puzzle.is_meta ? "font-bold" : ""}`}
                            >
                              {puzzle.name.toUpperCase()}
                            </a>
                          </div>
                          <span className="pl-3 font-mono text-[#98ff98] font-bold">
                            {puzzle.round.major_case.slug in context.team_context.solves_by_case &&
                            puzzle.round.slug in
                              context.team_context.solves_by_case[puzzle.round.major_case.slug] &&
                            puzzle.slug in
                              context.team_context.solves_by_case[puzzle.round.major_case.slug][
                                puzzle.round.slug
                              ]
                              ? context.team_context.solves_by_case[puzzle.round.major_case.slug][
                                  puzzle.round.slug
                                ][puzzle.slug].submitted_answer.toUpperCase()
                              : ""}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
