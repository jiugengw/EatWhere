import {
  Container,
  Flex,
  Group,
  Box,
  Menu,
  Burger,
  Drawer,
  Stack,
  UnstyledButton,
  Collapse,
  Text
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { Usericon } from "../Usericon/Usericon";
import classes from "./Navbar.module.css";
import { useDisclosure } from '@mantine/hooks';
import { useState } from "react";

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
    {
      name: "Groups",
      links: [
        { name: "View Groups", path: "/group" },
        { name: "Create Group", path: "/group/create" },
        { name: "Join Group", path: "/group/join" },
      ],
    },
  ];

  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const handleMenuToggle = (menuName: string) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };
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
    <>
      <Box className={classes.navbarWrapper}>
        <Container size="lg" py="sm" px={0}>
          <Flex justify="space-between" align="center">
            <Link to="/" className={classes.logo}>
              Where2Eat
            </Link>

            <Group gap="lg" className={classes.desktopNav}>
              {links.map((link) => renderMenuItem(link))}
            </Group>

            <Group gap="sm">
              <Usericon />
              <Burger
                opened={drawerOpened}
                onClick={toggleDrawer}
                className={classes.burger}
                size="sm"
              />
            </Group>
          </Flex>
        </Container>
      </Box>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title={<Text fw={700} size="lg">Where2Eat</Text>}
        padding="md"
        size="280px"
      >
        <Stack gap="xs">
          {links.map((link) => link.links ? (
            <Box key={link.name}>
              <UnstyledButton
                className={classes.mobileNavLink}
                onClick={() => handleMenuToggle(link.name)}
              >
                <Group justify="space-between" w="100%">
                  <Text fw={500}>{link.name}</Text>
                  <IconChevronRight
                    size={16}
                    style={{
                      transform: expandedMenu === link.name ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                </Group>
              </UnstyledButton>
              <Collapse in={expandedMenu === link.name}>
                <Stack gap={0} pl="md" pt="xs">
                  {link.links.map((sublink: any) => (
                    <Link
                      key={sublink.name}
                      to={sublink.path}
                      className={classes.mobileSubLink}
                      onClick={closeDrawer}
                    >
                      {sublink.name}
                    </Link>
                  ))}
                </Stack>
              </Collapse>
            </Box>
          ) : (
            <Link
              key={link.name}
              to={link.path}
              className={classes.mobileNavLink}
              onClick={closeDrawer}
            >
              {link.name}
            </Link>
          ))}
        </Stack>
      </Drawer>
    </>
  );
}