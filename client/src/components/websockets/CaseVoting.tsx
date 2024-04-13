import type { ReadyState } from "react-use-websocket";
import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";

import type { VotingInfo } from "@/utils/django_types";

import VotingModal from "./VotingModal";

interface CaseVotingProps {
  sendJsonMessage: SendJsonMessage;
  readyState: ReadyState;
  votingInfo: VotingInfo;
}

const CaseVoting = ({ sendJsonMessage, readyState, votingInfo }: CaseVotingProps) => {
  return (
    readyState == WebSocket.OPEN && (
      <VotingModal sendJsonMessage={sendJsonMessage} votingInfo={votingInfo} />
    )
  );
};

export default CaseVoting;
