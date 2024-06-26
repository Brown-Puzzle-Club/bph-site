import { Reorder } from "framer-motion";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { BeatLoader } from "react-spinners";

import TeamIcon from "@/components/team/TeamIcon";
import { useAuth } from "@/hooks/useAuth";
import { useLeaderboardTeams } from "@/hooks/useDjangoContext";
import type { LeaderboardTeam, Team, UserTeam } from "@/utils/django_types";
import { cn } from "@/utils/utils";

const eventSolveDateFormat = (date: Date) => {
  const datePart = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const timePart = date.toLocaleTimeString();
  return `${datePart} ${timePart}`;
};

enum LeaderboardTab {
  IN_PERSON = "In Person",
  REMOTE = "Remote",
}

type Header = "major" | "minor" | "total" | "time";

type TransformData = (header: Header, data: LeaderboardTeam) => string | number;
const sortData = (
  data: LeaderboardTeam[],
  transformData: TransformData,
  sortColumn: Header,
  sortAscending: boolean,
) => {
  return [...data].sort((a, b) => {
    const valueA = transformData(sortColumn, a);
    const valueB = transformData(sortColumn, b);

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortAscending ? valueA - valueB : valueB - valueA;
    }

    const valueAString = valueA.toString();
    const valueBString = valueB.toString();

    return sortAscending
      ? valueAString.localeCompare(valueBString)
      : valueBString.localeCompare(valueAString);
  });
};

