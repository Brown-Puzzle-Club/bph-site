import { useEffect, useState } from "react";
import { z } from "zod";
interface SocketCallbacks {
  onMessage?: (event: MessageEvent) => void;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}

interface PresenceInfo {
  channel_name: string;
  members: string[];
  anons: number;
  num_connected: number;
}

const PresenceInfoSchema = z.object({
  channel_name: z.string(),
  members: z.array(z.string()),
  anons: z.number().nonnegative(),
  num_connected: z.number().nonnegative(),
});

// interface VotingInfo {}

const useSocket = (
  path: string,
  callbacks: SocketCallbacks | undefined = undefined
) => {
  const { onMessage, onOpen, onClose, onError } = callbacks ?? {};

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [presenceInfo, setPresenceInfo] = useState<PresenceInfo | null>(null);
  // const [votingInfo, setVotingInfo] = useState<VotingInfo>({});

  useEffect(() => {
    const url = `${location.protocol === "https:" ? "wss://" : "ws://"}${
      location.host
    }/${path}`;

    const socket = new WebSocket(url);

    // TODO: It would be nice if this was only in dev mode or something
    const openEventCallback = onOpen ?? console.log;
    const closeEventCallback = onClose ?? console.log;
    const errorEventCallback = onError ?? console.error;
    const messageEventCallback = (e: MessageEvent) => {
      if (socket.readyState === WebSocket.OPEN) {
        const data = JSON.parse(e.data);

        if (data.type === "presence") {
          const typechecked_data = PresenceInfoSchema.safeParse(data.data);
          if (typechecked_data.success) {
            setPresenceInfo(typechecked_data.data);
          } else {
            console.error(typechecked_data.error);
          }
        }

        if (onMessage) onMessage(e);
      }
    };

    socket.addEventListener("open", openEventCallback);
    socket.addEventListener("close", closeEventCallback);
    socket.addEventListener("error", errorEventCallback);
    socket.addEventListener("message", messageEventCallback);

    const heartbeatInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify("heartbeat"));
      }
    }, 50 * 1000);

    setSocket(socket);

    return () => {
      socket.removeEventListener("open", openEventCallback);
      socket.removeEventListener("close", closeEventCallback);
      socket.removeEventListener("error", errorEventCallback);
      socket.removeEventListener("message", messageEventCallback);
      clearInterval(heartbeatInterval);
      socket.close();
    };
  }, [path, onMessage, onOpen, onClose, onError]);

  return { socket, presenceInfo };
};

export default useSocket;
