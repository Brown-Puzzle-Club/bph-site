import { useLocalStorage } from "@uidotdev/usehooks";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { IDLE_TIMER } from "@/components/bluenoir/Bluenoir";
import useBPHStore from "@/stores/useBPHStore";
import { wordleFailDialogue } from "@/utils/bluenoir_dialogue";

import Tile from "./Tile";
import type { Character } from "./utils";
import { GameState, VerificationState } from "./utils";
import { possibleWordsToGuess } from "./wordList";

interface FinalWordleProps {
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

const verifyGuess = async (guess: string): Promise<VerificationState[]> => {
  const response = await axios.post("/api/puzzle/wordle/verify-guess", { guess });
  if (response.status === 200) {
    const responseArray = response.data.verification;
    const verificationArray = [];

    for (const v of responseArray) {
      if (v === "correct") {
        verificationArray.push(VerificationState.Correct);
      } else if (v === "incorrect") {
        verificationArray.push(VerificationState.Incorrect);
      } else if (v === "miss") {
        verificationArray.push(VerificationState.SameMiss);
      } else {
        verificationArray.push(VerificationState.Unverified);
      }
    }

    return verificationArray;
  }
  return [
    VerificationState.Incorrect,
    VerificationState.Incorrect,
    VerificationState.Incorrect,
    VerificationState.Incorrect,
    VerificationState.Incorrect,
  ];
};

const FinalWordle = ({ gameState, setGameState, setGuesses, numRows }: FinalWordleProps) => {
  const [{ board, currentRow, activeTile }, setWordleGameState] = useState<WordleGameState>({
    board: buildBoard(numRows),
    currentRow: 0,
    activeTile: 0,
  });
  const [, setFails] = useLocalStorage("wordle-fails", 0);
  const bluenoirRestart = useBPHStore((state) => state.restartIdleTimer);
  const speak = useBPHStore((state) => state.bluenoirSpeak);

  const keyPressHandler = (e: React.KeyboardEvent) => {
    if (gameState !== GameState.InProgress) {
      return;
    }

    if ("a" <= e.key && e.key <= "z") {
      setWordleGameState((prev) => {
        const newBoard = prev.board.map((arr) => [...arr]);
        if (newBoard[prev.currentRow][prev.activeTile].letter === "") {
          newBoard[prev.currentRow][prev.activeTile] = {
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
        if (newBoard[prev.currentRow][prev.activeTile].letter !== "") {
          newBoard[prev.currentRow][prev.activeTile] = {
            letter: "",
            verified: VerificationState.Unverified,
          };
        } else if (activeTile > 0) {
          newBoard[currentRow][prev.activeTile - 1] = {
            letter: "",
            verified: VerificationState.Unverified,
          };
        }
        return {
          ...prev,
          board: newBoard,
          activeTile: prev.activeTile > 0 ? prev.activeTile - 1 : 0,
        };
      });
    } else if (e.key === "Enter") {
      const enteredWord = board[currentRow]
        .map((char) => char.letter)
        .join("")
        .toLowerCase();
      if (enteredWord.length === 5) {
        if (possibleWordsToGuess.includes(enteredWord)) {
          verifyGuess(enteredWord).then((guessVerification) => {
            if (guessVerification.every((v) => v === VerificationState.Correct)) {
              setGameState(GameState.Win);
            } else {
              setGuesses((prevNumGuesses) => {
                if (prevNumGuesses === 1) {
                  setFails((prevNumFails) => {
                    bluenoirRestart(speak, IDLE_TIMER * 1000);
                    speak(wordleFailDialogue(prevNumFails));
                    return prevNumFails + 1;
                  });
                }
                return prevNumGuesses - 1;
              });
            }

            setWordleGameState((prev) => {
              const newBoard = prev.board.map((arr) => [...arr]);
              newBoard[prev.currentRow] = newBoard[prev.currentRow].map((char, i) => {
                return { letter: char.letter, verified: guessVerification[i] };
              });
              return {
                ...prev,
                board: newBoard,
                currentRow: prev.currentRow + 1,
                activeTile: 0,
              };
            });
          });
        } else {
          toast.error("Not a valid word.", { duration: 5000, position: "top-center" });
        }
      } else {
        toast.error("Not enough letters.", { duration: 5000, position: "top-center" });
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
