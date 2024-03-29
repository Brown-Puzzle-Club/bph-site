import { Character, Row, VerificationState, idToRow } from "./utils";
import { cva } from "class-variance-authority";

interface TileProps {
  id: number;
  character: Character;
  gridArea: string;
  selectedRow: Row;
  setSelectedRow: React.Dispatch<React.SetStateAction<Row>>;
  activeTile: number;
  solved: [boolean, boolean, boolean];
}

const tile = cva(
  ["text-black", "w-16", "h-16", "border-[#CED1D5]", "flex", "justify-center", "items-center"],
  {
    variants: {
      intent: {
        default: ["bg-white"],
        active: ["bg-[#FFDA00]"],
        selected: ["bg-[#A7D8FF]"],
        correct: ["bg-[#6AAA64]"],
        sameMiss: ["bg-[#C9B458]"],
        diffCorrect: ["bg-[#A511F5]"],
        diffMiss: ["bg-[#BECF06]"],
        incorrect: ["bg-[#787C7E]"],
      },
    },
  },
);

const getVariant = (character: Character, id: number, selectedRow: Row, activeTile: number) => {
  if (activeTile == id) {
    return "active";
  }
  if (idToRow(id).includes(selectedRow)) {
    return "selected";
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
}: TileProps) => {
  return (
    <div
      className={tile({
        intent: getVariant(character, id, selectedRow, activeTile),
      })}
      style={{ gridArea: gridArea }}
      onClick={() => {
        const possibleRows = idToRow(id);
        let newRow;
        // TODO: update all of this logic to just pick the first row that isn't solved and isn't the active row
        if (possibleRows.length == 1) {
          newRow = possibleRows[0];
        } else if (selectedRow != possibleRows[0]) {
          newRow = possibleRows[0];
        } else {
          newRow = possibleRows[1];
        }
        if (newRow == Row.None || !solved[newRow]) {
          setSelectedRow(newRow);
        }
      }}
    >
      {character.letter}
    </div>
  );
};

export default Tile;
