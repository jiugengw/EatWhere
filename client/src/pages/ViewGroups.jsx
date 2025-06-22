import { Avatar, Button, Container, Group, Paper, Stack, Text, Title, Divider, Modal, TextInput, MultiSelect} from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import Footer from '../shared/components/footer';

function ViewGroupsPage() {
  const [createGroupOpened, setCreateGroupOpened] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [memberUsernames, setMemberUsernames] = useState([]);

  const [joinCode, setJoinCode] = useState('');

  const handleCreateGroup = () => {
    alert(`Group Name: ${groupName}\nMembers: ${memberUsernames.join(', ')}`);
    setGroupName('');
    setMemberUsernames([]);
    setCreateGroupOpened(false);
  };

  const handleJoinGroup = () => {
    alert(`Joining group with code: ${joinCode}`);
    setJoinCode('');
  };

  const groups = [
    {
      id: 1,
      name: 'Foodies United',
      isOwner: true,
      members: [
        { id: 1, name: 'Nathaniel Teo' },
        { id: 2, name: 'Alice Johnson' },
        { id: 3, name: 'Bob Smith' },
      ],
    },
    {
      id: 2,
      name: 'Dinner Club',
      isOwner: false,
      members: [
        { id: 4, name: 'Sarah Lee' },
        { id: 5, name: 'Michael Tan' },
        { id: 1, name: 'Nathaniel Teo' },
      ],
    },
  ];

  return (
    <>
      <Container size="md" my="xl">
        <Group position="apart" style={{ marginBottom: '1rem' }}>
          <Title order={2}>My Groups</Title>

          <Group>
            <TextInput
              placeholder="Enter group code"
              size="sm"
              style={{ width: 200 }}
              value={joinCode}
              onChange={(e) => setJoinCode(e.currentTarget.value)}
            />
            <Button
              variant="outline"
              color="black"
              size="sm"
              onClick={handleJoinGroup}
            >
              Join
            </Button>

            <Button
              style={{ backgroundColor: 'black', color: 'white' }}
              onClick={() => setCreateGroupOpened(true)}
            >
              Create Group
            </Button>
          </Group>
        </Group>

        <Stack spacing="xl">
          {groups.map((group) => (
            <Paper key={group.id} withBorder p="md" radius="md">
              <Group position="apart" style={{ marginBottom: '0.5rem' }}>
                <Text size="lg" weight={600}>
                  {group.name}
                </Text>
                {group.isOwner ? (
                  <Group>
                  <Button
                    variant="white"
                    style={{ color: 'black', textDecoration: 'underline' }}
                    size="xs"
                  >
                    View/Edit
                  </Button>
                  <Button
                    variant="white"
                    style={{ color: 'red', textDecoration: 'underline' }}
                    size="xs"
                  >
                    Delete
                  </Button>
                  </Group>
                ) : (
                  <Group>
                  <Button
                    variant="white"
                    style={{ color: 'black', textDecoration: 'underline' }}
                    size="xs"
                  >
                    View
                  </Button>
                  <Button
                    variant="white"
                    style={{ color: 'red', textDecoration: 'underline'}}
                    size="xs"
                  >
                    Leave
                  </Button>
                  </Group>
                )}
              </Group>

              <Divider style={{ margin: '0.75rem 0' }} />

              <Stack spacing="sm">
                {group.members.map((member) => (
                  <Group key={member.id}>
                    <Avatar radius="xl" size="sm" color="gray">
                      <IconUser size={14} />
                    </Avatar>
                    <Text>{member.name}</Text>
                  </Group>
                ))}
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Container>

      <Modal
        opened={createGroupOpened}
        onClose={() => setCreateGroupOpened(false)}
        title="Create New Group"
        centered
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
            placeholder="Enter Usernames"
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
          <Group position="right" style={{ marginTop: '1rem' }}>
            <Button
              onClick={handleCreateGroup}
              style={{ backgroundColor: 'black', color: 'white' }}
            >
              Create Group
            </Button>
          </Group>
        </Stack>
      </Modal>
            
      <Footer />
    </>
  );
}

export default ViewGroupsPage;
