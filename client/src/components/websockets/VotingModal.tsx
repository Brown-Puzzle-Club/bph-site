import { useCallback, useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { toast } from "react-hot-toast";
import { VotingInfo } from "@/utils/django_types";
import VotingModal2 from "./VotingModal2";

interface VotingModalProps {
  votingInfo: VotingInfo | null;
  sendJsonMessage: SendJsonMessage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VotingModal = ({ sendJsonMessage, votingInfo, open, onOpenChange }: VotingModalProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const updateVote = useCallback(
    (option: string) => {
      if (!votingInfo) return;

      setSelectedOptions((old) => {
        const newSelectedOptions = [...old];
        if (!selectedOptions.includes(option)) {
          if (selectedOptions.length + 1 > votingInfo.max_choices) {
            newSelectedOptions.shift();
          }
          newSelectedOptions.push(option);
        } else {
          newSelectedOptions.splice(newSelectedOptions.indexOf(option), 1);
        }

        sendJsonMessage({ type: "vote", data: { oldVote: old, newVote: newSelectedOptions } });
        return newSelectedOptions;
      });
    },
    [selectedOptions, sendJsonMessage, votingInfo],
  );

  const { seconds, isRunning, restart, pause } = useTimer({
    expiryTimestamp: new Date(),
    onExpire: () => {
      sendJsonMessage({ type: "finalizeVote" });
      toast.dismiss();
      if (window.location.pathname.includes("eventpage")) window.location.reload();
      onOpenChange(false);
    },
    autoStart: false,
  });

  useEffect(() => {
    if (votingInfo !== null && votingInfo.expiration_time !== null) {
      console.log(new Date(votingInfo.expiration_time));
      restart(new Date(votingInfo.expiration_time));
    } else {
      pause();
    }
  }, [votingInfo, pause, restart]);

  useEffect(() => {
    if (votingInfo && votingInfo.max_choices > 0) {
      // toast.custom({ duration: Infinity, id: votingInfo.id.toString() });
    }
  }, [isRunning, seconds, selectedOptions, sendJsonMessage, updateVote, votingInfo]);

  useEffect(() => {
    sendJsonMessage({ type: "vote", data: { oldVote: [], newVote: [] } });
  }, [sendJsonMessage]);

  if (!votingInfo || Object.keys(votingInfo.cases).length === 0) {
    return null;
  }

  return (
    <VotingModal2
      seconds={seconds}
      isRunning={isRunning}
      open={open}
      onOpenChange={onOpenChange}
      votingInfo={votingInfo}
      sendJsonMessage={sendJsonMessage}
      votedCases={selectedOptions}
      updateVote={updateVote}
    />
  );
};

export default VotingModal;
