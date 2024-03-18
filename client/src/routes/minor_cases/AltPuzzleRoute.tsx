import AlexGame from "./red-thread/AlexGame";
import PDFTest from "./red-thread/PDFTest";
import VideoTest from "./red-thread/VideoTest";

// if any puzzle has no markdown, it will attempt to route using this
export const ALT_PUZZLE_ROUTES: { [key: string]: JSX.Element } = {
  "alex-game": <AlexGame />,
  "pdf-test": <PDFTest />,
  "video-test": <VideoTest />,
};

export default function AltPuzzleRoute({ puzzle_slug }: { puzzle_slug: string }) {
  return <div>{ALT_PUZZLE_ROUTES[puzzle_slug]}</div>;
}
