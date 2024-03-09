import { TestCaseArt } from "@/components/minor_cases/minor_case_art";

interface CaseArtByRoundSlug {
  [key: number]: JSX.Element;
}

export const CASE_ART_BY_ROUND_SLUG: CaseArtByRoundSlug = {
  2: <TestCaseArt />,
};
