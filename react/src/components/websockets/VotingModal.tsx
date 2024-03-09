import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PresenceInfo, VotingInfo } from "@/hooks/useSocket";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";

interface VotingModalProps {
  presenceInfo: PresenceInfo | null;
  votingInfo: VotingInfo | null;
  socket: WebSocket;
}

const VotingModal = ({ socket, votingInfo, presenceInfo }: VotingModalProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { seconds, isRunning } = useTimer({ expiryTimestamp: new Date() });

  useEffect(() => {
    socket.send(JSON.stringify({
      type: "vote",
      data: {
        oldVote: null,
        newVote: null,
      }
    }))
  }, [socket]);

  const setVote = (option: string) => {
    setSelectedOption((currOption) => {
      const newVote = currOption === option ? null : option;
      socket.send(
        JSON.stringify({
          type: "vote",
          data: {
            oldVote: currOption,
            newVote: newVote,
          },
        }),
      );
      return newVote;
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Vote!</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-black">Select Your Option</DialogTitle>
          <DialogDescription>Select the next case you'd like to work on.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {votingInfo && presenceInfo && Object.keys(votingInfo.cases).sort().map((option) => (
            <div className="flex items-center gap-4 text-black" key={option}>
              <Button
                variant="secondary"
                className={cn(selectedOption == option && "ring-2", "flex-1")}
                onClick={() => {
                  console.log("clicked");
                  setVote(option);
                }}
              >
                {option}
              </Button>
              <p>
                {votingInfo?.cases[option].voteCount}/{presenceInfo?.num_connected}
              </p>
            </div>
          ))}

          <p className="text-center text-black">
            {isRunning ? `${seconds} seconds left` : "Start the countdown by selecting an option!"}
          </p>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VotingModal;
