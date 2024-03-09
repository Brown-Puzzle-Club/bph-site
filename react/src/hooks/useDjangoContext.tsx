import { DjangoContext, Round, Team, TeamMember, User, UserTeam } from "@/utils/django_types";
import axios from "axios";
import { createContext, useCallback, useContext } from "react";

// prolly doesn't need to be a context... TODO: make hooks for these all with useQuery??
type DjangoContextType = {
  FetchUser: () => Promise<User>;
  FetchTeam: () => Promise<UserTeam>;
  FetchTeamMembers: () => Promise<TeamMember[]>;
  FetchTeams: () => Promise<Team[]>;
  FetchContext: () => Promise<DjangoContext>;
  FetchCase: (round_id: number) => Promise<Round>;
};

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
  },
  FetchContext: async () => {
    return {} as DjangoContext;
  },
  FetchCase: async () => {
    return {} as Round;
  },
});

export const DjangoContextProvider = ({ children }: { children: React.ReactNode }) => {
  const FetchUser = useCallback(async () => {
    const response = axios.get("/api/user");
    return (await response).data[0] as User;
  }, []);

  const FetchTeam = useCallback(async () => {
    const response = axios.get("/api/my-team");
    return (await response).data[0] as UserTeam;
  }, []);

  const FetchTeamMembers = useCallback(async () => {
    const response = axios.get("/api/team-members");
    return (await response).data as TeamMember[];
  }, []);

  const FetchTeams = useCallback(async () => {
    const response = await fetch("/api/teams");
    const data = await response.json();
    return data as Team[];
  }, []);

  const FetchContext = useCallback(async () => {
    const response = await fetch("/api/context");
    const data = await response.json();
    return data as DjangoContext;
  }, []);

  const FetchCase = useCallback(async (round_id: number) => {
    const response = await fetch(`/api/rounds/${round_id}`);
    const data = await response.json();
    return data as Round;
  }, []);

  return (
    <DjangoContext.Provider
      value={{
        FetchUser,
        FetchTeam,
        FetchTeamMembers,
        FetchTeams,
        FetchContext,
        FetchCase,
      }}
    >
      {children}
    </DjangoContext.Provider>
  );
};

export const useDjangoContext = () => useContext(DjangoContext);
