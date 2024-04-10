import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { z } from "zod";

import type { registerFormSchema } from "@/routes/Register";
import type { User, UserTeam } from "@/utils/django_types";

const getMyTeam = async () => {
  const response = await axios.get<UserTeam[]>("/api/my-team");
  return response.data[0];
};
const getMyToken = async () => {
  const response = await axios.get<[{ key: string; id: number }]>("/api/my-token");
  console.log(response);
  return response.data[0].key;
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
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      queryClient.invalidateQueries();
      team.refetch();
      user.refetch();
      token.refetch();
    },
  });
  const logout = useMutation({
    mutationKey: ["logout"],
    mutationFn: postLogout,
    onSuccess: () => {
      queryClient.invalidateQueries();
      team.refetch();
      user.refetch();
    },
  });
  const register = useMutation({
    mutationKey: ["register"],
    mutationFn: postRegister,
  });

  return { team, user, login, logout, register, token };
};
