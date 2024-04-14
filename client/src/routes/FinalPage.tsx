import { useWindowSize } from "@uidotdev/usehooks";
import Confetti from "react-confetti";

import { useDjangoContext } from "@/hooks/useDjangoContext";

const FinalPage = () => {
  const { width, height } = useWindowSize();
  const { data: context } = useDjangoContext();

  if (!context || Object.keys(context.team_context.major_case_solves).length != 3) {
    return null;
  }

  return (
    <div>
      <Confetti width={width ?? innerWidth} height={height ?? innerHeight} />
      <div className="flex flex-col gap-4 justify-center items-center pt-10">
        <h2 className="font-mono font-bold text-5xl">
          Congratulations! You have completed the hunt.
        </h2>
        <p className="text-3xl text-center max-w-5xl">
          If you are a remote team, thank you for joining us! If you are an in-person team, wait for
          HQ to contact you with further instructions.
        </p>
      </div>
    </div>
  );
};

export default FinalPage;
