import { FaCog } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import { BeatLoader } from "react-spinners";

import TeamIcon from "@/components/team/TeamIcon";
import { useAuth } from "@/hooks/useAuth";
import { useSpecificTeam, useSpecificTeamMembers } from "@/hooks/useDjangoContext";

import ErrorPage from "./ErrorPage";

export default function TeamPage() {
  const { teamId } = useParams();

  const { team } = useAuth();
  const isOwnTeam = team.data?.id.toString() === teamId;

  const { data: thisTeam, isLoading, isError } = useSpecificTeam(teamId ?? "");
  const { data: thisTeamMembers } = useSpecificTeamMembers(teamId ?? "");

  if (isError) {
    return <ErrorPage custom_error={{ status: 404, statusText: "Team not found", data: null }} />;
  }

  return (
    <div className="teampage text-center text-white min-h-[90vh]">
      {isOwnTeam ? (
        <Link
          to={`/my-team`}
          className="dark bg-muted/20 hover:bg-muted/80 btn-gradient-1 flex font-semibold items-center text-center justify-center my-5 mx-[33%] transition-colors duration-300 group"
        >
          <FaCog className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
          <p className="px-2 text-slate-400 group-hover:text-white transition-colors duration-300">
            Edit Team Info
          </p>
          <FaCog className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
        </Link>
      ) : null}
      {isLoading ? (
        <BeatLoader className="justify-center content-center pr-2 pt-3" color={"#fff"} size={12} />
      ) : (
        <div className="teampage-content pt-6">
          <TeamIcon
            className="w-24 h-24 mx-auto text-center"
            color={thisTeam?.color_choice ?? ""}
            emoji={thisTeam?.emoji_choice ?? ""}
            emoji_cn="text-6xl"
          />
          <h1 className="text-4xl font-bold text-center pt-5 pb-7">{thisTeam?.team_name}</h1>
          <section className="team-members text-center dark bg-gradient-to-b from-muted/50 to-muted/80 px-6 py-4 no-underline outline-none focus:shadow-md btn-gradient-1 relative mx-[5%] md:mx-[30%]">
            <div className="members-info">
              <h1 className="text-center font-bold text-xl">
                {thisTeamMembers?.length ?? 0} Member{thisTeamMembers?.length !== 1 ? "s" : ""}
              </h1>
              <div className="justify-center items-center flex">
                <div className="members pt-6 flex flex-wrap justify-center items-center">
                  {thisTeamMembers?.map((member, index) => (
                    <p id={index.toString()} className="">
                      {member.name}
                      {index < thisTeamMembers?.length - 1 ? ", " : ""}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
