// Modal.tsx
import React, { useEffect } from "react";

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
  useEffect(() => {
    console.log(cur_case?.id);
  }, [cur_case]);

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
          className="flex h-auto w-3/5 flex-row rounded-md p-6 pl-8"
          style={{
            backgroundImage: `url(${manila})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            width: "50rem",
          }}
        >
          <div className="w-7/12">{cur_case_art}</div>
          <div></div>
          <div></div>
          <div className="grid w-5/12 grid-cols-1 grid-rows-9">
            {/*Div containg all puzzle info */}
            <div className="row-span-1 mb-4 grid w-full grid-cols-4">
              <h2 className="col-span-3 text-xl text-purple-500">{cur_case?.name}</h2>
              <button className="col-span-1 flex justify-end self-end" onClick={closeModal}>
                X
              </button>
            </div>
            <h3 className="row-span-7">{cur_case?.description} description text</h3>{" "}
            {/* className="row-span-7" */}
            {/* Link to the minor case page */}
            <Link className="text-xl text-purple-500" to={`/minorcase/${cur_case?.id}`}>
              Go to Minor Case Page
            </Link>
            <div className="flex justify-between">
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
      {/* <div className="fixed inset-0 flex items-center justify-center">
          <div
            className="bg-white p-6 rounded-md w-3/5 h-1/2 flex-row flex"
            style={
              {
                // backgroundImage: manila,
              }
            }
          >
            <div className="w-2/4">Art assets</div>
            <div></div>
            <div></div>
            <div className="w-2/4 grid grid-rows-9">
              {/*Div containg all puzzle info 
              <div className="grid grid-cols-4 mb-4 row-span-1">
                <h2 className="col-span-3 text-purple-500 text-xl">
                  {cur_case?.name}
                </h2>
                <button
                  className="col-span-1 self-end flex justify-end"
                  onClick={closeModal}
                >
                  X
                </button>
              </div>
              <h3 className="row-span-7">{cur_case?.description}</h3>
              <div className="flex justify-center">
                {/* Container for centering 
                <button className="self-end row-span-1" onClick={submitVote}>
                  Enter
                </button>
              </div>
            </div>
          </div>
        </div>
    </div> */}
    </>
  );
};

export default MinorCaseModal;
