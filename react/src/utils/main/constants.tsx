import { TestCaseArt } from "@/components/minor_cases/minor_case_art";

interface CaseArtByRoundSlug {
  [key: string]: JSX.Element;
}

export const CASE_ART_BY_ROUND_SLUG: CaseArtByRoundSlug = {
  test_case: <TestCaseArt />,
};
