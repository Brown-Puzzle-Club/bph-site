import VotingBear from "@/assets/voting-bear.svg?react";
import { cn } from "@/utils/utils";
import VotingBear from "@/assets/voting-bear.svg?react";
import { cn } from "@/utils/utils";

const colors = ["#9B59B6", "#CB4335", "#45B39D", "#CA6F1E", "#148F77"];

const VotingIndicator = () => {
  return (
    <VotingBear
      className={cn("rounded-full h-[2vw] w-[2vw]")}
      style={{
        color: colors[Math.floor(Math.random() * colors.length)],
      }}
    />
  );
};

export default VotingIndicator;
