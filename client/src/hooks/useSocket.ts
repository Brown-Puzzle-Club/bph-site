import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { z } from "zod";
import { useAuth } from "./useAuth";
import { VotingInfo } from "@/utils/django_types";

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
    retryOnError: true,
  });
  const { team } = useAuth();

  const protocol = window.location.protocol.includes("https") ? "wss" : "ws";

  useEffect(() => {
    if (team) {
      setSocketUrl(`${protocol}://${window.location.host}/${path}?token=${team.auth_token}`);
    }
  }, [team, path, setSocketUrl, protocol]);

  useEffect(() => {
    if (!lastJsonMessage) return;

    const parsedMessage = ResponseSchema.parse(lastJsonMessage);
    console.log(parsedMessage);
    switch (parsedMessage.type) {
      case "vote": {
        setVotingInfo(parsedMessage.data);
        break;
      }
      default:
        break;
    }
  }, [lastJsonMessage]);

  return { sendJsonMessage, readyState, votingInfo };
};

export default useSocket;
