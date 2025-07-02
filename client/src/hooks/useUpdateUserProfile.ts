import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "./useAxiosPrivate";
import { showNotification } from "@mantine/notifications";
import { AxiosError } from "axios";
import { useAuth } from "./useAuth";

interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export const useUpdateUserProfile = () => {
  const { setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (data: UpdateUserInput) => {
      const res = await axiosPrivate.patch("/users/me", data);
      return res.data;
    },
    onSuccess: (data) => {
        console.log(data);
      showNotification({
        title: "Profile updated",
        message: "Your profile was successfully updated.",
        color: "green",
      });

      // Optional: update auth state if name/email changed
      setAuth((prev) => ({
        ...prev,
        fullName: data.data.user.fullName,
      }));
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message: string }>;

      showNotification({
        title: "Update failed",
        message:
          err?.response?.data?.message ||
          "Something went wrong. Please try again.",
        color: "red",
      });

      console.error("Update profile failed:", error);
    },
  });
};
