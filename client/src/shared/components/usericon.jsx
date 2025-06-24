import React, { useContext } from "react";
import { Popover, Text, Box, Anchor, Container } from "@mantine/core";
import { IconUserCircle } from "@tabler/icons-react";
import { AuthContext } from "../context/auth-context";
import LogoutButton from "./logoutButton";


export default function Usericon() {
  const auth = useContext(AuthContext);
  const id = auth.userId || "log in to see your profile";

  return (
    <Popover
      width={200}
      position="bottom"
      withArrow
      shadow="md"
      openDelay={100}
      closeDelay={200}
      transitionProps={{ transition: "fade" }}
      trigger="hover"
    >
      <Popover.Target>
        <Box>
          <IconUserCircle
            size={32}
            stroke={1.5}
            style={{ cursor: "pointer" }}
          />
        </Box>
      </Popover.Target>
      <Popover.Dropdown>
        <Container>
          <Text size="xs" fw={400}>
            {id}
          </Text>
          <LogoutButton/>
        </Container>
      </Popover.Dropdown>
    </Popover>
  );
}
