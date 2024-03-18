import React from "react";

interface ConnectionsBoxProps {
  index: number;
  word: string;
  isSelected: boolean;
  onClick: () => void;
}

const ConnectionsBox: React.FC<ConnectionsBoxProps> = ({ word, isSelected, onClick }) => {
  const displayWord = word.includes("N/A") ? word.split(" N/A")[0] : word;

  // If the word includes "N/A", set red background color
  const boxStyle = word.includes("N/A")
    ? isSelected
      ? "bg-slate-700 text-white"
      : "bg-gray-500"
    : isSelected
      ? "bg-slate-700 text-white"
      : "bg-gray-200";
  return (
    <div
      className={`${boxStyle} h-20 flex items-center justify-center rounded-lg cursor-pointer text-black`}
      onClick={onClick}
    >
      {displayWord}
    </div>
  );
};

export default ConnectionsBox;
