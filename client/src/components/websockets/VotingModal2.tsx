import { useEffect, useState } from "react";
import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";

import useBPHStore from "@/stores/useBPHStore";
import type { Round, VotingInfo } from "@/utils/django_types";
import { cn } from "@/utils/utils";

import MinorCaseFolder from "../MinorCaseFolder";
import MinorCaseModal from "../MinorCaseModal";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import VotingIndicators from "./VotingIndicators";

interface VotingModalProps {
  seconds: number;
  isRunning: boolean;
  votingInfo: VotingInfo;
  sendJsonMessage: SendJsonMessage;
  votedCases: string[];
  updateVote: (round: string) => void;
}

const VotingModal = ({
  seconds,
  isRunning,
  votingInfo,
  votedCases,
  updateVote,
}: VotingModalProps) => {
  const [selectedCase, setSelectedCase] = useState<Round | null>(null);
  const open = useBPHStore((state) => state.votingModalOpen);
  const onOpenChange = useBPHStore((state) => state.setVotingModalOpen);

  useEffect(() => {
    console.log(open);
  }, [open]);

  useEffect(() => {
    console.log(votingInfo);
  }, [votingInfo]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              caseObj &&
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
        selectedCases={votedCases}
        action={updateVote}
      />
    </Dialog>
  );
};

export default VotingModal;
