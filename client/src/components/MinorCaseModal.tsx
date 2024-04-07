// Modal.tsx
import React, { useEffect } from "react";

import manila from "@/assets/main/manila_open.png";
import { CASE_PALETTE, MajorCaseEnum } from "@/utils/constants";
import { Round } from "@/utils/django_types";
import { getMinorCaseSolution } from "@/utils/utils";
import { Link } from "react-router-dom";
import { useDjangoContext } from "../hooks/useDjangoContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ModalProps {
  setSelectedCase: (round: Round | null) => void;
  selectedCase: Round | null;
  action: string;
}

const MinorCaseModal: React.FC<ModalProps> = ({ setSelectedCase, selectedCase, action }) => {
  const { context } = useDjangoContext();

  useEffect(() => {
    console.log(selectedCase);
  }, [selectedCase]);

  return (
    selectedCase &&
    context && (
      <Dialog open={true} onOpenChange={() => setSelectedCase(null)} modal>
        <DialogContent
          className="max-w-[60%] bg-transparent absolute grid grid-cols-1 grid-rows-2"
          style={{
            aspectRatio: "16/9",
            backgroundImage: `url(${manila})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          <DialogHeader
            className="absolute max-w-[35%] grid gap-2"
            style={{
              left: "55%",
              top: "3%",
            }}
          >
            <DialogTitle className="text-3xl">{selectedCase.name}</DialogTitle>
            <p className="text-md">{selectedCase.description}</p>
          </DialogHeader>

          <div
            className="grid gap-4 absolute"
            style={{
              left: "55%",
              top: "58%",
            }}
          >
            <p
              className="font-mono pt-1 text-5xl"
              style={{
                color: CASE_PALETTE[selectedCase.major_case.slug as MajorCaseEnum].answerColor,
              }}
            >
              {getMinorCaseSolution(selectedCase, context) ?? "PLACEHOLDER"}
            </p>
            <div>
              {typeof action === "string" && <Link to={action}>Go to Minor Case Page</Link>}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
};

export default MinorCaseModal;
