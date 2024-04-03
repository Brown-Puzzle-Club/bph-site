import useSocket from "@/hooks/useSocket";
import Loader from "../Loader";
import VotingModal from "./VotingModal";

interface CaseVotingProps {
  path: string;
}

const CaseVoting = ({ path }: CaseVotingProps) => {
  const { sendMessage, readyState, presenceInfo, votingInfo } = useSocket(path, {
    onOpen: () => {
      console.log("Connected to websocket! yay!");
    },
  });

  if (!presenceInfo || !votingInfo) return null;

  return readyState != WebSocket.OPEN ? (
    <Loader />
  ) : (
    <>
      <VotingModal sendMessage={sendMessage} presenceInfo={presenceInfo} votingInfo={votingInfo} />
    </>
  );
};

export default CaseVoting;
