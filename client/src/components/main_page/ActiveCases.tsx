import { useDjangoContext } from "@/hooks/useDjangoContext";
import { MinorCaseActive, MinorCaseCompleted, MinorCaseIncoming } from "@/utils/django_types";
import { useMemo } from "react";
import MinorCase from "../MinorCase";

export function renderActiveCases(
  casesRecord: (MinorCaseActive | MinorCaseIncoming | MinorCaseCompleted)[],
  openModal: (caseID: number) => void,
): JSX.Element[] {
  if (casesRecord.length === 0) {
    return [];
  }

  console.log(casesRecord);

  return casesRecord.map((minorCase) => (
    <MinorCase
      minorCase={minorCase.minor_case_round}
      majorCase={minorCase.minor_case_round.major_case}
      onClick={() => {
        openModal(minorCase.minor_case_round.id);
      }}
    />
  ));
}

export default function ActiveCases({ openModal }: { openModal: (caseID: number) => void }) {
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
      {context ? renderActiveCases(active_cases, openModal) : null}
    </div>
  );
}
