import { useEffect, useState } from "react";
import Tile from "./Tile";
import {
  Board,
  Character,
  GameMode,
  Guess,
  Row,
  VerificationState,
  clearRow,
  generateAnswers,
  getLastTile,
  getNextNonEmptyTile,
  getPreviousFilledNotCorrectTile,
  getRowString,
  verifyGuess,
} from "./utils";
import NumberTile from "./NumberTile";
import { possibleWords } from "./wordList";
import { GuessTile } from "./GuessTile";

const hangmanTemplateAreas = `'a b c d e A . .'
                              '. . . . f . . .'
                              '. . . . g . . .'
                              '. . . . h . . .'
                              '. . j k i l m C'
                              '. . . . B . . .'`;

interface HangmanWordleProps {
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  setGuesses: React.Dispatch<React.SetStateAction<number>>;
  gameOver: boolean;
}

const HangmanWordle = ({ setGameMode, setGuesses, gameOver }: HangmanWordleProps) => {
  const [board, setBoard] = useState<Board>(
    new Array(13).fill({ letter: "", verified: VerificationState.Unverified }),
  );
  const [selectedRow, setSelectedRow] = useState<Row>(Row.None);
  const [activeTile, setActiveTile] = useState<number>(-1);
  const [solved, setSolved] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [answers, setAnswers] = useState<[string, string, string]>(["", "", ""]);
  const [prevGuesses, setPrevGuesses] = useState<Guess[]>([]);

  useEffect(() => {
    console.log(answers);
  }, [answers]);

  useEffect(() => {
    setAnswers((prev) => {
      if (prev[0] === "" && prev[1] === "" && prev[2] === "") {
        return generateAnswers();
      }
      return prev;
    });
  }, [setAnswers]);

  useEffect(() => {
    if (solved.every((s) => s)) {
      setGameMode(GameMode.FinalWordle);
    }
  }, [setGameMode, solved]);

  useEffect(() => {
    if (!gameOver) {
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
    }
  }, [selectedRow, board, gameOver]);

  const keyPressHandler = (e: React.KeyboardEvent) => {
    if (gameOver) {
      return;
    }

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
          const lastTile = getPreviousFilledNotCorrectTile(
            getLastTile(selectedRow),
            selectedRow,
            newBoard,
          );
          if (lastTile != -1) {
            newBoard[lastTile].letter = "";
            setActiveTile(lastTile);
          }
        }
        if (activeTile != -1 && newBoard[activeTile].letter == "") {
          const lastTile = getPreviousFilledNotCorrectTile(activeTile, selectedRow, newBoard);
          if (lastTile != -1) {
            newBoard[lastTile].letter = "";
            setActiveTile(lastTile);
          }
        } else if (activeTile != -1 && newBoard[activeTile].verified != VerificationState.Correct) {
          newBoard[activeTile].letter = "";
        }
        return newBoard;
      });
    } else if (e.key === "Enter") {
      const enteredWord = getRowString(selectedRow, board).toLowerCase();
      if (selectedRow != Row.None && enteredWord.length === 5) {
        if (possibleWords.includes(enteredWord)) {
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
            setPrevGuesses((prev) => [...prev, { guess: characters, row: selectedRow }]);
          }
        } else {
          console.error("not in word list");
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
            gameOver={gameOver}
          />
        ))}
        <NumberTile
          rowNumber={1}
          solved={solved}
          setSelectedRow={setSelectedRow}
          gameOver={gameOver}
        />
        <NumberTile
          rowNumber={2}
          solved={solved}
          setSelectedRow={setSelectedRow}
          gameOver={gameOver}
        />
        <NumberTile
          rowNumber={3}
          solved={solved}
          setSelectedRow={setSelectedRow}
          gameOver={gameOver}
        />
      </div>
      <div>
        <p>Previous Guesses</p>
        <ul className="grid gap-2">
          {prevGuesses.map((guess, i) => (
            <GuessTile key={i} guess={guess} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HangmanWordle;
