
import { useAuth } from '../../hooks/useAuth';
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger } from '../ui/navigation-menu';

export default function TeamNavbar () {

  const { user, logout } = useAuth();

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger><div className='truncate max-w-48'>{user?.username}</div></NavigationMenuTrigger>
      <NavigationMenuContent>
        <button
          type="submit"
          className="bg-primary text-white p-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring focus:border-primary-dark"
          onClick={() => { logout() }}
        >
          Logout
        </button>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}