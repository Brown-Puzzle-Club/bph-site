import TeamIcon from "@/components/team/TeamIcon";
import { useAuth } from "@/hooks/useAuth";
import { Team, TeamMember } from "@/utils/django_types";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";
import { HashLink as Link } from "react-router-hash-link";
import { BeatLoader } from "react-spinners";

const TEAM_ID = window.location.pathname.split("/").pop();

export default function TeamPage() {
  const [cur_team, setTeam] = useState<Team>();
  const [members, setMembers] = useState<TeamMember[]>();
  const [loadingData, setLoadingData] = useState(true);

  const { team } = useAuth();
  const IS_OWN_TEAM = team.data?.id.toString() === TEAM_ID;

  useEffect(() => {
    setLoadingData(true);
    console.log("team_id:", TEAM_ID);
    axios
      .get(`/api/teams/${TEAM_ID}`)
      .then((response) => {
        console.log(response.data);
        setTeam(response.data as Team);
        setLoadingData(false);
      })
      .catch((error) => {
        alert("Could not find team.");
        window.location.assign("/");
        console.error(error);
      });
    axios
      .get(`/api/teams/${TEAM_ID}/members`)
      .then((response) => {
        console.log(response.data);
        setMembers(response.data as TeamMember[]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="teampage text-center text-white min-h-[90vh]">
      {IS_OWN_TEAM ? (
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
      {loadingData ? (
        <BeatLoader className="justify-center content-center pr-2 pt-3" color={"#fff"} size={12} />
      ) : (
        <div className="teampage-content pt-6">
          <TeamIcon
            className="w-24 h-24 mx-auto text-center"
            color={cur_team?.color_choice ?? ""}
            emoji={cur_team?.emoji_choice ?? ""}
            emoji_cn="text-6xl"
          />
          <h1 className="text-4xl font-bold text-center pt-5 pb-7">{cur_team?.team_name}</h1>
          <section className="team-members text-center dark bg-gradient-to-b from-muted/50 to-muted/80 px-6 py-4 no-underline outline-none focus:shadow-md btn-gradient-1 relative mx-[5%] md:mx-[30%]">
            <div className="members-info">
              <h1 className="text-center font-bold text-xl">
                {members?.length ?? 0} Member{members?.length !== 1 ? "s" : ""}
              </h1>
              <div className="justify-center items-center flex">
                <div className="members pt-6 flex flex-wrap justify-center items-center">
                  {members?.map((member, index) => (
                    <p id={index.toString()} className="">
                      {member.name}
                      {index < members?.length - 1 ? ", " : ""}
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
