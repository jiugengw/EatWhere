import { Button } from "@mantine/core";
import useLogout from "@/hooks/useLogout";

export default function LogoutButton() {
  const logout = useLogout();

  return (
    <Button color="black" variant="light" size="xs" onClick={logout}>
      Logout
    </Button>
  );
}
