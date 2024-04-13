import { useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useHintsForPuzzle, useMutateHint } from "@/hooks/useDjangoContext";
import type { Hint } from "@/utils/django_types";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ModalProps {
  puzzleSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HintModal: React.FC<ModalProps> = ({ puzzleSlug, open, onOpenChange }: ModalProps) => {
  const { team } = useAuth();
  const hintsRemaining = team.data?.num_hints_remaining ?? 0;
  const { data: hints } = useHintsForPuzzle(puzzleSlug);
  const sortedHints = useMemo(
    () =>
      hints?.sort(
        (a, b) =>
          new Date(a.submitted_datetime).getTime() - new Date(b.submitted_datetime).getTime(),
      ),
    [hints],
  );

  const mutateHint = useMutateHint(puzzleSlug);
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [hintQuestion, setHintQuestion] = useState("");

  return (
    <Dialog
      open={open}
      onOpenChange={(bool) => {
        onOpenChange(bool);
        setIsHintOpen(false);
      }}
    >
      <DialogContent className="max-h-[90%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Puzzle Hints</DialogTitle>
          <p>
            {hintsRemaining} hint{hintsRemaining === 1 ? "" : "s"} remaining
          </p>
          {isHintOpen ? (
            <div>
              <textarea
                className="bg-gray-300 w-full h-24"
                value={hintQuestion}
                onChange={(e) => setHintQuestion(e.target.value)}
              />
              <Button
                onClick={() => {
                  mutateHint.mutate({ question: hintQuestion, followup: -1 });
                  setIsHintOpen(false);
                }}
                className="bg-blue-500 px-1 h-6 ml-1"
                disabled={hintQuestion.length === 0}
              >
                Submit hint request
              </Button>
            </div>
          ) : (
            <Button disabled={hintsRemaining <= 0} onClick={() => setIsHintOpen(true)}>
              {hintsRemaining <= 0 ? "No hints available" : "Request new hint"}
            </Button>
          )}
        </DialogHeader>
        {sortedHints !== undefined ? (
          sortedHints.length === 0 ? (
            <p>No hints submitted for this puzzle yet, submit a hint to get started!</p>
          ) : (
            sortedHints.map((hint, i) => (
              <HintRow key={hint.id} hint={hint} i={i} puzzleSlug={puzzleSlug} />
            ))
          )
        ) : (
          <p>Loading hints...</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface HintRowProps {
  hint: Hint;
  i: number;
  puzzleSlug: string;
}

const HintRow: React.FC<HintRowProps> = ({ hint, i, puzzleSlug }: HintRowProps) => {
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);
  const [followupQuestion, setFollowupQuestion] = useState("");
  const mutateHint = useMutateHint(puzzleSlug);

  return (
    <div>
      <h3
        className={`text-lg font-semibold ${
          hint.status !== "NR" ? "text-green-500" : "text-orange-500"
        }`}
      >
        Hint {i + 1} {hint.is_followup && "(followup)"} {hint.status === "NR" && "(pending)"}{" "}
        {hint.status === "ANS" && "(answered)"}{" "}
        {hint.status === "REF" && (hint.is_followup ? "(thread closed)" : "(refunded)")}{" "}
        {hint.status === "OBS" && "(obsolete)"}
      </h3>
      <p className="text-sm">
        <span className="text-sm text-gray-500">
          ({new Date(hint.submitted_datetime).toLocaleString("en-US")})
        </span>{" "}
        <strong>Question:</strong> {hint.hint_question}
      </p>
      {hint.response && hint.answered_datetime ? (
        <>
          <p className="bg-green-200 rounded p-1 my-1">
            <span className="text-sm text-gray-500">
              ({new Date(hint.answered_datetime).toLocaleString("en-US")})
            </span>{" "}
            <strong>Answer:</strong> {hint.response}
          </p>
          {!hint.is_followed_up_on &&
            hint.status !== "REF" &&
            (isFollowupOpen ? (
              <div>
                <textarea
                  className="bg-gray-300 w-full h-24"
                  value={followupQuestion}
                  onChange={(e) => setFollowupQuestion(e.target.value)}
                />
                <Button
                  onClick={() => {
                    mutateHint.mutate({ question: followupQuestion, followup: hint.id });
                    setIsFollowupOpen(false);
                  }}
                  className="bg-blue-500 px-1 h-6 ml-1"
                  disabled={followupQuestion.length === 0}
                >
                  Submit followup
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsFollowupOpen(true)}>Followup</Button>
            ))}
        </>
      ) : (
        <p className="text-sm text-gray-500">
          <em>Pending answer...</em>
        </p>
      )}
    </div>
  );
};

export default HintModal;
