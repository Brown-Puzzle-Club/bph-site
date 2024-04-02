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

interface Palette {
  primary: string;
  secondary: string;
  tertiary: string;
  textColor: string;
  answerColor: string;
  backgroundStart: string;
  backgroundEnd: string;
}

export enum MajorCaseEnum {
  COLORED_THREAD = "red-thread",
  SOCIAL_DEDUCTION = "social-deduction",
  DATA = "data",
}

export enum PuzzleStyle {
  COLORED_THREAD = "puzzle-red-thread",
  SOCIAL_DEDUCTION = "puzzle-soc-deduction",
  DATA = "puzzle-data",
}

export const MAJOR_CASE_NAMES: Record<MajorCaseEnum, string> = {
  [MajorCaseEnum.COLORED_THREAD]: "Red Thread",
  [MajorCaseEnum.SOCIAL_DEDUCTION]: "Social Deduction",
  [MajorCaseEnum.DATA]: "Data",
};

export const toPuzzleStyle = (major_case_slug: string) => {
  switch (major_case_slug as MajorCaseEnum) {
    case MajorCaseEnum.COLORED_THREAD:
      return PuzzleStyle.COLORED_THREAD;
    case MajorCaseEnum.SOCIAL_DEDUCTION:
      return PuzzleStyle.SOCIAL_DEDUCTION;
    case MajorCaseEnum.DATA:
      return PuzzleStyle.DATA;
  }
};

export const CASE_PALETTE: Record<MajorCaseEnum, Palette> = {
  [MajorCaseEnum.COLORED_THREAD]: {
    primary: "#957a62",
    secondary: "#745a45",
    tertiary: "#b3957c",
    textColor: "#000000b8",
    answerColor: "#98ff98",
    backgroundStart: "#b3957c",
    backgroundEnd: "#a28369",
  },
  [MajorCaseEnum.SOCIAL_DEDUCTION]: {
    primary: "#35421d",
    secondary: "#4f5a39",
    tertiary: "#b3957c",
    textColor: "#000000b8", //  #ffffffb3
    answerColor: "#b6e1c1",
    backgroundStart: "#6d8148", // #4c6b34
    backgroundEnd: "#576837", // #425c2d
  },
  [MajorCaseEnum.DATA]: {
    primary: "#bb5171",
    secondary: "#9c5268",
    tertiary: "#b3957c",
    textColor: "#000000b8",
    answerColor: "#fafffa",
    backgroundStart: "#d86688",
    backgroundEnd: "#c45b7b",
  },
};
