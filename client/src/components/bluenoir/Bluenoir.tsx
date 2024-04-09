import { motion, AnimatePresence, type Variants, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useGesture } from "react-use-gesture";
import Typewriter from "typewriter-effect";

import frame from "@/assets/bluenoir/frame.png";
import test from "@/assets/bluenoir/test.jpeg";
import { cn } from "@/utils/utils";

interface BluenoirFrameProps {
  show: boolean;
  setShow: (show: boolean) => void;
  isLeft: boolean;
}

const BluenoirFrame = ({ show, setShow }: BluenoirFrameProps) => {
  return (
    <div className="h-[80px] w-[80px]">
      <div className="h-[55px] w-[55px] absolute mx-[12px] my-[12px]">
        <img className="select-none" src={test} />
      </div>
      <div
        onDoubleClick={() => setShow(!show)}
        className="h-[80px] w-[80px] absolute mx-auto my-auto"
      >
        <img className="select-none" src={frame} />
      </div>
    </div>
  );
};

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

interface BluenoirSpeechProps {
  show: boolean;
  setShow: (show: boolean) => void;
  isLeft: boolean;
}

const BluenoirSpeech = ({ show, setShow, isLeft }: BluenoirSpeechProps) => {
  const text =
    "Nice work, kiddo. At this rate, you'll have the entire agency eating out of the palm of your hand.";

  return (
    <motion.div
      className="flex flex-col"
      variants={frameVariants}
      initial={false}
      animate={show ? "visible" : "hidden"}
    >
      <AnimatePresence initial={false}>
        {show && (
          <motion.div
            className="px-4"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className={cn("absolute text-slate-500 text-sm", isLeft ? "right-2" : "left-2")}>
              <button onClick={() => setShow(false)}>✕</button>
            </div>
            <div
              className={cn(
                "font-extrabold font-mono text-sm underline underline-offset-2",
                !isLeft && "text-right",
              )}
            >
              Bluenoir
            </div>
            <div className="grid font-mono font-light max-w-xs text-xs">
              <p className="text-slate-900 col-start-1 row-start-1">{text}</p>
              <div className="w-full col-start-1 row-start-1">
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .pauseFor(totalAnimationTime * 1000)
                      .typeString(text)
                      .start();
                  }}
                  options={{
                    cursor: "",
                    delay: 30,
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

const dampen = (val: number, [min, max]: [number, number]) => {
  if (val > max) {
    const extra = val - max;
    const dampenedExtra = extra > 0 ? Math.sqrt(extra) : -Math.sqrt(-extra);
    return max + dampenedExtra * 2;
  } else if (val < min) {
    const extra = val - min;
    const dampenedExtra = extra > 0 ? Math.sqrt(extra) : -Math.sqrt(-extra);
    return min + dampenedExtra * 2;
  } else {
    return val;
  }
};
interface BluenoirProps {
  show: boolean;
  setShow: (show: boolean) => void;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
}

const Bluenoir = ({ show, setShow, position, setPosition }: BluenoirProps) => {
  const x = useMotionValue(position.x);
  const y = useMotionValue(position.y);
  const ref = useRef<HTMLDivElement>(null);
  const [isLeft, setIsLeft] = useState(
    x.get() < (window.innerWidth - (ref.current?.offsetWidth ?? 0)) / 2,
  );

  useEffect(() => {
    x.on("change", (val) => {
      setIsLeft(val < (window.innerWidth - (ref.current?.offsetWidth ?? 0)) / 2);
    });
  }, [x]);

  useGesture(
    {
      onDrag: ({ event, movement: [dx, dy] }) => {
        event.preventDefault();
        x.stop();
        y.stop();
        if (!ref.current) return;

        const [minX, maxX] = [
          0.02 * window.innerWidth,
          0.97 * window.innerWidth - ref.current.offsetWidth,
        ];
        const [minY, maxY] = [
          0.1 * window.innerHeight,
          0.95 * window.innerHeight - ref.current.offsetHeight,
        ];

        x.set(dampen(dx, [minX, maxX]));
        y.set(dampen(dy, [minY, maxY]));
      },
      onDragEnd: () => {
        const newPosition = { x: x.get(), y: y.get() };
        // const snapPositions = [[], [], [], []];

        animate(x, newPosition.x);
        animate(y, newPosition.y);
        setPosition(newPosition);
      },
    },
    {
      drag: { initial: () => [x.get(), y.get()] },
      domTarget: ref,
      eventOptions: { passive: false },
    },
  );

  return (
    <motion.div
      ref={ref}
      className="fixed z-[100] text-white rounded-lg bg-slate-900 p-3 pr-4 shadow-lg shadow-slate-800"
      style={{
        x,
        y,
        touchAction: "none",
        userSelect: "none",
        MozUserSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <div
        className={cn("flex items-center select-none", isLeft ? "flex-row" : "flex-row-reverse")}
      >
        <BluenoirFrame show={show} setShow={setShow} isLeft={isLeft} />
        <BluenoirSpeech show={show} setShow={setShow} isLeft={isLeft} />
      </div>
    </motion.div>
  );
};

export default Bluenoir;
