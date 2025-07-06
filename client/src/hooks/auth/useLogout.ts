import api from "@/lib/axios";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "./useAuth";

export const useLogout = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api.post("/users/logout");
      setAuth({});
      localStorage.removeItem("token");
      sessionStorage.removeItem("auth");
      navigate({ to: '/login' });

    } catch (err) {
      console.error("logout error: ", err);
    }
  };
  return logout;
};


