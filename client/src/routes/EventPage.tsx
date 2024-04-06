import { useEffect, useState } from "react";

// import MinorCase from '../components/MinorCase';

import MinorCaseModal from "@/components/MinorCaseModal";
// import { MinorCaseStatus, context } from "../context";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { DjangoContext } from "@/utils/django_types";

import backdrop from "@/assets/main_page/Backdrop.png";
import shadow from "@/assets/main_page/Shadow.png";
import shadowDesk from "@/assets/main_page/ShadowDesk.png";
import ActiveCases, { renderActiveCases } from "@/components/main_page/ActiveCases";
import { useTheme } from "@/hooks/useTheme";
import { MAIN_PAGE_THEME } from "@/utils/themes";

const findCaseFromContext = (case_id: number | null, context: DjangoContext | undefined) => {
  if (!context || !case_id) return undefined;

  const cases_query = context.team_context.minor_case_active?.filter((mca) => {
    return mca?.minor_case_round.id === case_id;
  });
  // TODO: maybe better error handling later
  return cases_query.length == 1 ? cases_query[0].minor_case_round : undefined;
};

function EventPage() {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(MAIN_PAGE_THEME);
  }, [setTheme]);

  const [newCases, setNewCases] = useState<JSX.Element[]>([]);
  const [, setDoneCases] = useState<JSX.Element[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [selectedCase, setSelectedCase] = useState<number | null>(null); //TODO: fix -1
  const { context } = useDjangoContext();

  const openModal = (caseID: number) => {
    setSelectedCase(caseID);

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const addBox = (side: "left" | "right") => {
    // return side

    // TODO: fix
    if (side === "left") {
      // Clear the middle column when clicking on the left box
      if (context != null) {
        const solvedCasesFromContext = context.team_context.minor_case_completed;
        // const solvedCasesFromContext = context.team?.minor_case_completed;
        const solvedCases = renderActiveCases(solvedCasesFromContext, openModal);

        setNewCases(solvedCases);
        setDoneCases([]);
      }
    } else {
      if (context != null) {
        const minorCasesFromContext = context.team_context.minor_case_incoming;
        // const minorCasesFromContext = context.team?.minor_case_incoming;
        const incomingCases = renderActiveCases(minorCasesFromContext, openModal);

        setNewCases(incomingCases);
        setDoneCases([]);
      }
    }
  };
  return (
    <div
      className="flex min-h-screen flex-col relative"
      style={{
        backgroundImage: `url(${backdrop})`,
      }}
    >
      <div
        className="flex min-h-screen flex-col relative items-center"
        style={{
          backgroundImage: `url(${shadow})`,
        }}
      >
        <div className="flex flex-1 relative max-w-screen-xl">
          <img className="w-full h-auto object-contain" src={shadowDesk} alt="" />
          <div className="absolute inset-0 flex w-1/4 items-center justify-center z-10 object-contain">
            {/* Left column content */}
            <div
              className=" w-1/2 aspect-[3/4] cursor-pointer bg-blue-200 p-4 object-contain"
              onClick={() => addBox("left")}
            >
              {/* LEFT CONTENT */}
            </div>
          </div>
          <div className="flex w-1/2 flex-col items-center justify-between z-10">
            {/* Middle column content */}
            <div className="flex w-1/2 flex-wrap items-start justify-around bg-gray-500">
              {newCases}
              {/* {doneCases} */}
            </div>
          </div>
          <div className="absolute inset-0 flex w-11/12 items-center justify-end z-10 object-contain">
            {/* Right column content */}
            <div
              className=" w-1/6 aspect-[3/4] cursor-pointer  p-4 object-contain"
              onClick={() => addBox("right")}
            >
              {/* RIGHT CONTENT */}
            </div>
          </div>
          <div
            className="absolute inset-0 flex items-center z-10 object-contain"
            style={{
              width: "50%",
            }}
          >
            {/* Right column content */}
            <div
              className="w-1/6 aspect-[10/4] cursor-pointer bg-blue-200 p-4 object-contain"
              onClick={() => addBox("right")}
            >
              {/* RIGHT CONTENT */}
            </div>
          </div>
        </div>
        {/* Cases row */}
        <div
          className="absolute flex items-center justify-center p-2 bg-blue-200 z-10"
          style={{
            bottom: "10%",
            left: "0",
            right: "0",
          }}
        >
          {/* BOTTOM DESK CONTENT */}
          <ActiveCases openModal={openModal} />
        </div>
        <div className="flex flex-col items-center justify-center  p-4 z-10">
          {/* BELOW DESK CONTENT */}
        </div>
        {/* Modal */}
        <MinorCaseModal
          isOpen={modalOpen}
          closeModal={closeModal}
          cur_case={findCaseFromContext(selectedCase, context)}
        />
      </div>
    </div>
  );
}
export default EventPage;

// import MinorCase from "@/components/MinorCase";
// import { useEffect, useState } from "react";

// // import MinorCase from '../components/MinorCase';

// import MinorCaseModal from "@/components/MinorCaseModal";
// // import { MinorCaseStatus, context } from "../context";
// import { useDjangoContext } from "@/hooks/useDjangoContext";
// import { DjangoContext } from "@/utils/django_types";

// import backdrop from "@/assets/main_page/Backdrop.png";
// import shadow from "@/assets/main_page/Shadow.png";
// import shadowDesk from "@/assets/main_page/ShadowDesk.png";
// import ActiveCases, { renderActiveCases } from "@/components/main_page/ActiveCases";
// import { useTheme } from "@/hooks/useTheme";
// import { MAIN_PAGE_THEME } from "@/utils/themes";

// const findCaseFromContext = (case_id: number | null, context: DjangoContext | undefined) => {
//   if (!context || !case_id) return undefined;

//   const cases_query = context.team_context.minor_case_active?.filter((mca) => {
//     return mca?.minor_case_round.id === case_id;
//   });
//   // TODO: maybe better error handling later
//   return cases_query.length == 1 ? cases_query[0].minor_case_round : undefined;
// };

// function EventPage() {
//   const { setTheme } = useTheme();
//   useEffect(() => {
//     setTheme(MAIN_PAGE_THEME);
//   }, [setTheme]);

//   const [newCases, setNewCases] = useState<JSX.Element[]>([]);
//   const [, setDoneCases] = useState<JSX.Element[]>([]);
//   const [modalOpen, setModalOpen] = useState<boolean>(false);

//   const [selectedCase, setSelectedCase] = useState<number | null>(null); //TODO: fix -1
//   const { context } = useDjangoContext();

//   const openModal = (caseID: number) => {
//     setSelectedCase(caseID);

//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//   };

//   const addBox = (side: "left" | "right") => {
//     // return side

//     // TODO: fix
//     if (side === "left") {
//       // Clear the middle column when clicking on the left box
//       if (context != null) {
//         const solvedCasesFromContext = context.team_context.minor_case_completed;
//         // const solvedCasesFromContext = context.team?.minor_case_completed;
//         const solvedCases = renderActiveCases(solvedCasesFromContext, openModal);

//         setNewCases(solvedCases);
//         setDoneCases([]);
//       }
//     } else {
//       if (context != null) {
//         const minorCasesFromContext = context.team_context.minor_case_incoming;
//         // const minorCasesFromContext = context.team?.minor_case_incoming;
//         const incomingCases = renderActiveCases(minorCasesFromContext, openModal);

//         setNewCases(incomingCases);
//         setDoneCases([]);
//       }
//     }
//   };
//   return (
//     <div className="flex min-h-screen flex-col relative">
//       <div className="flex min-h-screen flex-col relative items-center">
//         {/* Middle rows */}
//         <div className="flex flex-1 relative max-w-screen-xl">
//           <img className="w-full h-auto object-contain" src={shadowDesk} alt="" />
//           {/* Left column */}
//           <div
//             className="absolute inset-y-0 flex items-center justify-center z-10 bg-blue-200 h-10"
//             style={{
//               left: "33.33%", // Start one-third from the left
//               right: "33.33%", // End one-third from the right
//               top: "80%", // Start 80% down
//               bottom: "33.33%", // End two-thirds from the bottom
//             }}
//           >
//             middle
//           </div>
//           <div className="absolute inset-0 flex w-11/12 items-center justify-end z-10 object-contain bg-blue-200">
//             {/* Right column content */}
//             <div className=" w-1/6 object-contain" onClick={() => addBox("right")}>
//               hi there
//             </div>
//           </div>
//         </div>
//         {/* Cases row */}
//         <div className="flex flex-col items-center justify-center  p-4 z-10">
//           {/* BELOW DESK CONTENT */}
//         </div>
//         {/* Modal */}
//       </div>
//     </div>
//   );
// }
// export default EventPage;
