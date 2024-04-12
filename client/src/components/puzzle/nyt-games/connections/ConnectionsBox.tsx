import type React from "react";

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
      ? "bg-[#5A594E] text-white"
      : "bg-[#FFE6E6FF]"
    : isSelected
      ? "bg-[#5A594E] text-white"
      : "bg-[#FFE6E6FF]";
  return (
    <div
      className={`${boxStyle} h-20 flex items-center justify-center rounded-md cursor-pointer text-black connections-box text-xl`}
      onClick={onClick}
    >
      {displayWord}
    </div>
  );
};

export default ConnectionsBox;
