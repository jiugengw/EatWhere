import {Container,Title,Text,Stack,Group,Button,TextInput,Paper,Avatar,Divider,} from '@mantine/core';
import { IconUser, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

interface Member {
  id: number;
  name: string;
  email: string;
}

export default function EditGroup() {
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Tan', email: 'charlie@example.com' },
  ]);

  const [newMemberEmail, setNewMemberEmail] = useState('');
  const isOwner = true; // toggle this to test owner vs non-owner view

  const handleAddMember = () => {
    if (!newMemberEmail.trim()) return;

    const newId = members.length + 1;
    setMembers([
      ...members,
      {
        id: newId,
        name: newMemberEmail.split('@')[0], // Simple name logic
        email: newMemberEmail,
      },
    ]);
    setNewMemberEmail('');
  };

  const handleRemoveMember = (id: number) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  return (
    <>
      <Navbar />
      <Container size="md" my="xl">
        <Title order={2} mb="md" align="center">
          My Group
        </Title>
        <Text align="center" color="dimmed" mb="xl">
          Group Members
        </Text>

        <Stack spacing="md">
          {members.map((member) => (
            <Paper withBorder p="md" radius="md" key={member.id}>
              <Group position="apart" align="center">
                <Group>
                  <Avatar color="gray" radius="xl">
                    <IconUser size={20} />
                  </Avatar>
                  <div>
                    <Text weight={500}>{member.name}</Text>
                    <Text size="sm" color="dimmed">
                      {member.email}
                    </Text>
                  </div>
                </Group>

                {isOwner && (
                  <Button
                    variant="subtle"
                    color="red"
                    size="xs"
                    onClick={() => handleRemoveMember(member.id)}
                    leftIcon={<IconX size={16} />}
                  >
                    Remove
                  </Button>
                )}
              </Group>
            </Paper>
          ))}

          {isOwner && (
            <>
              <Divider my="sm" />
              <Group align="flex-end">
                <TextInput
                  label="Add Member by Email"
                  placeholder="newmember@example.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.currentTarget.value)}
                  style={{ flex: 1 }}
                />
                <Button onClick={handleAddMember} color="black">
                  Add Member
                </Button>
              </Group>
            </>
          )}
        </Stack>
      </Container>
      <Footer />
    </>
  );
}
