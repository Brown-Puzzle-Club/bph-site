import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VotingInfo } from "@/hooks/useSocket";
import { cn } from "@/utils/utils";
import { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { Checkbox } from "../ui/checkbox";
import DescriptionModal from "./DescriptionModal";

interface VotingModalProps {
  votingInfo: VotingInfo | null;
  sendJsonMessage: SendJsonMessage;
}

const VotingModal = ({ sendJsonMessage, votingInfo }: VotingModalProps) => {
  console.log("this is a print statement");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const { seconds, isRunning, restart, pause } = useTimer({
    expiryTimestamp: new Date(),
    onExpire: () => {
      sendJsonMessage({ type: "finalizeVote" });
      window.location.reload();
    },
    autoStart: false,
  });

  useEffect(() => {
    if (votingInfo !== null && votingInfo.expiration_time !== null) {
      console.log(new Date(votingInfo.expiration_time));
      restart(new Date(votingInfo.expiration_time));
    } else {
      pause();
    }
  }, [votingInfo, pause, restart]);

  useEffect(() => {
    console.log("hi voting info");
    console.log(votingInfo);
  }, [votingInfo]);

  useEffect(() => {
    sendJsonMessage({ type: "vote", data: { oldVote: [], newVote: [] } });
  }, [sendJsonMessage]);

  if (!votingInfo || Object.keys(votingInfo.cases).length === 0) {
    return null;
  }

  const updateVote = (option: string) => {
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

      console.log(newSelectedOptions);
      sendJsonMessage({ type: "vote", data: { oldVote: old, newVote: newSelectedOptions } });
      return newSelectedOptions;
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">VOTE ON A NEW CASE</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-black">Select Your Option</DialogTitle>
          <DialogDescription>
            Select the next case [{votingInfo.max_choices}] you'd like to work on.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {votingInfo &&
            Object.keys(votingInfo.cases)
              .sort()
              .map((option) => (
                <div
                  className={cn(
                    "flex items-center gap-4 text-black",
                    selectedOptions.includes(option) && "ring-1",
                  )}
                  key={option}
                >
                  <DescriptionModal caseName={option} desc={votingInfo.cases[option].desc} />
                  <Checkbox
                    checked={selectedOptions.includes(option)}
                    onClick={() => {
                      updateVote(option);
                    }}
                  />
                  <p>{votingInfo.cases[option].voteCount}</p>
                </div>
              ))}

          <p className="text-center text-black">
            {isRunning ? `${seconds} seconds left` : "Start the countdown by selecting an option!"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VotingModal;
