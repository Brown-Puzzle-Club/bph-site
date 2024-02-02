import { Team, UserTeam } from "@/utils/django_types";
import axios from "axios";
import { createContext, useCallback, useContext } from "react";


type DjangoContextType = {
  FetchTeam: () => Promise<UserTeam>;
  FetchTeams : () => Promise<Team[]>;
}

const DjangoContext = createContext<DjangoContextType>({
  FetchTeam: async () => {
    return {} as UserTeam;
  },
  FetchTeams: async () => {
    return [] as Team[];
  }
});

export const DjangoContextProvider = ({ children }: { children: React.ReactNode }) => {
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
    <DjangoContext.Provider value={{ FetchTeam, FetchTeams }}>
      {children}
    </DjangoContext.Provider>
  );
}

export const useDjangoContext = () => useContext(DjangoContext);
