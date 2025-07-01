import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  Button,
  TextInput,
  Paper,
  Avatar,
  Divider,
  Table,
  Tabs,
  Card,
} from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { useState, type JSX } from 'react';

// Types
type Member = {
  id: number;
  name: string;
  username: string;
  role: string;
};

type HistoryEntry = {
  id: number;
  location: string;
  date: string;
};

export const EditGroupPage = (): JSX.Element => {
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: 'Alex Tan', username: 'alex123', role: 'Member' },
    { id: 2, name: 'Sarah Lee', username: 'sarahlee', role: 'Member' },
    { id: 3, name: 'David Lim', username: 'davidlim', role: 'Member' },
  ]);

  const [newMemberUsername, setNewMemberUsername] = useState<string>('');
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [recommendedCuisine, setRecommendedCuisine] = useState<string>('');

  const isOwner = true;

  const handleAddMember = () => {
    if (!newMemberUsername.trim()) return;
    const newId = members.length + 1;
    setMembers([
      ...members,
      {
        id: newId,
        name: newMemberUsername.split('@')[0],
        username: newMemberUsername,
        role: 'Member',
      },
    ]);
    setNewMemberUsername('');
  };

  const handleRemoveMember = (id: number) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  const handlePromoteMember = (id: number) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, role: 'Co-Owner' } : member
      )
    );
  };

  const diningHistory: HistoryEntry[] = [
    { id: 1, location: 'Sushi Place', date: '2025-06-01' },
    { id: 2, location: 'Burger Joint', date: '2025-05-30' },
    { id: 3, location: 'Pasta Palace', date: '2025-05-28' },
    { id: 4, location: 'Dim Sum Delight', date: '2025-05-26' },
    { id: 5, location: 'Taco Fiesta', date: '2025-05-25' },
  ];

  const cuisines: string[] = [
    'Japanese',
    'Italian',
    'Mexican',
    'Thai',
    'Indian',
  ];

  const handleRecommendFood = () => {
    const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
    setRecommendedCuisine(cuisine);
  };

  return (
    <>
      <Container size="md" my="xl">
        <Title
          order={2}
          align="center"
          mb="lg"
          style={{ color: '#222222', fontWeight: 700 }}
        >
          My Group
        </Title>

        <Text align="center" color="dimmed" mb="xl">
          Group Members
        </Text>

        <Stack spacing="md">
          {members.map((member) => (
            <Paper
              key={member.id}
              withBorder
              p="md"
              radius="md"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#e0e0e0' }}
            >
              <Group position="apart" align="center">
                <Group>
                  <Avatar color="gray" radius="xl">
                    <IconUser size={20} />
                  </Avatar>
                  <div>
                    <Text weight={500} style={{ color: '#222222' }}>
                      {member.name}{' '}
                      {member.role === 'Co-Owner' && (
                        <Text component="span" color="orange" size="sm">
                          (Co-Owner)
                        </Text>
                      )}
                    </Text>
                    <Text size="sm" color="dimmed">
                      {member.username}
                    </Text>
                  </div>
                </Group>

                {isOwner && (
                  <Group spacing="xs">
                    <Button
                      radius="xl"
                      size="xs"
                      style={{
                        backgroundColor: '#FF8C42',
                        color: 'white',
                        fontWeight: 500,
                        padding: '6px 14px',
                      }}
                      onClick={() => handlePromoteMember(member.id)}
                    >
                      Promote
                    </Button>

                    <Button
                      radius="xl"
                      size="xs"
                      style={{
                        backgroundColor: '#FF8C42',
                        color: 'white',
                        fontWeight: 500,
                        padding: '6px 14px',
                      }}
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remove
                    </Button>
                  </Group>
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
                  value={newMemberUsername}
                  onChange={(e) => setNewMemberUsername(e.currentTarget.value)}
                  style={{ flex: 1 }}
                />
                <Button
                  radius="xl"
                  style={{
                    backgroundColor: '#FF8C42',
                    color: 'white',
                    fontWeight: 600,
                    padding: '10px 20px',
                  }}
                  onClick={handleAddMember}
                >
                  Add Member
                </Button>
              </Group>
            </>
          )}
        </Stack>
      </Container>

      {/* Group History and Recommendation Tabs */}
      <Container size="md" my="xl">
        <Tabs color="#FF8C42" defaultValue="history">
          <Tabs.List grow>
            <Tabs.Tab value="history">Group History</Tabs.Tab>
            <Tabs.Tab value="recommend">Recommend Food for Group</Tabs.Tab>
          </Tabs.List>

          {/* Group Dining History Tab */}
          <Tabs.Panel value="history" pt="md">
            <Button
              radius="xl"
              style={{
                backgroundColor: '#FF8C42',
                color: 'white',
                fontWeight: 600,
                padding: '10px 20px',
                marginBottom: '1rem',
              }}
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Hide History' : 'Show Group Dining History'}
            </Button>

            {showHistory && (
              <Paper
                withBorder
                shadow="md"
                p="md"
                radius="md"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <Table highlightOnHover striped>
                  <thead style={{ backgroundColor: '#FF8C42', color: 'white' }}>
                    <tr>
                      <th>#</th>
                      <th>Location</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diningHistory.map((entry, index) => (
                      <tr key={entry.id}>
                        <td>{index + 1}</td>
                        <td>{entry.location}</td>
                        <td>{entry.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Paper>
            )}
          </Tabs.Panel>

          {/* Recommend Food Tab */}
          <Tabs.Panel value="recommend" pt="md">
            <Card
              withBorder
              shadow="md"
              p="lg"
              radius="md"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <Text size="md" mb="md" style={{ fontWeight: 600 }}>
                Suggest a Cuisine for the Group
              </Text>
              <Button
                radius="xl"
                style={{
                  backgroundColor: '#FF8C42',
                  color: 'white',
                  fontWeight: 600,
                  padding: '10px 24px',
                  marginBottom: '1rem',
                }}
                onClick={handleRecommendFood}
              >
                Get Recommendation
              </Button>

              {recommendedCuisine && (
                <Text size="lg" style={{ fontWeight: 600, color: '#222222' }}>
                  Recommended Cuisine: {recommendedCuisine}
                </Text>
              )}

              <Button
                component="a"
                href="/explore"
                variant="outline"
                radius="xl"
                style={{
                  color: '#FF8C42',
                  border: '1px solid #FF8C42',
                  marginTop: '1rem',
                  fontWeight: 600,
                }}
              >
                Explore More Options
              </Button>
            </Card>
          </Tabs.Panel>
        </Tabs>
      </Container>
    </>
  );
};
