import { useMemo } from "react";

import { MajorCaseEnum } from "@/utils/constants";
import type { DjangoContext } from "@/utils/django_types";
import type { PuzzleAnswer } from "@/utils/utils";
import { getUnlockedPuzzles } from "@/utils/utils";

export default function GamesRoundPage({ context }: { context: DjangoContext }) {
  // TODO: add buttons for the three games + the Obituary.
  // They don't need to check if you have the puzzle unlocked, becasue they will :P

  // once a puzzle is solved, this object will have the `answer` field filled in.
  // TODO: on the buttons for the games + Obituary, check if the puzzle is solved and show a check mark if it is.
  // You do not need to show the answer.
  const unlocked_puzzles: PuzzleAnswer[] | null = useMemo(() => {
    if (!context?.team_context) {
      return null;
    }

    return getUnlockedPuzzles(MajorCaseEnum.SOCIAL_DEDUCTION, "nyt", context);
  }, [context]);

  console.log("puzz:", unlocked_puzzles);

  return <>hello there</>;
}
