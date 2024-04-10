import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";

import { useAuth } from "./useAuth";

const NotificationSchema = z.object({
  type: z.string(),
  title: z.string(),
  desc: z.string(),
});

export const useNotification = () => {
  const { team } = useAuth();

  useEffect(() => {
    if (!team.data) return;

    const eventSource = new EventSource(`/notifications/${team.data.user}`);

    eventSource.onmessage = (e) => {
      console.log(e);
      const message = NotificationSchema.safeParse(JSON.parse(e.data));
      console.log(message);
      if (!message.success) return;

      toast.custom(
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          className="flex items-center gap-4 text-white rounded-lg bg-slate-900 p-4 shadow-md shadow-slate-800"
        >
          <PartyPopper />
          <div>
            <h2 className="font-bold">{message.data.title}</h2>
            <p>{message.data.desc}</p>
          </div>
        </motion.div>,
        { duration: 5000 },
      );
    };

    return () => {
      eventSource.close();
    };
  }, [team]);
};
