import { useDjangoContext } from "@/hooks/useDjangoContext";
import { UserTeam } from "@/utils/django_types";
import { useEffect, useState } from "react";


export default function TeamPage () {

  const { FetchTeam } = useDjangoContext();
  const [team, setTeam] = useState<UserTeam>();

  useEffect(() => {
    FetchTeam().then((team) => {
      setTeam(team)
    });
  },[FetchTeam]);

  return (
    <div className="contact bg-slate-900 text-white h-[90vh] overscroll-contain overflow-hidden overflow-y-auto ">
      <h1 className="text-4xl font-bold text-center py-5">Team</h1>
      <div className="contact-content text-center dark bg-gradient-to-b from-muted/50 to-muted/80 p-6 no-underline outline-none focus:shadow-md btn-gradient-1 relative mx-[5%] md:mx-[20%]">
        {team?.team_name || "Not logged in"}
      </div>
    </div>
  )
}