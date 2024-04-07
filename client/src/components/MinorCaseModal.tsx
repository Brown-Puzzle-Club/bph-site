// Modal.tsx
import React, { useEffect } from "react";

import manila from "@/assets/main/manila_open.png";
import { Round } from "@/utils/django_types";
import { CASE_ART_BY_ROUND_SLUG } from "@/utils/main/constants";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface ModalProps {
  setSelectedCase: (round: Round | null) => void;
  selectedCase: Round | null;
  action: string;
}

const MinorCaseModal: React.FC<ModalProps> = ({ setSelectedCase, selectedCase, action }) => {
  useEffect(() => {
    console.log(selectedCase);
  }, [selectedCase]);

  const selectedCaseArt: JSX.Element = selectedCase ? (
    CASE_ART_BY_ROUND_SLUG[selectedCase?.id]
  ) : (
    <></>
  );

  return (
    selectedCase && (
      <Dialog open={true} onOpenChange={() => setSelectedCase(null)} modal>
        <DialogContent
          className="max-w-[60%] inline-block bg-transparent absolute"
          style={{
            aspectRatio: "16/9",
            backgroundImage: `url(${manila})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          <DialogHeader
            className="absolute max-w-[35%]"
            style={{
              left: "55%",
            }}
          >
            <DialogTitle className="text-3xl">{selectedCase.name}</DialogTitle>
            <p className="text-md">{selectedCase.description}</p>
            <div className="flex-1" />
          </DialogHeader>
          <DialogFooter>
            {typeof action === "string" && <Link to={action}>Go to Minor Case Page</Link>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  );

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center text-[black] z-10">
        <div
          className="flex h-2/3 w-3/5 flex-row rounded-md p-6 pl-8"
          style={{
            backgroundImage: `url(${manila})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          <div className="w-7/12">{cur_case_art}</div>
          <div></div>
          <div></div>
          <div className="grid w-5/12 grid-cols-1 grid-rows-9">
            {/*Div containg all puzzle info */}
            <div className="row-span-1 mb-4 grid w-full grid-cols-4">
              <h2 className="col-span-3 text-xl text-purple-500">{cur_case?.name}</h2>
              <button
                className="col-span-1 flex justify-end self-end"
                onClick={() => {
                  setCurrentCase(null);
                }}
              >
                X
              </button>
            </div>
            <h3 className="row-span-7">{cur_case?.description} description text</h3>{" "}
            {/* className="row-span-7" */}
            {/* Link to the minor case page */}
            <Link className="text-xl text-purple-500" to={`/minorcase/${cur_case?.slug}`}>
              Go to Minor Case Page
            </Link>
            <div className="flex justify-between">
              {/* Container for centering */}
              <div>{cur_case?.name}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MinorCaseModal;
