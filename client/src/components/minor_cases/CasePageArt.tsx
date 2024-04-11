import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import birb_bg from "@/assets/minor_cases/birbs/birb_bg.png";
import thebirb from "@/assets/minor_cases/birbs/thebirb.png";
import mr_cat from "@/assets/minor_cases/cats/mr_cat.jpg";
import bottle from "@/assets/minor_cases/exile/bottle.png";
import exile_bg from "@/assets/minor_cases/exile/exile_bg.png";
import painting from "@/assets/minor_cases/exile/painting.png";
import victrola from "@/assets/minor_cases/exile/victrola.png";
import wine from "@/assets/minor_cases/exile/wine.png";
import labyrinth_cover from "@/assets/minor_cases/labyrinth/labyrinth.png";
import whale_bg from "@/assets/minor_cases/whales/background_whale2.png";
import flowers from "@/assets/minor_cases/whales/flowers.png";
import parrot from "@/assets/minor_cases/whales/parrot.png";
import sheep from "@/assets/minor_cases/whales/sheep.png";
import stool from "@/assets/minor_cases/whales/stool.png";
import waterline from "@/assets/minor_cases/whales/waterline.png";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { useTheme } from "@/hooks/useTheme";
import type { MajorCaseEnum } from "@/utils/constants";
import { CASE_PALETTE } from "@/utils/constants";
import { BIRB_THEME, WHALE_THEME } from "@/utils/themes";
import type { PuzzleAnswer } from "@/utils/utils";
import { cn, getUnlockedPuzzle } from "@/utils/utils";

import type { AssetProps } from "../RelativeAsset";
import RelativeAsset from "../RelativeAsset";

const ExileArt = () => {
  return (
    <ArtWrapper
      className="aspect-w-4 aspect-h-3 max-w-screen-xl left-1/2 transform -translate-x-1/2"
      background_src={exile_bg}
    >
      <PuzzleIconWrapper
        slug="still-at-the-restaurant"
        imageSrc={painting}
        extraStyles={{
          top: "14%",
          left: "41%",
          width: "13%",
          zIndex: 3,
        }}
      />
      <PuzzleIconWrapper
        slug="ocean-wave-blues"
        imageSrc={bottle}
        extraStyles={{
          top: "21%",
          left: "82%",
          width: "13%",
          zIndex: 3,
        }}
      />
      <PuzzleIconWrapper
        slug="illicit-affairs"
        imageSrc={wine}
        extraStyles={{
          top: "35%",
          left: "7.5%",
          width: "8.5%",
          zIndex: 3,
        }}
      />
      <PuzzleIconWrapper
        slug="the-day-he-died"
        imageSrc={victrola}
        extraStyles={{
          top: "33%",
          left: "64%",
          width: "10%",
          zIndex: 3,
        }}
        meta
      />
    </ArtWrapper>
  );
};

const WhaleArt = () => {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(WHALE_THEME);
  });

  return (
    <ArtWrapper className="" background_src={whale_bg}>
      <PuzzleIconWrapper
        slug="underwater-flora"
        imageSrc={flowers}
        extraStyles={{
          top: "40%",
          left: "63%",
          width: "10%",
          zIndex: 3,
        }}
        answer_bg
      />
      <PuzzleIconWrapper
        slug="waterlines"
        imageSrc={waterline}
        extraStyles={{
          top: "20%",
          left: "42%",
          width: "13%",
          zIndex: 3,
        }}
        answer_bg
      />
      <PuzzleIconWrapper
        slug="shoot"
        imageSrc={parrot}
        extraStyles={{
          top: "19%",
          left: "35%",
          width: "7%",
          zIndex: 3,
        }}
        answer_bg
      />
      <PuzzleIconWrapper
        slug="back-in-wales"
        imageSrc={sheep}
        extraStyles={{
          top: "25%",
          left: "59%",
          width: "13%",
          zIndex: 3,
        }}
        answer_bg
      />
      <PuzzleIconWrapper
        slug="whelp"
        imageSrc={stool}
        extraStyles={{
          top: "42%",
          left: "46%",
          width: "14%",
          zIndex: 3,
        }}
        answer_bg
      />
    </ArtWrapper>
  );
};

