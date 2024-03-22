import { PuzzleParams } from "@/utils/interface";

export default function AlexGame({ puzzle, context }: PuzzleParams) {
  console.log(puzzle, context);

  return (
    <div>
      <h1>Alex's Game</h1>
      <iframe src="https://itch.io/embed/2580916" width="552" height="167" frameBorder="0">
        <a href="https://xenonhawk.itch.io/test">Test by Xenonhawk</a>
      </iframe>
    </div>
  );
}
