import {
  Avatar,
  Popover,
  Text,
  Box,
  Container,
  Divider,
  Paper,
  Button,
} from '@mantine/core';
import { IconUserCircle } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import { LogoutButton } from '../LogoutButton';
import classes from './Usericon.module.css';

export function Usericon() {
  const { auth } = useAuth();
  const loggedIn = !!auth.token;
  const fullName: string = loggedIn ? (auth.fullName as string) : '';

  return (
    <Popover
      width={220}
      position="bottom"
      withArrow
      shadow="lg"
      transitionProps={{ transition: 'pop', duration: 150 }}
    >
      <Popover.Target>
        <Box className={classes.avatarbox}>
          {loggedIn ? (
            <Avatar name={fullName} color="initials">
              {fullName
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </Avatar>
          ) : (
            <IconUserCircle size={32} stroke={1.5} className={classes.icon} />
          )}
        </Box>
      </Popover.Target>

      <Popover.Dropdown className={classes.dropdown}>
        <Paper radius="md" p="sm" withBorder shadow="sm">
          {loggedIn ? (
            <Container className={classes.containerCenter}>
              <Text size="md" fw={500}>
                {fullName}
              </Text>
              <Text size="xs" c="dimmed">
                There will be a bunch more stuff here next time
              </Text>
              <Divider my="sm" />
              <Button
                component={Link}
                to="/profile"
                variant="subtle"
                fullWidth
                radius="md"
              >
                View my profile
              </Button>
              <br />
              <LogoutButton />
            </Container>
          ) : (
            <Container className={classes.loginPrompt}>
              <Button
                component={Link}
                to="/login"
                variant="subtle"
                size="sm"
                radius="md"
                fullWidth
              >
                Log in to access the full features
              </Button>
            </Container>
          )}
        </Paper>
      </Popover.Dropdown>
    </Popover>
  );
}
