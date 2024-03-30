import { useEffect, useState } from "react";
import { z } from "zod";
import useWebSocket from "react-use-websocket";
import { useAuth } from "./useAuth";

interface SocketCallbacks {
  onMessage?: (event: MessageEvent) => void;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}

export interface PresenceInfo {
  channel_name: string;
  members: string[];
  anons: number;
  num_connected: number;
}

export interface Vote {
  desc: string;
  voteCount: number;
}
export interface VotingInfo {
  cases: Record<string, Vote>;
  expiration_time: string | null;
}

const PresenceInfoSchema = z.object({
  channel_name: z.string(),
  members: z.array(z.string()),
  anons: z.number().nonnegative(),
  num_connected: z.number().nonnegative(),
});

const VotingInfoSchema = z.object({
  cases: z.record(
    z.object({
      desc: z.string(),
      voteCount: z.number().nonnegative(),
    }),
  ),
  expiration_time: z.string().nullable(),
});

const ResponseSchema = z.object({
  type: z.string(),
  data: z.any(),
});

const useSocket = (path: string, callbacks: SocketCallbacks | undefined = undefined) => {
  const [presenceInfo, setPresenceInfo] = useState<PresenceInfo | null>(null);
  const [votingInfo, setVotingInfo] = useState<VotingInfo>({
    cases: {},
    expiration_time: null,
  });
  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const { sendMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl, {
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
  const { team } = useAuth();

  useEffect(() => {
    if (team) {
      console.log(team.auth_token);
      setSocketUrl(`${path}?token=${team.auth_token}`);
    }
  }, [team, path, setSocketUrl]);

  useEffect(() => {
    if (!lastJsonMessage) return;
    console.log(lastJsonMessage);

    const parsedMessage = ResponseSchema.parse(lastJsonMessage);
    switch (parsedMessage.type) {
      case "presence": {
        const presenceInfo = PresenceInfoSchema.parse(parsedMessage.data);
        setPresenceInfo(presenceInfo);
        break;
      }
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

  return { sendMessage, readyState, presenceInfo, votingInfo };
};

export default useSocket;
