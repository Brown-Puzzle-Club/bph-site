import { useWindowSize } from "@uidotdev/usehooks";
import type { MotionValue } from "framer-motion";
import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import frame from "@/assets/bluenoir/frame.png";
import cultleader from "@/assets/main_page/CULT_LEADER.jpg";
import gorgon from "@/assets/main_page/GORGON.jpg";
import nerd from "@/assets/main_page/NERD.jpg";
import { Button } from "@/components/ui/button";
import useBPHStore, { BOTTOM_CENTER } from "@/stores/useBPHStore";
import { cn } from "@/utils/utils";

enum Culprit {
  CULT_LEADER = "Cult Leader",
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

const characterPosState = {
  [Culprit.CULT_LEADER]: { x: 0.25 - 0.043, y: 0.15 },
  [Culprit.GORGON]: { x: 0.5 - 0.043, y: 0.15 },
  [Culprit.NERD]: { x: 0.75 - 0.043, y: 0.15 },
};

export default function FinalVerdict() {
  // const { data: context } = useDjangoContext();

  const { width: innerWidth, height: innerHeight } = useWindowSize();

  const [currentSelectedCharacter, setCurrentSelectedCharacter] = useState<Culprit | null>(null);
  const [prevSelectedCharacter, setPrevSelectedCharacter] = useState<Culprit | null>(null);
  const cultRef = useRef<HTMLDivElement>(null);
  const gorgonRef = useRef<HTMLDivElement>(null);
  const nerdRef = useRef<HTMLDivElement>(null);
  const verdictBoxRef = useRef<HTMLDivElement>(null);

  const setStoryline = useBPHStore((state) => state.setStoryline);

  const cultX = useMotionValue(
    characterPosState[Culprit.CULT_LEADER].x * (innerWidth ?? window.innerWidth),
  );
  const cultY = useMotionValue(
    characterPosState[Culprit.CULT_LEADER].y * (innerHeight ?? window.innerHeight),
  );
  const gorgonX = useMotionValue(
    characterPosState[Culprit.GORGON].x * (innerWidth ?? window.innerWidth),
  );
  const gorgonY = useMotionValue(
    characterPosState[Culprit.GORGON].y * (innerHeight ?? window.innerHeight),
  );
  const nerdX = useMotionValue(
    characterPosState[Culprit.NERD].x * (innerWidth ?? window.innerWidth),
  );
  const nerdY = useMotionValue(
    characterPosState[Culprit.NERD].y * (innerHeight ?? window.innerHeight),
  );

  const charCoords = useMemo(
    () => ({
      [Culprit.CULT_LEADER]: { x: cultX, y: cultY },
      [Culprit.GORGON]: { x: gorgonX, y: gorgonY },
      [Culprit.NERD]: { x: nerdX, y: nerdY },
    }),
    [cultX, cultY, gorgonX, gorgonY, nerdX, nerdY],
  );

  const CHARACTER_REFS = useMemo(
    () => ({
      [Culprit.CULT_LEADER]: cultRef,
      [Culprit.GORGON]: gorgonRef,
      [Culprit.NERD]: nerdRef,
    }),
    [],
  );

  useEffect(() => {
    if (currentSelectedCharacter) {
      const { x, y } = charCoords[currentSelectedCharacter];

      const box_x = verdictBoxRef.current?.getBoundingClientRect().x ?? 0;
      const box_y = verdictBoxRef.current?.getBoundingClientRect().y ?? 0;
      const box_width = verdictBoxRef.current?.offsetWidth ?? 0;
      const box_height = verdictBoxRef.current?.offsetHeight ?? 0;

      const character_width = CHARACTER_REFS[currentSelectedCharacter].current?.offsetWidth ?? 0;
      const character_height = CHARACTER_REFS[currentSelectedCharacter].current?.offsetHeight ?? 0;

      const verdict_x = box_x + (box_width - character_width) / 2;
      const verdict_y = box_y + (box_height - character_height) / 2;

      animate(x, verdict_x);
      animate(y, verdict_y);
    }

    if (prevSelectedCharacter) {
      const prev_x = characterPosState[prevSelectedCharacter].x * (innerWidth ?? 0);
      const prev_y = characterPosState[prevSelectedCharacter].y * (innerHeight ?? 0);

      animate(charCoords[prevSelectedCharacter].x, prev_x);
      animate(charCoords[prevSelectedCharacter].y, prev_y);
    }
  }, [
    currentSelectedCharacter,
    innerWidth,
    innerHeight,
    charCoords,
    CHARACTER_REFS,
    prevSelectedCharacter,
  ]);

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
    return (
      <motion.div
        ref={CHARACTER_REFS[character]}
        className="absolute flex flex-col items-center z-[50] w-[160px] h-[160px] text-white rounded-lg bg-slate-900 p-5 shadow-lg shadow-slate-800"
        style={{
          filter:
            currentSelectedCharacter == character ? CHARACTER_GLOW[currentSelectedCharacter] : "",
          left: x,
          top: y,
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
          <div className="h-[100px] w-[100px] absolute mx-auto my-auto select-none p-2">
            <img className="select-none pointer-events-none" src={frame} />
          </div>
        </div>
        <h2 className="text-md font-bold font-mon text-center underline">{character}</h2>
      </motion.div>
    );
  };

  const toggleSelectedCharacter = (character: Culprit) => {
    if (currentSelectedCharacter === character) {
      setCurrentSelectedCharacter(null);
      setPrevSelectedCharacter(character);
    } else {
      setPrevSelectedCharacter(currentSelectedCharacter);
      setCurrentSelectedCharacter(character);
    }
  };

  const confirmSelection = () => {
    // TODO: handle bluenoir talking logic, handle resetting the scene.
    switch (currentSelectedCharacter) {
      case Culprit.CULT_LEADER:
        setStoryline("colored-thread-verdict", BOTTOM_CENTER);
        break;
      case Culprit.GORGON:
        setStoryline("social-deduction-verdict", BOTTOM_CENTER);
        break;
      case Culprit.NERD:
        setStoryline("data-verdict", BOTTOM_CENTER);
        break;
    }
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
        <h3 className="text-center font-mono">CASES CLOSED: Who killed Josiah S. Carberry?</h3>
      </div>

      <div className="flex items-center justify-center text-white  p-3 pr-4 gap-8">
        <CharacterFrame character={Culprit.CULT_LEADER} x={cultX} y={cultY} />
        <CharacterFrame character={Culprit.GORGON} x={gorgonX} y={gorgonY} />
        <CharacterFrame character={Culprit.NERD} x={nerdX} y={nerdY} />
      </div>

      <div
        className={cn(
          "absolute verdict-box text-white rounded-lg bg-slate-900 p-3 pr-4 shadow-lg w-[200px] h-[200px]",
          currentSelectedCharacter && "shadow-slate-800",
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
            "absolute verdict-box text-white rounded-lg bg-slate-900 p-3 shadow-lg w-[160px] h-[160px]",
            currentSelectedCharacter && "shadow-slate-500",
          )}
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {currentSelectedCharacter && (
        <Button
          className="absolute"
          style={{
            top: "70%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          onClick={confirmSelection}
        >
          CONFIRM
        </Button>
      )}
    </div>
  );
}
