import { useState } from "react";
import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";

import type { Round, VotingInfo } from "@/utils/django_types";
import { cn } from "@/utils/utils";

import MinorCaseFolder from "../MinorCaseFolder";
import MinorCaseModal from "../MinorCaseModal";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import VotingIndicators from "./VotingIndicators";

interface VotingModalProps {
  seconds: number;
  isRunning: boolean;
  votingInfo: VotingInfo;
  sendJsonMessage: SendJsonMessage;
  open: boolean;
  votedCases: string[];
  onOpenChange: (open: boolean) => void;
  updateVote: (round: string) => void;
}

const VotingModal = ({
  seconds,
  isRunning,
  votingInfo,
  open,
  onOpenChange,
  votedCases,
  updateVote,
}: VotingModalProps) => {
  const [selectedCase, setSelectedCase] = useState<Round | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>VOTE ON A NEW CASE</DialogTrigger>
      <DialogContent className="max-w-[60%] aspect-[16/9] max-h-none">
        <DialogHeader>
          <DialogTitle className="text-[2vw]">
            Choose your next{" "}
            {votingInfo.max_choices == 1 ? "case" : `${votingInfo.max_choices} cases`}!
          </DialogTitle>
        </DialogHeader>
        <div
          className={cn(
            "grid place-items-center",
            Object.values(votingInfo.cases).length <= 4 ? "grid-cols-2" : "grid-cols-3",
          )}
        >
          {Object.values(votingInfo.cases).map(
            (caseObj) =>
              caseObj.round && (
                <div key={caseObj.round.id} className={"grid place-items-center gap-5"}>
                  <MinorCaseFolder
                    className={cn(
                      "max-w-fit hover:rotate-0",
                      votedCases.includes(caseObj.round?.name)
                        ? "drop-shadow-[0_12px_12px_rgba(135,172,100,0.5)]"
                        : "hover:drop-shadow-[0_12px_12px_rgba(255,196,100,0.5)]",
                    )}
                    minorCase={caseObj.round}
                    majorCase={caseObj.round.major_case}
                    onClick={() => setSelectedCase(caseObj.round)}
                  />
                  <VotingIndicators numVotes={caseObj.count} />
                </div>
              ),
          )}
        </div>
        <DialogFooter>
          {isRunning
            ? `Voting ends in ${seconds} seconds`
            : "Vote for an option to start the countdown!"}
        </DialogFooter>
      </DialogContent>
      <MinorCaseModal
        selectedCase={selectedCase}
        setSelectedCase={setSelectedCase}
        action={updateVote}
      />
    </Dialog>
  );
};

export default VotingModal;

// cases
// :
// What Happened to Mr. Cat
// :
// {desc: 'desc!!!', voteCount: 1}
// sd-mc-2
// :
// {desc: '', voteCount: 0}
// sd-mc-3
// :
// {desc: '', voteCount: 3}
// [[Prototype]]
// :
// Object
// expiration_time
// :
// null
// id
// :
// 80
// max_choices
// :
// 1
