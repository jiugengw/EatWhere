import { Container, Flex, Group, Box, Menu } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { IconChevronDown } from "@tabler/icons-react";
import { Usericon } from "../Usericon/Usericon";
import classes from "./Navbar.module.css";
import { ColorSchemeToggle } from "../ColorSchemeToggle/ColorSchemeToggle";

export default function Navbar() {
  const links = [
    { name: "Home", path: "/" },
    {
      name: "Recommendations",
      links: [
        {
          name: "Personal",
          links: [
            { name: "Top Picks", path: "/recommendations?type=personal&mode=top" },
            { name: "Discover", path: "/recommendations?type=personal&mode=discover" },
          ],
        },
        {
          name: "Group",
          links: [
            { name: "Top Picks", path: "/recommendations?type=group&mode=top" },
            { name: "Discover", path: "/recommendations?type=group&mode=discover" },
          ],
        },
      ],
    },
    {
      name: "Group",
      links: [
        { name: "View Groups", path: "/group" },
        { name: "Create Group", path: "/group/create" },
        { name: "Join Group", path: "/group/join" },
      ],
    },
  ];

  const renderMenuItem = (link: any) => {
    if (link.links && link.links[0]?.links) {
      return (
        <Menu
          key={link.name}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
          position="bottom-start"
        >
          <Menu.Target>
            <span className={classes.navLink} style={{ cursor: "pointer" }}>
              {link.name} <IconChevronDown size={14} style={{ marginLeft: 4 }} />
            </span>
          </Menu.Target>
          <Menu.Dropdown>
            {link.links.map((sublink: any) => (
              <div key={sublink.name}>
                <Menu.Label>{sublink.name}</Menu.Label>
                {sublink.links.map((nestedLink: any) => (
                  <Menu.Item
                    key={nestedLink.name}
                    component={Link}
                    to={nestedLink.path}
                    pl="xl"
                  >
                    {nestedLink.name}
                  </Menu.Item>
                ))}
              </div>
            ))}
          </Menu.Dropdown>
        </Menu>
      );
    }
    else if (link.links) {
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
    }
    else {
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
            <ColorSchemeToggle />
            <Usericon />
          </Group>
        </Flex>
      </Container>
    </Box>
  );
}