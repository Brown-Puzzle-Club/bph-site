import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { useTime } from "react-timer-hook";

import phone from "@/assets/main_page/PhoneWallp.png";
import { cn } from "@/utils/utils";

import PhoneNotification from "./PhoneNotification";

const phoneVariant: Variants = {
  centered: {
    left: "50%",
    top: "80%",
    scale: 7,
    rotate: "0deg",
  },
  notCentered: {
    left: "9%",
    top: "67%",
    rotate: "-22deg",
  },
};

const Phone = () => {
  const [isCenter, setIsCenter] = useState(false);
  const { minutes, hours } = useTime({});

  return (
    <>
      <motion.div
        className={cn(
          "absolute z-10 w-[5%] cursor-pointer hover:drop-shadow-[0_16px_16px_rgba(0,0,0,1)]",
        )}
        variants={phoneVariant}
        initial={false}
        animate={isCenter ? "centered" : "notCentered"}
        onClick={() => setIsCenter(!isCenter)}
      >
        <div className="relative">
          <img src={phone} alt="phone" className="w-full" />
          <div
            className="absolute grid place-items-center gap-1 -translate-x-1/2 left-1/2 w-full"
            style={{ top: "20%" }}
          >
            <p className="font-bold text-white font-sans text-[0.8vw]">
              {hours}:{minutes.toLocaleString("en-US", { minimumIntegerDigits: 2 })}
            </p>
            <PhoneNotification
              name="Astronomy"
              time={new Date("4/13 12:00 2024")}
              location="Barus & Holley"
            />
            <PhoneNotification
              name="Astronomy"
              time={new Date("4/13 12:00 2024")}
              location="Barus & Holley"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Phone;
