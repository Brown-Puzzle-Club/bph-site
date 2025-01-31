import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { DjangoContext, Puzzle, Round } from "./django_types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface PuzzleAnswer {
  puzzle: Puzzle;
  answer?: string;
}

export function getUnlockedPuzzles(
  major_case: string,
  minor_case: string,
  context: DjangoContext,
): PuzzleAnswer[] | null {
  if (!context?.team_context || !minor_case || !major_case) {
    return null;
  }

  const unlocks = context?.team_context.unlocks;
  let puzzles: Puzzle[] = [];
  if (unlocks[major_case] && unlocks[major_case][minor_case]) {
    puzzles = Object.values(unlocks[major_case][minor_case]);
  }

  const out = puzzles.map((puzzle) => {
    const solves = context?.team_context.solves_by_case;

    if (
      solves[major_case] &&
      solves[major_case][minor_case] &&
      solves[major_case][minor_case][puzzle.slug]
    ) {
      return {
        puzzle,
        answer: solves[major_case][minor_case][puzzle.slug].submitted_answer,
      };
    }
    return {
      puzzle,
    };
  });

  return out;
}

export function getUnlockedPuzzle(slug: string, context: DjangoContext, case_slug?: string) {
  let puzzle;
  if (case_slug) {
    for (const [, major_case] of Object.entries(context?.team_context?.unlocks || {})) {
      if (major_case[case_slug]?.[slug]) {
        puzzle = major_case[case_slug][slug];
      }
    }
  } else {
    for (const [, major_case] of Object.entries(context?.team_context?.unlocks || {})) {
      for (const [, minor_case] of Object.entries(major_case)) {
        if (minor_case[slug]) {
          puzzle = minor_case[slug];
        }
      }
    }
  }
  if (!puzzle) {
    return null;
  }

  const solves = context?.team_context?.solves_by_case;
  if (
    solves &&
    solves[puzzle.round.major_case.slug] &&
    solves[puzzle.round.major_case.slug][puzzle.round.slug] &&
    solves[puzzle.round.major_case.slug][puzzle.round.slug][slug]
  ) {
    return {
      puzzle,
      answer: solves[puzzle.round.major_case.slug][puzzle.round.slug][slug].submitted_answer,
    };
  }

  return {
    puzzle,
  };
}

// slug -> {Round, answer: string}
export function getMinorCases(
  context: DjangoContext,
): Record<string, { minor_case: Round; answer: string | null; meta: Puzzle | null | undefined }> {
  return Object.fromEntries(
    Object.values(context?.team_context?.case_unlocks).map((minor_case: Round) => {
      const meta = getMinorCaseMeta(minor_case, context);
      return [
        minor_case.slug,
        {
          minor_case: minor_case,
          answer: meta ? getPuzzleSolution(meta, context) : null,
          meta: meta,
        },
      ];
    }),
  );
}

export function getMinorCaseMeta(round: Round, context: DjangoContext) {
  if (
    !context?.team_context ||
    !round ||
    !context?.team_context.unlocks[round.major_case.slug] ||
    !context?.team_context.unlocks[round.major_case.slug][round.slug]
  ) {
    return null;
  }

  const meta_puzzle = Object.values(
    context.team_context.unlocks[round.major_case.slug][round.slug],
  ).find((puzzle) => puzzle.is_meta);
  return meta_puzzle;
}

export function getPuzzleSolution(puzzle: Puzzle | undefined | null, context: DjangoContext) {
  let submission;

  if (
    !puzzle ||
    !context?.team_context.solves_by_case[puzzle.round.major_case.slug] ||
    !context?.team_context.solves_by_case[puzzle.round.major_case.slug][puzzle.round.slug]
  ) {
    return null;
  }
  if (
    puzzle &&
    (submission =
      context.team_context.solves_by_case[puzzle.round.major_case.slug][puzzle.round.slug][
        puzzle.slug
      ])
  ) {
    return submission.submitted_answer;
  }
  return null;
}

export const mostRecentSolves = (context: DjangoContext, n?: number) => {
  const solved_cases = context.team_context.minor_case_completed;
  // sort by completed_datetime
  solved_cases.sort((a, b) => {
    return new Date(a.completed_datetime).getTime() - new Date(b.completed_datetime).getTime();
  });
  return n ? solved_cases.slice(0, n) : solved_cases;
};

const MAJOR_CASE_PUZZLE_SLUGS = ["colored-thread", "social-deduction", "data"];
export function numberOfMajorCaseSolves(context: DjangoContext): number {
  let count = 0;
  for (const mc_slug in MAJOR_CASE_PUZZLE_SLUGS) {
    if (context.team_context.solves[mc_slug]) {
      count++;
    }
  }
  return count;
}
