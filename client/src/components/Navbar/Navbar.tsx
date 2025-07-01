import {
  Container,
  Flex,
  Group,
  Box,
} from '@mantine/core';
import classes from './Navbar.module.css';
import { Link } from '@tanstack/react-router';
import Usericon from '../Usericon/Usericon';

export default function Navbar() {
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Group', path: '/group' },
  ];

  return (
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
          <Usericon />
        </Flex>
      </Container>
    </Box>
  );
}
