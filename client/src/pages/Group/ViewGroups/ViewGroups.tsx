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
import classes from './ViewGroups.module.css';

export const ViewGroupsPage = () => {
  const { data, isLoading } = useViewGroups();
  const groups = data?.data?.User?.groups ?? [];

  return (
    <Container size="sm" className={classes.container}>
      <Title order={2} className={classes.title}>
        My Groups
      </Title>

      <Stack gap="sm">
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          groups.map(
            (group: { _id: string; name: string; users: string[] }) => (
              <Paper key={group._id} className={classes.groupCard}>
                <Group align="apart">
                  <div className={classes.groupInfo}>
                    <Text fw={500}>{group.name}</Text>
                    <Text size="sm" c="dimmed">
                      {group.users?.length ?? 0} members
                    </Text>
                  </div>

                  <Button
                    component={Link}
                    to={`/groups/${group._id}`}
                    variant="light"
                    size="xs"
                    className={classes.viewButton}
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
