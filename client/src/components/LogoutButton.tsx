import { Button } from '@mantine/core';
import { useLogout } from '@/hooks/auth/useLogout';

export const LogoutButton = () => {
  const logout = useLogout();

  return (
    <Button color="black" variant="light" size="xs" onClick={logout}>
      Logout
    </Button>
  );
};
