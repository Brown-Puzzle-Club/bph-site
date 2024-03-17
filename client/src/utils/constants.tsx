import AlexGame from "@/components/minor_cases/AlexGame";
import PDFTest from "@/components/minor_cases/PDFTest";
import VideoTest from "@/components/minor_cases/VideoTest";

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

export enum PuzzleStyle {
  RED_THREAD = "puzzle-red-thread",
  SOCIAL_DEDUCTION = "puzzle-soc-deduction",
  DATA = "puzzle-data",
  //... TODO: add more for major case styling vibes (socded, data, etc.)
}

export const toPuzzleStyle = (major_case_slug: string) => {
  switch (major_case_slug) {
    case "red-thread":
      return PuzzleStyle.RED_THREAD;
    case "social-deduction":
      return PuzzleStyle.SOCIAL_DEDUCTION;
    case "data":
      return PuzzleStyle.DATA;
  }
};

// if any puzzle has no markdown, it will attempt to route using this
export const ALT_PUZZLE_ROUTES = {
  "alex-game": <AlexGame />,
  "pdf-test": <PDFTest />,
  "video-test": <VideoTest />,
};
