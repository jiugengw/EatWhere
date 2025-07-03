import { useState } from 'react';
import {
  Container,
  Title,
  Table,
  ActionIcon,
  Text,
} from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useGroupDetails } from '@/hooks/useGroupDetails';
import { useParams } from '@tanstack/react-router';
import classes from './GroupDetails.module.css';
import { TableSelection } from '@/components/TableSelection/TableSelection';

export const GroupDetailPage = () => {
  const { id } = useParams({ from: '/group/$id/' });
  const { data, isLoading } = useGroupDetails(id);
  const [showCode, setShowCode] = useState(false);

  const group = data?.data?.Group;

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
    email: member.user.email,
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
        <TableSelection
          data={members}
          columns={[
            { key: 'fullName', header: 'Full Name' },
            { key: 'email', header: 'Email' },
            { key: 'role', header: 'Role' },
          ]}
        />
      )}
    </Container>
  );
};