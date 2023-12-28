

import { ReactNode } from 'react';
import { SelectedPanel } from '../../../routes/major_cases/SocialDeduction';

const TopbarSelector = ({children, setPanel}: {children: ReactNode, setPanel: (panel: SelectedPanel) => void}) => {
  return (
    // 6.5rem for normal screensize, some vw for smaller screensizes
    <div className="sidebar-selector py-10 px-[20px] md:px-[10rem]" style={{backgroundColor: "#1c160d"}}>
      {/* TAILWIND CENTER DIV, HAVE ALL ITEMS FLEX IN SAME LINE */}
      <div className="pt-5 rounded-md" style={{backgroundColor: "#796d54"}}>
        {/* MAKE BUTTONS SIZE CONSISTENT TO THE TOTAL SCREEN SIZE */}
        <div className="flex justify-center space-x-2 px-10">
          <button className='w-full md:w-auto' onClick={() => setPanel(SelectedPanel.RULES)}>RULES</button>
          <button className='w-full md:w-auto' onClick={() => setPanel(SelectedPanel.ROLES)}>ROLES</button>
          <button className='w-full md:w-auto' onClick={() => setPanel(SelectedPanel.CHRONOLOGY)}>CHRONOLOGY</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default TopbarSelector;