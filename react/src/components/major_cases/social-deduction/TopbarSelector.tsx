

import { ReactNode } from 'react';
import { SelectedPanel } from '../../../routes/major_cases/SocialDeduction';
import { NUM_CASES_SOLVED } from '../../../utils/major_cases/social-deduction/constants';

const TopbarSelector = ({children, setPanel}: {children: ReactNode, setPanel: (panel: SelectedPanel) => void}) => {
  return (
    <div className="sidebar-selector py-10 px-[20px] md:px-[10rem]" style={{backgroundColor: "#1c160d"}}>
      <div className="pt-5 rounded-md" style={{backgroundColor: "#352c20"}}>
        <div className="flex justify-center space-x-2 px-10">
          <button className='w-full md:w-auto' onClick={() => setPanel(SelectedPanel.RULES)}>RULES</button>
          <button className='w-full md:w-auto' onClick={() => setPanel(SelectedPanel.ROLES)}>ROLES</button>
          <button className='w-full md:w-auto' onClick={() => setPanel(SelectedPanel.CHRONOLOGY)}>CHRONOLOGY</button>
          {NUM_CASES_SOLVED > 3 ? <button className='w-full md:w-auto' onClick={() => setPanel(SelectedPanel.VERDICT)}>VERDICT</button> : <></>}
        </div>
        {children}
      </div>
    </div>
  );
}

export default TopbarSelector;