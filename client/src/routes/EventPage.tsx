import { useEffect, useMemo, useState } from "react";

import background from "@/assets/main_page/Backdrop.png";
import shadow from "@/assets/main_page/Shadow.png";
import desk from "@/assets/main_page/ShadowDesk.png";
import MinorCaseModal from "@/components/MinorCaseModal";
import ActiveCases from "@/components/main_page/ActiveCases";
import CompletedCases from "@/components/main_page/CompletedCases";
import CompletedCasesStack from "@/components/main_page/CompletedCasesStack";
import IncomingCasesStack from "@/components/main_page/IncomingCasesStack";
import { ArtWrapperInner } from "@/components/minor_cases/CasePageArt";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { useTheme } from "@/hooks/useTheme";
import type { Round } from "@/utils/django_types";
import { MAIN_PAGE_THEME } from "@/utils/themes";
import { mostRecentSolves } from "@/utils/utils";

interface EventPage {
  setVotingOpen?: (open: boolean) => void;
}

export default function EventPage({ setVotingOpen }: EventPage) {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(MAIN_PAGE_THEME);
  }, [setTheme]);

  const [selectedCase, setSelectedCase] = useState<Round | null>(null);
  const [solvedCasesOpen, setSolvedCasesOpen] = useState(false);

  const { context } = useDjangoContext();

  const solved_cases = useMemo(() => {
    if (!context) return [];
    return mostRecentSolves(context);
  }, [context]);

  return (
    <div
      className="min-h-[90vh]"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div
        className="flex min-h-screen flex-col relative items-center"
        style={{
          backgroundImage: `url(${shadow})`,
        }}
      >
        <ArtWrapperInner background_src={desk} className="relative max-w-screen-xl">
          <div
            className="absolute rounded-xl p-4 align-center"
            style={{ top: "35%", left: "83%", width: "14%", height: "29%" }}
          >
            <IncomingCasesStack
              onClick={() => {
                if (setVotingOpen != undefined) setVotingOpen(true);
              }}
            />
          </div>
          <div
            className="absolute rounded-xl p-4 align-center"
            style={{ top: "20%", left: "29%", width: "50%", height: "37%" }}
          >
            <CompletedCases
              completed_cases={solved_cases}
              solvedCasesOpen={solvedCasesOpen}
              setSelectedCase={setSelectedCase}
            />
          </div>
          <div
            className="absolute rounded-xl p-4 align-center"
            style={{ top: "35%", left: "1%", width: "14%", height: "29%" }}
          >
            <CompletedCasesStack
              completed_cases={solved_cases}
              solvedCasesOpen={solvedCasesOpen}
              setSolvedCasesOpen={setSolvedCasesOpen}
            />
          </div>
          <div
            className="absolute bg-[#f5f5f51f] rounded-xl p-4 align-center"
            style={{ top: "71%", left: "19%", width: "61%", height: "23%" }}
          >
            <ActiveCases setSelectedCase={setSelectedCase} />
          </div>
        </ArtWrapperInner>
      </div>
      <MinorCaseModal
        setSelectedCase={setSelectedCase}
        selectedCase={selectedCase}
        action={`/minorcase/${selectedCase?.slug}`}
      />
    </div>
  );
}
