import {
  Container,
  Title,
  Button,
  Group,
  Text,
  SimpleGrid,
  Skeleton,
  Box,
  Flex
} from '@mantine/core';
import {
  IconUsers,
  IconPlus,
  IconLogin,
} from '@tabler/icons-react';
import { useViewGroups } from '@/hooks/groups/useViewGroups';
import { Link } from '@tanstack/react-router';
import { useLeaveGroup } from '@/hooks/groups/useLeaveGroup';
import { GroupCard } from '@/components/GroupCard/GroupCard';

export const ViewGroupsPage = () => {
  const { data, isLoading } = useViewGroups();
  const groups = data?.data?.user?.groups ?? [];
  const { handleLeaveGroup } = useLeaveGroup();

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Title order={2} mb="xl" ta="center">My Groups</Title>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={200} radius="md" />
          ))}
        </SimpleGrid>
      </Container>
    );
  }

  if (groups.length === 0) {
    return (
      <Container size="sm" py="xl">
        <Box ta="center">
          <IconUsers size={64} color="#ccc" style={{ marginBottom: '1rem' }} />
          <Title order={2} mb="md" c="dimmed">No Groups Yet</Title>
          <Text c="dimmed" mb="xl">
            Create your first group or join an existing one to start discovering great food together!
          </Text>

          <Group justify="center" gap="md">
            <Button
              component={Link}
              to="/group/create"
              leftSection={<IconPlus size={18} />}
              size="lg"
            >
              Create Group
            </Button>
            <Button
              component={Link}
              to="/group/join"
              variant="light"
              leftSection={<IconLogin size={18} />}
              size="lg"
            >
              Join Group
            </Button>
          </Group>
        </Box>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Flex justify="space-between" align="center" mb="xl">
        <Title order={2}>My Groups</Title>
        <Group>
          <Button
            component={Link}
            to="/group/create"
            leftSection={<IconPlus size={16} />}
            variant="light"
          >
            Create
          </Button>
          <Button
            component={Link}
            to="/group/join"
            leftSection={<IconLogin size={16} />}
            variant="outline"
          >
            Join
          </Button>
        </Group>
      </Flex>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {groups.map((group, index) => (
          <GroupCard
            key={group._id}
            group={group}
            onLeaveGroup={handleLeaveGroup}
            colorIndex={index}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
};








