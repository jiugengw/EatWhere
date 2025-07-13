import { Button } from '@mantine/core';
import { useLogout } from '@/hooks/auth/useLogout';
import classes from './LogoutButton.module.css'

export const LogoutButton = () => {
  const logout = useLogout();

  return (
    <Button color="black"
      variant="light"
      size="xs"
      onClick={logout}
      className={classes.logoutButton}
    >
      Logout
    </Button>
  );
};
