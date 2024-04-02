import React from "react";

interface BoxProps {
  name: string;
  major_case_name: string;
  major_case_slug: string;
  description: string;
  bgColor: string;
  onClick: () => void;
}

const MinorCase: React.FC<BoxProps> = ({ name, onClick }) => {
  return (
    <div
      className={`bg-rose-300 w-1/5 cursor-pointer `}
      style={{ padding: "2%", marginRight: "3%" }}
      onClick={onClick}
    >
      {/* Box content */}
      {name}
    </div>
  );
};

export default MinorCase;
