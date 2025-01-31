import type React from "react";
import { useState } from "react";

import { useDjangoContext } from "@/hooks/useDjangoContext";
import type { MajorCaseEnum } from "@/utils/constants";
import { MAJOR_CASE_FOLDER } from "@/utils/constants";
import type { MinorCaseCompleted } from "@/utils/django_types";
import { RAND_ROT, RAND_TRANS } from "@/utils/math";
import { cn } from "@/utils/utils";

export default function CompletedCasesStack({
  completed_cases,
  solvedCasesOpen,
  setSolvedCasesOpen,
}: {
  completed_cases: MinorCaseCompleted[];
  solvedCasesOpen: boolean;
  setSolvedCasesOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { data: context } = useDjangoContext();

  if (!completed_cases) return null;

  const toggleSolvedCases = () => {
    setSolvedCasesOpen((prev) => !prev);
  };

  return (
    <div
      className={cn(
        "absolute hover:cursor-pointer transition-all duration-150 w-full",
        solvedCasesOpen
          ? "drop-shadow-[0_15px_15px_rgba(255,196,100,0.8)]"
          : "hover:drop-shadow-[0_12px_12px_rgba(255,196,100,0.3)]",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => toggleSolvedCases()}
    >
      <span
        className="z-10 absolute font-mono font-bold text-black text-center whitespace-pre-line break-words text-[1.5vw] bg-[#ffffff82] rounded mt-4 select-none"
        style={{
          top: "100%",
          left: "50%",
          transform: "translate(-50%, 50%)",
        }}
      >
        {context?.hunt_context.hunt_is_closed ? "CASES" : "CLOSED CASES"}
      </span>
      {completed_cases.map((mc_completed) => (
        <img
          key={mc_completed.minor_case_round.id}
          className="absolute shadow-lg"
          src={MAJOR_CASE_FOLDER[mc_completed.minor_case_round.major_case.slug as MajorCaseEnum]}
          style={{
            transform: `rotate(${RAND_ROT(40)}deg) translate(${isHovered ? RAND_TRANS() : 0}px, ${isHovered ? RAND_TRANS() : 0}px)`, // Apply translation only on hover
            transition: "transform 0.2s ease",
          }}
        />
      ))}
    </div>
  );
}
