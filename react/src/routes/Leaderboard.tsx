import { useDjangoContext } from "@/hooks/useDjangoContext";
import { Team } from "@/utils/django_types";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

enum LeaderboardTab {
  IN_PERSON = "In Person",
  REMOTE = "Remote",
}

export default function Leaderboard () {

  const { FetchTeams } = useDjangoContext();
  const [teams, setTeams] = useState<Team[]>([]);
  // TODO: set starting tab based on if your logged in team is in person or remote
  const [curTab, setTab] = useState<LeaderboardTab>(LeaderboardTab.IN_PERSON);

  useEffect(() => {
    FetchTeams().then((teams) => {
      setTeams(teams);
    });
  },[FetchTeams]);

  const collectRemoteTeams = (teams: Team[]) => {
    // TODO: make filter on team.in_person attribute (add to API)
    return teams;
  }

  const collectInPersonTeams = (teams: Team[]) => {
    // TODO: same as above.
    return teams;
  }

  const collectTeams = (teams: Team[], tab: LeaderboardTab) => {
    switch (tab) {
      case LeaderboardTab.IN_PERSON:
        return collectInPersonTeams(teams);
      case LeaderboardTab.REMOTE:
        return collectRemoteTeams(teams);
    }
  }

  return (
    <div className="contact bg-slate-900 text-white h-[90vh] overscroll-contain overflow-hidden overflow-y-auto ">
      <h1 className="text-4xl font-bold text-center py-5">Teams</h1>
      <div className="tabs flex items-center justify-center gap-4">
          <button onClick={() => setTab(LeaderboardTab.IN_PERSON)} className="content-center justify-center bg-[red] rounded">In Person</button>
          <button onClick={() => setTab(LeaderboardTab.REMOTE)} className="content-center justify-center bg-[blue] rounded">Remote</button>
      </div>
      <p className="text-center">TEST: cur tab = {curTab}</p>
      <div className="contact-content text-center dark bg-gradient-to-b from-muted/50 to-muted/80 p-6 no-underline outline-none focus:shadow-md btn-gradient-1 relative mx-[5%] md:mx-[20%]">
        {teams.length > 0 ? collectTeams(teams, curTab).map((team) => (
          <div key={team.id} className="contact-box btn-gradient-bot pb-5 ">
            {team.team_name}
          </div>
        )) : <BeatLoader className="justify-center content-center pr-2" color={'#fff'} size={12} /> }
      </div>
    </div>
  )
}