import vote1 from "@/assets/main_page/vote_icons/vote1.png";
import vote2 from "@/assets/main_page/vote_icons/vote2.png";
import vote3 from "@/assets/main_page/vote_icons/vote3.png";
import vote4 from "@/assets/main_page/vote_icons/vote4.png";
import { cn } from "@/utils/utils";

const vote_icons = [vote1, vote2, vote3, vote4];

const VotingIndicator = () => {
  return (
    <img
      className={cn("rounded-full h-[2vw] w-[2vw]")}
      src={vote_icons[Math.floor(Math.random() * vote_icons.length)]}
    />
  );
};

export default VotingIndicator;
