import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTimer } from "react-timer-hook";
import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";

import useBPHStore from "@/stores/useBPHStore";

import VotingModal2 from "./VotingModal2";

interface VotingModalProps {
  sendJsonMessage: SendJsonMessage;
}

const VotingModal = ({ sendJsonMessage }: VotingModalProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const onOpenChange = useBPHStore((state) => state.setVotingModalOpen);

  const votingInfo = useBPHStore((state) => state.votingInfo);

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
    if (votingInfo && votingInfo.expiration_time !== null) {
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

  console.log(votingInfo);

  if (!votingInfo || Object.keys(votingInfo.cases).length === 0) {
    return null;
  }

  return (
    <VotingModal2
      seconds={seconds}
      isRunning={isRunning}
      votingInfo={votingInfo}
      sendJsonMessage={sendJsonMessage}
      votedCases={selectedOptions}
      updateVote={updateVote}
    />
  );
};

export default VotingModal;
