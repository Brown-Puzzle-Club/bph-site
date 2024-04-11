import { AnimatePresence, animate, motion, useMotionValue, type Variants } from "framer-motion";
import { forwardRef, useEffect, useRef } from "react";
import { useGesture } from "react-use-gesture";
import Typewriter from "typewriter-effect";

import frame from "@/assets/bluenoir/frame.png";
import frame_bg from "@/assets/bluenoir/frame_bg.png";
import useBPHStore, { CENTER } from "@/stores/useBPHStore";
import { BluenoirReactionImage } from "@/utils/bluenoir_dialogue";
import { cn } from "@/utils/utils";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const BluenoirFrame = forwardRef<HTMLDivElement>((_props, ref) => {
  const open = useBPHStore((state) => state.bluenoirOpen);
  const toggleOpen = useBPHStore((state) => state.toggleBluenoirOpen);
  const speechDialogue = useBPHStore((state) => state.bluenoirDialogue);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div ref={ref} className="cursor-pointer h-[100px] w-[100px]">
            <div className="h-[70px] w-[70px] absolute mx-[12px] my-[12px]">
              <img
                className="select-none"
                src={BluenoirReactionImage[speechDialogue.reaction]}
                style={{
                  backgroundImage: `url(${frame_bg})`,
                }}
              />
            </div>
            <div
              onDoubleClick={toggleOpen}
              className="h-[100px] w-[100px] absolute mx-auto my-auto"
            >
              <img className="select-none" src={frame} />
            </div>
          </div>
        </TooltipTrigger>
        {!open && (
          <TooltipContent className="bg-slate-900 text-white border-none">
            <p>Double Click Me!</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
});
BluenoirFrame.displayName = "BluenoirFrame";

const frameSlideInOut = 0.15;
const textFadeInOut = 0.25;
const totalAnimationTime = frameSlideInOut + textFadeInOut;

const frameVariants: Variants = {
  visible: {
    width: "auto",
    transition: { duration: frameSlideInOut },
  },
  hidden: {
    width: 0,
    transition: { duration: frameSlideInOut, delay: textFadeInOut },
  },
};

const textVariants: Variants = {
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: textFadeInOut, delay: frameSlideInOut },
  },
  hidden: {
    opacity: 0,
    height: 0,
    transition: { duration: textFadeInOut },
  },
};

const BluenoirSpeech = () => {
  const open = useBPHStore((state) => state.bluenoirOpen);
  const setOpen = useBPHStore((state) => state.setBluenoirOpen);
  const speechDialogue = useBPHStore((state) => state.bluenoirDialogue);

  // const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /*
  const speechTimeout = useCallback(
    () =>
      setTimeout(() => {
        speak(undefined, true);
        console.log("timeout!");
        timeoutRef.current = speechTimeout();
      }, 5000),
    [speak],
  );

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      speechTimeout();
    }, 5000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  });

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (open) {
      timeoutRef.current = speechTimeout();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [open, speechTimeout]);
  */

  return (
    <motion.div
      className="flex flex-col"
      variants={frameVariants}
      initial={false}
      animate={open ? "visible" : "hidden"}
    >
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="px-4"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className={cn("absolute text-slate-500 text-sm top-1 right-2")}>
              <button
                onClick={() => {
                  setOpen(false);
                  // if (timeoutRef.current) clearTimeout(timeoutRef.current);
                  //          timeoutRef.current = speechTimeout();
                }}
              >
                ✕
              </button>
            </div>
            <div className={cn("font-extrabold font-mono text-sm underline underline-offset-2")}>
              Bluenoir
            </div>
            <div className="grid font-mono font-light max-w-xs text-xs">
              <p className="text-slate-900 col-start-1 row-start-1">{speechDialogue.text}</p>
              <div className="w-full col-start-1 row-start-1" key={speechDialogue.text}>
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .pauseFor(totalAnimationTime * 1000)
                      .typeString(speechDialogue.text)
                      .start();
                  }}
                  options={{
                    cursor: "",
                    delay: 10,
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Bluenoir = () => {
  const position = useBPHStore((state) => state.getBluenoirPosition());
  const previousPosition = useBPHStore((state) => state.getPreviousPosition());
  const setPosition = useBPHStore((state) => state.setBluenoirPosition);
  const centered = useBPHStore((state) => state.centered);
  const getNearestSnapPoint = useBPHStore((state) => state.getNearestSnapPoint);
  const dragRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(position.x);
  const y = useMotionValue(position.y);

  useEffect(() => {
    if (measureRef.current) {
      const centeredPositionX = position.x - (measureRef.current.offsetWidth ?? 0) / 2;
      const centeredPositionY = position.y - (measureRef.current.offsetHeight ?? 0) / 2;

      x.set(centeredPositionX);
      y.set(centeredPositionY);
    }
  });

  useEffect(() => {
    const position = centered ? CENTER : previousPosition;

    const centeredPositionX =
      position.x * window.innerWidth - (measureRef.current?.offsetWidth ?? 0) / 2;
    const centeredPositionY =
      position.y * window.innerHeight - (measureRef.current?.offsetHeight ?? 0) / 2;

    animate(x, centeredPositionX);
    animate(y, centeredPositionY);
    setPosition(position);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centered, setPosition, x, y]);

  useGesture(
    {
      onDrag: ({ event, movement: [dx, dy] }) => {
        event.preventDefault();
        x.stop();
        y.stop();

        x.set(dx);
        y.set(dy);
      },
      onDragEnd: () => {
        const snappedPosition = centered ? CENTER : getNearestSnapPoint({ x: x.get(), y: y.get() });
        const centeredPositionX =
          snappedPosition.x * window.innerWidth - (measureRef.current?.offsetWidth ?? 0) / 2;
        const centeredPositionY =
          snappedPosition.y * window.innerHeight - (measureRef.current?.offsetHeight ?? 0) / 2;

        console.log(centeredPositionX, centeredPositionY);

        animate(x, centeredPositionX);
        animate(y, centeredPositionY);

        setPosition(snappedPosition);
      },
    },
    {
      drag: { initial: () => [x.get(), y.get()], filterTaps: true },
      domTarget: dragRef,
      eventOptions: { passive: false },
    },
  );

  return (
    <motion.div
      className="fixed z-[50] text-white rounded-lg bg-slate-900 p-3 pr-4 shadow-lg shadow-slate-800"
      style={{
        x,
        y,
        touchAction: "none",
        userSelect: "none",
        MozUserSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <div ref={dragRef} className={cn("flex items-center select-none")}>
        <BluenoirFrame ref={measureRef} />
        <BluenoirSpeech />
      </div>
    </motion.div>
  );
};

export default Bluenoir;
