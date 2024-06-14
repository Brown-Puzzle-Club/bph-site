import { useLocalStorage } from "@uidotdev/usehooks";
import axios from "axios";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import useBPHStore from "@/stores/useBPHStore";
import { getMajorCaseIdleDialogue } from "@/utils/bluenoir_dialogue";
import { MAJOR_CASE_NAMES, MajorCaseEnum } from "@/utils/constants";
import type { MajorCase, Puzzle } from "@/utils/django_types";

import BackButton from "../BackButton";
import AnswerSubmit from "../puzzle/AnswerSubmission";

const SPOILER_MAJOR_CASES = [MajorCaseEnum.COLORED_THREAD, MajorCaseEnum.SOCIAL_DEDUCTION];
const SpoilerAlert = ({ major_case }: { major_case: MajorCaseEnum }) => {
  const [dismissed, setDismissed] = useLocalStorage(`spoiler-alert-${major_case}`, false);

  const case_name = MAJOR_CASE_NAMES[major_case];

  return (
    <>
      {!dismissed && (
        <div className="alert z-40 backdrop-blur-lg h-screen w-screen flex items-center fixed justify-center">
          <div className="text-lg tracking-wide md:text-base md:tracking-normal text-center dark bg-slate-900 from-muted/50 to-muted/80 p-6 no-underline outline-none focus:shadow-md btn-gradient-1 relative mx-[5%] md:mx-[20%]">
            <p className="mb-4">
              <b>WARNING:</b> As the hunt is now over, this page contains all feeder answers for{" "}
              <b>The Case of {case_name}.</b>
              <br></br>
              <br></br>
              <i>If you do not want to be spoiled, leave and come back later!</i>
            </p>
            <Link
              to={"/eventpage"}
              className="rounded-md px-6 py-2 bg-slate-700 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
            >
              <div className="inline-block items-center ">
                <IoMdArrowRoundBack className="inline-block align-middle" />
                <span className="inline-block">Leave Major Case</span>
              </div>
            </Link>
            <button
              onClick={() => {
                setDismissed(true);
              }}
              className="rounded-md mx-2 px-6 py-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
            >
              Enter
            </button>
          </div>
        </div>
      )}
    </>
  );
};

function MajorCaseWrapper({ children }: { children: ReactNode }) {
  const [majorCase, setMajorCase] = useState<MajorCase>({} as MajorCase);
  const { pathname } = useLocation();
  const setBluenoirDialogue = useBPHStore((state) => state.setRandomDialogueFunction);
  const { team } = useAuth();
  console.log(team.data);

  const majorCaseSlug = pathname.split("/").pop();
  useEffect(() => {
    const url = `/api/major-case/${majorCaseSlug}`;
    axios.get(url).then((response) => {
      const major_case = response.data as MajorCase;
      // jank fix to match regular answer submission
      major_case.puzzle = { name: major_case.name, slug: majorCaseSlug } as Puzzle;
      major_case.puzzle.submissions = major_case.submissions;
      setMajorCase(major_case);
    });
  }, [majorCaseSlug, pathname]);

  useEffect(() => {
    setBluenoirDialogue(() => {
      return getMajorCaseIdleDialogue(majorCaseSlug as MajorCaseEnum);
    });
  });

  // TYPE JANKNESS OOPS
  const puzzle = useMemo(() => {
    return {
      ...majorCase.puzzle,
      id: 0,
      order: 0,
      body: "",
      is_meta: false,
      is_major_meta: true,
      round: {
        id: 0,
        name: "",
        slug: "",
        order: 0,
        major_case: {} as MajorCase,
        description: "",
        unlock_global_minor: 0,
        unlock_local_major: 0,
        meta: 0,
      },
      body_remote: "",
      solution: "",
      clipboard: "",
      clipboard_remote: "",
      errata: [],
      answer: "",
    };
  }, [majorCase]);

  return (
    <div className="puzzle-page">
      {SPOILER_MAJOR_CASES.includes(majorCaseSlug as MajorCaseEnum) && !team.data && (
        <SpoilerAlert major_case={majorCaseSlug as MajorCaseEnum} />
      )}
      <AnswerSubmit puzzle={puzzle} major_case={majorCase.slug as MajorCaseEnum} />
      <BackButton to={`/eventpage`} />
      {children}
    </div>
  );
}

export default MajorCaseWrapper;
