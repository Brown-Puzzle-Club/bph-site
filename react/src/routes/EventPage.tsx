import { useEffect, useState } from 'react';
import MinorCase from '@/components/MinorCase';
import MinorCaseModal from "@/components/MinorCaseModal";
// import { MinorCaseStatus, context } from "../context";
import { getCookie } from "../utils/api";
import { useDjangoContext } from '@/hooks/useDjangoContext';
import { DjangoContext, MinorCaseActive, MinorCaseCompleted, MinorCaseIncoming } from '@/utils/django_types';


function renderActiveCases(casesRecord : (MinorCaseActive| MinorCaseIncoming| MinorCaseCompleted)[], openModal: (caseID: number) => void) : JSX.Element[] {
  if (casesRecord.length === 0) {
    return [];
  }
  return casesRecord.map((minorCase) => (
    <MinorCase 
      key={minorCase.id} 
      name={minorCase.minor_case_round.name} 
      description={minorCase.minor_case_round.description} 
      major_case_name={''} 
      major_case_slug={'#TODO: fix'} 
      bgColor="pink-100"
      onClick={() => {openModal(minorCase.minor_case_round.id)}}
    />
  ));

}


function EventPage() {
  const [newCases, setNewCases] = useState<JSX.Element[]>([]);
  const [ , setDoneCases] = useState<JSX.Element[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCase, setSelectedCase] = useState<number>(-1); //TODO: fix -1
  const [output, setOutput] = useState<string>('');
  const { FetchContext } = useDjangoContext();
  const [context, setContext] = useState<DjangoContext>(); 


  useEffect(() => {
    FetchContext().then((context) => {
      console.log(context);
      setContext(context);
    })}, [FetchContext]);

  const submit = async (caseID : number) => {

    const csrftoken = getCookie('csrftoken');
    
    try {
      const result = await fetch("api/move_minor_case/" + caseID, {
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
        // console.log(res)
        setOutput(res['success']);
      }
    } catch (e) {
      // This error handling will be very poor.
      setOutput(`Error: ${e}`);
    }
  };


  const openModal = (caseID : number) => {
    setSelectedCase(caseID);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const addBox = (side: 'left' | 'right') => {
    // return side
    // TODO: fix
    if (side === 'left') {
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
    <div className="flex flex-col min-h-screen">
      {/* <button onClick={submit(3)}>Submit test API</button> */}
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
            {newCases}
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
          {context? renderActiveCases(context.team_context.minor_case_active, openModal) : null}
        </div>
      </div>

      {/* Bottom row */}
      <div className="bg-blue-200 p-4 flex flex-col justify-center items-center">
        {/* Yellow bottom box */}
      </div>

      {/* Modal */}
      <MinorCaseModal isOpen={modalOpen} closeModal={closeModal} caseID={selectedCase} onSubmit={submit} />
    </div>
  );
}

export default EventPage