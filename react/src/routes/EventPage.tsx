import { useState } from 'react';
// import MinorCase from '../components/MinorCase';
import MinorCaseModal from "@/components/MinorCaseModal";
// import { MinorCaseStatus, context } from "../context";
import { getCookie } from "../utils/api";

// function renderActiveCases(casesRecord: MinorCaseStatus | undefined, openModal: (caseName: string) => void) : JSX.Element[] {
//   return casesRecord? Object.entries(casesRecord).map(([minorCase, values]) => (
//     // <MinorCase 
//     //   key={minorCase} 
//     //   name={values.name} 
//     //   description={values.description} 
//     //   major_case_name={values.major_case_name} 
//     //   major_case_slug={values.major_case_slug} 
//     //   bgColor="pink-100"
//     //   onClick={() => {openModal(values.name)}}
//     // />
//   )) : [];
// }

function EventPage() {
  // const [newCases, setNewCases] = useState<JSX.Element[]>([]);
  // const [, setDoneCases] = useState<JSX.Element[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  // const [selectedCase, setSelectedCase] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  const submit = async () => {

    const csrftoken = getCookie('csrftoken');
    
    try {
      const result = await fetch("/move_minor_case/admin/sd-mc-1/", {
        method: 'POST',
        body: JSON.stringify({
          // ...
        }),
        headers: { "X-CSRFToken": csrftoken || '', 'Content-Type': 'application/json' },
      });

      if (!result.ok) { 
        // HTTP response code was not 2xx. Maybe introspect more...
        setOutput(`Error: ${result.status} ${result.statusText}`);
      } else {
        // console.log('hi')
        const res = await result.json();
        console.log(res)
        setOutput(res['success']);
      }
    } catch (e) {
      // This error handling will be very poor.
      setOutput(`Error: ${e}`);
    }
  };

  // const openModal = (caseName: string) => {
  //   setSelectedCase(caseName);
  //   setModalOpen(true);
  // };

  const closeModal = () => {
    setModalOpen(false);
  };

  const addBox = (side: 'left' | 'right') => {
    return side
    // TODO: fix
    // if (side === 'left') {
    //   // Clear the middle column when clicking on the left box
    //   if (context != null) {
    //     const solvedCasesFromContext = context.team?.minor_case_completed;
    //     const solvedCases = renderActiveCases(solvedCasesFromContext, openModal);

    //     setNewCases(solvedCases);
    //     setDoneCases([]);
    //   }
    // } else {
    //   if (context != null) {
    //     const minorCasesFromContext = context.team?.minor_case_incoming;
    //     const incomingCases = renderActiveCases(minorCasesFromContext, openModal);

    //     setNewCases(incomingCases);
    //     setDoneCases([]);
    //   }
    // }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <button onClick={submit}>Submit test API</button>
      API OUTPUT: {output}
      {/* Top row */}
      <div className="bg-blue-200 p-4">
        {/* Top row content */}
        Top Row
      </div>

      {/* Middle rows */}
      <div className="flex-1 flex">
        <div className="w-1/4 bg-gray-300 flex flex-col justify-center items-center">
          {/* Left column content */}
          <div className="bg-blue-200 p-4 w-3/4 cursor-pointer h-1/2" onClick={() => addBox('left')}>
            {/* Box content */}
            Left Box
          </div>
        </div>
        <div className="w-1/2 bg-gray-500 flex flex-col justify-between items-center">
          {/* Middle column content */}
          <div className="w-1/2 bg-gray-500 flex flex-wrap justify-around items-start">
            {/* {newCases} */}
            {/* {doneCases} */}
          </div>
        </div>
        <div className="w-1/4 bg-gray-300 flex flex-col justify-center items-center">
          {/* Right column content */}
          <div className="bg-green-200 p-4 w-3/4 cursor-pointer h-1/2" onClick={() => addBox('right')}>
            {/* Box content */}
            Right Box
          </div>
        </div>
      </div>

      {/* Cases row */}
      <div className="bg-blue-200 p-4 flex justify-center items-center">
        {/* Render a box for each active case */}
        <div className="flex">
          {/* {context? renderActiveCases(context.team?.minor_case_active, openModal) : null} */}
        </div>
      </div>

      {/* Bottom row */}
      <div className="bg-blue-200 p-4 flex flex-col justify-center items-center">
        {/* Yellow bottom box */}
      </div>

      {/* Modal */}
      <MinorCaseModal isOpen={modalOpen} closeModal={closeModal} caseName={"TODO: fix"} />
    </div>
  );
}

export default EventPage