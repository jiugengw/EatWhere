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
import { IconUserCircle } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import useAuth from "@/hooks/useAuth";
import LogoutButton from "../LogoutButton";

export default function Usericon() {
  const { auth } = useAuth();
  const loggedIn = !!auth.token;
  const fullName: string = loggedIn ? (auth.fullName as string) : "";

  return (
    <Popover
      width={220}
      position="bottom"
      withArrow
      shadow="lg"
      transitionProps={{ transition: "pop", duration: 150 }}
    >
      <Popover.Target>
        <Box
          style={{
            padding: 6,
            display: "inline-block",
            transition: "transform 0.2s ease-out",
          }}
        >
          {loggedIn ? (
            <Avatar name={fullName} color="initials">
              {fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </Avatar>
          ) : (
            <IconUserCircle
              size={32}
              stroke={1.5}
              style={{ cursor: "pointer" }}
            />
          )}
        </Box>
      </Popover.Target>

      <Popover.Dropdown>
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
                {fullName}
              </Text>
              <Text size="xs" c="dimmed">
                There will be a bunch more stuff here next time
              </Text>
              <Divider my="sm" />
              <Anchor component={Link} to="/profile" fw={500}>
                View my profile
              </Anchor>{" "}
              <br/>
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
