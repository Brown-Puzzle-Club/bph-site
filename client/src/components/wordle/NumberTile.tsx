import { cva } from "class-variance-authority";
import { Row } from "./utils";

interface NumberTileProps {
  rowNumber: 1 | 2 | 3;
  solved?: [boolean, boolean, boolean];
  setSelectedRow?: React.Dispatch<React.SetStateAction<Row>>;
  mini?: boolean;
}

const numberTile = cva(
  [
    "rounded-full",
    "bg-white",
    "text-black",
    "font-bold",
    "flex",
    "justify-center",
    "items-center",
    "w-16",
    "h-16",
  ],
  {
    variants: {
      mini: {
        true: ["w-8", "h-8"],
      },
    },
  },
);

const NumberTile = ({ rowNumber, solved, setSelectedRow, mini }: NumberTileProps) => {
  return (
    <div
      style={{ gridArea: String.fromCharCode(64 + rowNumber) }}
      className={numberTile({ mini: mini })}
      onClick={() => {
        if (solved && setSelectedRow) {
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
