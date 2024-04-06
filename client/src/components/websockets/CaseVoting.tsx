import useSocket from "@/hooks/useSocket";
import Loader from "../Loader";
import VotingModal from "./VotingModal";

interface CaseVotingProps {
  path: string;
}

const CaseVoting = ({ path }: CaseVotingProps) => {
  const { sendJsonMessage, readyState, votingInfo } = useSocket(path, {
    onOpen: () => {
      console.log("Connected to websocket! yay!");
    },
  });

  return readyState != WebSocket.OPEN ? (
    <Loader />
  ) : (
    <VotingModal sendJsonMessage={sendJsonMessage} votingInfo={votingInfo} />
  );
};

export default CaseVoting;
