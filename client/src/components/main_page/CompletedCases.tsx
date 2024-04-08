import type { MinorCaseCompleted, Round } from "@/utils/django_types";

import Cases from "./Cases";

export default function CompletedCases({
  completed_cases,
  solvedCasesOpen,
  setSelectedCase,
}: {
  completed_cases: MinorCaseCompleted[];
  solvedCasesOpen: boolean;
  setSelectedCase: (round: Round) => void;
}) {
  return (
    completed_cases &&
    solvedCasesOpen && (
      <div className="flex flex-col items-center">
        <span className="font-bold text-[2vw] text-center mb-4 bg-slate-800 rounded-xl">
          COMPLETED CASES
        </span>

        <div className="flex flex-wrap overflow-y-auto max-h-[20vw] p-4 space-x-3 space-y-3 rounded-xl bg-[#09090947]">
          <Cases casesRecord={completed_cases} setSelectedCase={setSelectedCase} />
        </div>
      </div>
    )
  );
}
