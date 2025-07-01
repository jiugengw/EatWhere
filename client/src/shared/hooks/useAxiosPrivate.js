import { axiosPrivate } from "../../api/useapi";
import { useEffect } from "react";
import useAuth from "./auth";

const useAxiosPrivate = () => {
  const { auth } = useAuth();
  console.log(useAuth());

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

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  }, [auth]);
  return axiosPrivate;
};

export default useAxiosPrivate;
