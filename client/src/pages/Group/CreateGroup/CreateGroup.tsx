import { useForm } from '@mantine/form';
import {
  TextInput,
  Textarea,
  Button,
  Container,
  Paper,
  Title,
  Stack,
  Text,
  SimpleGrid,
  Group,
  Image,
  Grid,
  Divider,
} from '@mantine/core';
import {
  CreateGroupSchema,
  type CreateGroupInput,
} from '@/shared/schemas/CreateGroupSchema';
import classes from './CreateGroup.module.css';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useCreateGroup } from '@/hooks/groups/useCreateGroup';
import { IconChefHat, IconHistory, IconPlus, IconSettings, IconUserPlus, IconUsers, IconUsersGroup } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

export const CreateGroupPage = () => {
  const form = useForm<CreateGroupInput>({
    validate: zodResolver(CreateGroupSchema),
    initialValues: {
      name: '',
      description: '',
    },
    validateInputOnBlur: true,
  });

  const createGroup = useCreateGroup();

  const handleSubmit = (values: CreateGroupInput): void => {
    createGroup.mutate(values);
  };

  return (
    <Container size="xl" className={classes.container}>
      <Paper withBorder shadow="lg" radius="lg" className={classes.mainCard}>
        <Grid gutter={0} style={{ minHeight: '600px' }}>
          <Grid.Col span={{ base: 12, md: 6 }} className={classes.imageSection}>
            <div className={classes.imageContainer}>
              <Image
                src="/images/groups/groupDiningTgt.jpg"
                alt="Friends dining together"
                className={classes.heroImage}
                fit="cover"
              />
              <div className={classes.imageOverlay}>
                <Stack gap="md" align="center">
                  <Title order={1} c="white" ta="center" className={classes.overlayTitle}>
                    Create Your Group
                  </Title>
                </Stack>
              </div>
            </div>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }} className={classes.formSection}>
            <div className={classes.formContainer}>
              <Stack gap="xl" style={{ height: '100%', justifyContent: 'center' }}>
                <div>
                  <Group gap="xs" mb="lg" justify="center">
                    <IconUsersGroup size={32} color="#FF8C42" />
                    <Title order={2} className={classes.formTitle}>
                      Get Started
                    </Title>
                  </Group>
                </div>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Stack gap="lg">
                    <div>
                      <Text size="sm" fw={500} mb="xs" className={classes.label}>
                        Group Name *
                      </Text>
                      <TextInput
                        placeholder="e.g., Food Explorers, Weekend Foodies"
                        size="lg"
                        className={classes.nameInput}
                        {...form.getInputProps('name')}
                      />
                      <Text size="xs" c="dimmed" mt="xs">
                        Choose a memorable name that represents your group
                      </Text>
                    </div>

                    <div>
                      <Text size="sm" fw={500} mb="xs" className={classes.label}>
                        Description
                      </Text>
                      <Textarea
                        placeholder="Tell us more about your group!" 
                        minRows={4}
                        autosize
                        maxRows={6}
                        size="lg"
                        className={classes.descriptionInput}
                        {...form.getInputProps('description')}
                      />
                      <Text size="xs" c="dimmed" mt="xs">
                        Help members understand what your group is about (optional)
                      </Text>
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      fullWidth 
                      loading={createGroup.isPending}
                      className={classes.createButton}
                      leftSection={<IconPlus size={20} />}
                    >
                      {createGroup.isPending ? 'Creating Group...' : 'Create Group'}
                    </Button>

                    <Divider label="Or" labelPosition="center" />

                    <Button 
                      component={Link} 
                      to="/group/join" 
                      variant="light"
                      size="lg"
                      fullWidth
                      leftSection={<IconUserPlus size={18} />}
                    >
                      Join Existing Group
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </div>
          </Grid.Col>
        </Grid>
      </Paper>

      <Title order={3} ta="center" mt="xl" mb="lg" className={classes.benefitsTitle}>
        What You'll Get
      </Title>
      
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
        <Paper p="lg" radius="md" className={classes.benefitCard}>
          <Stack align="center" gap="md">
            <div className={classes.benefitIcon}>
              <IconChefHat size={28} color="#FF8C42" />
            </div>
            <Text size="sm" fw={600} ta="center">Smart Recommendations</Text>
            <Text size="xs" c="dimmed" ta="center">
              Get cuisine suggestions that match your group's collective preferences
            </Text>
          </Stack>
        </Paper>

        <Paper p="lg" radius="md" className={classes.benefitCard}>
          <Stack align="center" gap="md">
            <div className={classes.benefitIcon}>
              <IconUsers size={28} color="#28a745" />
            </div>
            <Text size="sm" fw={600} ta="center">Easy Invites</Text>
            <Text size="xs" c="dimmed" ta="center">
              Share a simple 6-character code to invite friends instantly
            </Text>
          </Stack>
        </Paper>

        <Paper p="lg" radius="md" className={classes.benefitCard}>
          <Stack align="center" gap="md">
            <div className={classes.benefitIcon}>
              <IconHistory size={28} color="#6f42c1" />
            </div>
            <Text size="sm" fw={600} ta="center">Track History</Text>
            <Text size="xs" c="dimmed" ta="center">
              Keep a record of where you've dined together as a group
            </Text>
          </Stack>
        </Paper>

        <Paper p="lg" radius="md" className={classes.benefitCard}>
          <Stack align="center" gap="md">
            <div className={classes.benefitIcon}>
              <IconSettings size={28} color="#dc3545" />
            </div>
            <Text size="sm" fw={600} ta="center">Group Management</Text>
            <Text size="xs" c="dimmed" ta="center">
              Manage members, roles, and group preferences easily
            </Text>
          </Stack>
        </Paper>
      </SimpleGrid>

      <Paper withBorder p="lg" radius="md" mt="xl" className={classes.ctaCard}>
        <Group justify="space-between" align="center">
          <div>
            <Text fw={600} mb="xs">Already have a group code?</Text>
            <Text size="sm" c="dimmed">
              Join an existing group instead of creating a new one
            </Text>
          </div>
          <Button 
            component={Link} 
            to="/group/join" 
            variant="light"
            size="md"
            leftSection={<IconUserPlus size={18} />}
          >
            Join Group
          </Button>
        </Group>
      </Paper>
    </Container>
  );
};