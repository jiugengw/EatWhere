import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useNavigate } from "@tanstack/react-router";
import type { LoginInput } from "@/shared/schemas/LoginSchema";
import type { AxiosError } from "axios";
import { useAuth } from "./useAuth";
import { showNotification } from "@mantine/notifications";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await api.post("/users/login", data);
      console.log(res.data);
      return res.data;
    },
    onSuccess: (data) => {
      setAuth({
        token: data.token,
        fullName: data.data.User.fullName,
        id: data.data.User.id,
      });

      // optionally store token for persistence
      localStorage.setItem("token", data.token);
      navigate({ to: "/" });
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;

      showNotification({
        title: "Login failed",
        message:
          err?.response?.data?.message ||
          "Something went wrong. Please try again.",
        color: "red",
      });

      console.error("Login failed:", error);
    },
  });
};
