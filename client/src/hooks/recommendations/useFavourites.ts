import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";

export const useFavourites = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['favourites'],
    queryFn: async () => {
      const res = await axiosPrivate.get('/recommendations/favourites');
      return res.data;
    },
  });
};