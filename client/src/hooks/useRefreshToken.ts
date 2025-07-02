import api from "@/lib/axios";
import { useAuth } from "./useAuth";

export const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async (): Promise<string> => {
    try {
      const response = await api.get("/refresh", {
        withCredentials: true,
      });
      setAuth((prev) => {
        // console.log(JSON.stringify(prev));
        // console.log(response.data.token);
        return { ...prev, token: response.data.token };
      });
      return response.data.token;
    } catch (err) {
      console.error("Refresh token failed", err);
      throw err;
    }
  };

  return refresh;
};

