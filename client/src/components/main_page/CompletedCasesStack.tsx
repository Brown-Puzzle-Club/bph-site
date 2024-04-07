import { MAJOR_CASE_FOLDER, MajorCaseEnum } from "@/utils/constants";
import { MinorCaseCompleted } from "@/utils/django_types";
import { cn } from "@/utils/utils";
import React, { useState } from "react";
import { RAND_ROT, RAND_TRANS } from "../MinorCaseFolder";

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

  if (!completed_cases) return null;

  const toggleSolvedCases = () => {
    setSolvedCasesOpen((prev) => !prev);
  };

  return (
    <a
      className={cn(
        "absolute hover:cursor-pointer transition-all duration-150 w-full",
        solvedCasesOpen
          ? "drop-shadow-[0_12px_12px_rgba(255,196,100,0.5)]"
          : "hover:drop-shadow-[0_12px_12px_rgba(255,196,100,0.5)]",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => toggleSolvedCases()}
    >
      <span
        className="z-10 absolute font-mono font-bold text-black text-center whitespace-pre-line break-words text-[1.5vw] bg-[#ffffff82] rounded"
        style={{
          top: "20%",
          left: "50%",
          transform: "translate(-50%, 50%)",
        }}
      >
        COMPLETED CASES
      </span>
      {completed_cases.map((mc_completed) => (
        <img
          className="absolute shadow-lg"
          src={MAJOR_CASE_FOLDER[mc_completed.minor_case_round.major_case.slug as MajorCaseEnum]}
          style={{
            transform: `rotate(${RAND_ROT(40)}deg) translate(${isHovered ? RAND_TRANS() : 0}px, ${isHovered ? RAND_TRANS() : 0}px)`, // Apply translation only on hover
            transition: "transform 0.2s ease",
          }}
        />
      ))}
    </a>
  );
}
