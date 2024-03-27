import { registerFormSchema } from "@/routes/Register";
import { UserTeam } from "@/utils/django_types";
import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";

type AuthContextType = {
  loggedIn: boolean;
  checkingLoginStatus: boolean;
  team?: UserTeam;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (values: z.infer<typeof registerFormSchema>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  checkingLoginStatus: true,
  team: undefined,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

// is it bad to make the context async?
export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkingLoginStatus, setCheckingLoginStatus] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [team, setUserTeam] = useState(undefined as UserTeam | undefined);

  const CheckAlreadyLoggedIn = async () => {
    setCheckingLoginStatus(true);
    let out = undefined;
    try {
      const [team_response, token_response] = await Promise.all([
        axios.get("/api/my-team"),
        axios.get("/api/my-token"),
      ]);
      out = team_response.data[0] as UserTeam;
      out = { ...out, auth_token: token_response.data[0].key };
    } catch (error) {
      const e = error as Error;
      console.error(e.message);
    }
    setCheckingLoginStatus(false);
    return out;
  };

  useEffect(() => {
    setCheckingLoginStatus(false);
    const session = Cookies.get("sessionid");
    if (session) {
      CheckAlreadyLoggedIn().then((team) => {
        console.log(team);
        if (team) {
          setUserTeam(team);
          setLoggedIn(true);
        }
      });
    }
  }, []);

  const login = async (username: string, password: string) => {
    console.log("Logging in with", username, password);
    try {
      await axios
        .post("/api/login", {
          username: username,
          password: password,
        })
        .then((response) => {
          console.log(response);
          const cur_team = response.data as UserTeam;
          setUserTeam(cur_team);
          setLoggedIn(true);
          window.location.reload();
        });
    } catch (error) {
      const e = error as Error;
      throw e;
    }
  };

  const logout = async () => {
    console.log("Logging out");
    await axios.post("/api/logout");
    setUserTeam(undefined);
    setLoggedIn(false);
    window.location.assign("/");
  };

  const register = async (values: z.infer<typeof registerFormSchema>) => {
    console.log("Registering with", values);
    try {
      await axios.post("/api/register", values).then((response) => {
        console.log(response);
        const cur_team = response.data as UserTeam;
        setUserTeam(cur_team);
        setLoggedIn(true);
        // redirect to home page
        window.location.assign("/");
      });
    } catch (error) {
      const e = error as Error;
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ checkingLoginStatus, loggedIn, team, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
