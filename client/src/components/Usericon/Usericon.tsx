// Usericon.tsx
import {
  Avatar,
  Popover,
  Text,
  Box,
  Divider,
  Paper,
  Button,
  SimpleGrid,
  Group,
  Stack,
  UnstyledButton,
} from '@mantine/core';
import {
  IconUserCircle,
  IconUser,
  IconPalette,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '@/hooks/auth/useAuth';
import { LogoutButton } from '../ LogoutButton/LogoutButton';
import classes from './Usericon.module.css';

export function Usericon() {
  const { auth } = useAuth();
  const loggedIn = !!auth.token;
  const fullName: string = loggedIn ? (auth.fullName as string) : '';

  const menuItems = [
    {
      icon: IconUser,
      label: 'Profile',
      to: '/profile',
      color: 'blue'
    },
    {
      icon: IconPalette,
      label: 'Preferences',
      to: '/preferences',
      color: 'orange'
    },
  ];

  return (
    <Popover
      width={200}
      position="bottom-end"
      withArrow
      shadow="lg"
      transitionProps={{ transition: 'pop', duration: 150 }}
    >
      <Popover.Target>
        <Box className={classes.avatarbox}>
          {loggedIn ? (
            <Avatar name={fullName} color="initials" className={classes.avatar}>
              {(() => {
                const names = fullName?.split(' ') || [];
                return names.length > 1
                  ? names[0][0] + names[names.length - 1][0]
                  : names[0]?.[0] || '';
              })()}
            </Avatar>
          ) : (
            <IconUserCircle size={32} stroke={1.5} className={classes.icon} />
          )}
        </Box>
      </Popover.Target>

      <Popover.Dropdown className={classes.dropdown} p={0}>
        <Paper radius="md" shadow="sm">
          {loggedIn ? (
            <Box p="sm">
              <Group mb="sm" gap="xs">
                <Avatar name={fullName} color="initials" size="sm">
                  {(() => {
                    const names = fullName?.split(' ') || [];
                    return names.length > 1
                      ? names[0][0] + names[names.length - 1][0]
                      : names[0]?.[0] || '';
                  })()}
                </Avatar>
                <Stack gap={1}>
                  <Text size="xs" fw={500} lineClamp={1}>
                    {fullName}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Manage account
                  </Text>
                </Stack>
              </Group>

              <Divider mb="sm" />

              <SimpleGrid cols={2} spacing={0} className={classes.gridContainer}>
                {menuItems.map((item) => (
                  <UnstyledButton
                    key={item.label}
                    className={classes.gridItem}
                    component={Link}
                    to={item.to}
                  >
                    <item.icon size={24} color={`var(--mantine-color-${item.color}-6)`} />
                    <Text size="xs" mt={4}>
                      {item.label}
                    </Text>
                  </UnstyledButton>
                ))}
              </SimpleGrid>

              <LogoutButton />
            </Box>
          ) : (
            <Box p="sm">
              <Button
                component={Link}
                to="/login"
                variant="light"
                size="xs"
                radius="md"
                fullWidth
              >
                Log in to your account
              </Button>
            </Box>
          )}
        </Paper>
      </Popover.Dropdown>
    </Popover>
  );
}
