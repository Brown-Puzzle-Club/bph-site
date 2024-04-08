import NumberTile from "./NumberTile";
import Tile from "./Tile";
import { Guess } from "./utils";
import NumberTile from "./NumberTile";
import Tile from "./Tile";
import { Guess } from "./utils";

interface GuessTileProps {
  guess: Guess;
}

export const GuessTile = ({ guess }: GuessTileProps) => {
  return (
    <li className="flex gap-2">
      {guess.guess.map((character, idx) => (
        <Tile key={idx} character={character} mini />
      ))}
      {<NumberTile rowNumber={((guess.row as 0 | 1 | 2) + 1) as 1 | 2 | 3} mini />}
    </li>
  );
};
