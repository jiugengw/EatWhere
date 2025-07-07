import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";

export const useDiscoverRecommendations = (limit = 4) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['discover-recommendations', limit],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/recommendations/discover?limit=${limit}`);
      return res.data;
    },
  });
};