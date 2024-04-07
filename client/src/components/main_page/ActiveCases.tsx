import { useDjangoContext } from "@/hooks/useDjangoContext";
import { Round } from "@/utils/django_types";
import { useMemo } from "react";
import Cases from "./Cases";

export default function ActiveCases({
  setSelectedCase,
}: {
  setSelectedCase: (round: Round | null) => void;
}) {
  const { context } = useDjangoContext();

  const active_cases = useMemo(() => {
    if (!context) return [];
    const active_cases = context.team_context.minor_case_active;
    const solved_cases = context.team_context.minor_case_completed;

    // truly active cases are all active that are not completed (solved)
    return active_cases.filter((ac) => {
      return !solved_cases.some((sc) => sc.minor_case_round.slug === ac.minor_case_round.slug);
    });
  }, [context]);

  return (
    <div className="flex space-x-4">
      {context ? <Cases casesRecord={active_cases} setSelectedCase={setSelectedCase} /> : null}
    </div>
  );
}
