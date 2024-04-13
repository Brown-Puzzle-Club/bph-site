import type { ReadyState } from "react-use-websocket";
import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";

import VotingModal from "./VotingModal";

interface CaseVotingProps {
  sendJsonMessage: SendJsonMessage;
  readyState: ReadyState;
}

const CaseVoting = ({ sendJsonMessage, readyState }: CaseVotingProps) => {
  return readyState == WebSocket.OPEN && <VotingModal sendJsonMessage={sendJsonMessage} />;
};

export default CaseVoting;
