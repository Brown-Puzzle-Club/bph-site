import type { ReadyState } from "react-use-websocket";
import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";

import type { VotingInfo } from "@/utils/django_types";

import VotingModal from "./VotingModal";

interface CaseVotingProps {
  sendJsonMessage: SendJsonMessage;
  readyState: ReadyState;
  votingInfo: VotingInfo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CaseVoting = ({
  sendJsonMessage,
  readyState,
  votingInfo,
  open,
  onOpenChange,
}: CaseVotingProps) => {
  return (
    readyState == WebSocket.OPEN && (
      <VotingModal
        sendJsonMessage={sendJsonMessage}
        votingInfo={votingInfo}
        open={open}
        onOpenChange={onOpenChange}
      />
    )
  );
};

export default CaseVoting;
