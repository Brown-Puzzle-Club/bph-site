import MinorCase from "@/components/MinorCase";
import { useMemo, useState } from "react";

// import MinorCase from '../components/MinorCase';

import MinorCaseModal from "@/components/MinorCaseModal";
// import { MinorCaseStatus, context } from "../context";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import {
  DjangoContext,
  MinorCaseActive,
  MinorCaseCompleted,
  MinorCaseIncoming,
} from "@/utils/django_types";
import { getCookie } from "../utils/api";

function renderActiveCases(
  casesRecord: (MinorCaseActive | MinorCaseIncoming | MinorCaseCompleted)[],
  openModal: (caseID: number) => void,
): JSX.Element[] {
  if (casesRecord.length === 0) {
    return [];
  }

  console.log(casesRecord);

  return casesRecord.map((minorCase) => (
    <MinorCase
      key={minorCase.id}
      name={minorCase.minor_case_round.name}
      description={minorCase.minor_case_round.description}
      major_case_name={""}
      major_case_slug={"#TODO: fix"}
      bgColor="pink-100"
      onClick={() => {
        openModal(minorCase.minor_case_round.id);
      }}
    />
  ));
}

const findCaseFromContext = (case_id: number, context: DjangoContext | undefined) => {
  if (!context) return undefined;

  const cases_query = context.team_context.minor_case_active?.filter((mca) => {
    return mca?.minor_case_round.id === case_id;
  });
  // TODO: maybe better error handling later
  return cases_query.length == 1 ? cases_query[0].minor_case_round : undefined;
};

function EventPage() {
  const [newCases, setNewCases] = useState<JSX.Element[]>([]);
  const [, setDoneCases] = useState<JSX.Element[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [selectedCase, setSelectedCase] = useState<number>(-1); //TODO: fix -1
  const [, setOutput] = useState<string>("");
  const { context } = useDjangoContext();

  const active_cases = useMemo(() => {
    if (!context) return [];
    const active_cases = context.team_context.minor_case_active;
    const solved_cases = context.team_context.minor_case_completed;

    // truly active cases are all active that are not completed (solved)
    return active_cases.filter((ac) => {
      return !solved_cases.some((sc) => sc.minor_case_round.slug === ac.minor_case_round.slug);
    });
  }, [context]);

  const submit = async (caseID: number) => {
    const csrftoken = getCookie("csrftoken");

    try {
      const result = await fetch("api/move_minor_case/" + caseID, {
        method: "POST",
        body: JSON.stringify({
          // ...
        }),
        headers: {
          "X-CSRFToken": csrftoken || "",
          "Content-Type": "application/json",
        },
      });

      if (!result.ok) {
        // HTTP response code was not 2xx. Maybe introspect more...
        setOutput(`Error: ${result.status} ${result.statusText}`);
      } else {
        // console.log('hi')
        const res = await result.json();

        // console.log(res)
        setOutput(res["success"]);
      }
    } catch (e) {
      // This error handling will be very poor.
      setOutput(`Error: ${e}`);
    }
  };

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
        backgroundImage: "url('/src/assets/main_page/Backdrop.PNG')",
      }}
    >
      <div
        className="flex min-h-screen flex-col relative"
        style={{
          backgroundImage: "url('/src/assets/main_page/Shadow.PNG')",
        }}
      >
        {/* Top row
        <div className="bg-blue-200 p-4 z-10">Top Row</div> */}
        {/* Middle rows */}
        <div className="flex flex-1 relative">
          <img
            className="w-full h-auto object-contain"
            src=" src/assets/main_page/ShadowDesk.PNG"
            alt=""
          />
          <div className="absolute inset-0 flex w-1/4 items-center justify-center z-10 object-contain">
            {/* Left column content */}
            <div
              className=" w-1/2 aspect-[3/4] cursor-pointer bg-blue-200 p-4 object-contain"
              onClick={() => addBox("left")}
            >
              {" "}
              <p onClick={() => openModal(0)}></p>
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
              className=" w-1/6 aspect-[3/4] cursor-pointer bg-blue-200 p-4 object-contain"
              onClick={() => addBox("right")}
            >
              {/* Box content */}
              <p onClick={() => openModal(0)}></p>
            </div>
          </div>
        </div>
        {/* Shadow desk */}
        <div className="absolute inset-0 bg-no-repeat bg-center bg-contain h-4/5" />
        {/* Cases row */}
        <div className="flex items-center justify-center p-2 bg-blue-200 z-10">
          {/* Render a box for each active case */}
          <div className="flex">{context ? renderActiveCases(active_cases, openModal) : null}</div>
        </div>
        {/* Bottom row */}
        <div className="flex flex-col items-center justify-center  p-4 z-10">
          {/* Yellow bottom box */}
        </div>
        {/* Modal */}
        <MinorCaseModal
          isOpen={modalOpen}
          closeModal={closeModal}
          caseID={selectedCase}
          onSubmit={submit}
          cur_case={findCaseFromContext(selectedCase, context)}
        />
      </div>
    </div>
  );
}
export default EventPage;
