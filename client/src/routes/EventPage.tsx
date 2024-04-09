import { useEffect } from "react";

import background from "@/assets/main_page/Backdrop.png";
import cassette from "@/assets/main_page/D1.png";
import cassetteHover from "@/assets/main_page/D2.png";
import desk from "@/assets/main_page/MainPageNew.png";
import thread from "@/assets/main_page/RT1.png";
import threadHover from "@/assets/main_page/RT2.png";
import letter from "@/assets/main_page/SD1.png";
import letterHover from "@/assets/main_page/SD2.png";
import shadow from "@/assets/main_page/Shadow.png";
import RelativeAsset from "@/components/RelativeAsset";
import ActiveCases from "@/components/main_page/ActiveCases";
import CompletedCases from "@/components/main_page/CompletedCases";
import IncomingCasesStack from "@/components/main_page/IncomingCasesStack";
import Phone from "@/components/main_page/Phone";
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
        <ArtWrapperInner background_src={desk} className="max-w-screen-xl">
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
          <RelativeAsset
            imageSrc={cassette}
            hoverImageSrc={cassetteHover}
            linkTo="/majorcase/data"
            extraClasses="w-[15%] drop-shadow-[0_4px_4px_rgba(121,22,159,1)] hover:drop-shadow-[0_16px_16px_rgba(121,22,159,1)]"
            extraStyles={{
              top: "12%",
              left: "45%",
            }}
          />
          <RelativeAsset
            imageSrc={thread}
            hoverImageSrc={threadHover}
            linkTo="/majorcase/colored-thread"
            extraClasses="w-[15%] drop-shadow-[0_4px_4px_rgba(255,0,0,1)] hover:drop-shadow-[0_16px_16px_rgba(255,0,0,1)]"
            extraStyles={{
              top: "23%",
              left: "80%",
            }}
          />
          <RelativeAsset
            imageSrc={letter}
            hoverImageSrc={letterHover}
            linkTo="/majorcase/social-deduction"
            extraClasses="w-[15%] rotate-[-23deg] drop-shadow-[0_4px_4px_rgba(48,205,93,1)] hover:drop-shadow-[0_16px_16px_rgba(48,205,93,1)]"
            extraStyles={{
              top: "15%",
              left: "65%",
            }}
          />
          <Phone />
        </ArtWrapperInner>
      </div>
    </div>
  );
}
