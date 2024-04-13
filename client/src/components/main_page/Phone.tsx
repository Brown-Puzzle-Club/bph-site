import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useMemo, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useTime } from "react-timer-hook";

import phone from "@/assets/main_page/PhoneWallp.png";
import { useDjangoContext, useEvents } from "@/hooks/useDjangoContext";
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

const EVENT_EMOJI_LOOKUP: Record<string, string> = {
  astronomy: "🔭",
  interrogation: "🔎",
};

const SOON_AMOUNT_OF_HOURS = 1;

const Phone = () => {
  const { data: context } = useDjangoContext();
  const { data: events } = useEvents();

  const [isCenter, setIsCenter] = useState(false);
  const { minutes, hours } = useTime({});

  const EVENTS_SOON = useMemo(() => {
    if (!events) {
      return false;
    }
    const events_soon = new Set();
    for (const event of events) {
      const event_time = new Date(event.timestamp || "");
      if (
        event.timestamp &&
        event_time.getTime() - new Date().getTime() < SOON_AMOUNT_OF_HOURS * 60 * 60 * 1000 &&
        event_time.getTime() > new Date().getTime()
      ) {
        events_soon.add(event);
      }
    }
    return events_soon;
  }, [events]);

  const unfinished_events = useMemo(() => {
    if (!events || !context) {
      return null;
    }

    const acc = [];
    for (const event of events) {
      if (
        (!event.requires_answer &&
          new Date(event.timestamp || "").getTime() > new Date().getTime()) ||
        (event.requires_answer && !context.team_context.completed_events[event.slug])
      ) {
        acc.push(event);
      }
    }

    return acc;
  }, [events, context]);

  if (!context || !events) {
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
          {EVENTS_SOON && EVENTS_SOON.size > 0 && !isCenter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              layout
            >
              <FaBell
                className="absolute text-[2vw] text-[white] drop-shadow-[0_0_5px_black] animate-pulse-red-white"
                style={{
                  top: "0%",
                  left: "80%",
                  transform: "translateX(-50%)",
                }}
              />
            </motion.div>
          )}
          <div
            className="absolute grid place-items-center gap-[0.05rem] -translate-x-1/2 left-1/2 w-full"
            style={{ top: "20%" }}
          >
            <p className="font-bold text-white font-sans text-[0.8vw]">
              {hours}:{minutes.toLocaleString("en-US", { minimumIntegerDigits: 2 })}
            </p>
            {unfinished_events && (
              <AnimatePresence>
                {unfinished_events.map(
                  (event) =>
                    !context.team_context.completed_events[event.slug] && (
                      <motion.div
                        key={event.slug}
                        initial={{ x: "-25%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "25%", opacity: 0 }}
                      >
                        <PhoneNotification
                          key={event.slug}
                          {...event}
                          icon={EVENT_EMOJI_LOOKUP[event.slug]}
                          is_soon={EVENTS_SOON && EVENTS_SOON.has(event)}
                        />
                      </motion.div>
                    ),
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Phone;
