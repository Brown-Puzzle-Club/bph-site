import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { GuessTile } from "./GuessTile";
import NumberTile from "./NumberTile";
import Tile from "./Tile";
import type { Board, Character, Guess } from "./utils";
import {
  GameMode,
  GameState,
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
import { possibleWords } from "./wordList";

const hangmanTemplateAreas = `'a b c d e A . .'
                              '. . . . f . . .'
                              '. . . . g . . .'
                              '. . . . h . . .'
                              '. . j k i l m C'
                              '. . . . B . . .'`;

interface HangmanWordleProps {
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  setGuesses: React.Dispatch<React.SetStateAction<number>>;
  gameState: GameState;
}

const HangmanWordle = ({ setGameMode, setGuesses, gameState }: HangmanWordleProps) => {
  const [board, setBoard] = useState<Board>(
    new Array(13).fill({ letter: "", verified: VerificationState.Unverified }),
  );
  const [selectedRow, setSelectedRow] = useState<Row>(Row.None);
  const [activeTile, setActiveTile] = useState<number>(-1);
  const [solved, setSolved] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [prevGuesses, setPrevGuesses] = useState<Guess[]>([]);
  const [answers, setAnswers] = useState(["", "", "", ""]);

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
    if (gameState === GameState.InProgress) {
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
  }, [selectedRow, board, gameState]);

  const keyPressHandler = (e: React.KeyboardEvent) => {
    if (gameState !== GameState.InProgress || selectedRow === Row.None) {
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
      if (enteredWord.length === 5) {
        if (possibleWords.includes(enteredWord)) {
          const guessVerification = verifyGuess(enteredWord, answers, selectedRow);
          const letters = enteredWord.split("");
          const characters = letters.map((letter, i) => {
            return { letter: letter, verified: guessVerification[i] };
          }) as [Character, Character, Character, Character, Character];
          if (guessVerification.every((v) => v === VerificationState.Correct)) {
            setBoard((prev) => clearRow(selectedRow, prev, guessVerification, solved));
            setSelectedRow(Row.None);
            setSolved((prev) => {
              const newSolved = [...prev] satisfies [boolean, boolean, boolean];
              newSolved[selectedRow] = true;
              return newSolved;
            });
          } else {
            setBoard((prev) => clearRow(selectedRow, prev, guessVerification, solved));
            setGuesses((prev) => prev - 1);
            setSelectedRow(Row.None);
            setPrevGuesses((prev) => [...prev, { guess: characters, row: selectedRow }]);
          }
        } else {
          toast.error("Not a valid word.", { duration: 5000, position: "top-center" });
        }
      } else {
        toast.error("Not enough letters.", { duration: 5000, position: "top-center" });
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
            gameState={gameState}
          />
        ))}
        <NumberTile
          rowNumber={1}
          solved={solved}
          setSelectedRow={setSelectedRow}
          gameState={gameState}
        />
        <NumberTile
          rowNumber={2}
          solved={solved}
          setSelectedRow={setSelectedRow}
          gameState={gameState}
        />
        <NumberTile
          rowNumber={3}
          solved={solved}
          setSelectedRow={setSelectedRow}
          gameState={gameState}
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
