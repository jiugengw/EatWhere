import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { showNotification } from "@mantine/notifications";

export const useToggleFavourite = () => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (cuisineName: string) => {
            const res = await axiosPrivate.post("/recommendations/favourites", {
                cuisineName
            });
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['favourites'] });
            queryClient.invalidateQueries({ queryKey: ['recommendations'] });

            showNotification({
                title: data.data.isFavourited ? "Added to favourites" : "Removed from favourites",
                message: `${data.data.cuisineName} ${data.data.isFavourited ? 'added to' : 'removed from'} your favourites`,
                color: data.data.isFavourited ? "pink" : "orange",
            });
        },
        onError: () => {
            showNotification({
                title: "Failed to update favourites",
                message: "Please try again",
                color: "red",
            });
        },
    });
};