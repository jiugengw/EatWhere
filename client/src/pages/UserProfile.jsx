import { Avatar, Button, Container, Grid, Paper, Stack, Text, Textarea, TextInput, Title, Group, PasswordInput, Tabs } from '@mantine/core';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

function ProfilePage() {
  return (
    <>
      <Navbar />
      <Container size="lg" my="xl">
        <Title order={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>
          User Profile
        </Title>

        <Grid gutter="xl">
          <Grid.Col span={12} md={4}>
            <Paper withBorder shadow="sm" p="xl" radius="md" style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                radius={120}
                color="black"
                style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: '1rem' }}
              >
                NT
              </Avatar>
              <Title order={4} style={{ marginBottom: '0.5rem' }}>
                Nathaniel Teo Kukubird
              </Title>
              <Text color="dimmed" size="sm" style={{ marginBottom: '0.75rem' }}>
                NathanielTeo@kukubird.com
              </Text>
              <Text size="sm" style={{ marginBottom: '0.5rem' }}>
                I like guys
              </Text>
            </Paper>
          </Grid.Col>

          <Grid.Col span={12} md={8}>
            <Paper shadow="sm" p="xl" radius="md" withBorder>
              <Tabs defaultValue="profile">
                <Tabs.List grow>
                  <Tabs.Tab value="profile">Profile Details</Tabs.Tab>
                  <Tabs.Tab value="password">Change Password</Tabs.Tab>
                  <Tabs.Tab value="preferences">Update Preferences</Tabs.Tab>
                  <Tabs.Tab value="groups">View Groups</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="profile" style={{ paddingTop: '1rem' }}>
                  <Stack spacing="md">
                    <TextInput label="First name" placeholder="Nathaniel" required />
                    <TextInput label="Last name" placeholder="Teo" required />
                    <TextInput label="Email" placeholder="NathanielTeo@kukubird.com" required type="email" />
                    <Textarea label="Bio" placeholder="I like guys" minRows={4} />
                    <Group position="right" style={{ marginTop: '1rem' }}>
                      <Button type="submit" style={{ backgroundColor: 'black', color: 'white' }}>
                        Save Changes
                      </Button>
                    </Group>
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="password" style={{ paddingTop: '1rem' }}>
                  <Stack spacing="md">
                    <PasswordInput label="Old Password" placeholder="Enter your old password" />
                    <PasswordInput label="New Password" placeholder="Enter new password" />
                    <PasswordInput label="Confirm New Password" placeholder="Confirm new password" />
                    <Group position="right" style={{ marginTop: '1rem' }}>
                      <Button type="submit" style={{ backgroundColor: 'black', color: 'white' }}>
                        Update Password
                      </Button>
                    </Group>
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="preferences" style={{ paddingTop: '1rem' }}>
                  <Stack spacing="md">
                    <TextInput label="Cuisine Preferences" placeholder="e.g., Japanese, Italian" />
                    <Group position="right" style={{ marginTop: '1rem' }}>
                      <Button type="submit" style={{ backgroundColor: 'black', color: 'white' }}>
                        Save Preferences
                      </Button>
                    </Group>
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="groups" style={{ paddingTop: '1rem' }}>
                  <Text>You are currently part of these groups:</Text>
                  <Stack spacing="sm" style={{ marginTop: '0.75rem' }}>
                    <Paper withBorder p="md" radius="md">435</Paper>
                    <Paper withBorder p="md" radius="md">KIll MYSELF</Paper>
                  </Stack>
                </Tabs.Panel>
              </Tabs>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ProfilePage;
