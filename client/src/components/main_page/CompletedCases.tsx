import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { useDjangoContext } from "@/hooks/useDjangoContext";
import type { Round } from "@/utils/django_types";
import { mostRecentSolves } from "@/utils/utils";

import MinorCaseModal from "../MinorCaseModal";
import Cases from "./Cases";
import CompletedCasesStack from "./CompletedCasesStack";

export default function CompletedCases() {
  const [selectedCase, setSelectedCase] = useState<Round | null>(null);
  const [solvedCasesOpen, setSolvedCasesOpen] = useState(false);
  const { context } = useDjangoContext();

  const solved_cases = useMemo(() => {
    if (!context) return [];
    return mostRecentSolves(context);
  }, [context]);

  return (
    solved_cases && (
      <>
        {solvedCasesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute rounded-xl p-4 align-center z-50"
            style={{ top: "20%", left: "29%", width: "50%", height: "37%" }}
          >
            <div className="flex flex-col items-center">
              <span className="font-bold text-[2vw] text-center mb-4 bg-slate-800 rounded-xl">
                COMPLETED CASES
              </span>

              <div className="flex flex-wrap overflow-y-auto max-h-[20vw] p-4 space-x-3 space-y-3 rounded-xl bg-[#09090947]">
                <Cases casesRecord={solved_cases} setSelectedCase={setSelectedCase} />
              </div>
            </div>
            <MinorCaseModal
              setSelectedCase={setSelectedCase}
              selectedCase={selectedCase}
              action={`/minorcase/${selectedCase?.slug}`}
            />
          </motion.div>
        )}
        <div
          className="absolute rounded-xl p-4 align-center"
          style={{ top: "35%", left: "1%", width: "14%", height: "29%" }}
        >
          <CompletedCasesStack
            completed_cases={solved_cases}
            solvedCasesOpen={solvedCasesOpen}
            setSolvedCasesOpen={setSolvedCasesOpen}
          />
        </div>
      </>
    )
  );
}
