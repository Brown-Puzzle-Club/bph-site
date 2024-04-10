import { useAuth } from "../../hooks/useAuth";
import TeamIcon from "../team/TeamIcon";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { ListItem } from "./Navbar";

export default function TeamNavbar() {
  const { team, logout } = useAuth();

  return (
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>
          {/* <div className='truncate max-w-10 md:max-w-48'>{team?.team_name}</div> */}
          <TeamIcon
            className="w-7 h-7"
            color={team.data?.color_choice || "#000000"}
            emoji={team.data?.emoji_choice || "❓"}
            emoji_cn="text-md"
          />
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[300px] gap-3 p-4 md:grid-cols-1">
            <ListItem to={"/my-team"} className="truncate" title={team.data?.team_name} />
            <ListItem
              className="bg-gradient-to-b from-muted/80 to-muted cursor-pointer"
              onClick={() => logout.mutate()}
              title="Logout"
              to="/"
            />
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  );
}
