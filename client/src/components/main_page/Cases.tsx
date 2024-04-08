import MinorCaseFolder from "../MinorCaseFolder";
import {
  MinorCaseActive,
  MinorCaseCompleted,
  MinorCaseIncoming,
  Round,
} from "@/utils/django_types";
import MinorCaseFolder from "../MinorCaseFolder";
import {
  MinorCaseActive,
  MinorCaseCompleted,
  MinorCaseIncoming,
  Round,
} from "@/utils/django_types";

export default function Cases({
  casesRecord,
  setSelectedCase,
}: {
  casesRecord: (MinorCaseActive | MinorCaseIncoming | MinorCaseCompleted)[];
  setSelectedCase: (round: Round) => void;
}): JSX.Element[] {
  if (casesRecord.length === 0) {
    return [];
  }

  return casesRecord.map((minorCase) => (
    <MinorCaseFolder
      key={minorCase.minor_case_round.id}
      className="hover:rotate-0"
      minorCase={minorCase.minor_case_round}
      majorCase={minorCase.minor_case_round.major_case}
      onClick={() => {
        setSelectedCase(minorCase.minor_case_round);
      }}
    />
  ));
}
