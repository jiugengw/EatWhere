import { Container, Title, Text, Stack, Group, Button, TextInput, Paper, Avatar, Divider, Pagination, Table } from '@mantine/core';
import { IconUser, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import Navbar from '../shared/components/navbar';
import Footer from '../shared/components/footer';

function EditGroup() {
  const [members, setMembers] = useState([
    { id: 1, name: 'Alice Johnson', username: 'zxcvbnqwerty' },
    { id: 2, name: 'Bob Smith', username: 'pokeraddict' },
    { id: 3, name: 'Charlie Tan', username: 'redridinghood' },
  ]);

  const [newMemberusername, setNewMemberusername] = useState('');
  const isOwner = true;

  const handleAddMember = () => {
    if (!newMemberusername.trim()) return;

    const newId = members.length + 1;
    setMembers([
      ...members,
      {
        id: newId,
        name: newMemberusername.split('@')[0],
        username: newMemberusername,
      },
    ]);
    setNewMemberusername('');
  };

  const handleRemoveMember = (id) => {
    setMembers(members.filter((member) => member.id !== id));
  };

   const diningHistory = [
      { id: 1, location: 'Sushi Zanmai', date: '2025-06-01' },
      { id: 2, location: 'Burger Joint', date: '2025-05-30' },
      { id: 3, location: 'Pasta Palace', date: '2025-05-28' },
      { id: 4, location: 'Dim Sum Delight', date: '2025-05-26' },
      { id: 5, location: 'Taco Fiesta', date: '2025-05-25' },

    ];
  
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
  
    const totalPages = Math.ceil(diningHistory.length / itemsPerPage);
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = diningHistory.slice(startIndex, startIndex + itemsPerPage);
  
  return (
    <>
      <Container size="md" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Title order={2} style={{ marginBottom: '1rem', textAlign: 'center' }}>
          My Group
        </Title>
        <Text align="center" color="dimmed" style={{ marginBottom: '2rem' }}>
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
                    <Text style={{ fontWeight: 500 }}>{member.name}</Text>
                    <Text size="sm" color="dimmed">
                      {member.username}
                    </Text>
                  </div>
                </Group>

                {isOwner && (
                  <Button
                    variant="subtle"
                    color="red"
                    size="xs"
                    onClick={() => handleRemoveMember(member.id)}
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
                  label="Add Member by Username"
                  placeholder="Username"
                  value={newMemberusername}
                  onChange={(e) => setNewMemberusername(e.currentTarget.value)}
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
      <Container size="md" my="xl">
              <Text align="center" mb="lg">
                <b>Group History</b>
              </Text>
              <Paper withBorder shadow="sm" p="md" radius="md">
                <Table highlightOnHover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Location</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((entry, index) => (
                      <tr key={entry.id}>
                        <td>{startIndex + index + 1}</td>
                        <td>{entry.location}</td>
                        <td>{entry.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
      
                <Pagination
                  page={currentPage}
                  onChange={setCurrentPage}
                  total={totalPages}
                  position="right"
                  mt="md"
                />
              </Paper>
            </Container>
      <Footer />
    </>
  );
}

export default EditGroup;
