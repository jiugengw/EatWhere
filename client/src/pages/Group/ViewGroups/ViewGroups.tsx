import {
  Container,
  Title,
  Button,
} from '@mantine/core';
import { useViewGroups } from '@/hooks/useViewGroups';
import { Link } from '@tanstack/react-router';
import classes from './ViewGroups.module.css';
import { TableSelection } from '@/components/TableSelection/TableSelection';

export const ViewGroupsPage = () => {
  const { data, isLoading } = useViewGroups();
  const groups = data?.data?.User?.groups ?? [];

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
      ) : (
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
        />
      )}
    </Container>
  );
};