export default function Leaderboard() {
  const { team } = useAuth();
  const { data: teams } = useLeaderboardTeams();
  console.log(teams);
  const [curTab, setTab] = useState<LeaderboardTab>(() => {
    const savedTab = Cookies.get("leaderboardTab");
    return savedTab ? (savedTab as LeaderboardTab) : LeaderboardTab.IN_PERSON;
  });
  const [selectedHeader, setSelectedHeader] = useState<Header>("time");
  const [sortAscending, setSortAscending] = useState<boolean>(false);
  const [values, setValues] = useState<LeaderboardTeam[]>(teams || []);

  const getTeamTab = (team: Team | UserTeam) => {
    return team.in_person ? LeaderboardTab.IN_PERSON : LeaderboardTab.REMOTE;
  };

  useEffect(() => {
    // 1 hour expiration of cookie that keeps track of your current tab
    Cookies.set("leaderboardTab", curTab, { expires: 1 / 24 });
  }, [curTab]);

  useEffect(() => {
    const savedTab = Cookies.get("leaderboardTab");
    if (team.data && !savedTab) {
      setTab(getTeamTab(team.data));
    }
  }, [team]);

  const collectRemoteTeams = (teams: LeaderboardTeam[]) => {
    return teams.filter(
      (cur_team) => !cur_team.in_person && (!cur_team.is_hidden || cur_team.id === team.data?.id),
    );
  };

  const collectInPersonTeams = (teams: LeaderboardTeam[]) => {
    return teams.filter(
      (cur_team) => cur_team.in_person && (!cur_team.is_hidden || cur_team.id === team.data?.id),
    );
  };

  const collectTeams = (teams: LeaderboardTeam[], tab: LeaderboardTab) => {
    switch (tab) {
      case LeaderboardTab.IN_PERSON:
        return collectInPersonTeams(teams);
      case LeaderboardTab.REMOTE:
        return collectRemoteTeams(teams);
    }
  };

  const updateSortHeader = (header: Header) => {
    if (header === selectedHeader) {
      setSortAscending((sortAscending) => !sortAscending);
    } else {
      setSelectedHeader(header);
      setSortAscending(false);
    }
  };

  const transformData = (header: Header, data: LeaderboardTeam) => {
    switch (header) {
      case "major":
        return data.major_case_solve_count;
      case "minor":
        return data.minor_case_solve_count;
      case "total":
        return data.total_solves;
      case "time":
        return data.all_metas_solve_time != null
          ? -new Date(data.all_metas_solve_time).getTime()
          : -Infinity;
    }
  };

  useEffect(() => {
    setValues(sortData(teams ?? [], transformData, selectedHeader, sortAscending));
  }, [selectedHeader, sortAscending, teams]);

  return (
    <div className="contact bg-slate-900 text-white h-[90vh] overscroll-contain overflow-hidden overflow-y-auto ">
      <h1 className="text-4xl font-bold text-center py-5">Teams</h1>
      {/* <h1 className="text-md text-center pb-5">
        !! Due to our unconventional unlock structure, we will not be releasing stats until after
        the hunt is closed !!
      </h1> */}
      <div className="tabs flex items-center justify-end gap-4 mx-[5%] md:mx-[20%] pr-10 z-10">
        <button
          onClick={() => setTab(LeaderboardTab.IN_PERSON)}
          className={`select-none rounded-t-md transition-colors py-2 px-6 hover:text-white ${
            curTab === LeaderboardTab.REMOTE ? "hover:bg-[#b3957c]" : ""
          } ${
            curTab === LeaderboardTab.IN_PERSON
              ? "bg-[#957a62] text-white font-bold"
              : "bg-[#745a45] text-[#ffffffb8]"
          }`}
        >
          On-Campus
        </button>
        <button
          onClick={() => setTab(LeaderboardTab.REMOTE)}
          className={`select-none rounded-t-md transition-colors py-2 px-6 hover:text-white ${
            curTab === LeaderboardTab.IN_PERSON ? "hover:bg-[#b3957c]" : ""
          } ${
            curTab === LeaderboardTab.REMOTE
              ? "bg-[#957a62] text-white font-bold"
              : "bg-[#745a45] text-[#ffffffb8]"
          }`}
        >
          Remote
        </button>
      </div>
      <div className="text-left dark bg-gradient-to-b from-[#b3957c] to-[#a28369] pb-2 pt-2 no-underline outline-none focus:shadow-md border-4 border-[#957a62] rounded-xl relative mx-[5%] md:mx-[20%] px-4">
        {teams ? (
          <table className="contact-content custom-scroll h-full max-h-[65dvh] overflow-y-auto w-full table-fixed">
            <thead className="border-b-4 border-[#544334] bg-[#AF9178] rounded-xl font-mono select-none text-[2vw] md:text-sm">
              <tr className="team-box px-6 pt-3 pb-3 text-slate-800">
                <th className="font-bold w-[3%]">#</th>
                <th className="font-bold w-[50%]">Team Name</th>
                <th
                  onClick={() => updateSortHeader("major")}
                  className="font-bold hover:cursor-pointer"
                >
                  Major Cases Solved
                  <span className={cn(selectedHeader === "major" ? "visible" : "invisible")}>
                    {sortAscending ? "▲" : "▼"}
                  </span>
                </th>
                <th
                  onClick={() => updateSortHeader("minor")}
                  className="font-bold hover:cursor-pointer"
                >
                  Minor Cases Solved
                  <span className={cn(selectedHeader === "minor" ? "visible" : "invisible")}>
                    {sortAscending ? "▲" : "▼"}
                  </span>
                </th>
                <th
                  onClick={() => updateSortHeader("total")}
                  className="font-bold hover:cursor-pointer"
                >
                  Total Puzzles Solved
                  <span className={cn(selectedHeader === "total" ? "visible" : "invisible")}>
                    {sortAscending ? "▲" : "▼"}
                  </span>
                </th>
                <th
                  onClick={() => updateSortHeader("time")}
                  className="font-bold hover:cursor-pointer"
                >
                  Finish Time
                  <span className={cn(selectedHeader === "time" ? "visible" : "invisible")}>
                    {sortAscending ? "▲" : "▼"}
                  </span>
                </th>
              </tr>
            </thead>
            <Reorder.Group as="tbody" values={values} onReorder={() => {}}>
              {collectTeams(values, curTab).map((cur_team, index, array) => (
                <Reorder.Item
                  as="tr"
                  value={cur_team}
                  key={cur_team.id}
                  dragListener={false}
                  className={cn(
                    "team-box px-6 py-3 text-slate-800",
                    index !== array.length - 1 && "border-b-4 border-[#957a62]",
                    cur_team.id === team.data?.id && "bg-[#ceaa8a]",
                  )}
                >
                  <td className="text-xl font-bold py-4">{index + 1}</td>
                  <td className="flex items-center gap-4 py-4 px-4">
                    <TeamIcon
                      className="min-w-12 min-h-12 max-w-12 max-h-12"
                      color={cur_team?.color_choice || "#000000"}
                      emoji={cur_team?.emoji_choice || "❓"}
                      emoji_cn="text-3xl"
                    />
                    <Link className="truncate text-lg" to={`/team/${cur_team.id}`}>
                      {cur_team.team_name}
                    </Link>
                  </td>
                  <td className="py-4">{cur_team.major_case_solve_count}</td>
                  <td className="py-4">{cur_team.minor_case_solve_count}</td>
                  <td className="py-4">{cur_team.total_solves}</td>
                  <td className="py-4">
                    {cur_team.all_metas_solve_time
                      ? eventSolveDateFormat(new Date(cur_team.all_metas_solve_time))
                      : ""}
                  </td>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </table>
        ) : (
          <BeatLoader
            className="text-center justify-center content-center pr-2"
            color={"#000"}
            size={12}
          />
        )}
      </div>
    </div>
  );
}
