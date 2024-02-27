// Modal.tsx
import React, { useEffect, useState } from "react";

import { useDjangoContext } from "@/hooks/useDjangoContext";
import { MinorCase } from "@/utils/django_types";
// import manila from "../assets/main/manila_open.PNG";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  caseID : number;
  onSubmit: (caseID : number) => void;
}

const MinorCaseModal: React.FC<ModalProps> = ({
  isOpen,
  closeModal,
  caseID,
  onSubmit
}) => {
  const { FetchCase } = useDjangoContext();
  const [cur_case, setCase] = useState<MinorCase>();
  const [loading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await FetchCase(caseID);
        setCase(result);
      } catch (error) {
        console.error("Error fetching case:", error);
      }
    };

    fetchData();
    setIsLoading(false);
  }, [FetchCase]);

  if (!isOpen) {
    return null;
  }

  function submitVote(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    //make some backend call to change the status of puzzle from incoming to active
    //open minor case page
    console.log(event);
    throw new Error("Function not implemented.");
  }

  const handleSubmit = () => {
    onSubmit(caseID);
  }

  return (
    <>
      {loading ? (
        <div>Loading TODO spinny</div>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center">
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
              {/*Div containg all puzzle info */}
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
                {/* Container for centering */}
                <button className="self-end row-span-1" onClick={submitVote}>
                  Enter
                </button>

                <button onClick={handleSubmit}>Complete</button>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </>
  );
};

export default MinorCaseModal;
