import { useState } from "react";
import Characters from "../../components/major_cases/social-deduction/Characters";
import Chronology from "../../components/major_cases/social-deduction/Chronology";
import Roles from "../../components/major_cases/social-deduction/Roles";
import Rules from "../../components/major_cases/social-deduction/Rules";
import TopbarSelector from "../../components/major_cases/social-deduction/TopbarSelector";
import Verdict from "../../components/major_cases/social-deduction/Verdict";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export enum SelectedPanel {
  RULES,
  ROLES,
  CHRONOLOGY,
  VERDICT,
}

export default function SocialDeduction() {

  const [panel, setPanel] = useState<SelectedPanel>(SelectedPanel.RULES);

  return (
    <div>
      <Characters />
      <TopbarSelector setPanel={setPanel}>
        {panel === SelectedPanel.RULES && <Rules />}
        {panel === SelectedPanel.ROLES && <Roles />}
        {panel === SelectedPanel.CHRONOLOGY && <Chronology />}
        {panel === SelectedPanel.VERDICT && <DndProvider backend={HTML5Backend}><Verdict /></DndProvider>}
      </TopbarSelector>
    </div>
  );
}
