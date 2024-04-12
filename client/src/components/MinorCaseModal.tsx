// Modal.tsx
import type React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import manila from "@/assets/main_page/manilaopen.png";
import * as birb from "@/assets/minor_cases/birbs/teaser-1.png";
import * as clip1 from "@/assets/minor_cases/clipping1.png";
import * as clip2 from "@/assets/minor_cases/clipping2.png";
import { CASE_PALETTE, type MajorCaseEnum } from "@/utils/constants";
import type { Round } from "@/utils/django_types";
import { getMinorCaseSolution } from "@/utils/utils";

import { useDjangoContext } from "../hooks/useDjangoContext";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ModalProps {
  setSelectedCase: (round: Round | null) => void;
  selectedCase: Round | null;
  selectedCases?: string[];
  action: string | ((round: string) => void);
}

const MinorCaseModal: React.FC<ModalProps> = ({
  setSelectedCase,
  selectedCase,
  selectedCases,
  action,
}) => {
  const { data: context } = useDjangoContext();

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
          <div>
            <img
              className="absolute shadow-lg aspect-square object-cover w-[8vw]"
              style={{ left: "10%", top: "10%", rotate: "-27deg" }}
              src={birb.default}
            />
            <img
              className="absolute shadow-lg aspect-square object-cover w-[10vw]"
              style={{ left: "8%", top: "55%", rotate: "15deg" }}
              src={clip1.default}
            />
            <img
              className="absolute shadow-lg aspect-square object-cover w-[8vw]"
              style={{ left: "28%", top: "30%", rotate: "5deg" }}
              src={clip2.default}
            />
            <img
              className="absolute shadow-lg aspect-square object-cover w-[9vw]"
              style={{ left: "30%", top: "60%", rotate: "-15deg" }}
              src={birb.default}
            />
          </div>

          <DialogHeader
            className="absolute max-w-[35%] grid gap-2"
            style={{
              left: "55%",
              top: "3%",
            }}
          >
            <DialogTitle className="text-[2vw]">{selectedCase.name}</DialogTitle>
            <p className="text-[0.9vw]">{selectedCase.description}</p>
          </DialogHeader>
          <div
            className="grid gap-4 absolute"
            style={{
              left: "55%",
              top: "70%",
            }}
          >
            <p
              className="font-mono pt-1 text-[3vw]"
              style={{
                color: CASE_PALETTE[selectedCase.major_case.slug as MajorCaseEnum].answerColor,
              }}
            >
              {getMinorCaseSolution(selectedCase, context) ?? "PLACEHOLDER"}
            </p>
            <div className="text-[0.9vw]">
              {typeof action === "string" ? (
                <Link to={action}>Go to Minor Case Page</Link>
              ) : (
                <div>
                  <Checkbox
                    id={selectedCase.name}
                    checked={selectedCases && selectedCases.includes(selectedCase.name)}
                    onClick={() => action(selectedCase.name)}
                  />
                  <label htmlFor={selectedCase.name}>Vote for {selectedCase.name}!</label>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
};

export default MinorCaseModal;
