import { Team, TeamMember, User, UserTeam } from "@/utils/django_types";
import axios from "axios";
import { createContext, useCallback, useContext } from "react";


type DjangoContextType = {
  FetchUser: () => Promise<User>;
  FetchTeam: () => Promise<UserTeam>;
  FetchTeamMembers : () => Promise<TeamMember[]>;
  FetchTeams : () => Promise<Team[]>;
}

const DjangoContext = createContext<DjangoContextType>({
  FetchUser: async () => {
    return {} as User;
  },
  FetchTeam: async () => {
    return {} as UserTeam;
  },
  FetchTeamMembers: async () => {
    return [] as TeamMember[];
  },
  FetchTeams: async () => {
    return [] as Team[];
  }
});

export const DjangoContextProvider = ({ children }: { children: React.ReactNode }) => {

  const FetchUser = useCallback(async () => {
    const response = axios.get('/api/user');
    return (await response).data[0] as User;
  },[]);

  const FetchTeam = useCallback(async () => {
    const response = axios.get('/api/my-team');
    return (await response).data[0] as UserTeam;
  },[]);

  const FetchTeamMembers = useCallback(async () => {
    const response = axios.get('/api/team-members');
    return (await response).data as TeamMember[];
  },[]);

  const FetchTeams = useCallback(async () => {
    const response = await fetch('/api/teams');
    const data = await response.json();
    return data as Team[];
  },[]);

  return (
    <DjangoContext.Provider value={{ FetchUser, FetchTeam, FetchTeamMembers, FetchTeams }}>
      {children}
    </DjangoContext.Provider>
  );
}

export const useDjangoContext = () => useContext(DjangoContext);
