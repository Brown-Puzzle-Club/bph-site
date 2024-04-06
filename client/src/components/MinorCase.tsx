import { MajorCase, MinorCase } from "@/utils/django_types";
import React from "react";

import greenclosed from "@/assets/main_page/greenclosed.png";
import manilaclosed from "@/assets/main_page/manilaclosed.png";
import pinkclosed from "@/assets/main_page/pinkclosed.png";
import { MajorCaseEnum } from "@/utils/constants";

interface BoxProps {
  minorCase: MinorCase;
  majorCase: MajorCase;
  onClick: () => void;
}

const MAJOR_CASE_FOLDER: Record<MajorCaseEnum, string> = {
  [MajorCaseEnum.COLORED_THREAD]: manilaclosed,
  [MajorCaseEnum.SOCIAL_DEDUCTION]: greenclosed,
  [MajorCaseEnum.DATA]: pinkclosed,
};

const MinorCase: React.FC<BoxProps> = ({ minorCase, majorCase, onClick }) => {
  return (
    <div className={`hover:cursor-pointer relative`} onClick={onClick}>
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
  );
};

export default MinorCase;
