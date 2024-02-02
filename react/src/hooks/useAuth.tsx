import axios from "axios";
import { createContext, useContext, useState } from "react";


type AuthContextType = {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  setLoggedIn: () => {},
  login: async () => {},
  logout: async () => {},
});

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const login = async (username: string, password: string) => {
    console.log('Logging in with', username, password);
    try {
      await axios.post('/api/login', {
        username: username,
        password: password,
      });
    } catch (error) {
      const e = error as Error;
      console.error(e.message);
      // TODO: make better routing for error messages
      // setError(e.message);
    }
    setLoggedIn(true);
  }

  const logout = async () => {
    console.log('Logging out');
    // TODO: remove cookie called sessionid:
    setLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
