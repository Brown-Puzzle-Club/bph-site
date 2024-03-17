import TeamIcon from "@/components/team/TeamIcon";
import { useAuth } from "@/hooks/useAuth";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { Team, UserTeam } from "@/utils/django_types";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

enum LeaderboardTab {
  IN_PERSON = "In Person",
  REMOTE = "Remote",
}

export default function Leaderboard() {
  const { team } = useAuth();
  const { FetchTeams } = useDjangoContext();
  const [teams, setTeams] = useState<Team[]>([]);
  const [curTab, setTab] = useState<LeaderboardTab>(() => {
    const savedTab = Cookies.get("leaderboardTab");
    return savedTab ? (savedTab as LeaderboardTab) : LeaderboardTab.IN_PERSON;
  });

  const getTeamTab = (team: Team | UserTeam) => {
    return team.in_person ? LeaderboardTab.IN_PERSON : LeaderboardTab.REMOTE;
  };

  useEffect(() => {
    // 1 hour expiration of cookie that keeps track of your current tab
    Cookies.set("leaderboardTab", curTab, { expires: 1 / 24 });
  }, [curTab]);

  useEffect(() => {
    FetchTeams().then((teams) => {
      setTeams(teams);
    });
  }, [FetchTeams]);

  useEffect(() => {
    const savedTab = Cookies.get("leaderboardTab");
    if (team && !savedTab) {
      setTab(getTeamTab(team));
    }
  }, [team]);

  const collectRemoteTeams = (teams: Team[]) => {
    return teams.filter(
      (cur_team) => !cur_team.in_person && (!cur_team.is_hidden || cur_team.id === team?.id),
    );
  };

  const collectInPersonTeams = (teams: Team[]) => {
    return teams.filter(
      (cur_team) => cur_team.in_person && (!cur_team.is_hidden || cur_team.id === team?.id),
    );
  };

  const collectTeams = (teams: Team[], tab: LeaderboardTab) => {
    switch (tab) {
      case LeaderboardTab.IN_PERSON:
        return collectInPersonTeams(teams);
      case LeaderboardTab.REMOTE:
        return collectRemoteTeams(teams);
    }
  };

  return (
    <div className="contact bg-slate-900 text-white h-[90vh] overscroll-contain overflow-hidden overflow-y-auto ">
      <h1 className="text-4xl font-bold text-center py-5">Teams</h1>
      <div className="tabs flex items-center justify-end gap-4 mx-[5%] md:mx-[20%] pr-10 z-10">
        <button
          onClick={() => setTab(LeaderboardTab.IN_PERSON)}
          className={`select-none rounded-t-md transition-colors py-2 px-6 hover:text-white ${curTab === LeaderboardTab.REMOTE ? "hover:bg-[#b3957c]" : ""} ${curTab === LeaderboardTab.IN_PERSON ? "bg-[#957a62] text-white font-bold" : "bg-[#745a45] text-[#ffffffb8]"}`}
        >
          On-Campus
        </button>
        <button
          onClick={() => setTab(LeaderboardTab.REMOTE)}
          className={`select-none rounded-t-md transition-colors py-2 px-6 hover:text-white ${curTab === LeaderboardTab.IN_PERSON ? "hover:bg-[#b3957c]" : ""} ${curTab === LeaderboardTab.REMOTE ? "bg-[#957a62] text-white font-bold" : "bg-[#745a45] text-[#ffffffb8]"}`}
        >
          Remote
        </button>
      </div>
      <div className="text-left dark bg-gradient-to-b from-[#b3957c] to-[#a28369] pb-2 pt-2 no-underline outline-none focus:shadow-md border-4 border-[#957a62] rounded-xl relative mx-[5%] md:mx-[20%]">
        <div className="contact-content custom-scroll h-full max-h-[65dvh] overflow-y-auto">
          {teams.length > 0 ? (
            collectTeams(teams, curTab).map((cur_team, index, array) => (
              <div
                key={cur_team.id}
                className={`team-box px-6 pt-3 pb-3 flex items-center space-x-4 text-slate-800 ${index !== array.length - 1 ? "border-b-4 border-[#957a62]" : ""} ${cur_team.id === team?.id ? "bg-[#ceaa8a]" : ""}`}
              >
                <span className="text-xl font-bold w-9">{index + 1}</span>
                <TeamIcon
                  className="w-12 h-12"
                  color={cur_team?.color_choice || "#000000"}
                  emoji={cur_team?.emoji_choice || "❓"}
                  emoji_cn="text-3xl"
                />
                <a className="truncate text-lg w-[80%]" href={`/team/${cur_team.id}`}>
                  {cur_team.team_name}
                </a>
              </div>
            ))
          ) : (
            <BeatLoader
              className="text-center justify-center content-center pr-2"
              color={"#000"}
              size={12}
            />
          )}
        </div>
      </div>
    </div>
  );
}
