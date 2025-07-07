import { useState } from 'react';
import {
  Container,
  Title,
  Table,
  ActionIcon,
  Text,
  Group,
  Button,
} from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useGroupDetails } from '@/hooks/groups/useGroupDetails';
import { useParams } from '@tanstack/react-router';
import classes from './GroupDetails.module.css';
import { TableSelection } from '@/components/TableSelection/TableSelection';
import { maskEmail } from '@/utils/maskEmail';
import { useGroupRole } from '@/hooks/groups/useGroupRole';
import { useUpdateGroupRoles } from '@/hooks/groups/useUpdateGroupRoles';
import { useRemoveGroupMembers } from '@/hooks/groups/useRemoveGroupMembers';
import { useAuth } from '@/hooks/auth/useAuth';

export const GroupDetailPage = () => {
  const { auth } = useAuth();
  const currentUserId = auth?.id;
  const { id } = useParams({ from: '/group/$id/' });
  const { data, isLoading } = useGroupDetails(id);
  const [showCode, setShowCode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const group = data?.group;
  const { isAdmin } = useGroupRole(group?.users ?? []);
  const updateRoles = useUpdateGroupRoles(group?._id ?? '');
  const remove = useRemoveGroupMembers(group?._id ?? '');

  const handlePromote = () => {
    updateRoles.mutate({
      userIds: selected,
      role: 'admin',
    });
  };

  const handleDemote = () => {
    updateRoles.mutate({
      userIds: selected,
      role: 'member'
    });
  };

  const handleRemove = () => {
    remove.mutate(selected);
  };

  if (isLoading || !group) {
    return (
      <Container>
        <Title>Loading group...</Title>
      </Container>
    );
  }

  const members = group.users.map((member) => ({
    id: member.user._id,
    fullName: member.user.fullName,
    username: member.user.username,
    email: isAdmin ? member.user.email : maskEmail(member.user.email),
    role: member.role,
  }));

  return (
    <Container className={classes.container}>
      <Title className={classes.title}>{group.name}</Title>

      <Table striped withColumnBorders mt="md">
        <tbody>
          <tr>
            <td><strong>Name</strong></td>
            <td>{group.name}</td>
          </tr>
          <tr>
            <td><strong>Description</strong></td>
            <td>{group.description || 'No description'}</td>
          </tr>
          <tr>
            <td><strong>Code</strong></td>
            <td>
              {showCode ? group.code : '******'}
              <ActionIcon
                variant="subtle"
                size="sm"
                ml="xs"
                onClick={() => setShowCode((prev) => !prev)}
                aria-label={showCode ? 'Hide code' : 'Show code'}
              >
                {showCode ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </ActionIcon>
            </td>
          </tr>
          <tr>
            <td><strong>Total Members</strong></td>
            <td>{group.userCount}</td>
          </tr>
        </tbody>
      </Table>

      <Title order={3} mt="xl" mb="sm">
        Members
      </Title>

      {members.length === 0 ? (
        <Text c="dimmed">No members in this group yet.</Text>
      ) : (
        <>
          <Group className={classes.actions}>
            <Button
              onClick={handleRemove}
              disabled={!isAdmin || selected.length === 0}
              className={classes.remove}
              color="red"
            >
              Remove
            </Button>

            <Button
              onClick={handlePromote}
              disabled={!isAdmin || selected.length === 0}
              className={classes.promote}
            >
              Promote
            </Button>

            <Button
              onClick={handleDemote}
              disabled={!isAdmin || selected.length === 0}
              className={classes.demote}
            >
              Demote
            </Button>
          </Group>

          <TableSelection
            data={members}
            columns={[
              { key: 'username', header: 'Username' },
              { key: 'fullName', header: 'Full Name' },
              { key: 'email', header: 'Email' },
              { key: 'role', header: 'Role' },
            ]}
            selection={selected}
            onSelectionChange={setSelected}
            disableCheckbox={(row) => row.id === currentUserId}
          />
        </>
      )}
    </Container>
  );
};