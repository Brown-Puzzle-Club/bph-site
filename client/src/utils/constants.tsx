export const MURDER_WEAPON_EMOJIS = [
  "🔫",
  "🗡️",
  "🔨",
  "🪓",
  "🏹",
  "💣",
  "🎷",
  "🎤",
  "🧲",
  "💉",
  "🐕",
  "✏️",
  "🚂",
  "🛹",
  "🔥",
  "🗜️",
  "🦯",
];

export const PFP_COLOR_CHOICES = [
  "#ffffff", // white
  "#000000", // black
  "#a46666", // red
  "#7f7367", // brown
  "#decc57", // yellow
  "#677f67", // green
  "#5780a8", // blue
  "#926dca", // purple
  "#67737f", // blue-grey
  "#27514a", // slate-green
  "#1e293b", // dark-slate
];

export const [MEMBER_COUNT_MIN, MEMBER_COUNT_MAX] = [1, 12];

export enum MajorCaseEnum {
  COLORED_THREAD = "colored-thread",
  SOCIAL_DEDUCTION = "social-deduction",
  DATA = "data",
}

export enum PuzzleStyle {
  RED_THREAD = "puzzle-red-thread",
  SOCIAL_DEDUCTION = "puzzle-soc-deduction",
  DATA = "puzzle-data",
}

export const toPuzzleStyle = (major_case_slug: string) => {
  switch (major_case_slug) {
    case "colored-thread":
      return PuzzleStyle.RED_THREAD;
    case "red-thread":
      return PuzzleStyle.RED_THREAD;
    case "social-deduction":
      return PuzzleStyle.SOCIAL_DEDUCTION;
    case "data":
      return PuzzleStyle.DATA;
  }
};
