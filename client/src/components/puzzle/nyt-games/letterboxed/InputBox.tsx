import { Puzzle } from "../../../../utils/minor_cases/nyt/LetterBoxedTypes";
import { Puzzle } from "../../../../utils/minor_cases/nyt/LetterBoxedTypes";

export default function InputBox(props: {
  puzzle: Puzzle;
  solutionArr: number[][];
  answer: string | null;
}) {
  function convertSolutionToWordsIdx(solution: number[][], puzzle: Puzzle): number[][] {
    // Copy solution, for every list in solution, append to the front the last idx of the previous list, or initialIdx
    const words = [];
    for (let i = 0; i < solution.length; i++) {
      if (i == 0) {
        words.push([puzzle.initialIdx]);
      } else {
        words.push([solution[i - 1][solution[i - 1].length - 1]]);
      }
      words[i].push(...solution[i]);
    }
    return words;
  }

  const solution = convertSolutionToWordsIdx(props.solutionArr, props.puzzle);
  const letterDict = props.puzzle.getLetterDict();

  const answer = props.answer;

  const currentWord = solution[solution.length - 1].map((idx) => {
    const letter = letterDict.get(idx);
    return letter ? letter.letter : "";
  });
  // If the answer has been given, then past words are all words
  const pastWords = (answer ? solution : solution.slice(0, solution.length - 1)).map((word) =>
    word
      .map((idx) => {
        const letter = letterDict.get(idx);
        return letter ? letter.letter : "";
      })
      .join(""),
  );
  const pastWordsDisplay = pastWords.map((word) => word.toUpperCase()).join("-");
  return (
    <>
      <div className="flex flex-col divide-y-4 divide-solid divide-black justify-items-center py-4 h-28 min-w-96">
        <div className="flex flex-row place-content-center">
          {(answer ? answer.split("") : currentWord).map((letter, idx) => {
            return (
              <div className="font-bold text-4xl tracking-wider pb-1" key={idx}>
                {letter.toUpperCase()}
              </div>
            );
          })}
        </div>
        <div className="flex flex-row place-content-center pt-2">
          <div className="text-md tracking-widest">{pastWordsDisplay}</div>
        </div>
      </div>
    </>
  );
}
