import Loader from "../Loader";
import PresenceCounter from "./PresenceCounter";
import VotingModal from "./VotingModal";
import useSocket from "@/hooks/useSocket";

interface CaseVotingProps {
  path: string;
  votingOptions: string[];
}

const CaseVoting = ({ path }: CaseVotingProps) => {
  const { sendMessage, readyState, presenceInfo, votingInfo } = useSocket(path);

  return readyState != WebSocket.OPEN ? (
    <Loader />
  ) : (
    <>
      <PresenceCounter presenceInfo={presenceInfo} />
      <VotingModal sendMessage={sendMessage} presenceInfo={presenceInfo} votingInfo={votingInfo} />
    </>
  );
};

export default CaseVoting;
