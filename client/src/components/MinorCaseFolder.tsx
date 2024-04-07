import { MajorCase, Round } from "@/utils/django_types";
import React, { useMemo } from "react";

import { useDjangoContext } from "@/hooks/useDjangoContext";
import { MAJOR_CASE_FOLDER, MajorCaseEnum } from "@/utils/constants";
import { cn, getMinorCaseSolution } from "@/utils/utils";

interface BoxProps {
  minorCase: Round;
  majorCase: MajorCase;
  onClick: () => void;
  className?: string;
  extraStyle?: React.CSSProperties;
}

const RANDOM_ROTATION_SCALE = 10;
const RANDOM_TRANSLATION_SCALE = 5;
const GROW_FACTOR = 1.15;

export const RAND_ROT = (scale_factor = RANDOM_ROTATION_SCALE) => {
  return Math.random() * scale_factor - scale_factor / 2;
};
export const RAND_TRANS = () => {
  return Math.floor(Math.random() * 11) - RANDOM_TRANSLATION_SCALE;
};

const MinorCaseFolder: React.FC<BoxProps> = ({
  minorCase,
  majorCase,
  onClick,
  className,
  extraStyle,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [randomRotation, setRandomRotation] = React.useState(RAND_ROT());

  const { context } = useDjangoContext();

  const solution = useMemo(() => {
    if (!context) return null;
    return getMinorCaseSolution(minorCase, context);
  }, [context, minorCase]);

  return (
    <div className="">
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
          className="z-10 absolute font-mono font-bold text-black text-center whitespace-pre-line break-words text-[1vw]"
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
      {solution && (
        <p className="text-center font-mono text-[green] bg-slate-800 rounded-xl mt-2 p-1 text-[1vw]">
          {solution?.toUpperCase()}
        </p>
      )}
    </div>
  );
};

export default MinorCaseFolder;
