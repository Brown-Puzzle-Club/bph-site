import { TestCaseArt } from "@/components/minor_cases/FolderArt";
import { TestCaseArt } from "@/components/minor_cases/FolderArt";

interface CaseArtByRoundSlug {
  [key: number]: JSX.Element;
}

export const CASE_ART_BY_ROUND_SLUG: CaseArtByRoundSlug = {
  2: <TestCaseArt />,
};
