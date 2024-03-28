import { Row, idToRow } from "./utils";
import { cva } from "class-variance-authority";

interface TileProps {
  id: number;
  letter: string;
  gridArea: string;
  selectedRow: Row;
  setSelectedRow: React.Dispatch<React.SetStateAction<Row>>;
  activeTile: number;
}

const tile = cva(
  ["text-black", "w-16", "h-16", "border-[#CED1D5]", "flex", "justify-center", "items-center"],
  {
    variants: {
      intent: {
        default: ["bg-white"],
        active: ["bg-[#FFDA00]"],
        selected: ["bg-[#A7D8FF]"],
      },
    },
  },
);

const Tile = ({ id, letter, gridArea, selectedRow, setSelectedRow, activeTile }: TileProps) => {
  return (
    <div
      className={tile({
        intent:
          activeTile == id ? "active" : idToRow(id).includes(selectedRow) ? "selected" : "default",
      })}
      style={{ gridArea: gridArea }}
      onClick={() => {
        const possibleRows = idToRow(id);
        if (possibleRows.length == 1) {
          setSelectedRow(possibleRows[0]);
        } else if (selectedRow != possibleRows[0]) {
          setSelectedRow(possibleRows[0]);
        } else {
          setSelectedRow(possibleRows[1]);
        }
      }}
    >
      {letter}
    </div>
  );
};

export default Tile;
