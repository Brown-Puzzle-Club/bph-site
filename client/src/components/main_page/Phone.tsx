import { motion, type Variants } from "framer-motion";
import { useMemo, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useTime } from "react-timer-hook";

import phone from "@/assets/main_page/PhoneWallp.png";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { cn } from "@/utils/utils";

import type { PhoneNotificationProps } from "./PhoneNotification";
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

const NOTIFICATIONS: PhoneNotificationProps[] = [
  {
    icon: "🔭",
    name: "Gaze at the Stars",
    time: new Date("4/10 20:00 2024"),
    location: "Barus & Holley 7th Floor",
    instructions: "Bring ",
  },
  {
    icon: "🔎",
    name: "An Interrogation",
    time: new Date("4/13 8:00 2024"),
    location: "Somewhere",
  },
];

const SOON_AMOUNT_OF_HOURS = 2;

const Phone = () => {
  const { data: context } = useDjangoContext();
  const [isCenter, setIsCenter] = useState(false);
  const { minutes, hours } = useTime({});

  const ANY_EVENTS_SOON = useMemo(() => {
    let any_soon = false;
    for (const notif of NOTIFICATIONS) {
      if (
        notif.time.getTime() - new Date().getTime() < SOON_AMOUNT_OF_HOURS * 60 * 60 * 1000 &&
        notif.time.getTime() > new Date().getTime()
      ) {
        notif.is_soon = true;
        any_soon = true;
      }
    }
    return any_soon;
  }, []);

  if (!context?.team_context?.in_person) {
    return null;
  }

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
          {ANY_EVENTS_SOON && !isCenter && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FaBell
                className="absolute text-[2vw] text-[white] drop-shadow-[0_0_5px_black]"
                style={{
                  top: "0%",
                  left: "80%",
                  transform: "translateX(-50%)",
                }}
              />
            </motion.div>
          )}
          <div
            className="absolute grid place-items-center gap-[0.2rem] -translate-x-1/2 left-1/2 w-full"
            style={{ top: "20%" }}
          >
            <p className="font-bold text-white font-sans text-[0.8vw]">
              {hours}:{minutes.toLocaleString("en-US", { minimumIntegerDigits: 2 })}
            </p>

            {NOTIFICATIONS.map((notification, i) => (
              <PhoneNotification key={i} {...notification} />
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Phone;
