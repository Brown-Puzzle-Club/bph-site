import { useMemo, useState } from "react";

import { useDjangoContext } from "@/hooks/useDjangoContext";
import type { Round } from "@/utils/django_types";

import MinorCaseModal from "../MinorCaseModal";
import Cases from "./Cases";

export default function ActiveCases() {
  const [selectedCase, setSelectedCase] = useState<Round | null>(null);
  const { data: context } = useDjangoContext();

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
    <>
      <div className="flex gap-4">
        {context ? <Cases casesRecord={active_cases} setSelectedCase={setSelectedCase} /> : null}
      </div>
      <MinorCaseModal
        setSelectedCase={setSelectedCase}
        selectedCase={selectedCase}
        action={`/minorcase/${selectedCase?.slug}`}
      />
    </>
  );
}
