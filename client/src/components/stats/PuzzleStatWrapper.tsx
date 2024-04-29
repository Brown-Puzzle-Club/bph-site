import { formatDuration, intervalToDuration } from "date-fns";
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";

import { usePuzzleStats } from "@/hooks/useDjangoContext";
import { Error404 } from "@/routes/ErrorPage";
import type { TeamPuzzleStats } from "@/utils/django_types";

import { SortableTable } from "./SortableTable";

const PuzzleStatWrapper = ({ slug }: { slug: string }) => {
  const { data: stats, isError } = usePuzzleStats(slug);

  if (isError) {
    return <Error404 />;
  }

  if (!stats) {
    return <BeatLoader className="justify-center content-center p-4" color={"#fff"} size={12} />;
  }

  const transformData = (header: string, data: TeamPuzzleStats) => {
    switch (header) {
      case "Team":
        return data.name;
      case "Incorrect Guesses":
        return data.incorrect_guesses;
      case "Unlock Time":
        return new Date(data.unlock_time).getTime();
      case "Time to Solve":
        console.log(
          data,
          new Date(data.solve_time).getTime() - new Date(data.unlock_time).getTime(),
        );
        return new Date(data.solve_time).getTime() - new Date(data.unlock_time).getTime();
      case "Solve Time":
        return new Date(data.solve_time).getTime();
      default:
        return "";
    }
  };

  const renderData = (header: string, data: TeamPuzzleStats) => {
    switch (header) {
      case "Team":
        return <Link to={`/team/${data.id}`}>{data.name}</Link>;
      case "Unlock Time":
        return new Date(data.unlock_time).toLocaleString();
      case "Time to Solve":
        return data.solve_time
          ? formatDuration(
              intervalToDuration({
                start: new Date(data.unlock_time),
                end: new Date(data.solve_time),
              }),
            )
          : "DNS";
      case "Solve Time":
        return data.solve_time ? new Date(data.solve_time).toLocaleString() : "DNS";
    }
  };

  return (
    <div>
      <h1>{stats.name}</h1>
      <div>
        <p>Total Solves: {stats.total_solves}</p>
        <p>Total Guesses: {stats.guesses}</p>
      </div>
      <div>
        <p>Hints Asked: {stats.hints}</p>
        <p>Teams Unlocked: {stats.unlocks}</p>
      </div>
      <SortableTable
        data={Object.values(stats.submissions)}
        headers={
          ["Team", "Incorrect Guesses", "Unlock Time", "Time to Solve", "Solve Time"] as const
        }
        transformData={transformData}
        extractKey={(data) => data.name}
        renderData={renderData}
        defaultSortColumn="Solve Time"
      />
    </div>
  );
};

export default PuzzleStatWrapper;
