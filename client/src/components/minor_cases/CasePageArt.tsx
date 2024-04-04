import bottle from "@/assets/minor_cases/exile/bottle.png";
import exile_bg from "@/assets/minor_cases/exile/exile_bg.png";
import painting from "@/assets/minor_cases/exile/painting.png";
import victrola from "@/assets/minor_cases/exile/victrola.png";
import wine from "@/assets/minor_cases/exile/wine.png";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { CASE_PALETTE, MajorCaseEnum } from "@/utils/constants";
import { PuzzleAnswer, cn, getUnlockedPuzzle } from "@/utils/utils";
import { ReactNode, useMemo } from "react";
import RelativeAsset, { AssetProps } from "../RelativeAsset";

const ExileArt = () => {
  return (
    <ArtWrapper className="aspect-w-4 aspect-h-3" background_src={exile_bg}>
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

interface PuzzleAsset extends AssetProps {
  slug: string;
  meta?: boolean;
}

const PuzzleIconWrapper = (props: PuzzleAsset) => {
  const { context } = useDjangoContext();
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
          <p
            className={` p-[0.2rem] font-bold text-center bg-slate-800 group-hover:bg-slate-600 rounded-xl ${props.meta ? "text-[1vw] border-2 border-sky-200" : "text-[0.65vw]"}`}
          >
            {puzzle_answer?.puzzle.name.toUpperCase()}
          </p>
          <p
            className={`answer mt-1 p-[0.2rem] font-bold text-center font-mono drop-shadow ${props.meta ? "text-[1vw]" : "text-[0.8vw]"}`}
            style={{
              color:
                CASE_PALETTE[puzzle_answer.puzzle.round.major_case.slug as MajorCaseEnum]
                  .answerColor,
            }}
          >
            {puzzle_answer?.answer?.toUpperCase()}
          </p>
        </RelativeAsset>
      )}
    </>
  );
};

export const ArtWrapper = ({
  className,
  background_src,
  children,
}: {
  className?: string;
  background_src: string;
  children?: ReactNode;
}) => {
  return (
    <div>
      <div
        className={cn(
          "map relative left-1/2 transform -translate-x-1/2 w-full h-full",
          className,
        )}
      >
        {children}
        <div className="art-bg">
          <img className="art-bg-img" src={background_src} />
        </div>
      </div>
    </div>
  );
};

const CASE_ART_COMPONENT: { [key: string]: JSX.Element } = {
  exile: <ExileArt />,
};

export default function CasePageArt({ case_slug }: { case_slug: string }) {
  return <section className="case-art">{CASE_ART_COMPONENT[case_slug]}</section>;
}
