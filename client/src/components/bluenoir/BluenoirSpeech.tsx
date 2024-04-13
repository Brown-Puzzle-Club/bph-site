import type { Variants } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Typewriter from "typewriter-effect";

import useBPHStore from "@/stores/useBPHStore";
import { cn } from "@/utils/utils";

import { IDLE_TIMER } from "./Bluenoir";

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
  const speak = useBPHStore((state) => state.bluenoirSpeak);
  const restart = useBPHStore((state) => state.restartIdleTimer);
  const prevStoryline = useBPHStore((state) => state.prevStoryline);
  const nextStoryline = useBPHStore((state) => state.nextStoryline);
  const centered = useBPHStore((state) => state.bluenoirCentered);

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
            className="px-4 min-w-xs"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className={cn("absolute text-slate-500 text-sm top-1 right-2")}>
              {!centered && (
                <button
                  onClick={() => {
                    setOpen(false);
                    restart(speak, IDLE_TIMER * 1000);
                  }}
                >
                  ✕
                </button>
              )}
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
            {centered && (
              <div className="flex absolute text-slate-500 text-sm bottom-1 right-2">
                <div>
                  <button onClick={prevStoryline}>
                    <ChevronLeft />
                  </button>
                </div>
                <div>
                  <button onClick={nextStoryline}>
                    <ChevronRight />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BluenoirSpeech;
