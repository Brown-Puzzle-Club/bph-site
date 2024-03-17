import Loader from "../Loader";
import PresenceCounter from "./PresenceCounter";
import VotingModal from "./VotingModal";
import useSocket from "@/hooks/useSocket";

interface CaseVotingProps {
  path: string;
  votingOptions: string[];
}

const CaseVoting = ({ path }: CaseVotingProps) => {
  const { socket, presenceInfo, votingInfo } = useSocket(path, { onMessage: console.log });

  return !socket || socket.readyState != WebSocket.OPEN ? (
    <Loader />
  ) : (
    <>
      <PresenceCounter presenceInfo={presenceInfo} />
      <VotingModal
        socket={socket}
        presenceInfo={presenceInfo}
        votingInfo={votingInfo}
      />
    </>
  );
};

export default CaseVoting;
