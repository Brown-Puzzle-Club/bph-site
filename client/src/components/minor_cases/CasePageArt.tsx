import test_img from "@/assets/minor_cases/exile/clown.png";
import exile_bg from "@/assets/minor_cases/exile/exile_bg.png";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { Puzzle } from "@/utils/django_types";
import { cn } from "@/utils/utils";
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
    </ArtWrapper>
  );
};

interface PuzzleAsset extends AssetProps {
  slug: string;
}

const PuzzleIconWrapper = (props: PuzzleAsset) => {
  const { context } = useDjangoContext();
  const { slug } = props;

  const unlocked_puzzle: Puzzle | null = useMemo(() => {
    const case_slug = window.location.pathname.split("/").pop() as string;
    console.log(Object.entries(context?.team_context?.unlocks || {}));
    for (const [, major_case] of Object.entries(context?.team_context?.unlocks || {})) {
      if (major_case[case_slug]?.[slug]) {
        return major_case[case_slug][slug];
      }
    }
    return null;
  }, [context, slug]);

  if (!context?.team_context || !unlocked_puzzle) {
    return null;
  }

  return (
    <RelativeAsset extraClasses="group hover:cursor-pointer" {...props} linkTo={`/puzzle/${slug}`}>
      <p className="text-[0.8vw] font-bold text-center bg-slate-800 group-hover:bg-slate-400 rounded-xl">
        {unlocked_puzzle.name}
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
