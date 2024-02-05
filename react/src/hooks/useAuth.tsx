import { User } from "@/utils/django_types";
import axios from "axios";
import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  loggedIn: boolean;
  checkingLoginStatus: boolean;
  user?: User;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  checkingLoginStatus: true,
  user: undefined,
  login: async () => {},
  logout: () => {},
});

// is it bad to make the context async?
export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkingLoginStatus, setCheckingLoginStatus] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(undefined as User | undefined);

  const CheckAlreadyLoggedIn = async () => {
    // for some reason cannot use DjangoContext in here without error.
    setCheckingLoginStatus(true);
    let out = undefined
    try {
      const response = axios.get('/api/users');
      
      out =(await response).data[0] as User;
    } catch (error) {
      const e = error as Error;
      console.error(e.message);
    }
    setCheckingLoginStatus(false);
    return out
  } 

  useEffect(() => {
    // TODO: check if cookie exists before doing this query.
    CheckAlreadyLoggedIn().then((user) => {
      console.log(user)
      if (user) {
        setUser(user);
        setLoggedIn(true);
      }
    });
  },[]);

  const login = async (username: string, password: string) => {
    console.log('Logging in with', username, password);
    try {
      await axios.post('/api/login', {
        username: username,
        password: password,
      }).then((response) => {
        console.log(response)
        const cur_user = response.data as User
        setUser(cur_user)
        setLoggedIn(true);
      });
    } catch (error) {
      const e = error as Error;
      console.error(e.message);
      throw e;
    }
  }

  const logout = () => {
    console.log('Logging out');
    // doesnt work.. TODO: find workaround / fix
    Cookies.remove('sessionid');
    setLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ checkingLoginStatus, loggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
