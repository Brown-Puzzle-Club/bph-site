import { DjangoContext, Team, TeamMember } from "@/utils/django_types";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const getTeamMembers = async () => {
  const response = await axios.get<TeamMember[]>("/api/team-members");
  return response.data;
};
const getTeams = async () => {
  const response = await axios.get<Team[]>("/api/teams");
  return response.data;
};
const getDjangoContext = async () => {
  const response = await axios.get<DjangoContext>("/api/context");
  return response.data;
};

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ["team-members"],
    queryFn: getTeamMembers,
  });
};

export const useTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });
};

export const useDjangoContext = () => {
  return useQuery({
    queryKey: ["context"],
    queryFn: getDjangoContext,
  });
};
