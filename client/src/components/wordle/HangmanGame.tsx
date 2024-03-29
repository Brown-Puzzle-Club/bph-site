import { useEffect, useState } from "react";
import Tile from "./Tile";
import {
  Board,
  Character,
  GameMode,
  Row,
  VerificationState,
  clearRow,
  generateAnswers,
  getLastTile,
  getNextNonEmptyTile,
  getPreviousTile,
  getRowString,
  verifyGuess,
} from "./utils";
import NumberTile from "./NumberTile";

const hangmanTemplateAreas = `'a b c d e A . .'
                              '. . . . f . . .'
                              '. . . . g . . .'
                              '. . . . h . . .'
                              '. . j k i l m C'
                              '. . . . B . . .'`;

interface HangmanWordleProps {
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  setGuesses: React.Dispatch<React.SetStateAction<number>>;
}

const HangmanWordle = ({ setGameMode, setGuesses }: HangmanWordleProps) => {
  const [board, setBoard] = useState<Board>(
    new Array(13).fill({ letter: "", verified: VerificationState.Unverified }),
  );
  const [selectedRow, setSelectedRow] = useState<Row>(Row.None);
  const [activeTile, setActiveTile] = useState<number>(-1);
  const [solved, setSolved] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [answers, setAnswers] = useState<[string, string, string]>(["", "", ""]);
  const [prevGuesses, setPrevGuesses] = useState<
    [Character, Character, Character, Character, Character][]
  >([]);

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
        if (activeTile != -1 && newBoard[activeTile].letter == "") {
          newBoard[activeTile] = {
            letter: e.key.toUpperCase() as string,
            verified: VerificationState.Unverified,
          };
        }
        setActiveTile((prev) => getNextNonEmptyTile(prev, selectedRow, newBoard));

        return newBoard;
      });
    } else if (e.key === "Backspace") {
      setBoard((prev) => {
        const newBoard = [...prev];
        if (activeTile === -1) {
          const lastTile = getLastTile(selectedRow);
          if (newBoard[lastTile].verified != VerificationState.Correct) {
            newBoard[lastTile].letter = "";
            setActiveTile(lastTile);
          }
        }
        if (activeTile != -1 && newBoard[activeTile].letter == "") {
          const lastTile = getPreviousTile(activeTile, selectedRow);
          newBoard[lastTile].letter = "";
          setActiveTile(lastTile);
        } else if (activeTile != -1 && newBoard[activeTile].verified != VerificationState.Correct) {
          newBoard[activeTile].letter = "";
        }
        return newBoard;
      });
    } else if (e.key === "Enter") {
      const enteredWord = getRowString(selectedRow, board).toLowerCase();
      if (selectedRow != Row.None && enteredWord.length === 5) {
        const guessVerification = verifyGuess(enteredWord, answers, selectedRow);
        const letters = enteredWord.split("");
        const characters = letters.map((letter, i) => {
          return { letter: letter, verified: guessVerification[i] };
        }) as [Character, Character, Character, Character, Character];

        if (guessVerification.every((v) => v === VerificationState.Correct)) {
          setBoard((prev) => clearRow(selectedRow, prev, guessVerification));
          setSelectedRow(Row.None);
          setSolved((prev) => {
            const newSolved = [...prev] satisfies [boolean, boolean, boolean];
            newSolved[selectedRow] = true;
            return newSolved;
          });
        } else {
          setBoard((prev) => clearRow(selectedRow, prev, guessVerification));
          setGuesses((prev) => prev - 1);
          setSelectedRow(Row.None);
          setPrevGuesses((prev) => [...prev, characters]);
        }
      } else {
        console.error("not long enough");
      }
    }
  };

  return (
    <div className="flex gap-10">
      <div
        tabIndex={0}
        className="focus:outline-none gap-2 grid"
        style={{ gridTemplateAreas: hangmanTemplateAreas }}
        onKeyDown={keyPressHandler}
      >
        {board.map((character, i) => (
          <Tile
            key={i}
            id={i}
            character={character}
            gridArea={String.fromCharCode(97 + i)}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            activeTile={activeTile}
            solved={solved}
          />
        ))}
        <NumberTile rowNumber={1} solved={solved} setSelectedRow={setSelectedRow} />
        <NumberTile rowNumber={2} solved={solved} setSelectedRow={setSelectedRow} />
        <NumberTile rowNumber={3} solved={solved} setSelectedRow={setSelectedRow} />
      </div>
      <div>
        <p>Previous Guesses</p>
        <ul>
          {prevGuesses.map((guess, i) => (
            <li key={i}>{guess.map((x) => x.letter).reduce((prev, x) => prev + x, "")}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HangmanWordle;
