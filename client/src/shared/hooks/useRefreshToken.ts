import axios from "axios";
import useAuth from "./auth";

const URL = "http://localhost:8080/api/refresh";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async (): Promise<string> => {
    try {
      const response = await axios.get(URL, {
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

export default useRefreshToken;
