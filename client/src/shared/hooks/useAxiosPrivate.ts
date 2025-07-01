  import { axiosPrivate } from "../../api/useApi";
  import { useEffect } from "react";
  import useAuth from "./auth";
  import useRefreshToken from "./useRefreshToken";

  const useAxiosPrivate = () => {
    const { auth } = useAuth();
    const refresh = useRefreshToken();

    useEffect(() => {
      const requestIntercept = axiosPrivate.interceptors.request.use(
        (config) => {
          if (!config.headers["Authorization"]) {
            config.headers["Authorization"] = `Bearer ${auth.token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

      const responseIntercept = axiosPrivate.interceptors.response.use(
        (response) => response,
        async (error) => {
          const prevRequest = error?.config;
          if (error?.response?.status === 403 && !prevRequest?.sent) {
            try {
              prevRequest.sent = true;
              const newAccessToken = await refresh(); 
              prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
              return axiosPrivate(prevRequest); 
            } catch (refreshError) {
              console.error("Refresh failed:", refreshError);
            }
          }
          return Promise.reject(error);
        }
      );

      return () => {
        axiosPrivate.interceptors.request.eject(requestIntercept);
        axiosPrivate.interceptors.response.eject(responseIntercept);
      };
    }, [auth, refresh]);

    return axiosPrivate;
  };

  export default useAxiosPrivate;
