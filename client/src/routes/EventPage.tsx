import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { FaCheck } from "react-icons/fa";

import background from "@/assets/main_page/Backdrop.png";
import cassette from "@/assets/main_page/D1.png";
import cassetteHover from "@/assets/main_page/D2.png";
import desk from "@/assets/main_page/MainPageNew.png";
import thread from "@/assets/main_page/RT1.png";
import threadHover from "@/assets/main_page/RT2.png";
import letter from "@/assets/main_page/SD1.png";
import letterHover from "@/assets/main_page/SD2.png";
import shadow from "@/assets/main_page/Shadow.png";
import type { AssetProps } from "@/components/RelativeAsset";
import RelativeAsset from "@/components/RelativeAsset";
import ActiveCases from "@/components/main_page/ActiveCases";
import CompletedCases from "@/components/main_page/CompletedCases";
import IncomingCasesStack from "@/components/main_page/IncomingCasesStack";
import Phone from "@/components/main_page/Phone";
import { ArtWrapperInner } from "@/components/minor_cases/CasePageArt";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { useTheme } from "@/hooks/useTheme";
import useBPHStore from "@/stores/useBPHStore";
import { getMainPageIdleDialogueWithMajorCases } from "@/utils/bluenoir_dialogue";
import { MajorCaseEnum } from "@/utils/constants";
import { MAIN_PAGE_THEME } from "@/utils/themes";

interface MajorCaseIconProps extends AssetProps {
  majorCase: MajorCaseEnum;
}

const MajorCaseIcon = (props: MajorCaseIconProps) => {
  const { data: context } = useDjangoContext();
  return (
    context?.team_context &&
    context.team_context.major_case_puzzles[props.majorCase] && (
      <RelativeAsset linkTo={`/majorcase/${props.majorCase}`} {...props}>
        {context.team_context.solves[
          context.team_context.major_case_puzzles[props.majorCase].slug
        ] && (
          <FaCheck
            className="pointer-events-none absolute select-none hover:cursor-pointer text-[5vw] text-[#ffffff80]"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </RelativeAsset>
    )
  );
};

export default function EventPage() {
  const { setTheme } = useTheme();
  const { data: context } = useDjangoContext();
  const setBluenoirDialogue = useBPHStore((state) => state.setRandomDialogueFunction);
  const setVotingOpen = useBPHStore((state) => state.setVotingModalOpen);
  const setStoryLine = useBPHStore((state) => state.setStoryline);

  const [fistVisit, setFirstVisit] = useLocalStorage("firstVisit", true);

  useEffect(() => {
    setTheme(MAIN_PAGE_THEME);
  }, [setTheme]);

  useEffect(() => {
    if (fistVisit) {
      setStoryLine("main-page-intro");
      setFirstVisit(false);
    }
  });

  useEffect(() => {
    if (context) setBluenoirDialogue(() => getMainPageIdleDialogueWithMajorCases(context));
  }, [context, setBluenoirDialogue]);

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
                console.log("called!");
                setVotingOpen(true);
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
          <MajorCaseIcon
            majorCase={MajorCaseEnum.DATA}
            imageSrc={cassette}
            hoverImageSrc={cassetteHover}
            linkTo="/majorcase/data"
            extraClasses="w-[15%] drop-shadow-[0_4px_4px_rgba(121,22,159,1)] hover:drop-shadow-[0_16px_16px_rgba(121,22,159,1)] rotate-[30deg]"
            extraStyles={{
              top: "15%",
              left: "38%",
            }}
          />
          <MajorCaseIcon
            majorCase={MajorCaseEnum.COLORED_THREAD}
            imageSrc={thread}
            hoverImageSrc={threadHover}
            extraClasses="w-[15%] drop-shadow-[0_4px_4px_rgba(123,10,10,1)] hover:drop-shadow-[0_16px_16px_rgba(123,10,10,1)]"
            extraStyles={{
              top: "16%",
              left: "52%",
            }}
          />
          <MajorCaseIcon
            majorCase={MajorCaseEnum.SOCIAL_DEDUCTION}
            imageSrc={letter}
            hoverImageSrc={letterHover}
            linkTo="/majorcase/social-deduction"
            extraClasses="w-[15%] rotate-[-23deg] drop-shadow-[0_4px_4px_rgba(85,171,110,1)] hover:drop-shadow-[0_16px_16px_rgba(85,171,110,1)]"
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
