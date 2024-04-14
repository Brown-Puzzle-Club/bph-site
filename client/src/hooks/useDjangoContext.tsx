import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import type {
  AnswerSubmissionStats,
  DjangoContext,
  Hint,
  InPersonEvent,
  Puzzle,
  StorylineUnlock,
  Team,
  TeamMember,
} from "@/utils/django_types";

const getMyTeamMembers = async () => {
  const response = await axios.get<TeamMember[]>("/api/team-members");
  return response.data;
};
const getAllTeams = async () => {
  const response = await axios.get<Team[]>("/api/teams");
  return response.data;
};
const getDjangoContext = async () => {
  const response = await axios.get<DjangoContext>("/api/context");
  return response.data;
};
const getSpecificTeam = async (teamId: string) => {
  const response = await axios.get<Team>(`/api/teams/${teamId}`);
  return response.data;
};
const getSpecificTeamMembers = async (teamId: string) => {
  const response = await axios.get<TeamMember[]>(`/api/teams/${teamId}/members`);
  return response.data;
};
const getPuzzle = async (puzzleSlug: string) => {
  const response = await axios.get<Puzzle>(`/api/puzzle/${puzzleSlug}`);
  return response.data;
};
const getEvents = async () => {
  const response = await axios.get<InPersonEvent[]>("/api/events");
  return response.data;
};
const getHintsForPuzzle = async (puzzleSlug: string) => {
  const response = await axios.get<Hint[]>(`/api/hints/${puzzleSlug}`);
  return response.data;
};
const getStoryUnlocks = async () => {
  const response = await axios.get<StorylineUnlock[]>("/api/story-unlocks");
  return response.data;
};
const getStatistics = async () => {
  const response = await axios.get<AnswerSubmissionStats[]>("/api/stats");
  return response.data;
};

export const useMyTeamMembers = () => {
  return useQuery({
    queryKey: ["team-members"],
    queryFn: getMyTeamMembers,
  });
};

export const useAllTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: getAllTeams,
  });
};

export const useDjangoContext = () => {
  return useQuery({
    queryKey: ["context"],
    queryFn: getDjangoContext,
  });
};

export const useSpecificTeam = (teamId: string) => {
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: () => getSpecificTeam(teamId),
  });
};

export const useSpecificTeamMembers = (teamId: string) => {
  return useQuery({
    queryKey: ["team-members", teamId],
    queryFn: () => getSpecificTeamMembers(teamId),
  });
};

export const usePuzzle = (puzzleSlug: string) => {
  return useQuery({
    queryKey: ["puzzle", puzzleSlug],
    queryFn: () => getPuzzle(puzzleSlug),
  });
};

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });
};

export const useHintsForPuzzle = (puzzleSlug: string) => {
  return useQuery({
    queryKey: ["hints", puzzleSlug],
    queryFn: () => getHintsForPuzzle(puzzleSlug),
    refetchInterval: 1000 * 30, // 30 seconds
  });
};

export const useStoryUnlocks = () => {
  return useQuery({
    queryKey: ["story-unlocks"],
    queryFn: getStoryUnlocks,
  });
};

export const useStatistics = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: getStatistics,
  });
};

const postUpdateTeam = async (data: Partial<Team>) => {
  const response = await axios.post<Team>("/api/update-team", data);
  return response.data;
};
const postHintRequest = async (
  puzzleSlug: string,
  data: { question: string; followup: number },
) => {
  const response = await axios.post<Hint>(`/api/hints/${puzzleSlug}/submit`, data);
  return response.data;
};

export const useMutateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-team"],
    mutationFn: postUpdateTeam,
    onSuccess: (/* data */) => {
      // queryClient.setQueryData(["my-team"], data);
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
};

export const useMutateHint = (puzzleSlug: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["hint", puzzleSlug],
    mutationFn: (data: { question: string; followup: number }) => postHintRequest(puzzleSlug, data),
    onSuccess: (/* data */) => {
      queryClient.refetchQueries({ queryKey: ["hints", puzzleSlug] });
      queryClient.refetchQueries({ queryKey: ["my-team"] });
    },
  });
};
