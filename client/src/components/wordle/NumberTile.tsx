import { Row } from "./utils";

interface NumberTileProps {
  rowNumber: 1 | 2 | 3;
  solved: [boolean, boolean, boolean];
  setSelectedRow: React.Dispatch<React.SetStateAction<Row>>;
}

const NumberTile = ({ rowNumber, solved, setSelectedRow }: NumberTileProps) => {
  return (
    <div
      style={{ gridArea: String.fromCharCode(64 + rowNumber) }}
      className="rounded-full bg-white text-black font-bold flex justify-center items-center w-16 h-16"
      onClick={() => {
        console.log(solved);
        if (!solved[rowNumber - 1]) {
          setSelectedRow(rowNumber - 1);
        }
      }}
    >
      {rowNumber}
    </div>
  );
};

export default NumberTile;
