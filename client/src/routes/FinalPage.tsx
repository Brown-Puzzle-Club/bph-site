import { useWindowSize } from "@uidotdev/usehooks";
import Confetti from "react-confetti";

import detectiveOfTheMonth from "@/assets/bdotm.png";
import { useDjangoContext } from "@/hooks/useDjangoContext";

const FinalPage = () => {
  const { width, height } = useWindowSize();
  const { data: context } = useDjangoContext();

  if (
    !context ||
    (!context.hunt_context.hunt_is_closed &&
      Object.keys(context.team_context.major_case_solves).length != 3)
  ) {
    return null;
  }

  return (
    <div>
      <Confetti width={width ?? innerWidth} height={height ?? innerHeight} />
      <div className="flex flex-col gap-4 justify-center items-center pt-10">
        <h2 className="font-mono font-bold text-5xl">
          Congratulations! You have completed the hunt.
        </h2>
        {!context.hunt_context.hunt_is_closed && (
          <p className="text-3xl text-center max-w-5xl">
            If you are a remote team, thank you for joining us! If you are an in-person team, wait
            for HQ to contact you with further instructions.
          </p>
        )}
        {!context.team_context.in_person && <img src={detectiveOfTheMonth} />}
      </div>
    </div>
  );
};

export default FinalPage;
