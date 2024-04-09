import { useEffect } from "react";

import background from "@/assets/main_page/Backdrop.png";
import desk from "@/assets/main_page/MainPageNew.png";
import shadow from "@/assets/main_page/Shadow.png";
import ActiveCases from "@/components/main_page/ActiveCases";
import CompletedCases from "@/components/main_page/CompletedCases";
import IncomingCasesStack from "@/components/main_page/IncomingCasesStack";
import { ArtWrapperInner } from "@/components/minor_cases/CasePageArt";
import { useTheme } from "@/hooks/useTheme";
import { MAIN_PAGE_THEME } from "@/utils/themes";

interface EventPage {
  setVotingOpen?: (open: boolean) => void;
}

export default function EventPage({ setVotingOpen }: EventPage) {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(MAIN_PAGE_THEME);
  }, [setTheme]);

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
          <CompletedCases />
          <div
            className="absolute bg-[#f5f5f51f] rounded-xl p-4 align-center"
            style={{ top: "71%", left: "19%", width: "61%", height: "23%" }}
          >
            <ActiveCases />
          </div>
        </ArtWrapperInner>
      </div>
    </div>
  );
}
