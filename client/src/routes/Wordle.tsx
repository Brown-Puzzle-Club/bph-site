import HangmanWordle from "@/components/wordle/HangmanGame";
import { GameMode } from "@/components/wordle/utils";
import { useState } from "react";

const Wordle = () => {
  const [gameMode, setGameMode] = useState(GameMode.Hangman);
  // const [chances, setChances] = useState(7);

  return (
    <div className="text-white">
      <h1>Wordle!</h1>
      <div className="grid place-items-center">
        {gameMode === GameMode.Hangman ? <HangmanWordle setGameMode={setGameMode} /> : null}
      </div>
    </div>
  );
};

export default Wordle;
