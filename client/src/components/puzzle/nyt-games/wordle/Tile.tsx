import { cva } from "class-variance-authority";

import type { Character } from "./utils";
import { GameState, Row, VerificationState, idToRow } from "./utils";

interface TileProps {
  character: Character;
  id?: number;
  gridArea?: string;
  selectedRow?: Row;
  setSelectedRow?: React.Dispatch<React.SetStateAction<Row>>;
  activeTile?: number;
  solved?: [boolean, boolean, boolean];
  mini?: boolean;
  gameState?: GameState;
}

const tile = cva(
  [
    "font-extrabold",
    "w-16",
    "h-16",
    "border-[#CED1D5]",
    "flex",
    "justify-center",
    "items-center",
    "uppercase",
    "border-2",
    "text-4xl",
  ],
  {
    variants: {
      intent: {
        default: ["bg-white"],
        active: ["bg-[#FFDA00]"],
        selected: ["bg-[#A7D8FF]"],
        correct: ["bg-[#6AAA64]"],
        sameMiss: ["bg-[#C9B458]"],
        diffCorrect: ["bg-[#5baed8]"],
        diffMiss: ["bg-[#b478d5]"],
        incorrect: ["bg-[#787C7E]"],
      },
      mini: {
        true: ["w-8", "h-8", "text-xl"],
      },
    },
  },
);

const getVariant = (character: Character, id?: number, selectedRow?: Row, activeTile?: number) => {
  if (activeTile != undefined && activeTile == id) {
    return "active";
  }

  switch (character.verified) {
    case VerificationState.Correct: {
      return "correct";
    }
    case VerificationState.SameMiss: {
      return "sameMiss";
    }
    case VerificationState.DiffCorrect: {
      return "diffCorrect";
    }
    case VerificationState.DiffMiss: {
      return "diffMiss";
    }
    case VerificationState.Incorrect: {
      return "incorrect";
    }
  }

  if (id != undefined && selectedRow != undefined && idToRow(id).includes(selectedRow)) {
    return "selected";
  }

  return "default";
};

const Tile = ({
  id,
  character,
  gridArea,
  selectedRow,
  setSelectedRow,
  activeTile,
  solved,
  mini,
  gameState,
}: TileProps) => {
  return (
    <div
      className={tile({
        intent: getVariant(character, id, selectedRow, activeTile),
        mini: mini,
      })}
      style={{ gridArea: gridArea }}
      onClick={() => {
        if (id != undefined && setSelectedRow && solved && gameState === GameState.InProgress) {
          const possibleRows = idToRow(id);

          let newRow = Row.None;
          for (const row of possibleRows) {
            if (row != Row.None && row != selectedRow && !solved[row]) {
              newRow = row;
              break;
            }
          }

          setSelectedRow(newRow);
        }
      }}
    >
      {character.letter}
    </div>
  );
};

export default Tile;
