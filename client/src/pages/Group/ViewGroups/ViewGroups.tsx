import {
  Avatar,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Modal,
  TextInput,
  MultiSelect,
  Box,
} from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { useState, type JSX } from 'react';

type GroupType = {
  id: number;
  name: string;
  isOwner: boolean;
  membersCount: number;
  groupType: string;
};

export const ViewGroupsPage = (): JSX.Element => {
  const [createGroupOpened, setCreateGroupOpened] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>('');
  const [memberUsernames, setMemberUsernames] = useState<string[]>([]);
  const [joinCode, setJoinCode] = useState<string>('');

  const handleCreateGroup = (): void => {
    if (!groupName.trim()) {
      alert('Please enter a valid group name.');
      return;
    }
    console.log('Create Group:', { groupName, memberUsernames });
    setGroupName('');
    setMemberUsernames([]);
    setCreateGroupOpened(false);
  };

  const handleJoinGroup = (): void => {
    if (!joinCode.trim()) {
      alert('Please enter a valid group code.');
      return;
    }
    console.log('Join Group with code:', joinCode);
    setJoinCode('');
  };

  const groups: GroupType[] = [
    {
      id: 1,
      name: 'Foodies United',
      isOwner: true,
      membersCount: 150,
      groupType: 'Public',
    },
    {
      id: 2,
      name: 'Dinner Club',
      isOwner: false,
      membersCount: 85,
      groupType: 'Private',
    },
  ];

  return (
    <>
      <Container size="lg" my="xl">
        <Title order={2} mb="lg" style={{ color: '#222222', fontWeight: 700 }}>
          My Groups
        </Title>

        {/* Quick Group Actions */}
        <Paper
          withBorder
          shadow="xs"
          radius="md"
          p="md"
          mb="lg"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#e0e0e0' }}
        >
          <Stack spacing="md">
            <Title order={4} style={{ color: '#222222', fontWeight: 600 }}>
              Quick Group Actions
            </Title>

            <Group position="apart" spacing="md" align="center" noWrap>
              {/* Join Group */}
              <Group spacing="xs" align="flex-end" noWrap>
                <TextInput
                  placeholder="Enter group code"
                  size="sm"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.currentTarget.value)}
                  style={{ width: 220 }}
                />
                <Button
                  radius="xl"
                  size="sm"
                  variant="outline"
                  style={{
                    color: '#FF8C42',
                    borderColor: '#FF8C42',
                    fontWeight: 500,
                  }}
                  onClick={handleJoinGroup}
                >
                  Join
                </Button>
              </Group>

              {/* Create Group */}
              <Group spacing="xs" align="center" noWrap>
                <Button
                  radius="xl"
                  size="sm"
                  style={{
                    backgroundColor: '#FF8C42',
                    color: 'white',
                    fontWeight: 600,
                  }}
                  onClick={() => setCreateGroupOpened(true)}
                >
                  Create New Group
                </Button>
                <Text size="xs" color="dimmed">
                  Tip: Create a group and invite friends
                </Text>
              </Group>
            </Group>
          </Stack>
        </Paper>

        {/* Group List */}
        <Stack spacing="md">
          {groups.map((group) => (
            <Paper
              key={group.id}
              shadow="md"
              radius="md"
              p="md"
              withBorder
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              <Group noWrap spacing="md" style={{ flex: 1, minWidth: 0 }}>
                <Avatar radius="md" size="lg" color="gray">
                  <IconUser size={20} />
                </Avatar>
                <Box style={{ minWidth: 0 }}>
                  <Text
                    size="md"
                    weight={600}
                    style={{
                      color: '#222222',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {group.name}
                  </Text>
                  <Text size="xs" color="dimmed">
                    {group.groupType} Group · {group.membersCount} members
                  </Text>
                </Box>
              </Group>

              <Group spacing="xs" mt="sm" style={{ flexWrap: 'nowrap' }}>
                <Button
                  size="xs"
                  radius="xl"
                  variant="outline"
                  style={{
                    color: '#333333',
                    borderColor: '#333333',
                    fontWeight: 500,
                  }}
                >
                  View
                </Button>
                {group.isOwner ? (
                  <Button
                    size="xs"
                    radius="xl"
                    variant="subtle"
                    style={{ color: 'red', fontWeight: 500 }}
                  >
                    Delete
                  </Button>
                ) : (
                  <Button
                    size="xs"
                    radius="xl"
                    variant="subtle"
                    style={{ color: 'red', fontWeight: 500 }}
                  >
                    Leave
                  </Button>
                )}
              </Group>
            </Paper>
          ))}
        </Stack>
      </Container>

      {/* Create Group Modal */}
      <Modal
        opened={createGroupOpened}
        onClose={() => setCreateGroupOpened(false)}
        title="Create New Group"
        centered
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <Stack spacing="md">
          <TextInput
            label="Group Name"
            placeholder="e.g. Lunch Squad"
            value={groupName}
            onChange={(e) => setGroupName(e.currentTarget.value)}
            required
          />
          <MultiSelect
            label="Member Usernames"
            placeholder="Enter usernames"
            data={[]}
            searchable
            creatable
            getCreateLabel={(query) => `+ Add "${query}"`}
            onCreate={(query) => {
              setMemberUsernames((current) => [...current, query]);
              return query;
            }}
            value={memberUsernames}
            onChange={setMemberUsernames}
          />
          <Group position="right" mt="md">
            <Button
              radius="xl"
              style={{
                backgroundColor: '#FF8C42',
                color: 'white',
                fontWeight: 600,
              }}
              onClick={handleCreateGroup}
            >
              Create Group
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
