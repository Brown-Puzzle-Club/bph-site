import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DjangoContext, Puzzle } from "./django_types";

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

  return null;
}
