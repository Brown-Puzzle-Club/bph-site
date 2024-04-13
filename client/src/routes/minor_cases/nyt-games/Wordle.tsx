import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import FinalWordle from "@/components/puzzle/nyt-games/wordle/FinalWordle";
import HangmanWordle from "@/components/puzzle/nyt-games/wordle/HangmanGame";
import { GameMode, GameState } from "@/components/puzzle/nyt-games/wordle/utils";
import { Button } from "@/components/ui/button";

const Wordle = () => {
  const [gameMode, setGameMode] = useState(GameMode.Hangman);
  const [gameState, setGameState] = useState<GameState>(GameState.InProgress);
  const [guesses, setGuesses] = useState(7);
  const [numRows, setNumRows] = useState<number | null>(null);
  const [remountCounter, setRemountCounter] = useState(0);

  useEffect(() => {
    if (gameState === GameState.Win) {
      toast.success("You win!", { duration: Infinity, position: "top-center" });
    } else if (gameState === GameState.Lose) {
      toast.error("You lose!", { duration: Infinity, position: "top-center" });
    }
  }, [gameState]);

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
    <div className="text-black bg-[#ffffff]">
      <h1 className="text-center font-bold text-3xl karnak pt-4 pb-4">Wordlangman</h1>
      <hr />
      <div className="pb-12" />
      <div className="grid place-items-center">
        {gameMode === GameMode.Hangman ? (
          <HangmanWordle
            key={remountCounter}
            setGameMode={setGameMode}
            setGuesses={setGuesses}
            gameState={gameState}
          />
        ) : (
          <FinalWordle
            key={remountCounter}
            gameState={gameState}
            setGameState={setGameState}
            setGuesses={setGuesses}
            numRows={numRows!}
          />
        )}
      </div>
      <div className="flex justify-center items-center flex-col pt-4">
        <div className="flex flex-row gap-2 items-center text-xl py-3 franklin">
          <span>Remaining Guesses:</span>
          <div className="flex flex-row gap-1 pt-1">
            <>
              {[...Array(guesses)].map((_, i) => (
                <div key={i} className="rounded-full bg-neutral-500 w-4 h-4" />
              ))}
            </>
          </div>
        </div>
        <Button
          className="mt-4 text-black outline font-bold py-2 px-4 rounded-full h-12 bg-white hover:bg-slate-200 mb-12"
          onClick={() => {
            setGameMode(GameMode.Hangman);
            setGameState(GameState.InProgress);
            setGuesses(7);
            setNumRows(null);
            setRemountCounter((counter) => counter + 1);
            toast.dismiss();
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Wordle;
