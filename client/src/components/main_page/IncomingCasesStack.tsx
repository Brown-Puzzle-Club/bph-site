import { useState } from "react";

import { useDjangoContext } from "@/hooks/useDjangoContext";
import type { MajorCaseEnum } from "@/utils/constants";
import { MAJOR_CASE_FOLDER } from "@/utils/constants";
import { RAND_ROT, RAND_TRANS } from "@/utils/math";

interface IncomingCasesStackProps {
  onClick?: () => void;
}

export default function IncomingCasesStack({ onClick }: IncomingCasesStackProps) {
  const { data: context } = useDjangoContext();

  const [isHovered, setIsHovered] = useState(false);

  if (!context || !context.team_context.current_incoming_event) return null;

  return (
    <div
      className="absolute hover:cursor-pointer transition-all duration-150 hover:drop-shadow-[0_12px_12px_rgba(255,196,100,0.5)] w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <span
        className="z-10 absolute font-mono font-bold text-black text-center whitespace-pre-line break-words text-[1.5vw] bg-[#ffffff82] rounded"
        style={{
          top: "20%",
          left: "50%",
          transform: "translate(-50%, 50%)",
        }}
      >
        INCOMING CASES
      </span>
      {context.team_context.current_incoming_event.incoming_cases.map((round) => (
        <img
          key={round.id}
          className="absolute shadow-lg"
          src={MAJOR_CASE_FOLDER[round.major_case.slug as MajorCaseEnum]}
          style={{
            transform: `rotate(${RAND_ROT(40)}deg) translate(${isHovered ? RAND_TRANS() : 0}px, ${isHovered ? RAND_TRANS() : 0}px)`, // Apply translation only on hover
            transition: "transform 0.2s ease",
          }}
        />
      ))}
    </div>
  );
}
