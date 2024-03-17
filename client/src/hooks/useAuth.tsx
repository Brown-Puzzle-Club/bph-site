import { registerFormSchema } from "@/routes/Register";
import { User, UserTeam } from "@/utils/django_types";
import axios from "axios";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";

const getMyTeam = async () => {
  const response = await axios.get<UserTeam[]>("/api/my-team");
  return response.data[0];
};
const getUser = async () => {
  const response = await axios.get<User[]>("/api/user");
  return response.data[0];
};
const postLogin = async (credentials: { username: string; password: string }) => {
  const response = await axios.post<UserTeam>("/api/login", credentials);
  return response.data;
};
const postLogout = async () => {
  return await axios.post("/api/logout");
};
const postRegister = async (values: z.infer<typeof registerFormSchema>) => {
  return await axios.post("/api/register", values);
};

export const useAuth = () => {
  const team = useQuery({
    queryKey: ["my-team"],
    queryFn: getMyTeam,
  });
  const user = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
  const login = useMutation({
    mutationKey: ["login"],
    mutationFn: postLogin,
    onSuccess: () => team.refetch(),
  });
  const logout = useMutation({
    mutationKey: ["logout"],
    mutationFn: postLogout,
  });
  const register = useMutation({
    mutationKey: ["register"],
    mutationFn: postRegister,
  });

  return { team, user, login, logout, register };
};
