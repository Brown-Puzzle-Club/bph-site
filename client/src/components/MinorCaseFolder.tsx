import React from "react";

import type { MajorCaseEnum } from "@/utils/constants";
import { MAJOR_CASE_FOLDER } from "@/utils/constants";
import type { MajorCase, Round } from "@/utils/django_types";
import { RAND_ROT } from "@/utils/math";
import { cn } from "@/utils/utils";

interface BoxProps {
  minorCase: Round;
  majorCase: MajorCase;
  onClick: () => void;
  className?: string;
  extraStyle?: React.CSSProperties;
}

const GROW_FACTOR = 1.15;

const MinorCaseFolder: React.FC<BoxProps> = ({
  minorCase,
  majorCase,
  onClick,
  className,
  extraStyle,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [randomRotation, setRandomRotation] = React.useState(RAND_ROT());

  return (
    <div className="max-w-[8vw]">
      <div
        className={cn(
          `relative overflow-hidden hover:cursor-pointer hover:drop-shadow-[0_15px_15px_rgba(255,255,255,0.2)] transform transition-transform duration-300`,
          className,
        )}
        onClick={onClick}
        style={{
          ...extraStyle,
          transform: isHovered
            ? `scale(${GROW_FACTOR}) rotate(0deg)`
            : `rotate(${randomRotation}deg)`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setRandomRotation(RAND_ROT());
        }}
      >
        {/* Background image */}
        <img
          className="logo art-bg-img max-h-[10rem]"
          src={MAJOR_CASE_FOLDER[majorCase.slug as MajorCaseEnum]}
        />
        {/* Box content */}
        <span
          className="z-10 absolute font-mono font-bold text-[#000000b0] text-center whitespace-pre-line break-words text-[1vw]"
          style={{
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "90%",
            maxHeight: "80%",
            overflow: "hidden",
          }}
        >
          {minorCase.name.toUpperCase()}
        </span>
      </div>
      {/* {solution && (
        <div className="flex flex-col items-center">
          <span className="text-center overflow-hiddenfont-mono font-bold text-[green] bg-[#ffffffbd] rounded-xl mt-2 p-1 text-[1vw]">
            {solution?.toUpperCase()}
          </span>
        </div>
      )} */}
    </div>
  );
};

export default MinorCaseFolder;
