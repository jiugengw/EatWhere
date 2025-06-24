import {
  Stack,
  Burger,
  Button,
  Drawer,
  Group,
  Title,
  Flex,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import Usericon from "./usericon";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const minimise = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();

  const navButtons = (
    <>
      <Button onClick={() => navigate("/home")} variant="subtle" color="black">
        Home
      </Button>
      <Button
        onClick={() => navigate("/explore")}
        variant="subtle"
        color="black"
      >
        Explore
      </Button>
      <Button onClick={() => navigate("/login")} variant="subtle" color="black">
        Log In
      </Button>
      <Button
        onClick={() => navigate("/groups")}
        variant="subtle"
        color="black"
      >
        Group
      </Button>
      <Button
        onClick={() => navigate("/history")}
        variant="subtle"
        color="black"
      >
        History
      </Button>
    </>
  );

  return (
    <header style={{ borderBottom: "1px solid #eaeaea", padding: "1rem 0" }}>
      <Flex justify="center" align="center" gap="md">
        <Title order={1}>Where2Eat</Title>

        {minimise ? (
          <>
            <Burger opened={opened} onClick={toggle} aria-label="Toggle menu" />
            <Drawer opened={opened} onClose={close} padding="md" size="xs">
              <Stack>{navButtons}</Stack>
            </Drawer>
          </>
        ) : (
          <Group justify="space-between">
            {navButtons}
            <Usericon />
          </Group>
        )}
      </Flex>
    </header>
  );
}
