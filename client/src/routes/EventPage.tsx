import background from "@/assets/main_page/Backdrop.png";
import shadow from "@/assets/main_page/Shadow.png";
import desk from "@/assets/main_page/ShadowDesk.png";
import MinorCaseModal from "@/components/MinorCaseModal";
import ActiveCases from "@/components/main_page/ActiveCases";
import CompletedCases from "@/components/main_page/CompletedCases";
import IncomingCases from "@/components/main_page/IncomingCases";
import { ArtWrapperInner } from "@/components/minor_cases/CasePageArt";
import { useTheme } from "@/hooks/useTheme";
import { Round } from "@/utils/django_types";
import { MAIN_PAGE_THEME } from "@/utils/themes";
import { useEffect, useState } from "react";

export default function EventPage() {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(MAIN_PAGE_THEME);
  }, [setTheme]);

  const [selectedCase, setSelectedCase] = useState<Round | null>(null);

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
            <IncomingCases />
          </div>
          <div
            className="absolute bg-[#f5f5f51f] rounded-xl p-4 align-center"
            style={{ top: "71%", left: "19%", width: "61%", height: "23%" }}
          >
            {/* Content for the first region */}
            <ActiveCases setSelectedCase={setSelectedCase} />
          </div>
          <div
            className="absolute rounded-xl p-4 align-center"
            style={{ top: "35%", left: "1%", width: "14%", height: "29%" }}
          >
            <CompletedCases />
          </div>
        </ArtWrapperInner>
      </div>
      {selectedCase && <MinorCaseModal setCurrentCase={setSelectedCase} cur_case={selectedCase} />}
    </div>
  );
}
