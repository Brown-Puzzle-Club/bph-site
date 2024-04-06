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

const VoteSchema = z.object({
  desc: z.string(),
  voteCount: z.number(),
});
export interface Vote extends z.infer<typeof VoteSchema> {}

const VotingInfoSchema = z.object({
  cases: z.record(VoteSchema),
  expiration_time: z.string().nullable(),
  max_choices: z.number().nonnegative(),
});
export interface VotingInfo extends z.infer<typeof VotingInfoSchema> {}

const ResponseSchema = z.object({
  type: z.string(),
  data: z.any(),
});

const useSocket = (path: string, callbacks: SocketCallbacks | undefined = undefined) => {
  const [votingInfo, setVotingInfo] = useState<VotingInfo>({
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
    console.log(lastJsonMessage);

    const parsedMessage = ResponseSchema.parse(lastJsonMessage);
    switch (parsedMessage.type) {
      case "vote": {
        const votingInfo = VotingInfoSchema.parse(parsedMessage.data);
        console.log(votingInfo);
        setVotingInfo(votingInfo);
        break;
      }
      default:
        break;
    }
  }, [lastJsonMessage]);

  return { sendJsonMessage, readyState, votingInfo };
};

export default useSocket;
