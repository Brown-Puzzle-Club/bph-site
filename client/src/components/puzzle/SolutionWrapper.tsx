import { useMemo } from "react";
import { BeatLoader } from "react-spinners";

import { usePuzzle } from "@/hooks/useDjangoContext";
import { MajorCaseEnum, toPuzzleStyle } from "@/utils/constants";

import BackButton from "../BackButton";
import Spoiler from "../Spoiler";
import MarkdownWrapper from "./MarkdownWrapper";

export default function SolutionWrapper({ puzzle_slug }: { puzzle_slug: string }) {
  const { data: puzzle } = usePuzzle(puzzle_slug);

  const isMajorCase = useMemo(() => {
    return Object.values(MajorCaseEnum).includes(puzzle_slug as MajorCaseEnum);
  }, [puzzle_slug]);

  if (!puzzle) {
    return <BeatLoader className="justify-center content-center p-4" color={"#fff"} size={12} />;
  }

  return (
    <div>
      <BackButton to={isMajorCase ? `/majorcase/${puzzle_slug}` : `/puzzle/${puzzle_slug}`} />
      <h1 className="text-center py-6 font-bold text-4xl capitalize">
        Solution to <span className="font-mono bg-slate-900 rounded-md p-2">{puzzle.name}</span>
      </h1>
      {puzzle && (
        <div className="text-center text-xl">
          <p>
            <b>ANSWER: </b>
            <Spoiler bodyText={puzzle.answer} className="text-[green]" />
          </p>
          <MarkdownWrapper
            markdown={puzzle.solution}
            puzzleStyle={toPuzzleStyle(puzzle.round.major_case.slug)}
          />
        </div>
      )}
    </div>
  );
}
