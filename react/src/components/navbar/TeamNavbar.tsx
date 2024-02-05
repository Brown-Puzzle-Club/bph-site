
import { useAuth } from '../../hooks/useAuth';
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger } from '../ui/navigation-menu';
import { ListItem } from './Navbar';

export default function TeamNavbar () {

  const { user, logout } = useAuth();

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger><div className='truncate max-w-10 md:max-w-48'>{user?.username}</div></NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[150px] gap-3 p-4 md:grid-cols-1">
          <ListItem href={"my-team"} title={"Team Info"} />
          <ListItem className='bg-gradient-to-b from-muted/50 to-muted' onClick={() => { logout() }} title={"Logout"} />
        </ul>
        
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}