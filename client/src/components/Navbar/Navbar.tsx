import { Container, Flex, Group, Box, Menu } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { IconChevronDown } from "@tabler/icons-react";
import { Usericon } from "../Usericon/Usericon";
import classes from "./Navbar.module.css";

export default function Navbar() {
  const links = [
    { name: "Home", path: "/" },
    {
      name: "Discover",
      links: [
        { name: "Personal", path: "/discover" },
        { name: "Group", path: "/discover?type=group" },
      ],
    },
    { name: "Search", path: "/search" },
    {
      name: "Groups",
      links: [
        { name: "View Groups", path: "/group" },
        { name: "Create Group", path: "/group/create" },
        { name: "Join Group", path: "/group/join" },
      ],
    },
  ];

  const renderMenuItem = (link: any) => {
    if (link.links) {
      return (
        <Menu
          key={link.name}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <span className={classes.navLink} style={{ cursor: "pointer" }}>
              {link.name} <IconChevronDown size={14} style={{ marginLeft: 4 }} />
            </span>
          </Menu.Target>
          <Menu.Dropdown>
            {link.links.map((sublink: any) => (
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
    } else {
      return (
        <Link
          key={link.name}
          to={link.path}
          className={classes.navLink}
        >
          {link.name}
        </Link>
      );
    }
  };

  return (
    <Box className={classes.navbarWrapper}>
      <Container size="lg" py="sm" px={0}>
        <Flex justify="space-between" align="center">
          <Link to="/" className={classes.logo}>
            Where2Eat
          </Link>
          <Group gap="lg">
            {links.map((link) => renderMenuItem(link))}
          </Group>
          <Group gap="sm">
            <Usericon />
          </Group>
        </Flex>
      </Container>
    </Box>
  );
}