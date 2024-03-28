import { useEffect, useState } from "react";
import Tile from "./Tile";
import {
  GameMode,
  Row,
  clearRow,
  generateAnswers,
  getLastTile,
  getNextNonEmptyTile,
  getPreviousTile,
  getRowString,
} from "./utils";

const hangmanTemplateAreas = `'a b c d e . .'
                              '. . . . f . .'
                              '. . . . g . .'
                              '. . . . h . .'
                              '. . j k i l m'`;

interface HangmanWordleProps {
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  setGuesses: React.Dispatch<React.SetStateAction<number>>;
}

const HangmanWordle = ({ setGameMode, setGuesses }: HangmanWordleProps) => {
  const [board, setBoard] = useState(new Array(13).fill(""));
  const [selectedRow, setSelectedRow] = useState<Row>(Row.None);
  const [activeTile, setActiveTile] = useState<number>(-1);
  const [solved, setSolved] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [answers, setAnswers] = useState<[string, string, string]>(["", "", ""]);

  useEffect(() => {
    setAnswers((prev) => {
      if (prev[0] === "" && prev[1] === "" && prev[2] === "") {
        return generateAnswers();
      }
      return prev;
    });
  }, [setAnswers]);

  useEffect(() => {
    console.log(answers);
  }, [answers]);

  useEffect(() => {
    console.log(solved);
    if (solved.every((s) => s)) {
      setGameMode(GameMode.FinalWordle);
    }
  }, [setGameMode, solved]);

  useEffect(() => {
    switch (selectedRow) {
      case Row.None: {
        setActiveTile(-1);
        break;
      }
      case Row.Top: {
        setActiveTile(getNextNonEmptyTile(0, selectedRow, board));
        break;
      }
      case Row.Middle: {
        setActiveTile(getNextNonEmptyTile(4, selectedRow, board));
        break;
      }
      case Row.Bottom: {
        setActiveTile(getNextNonEmptyTile(9, selectedRow, board));
        break;
      }
    }
  }, [selectedRow, board]);

  const keyPressHandler = (e: React.KeyboardEvent) => {
    e.preventDefault();
    console.log("key", e.key);
    if ("a" <= e.key && e.key <= "z") {
      setBoard((prev) => {
        const newBoard = [...prev];
        if (newBoard[activeTile] == "") {
          newBoard[activeTile] = e.key.toUpperCase();
        }
        setActiveTile((prev) => getNextNonEmptyTile(prev, selectedRow, newBoard));

        return newBoard;
      });
    } else if (e.key === "Backspace") {
      setBoard((prev) => {
        const newBoard = [...prev];
        if (activeTile === -1) {
          const lastTile = getLastTile(selectedRow);
          newBoard[lastTile] = "";
          setActiveTile(lastTile);
        }
        if (newBoard[activeTile] == "") {
          const lastTile = getPreviousTile(activeTile, selectedRow);
          newBoard[lastTile] = "";
          setActiveTile(lastTile);
        } else {
          newBoard[activeTile] = "";
        }
        return newBoard;
      });
    } else if (e.key === "Enter") {
      const enteredWord = getRowString(selectedRow, board);
      if (selectedRow != Row.None && enteredWord.length === 5) {
        if (enteredWord.toLowerCase() == answers[selectedRow]) {
          setSolved((prev) => {
            const newSolved = [...prev] satisfies [boolean, boolean, boolean];
            newSolved[selectedRow] = true;
            return newSolved;
          });
        } else {
          setBoard((prev) => clearRow(selectedRow, prev));
          setGuesses((prev) => prev - 1);
          setSelectedRow(Row.None);
        }
      } else {
        console.error("not long enough");
      }
    }
  };

  return (
    <div
      tabIndex={0}
      className="max-w-max gap-2 grid"
      style={{ gridTemplateAreas: hangmanTemplateAreas }}
      onKeyDown={keyPressHandler}
    >
      {board.map((letter, i) => (
        <Tile
          key={i}
          id={i}
          letter={letter}
          gridArea={String.fromCharCode(97 + i)}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          activeTile={activeTile}
        />
      ))}
    </div>
  );
};

export default HangmanWordle;
