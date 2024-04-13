import { FileQuestion, PartyPopper, PcCase, Vote } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { z } from "zod";

import NotificationToast from "@/NotificationToast";
import useBPHStore from "@/stores/useBPHStore";
import { RoundSchema, VotingInfoSchema, type VotingInfo } from "@/utils/django_types";

import { useAuth } from "./useAuth";

interface SocketCallbacks {
  onMessage?: (event: MessageEvent) => void;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}

const NotificationSchema = z.object({
  type: z.string(),
  data: z.unknown(),
});

const VoteNotificationSchema = z.object({
  type: z.literal("vote"),
  data: VotingInfoSchema,
});
interface VoteNotification extends z.infer<typeof VoteNotificationSchema> {}

const HintNotificationSchema = z.object({
  type: z.literal("hint"),
  data: z.object({ status: z.string(), puzzle: RoundSchema }),
});
interface HintNotification extends z.infer<typeof HintNotificationSchema> {}

const UnlockNotificationSchema = z.object({
  type: z.literal("unlock"),
  data: RoundSchema,
});
interface UnlockNotification extends z.infer<typeof UnlockNotificationSchema> {}

const SolveNotificationSchema = z.object({
  type: z.literal("solve"),
  data: z.object({ name: z.string() }),
});
interface SolveNotification extends z.infer<typeof SolveNotificationSchema> {}

const StorylineNotificationSchema = z.object({
  type: z.literal("storyline"),
  data: z.object({ slug: z.string() }),
});
interface StorylineNotification extends z.infer<typeof StorylineNotificationSchema> {}

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
  const dispatchBluenoir = useBPHStore((state) => state.setStoryline);
  const setVotingModalOpen = useBPHStore((state) => state.setVotingModalOpen);

  const protocol = window.location.protocol.includes("https") ? "wss" : "ws";

  useEffect(() => {
    if (token.data) {
      setSocketUrl(`${protocol}://${window.location.host}/${path}?token=${token.data}`);
    }
  }, [token, path, setSocketUrl, protocol]);

  useEffect(() => {
    if (!lastJsonMessage) return;

    const parsedMessage = NotificationSchema.parse(lastJsonMessage);
    switch (parsedMessage.type) {
      case "vote": {
        setVotingInfo((parsedMessage.data as VoteNotification).data);
        toast.custom(
          <NotificationToast Icon={Vote}>
            <h2 className="font-bold">New Voting Round!</h2>
            <button onClick={() => setVotingModalOpen(true)}>Click here to vote now.</button>
          </NotificationToast>,
          { duration: 5 * 60 * 1000 },
        );
        break;
      }
      case "hint": {
        const message = parsedMessage as HintNotification;
        toast.custom(
          <NotificationToast Icon={FileQuestion}>
            <h2 className="font-bold">
              New Hint {message.data.status == "NR" ? "Created!" : "Answered!"}
            </h2>
            <Link className="underline" to={`/puzzle/${message.data.puzzle.slug}`}>
              Press here to go to {message.data.puzzle.name}!
            </Link>
          </NotificationToast>,
        );
        break;
      }
      case "unlock": {
        const message = parsedMessage as UnlockNotification;
        toast.custom(
          <NotificationToast Icon={PcCase}>
            <h2 className="font-bold">New case unlocked!</h2>
            <p>Your team has unlocked {message.data.name}! Time to get sleuthing.</p>
          </NotificationToast>,

          { duration: 10 * 1000 },
        );
        break;
      }
      case "solve": {
        const message = parsedMessage as SolveNotification;
        toast.custom(
          <NotificationToast Icon={PartyPopper}>
            <h2 className="font-bold">Congratulations! Case solved!</h2>
            <p>Your team has successfully solved {message.data.name}!</p>
          </NotificationToast>,

          { duration: 10 * 1000 },
        );
        break;
      }
      case "storyline": {
        const message = parsedMessage as StorylineNotification;
        dispatchBluenoir(message.data.slug);
        break;
      }
      default:
        console.warn("Unknown message", parsedMessage);
        break;
    }
  }, [dispatchBluenoir, lastJsonMessage, setVotingModalOpen]);

  return { sendJsonMessage, readyState, votingInfo };
};

export default useSocket;
