import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { showNotification } from "@mantine/notifications";

export const useSubmitRating = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cuisineName, rating }: { cuisineName: string; rating: number }) => {
      const res = await axiosPrivate.post("/recommendations/ratings", {
        cuisineName,
        rating
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      showNotification({
        title: "Rating submitted",
        message: "Thanks for your feedback!",
        color: "green",
      });
    },
    onError: () => {
      showNotification({
        title: "Rating failed",
        message: "Please try again",
        color: "red",
      });
    },
  });
};