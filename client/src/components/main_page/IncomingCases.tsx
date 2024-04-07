import { useDjangoContext } from "@/hooks/useDjangoContext";
import { MAJOR_CASE_FOLDER, MajorCaseEnum } from "@/utils/constants";
import { RAND_ROT } from "../MinorCaseFolder";

export default function IncomingCases() {
  const { context } = useDjangoContext();

  if (!context || !context.team_context.current_incoming_event) return null;

  // console.log("incoming:", context.team_context.current_incoming_event.incoming_cases);

  return (
    <a className="absolute hover:cursor-pointer hover:drop-shadow-[0_12px_12px_rgba(255,196,100,0.5)] w-full">
      <span
        className="z-10 absolute font-mono font-bold text-black text-center whitespace-pre-line break-words text-[2vw] bg-[#ffffff82] rounded"
        style={{
          top: "20%",
          left: "50%",
          transform: "translate(-50%, 50%)",
        }}
      >
        INCOMING CASES
      </span>
      {context.team_context.current_incoming_event.incoming_cases.map((round) => (
        <img
          className="absolute shadow-lg"
          src={MAJOR_CASE_FOLDER[round.major_case.slug as MajorCaseEnum]}
          style={{
            transform: `rotate(${RAND_ROT(40)}deg)`,
          }}
        />
      ))}
    </a>
  );
}
