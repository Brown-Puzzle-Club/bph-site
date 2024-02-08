
import { useAuth } from '../../hooks/useAuth';
import TeamIcon from '../team/TeamIcon';
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '../ui/navigation-menu';
import { ListItem } from './Navbar';

export default function TeamNavbar () {

  const { team, logout } = useAuth();

  return (
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>
          {/* <div className='truncate max-w-10 md:max-w-48'>{team?.team_name}</div> */}
          <TeamIcon className="w-7 h-7" color={team?.color_choice || '#000000'} emoji={team?.emoji_choice || '❓'} emoji_cn='text-md'/>
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[150px] gap-3 p-4 md:grid-cols-1">
            <ListItem href={"my-team"} className="truncate" title={team?.team_name} />
            <ListItem className='bg-gradient-to-b from-muted/80 to-muted cursor-pointer' onClick={() => { logout() }} title={"Logout"} />
          </ul>
          
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  )
}