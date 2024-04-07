import { MinorCaseCompleted, Round } from "@/utils/django_types";
import Cases from "./Cases";

export default function CompletedCases({
  completed_cases,
  solvedCasesOpen,
  setSolvedCasesOpen,
  setSelectedCase,
}: {
  completed_cases: MinorCaseCompleted[];
  solvedCasesOpen: boolean;
  setSolvedCasesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCase: (round: Round) => void;
}) {
  return (
    completed_cases &&
    solvedCasesOpen && (
      <div>
        <h1 className="font-bold text-3xl text-center pb-4">COMPLETED CASES</h1>

        <div className="flex space-x-4">
          <Cases casesRecord={completed_cases} setSelectedCase={setSelectedCase} />
        </div>
      </div>
    )
  );
}
