import {
  Container,
  Title,
  Paper,
  Text,
  Button,
  Group,
  Stack,
} from '@mantine/core';
import { useViewGroups } from '@/hooks/useViewGroups';
import { Link } from '@tanstack/react-router';

export const ViewGroupsPage = () => {
  const { data, isLoading } = useViewGroups();
  console.log(data);
  const groups = data?.User?.groups ?? [];
  console.log('groups data:', groups);

  return (
    <Container size="sm" pt="md">
      <Title order={2} mb="md">
        My Groups
      </Title>

      <Stack gap="sm">
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          groups.map(
            (group: { _id: string; name: string; members: string[] }) => (
              <Paper key={group._id} withBorder p="md" radius="md">
                <Group align="apart">
                  <div>
                    <Text fw={500}>{group.name}</Text>
                    <Text size="sm" c="dimmed">
                      {group.members.length} members
                    </Text>
                  </div>

                  <Button
                    component={Link}
                    to={`/groups/${group._id}`}
                    variant="light"
                    size="xs"
                  >
                    View
                  </Button>
                </Group>
              </Paper>
            )
          )
        )}
      </Stack>
    </Container>
  );
};
