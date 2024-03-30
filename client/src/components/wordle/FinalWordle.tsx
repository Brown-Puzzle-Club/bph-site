import { useEffect, useState } from "react";
import { Character, GameState, Row, VerificationState, verifyGuess } from "./utils";
import Tile from "./Tile";
import { useToast } from "../ui/use-toast";
import { possibleWords } from "./wordList";

interface FinalWordleProps {
  answer: string;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setGuesses: React.Dispatch<React.SetStateAction<number>>;
  numRows: number;
}

interface WordleGameState {
  board: Character[][];
  currentRow: number;
  activeTile: number;
}

const buildBoard = (numRows: number): Character[][] => {
  const board = [];
  for (let i = 0; i < numRows; i++) {
    board.push(Array(5).fill({ letter: "", verified: VerificationState.Unverified }));
  }
  return board;
};

const FinalWordle = ({
  answer,
  gameState,
  setGameState,
  setGuesses,
  numRows,
}: FinalWordleProps) => {
  const [{ board, currentRow, activeTile }, setWordleGameState] = useState<WordleGameState>({
    board: buildBoard(numRows),
    currentRow: 0,
    activeTile: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    console.log(activeTile);
  }, [activeTile]);

  const keyPressHandler = (e: React.KeyboardEvent) => {
    if (gameState !== GameState.InProgress) {
      return;
    }

    console.log(e.key);

    if ("a" <= e.key && e.key <= "z") {
      setWordleGameState((prev) => {
        const newBoard = prev.board.map((arr) => [...arr]);
        if (newBoard[currentRow][activeTile].letter === "") {
          newBoard[currentRow][activeTile] = {
            letter: e.key.toUpperCase(),
            verified: VerificationState.Unverified,
          };
        }

        return {
          ...prev,
          board: newBoard,
          activeTile: prev.activeTile == 4 ? 4 : prev.activeTile + 1,
        };
      });
    } else if (e.key === "Backspace") {
      // Update the board
      setWordleGameState((prev) => {
        const newBoard = prev.board.map((arr) => [...arr]);
        if (newBoard[currentRow][activeTile].letter !== "") {
          newBoard[currentRow][activeTile] = { letter: "", verified: VerificationState.Unverified };
        } else if (activeTile > 0) {
          newBoard[currentRow][activeTile - 1] = {
            letter: "",
            verified: VerificationState.Unverified,
          };
        }
        return {
          ...prev,
          board: newBoard,
          activeTile: activeTile > 0 ? activeTile - 1 : 0,
        };
      });
    } else if (e.key === "Enter") {
      // Check the answer
      const enteredWord = board[currentRow]
        .map((char) => char.letter)
        .join("")
        .toLowerCase();
      if (enteredWord.length === 5) {
        if (possibleWords.includes(enteredWord)) {
          const guessVerification = verifyGuess(enteredWord, [answer], Row.Top);
          if (guessVerification.every((v) => v === VerificationState.Correct)) {
            setGameState(GameState.Win);
          } else {
            setGuesses((prev) => prev - 1);
            setWordleGameState((prev) => {
              const newBoard = prev.board.map((arr) => [...arr]);
              newBoard[currentRow] = newBoard[currentRow].map((char, i) => {
                return { letter: char.letter, verified: guessVerification[i] };
              });
              return {
                ...prev,
                board: newBoard,
              };
            });
            if (currentRow + 1 === numRows) {
              setGameState(GameState.Lose);
            } else {
              setWordleGameState((prev) => {
                const newBoard = prev.board.map((arr) => [...arr]);
                newBoard[currentRow] = newBoard[currentRow].map((char, i) => {
                  return { letter: char.letter, verified: guessVerification[i] };
                });
                return {
                  board: newBoard,
                  currentRow: currentRow + 1,
                  activeTile: 0,
                };
              });
            }
          }
        } else {
          const { dismiss } = toast({
            title: "Not a valid word",
            variant: "wordle",
          });
          setTimeout(dismiss, 2000);
        }
      } else {
        const { dismiss } = toast({
          title: "Not enough letters",
          variant: "wordle",
        });
        setTimeout(dismiss, 2000);
      }
    }
  };

  return (
    <div tabIndex={0} className="grid gap-2 grid-cols-5" onKeyDown={keyPressHandler}>
      {board.map((row, i) => row.map((char, j) => <Tile key={5 * i + j} character={char} />))}
    </div>
  );
};

export default FinalWordle;
