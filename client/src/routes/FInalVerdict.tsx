import isDictionaryWord from "check-dictionary-word";
import { type MotionValue, useMotionValue, animate, motion } from "framer-motion";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useGesture } from "react-use-gesture";
import type { Handler } from "react-use-gesture/dist/types";

import frame from "@/assets/bluenoir/frame.png";
import frame_bg from "@/assets/bluenoir/frame_bg.png";
import cult from "@/assets/verdict/CULT_LEADER.jpg";
import gorgon from "@/assets/verdict/GORGON.jpg";
import nerd from "@/assets/verdict/NERD.jpg";
import type { Position } from "@/stores/useBPHStore";
import { cn } from "@/utils/utils";

interface VerdictFrameProps {
  imgSrc: string;
  x: MotionValue;
  y: MotionValue;
  className?: string;
}

const VerdictFrame = forwardRef<HTMLDivElement, VerdictFrameProps>(
  ({ x, y, imgSrc, className }, ref) => {
    return (
      <motion.div
        className={cn(
          "fixed text-white rounded-lg bg-slate-900 p-3 pr-4 shadow-lg shadow-slate-800",
          className,
        )}
        style={{
          x,
          y,
          touchAction: "none",
          userSelect: "none",
          MozUserSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        <div ref={ref} className="cursor-pointer h-[100px] w-[100px] select-none">
          <div className="h-[70px] w-[70px] absolute mx-[12px] my-[12px]">
            <img
              className="select-none"
              src={imgSrc}
              style={{
                backgroundImage: `url(${frame_bg})`,
              }}
            />
          </div>
          <div className="h-[100px] w-[100px] absolute mx-auto my-auto select-none">
            <img className="select-none pointer-events-none" src={frame} />
          </div>
        </div>
      </motion.div>
    );
  },
);
VerdictFrame.displayName = "VerdictFrame";

const sqDist = (a: Position, b: Position) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

const cultOrigin = {
  x: 0.3,
  y: 0.2,
};
const gorgonOrigin = {
  x: 0.44,
  y: 0.2,
};
const nerdOrigin = {
  x: 0.58,
  y: 0.2,
};
const target = { x: 0.44, y: 0.37 };

const getNearestPosition = (point: Position, origin: Position) => {
  const normalizedPosition = { x: point.x / innerWidth, y: point.y / innerHeight };

  const snapPoints = [origin, target];
  const orderedSnapPoints = snapPoints.sort(
    (a, b) => sqDist(a, normalizedPosition) - sqDist(b, normalizedPosition),
  );

  return orderedSnapPoints[0];
};

enum Culprits {
  CULT = "CULT",
  GORGON = "GORGON",
  NERD = "NERD",
}

export default function FinalVerdict() {
  const [selectedCulprit, setSelectedCulprit] = useState<Culprits | null>(null);

  const onClickHandler = (targetCulprit: Culprits | null) => {
    setSelectedCulprit((currentCulprit) =>
      currentCulprit === targetCulprit ? null : targetCulprit,
    );
  };
}

/*
export default function FinalVerdict() {
  const [cultPosition, setCultPosition] = useState(cultOrigin);
  const [gorgonPosition, setGorgonPosition] = useState(gorgonOrigin);
  const [nerdPosition, setNerdPosition] = useState(nerdOrigin);

  const cultX = useMotionValue(cultPosition.x * innerWidth);
  const cultY = useMotionValue(cultPosition.y * innerHeight);

  const gorgonX = useMotionValue(gorgonPosition.x * innerWidth);
  const gorgonY = useMotionValue(gorgonPosition.y * innerHeight);

  const nerdX = useMotionValue(nerdPosition.x * innerWidth);
  const nerdY = useMotionValue(nerdPosition.y * innerHeight);

  const [cultIsDragging, setCultIsDragging] = useState(false);
  const [gorgonIsDragging, setGorgonIsDragging] = useState(false);
  const [nerdIsDragging, setNerdIsDragging] = useState(false);

  const cultDragRef = useRef<HTMLDivElement>(null);
  const gorgonDragRef = useRef<HTMLDivElement>(null);
  const nerdDragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cultDragRef.current) {
      const centeredPositionX =
        cultPosition.x * innerWidth - (cultDragRef.current.offsetWidth ?? 0) / 2;
      const centeredPositionY =
        cultPosition.y * innerHeight - (cultDragRef.current.offsetHeight ?? 0) / 2;

      cultX.set(centeredPositionX);
      cultY.set(centeredPositionY);
    }

    if (gorgonDragRef.current) {
      const centeredPositionX =
        gorgonPosition.x * innerWidth - (gorgonDragRef.current.offsetWidth ?? 0) / 2;
      const centeredPositionY =
        gorgonPosition.y * innerHeight - (gorgonDragRef.current.offsetHeight ?? 0) / 2;

      gorgonX.set(centeredPositionX);
      gorgonY.set(centeredPositionY);
    }

    if (nerdDragRef.current) {
      const centeredPositionX =
        nerdPosition.x * innerWidth - (nerdDragRef.current.offsetWidth ?? 0) / 2;
      const centeredPositionY =
        nerdPosition.y * innerHeight - (nerdDragRef.current.offsetHeight ?? 0) / 2;

      nerdX.set(centeredPositionX);
      nerdY.set(centeredPositionY);
    }
  });

  useEffect(() => {
    animate(gorgonX, )
  })

  const onDragHandler = (
    x: MotionValue,
    y: MotionValue,
    setDragging: (isDragging: boolean) => void,
  ): Handler<"drag", React.PointerEvent<Element> | PointerEvent> => {
    return ({ event, movement: [dx, dy] }) => {
      event.preventDefault();
      setDragging(true);
      x.stop();
      y.stop();

      x.set(dx);
      y.set(dy);
    };
  };

  const onDragEndHandler = (
    x: MotionValue,
    y: MotionValue,
    position: Position,
    setPosition: (position: Position) => void,
    measureRef: React.RefObject<HTMLDivElement>,
    setDragging: (isDragging: boolean) => void,
  ): Handler<"drag", React.PointerEvent<Element> | PointerEvent> => {
    return () => {
      setDragging(false);
      const pos = getNearestPosition({ x: x.get(), y: y.get() }, position);
      const centeredPositionX = pos.x * innerWidth + (measureRef.current?.offsetWidth ?? 0) / 2;
      const centeredPositionY = pos.y * innerHeight - (measureRef.current?.offsetHeight ?? 0) / 2;

      animate(x, centeredPositionX);
      animate(y, centeredPositionY);
      setPosition(pos);
    };
  };

  useGesture(
    {
      onDrag: onDragHandler(cultX, cultY, setCultIsDragging),
      onDragEnd: onDragEndHandler(
        cultX,
        cultY,
        cultOrigin,
        setCultPosition,
        cultDragRef,
        setCultIsDragging,
      ),
    },
    {
      drag: { initial: () => [cultX.get(), cultY.get()], filterTaps: true },
      domTarget: cultDragRef,
      eventOptions: { passive: false },
    },
  );

  useGesture(
    {
      onDrag: onDragHandler(gorgonX, gorgonY, setGorgonIsDragging),
      onDragEnd: onDragEndHandler(
        gorgonX,
        gorgonY,
        gorgonOrigin,
        setGorgonPosition,
        cultDragRef,
        setGorgonIsDragging,
      ),
    },
    {
      drag: { initial: () => [gorgonX.get(), gorgonY.get()], filterTaps: true },
      domTarget: gorgonDragRef,
      eventOptions: { passive: false },
    },
  );

  useGesture(
    {
      onDrag: onDragHandler(nerdX, nerdY, setNerdIsDragging),
      onDragEnd: onDragEndHandler(
        nerdX,
        nerdY,
        nerdOrigin,
        setNerdPosition,
        cultDragRef,
        setNerdIsDragging,
      ),
    },
    {
      drag: { initial: () => [nerdX.get(), nerdY.get()], filterTaps: true },
      domTarget: nerdDragRef,
      eventOptions: { passive: false },
    },
  );

  return (
    <div>
      <h1 className="text-4xl font-bold text-center py-5">The Final Verdict</h1>
      <VerdictFrame className="z-[50]" x={cultX} y={cultY} imgSrc={cult} ref={cultDragRef} />
      <VerdictFrame
        className="z-[60]"
        x={gorgonX}
        y={gorgonY}
        imgSrc={gorgon}
        ref={gorgonDragRef}
      />
      <VerdictFrame className="z-[70]" x={nerdX} y={nerdY} imgSrc={nerd} ref={nerdDragRef} />
      <div className="target absolute" />
    </div>
  );
}
*/