const BirbsArt = () => {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(BIRB_THEME);
  });

  return (
    <ArtWrapper background_src={birb_bg}>
      <PuzzleIconWrapper
        slug="birbs-at-brown"
        imageSrc={thebirb}
        extraStyles={{ top: "36%", left: "7%", width: "28%", zIndex: 3 }}
        meta
        answer_bg
      />
    </ArtWrapper>
  );
};

const LabyrinthArt = () => {
  return (
    <ArtWrapper
      className="max-w-[400px] pt-2 left-1/2 transform -translate-x-1/2 drop-shadow-[0_15px_15px_rgba(255,255,255,0.3)]"
      background_src={labyrinth_cover}
      linkTo="/puzzle/labyrinth-puzz"
    />
  );
};

const MrCatArt = () => {
  return (
    <ArtWrapper
      className="max-w-[400px] pt-2 left-1/2 transform -translate-x-1/2 drop-shadow-[0_15px_15px_rgba(255,255,255,0.3)]"
      background_src={mr_cat}
      linkTo="/puzzle/mr-cat"
    />
  );
};

interface PuzzleAsset extends AssetProps {
  slug: string;
  meta?: boolean;
  answer_bg?: boolean;
}

const PuzzleIconWrapper = (props: PuzzleAsset) => {
  const { data: context } = useDjangoContext();
  const { slug } = props;

  const puzzle_answer: PuzzleAnswer | null = useMemo(() => {
    const case_slug = window.location.pathname.split("/").pop();
    if (!context?.team_context || !case_slug) {
      return null;
    }
    return getUnlockedPuzzle(slug, context, case_slug);
  }, [context, slug]);

  return (
    <>
      {puzzle_answer && (
        <RelativeAsset
          extraClasses={`group hover:cursor-pointer ${!props.hoverImageSrc ? "hover:drop-shadow-[0_15px_15px_rgba(255,255,255,0.2)]" : ""}`}
          {...props}
          linkTo={`/puzzle/${slug}`}
        >
          <div className="flex flex-col items-center">
            <span
              className={` p-[0.2rem] font-bold text-center bg-slate-800 group-hover:bg-slate-600 rounded-xl ${props.meta ? "text-[1vw] border-2 border-sky-200" : "text-[0.65vw]"}`}
            >
              {puzzle_answer?.puzzle.name.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span
              className={cn(
                `answer mt-1 p-[0.2rem] font-bold text-center font-mono drop-shadow ${props.meta ? "text-[1vw]" : "text-[0.8vw]"}`,
                props.answer_bg ? "bg-[#262e3a87] rounded-xl" : "",
              )}
              style={{
                color:
                  CASE_PALETTE[puzzle_answer.puzzle.round.major_case.slug as MajorCaseEnum]
                    .answerColor,
              }}
            >
              {puzzle_answer?.answer?.toUpperCase()}
            </span>
          </div>
        </RelativeAsset>
      )}
    </>
  );
};

export const ArtWrapperInner = ({
  className,
  background_src,
  children,
}: {
  className?: string;
  background_src: string;
  children?: ReactNode;
}) => {
  return (
    <div className={cn("map relative w-full h-full", className)}>
      {children}
      <img className="art-bg-img w-full h-auto object-contain" src={background_src} />
    </div>
  );
};

export const ArtWrapper = (props: {
  className?: string;
  outerClassName?: string;
  background_src: string;
  children?: ReactNode;
  verticalCenter?: boolean;
  linkTo?: string;
}) => {
  return !props.linkTo ? (
    <div className={props.outerClassName}>
      <ArtWrapperInner {...props} />
    </div>
  ) : (
    <Link to={props.linkTo} className={props.outerClassName}>
      <ArtWrapperInner {...props} />
    </Link>
  );
};

const CASE_ART_COMPONENT: { [key: string]: JSX.Element } = {
  exile: <ExileArt />,
  whales: <WhaleArt />,
  "birbs-at-brown": <BirbsArt />,
  "god-of-the-labyrinth": <LabyrinthArt />,
  cats: <MrCatArt />,
};

export default function CasePageArt({ case_slug }: { case_slug: string }) {
  return CASE_ART_COMPONENT[case_slug];
}
