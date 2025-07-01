import {
  Avatar,
  Popover,
  Text,
  Box,
  Anchor,
  Container,
  Divider,
  Paper,
} from "@mantine/core";
// import { useDisclosure,useClickOutside } from "@mantine/hooks";
import { IconUserCircle } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/auth";
import LogoutButton from "./logoutButton";

export default function Usericon() {
  // const [opened, { open, close,toggle }] = useDisclosure(false);
  const { auth } = useAuth();
  console.log(useAuth());
  const loggedIn = !!auth.token;
  console.log(auth.token);
  const fullName = loggedIn ? auth.fullName : null;

  return (
    <Popover
      width={220}
      position="bottom"
      withArrow
      shadow="lg"
      openDelay={100}
      closeDelay={200}
      transitionProps={{ transition: "pop", duration: 150 }}
      // opened={opened}
    >
      <Popover.Target>
        <Box
          style={{
            padding: 6,
            display: "inline-block",
            transition: "transform 0.2s ease out",
          }}
          // onMouseEnter={(e) => {
          //   e.currentTarget.style.transform = "scale(1.1)";
          //   open();
          // }}
          // onMouseLeave={(e) => {
          //   e.currentTarget.style.transform = "scale(1)";
          //   close();
          // }}
          // onClick={toggle}
        >
          {loggedIn ? (
            <Avatar name={fullName} color="initials" />
          ) : (
            <IconUserCircle
              size={32}
              stroke={1.5}
              style={{ cursor: "pointer" }}
            />
          )}
        </Box>
      </Popover.Target>

      <Popover.Dropdown
      // onMouseEnter={() => {
      //   open();
      // }}
      // onMouseLeave={() => {
      //   close();
      // }}
      // ref={useClickOutside(() => close())}
      >
        <Paper radius="md" p="sm" withBorder shadow="sm">
          {loggedIn ? (
            <Container
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <Text size="md" fw={500}>
                {auth?.fullName}
              </Text>
              <Text size="xs" c="dimmed">
                There will be a bunch more stuff here next time
              </Text>
              <Divider my="sm" />
              <LogoutButton />
            </Container>
          ) : (
            <Container style={{ textAlign: "center" }}>
              <Anchor component={Link} to="/login" fw={500}>
                Log in
              </Anchor>{" "}
              to access the full features
            </Container>
          )}
        </Paper>
      </Popover.Dropdown>
    </Popover>
  );
}
