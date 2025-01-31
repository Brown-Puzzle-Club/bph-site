import axios from "axios";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";

import BackButton from "@/components/BackButton";
import CasePageArt from "@/components/minor_cases/CasePageArt";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAllPuzzleStats, useDjangoContext } from "@/hooks/useDjangoContext";
import { useTheme } from "@/hooks/useTheme";
import useBPHStore, { BOTTOM_LEFT } from "@/stores/useBPHStore";
import { IS_MINOR_CASE_UNLOCKED } from "@/utils/auth";
import type { MajorCaseEnum } from "@/utils/constants";
import { CASE_PALETTE } from "@/utils/constants";
import type { DjangoContext } from "@/utils/django_types";
import { DEFAULT_THEME } from "@/utils/themes";
import type { PuzzleAnswer } from "@/utils/utils";
import { getUnlockedPuzzles } from "@/utils/utils";

import { Error404 } from "./ErrorPage";
import GamesRoundPage from "./minor_cases/nyt-games/GamesRoundPage";

const ALT_MINOR_CASE_ROUTE = (mc_slug: string, context: DjangoContext) => {
  switch (mc_slug) {
    case "nyt":
      return <GamesRoundPage context={context} />;
    default:
      return null;
  }
};

function MinorCasePage() {
  const { setTheme } = useTheme();
  const setPosition = useBPHStore((state) => state.setBluenoirPosition);

  const { data: all_stats } = useAllPuzzleStats();

  useEffect(() => {
    setTheme(DEFAULT_THEME);
  }, [setTheme]);

  useEffect(() => {
    setPosition(BOTTOM_LEFT);
  });

  const { slug: minorCaseSlug } = useParams();
  const navigate = useNavigate();

  const attemptVoucher = async (minor_case_slug: string) => {
    axios
      .post(`/api/rounds/${minor_case_slug}/voucher`)
      .then((response) => {
        if (response.status === 200) {
          toast.success(`Minor case solved (${response.data.guess}) with voucher! 🎉`);
        }
      })
      .catch((error) => {
        console.error(error.response.data.error);
        toast.error(error.response.data.error);
      });
  };

  const { data: context } = useDjangoContext();

  const majorCaseSlug = useMemo(() => {
    // return the unlocks slug that contains the minor case MINOR_CASE_SLUG
    if (!context?.team_context || !minorCaseSlug) {
      return null;
    }

    for (const [major_case, rounds] of Object.entries(context.team_context.unlocks)) {
      if (rounds[minorCaseSlug]) {
        return major_case;
      }
    }
  }, [minorCaseSlug, context?.team_context]);

  const unlocked_puzzles: PuzzleAnswer[] | null = useMemo(() => {
    if (!majorCaseSlug || !minorCaseSlug || !context?.team_context) {
      return null;
    }

    return getUnlockedPuzzles(majorCaseSlug, minorCaseSlug, context);
  }, [majorCaseSlug, minorCaseSlug, context]);

  console.log(unlocked_puzzles);

  if (!context?.team_context) {
    return <BeatLoader className="justify-center content-center p-4" color={"#fff"} size={12} />;
  }

  if (!minorCaseSlug || !IS_MINOR_CASE_UNLOCKED(minorCaseSlug)(context)) {
    navigate("/eventpage");
    return <Error404 />;
  }

  const CASE_SOLVED =
    unlocked_puzzles?.find(
      (puzzle_answer) => puzzle_answer.puzzle.is_meta && puzzle_answer.answer,
    ) !== undefined;

  if (ALT_MINOR_CASE_ROUTE(minorCaseSlug, context)) {
    return ALT_MINOR_CASE_ROUTE(minorCaseSlug, context);
  }

  if (!context.hunt_context.hunt_has_started && !context.team_context.is_admin) {
    return <Error404 />;
  }

  return (
    <div>
      <BackButton to={"/eventpage"} />
      <CasePageArt case_slug={minorCaseSlug} />
      {context && context.team_context.unlocks && (
        <>
          <section className="minorcase-info">
            <div
              className="text-left dark pb-2 pt-2 no-underline outline-none focus:shadow-md border-4 rounded-xl relative mx-[10%] md:mx-[25%] my-8"
              style={{
                borderColor: CASE_PALETTE[majorCaseSlug as MajorCaseEnum].primary,
                backgroundImage: `linear-gradient(to bottom, ${CASE_PALETTE[majorCaseSlug as MajorCaseEnum].backgroundStart}, ${CASE_PALETTE[majorCaseSlug as MajorCaseEnum].backgroundEnd})`,
              }}
            >
              <div className="contact-content custom-scroll h-full max-h-[65dvh] overflow-y-auto">
                {unlocked_puzzles?.map((puzzle_answer, index, array) => (
                  <div
                    key={puzzle_answer.puzzle.slug}
                    className={`team-box px-6 pt-3 pb-3 flex justify-between items-center space-x-4 text-slate-800`}
                    style={
                      index !== array.length - 1
                        ? {
                            borderBottomColor: CASE_PALETTE[majorCaseSlug as MajorCaseEnum].primary,
                            borderBottomWidth: "4px",
                          }
                        : {}
                    }
                  >
                    <div className="block items-center space-x-4">
                      <span
                        className="text-xl font-bold w-9"
                        style={{
                          color: CASE_PALETTE[majorCaseSlug as MajorCaseEnum].textColor,
                        }}
                      >
                        {index + 1}
                      </span>
                      <Link
                        className={`text-md underline ${puzzle_answer.puzzle.is_meta ? "font-bold" : ""}`}
                        to={`/puzzle/${puzzle_answer.puzzle.slug}`}
                        style={{ color: CASE_PALETTE[majorCaseSlug as MajorCaseEnum].textColor }}
                      >
                        {puzzle_answer.puzzle.name.toUpperCase()}
                      </Link>
                      {all_stats && all_stats[puzzle_answer.puzzle.slug] && (
                        <>
                          <br></br>
                          <Link
                            to={`/puzzle/${puzzle_answer.puzzle.slug}/stats`}
                            className="font-mono font-bold text-center hover:underline"
                          >
                            {all_stats[puzzle_answer.puzzle.slug].total_solves} solves{" "}
                            {all_stats[puzzle_answer.puzzle.slug].guesses} guesses{" "}
                            {all_stats[puzzle_answer.puzzle.slug].unlocks} teams
                          </Link>
                        </>
                      )}
                    </div>
                    <span
                      className="pl-3 font-mono font-bold"
                      style={{ color: CASE_PALETTE[majorCaseSlug as MajorCaseEnum].answerColor }}
                    >
                      {puzzle_answer.answer}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {context.team_context.num_free_answers_remaining > 0 && !CASE_SOLVED && (
            <section className="minorcase-voucher">
              <div className="flex justify-center items-center space-x-4">
                <div className="text-xl font-bold">
                  You have {context.team_context.num_free_answers_remaining} free case voucher
                  {context.team_context.num_free_answers_remaining > 1 ? "s" : ""} remaining.
                </div>

                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button className="btn btn-primary transition hover:bg-slate-200 hover:text-[black]">
                      💣 Solve Case 💣
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Using your voucher will automatically solve the minor case for you, and
                        cannot be undone. <b>Make sure your team is ready before continuing!</b>
                        <br></br>
                        <br></br>
                        You get vouchers from completing in person events, of which there are only
                        two.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => attemptVoucher(minorCaseSlug)}>
                        Use Voucher
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default MinorCasePage;
