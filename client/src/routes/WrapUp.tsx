import MinimalSolveGraph from "@/components/stats/MinimalSolveGraph";
import { SortableTable } from "@/components/stats/SortableTable";

const headers = ["Team", "Correct Answers", "Total Answers", "Answer Accuracy"];

const dummyData = [
  { team: "turtle", correctAnswers: 23, totalAnswers: 28, answerAccuracy: 82.14 },
  { team: "GEORGIAN BEAR PAW", correctAnswers: 26, totalAnswers: 36, answerAccuracy: 72.22 },
  { team: "Living Off Hope", correctAnswers: 28, totalAnswers: 40, answerAccuracy: 70.0 },
  { team: "Blueno of the Elite Four", correctAnswers: 22, totalAnswers: 39, answerAccuracy: 56.41 },
  { team: "beep boop", correctAnswers: 26, totalAnswers: 47, answerAccuracy: 55.32 },
  { team: "Galactic Tax Exempt", correctAnswers: 26, totalAnswers: 48, answerAccuracy: 54.17 },
  { team: "The Geese Geese", correctAnswers: 29, totalAnswers: 54, answerAccuracy: 53.7 },
];

const dummyData2 = [
  { team: "The 25 Venters", solveData: { date: new Date(1713079907668), count: 1 } },
  { team: "The 25 Venters", solveData: { date: new Date(1713079907668), count: 2 } },
  { team: "The 25 Venters", solveData: { date: new Date(1713080923024), count: 3 } },
  { team: "The 25 Venters", solveData: { date: new Date(1713086864987), count: 4 } },
];

const transformData = (header: string, data: Record<string, unknown>) => {
  switch (header) {
    case "Team":
      return data.team as string;
    case "Correct Answers":
      return data.correctAnswers as string;
    case "Total Answers":
      return data.totalAnswers as string;
    case "Answer Accuracy":
      return `${data.answerAccuracy}%`;
    default:
      return "";
  }
};

const extractKey = (data: Record<string, unknown>) => data.team as string;

const WrapUp = () => {
  return (
    <div>
      <SortableTable
        headers={headers}
        data={dummyData}
        transformData={transformData}
        extractKey={extractKey}
      />
      <MinimalSolveGraph data={dummyData2} />
    </div>
  );
};

export default WrapUp;
