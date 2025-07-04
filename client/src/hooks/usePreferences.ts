import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "./useAxiosPrivate";

export const useUserPreferences = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ["userPreferences"],
    queryFn: async () => {
      const res = await axiosPrivate.get("/users/me/preferences");
      console.log(res.data);
      return res.data;
    },
  });
};
