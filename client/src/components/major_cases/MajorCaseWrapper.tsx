import axios from "axios";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import type { MajorCase, Puzzle } from "@/utils/django_types";

import AnswerSubmit from "../puzzle/AnswerSubmission";

function MajorCaseWrapper({ children }: { children: ReactNode }) {
  const [majorCase, setMajorCase] = useState<MajorCase>({} as MajorCase);

  const { pathname } = useLocation();
  useEffect(() => {
    const majorCaseSlug = pathname.split("/").pop();
    const url = `/api/major-case/${majorCaseSlug}`;
    console.log(`fetching major case from ${url}`);
    axios.get(url).then((response) => {
      const major_case = response.data as MajorCase;
      console.log(major_case);
      // jank fix to match regular answer submission
      major_case.puzzle = { name: major_case.name, slug: majorCaseSlug } as Puzzle;
      major_case.puzzle.submissions = major_case.submissions;
      setMajorCase(major_case);
      console.log(major_case);
    });
  }, [pathname]);

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
      },
      body_remote: "",
      solution: "",
      clipboard: "",
      clipboard_remote: "",
      errata: [],
    };
  }, [majorCase]);

  return (
    <div className="puzzle-page">
      <AnswerSubmit puzzle={puzzle} />
      {children}
    </div>
  );
}

export default MajorCaseWrapper;
