import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useWebSocket from "react-use-websocket";
import { z } from "zod";

import type { VotingInfo } from "@/utils/django_types";

import { useAuth } from "./useAuth";

interface SocketCallbacks {
  onMessage?: (event: MessageEvent) => void;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}

const VoteSchema = z.object({
  desc: z.string(),
  voteCount: z.number(),
});
export interface Vote extends z.infer<typeof VoteSchema> {}

const ResponseSchema = z.object({
  type: z.string(),
  data: z.any(),
});

const useSocket = (path: string, callbacks: SocketCallbacks | undefined = undefined) => {
  const [votingInfo, setVotingInfo] = useState<VotingInfo>({
    id: 0,
    cases: {},
    expiration_time: null,
    max_choices: 0,
  });
  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl, {
    onMessage: callbacks?.onMessage,
    onOpen: callbacks?.onOpen,
    onClose: callbacks?.onClose,
    onError: callbacks?.onError,
    heartbeat: {
      message: JSON.stringify("heartbeat"),
      interval: 5 * 1000,
    },
    shouldReconnect: () => true,
    retryOnError: true,
  });
  const { token } = useAuth();

  const protocol = window.location.protocol.includes("https") ? "wss" : "ws";

  useEffect(() => {
    if (token.data) {
      setSocketUrl(`${protocol}://${window.location.host}/${path}?token=${token.data}`);
    }
  }, [token, path, setSocketUrl, protocol]);

  useEffect(() => {
    if (!lastJsonMessage) return;

    console.log(lastJsonMessage);

    const parsedMessage = ResponseSchema.parse(lastJsonMessage);
    switch (parsedMessage.type) {
      case "vote": {
        setVotingInfo(parsedMessage.data);
        break;
      }
      case "unlock":
      case "solve": {
        toast.custom(
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            className="flex items-center gap-4 text-white rounded-lg bg-slate-900 p-4 shadow-md shadow-slate-800"
          >
            <PartyPopper />
            <div>
              <h2 className="font-bold">{parsedMessage.data.title}</h2>
              <p>{parsedMessage.data.desc}</p>
            </div>
          </motion.div>,
          { duration: 5000 },
        );
        break;
      }
      default:
        console.warn("Unknown message type", parsedMessage.type);
        break;
    }
  }, [lastJsonMessage]);

  return { sendJsonMessage, readyState, votingInfo };
};

export default useSocket;
