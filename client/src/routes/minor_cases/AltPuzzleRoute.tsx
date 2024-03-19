import AlexGame from "./red-thread/AlexGame";

// if any puzzle has no markdown, it will attempt to route using this
// puzzle_slug -> JSX.Element
export const ALT_PUZZLE_ROUTES: { [key: string]: JSX.Element } = {
  "alex-game": <AlexGame />,
};

export default function AltPuzzleRoute({ puzzle_slug }: { puzzle_slug: string }) {
  return <div>{ALT_PUZZLE_ROUTES[puzzle_slug]}</div>;
}
