// Modal.tsx
import type React from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import solvedstamp from "@/assets/main_page/folders/SOLVED.png";
import dt_folder from "@/assets/main_page/folders/dt_folder.png";
import rt_folder from "@/assets/main_page/folders/rt_folder.png";
import sd_folder from "@/assets/main_page/folders/sd_folder.png";
import { CASE_PALETTE, MajorCaseEnum } from "@/utils/constants";
import type { Round } from "@/utils/django_types";
import { getMinorCaseSolution } from "@/utils/utils";

import { useDjangoContext } from "../hooks/useDjangoContext";
import { CASE_ART_BY_ROUND_SLUG } from "./minor_cases/FolderArt";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

function getRandomIntInclusive(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

const SOLVED_STAMP_ROT_RANGE = [-10, 10];

const folder_art: Record<MajorCaseEnum, string> = {
  [MajorCaseEnum.COLORED_THREAD]: rt_folder,
  [MajorCaseEnum.SOCIAL_DEDUCTION]: sd_folder,
  [MajorCaseEnum.DATA]: dt_folder,
};

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

  const solution = useMemo(() => {
    if (!selectedCase || !context) {
      return "";
    }
    return getMinorCaseSolution(selectedCase, context);
  }, [selectedCase, context]);

  return (
    selectedCase &&
    context && (
      <Dialog open={true} onOpenChange={() => setSelectedCase(null)} modal>
        <DialogContent
          className="max-w-[60%] bg-transparent absolute grid grid-cols-1 grid-rows-2"
          style={{
            aspectRatio: "16/10",
            backgroundImage: `url(${folder_art[selectedCase.major_case.slug as MajorCaseEnum]})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            border: "none",
          }}
        >
          <div className="select-none">
            {CASE_ART_BY_ROUND_SLUG[selectedCase.slug as MajorCaseEnum]}
          </div>
          {solution && (
            <img
              className="absolute object-cover w-[18vw] select-none pointer-events-none"
              style={{
                left: "65%",
                top: "72%",
                rotate: `${getRandomIntInclusive(SOLVED_STAMP_ROT_RANGE[0], SOLVED_STAMP_ROT_RANGE[1])}deg`,
                opacity: 0.5,
              }}
              src={solvedstamp}
            />
          )}
          <DialogHeader
            className="absolute max-w-[35%] grid gap-2"
            style={{
              left: "55%",
              top: "9%",
            }}
          >
            <DialogTitle
              className="text-[2vw]"
              style={{
                fontFamily: `Cartesian, sans-serif`,
              }}
            >
              {selectedCase.name}
            </DialogTitle>
            <p className="text-[0.9vw]">{selectedCase.description}</p>
          </DialogHeader>
          <div
            className="grid gap-2 absolute"
            style={{
              left: "55%",
              top: "75%",
            }}
          >
            {solution && (
              <p className="font-mono  text-[1.4vw] font-bold">
                ANSWER: <br></br>
                <span
                  className="bg-[#421515]"
                  style={{
                    color: CASE_PALETTE[selectedCase.major_case.slug as MajorCaseEnum].answerColor,
                  }}
                >
                  {solution}
                </span>
              </p>
            )}
            <div className="text-[0.9vw] flex flex-col items-center">
              {typeof action === "string" ? (
                <div className="flex items-center space-x-4">
                  {/* <p className="font-bold text-2xl">{'>>'}</p> */}
                  <Link to={action}>
                    <Button className={`text-[1vw] hover:bg-slate-800`}>
                      Go to Minor Case Page
                    </Button>
                  </Link>
                </div>
              ) : (
                <div>
                  <Button onClick={() => action(selectedCase.name)}>
                    {selectedCases && selectedCases.includes(selectedCase.name)
                      ? "Unselect Vote"
                      : "Vote!"}
                  </Button>
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
