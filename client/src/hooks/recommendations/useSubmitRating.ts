import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { showNotification } from "@mantine/notifications";

export const useSubmitRating = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cuisineName,
      rating,
      restaurantId,
      googleRating,
    }: {
      cuisineName: string;
      rating: number;
      restaurantId: string;
      googleRating: number;
    }) => {
      const res = await axiosPrivate.post("/recommendations/ratings", {
        restaurantId,
        cuisine: cuisineName,
        rating,
        googleRating,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['smartRecommendations'] }); 
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] });
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

