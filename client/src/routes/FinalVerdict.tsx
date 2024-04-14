import type { MotionValue } from "framer-motion";
import { animate, motion, useMotionValue } from "framer-motion";
import { useRef, useState } from "react";

import frame from "@/assets/bluenoir/frame.png";
import cultleader from "@/assets/main_page/CULT_LEADER.jpg";
import gorgon from "@/assets/main_page/GORGON.jpg";
import nerd from "@/assets/main_page/NERD.jpg";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";

enum Culprit {
  CULT_LEADER = "The Cult Leader",
  GORGON = "Lady Gorgon",
  NERD = "The Earworm",
}

const CHARACTER_IMAGE = {
  [Culprit.CULT_LEADER]: cultleader,
  [Culprit.GORGON]: gorgon,
  [Culprit.NERD]: nerd,
};

const CHARACTER_GLOW = {
  [Culprit.CULT_LEADER]: "drop-shadow(0 0 0.75rem yellow)",
  [Culprit.GORGON]: "drop-shadow(0 0 0.75rem green)",
  [Culprit.NERD]: "drop-shadow(0 0 0.75rem maroon)",
};

export default function FinalVerdict() {
  // const { data: context } = useDjangoContext();

  const [selectedCharacter, setSelectedCharacter] = useState<Culprit | null>(null);

  // if (!context || Object.keys(context.team_context.major_case_solves).length < 3) {
  //   return <Error404 />;
  // }

  const CharacterFrame = ({
    character,
    style,
    x,
    y,
  }: {
    character: Culprit;
    style?: React.CSSProperties;
    x: MotionValue<number>;
    y: MotionValue<number>;
  }) => {
    // const x = useMotionValue;
    return (
      <motion.div
        className="absolute flex flex-col items-center z-[50] text-white rounded-lg bg-slate-900 p-3 pr-4 shadow-lg shadow-slate-800"
        style={{
          filter: selectedCharacter == character ? CHARACTER_GLOW[selectedCharacter] : "",
          // transform: "translate(-50%, -50%)",
          x,
          y,
          ...style,
        }}
        onClick={() => toggleSelectedCharacter(character)}
      >
        <div className="cursor-pointer h-[100px] w-[100px] select-none">
          <div className="h-[70px] w-[70px] absolute mx-[12px] my-[12px]">
            <img
              className="select-none"
              src={CHARACTER_IMAGE[character]}
              style={{
                backgroundImage: `url(${frame})`,
              }}
            />
          </div>
          <div className="h-[100px] w-[100px] absolute mx-auto my-auto select-none">
            <img className="select-none pointer-events-none" src={frame} />
          </div>
        </div>
        <h2 className="text-md font-bold text-center underline">{character}</h2>
      </motion.div>
    );
  };

  const toggleSelectedCharacter = (character: Culprit) => {
    if (selectedCharacter === character) {
      setSelectedCharacter(null);
      // TODO: handle character moving back to original position
    } else {
      setSelectedCharacter(character);
      // TODO: handle character moving to box
    }
  };

  const verdictBoxRef = useRef<HTMLDivElement>(null);

  const characterPosState = {
    [Culprit.CULT_LEADER]: { x: 0.25, y: 0.25 },
    [Culprit.GORGON]: { x: 0.5, y: 0.25 },
    [Culprit.NERD]: { x: 0.75, y: 0.25 },
  };

  const cultX = useMotionValue(characterPosState[Culprit.CULT_LEADER].x * innerWidth);
  const cultY = useMotionValue(characterPosState[Culprit.CULT_LEADER].y * innerHeight);
  const gorgonX = useMotionValue(characterPosState[Culprit.GORGON].x * innerWidth);
  const gorgonY = useMotionValue(characterPosState[Culprit.GORGON].y * innerHeight);
  const nerdX = useMotionValue(characterPosState[Culprit.NERD].x * innerWidth);
  const nerdY = useMotionValue(characterPosState[Culprit.NERD].y * innerHeight);

  const char_coordss = {
    [Culprit.CULT_LEADER]: { x: cultX, y: cultY },
    [Culprit.GORGON]: { x: gorgonX, y: gorgonY },
    [Culprit.NERD]: { x: nerdX, y: nerdY },
  };

  const confirmSelection = () => {
    // TODO: handle bluenoir talking logic, handle resetting the scene.
    if (!selectedCharacter) return;
    const { x, y } = char_coordss[selectedCharacter];

    console.log();
    const verdict_x = verdictBoxRef.current?.getBoundingClientRect().x ?? 0;
    const verdict_y = verdictBoxRef.current?.getBoundingClientRect().y ?? 0;

    console.log(verdict_x, verdict_y);

    animate(x, verdict_x);
    animate(y, verdict_y);

    console.log(x, y);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="mb-4">
        <h1
          className="text-4xl font-bold text-center"
          style={{
            textShadow: "0 0 10px #fff",
          }}
        >
          The Final Verdict
        </h1>
        <h3 className="text-center">CASES CLOSED</h3>
      </div>

      <div className="flex items-center justify-center text-white  p-3 pr-4 gap-8">
        <CharacterFrame character={Culprit.CULT_LEADER} x={cultX} y={cultY} />
        <CharacterFrame character={Culprit.GORGON} x={gorgonX} y={gorgonY} />
        <CharacterFrame character={Culprit.NERD} x={nerdX} y={nerdY} />
      </div>

      <div
        className={cn(
          "absolute verdict-box text-white rounded-lg bg-slate-900 p-3 pr-4 shadow-lg w-[200px] h-[200px]",
          selectedCharacter && "shadow-slate-800",
        )}
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          ref={verdictBoxRef}
          className={cn(
            "absolute verdict-box text-white rounded-lg bg-slate-900 p-3 pr-4 shadow-lg  w-[160px] h-[160px]",
            selectedCharacter && "shadow-slate-500",
          )}
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* <div
            className="absolute verdict-box text-white rounded-lg bg-slate-900 p-3 pr-4 shadow-lg shadow-slate-400 w-[125px] h-[125px]"
            style={{
              top: "48%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          ></div> */}
        </div>
      </div>

      {selectedCharacter && (
        <Button
          className="absolute"
          style={{
            top: "70%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          onClick={() => confirmSelection()}
        >
          CONFIRM
        </Button>
      )}
    </div>
  );
}
