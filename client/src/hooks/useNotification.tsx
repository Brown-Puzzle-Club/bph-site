import { useAuth } from "./useAuth";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useAuth } from "./useAuth";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";

const NotificationSchema = z.object({
  type: z.string(),
  title: z.string(),
  desc: z.string(),
});

export const useNotification = () => {
  const { team } = useAuth();

  useEffect(() => {
    if (!team) return;

    const eventSource = new EventSource(`/notifications/${team?.user}`);
    eventSource.onmessage = (e) => {
      console.log(e);
      const message = NotificationSchema.safeParse(JSON.parse(e.data));
      console.log(message);
      if (!message.success) return;

      toast.custom(
        <div>
          <h1>{message.data.title}</h1>
          <p>{message.data.desc}</p>
        </div>,
        { duration: 5000 },
      );
    };
    return () => {
      eventSource.close();
    };
  }, [team]);
};
