import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { z } from "zod";
import { useAuth } from "./useAuth";

interface SocketCallbacks {
  onMessage?: (event: MessageEvent) => void;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}

const NotificationSchema = z.object({
  type: z.string(),
  title: z.string(),
  desc: z.string(),
});
export interface Notification extends z.infer<typeof NotificationSchema> {}

export const useNotification = (callbacks: SocketCallbacks | undefined = undefined) => {
  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const { lastJsonMessage, readyState } = useWebSocket(socketUrl, {
    onMessage: callbacks?.onMessage,
    onOpen: callbacks?.onOpen,
    onClose: callbacks?.onClose,
    onError: callbacks?.onError,
    heartbeat: {
      message: JSON.stringify("heartbeat"),
      interval: 50 * 1000,
    },
    retryOnError: true,
  });
  const { toast } = useToast();
  const { team } = useAuth();

  const protocol = window.location.protocol.includes("https") ? "wss" : "ws";
  useEffect(() => {
    if (team) {
      console.log(`${protocol}://${window.location.host}/ws/notification?token=${team.auth_token}`);
      setSocketUrl(
        `${protocol}://${window.location.host}/ws/notification?token=${team.auth_token}`,
      );
    }
  }, [team, setSocketUrl, protocol]);

  useEffect(() => {
    if (!lastJsonMessage) return;
    const message = NotificationSchema.parse(lastJsonMessage);
    console.log(message);
    switch (message.type) {
      case "solve":
        toast({
          title: message.title,
          description: message.desc,
        });
        break;
    }
  }, [lastJsonMessage, toast]);

  return readyState;
};
