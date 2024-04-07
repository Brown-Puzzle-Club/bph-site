// Modal.tsx
import React, { useEffect } from "react";

import manila from "@/assets/main/manila_open.png";
import { Round } from "@/utils/django_types";
import { CASE_ART_BY_ROUND_SLUG } from "@/utils/main/constants";
import { Link } from "react-router-dom";

interface ModalProps {
  setCurrentCase: (round: Round | null) => void;
  cur_case: Round | undefined;
}

const MinorCaseModal: React.FC<ModalProps> = ({ setCurrentCase, cur_case }) => {
  useEffect(() => {
    console.log(cur_case?.id);
  }, [cur_case]);

  if (!cur_case) {
    return null;
  }

  const cur_case_art: JSX.Element = cur_case ? CASE_ART_BY_ROUND_SLUG[cur_case?.id] : <></>;

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
