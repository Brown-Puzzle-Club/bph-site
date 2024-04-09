import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

import type {
  DjangoContext as DjangoContextType,
  MinorCase,
  Puzzle,
  Team,
  TeamMember,
  User,
  UserTeam,
} from "@/utils/django_types";

// prolly doesn't need to be a context... TODO: make hooks for these all with useQuery??
type DjangoReactContext = {
  FetchUser: () => Promise<User>;
  FetchTeam: () => Promise<UserTeam>;
  FetchTeamMembers: () => Promise<TeamMember[]>;
  FetchTeams: () => Promise<Team[]>;
  FetchCase: (round_id: number) => Promise<MinorCase>;
  FetchPuzzle: (puzzle_slug: string) => Promise<Puzzle>;
  // context on load is stored
  context?: DjangoContextType;
};

const DjangoContext = createContext<DjangoReactContext>({
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
  FetchCase: async () => {
    return {} as MinorCase;
  },
  FetchPuzzle: async () => {
    return {} as Puzzle;
  },
  context: undefined,
});

export const DjangoContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [context, setContext] = useState({} as DjangoContextType);

  const FetchContext = useCallback(async () => {
    const response = await fetch("/api/context");
    const context = (await response.json()) as DjangoContextType;
    setContext(context);
    console.log(context);
    return context;
  }, []);
  useEffect(() => {
    if (!context.team_context) {
      FetchContext();
    }
  }, [context, FetchContext]);

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

  const FetchCase = useCallback(async (round_id: number) => {
    const response = await fetch(`/api/rounds/${round_id}`);
    const data = await response.json();
    return data as MinorCase;
  }, []);

  const FetchPuzzle = useCallback(async (puzzle_slug: string) => {
    const response = await fetch(`/api/puzzle/${puzzle_slug}`);
    const data = await response.json();
    return data as Puzzle;
  }, []);

  return (
    <DjangoContext.Provider
      value={{
        FetchUser,
        FetchTeam,
        FetchTeamMembers,
        FetchTeams,
        context,
        FetchCase,
        FetchPuzzle,
      }}
    >
      {children}
    </DjangoContext.Provider>
  );
};

export const useDjangoContext = () => useContext(DjangoContext);
