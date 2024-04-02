import { useDjangoContext } from "@/hooks/useDjangoContext";
import { Error404 } from "@/routes/ErrorPage";
import { DjangoContext } from "@/utils/django_types";
import { ReactNode } from "react";
import { BeatLoader } from "react-spinners";

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
  return major_case_slug in context.team_context.unlocks;
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

// the div inside the children will be locked from view if the hunt has not started
export function Locked({
  condition,
  children,
}: {
  condition: (context: DjangoContext) => boolean;
  children: ReactNode;
}) {
  const { context } = useDjangoContext();

  if (!context?.team_context) {
    // LOADING
    return <BeatLoader className="justify-center content-center p-4" color={"#fff"} size={12} />;
  } else if (context && condition(context)) {
    // PASSES CONDITION
    return <>{children}</>;
  } else {
    // DOES NOT PASS CONDITION
    return <Error404 />;
  }
}
