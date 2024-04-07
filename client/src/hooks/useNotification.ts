import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { z } from "zod";
import { useAuth } from "./useAuth";

const NotificationSchema = z.object({
  type: z.string(),
  title: z.string(),
  desc: z.string(),
});
export interface Notification extends z.infer<typeof NotificationSchema> {}

export const useNotification = () => {
  const { team } = useAuth();

  const { toast } = useToast();
  useEffect(() => {
    if (!team) return;

    const eventSource = new EventSource(`/notifications/${team?.user}`);
    eventSource.onmessage = (e) => {
      console.log(e);
      const message = NotificationSchema.safeParse(JSON.parse(e.data));
      console.log(message);
      if (!message.success) return;

      switch (message.data.type) {
        case "solve":
          toast({
            title: message.data.title,
            description: message.data.desc,
          });
          break;
      }
    };
    return () => {
      eventSource.close();
    };
  }, [toast, team]);
};
