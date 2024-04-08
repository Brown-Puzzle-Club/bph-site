import type { DjangoContext } from "./django_types";

export const HUNT_HAS_STARTED = (context: DjangoContext) => {
  return (
    context.hunt_context.hunt_has_started ||
    context.team_context.is_admin ||
    context.team_context.is_prerelease_testsolver
  );
};

export const HUNT_IS_OVER = (context: DjangoContext) => {
  return (
    context.hunt_context.hunt_is_over ||
    context.team_context.is_admin ||
    context.team_context.is_prerelease_testsolver
  );
};

export const HUNT_IS_CLOSED = (context: DjangoContext) => {
  return (
    context.hunt_context.hunt_is_closed ||
    context.team_context.is_admin ||
    context.team_context.is_prerelease_testsolver
  );
};

export const IS_ADMIN = (context: DjangoContext) => {
  return context.team_context.is_admin || context.team_context.is_superuser;
};

export const IS_MAJOR_CASE_UNLOCKED = (major_case_slug: string) => (context: DjangoContext) => {
  if (context.team_context.is_admin) return true;
  return major_case_slug in context.team_context.major_case_puzzles;
};

export const IS_MINOR_CASE_UNLOCKED = (case_slug: string) => (context: DjangoContext) => {
  if (!context.team_context) return false;
  if (context.team_context.is_admin) return true;
  for (const [, case_dict] of Object.entries(context.team_context.unlocks)) {
    if (case_slug in case_dict) {
      return true;
    }
  }
  return false;
};

export const IS_PUZZLE_UNLOCKED = (puzzle_slug: string) => (context: DjangoContext) => {
  if (context.team_context.is_admin) return true;
  for (const [, case_dict] of Object.entries(context.team_context.unlocks)) {
    for (const [, puzzle_dict] of Object.entries(case_dict)) {
      if (puzzle_slug in puzzle_dict) {
        return true;
      }
    }
  }
  return false;
};
