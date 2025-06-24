import React, { useContext } from "react";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

export default function LogoutButton() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();          
    navigate("/login");     
  };

  return (
    <Button
      color="red"
      variant="light"
      size="xs"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}
