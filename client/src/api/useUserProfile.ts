import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export const useUserProfile = () => {
  
  const axiosPrivate = useAxiosPrivate();

  
  const fetchUser = async () => {
    const response = await axiosPrivate.get("/users/me");
    console.log("this is the response", response.data);
    return response.data;
  };

  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUser,
  });
};
