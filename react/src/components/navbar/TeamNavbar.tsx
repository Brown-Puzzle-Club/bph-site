
import { useAuth } from '../../hooks/useAuth';
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '../ui/navigation-menu';
import { ListItem } from './Navbar';

export default function TeamNavbar () {

  const { user, logout } = useAuth();

  return (
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger><div className='truncate max-w-10 md:max-w-48'>{user?.username}</div></NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[150px] gap-3 p-4 md:grid-cols-1">
            <ListItem href={"my-team"} title={"Team Info"} />
            <ListItem className='bg-gradient-to-b from-muted/80 to-muted cursor-pointer' onClick={() => { logout() }} title={"Logout"} />
          </ul>
          
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  )
}