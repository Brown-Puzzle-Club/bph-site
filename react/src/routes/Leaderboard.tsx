import { useDjangoContext } from "@/hooks/useDjangoContext";
import { Team } from "@/utils/django_types";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";


export default function Leaderboard () {

  const { FetchTeams } = useDjangoContext();
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    FetchTeams().then((teams) => {
      setTeams(teams);
    });
  },[FetchTeams]);

  return (
    <div className="contact bg-slate-900 text-white h-[90vh] overscroll-contain overflow-hidden overflow-y-auto ">
      <h1 className="text-4xl font-bold text-center py-5">Teams</h1>
      <div className="contact-content text-center dark bg-gradient-to-b from-muted/50 to-muted/80 p-6 no-underline outline-none focus:shadow-md btn-gradient-1 relative mx-[5%] md:mx-[20%]">
        {teams.length > 0 ? teams.map((team) => (
          <div key={team.id} className="contact-box btn-gradient-bot pb-5 ">
            {team.team_name}
          </div>
        )) : <BeatLoader className="justify-center content-center pr-2" color={'#fff'} size={12} /> }
      </div>
    </div>
  )
}