import { ThreadType } from "./types/BoardTypes";

export const HOVER_GLOW = "drop-shadow-[0_15px_15px_rgba(255,255,255,0.4)]";

export const THREAD_SELECTED_DOCTOR_GLOW = "drop-shadow-[0_8px_8px_rgba(0,0,255,0.6)]";
export const THREAD_SELECTED_GOREY_GLOW = "drop-shadow-[0_8px_8px_rgba(255,0,0,0.6)]";
export const THREAD_SELECTED_PUSS_GLOW = "drop-shadow-[0_8px_8px_rgba(255,180,0,0.6)]";

export const COLORED_GLOW: Record<ThreadType, string> = {
  [ThreadType.DOCTOR]: THREAD_SELECTED_DOCTOR_GLOW,
  [ThreadType.GOREY]: THREAD_SELECTED_GOREY_GLOW,
  [ThreadType.PUSS]: THREAD_SELECTED_PUSS_GLOW,
};

export const THREAD_COLOR: Record<ThreadType, string> = {
  [ThreadType.DOCTOR]: "blue",
  [ThreadType.GOREY]: "red",
  [ThreadType.PUSS]: "orange",
};

export const MAX_LINKS: Record<ThreadType, number> = {
  [ThreadType.DOCTOR]: 3,
  [ThreadType.GOREY]: 4,
  [ThreadType.PUSS]: 4,
};

export const emptyCounts = {
  [ThreadType.DOCTOR]: 0,
  [ThreadType.GOREY]: 0,
  [ThreadType.PUSS]: 0,
};
