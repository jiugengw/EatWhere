import { Avatar, Button, Container, Group, Paper, Stack, Text, Title, Divider, Modal, TextInput, MultiSelect } from '@mantine/core';
import { IconUser, IconPencil, IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

function ViewGroupsPage() {
  const [createGroupOpened, setCreateGroupOpened] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [memberEmails, setMemberEmails] = useState([]);

  const handleCreateGroup = () => {
    alert(`Group Name: ${groupName}\nMembers: ${memberEmails.join(', ')}`);
    setGroupName('');
    setMemberEmails([]);
    setCreateGroupOpened(false);
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
      <Navbar />
      <Container size="md" my="xl">
        <Group position="apart" style={{ marginBottom: '1rem' }}>
          <Title order={2}>My Groups</Title>
          <Button
            leftIcon={<IconPlus size={18} />}
            style={{ backgroundColor: 'black', color: 'white' }}
            onClick={() => setCreateGroupOpened(true)}
          >
            Create Group
          </Button>
        </Group>

        <Stack spacing="xl">
          {groups.map((group) => (
            <Paper key={group.id} withBorder p="md" radius="md">
              <Group position="apart" style={{ marginBottom: '0.5rem' }}>
                <Text size="lg" weight={600}>
                  {group.name}
                </Text>
                {group.isOwner && (
                  <Button
                    variant="light"
                    style={{ color: 'black' }}
                    size="xs"
                    leftIcon={<IconPencil size={16} />}
                  >
                    Edit
                  </Button>
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
            label="Member Emails"
            placeholder="Enter emails"
            data={[]}
            searchable
            creatable
            getCreateLabel={(query) => `+ Add "${query}"`}
            onCreate={(query) => {
              setMemberEmails((current) => [...current, query]);
              return query;
            }}
            value={memberEmails}
            onChange={setMemberEmails}
          />
          <Group position="right" style={{ marginTop: '1rem' }}>
            <Button onClick={handleCreateGroup} style={{ backgroundColor: 'black', color: 'white' }}>
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
