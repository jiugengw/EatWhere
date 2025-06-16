import { Button, Container, Title, ActionIcon, Flex, Group } from '@mantine/core';
import { IconUserCircle } from '@tabler/icons-react';

export default function Navbar() {
  return (
    <header style={{ borderBottom: '1px solid #eaeaea', padding: '1rem 0' }}>
      <Container size="lg">
        <Flex justify="space-between" align="center">
          <Group gap="lg">
            <Title order={3}>Where2Eat</Title>
            <Button variant="subtle" color="black">Home</Button>
            <Button variant="subtle" color="black">Explore</Button>
            <Button variant="subtle" color="black">Contact</Button>
            <Button variant="subtle" color="black">Group</Button>
            <Button variant="subtle" color="black">History</Button>
          </Group>

          <ActionIcon variant="light" size="lg" radius="xl" color="black">
            <IconUserCircle size={28} />
          </ActionIcon>
        </Flex>
      </Container>
    </header>
  );
}
