import { MajorCase, Round } from "@/utils/django_types";
import React from "react";

import greenclosed from "@/assets/main_page/greenclosed.png";
import manilaclosed from "@/assets/main_page/manilaclosed.png";
import pinkclosed from "@/assets/main_page/pinkclosed.png";
import { MajorCaseEnum } from "@/utils/constants";
import { cn } from "@/utils/utils";

interface BoxProps {
  minorCase: Round;
  majorCase: MajorCase;
  onClick: () => void;
  className?: string;
  extraStyle?: React.CSSProperties;
}

const RANDOM_ROTATION_SCALE = 10;
const GROW_FACTOR = 1.15;

const RAND_ROT = () => {
  return Math.random() * RANDOM_ROTATION_SCALE - RANDOM_ROTATION_SCALE / 2;
};

const MAJOR_CASE_FOLDER: Record<MajorCaseEnum, string> = {
  [MajorCaseEnum.COLORED_THREAD]: manilaclosed,
  [MajorCaseEnum.SOCIAL_DEDUCTION]: greenclosed,
  [MajorCaseEnum.DATA]: pinkclosed,
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

  return (
    <div>
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
        <img className="logo art-bg-img" src={MAJOR_CASE_FOLDER[majorCase.slug as MajorCaseEnum]} />
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
      <p className="text-center font-mono text-[green] bg-slate-800 rounded-xl mt-2 p-1 text-[1vw]">
      </p>
    </div>
  );
};

export default MinorCaseFolder;
