import { useState } from 'react';
import {
  Container,
  Title,
  ActionIcon,
  Text,
  Group,
  Button,
  Paper,
  Badge,
  Code,
  SimpleGrid,
  Stack,
  Card,
  TextInput,
} from '@mantine/core';
import { IconChefHat, IconEye, IconEyeOff, IconSettings, IconUserPlus } from '@tabler/icons-react';
import { useGroupDetails } from '@/hooks/groups/useGroupDetails';
import { useParams } from '@tanstack/react-router';
import classes from './GroupDetails.module.css';
import { TableSelection } from '@/components/TableSelection/TableSelection';
import { maskEmail } from '@/utils/maskEmail';
import { useGroupRole } from '@/hooks/groups/useGroupRole';
import { useUpdateGroupRoles } from '@/hooks/groups/useUpdateGroupRoles';
import { useRemoveGroupMembers } from '@/hooks/groups/useRemoveGroupMembers';
import { useAuth } from '@/hooks/auth/useAuth';
import { Link } from '@tanstack/react-router';
import { useLeaveGroup } from '@/hooks/groups/useLeaveGroup';

export const GroupDetailPage = () => {
  const { auth } = useAuth();
  const currentUserId = auth?.id;
  const { id } = useParams({ from: '/_protected/group/$id/' });
  const { data, isLoading } = useGroupDetails(id);
  const [showCode, setShowCode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const group = data?.data?.group;
  const { isAdmin } = useGroupRole(group?.users ?? []);
  const updateRoles = useUpdateGroupRoles(group?._id ?? '');
  const remove = useRemoveGroupMembers(group?._id ?? '');
  const { handleLeaveGroup, isLoading: isLeavingGroup } = useLeaveGroup();

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

  const onLeaveClick = () => {
    if (group) {
      handleLeaveGroup(group._id, group.name, group.userCount, true);
    }
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
    joinedAt: new Date(member.joinedAt).toLocaleDateString(),
  }));

  return (
    <Container size="lg" className={classes.container}>
      <Paper withBorder shadow="sm" radius="md" p="lg" mb="xl">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title className={classes.title} order={1}>{group.name}</Title>
            <Text c="dimmed" mt="xs">
              {group.description || 'No description provided'}
            </Text>
            <Group gap="xs" mt="md">
              <Badge variant="light" color="blue">
                {group.userCount} {group.userCount === 1 ? 'member' : 'members'}
              </Badge>
              <Badge variant="light" color="gray">
                Created {new Date(group.createdAt).toLocaleDateString()}
              </Badge>
            </Group>
          </div>

          <Paper withBorder p="sm" radius="md">
            <Group gap="xs" align="center">
              <Text size="sm" fw={500}>Group Code:</Text>
              <Code>{showCode ? group.code : '******'}</Code>
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={() => setShowCode((prev) => !prev)}
                aria-label={showCode ? 'Hide code' : 'Show code'}
              >
                {showCode ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </ActionIcon>
            </Group>
          </Paper>
        </Group>
      </Paper>

      <SimpleGrid cols={{ base: 1, md: 10 }} spacing="xl">
        <div style={{ gridColumn: 'span 7' }}>
          <Title order={2} mb="lg">
            Members ({members.length})
          </Title>

          {members.length === 0 ? (
            <Paper withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
              <Text c="dimmed">No members in this group yet.</Text>
            </Paper>
          ) : (
            <Stack gap="md">
              {isAdmin && (
                <Paper withBorder p="md" radius="md">
                  <Text size="sm" fw={500} mb="sm">Admin Actions</Text>
                  <Group gap="sm">
                    <Button
                      onClick={handlePromote}
                      disabled={selected.length === 0}
                      size="xs"
                      color="green"
                      variant="light"
                    >
                      Promote ({selected.length})
                    </Button>

                    <Button
                      onClick={handleDemote}
                      disabled={selected.length === 0}
                      size="xs"
                      color="orange"
                      variant="light"
                    >
                      Demote ({selected.length})
                    </Button>

                    <Button
                      onClick={handleRemove}
                      disabled={selected.length === 0}
                      size="xs"
                      color="red"
                      variant="light"
                    >
                      Remove ({selected.length})
                    </Button>
                  </Group>
                </Paper>
              )}

              <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
                <TableSelection
                  data={members}
                  columns={[
                    { key: 'username', header: 'Username' },
                    { key: 'fullName', header: 'Full Name' },
                    { key: 'email', header: 'Email' },
                    {
                      key: 'role',
                      header: 'Role',
                      render: (row) => (
                        <Stack gap="xs" align="flex-start">
                          <Badge
                            variant="light"
                            color={row.role === 'admin' ? 'orange' : 'blue'}
                          >
                            {row.role}
                          </Badge>
                          <Badge variant="light" color="green" size="xs">
                            Member since {new Date(row.joinedAt).toLocaleDateString()}
                          </Badge>
                        </Stack>
                      )
                    },
                  ]}
                  selection={selected}
                  onSelectionChange={setSelected}
                  disableCheckbox={(row) => row.id === currentUserId}
                />
              </Paper>
            </Stack>
          )}
        </div>

        <div style={{ gridColumn: 'span 3' }}>
          <Title order={2} mb="lg">
            Group Actions
          </Title>

          <Stack gap="md">
            <Card withBorder shadow="sm" padding="lg" radius="md">
              <Group justify="space-between" align="flex-start">
                <div style={{ flex: 1 }}>
                  <Group gap="xs" mb="xs">
                    <IconChefHat size={20} color="#FF8C42" />
                    <Text fw={600}>Food Recommendations</Text>
                  </Group>
                  <Text size="sm" c="dimmed" mb="md">
                    Get personalized cuisine suggestions based on your group's preferences and dining history
                  </Text>
                  <Button
                    component={Link}
                    to={`/recommendations?type=group&groupId=${group._id}`}
                    fullWidth
                    style={{ backgroundColor: '#FF8C42' }}
                  >
                    View Group Recommendations
                  </Button>
                </div>
              </Group>
            </Card>
            <Card withBorder shadow="sm" padding="lg" radius="md">
              <Group gap="xs" mb="xs">
                <IconSettings size={20} color="#6c757d" />
                <Text fw={600}>Group Settings</Text>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                Manage group information and preferences
              </Text>
              <Stack gap="xs">
                <Button variant="light" fullWidth size="sm">
                  Edit Group Details
                </Button>
                <Button
                  variant="light"
                  color="red"
                  fullWidth
                  size="sm"
                  loading={isLeavingGroup}
                  onClick={onLeaveClick}
                >
                  Leave Group
                </Button>
              </Stack>
            </Card>
            <Card withBorder shadow="sm" padding="lg" radius="md">
              <Group gap="xs" mb="xs">
                <IconUserPlus size={20} color="#28a745" />
                <Text fw={600}>Invite Members</Text>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                Share the group code with friends to invite them
              </Text>
              <Group gap="xs">
                <TextInput
                  value={group.code}
                  readOnly
                  style={{ flex: 1 }}
                  size="sm"
                />
                <Button size="sm" variant="light">
                  Copy
                </Button>
              </Group>
            </Card>
          </Stack>
        </div>
      </SimpleGrid>
    </Container>
  );
};