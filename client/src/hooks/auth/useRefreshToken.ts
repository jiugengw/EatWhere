import api from "@/lib/axios";
import { useAuth } from "./useAuth";

export const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async (): Promise<string> => {
    try {
      const response = await api.get("/users/refresh-token", {
        withCredentials: true,
      });
      setAuth((prev) => {
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

