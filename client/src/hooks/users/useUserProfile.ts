import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "@/hooks/auth/useAxiosPrivate";

export const useUserProfile = () => {

  const axiosPrivate = useAxiosPrivate();


  const fetchUser = async () => {
    const response = await axiosPrivate.get("/users/me");
    return response.data;
  };

  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUser,
  });
};
