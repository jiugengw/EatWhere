import { Button, Center, Container, Text, Title } from '@mantine/core';
import { Link } from '@tanstack/react-router';

export const NotFoundPage = () => {
  return (
    <Container mt="5rem">
      <Center>
        <Title order={1} c="dimmed">
          404
        </Title>
      </Center>
      <Center mt="md">
        <Title order={3}>Looks like you're lost</Title>
      </Center>
      <Center mt="xs">
        <Text c="dimmed">The page you are looking for is not available!</Text>
      </Center>
      <Center mt="xl">
        <Button component={Link} to="/" variant="light">
          Go to Home
        </Button>
      </Center>
    </Container>
  );
};
