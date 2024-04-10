import useSocket from "@/hooks/useSocket";

import VotingModal from "./VotingModal";

interface CaseVotingProps {
  path: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CaseVoting = ({ path, open, onOpenChange }: CaseVotingProps) => {
  const { sendJsonMessage, readyState, votingInfo } = useSocket(path, {
    onOpen: () => {
      console.log("Connected to websocket! yay!");
    },
  });

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
