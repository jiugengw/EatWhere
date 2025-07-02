import { Container, Flex, Group, Box, Menu } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { IconChevronDown } from '@tabler/icons-react';
import Usericon from '../Usericon/Usericon';
import classes from './Navbar.module.css';

export default function Navbar() {
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    {
      name: 'Group',
      links: [
        { name: 'View Groups', path: '/group' },
        { name: 'Create Group', path: '/group/create' },
        { name: 'Join Group', path: '/group/join' },
      ],
    },
  ];

  return (
    <Box className={classes.navbarWrapper}>
      <Container size="lg" py="sm" px={0}>
        <Flex justify="space-between" align="center">
          <Link to="/" className={classes.logo}>
            Where2Eat
          </Link>
          <Group gap="lg">
            {links.map((link) => {
              if (link.links) {
                return (
                  <Menu
                    key={link.name}
                    trigger="hover"
                    transitionProps={{ exitDuration: 0 }}
                    withinPortal
                  >
                    <Menu.Target>
                      <span
                        className={classes.navLink}
                        style={{ cursor: 'pointer' }}
                      >
                        {link.name}{' '}
                        <IconChevronDown size={14} style={{ marginLeft: 4 }} />
                      </span>
                    </Menu.Target>
                    <Menu.Dropdown>
                      {link.links.map((sublink) => (
                        <Menu.Item
                          key={sublink.name}
                          component={Link}
                          to={sublink.path}
                        >
                          {sublink.name}
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                );
              }
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={classes.navLink}
                >
                  {link.name}
                </Link>
              );
            })}
          </Group>

          <Usericon />
        </Flex>
      </Container>
    </Box>
  );
}
