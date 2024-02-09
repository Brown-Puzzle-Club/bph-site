import { useDjangoContext } from "@/hooks/useDjangoContext";
import { UserTeam } from "@/utils/django_types";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

export default function TeamPage () {

  const { FetchTeam } = useDjangoContext();
  const [team, setTeam] = useState<UserTeam>();

  useEffect(() => {
    FetchTeam().then((team): void => {
      console.log("team:",team)
      setTeam(team) 
    });
  },[FetchTeam]);

  return (
    <div className="contact bg-slate-900 text-white h-[90vh] overscroll-contain overflow-hidden overflow-y-auto">
      <h1 className="text-4xl font-bold text-center py-5">Team</h1>
      <div className="flex flex-row">
      <div className="w-1/2">
      <div className="contact-content custom-scroll text-center dark bg-gradient-to-b from-muted/50 to-muted/80 p-6 mb-10 no-underline outline-none focus:shadow-md btn-gradient-1 max-h-[70dvh] relative ml-[20%] mr-[2.5%] overflow-hidden overflow-y-auto">
        <h3>Team Edit Info</h3>
        {team?.team_name || <BeatLoader className="justify-center content-center pr-2" color={'#fff'} size={12} />}
      </div>
      </div>
      <div className="w-1/2 justify-end">
      <div className="stats-tab custom-scroll text-center dark bg-gradient-to-b from-muted/50 to-muted/80 p-6 mb-10 no-underline outline-none focus:shadow-md btn-gradient-1 max-h-[70dvh] relative ml-[2.5%] mr-[20%] overflow-hidden overflow-y-auto">
        <h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3>
        <h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3>
        <h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3>
        <h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3>
        <h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3>
        <h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3>
        <h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3>
        <h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3><h3>Stats</h3>
      </div>
      </div>
      </div>
    </div>
  )
}