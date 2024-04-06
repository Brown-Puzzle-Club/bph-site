import FinalWordle from "@/components/puzzle/nyt-games/wordle/FinalWordle";
import HangmanWordle from "@/components/puzzle/nyt-games/wordle/HangmanGame";
import { GameMode, GameState, generateAnswers } from "@/components/puzzle/nyt-games/wordle/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

const Wordle = () => {
  const [gameMode, setGameMode] = useState(GameMode.Hangman);
  const [gameState, setGameState] = useState<GameState>(GameState.InProgress);
  const [guesses, setGuesses] = useState(9);
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [numRows, setNumRows] = useState<number | null>(null);
  const [remountCounter, setRemountCounter] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (gameState === GameState.Win) {
      toast({
        variant: "wordle",
        title: "You win!",
      });
    } else if (gameState === GameState.Lose) {
      toast({
        variant: "wordle",
        title: "You lose!",
      });
    }
  }, [gameState, toast]);

  useEffect(() => {
    setAnswers((prev) => {
      if (prev[0] === "" && prev[1] === "" && prev[2] === "") {
        return generateAnswers();
      }
      return prev;
    });
  }, [setAnswers]);

  useEffect(() => {
    if (gameMode === GameMode.FinalWordle && numRows === null) {
      setNumRows((prev) => (prev === null ? guesses : prev));
      setRemountCounter((counter) => counter + 1);
    }
  }, [gameMode, setNumRows, guesses, numRows]);

  useEffect(() => {
    if (guesses <= 0) {
      setGameState(GameState.Lose);
    }
  }, [guesses]);

  return (
    <div className="text-black bg-[#e6e6ec]">
      <h1 className="text-center font-bold text-3xl py-4">Wordlangman</h1>

      <div className="grid place-items-center">
        {gameMode === GameMode.Hangman ? (
          <HangmanWordle
            key={remountCounter}
            setGameMode={setGameMode}
            setGuesses={setGuesses}
            gameState={gameState}
            answers={answers.slice(0, 3) as [string, string, string]}
          />
        ) : (
          <FinalWordle
            key={remountCounter}
            answer={answers[3]}
            gameState={gameState}
            setGameState={setGameState}
            setGuesses={setGuesses}
            numRows={numRows!}
          />
        )}
      </div>
      <div className="flex justify-center items-center flex-col pt-4">
        <p className="text-xl py-3">
          <b>Remaining Guesses</b>: {guesses}
        </p>
        <Button
          onClick={() => {
            setGameMode(GameMode.Hangman);
            setGameState(GameState.InProgress);
            setGuesses(7);
            setAnswers(generateAnswers());
            setNumRows(null);
            setRemountCounter((counter) => counter + 1);
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Wordle;
