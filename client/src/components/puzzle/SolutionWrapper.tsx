import { BeatLoader } from "react-spinners";

import { usePuzzle } from "@/hooks/useDjangoContext";

export default function SolutionWrapper({ puzzle_slug }: { puzzle_slug: string }) {
  const { data: puzzle } = usePuzzle(puzzle_slug);

  if (!puzzle) {
    return <BeatLoader className="justify-center content-center p-4" color={"#fff"} size={12} />;
  }

  return (
    <div>
      <h1>Solution to {puzzle_slug}</h1>
      {puzzle && (
        <div>
          <h2>{puzzle.name}</h2>
          <p>{puzzle.solution}</p>
        </div>
      )}
    </div>
  );
}
