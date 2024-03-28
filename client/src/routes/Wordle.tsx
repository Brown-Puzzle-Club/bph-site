import HangmanWordle from "@/components/wordle/HangmanGame";
import { GameMode } from "@/components/wordle/utils";
import { useState } from "react";

const Wordle = () => {
  const [gameMode, setGameMode] = useState(GameMode.Hangman);
  const [remountCounter, setRemountCounter] = useState(0);
  // const [chances, setChances] = useState(7);

  return (
    <div className="text-white">
      <h1>Wordle!</h1>
      <div className="grid place-items-center">
        {gameMode === GameMode.Hangman ? (
          <HangmanWordle key={remountCounter} setGameMode={setGameMode} />
        ) : null}
      </div>
      <button
        onClick={() => {
          setGameMode(GameMode.Hangman);
          setRemountCounter((counter) => counter + 1);
        }}
      >
        Reset
      </button>
    </div>
  );
};

export default Wordle;
