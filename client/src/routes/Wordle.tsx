import HangmanWordle from "@/components/wordle/HangmanGame";
import { GameMode, GameState } from "@/components/wordle/utils";
import { useEffect, useState } from "react";

const Wordle = () => {
  const [gameMode, setGameMode] = useState(GameMode.Hangman);
  const [gameState, setGameState] = useState<GameState>(GameState.InProgress);
  const [remountCounter, setRemountCounter] = useState(0);
  const [guesses, setGuesses] = useState(7);

  useEffect(() => {
    if (guesses <= 0) {
      setGameState(GameState.Lose);
    }
  }, [guesses]);

  return (
    <div className="text-black" style={{ fontFamily: "" }}>
      <h1>Wordle!</h1>

      <div className="grid place-items-center">
        {gameMode === GameMode.Hangman ? (
          <HangmanWordle
            key={remountCounter}
            setGameMode={setGameMode}
            setGuesses={setGuesses}
            gameState={gameState}
          />
        ) : null}
      </div>
      <button
        onClick={() => {
          setGameMode(GameMode.Hangman);
          setGameState(GameState.InProgress);
          setGuesses(7);
          setRemountCounter((counter) => counter + 1);
        }}
      >
        Reset
      </button>
      <p>Remaining Guesses: {guesses}</p>
    </div>
  );
};

export default Wordle;
