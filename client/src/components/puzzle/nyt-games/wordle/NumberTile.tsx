import { cva } from "class-variance-authority";

import type { Row } from "./utils";
import { GameState } from "./utils";

interface NumberTileProps {
  rowNumber: 1 | 2 | 3;
  gameState?: GameState;
  solved?: [boolean, boolean, boolean];
  setSelectedRow?: React.Dispatch<React.SetStateAction<Row>>;
  mini?: boolean;
}

const numberTile = cva(
  [
    "rounded-full",
    "bg-black",
    "bg-white",
    "text-black",
    "franklin",
    "border-dashed",
    "border-2",
    "font-bold",
    "text-xl",
    "flex",
    "justify-center",
    "items-center",
    "w-16",
    "h-16",
  ],
  {
    variants: {
      mini: {
        true: ["w-8", "h-8", "text-xs"],
      },
    },
  },
);

const NumberTile = ({ rowNumber, solved, setSelectedRow, mini, gameState }: NumberTileProps) => {
  return (
    <div
      style={{ gridArea: String.fromCharCode(64 + rowNumber) }}
      className={numberTile({ mini: mini })}
      onClick={() => {
        if (solved && setSelectedRow && gameState === GameState.InProgress) {
          if (!solved[rowNumber - 1]) {
            setSelectedRow(rowNumber - 1);
          }
        }
      }}
    >
      {rowNumber}
    </div>
  );
};

export default NumberTile;
