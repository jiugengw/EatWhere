import {
  Container,
  Flex,
  Group,
  ActionIcon,
  Box,
  Button,
  Transition,
} from '@mantine/core';
import { IconUserCircle } from '@tabler/icons-react';
import { useState } from 'react';
import classes from './Navbar.module.css';
import { Link } from '@tanstack/react-router';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Group', path: '/group' },
  ];

  return (
    <>
      {/* Full-width Navbar wrapper */}
      <Box className={classes.navbarWrapper}>
        <Container size="lg" py="sm" px={0}>
          <Flex justify="space-between" align="center">
            {/* Logo */}
            <Link to="/" className={classes.logo}>
              Where2Eat
            </Link>

            {/* Navigation Links */}
            <Group gap="lg">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={classes.navLink}
                >
                  {link.name}
                </Link>
              ))}
            </Group>

            {/* Profile Icon */}
            <ActionIcon
              variant="transparent"
              size="lg"
              className={classes.profileIcon}
              title="Account"
              onClick={() => setDropdownOpen((o) => !o)}
            >
              <IconUserCircle size={26} />
            </ActionIcon>
          </Flex>
        </Container>
      </Box>

      {/* Full-width Dropdown Panel */}
      <Transition
        mounted={dropdownOpen}
        transition="pop-top-right"
        duration={200}
        timingFunction="ease"
      >
        {(styles) => (
          <Box style={styles} className={classes.dropdownPanel}>
            <Flex className={classes.dropdownInner}>
              <Button
                radius="xl"
                className={classes.loginButton}
                component={Link}
                to="/login"
              >
                Log In
              </Button>

              <Button
                radius="xl"
                variant="outline"
                className={classes.signupButton}
                component={Link}
                to="/signup"
              >
                Sign Up
              </Button>
            </Flex>
          </Box>
        )}
      </Transition>
    </>
  );
}
