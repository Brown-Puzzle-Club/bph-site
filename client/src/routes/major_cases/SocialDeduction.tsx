import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Characters from "../../components/major_cases/social-deduction/Characters";
import Chronology from "../../components/major_cases/social-deduction/Chronology";
import Roles from "../../components/major_cases/social-deduction/Roles";
import Rules from "../../components/major_cases/social-deduction/Rules";
import TopbarSelector from "../../components/major_cases/social-deduction/TopbarSelector";
import Verdict from "../../components/major_cases/social-deduction/Verdict";

import { useDjangoContext } from "@/hooks/useDjangoContext";
import { DjangoContext } from "@/utils/django_types";
import { CHAR_NAME, numberOfCasesSolves } from "@/utils/major_cases/social-deduction/constants";

export enum SelectedPanel {
  RULES,
  ROLES,
  CHRONOLOGY,
  VERDICT,
}

export default function SocialDeduction() {
  const [panel, setPanel] = useState<SelectedPanel>(SelectedPanel.RULES);

  const { FetchContext } = useDjangoContext();
  const [context, setContext] = useState<DjangoContext>();

  useEffect(() => {
    FetchContext().then((context) => {
      // console.log(context);
      setContext(context);
    });
  }, [FetchContext]);

  const CHAR_NAMES = CHAR_NAME(context);
  const NUM_CASES_SOLVED = numberOfCasesSolves(context);

  return (
    <div className="text-[white]">
      <Characters CHAR_NAMES={CHAR_NAMES} />
      <TopbarSelector cur_panel={panel} setPanel={setPanel} NUM_CASES_SOLVED={NUM_CASES_SOLVED}>
        {panel === SelectedPanel.RULES && <Rules />}
        {panel === SelectedPanel.ROLES && <Roles />}
        {panel === SelectedPanel.CHRONOLOGY && <Chronology CHAR_NAMES={CHAR_NAMES} />}
        {panel === SelectedPanel.VERDICT && (
          <DndProvider backend={HTML5Backend}>
            <Verdict CHAR_NAMES={CHAR_NAMES} />
          </DndProvider>
        )}
      </TopbarSelector>
    </div>
  );
}
