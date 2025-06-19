import { Button, Container, Title, ActionIcon, Flex, Group } from '@mantine/core';
import { IconUserCircle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header style={{ borderBottom: '1px solid #eaeaea', padding: '1rem 0' }}>
        <Flex justify="space-between" align="center">
          <Group gap="lg">
            <Title order={3}>Where2Eat</Title>
            <Button onClick={() => navigate("/home")} variant="subtle" color="black">Home</Button>
            <Button onClick={() => navigate("/explore")} variant="subtle" color="black">Explore</Button>
            <Button onClick={() => navigate("/login")} variant="subtle" color="black">Contact</Button>
            <Button onClick={() => navigate("/groups")} variant="subtle" color="black">Group</Button>
            <Button onClick={() => navigate("/history")} variant="subtle" color="black">History</Button>
          

          <ActionIcon variant="light" size="lg" radius="xl" color="black">
            <IconUserCircle size={28} />
          </ActionIcon>
          </Group>
        </Flex>

    </header>
  );
}
