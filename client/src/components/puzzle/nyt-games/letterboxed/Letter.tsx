import { LetterState, Puzzle } from "./LetterBoxedTypes";

/**
 * Draws the dots of how many uses are left
 */
function Dots({ x, y, uses, used }: { x: number; y: number; uses: number; used: number }) {
  // (x, y) is the midpoint, calculates the positions of the dots n pixels away from each other.
  const dots = [];
  const shifted_x = uses > 4 ? x + 12 : x;
  for (let i = 0; i < uses; i++) {
    dots.push(
      <circle
        cx={(shifted_x - 8 * (i - (uses - 1) / 2)).toString()}
        cy={y.toString()}
        r="2"
        fill={i < used ? "gray" : "white"}
        stroke={i < used ? "gray" : "white"}
        key={i}
      />
    );
  }
  return <>{dots}</>;
}

export default function Letter({
  x,
  y,
  scale,
  angle,
  letter,
  onSelect,
  uses,
  used,
  state,
}: {
  puzzle: Puzzle;
  x: number;
  y: number;
  scale: number;
  angle: number;
  letter: string;
  onSelect: () => void;
  uses: number;
  used: number;
  state: LetterState;
}) {
  return (
    <>
      <svg
        onClick={() => {
          onSelect();
        }}
        style={{ position: "absolute" }}
      >
        <circle
          cx={x.toString()}
          cy={y.toString()}
          r={scale / 25}
          fill={
            state == LetterState.CURRENT
              ? "black"
              : state == LetterState.LOCKED
              ? "#faa6a4"
              : "white"
          }
          stroke={
            state == LetterState.CURRENT || state == LetterState.PENDING ? "#faa6a4" : "black"
          }
          strokeWidth="3"
        />
        <text
          x={(x + 0.15 * scale * Math.cos(angle)).toString()}
          y={(y + 0.18 * scale * Math.sin(angle) - 5).toString()}
          textAnchor="middle"
          alignmentBaseline="middle"
          className={state == LetterState.CURRENT ? "font-extrabold" : "font-bold"}
          fill={state == LetterState.NONE ? "white" : "black"}
          fontSize={0.15 * scale}
        >
          {letter}
        </text>
        <Dots
          x={x + 0.15 * scale * Math.cos(angle)}
          y={y + 0.18 * scale * Math.sin(angle) + 15}
          uses={uses}
          used={used}
        />
      </svg>
    </>
  );
}
