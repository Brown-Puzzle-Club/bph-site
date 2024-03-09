// Modal.tsx
import React from "react";

import { Round } from "@/utils/django_types";
import manila from "@/assets/main/manila_open.png";
import { Link } from "react-router-dom";
import { CASE_ART_BY_ROUND_SLUG } from "@/utils/main/constants";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  caseID: number;
  onSubmit: (caseID: number) => void;
  cur_case: Round | undefined;
}

const MinorCaseModal: React.FC<ModalProps> = ({
  isOpen,
  closeModal,
  caseID,
  onSubmit,
  cur_case,
}) => {
  console.log(isOpen);
  if (!isOpen) {
    return null;
  }

  const cur_case_art: JSX.Element = cur_case ? CASE_ART_BY_ROUND_SLUG[cur_case?.id] : <></>;

  function submitVote(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    //make some backend call to change the status of puzzle from incoming to active
    //open minor case page
    console.log(event);
    throw new Error("Function not implemented.");
  }

  const handleSubmit = () => {
    onSubmit(caseID);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center text-[black]">
        <div
          className="flex h-1/2 w-3/5 flex-row rounded-md bg-white p-6"
          style={{
            backgroundImage: `url(${manila})`,
          }}
        >
          <div className="w-2/4">{cur_case_art}</div>
          <div></div>
          <div></div>
          <div className="grid w-2/4 grid-rows-9">
            {/*Div containg all puzzle info */}
            <div className="row-span-1 mb-4 grid grid-cols-4">
              <h2 className="col-span-3 text-xl text-purple-500">{cur_case?.name}</h2>
              <button className="col-span-1 flex justify-end self-end" onClick={closeModal}>
                X
              </button>
            </div>
            <h3 className="row-span-7">{cur_case?.description}</h3>

            {/* Link to the minor case page */}
            <Link className="col-span-3 text-xl text-purple-500" to={`/minorcase/${cur_case?.id}`}>
              Go to Minor Case Page
            </Link>

            <div className="flex justify-center">
              {/* Container for centering */}
              <div>{cur_case?.name}</div>
              <button className="row-span-1 self-end" onClick={submitVote}>
                Enter
              </button>

              <button onClick={handleSubmit}>Complete</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MinorCaseModal;
