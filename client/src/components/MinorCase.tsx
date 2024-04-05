import { MajorCase, MinorCase } from "@/utils/django_types";
import React from "react";

interface BoxProps {
  minorCase: MinorCase;
  majorCase: MajorCase;
  bgColor: string;
  onClick: () => void;
}

const MinorCase: React.FC<BoxProps> = ({ minorCase, onClick }) => {
  return (
    <div className={`bg-rose-300 p-4 w-1/2 mr-2 cursor-pointer`} onClick={onClick}>
      {/* Box content */}
      {minorCase.name}
    </div>
  );
};

export default MinorCase;
