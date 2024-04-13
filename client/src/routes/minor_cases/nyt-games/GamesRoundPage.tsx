import { useMemo } from "react";
import { Link } from "react-router-dom";

import connectionscard from "@/assets/minor_cases/nyt/connectionscard-icon.svg";
import letterboxedcard from "@/assets/minor_cases/nyt/letter-boxed-card-icon.svg";
import tombstone from "@/assets/minor_cases/nyt/tombstone.svg";
import wordlecard from "@/assets/minor_cases/nyt/wordle-card-icon.svg";
import { MajorCaseEnum } from "@/utils/constants";
import type { DjangoContext } from "@/utils/django_types";
import type { PuzzleAnswer } from "@/utils/utils";
import { getUnlockedPuzzles } from "@/utils/utils";

export default function GamesRoundPage({ context }: { context: DjangoContext }) {
  // TODO: add buttons for the three games + the Obituary.
  // They don't need to check if you have the puzzle unlocked, becasue they will :P

  // once a puzzle is solved, this object will have the `answer` field filled in.
  // TODO: on the buttons for the games + Obituary, check if the puzzle is solved and show a check mark if it is.
  // You do not need to show the answer.
  const unlocked_puzzles: PuzzleAnswer[] | null = useMemo(() => {
    if (!context?.team_context) {
      return null;
    }
    return getUnlockedPuzzles(MajorCaseEnum.SOCIAL_DEDUCTION, "nyt", context);
  }, [context]);

  const obituary_answer = unlocked_puzzles?.find((p) => p.puzzle.name == "The Obituary")?.answer;
  const connections_answer = unlocked_puzzles?.find((p) => p.puzzle.name == "Connection")?.answer;
  const letterboxed_answer = unlocked_puzzles?.find((p) => p.puzzle.name == "Lettertroxd")?.answer;
  const wordle_answer = unlocked_puzzles?.find((p) => p.puzzle.name == "Wordlangman")?.answer;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col w-full bg-[#4d88f9] justify-center">
        <Link
          to="/puzzle/obituary"
          className="flex flex-col p-4 bg-white hover:bg-slate-50 cursor-pointer rounded-lg text-black w-[500px] self-center shadow-[0_7px_0_0_#2860d8] m-10 items-center "
        >
          <img src={tombstone} alt="An icon of a tombstone" className="w-32 pt-4 pb-2" />
          <h1 className="karnak text-center text-3xl">The Obituary</h1>
          <p className="franklin text-center font-light pb-2">Saturday, Apr. 13, 2024</p>
          <hr className="w-60" />
          <div className="flex flex-col items-center pt-2 franklin font-light text-slate-400 text-sm pb-6">
            <p>The crossword is overrated,</p>
            <p>read the obituary instead.</p>
            {obituary_answer ? <p className="pt-2 font-bold">Solved: {obituary_answer}</p> : <></>}
          </div>
        </Link>
      </div>
      <div className="flex flex-col w-full bg-white text-black items-center">
        <div className="flex flex-row p-20 gap-8">
          {/* WORDLE */}
          <div>
            <Link
              to="/puzzle/wordle"
              className="group flex flex-col justify-center rounded-lg border-solid border-slate-300 border-[1px] w-72 overflow-hidden hover:shadow-[2px_2px_0_0_#FFE6E6FF]"
            >
              <div className="flex flex-col items-center bg-[#e3e3e1]">
                <img src={wordlecard} alt="Wordle icon" className="w-20 pt-6 pb-4" />
                <div className="karnak text-center text-2xl pb-6">Wordlangman</div>
              </div>
              <div className="franklin font-bold m-4 rounded-full border-solid border-[1px] border-slate-300 text-center py-2 group-hover:bg-neutral-50">
                Play
              </div>
            </Link>
            {wordle_answer ? (
              <div className="text-center py-4 franklin text-slate-500 font-bold">
                Solved: {wordle_answer}
              </div>
            ) : (
              <></>
            )}
          </div>
          {/* CONNECTIONS */}
          <div>
            <Link
              to="/puzzle/connection"
              className="group flex flex-col justify-center rounded-lg border-solid border-slate-300 border-[1px] w-72 overflow-hidden hover:shadow-[2px_2px_0_0_#FFE6E6FF]"
            >
              <div className="flex flex-col items-center bg-[#b4a8ff]">
                <img src={connectionscard} alt="Connections icon" className="w-20 pt-6 pb-4" />
                <div className="karnak text-center text-2xl pb-6">Connections?</div>
              </div>
              <div className="franklin font-bold m-4 rounded-full border-solid border-[1px] border-slate-300 text-center py-2 group-hover:bg-neutral-50">
                Play
              </div>
            </Link>
            {connections_answer ? (
              <div className="text-center py-4 franklin text-slate-500 font-bold">
                Solved: {connections_answer}
              </div>
            ) : (
              <></>
            )}
          </div>
          {/* LETTER TROXD */}
          <div>
            <Link
              to="/puzzle/lettertroxd"
              className="group flex flex-col justify-center rounded-lg border-solid border-slate-300 border-[1px] w-72 overflow-hidden hover:shadow-[2px_2px_0_0_#FFE6E6FF]"
            >
              <div className="flex flex-col items-center bg-[#fc716b]">
                <img src={letterboxedcard} alt="Connections icon" className="w-20 pt-6 pb-4" />
                <div className="karnak text-center text-2xl pb-6">Letter Troxd</div>
              </div>
              <div className="franklin font-bold m-4 rounded-full border-solid border-[1px] border-slate-300 text-center py-2 group-hover:bg-neutral-50">
                Play
              </div>
            </Link>
            {letterboxed_answer ? (
              <div className="text-center py-4 franklin text-slate-500 font-bold">
                Solved: {letterboxed_answer}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
