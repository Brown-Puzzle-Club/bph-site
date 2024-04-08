import type { Puzzle } from "../../../../utils/minor_cases/nyt/LetterBoxedTypes";
import { LetterState } from "../../../../utils/minor_cases/nyt/LetterBoxedTypes";
import Letter from "./Letter";

export default function LetterBox({
  puzzle,
  solutionArr,
  onSelect,
  solved,
}: {
  puzzle: Puzzle;
  solutionArr: number[][];
  onSelect: (idx: number) => void;
  solved: boolean;
}) {
  /**
   * Returns a list of (x, y) coordinates of the vertices of a regular polygon with `sides` sides.
   * There should be 1 horizontal line (pair of vertices) at the bottom
   * @param sides The number of sides of the polygon
   */
  function polygonVertices(sides: number, scale: number = 200) {
    const vertices = [];
    const offset = Math.PI / 2 - Math.PI / sides;
    for (let i = 0; i < sides; i++) {
      vertices.push([
        1.5 * scale + scale * Math.cos(offset + (i * 2 * Math.PI) / sides),
        1.5 * scale + scale * Math.sin(offset + (i * 2 * Math.PI) / sides),
      ]);
    }
    return vertices;
  }

  /**
   * Draws the base shape of the puzzle. Every pairwise adjacent pair of vertices should be connected.
   * Returns a <polygon>
   * @param sides The number of sides of the polygon
   */
  function drawPolygon(sides: number, scale: number = 200) {
    // Get the vertices of the polygon
    const vertices = polygonVertices(sides, scale);
    // Draw the lines
    let d = "";
    for (let i = 0; i < vertices.length; i++) {
      d += `${vertices[i][0]},${vertices[i][1]} `;
      // d += `${50 + 50 * vertices[(i + 1) % vertices.length][0]},${50 + 50 * vertices[(i + 1) % vertices.length][1]} `;
    }
    return <polygon points={d} fill="white" stroke="black" strokeWidth="3" />;
  }

  function getLetterCoordinates(
    puzzle: Puzzle,
    scale: number = 200,
  ): Map<number, { x: number; y: number; angle: number }> {
    // Get the number of sides in puzzle
    const sides = puzzle.letters.length;
    // Get the vertices of the polygon
    const vertices = polygonVertices(sides, scale);
    //
    const components = new Map<number, { x: number; y: number; angle: number }>();
    // For each letter in each side of the puzzle, draw letters on that side equidistant, ignoring nulls
    for (let i = 0; i < puzzle.letters.length; i++) {
      const start_vertex = vertices[i];
      const end_vertex = vertices[(i + 1) % sides];
      const letters = puzzle.letters[i];
      const parts = letters.length - 1;
      for (let j = 0; j < letters.length; j++) {
        if (letters[j] !== null) {
          // If the letter is on a vertex, place it at the vertex and not normal to any sides
          const angle =
            ((letters[j]?.sides.length == 1 ? i : i + 0.5) * 2 * Math.PI) / sides + Math.PI / 2;
          const dx = (j * (end_vertex[0] - start_vertex[0])) / parts;
          const dy = (j * (end_vertex[1] - start_vertex[1])) / parts;
          components.set(letters[j]?.index ?? -1, {
            x: start_vertex[0] + dx,
            y: start_vertex[1] + dy,
            angle: angle,
          });
        }
      }
    }
    return components;
  }

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

  function getLetterState(idx: number, solution: number[][]) {
    const words = convertSolutionToWordsIdx(solution, puzzle);
    // If idx is last in last word, return current
    if (words[words.length - 1][words[words.length - 1].length - 1] == idx) {
      return LetterState.CURRENT;
    }
    // If idx is in last word, return pending
    if (words[words.length - 1].includes(idx)) {
      return LetterState.PENDING;
    }
    // If idx is in any word, return locked
    if (words.flat().includes(idx)) {
      return LetterState.LOCKED;
    }
    // Otherwise, return normal
    return LetterState.NONE;
  }

  function drawLetters(puzzle: Puzzle, scale: number = 200) {
    // Get the letter coordinates
    const letterCoordinates = getLetterCoordinates(puzzle, scale);
    // Get the letterDict
    const letterDict = puzzle.getLetterDict();
    const components = [];
    // Iterate through letterDict, drawing each letter
    for (const [idx, letter] of letterDict) {
      const coords = letterCoordinates.get(idx);
      if (coords) {
        components.push(
          <Letter
            puzzle={puzzle}
            x={coords.x}
            y={coords.y}
            scale={scale}
            angle={coords.angle}
            letter={letter.letter.toUpperCase()}
            key={idx}
            onSelect={() => (solved ? null : onSelect(idx))}
            uses={letter.uses}
            used={
              [puzzle.initialIdx].concat(solutionArr.flat()).filter((idx) => idx == letter.index)
                .length
            }
            state={solved ? LetterState.LOCKED : getLetterState(idx, solutionArr)}
          />,
        );
      }
    }
    return components;
  }

  function drawLines(scale: number = 200) {
    // Gets the words involved
    const words = convertSolutionToWordsIdx(solutionArr, puzzle);
    // Get the letter coordinates
    const letterCoordinates = getLetterCoordinates(puzzle, scale);
    // Draw lines between every adjacent pair of letters in every word of solution
    const components = [];
    for (let i = 0; i < words.length; i++) {
      for (let j = 0; j < words[i].length - 1; j++) {
        const start = letterCoordinates.get(words[i][j]);
        const end = letterCoordinates.get(words[i][j + 1]);
        if (start && end) {
          components.push(
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={i == words.length - 1 && !solved ? "#faa6a4" : "#ffe4e3"}
              strokeWidth="5"
              key={i * 100 + j}
              strokeDasharray={i == words.length - 1 && !solved ? "15,10" : "0"}
            />,
          );
        }
      }
    }
    return components;
  }

  return (
    <div>
      <svg width="600" height="600" xmlns="http://www.w3.org/2000/svg">
        {drawPolygon(puzzle.letters.length)}
        {drawLines()}
        {drawLetters(puzzle)}
      </svg>
    </div>
  );
}
