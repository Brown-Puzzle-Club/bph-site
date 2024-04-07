import { useDjangoContext } from "@/hooks/useDjangoContext";
import {
  MinorCaseActive,
  MinorCaseCompleted,
  MinorCaseIncoming,
  Round,
} from "@/utils/django_types";
import { useMemo } from "react";
import MinorCaseFolder from "../MinorCaseFolder";

export function renderActiveCases(
  casesRecord: (MinorCaseActive | MinorCaseIncoming | MinorCaseCompleted)[],
  setSelectedCase: (round: Round) => void,
): JSX.Element[] {
  if (casesRecord.length === 0) {
    return [];
  }

  return casesRecord.map((minorCase) => (
    <MinorCaseFolder
      className="hover:rotate-0"
      minorCase={minorCase.minor_case_round}
      majorCase={minorCase.minor_case_round.major_case}
      onClick={() => {
        setSelectedCase(minorCase.minor_case_round);
      }}
    />
  ));
}

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
      {context ? renderActiveCases(active_cases, setSelectedCase) : null}
    </div>
  );
}
