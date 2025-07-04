import { useMutation } from "@tanstack/react-query";
import { showNotification } from "@mantine/notifications";
import { AxiosError } from "axios";
import { useAxiosPrivate } from "./useAxiosPrivate";

interface UpdatePasswordInput {
  passwordCurrent: string;
  passwordNew: string;
  passwordConfirm:string;
}

export const useUpdatePassword = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (data: UpdatePasswordInput) => {
      const res = await axiosPrivate.patch("users/me/password", data);
      return res.data;
    },
    onSuccess: () => {
      showNotification({
        title: "Password Updated",
        message: "Your password has been updated",
        color: "green",
      });
    },
    onError: (error:unknown) => {
      const err = error as AxiosError<{ message: string }>;
      showNotification({
        title: "Update failed",
        message: err.response?.data?.message || "something went wrong.",
        color: "red",
      });
    },
  });
};
