import { Team, User, UserTeam } from "@/utils/django_types";
import axios from "axios";
import { createContext, useCallback, useContext } from "react";


type DjangoContextType = {
  FetchUser: () => Promise<User>;
  FetchTeam: () => Promise<UserTeam>;
  FetchTeams : () => Promise<Team[]>;
}

const DjangoContext = createContext<DjangoContextType>({
  FetchUser: async () => {
    return {} as User;
  },
  FetchTeam: async () => {
    return {} as UserTeam;
  },
  FetchTeams: async () => {
    return [] as Team[];
  }
});

export const DjangoContextProvider = ({ children }: { children: React.ReactNode }) => {

  const FetchUser = useCallback(async () => {
    const response = axios.get('/api/users');
    return (await response).data[0] as User;
  },[]);

  const FetchTeam = useCallback(async () => {
    const response = axios.get('/api/my-team');
    return (await response).data[0] as UserTeam;
  },[]);

  const FetchTeams = useCallback(async () => {
    const response = await fetch('/api/teams');
    const data = await response.json();
    return data as Team[];
  },[]);

  return (
    <DjangoContext.Provider value={{ FetchUser, FetchTeam, FetchTeams }}>
      {children}
    </DjangoContext.Provider>
  );
}

export const useDjangoContext = () => useContext(DjangoContext);
