import { DjangoContext, Team, TeamMember } from "@/utils/django_types";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

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

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ["team-members"],
    queryFn: getMyTeamMembers,
  });
};

export const useTeams = () => {
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
