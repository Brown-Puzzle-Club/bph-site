import test_img from "@/assets/minor_cases/exile/clown.png";
import exile_bg from "@/assets/minor_cases/exile/exile_bg.png";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { PuzzleAnswer, cn, getUnlockedPuzzle } from "@/utils/utils";
import { ReactNode, useMemo } from "react";
import RelativeAsset, { AssetProps } from "../RelativeAsset";

const ExileArt = () => {
  return (
    <ArtWrapper className="aspect-w-4 aspect-h-3" background_src={exile_bg}>
      <PuzzleIconWrapper
        slug="epuzz1"
        imageSrc={test_img}
        extraStyles={{
          top: "14%",
          left: "44%",
          width: "7%",
          zIndex: 3,
        }}
      />
      <PuzzleIconWrapper
        slug="epuzz1"
        imageSrc={test_img}
        extraStyles={{
          top: "14%",
          left: "85%",
          width: "7%",
          zIndex: 3,
        }}
      />
      <PuzzleIconWrapper
        slug="epuzz1"
        imageSrc={test_img}
        extraStyles={{
          top: "34%",
          left: "8%",
          width: "7%",
          zIndex: 3,
        }}
      />
      <PuzzleIconWrapper
        slug="epuzz1"
        imageSrc={test_img}
        extraStyles={{
          top: "44%",
          left: "45%",
          width: "14%",
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
    <RelativeAsset
      extraClasses={`group hover:cursor-pointer ${!props.hoverImageSrc ? "hover:drop-shadow-[0_15px_15px_rgba(255,255,255,0.2)]" : ""}`}
      {...props}
      linkTo={`/puzzle/${slug}`}
    >
      <p
        className={` p-[0.2rem] font-bold text-center bg-slate-800 group-hover:bg-slate-600 rounded-xl ${props.meta ? "text-[1vw]" : "text-[0.65vw]"}`}
      >
        {puzzle_answer?.puzzle.name.toUpperCase()}
      </p>
      <p
        className={`answer mt-1 p-[0.2rem] font-bold text-center text-[#98ff98] font-mono drop-shadow ${props.meta ? "text-[1vw]" : "text-[0.8vw]"}`}
      >
        {puzzle_answer?.answer?.toUpperCase()}
      </p>
    </RelativeAsset>
  );
};

const ArtWrapper = ({
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
          "map relative left-1/2 transform -translate-x-1/2 max-w-screen-xl w-full h-full",
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
