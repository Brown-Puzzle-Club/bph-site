import type { Puzzle } from "@/utils/django_types";

export default function AlexGame({ puzzle }: { puzzle: Puzzle }) {
  console.log(puzzle);

  return (
    <div>
      <h1>Alex&apos;s Game</h1>
      <iframe src="https://itch.io/embed/2580916" width="552" height="167" frameBorder="0">
        <a href="https://xenonhawk.itch.io/test">Test by Xenonhawk</a>
      </iframe>
    </div>
  );
}
