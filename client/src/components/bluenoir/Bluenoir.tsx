import { motion, AnimatePresence, type Variants } from "framer-motion";
import Typewriter from "typewriter-effect";

import frame from "@/assets/bluenoir/frame.png";
import test from "@/assets/bluenoir/test.jpeg";

interface BluenoirProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

const frameSlideInOut = 0.15;
const textFadeInOut = 0.25;
const totalAnimationTime = frameSlideInOut + textFadeInOut;

const frameVariants: Variants = {
  visible: {
    width: "auto",
    transition: { duration: frameSlideInOut },
  },
  hidden: { width: 0, transition: { duration: frameSlideInOut, delay: textFadeInOut } },
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

const BluenoirFrame = ({ show, setShow }: BluenoirProps) => {
  return (
    <div className="h-[80px] w-[80px]">
      <div className="h-[55px] w-[55px] absolute mx-[12px] my-[12px]">
        <img src={test} />
      </div>
      <div onClick={() => setShow(!show)} className="h-[80px] w-[80px] absolute mx-auto my-auto">
        <img src={frame} />
      </div>
    </div>
  );
};

const BluenoirSpeech = ({ show, setShow }: BluenoirProps) => {
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
            // Add animations for the accordion content
            className="px-4"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="absolute top-2 right-2 text-slate-500 text-sm">
              <button onClick={() => setShow(false)}>✕</button>
            </div>
            <div className="font-extrabold font-mono text-sm underline underline-offset-2">
              Bluenoir
            </div>
            <div className="flex font-mono font-light max-w-xs text-xs">
              <p className="text-slate-900">{text}</p>
              <div className="absolute overflow-hidden text-ellipsis">
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

const Bluenoir = ({ show, setShow }: BluenoirProps) => {
  return (
    <div className="fixed top-12 left-4 z-[100] text-white rounded-lg bg-slate-900 p-3 pr-4 shadow-lg shadow-slate-800">
      <div className="flex flex-row items-center">
        <BluenoirFrame show={show} setShow={setShow} />
        <BluenoirSpeech show={show} setShow={setShow} />
      </div>
    </div>
  );
};

export default Bluenoir;
