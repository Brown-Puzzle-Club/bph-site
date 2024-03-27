import { useState } from "react";
import { cn } from "@/utils/utils";

interface TileProps {
  id: number;
  letter: string;
  gridArea: string;
  selectedRow: SelectedRow;
  setSelectedRow: React.Dispatch<React.SetStateAction<SelectedRow>>;
}

const idToRow = (id: number) => {
  if (id == 4) {
    return [SelectedRow.Top, SelectedRow.Middle];
  } else if (id == 8) {
    return [SelectedRow.Middle, SelectedRow.Bottom];
  } else if (id < 4) {
    return [SelectedRow.Top];
  } else if (id < 8) {
    return [SelectedRow.Middle];
  } else {
    return [SelectedRow.Bottom];
  }
};

const Tile = ({ id, letter, gridArea, selectedRow, setSelectedRow }: TileProps) => {
  return (
    <div
      className={cn(
        "text-black w-16 h-16 bg-white border-[#CED1D5] flex justify-center items-center",
        idToRow(id).includes(selectedRow) && "bg-[#A7D8FF]",
      )}
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

enum SelectedRow {
  Top = 0,
  Middle = 1,
  Bottom = 2,
  Final = 3,
}

const hangmanTemplateAreas = `'a b c d e . .'
                              '. . . . f . .'
                              '. . . . g . .'
                              '. . . . h . .'
                              '. . j k i l m'`;

const Wordle = () => {
  const [board, setBoard] = useState(new Array(13).fill("A"));
  const [selectedRow, setSelectedRow] = useState<SelectedRow>(SelectedRow.Top);

  return (
    <div className="text-white">
      <h1>Wordle!</h1>
      <div className="grid place-items-center">
        <div className="max-w-max gap-2 grid" style={{ gridTemplateAreas: hangmanTemplateAreas }}>
          {board.map((letter, i) => (
            <Tile
              key={i}
              id={i}
              letter={letter}
              gridArea={String.fromCharCode(97 + i)}
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wordle;
