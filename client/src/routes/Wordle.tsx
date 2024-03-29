import HangmanWordle from "@/components/wordle/HangmanGame";
import { GameMode } from "@/components/wordle/utils";
import { useState } from "react";

const Wordle = () => {
  const [gameMode, setGameMode] = useState(GameMode.Hangman);
  const [remountCounter, setRemountCounter] = useState(0);
  const [guesses, setGuesses] = useState(7);

  return (
    <div className="text-white" style={{ fontFamily: "" }}>
      <h1>Wordle!</h1>
      <div className="grid place-items-center">
        {gameMode === GameMode.Hangman ? (
          <HangmanWordle key={remountCounter} setGameMode={setGameMode} setGuesses={setGuesses} />
        ) : null}
      </div>
      <button
        onClick={() => {
          setGameMode(GameMode.Hangman);
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
