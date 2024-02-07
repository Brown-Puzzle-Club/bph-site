import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { Button } from '../ui/button';
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '../ui/navigation-menu';

export default function LoginNavbar() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formProgress, setFormProgress] = useState(false);

  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormProgress(true);

    try {
      await login(username, password);
    } catch (error) {
      const e = error as Error;
      setError(e.message);
    }
    
    setFormProgress(false);
  };

  return (
    <NavigationMenuList>
      { window.location.pathname !== '/register' &&
      <NavigationMenuItem>
        {/* send to /register page */}
        <Button className='dark bg-[grey] hover:text-black font-bold' onClick={() => window.location.href = '/register'}>Register</Button>
      </NavigationMenuItem>
      }
      <NavigationMenuItem>
        <NavigationMenuTrigger><div className='bg-blue'>Login</div></NavigationMenuTrigger>
        <NavigationMenuContent>
          <form className="flex flex-col space-y-4 p-3" onSubmit={handleLogin}>
            <div className="flex flex-col">
              <p className="text-red-500">{error}</p>
              <label htmlFor="username" className="text-sm font-medium text-muted-foreground mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring focus:border-primary"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-medium text-muted-foreground mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring focus:border-primary"
                placeholder="Enter your password"
                required
              />  
            </div>
            {formProgress && <BeatLoader className="justify-center content-center p-4" color={'#fff'} size={12} /> || 
              <button
                type="submit"
                className="bg-primary text-white p-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring focus:border-primary-dark"
              >
                Login
              </button>
            }
          </form>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  );
}
