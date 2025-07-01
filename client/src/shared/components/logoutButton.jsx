import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/auth";
import useAxios from "../../api/useApi";

export default function LogoutButton() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await useAxios.post("/users/logout");
      setAuth({});
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button color="black" variant="light" size="xs" onClick={handleLogout}>
      Logout
    </Button>
  );
}
