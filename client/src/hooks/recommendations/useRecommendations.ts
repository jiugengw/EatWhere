import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";

export const useRecommendations = (limit = 5) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['recommendations', limit],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/recommendations?limit=${limit}`);
      return res.data;
    },
  });
};