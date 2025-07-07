import {
  Container,
  Title,
  Button,
  Stack,
  Group,
  Text
} from '@mantine/core';
import { useViewGroups } from '@/hooks/groups/useViewGroups';
import { Link } from '@tanstack/react-router';
import classes from './ViewGroups.module.css';
import { TableSelection } from '@/components/TableSelection/TableSelection';
import { useLeaveGroups } from '@/hooks/groups/useLeaveGroups';
import { useState } from 'react';
import { modals } from '@mantine/modals';

export const ViewGroupsPage = () => {
  const { data, isLoading } = useViewGroups();
  const [selected, setSelected] = useState<string[]>([]);
  const groups = data?.data?.user?.groups ?? [];

  const leave = useLeaveGroups();
  const handleLeave = () => {
    const selectedGroups = groups.filter((g) => selected.includes(g._id));

    const lastUserGroups = selectedGroups.filter((g) => g.userCount === 1);

    const willBeRemovedNames = lastUserGroups.map((g) => `"${g.name}"`).join(', ');

    if (lastUserGroups.length > 0) {
      modals.openConfirmModal({
        title: 'Are you sure?',
        children: `You are the last member in ${willBeRemovedNames}. Leaving will delete the group${lastUserGroups.length > 1 ? 's' : ''}. Continue?`,
        labels: { confirm: 'Yes, leave', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onConfirm: () => leave.mutate(selected),
      });
    } else {
      leave.mutate(selected);
    }
  };

  const groupRows = groups.map((group) => ({
    id: group._id,
    name: group.name,
    members: group.userCount,
  }));

  return (
    <Container size="sm" className={classes.container}>
      <Title order={2} className={classes.title}>
        My Groups
      </Title>

      {isLoading ? (
        <p>Loading...</p>
      ) : groupRows.length === 0 ? (
        <Stack className={classes.noGroupsContainer}>
          <Text>No groups currently.</Text>
          <Group className={classes.actionButtons}>
            <Button component={Link} to="/group/create" color="green">
              Create Group
            </Button>
            <Button component={Link} to="/group/join" variant="default">
              Join Group
            </Button>
          </Group>
        </Stack>
      ) : (
        <>
          <Button
            onClick={handleLeave}
            disabled={selected.length === 0 || leave.isPending}
          >
            Leave Selected
          </Button>
          <TableSelection
            data={groupRows}
            columns={[
              { key: 'name', header: 'Group Name' },
              { key: 'members', header: 'Members' },
              {
                key: 'actions',
                header: '',
                render: (row) => (
                  <Button
                    component={Link}
                    to={`/group/${row.id}`}
                    variant="light"
                    size="xs"
                  >
                    Open
                  </Button>
                ),
              },
            ]}
            selection={selected}
            onSelectionChange={setSelected}
          />
        </>
      )}
    </Container>
  );
}