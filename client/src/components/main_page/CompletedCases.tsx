import { useDjangoContext } from "@/hooks/useDjangoContext";
import { MAJOR_CASE_FOLDER, MajorCaseEnum } from "@/utils/constants";
import { DjangoContext } from "@/utils/django_types";
import { useMemo } from "react";
import { RAND_ROT } from "../MinorCaseFolder";

const mostRecentSolves = (context: DjangoContext, n: number = 3) => {
  const solved_cases = context.team_context.minor_case_completed;
  // sort by completed_datetime
  solved_cases.sort((a, b) => {
    return new Date(b.completed_datetime).getTime() - new Date(a.completed_datetime).getTime();
  });
  return solved_cases.slice(0, n);
};

export default function CompletedCases() {
  const { context } = useDjangoContext();

  const folder_cases = useMemo(() => {
    if (!context) return [];
    return mostRecentSolves(context);
  }, [context]);

  if (!context || !context.team_context.current_incoming_event) return null;

  return (
    <a className="absolute hover:cursor-pointer hover:drop-shadow-[0_12px_12px_rgba(255,196,100,0.5)] w-full">
      <span
        className="z-10 absolute font-mono font-bold text-black text-center whitespace-pre-line break-words text-[2vw] bg-[#ffffff82] rounded"
        style={{
          top: "20%",
          left: "50%",
          transform: "translate(-50%, 50%)",
        }}
      >
        COMPLETED CASES
      </span>
      {folder_cases.map((mc_completed) => (
        <img
          className="absolute shadow-lg"
          src={MAJOR_CASE_FOLDER[mc_completed.minor_case_round.major_case.slug as MajorCaseEnum]}
          style={{
            transform: `rotate(${RAND_ROT(40)}deg)`,
          }}
        />
      ))}
    </a>
  );
}
