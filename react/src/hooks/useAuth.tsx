import { registerFormSchema } from "@/routes/Register";
import { User } from "@/utils/django_types";
import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";

type AuthContextType = {
  loggedIn: boolean;
  checkingLoginStatus: boolean;
  user?: User;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (values: z.infer<typeof registerFormSchema>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  checkingLoginStatus: true,
  user: undefined,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

// is it bad to make the context async?
export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkingLoginStatus, setCheckingLoginStatus] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(undefined as User | undefined);

  const CheckAlreadyLoggedIn = async () => {
    setCheckingLoginStatus(true);
    let out = undefined
    try {
      const response = axios.get('/api/user');
      out = (await response).data[0] as User;
    } catch (error) {
      const e = error as Error;
      console.error(e.message);
    }
    setCheckingLoginStatus(false);
    return out
  } 

  useEffect(() => {
    setCheckingLoginStatus(false);
    const session = Cookies.get('sessionid');
    if (session) {
      CheckAlreadyLoggedIn().then((user) => {
        console.log(user)
        if (user) {
          setUser(user);
          setLoggedIn(true);
        }
      });
    }
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
        window.location.reload()  ;
      });
    } catch (error) {
      const e = error as Error;
      console.error(e.message);
      throw e;
    }
  }

  const logout = async () => {
    console.log('Logging out');
    await axios.post('/api/logout');
    setUser(undefined);
    setLoggedIn(false);
    window.location.assign("/landing");
  }

  const register = async (values: z.infer<typeof registerFormSchema>) => {
    console.log('Registering with', values);
    try {
      await axios.post('/api/register', values).then((response) => {
        console.log(response)
        const cur_user = response.data as User
        setUser(cur_user)
        setLoggedIn(true);
        // redirect to home page
        window.location.assign("/");
      });
    } catch (error) {
      const e = error as Error;
      console.error(e.message);
      throw e;
    }
  }

  return (
    <AuthContext.Provider value={{ checkingLoginStatus, loggedIn, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
