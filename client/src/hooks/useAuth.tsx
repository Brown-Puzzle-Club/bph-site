import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { z } from "zod";

import type { registerFormSchema } from "@/routes/Register";
import type { APIResponse, Token, User, UserTeam } from "@/utils/django_types";

const getMyTeam = async () => {
  const response = await axios.get<APIResponse<UserTeam>>("/api/my-team/");
  return response.data.success ? response.data.data : null;
};
const getMyToken = async () => {
  const response = await axios.get<APIResponse<Token>>("/api/my-token/");
  return response.data.success ? response.data.data["key"] : null;
};
const getUser = async () => {
  const response = await axios.get<APIResponse<User>>("/api/user/");
  return response.data.success ? response.data.data : null;
};
const postLogin = async (credentials: { username: string; password: string }) => {
  await axios.post<UserTeam>("/api/login", credentials);
  window.location.href = "/";
  window.location.reload();
};
const postLogout = async () => {
  await axios.post("/api/logout");
  window.location.href = "/";
  window.location.reload();
};
const postRegister = async (values: z.infer<typeof registerFormSchema>) => {
  await axios.post("/api/register", values);
  window.location.href = "/";
  window.location.reload();
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
  const token = useQuery({
    queryKey: ["my-token"],
    queryFn: getMyToken,
  });
  const login = useMutation({
    mutationKey: ["login"],
    mutationFn: postLogin,
  });
  const logout = useMutation({
    mutationKey: ["logout"],
    mutationFn: postLogout,
  });
  const register = useMutation({
    mutationKey: ["register"],
    mutationFn: postRegister,
  });

  return { team, user, login, logout, register, token };
};
