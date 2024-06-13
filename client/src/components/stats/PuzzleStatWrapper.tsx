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
    <div className="mx-auto w-[80vw] max-w-5xl">
      <h1 className="text-center py-6 font-bold text-5xl capitalize">{stats.name}</h1>

      <div className="py-4" />

      <div className="flex justify-center gap-16 text-center">
        <div className="grid basis-1/2 place-items-center border-2 border-white">
          <div className="bg-white w-full h-8" />
          <div className="grid py-2">
            <p>
              <span className="font-bold">Total Solves:</span> {stats.total_solves}
            </p>
            <p>
              <span className="font-bold">Total Guesses:</span> {stats.guesses}
            </p>
          </div>
        </div>

        <div className="grid basis-1/2 place-items-center border-2 border-white">
          <div className="bg-white w-full h-8" />
          <div className="grid py-2">
            <p>
              <span className="font-bold">Hints Asked:</span> {stats.hints}
            </p>
            <p>
              <span className="font-bold">Teams Unlocked:</span> {stats.unlocks}
            </p>
          </div>
        </div>
      </div>

      <div className="py-4" />

      <SortableTable
        data={Object.values(stats.submissions)}
        headers={["Team", "Incorrect Guesses", "Unlock Time", "Time to Solve", "Solve Time"]}
        transformData={transformData}
        extractKey={(data) => data.name}
        renderData={renderData}
        defaultSortColumn="Solve Time"
      />
    </div>
  );
};

export default PuzzleStatWrapper;
