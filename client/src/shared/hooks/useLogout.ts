import useAxios from "../../api/useApi";
import { useNavigate } from "react-router-dom";
import useAuth from "./auth";

const useLogout = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await useAxios.post("/users/logout");
      setAuth({});
      navigate("/login");
    } catch (err) {
      console.error("logout error: ", err);
    }
  };
  return logout;
};

export default useLogout;
