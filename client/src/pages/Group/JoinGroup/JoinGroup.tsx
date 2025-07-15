import { Button, Container, Group, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useJoinGroup } from '@/hooks/groups/useJoinGroup';
import type { JoinGroupInput } from '@/shared/schemas/JoinGroupSchema';
import classes from './JoinGroup.module.css';
import { IconInfoCircle, IconPlus, IconUserPlus, IconUsers } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

export const JoinGroupPage = () => {
  const form = useForm<JoinGroupInput>({
    initialValues: { code: '' },
    validate: {
      code: (value: string) =>
        value.trim().length !== 6
          ? 'Code must be exactly 6 characters'
          : /^[a-zA-Z0-9]+$/.test(value)
            ? null
            : 'Code must be alphanumeric',
    },
  });

  const { mutate: joinGroup, isPending } = useJoinGroup();

  const handleSubmit = (values: JoinGroupInput) => {
    joinGroup(values.code);
  };

  return (
    <Container size="sm" className={classes.container}>
      <Stack align="center" mb="xl">
        <div className={classes.iconWrapper}>
          <IconUsers size={48} color="#FF8C42" />
        </div>
        <Title order={1} ta="center" className={classes.mainTitle}>
          Join a Group
        </Title>
        <Text ta="center" c="dimmed" size="lg">
          Enter a group code to join your friends and discover amazing food together
        </Text>
      </Stack>

      <Paper withBorder shadow="lg" radius="lg" p="xl" className={classes.formCard}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            <div>
              <Text size="sm" fw={500} mb="xs" className={classes.label}>
                Group Code
              </Text>
              <TextInput
                placeholder="Enter 6-character code"
                size="lg"
                className={classes.codeInput}
                styles={{
                  input: {
                    textAlign: 'center',
                    letterSpacing: '0.2em',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                  }
                }}
                maxLength={6}
                {...form.getInputProps('code')}
              />
              <Text size="xs" c="dimmed" ta="center" mt="xs">
                Ask your group admin for this code
              </Text>
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={isPending}
              className={classes.joinButton}
              leftSection={<IconUserPlus size={20} />}
            >
              {isPending ? 'Joining...' : 'Join Group'}
            </Button>
          </Stack>
        </form>
      </Paper>

      <Paper withBorder radius="md" p="md" mt="xl" className={classes.helpCard}>
        <Stack gap="sm">
          <Group gap="xs" justify="center">
            <IconInfoCircle size={16} color="#6c757d" />
            <Text size="sm" fw={500}>Need help?</Text>
          </Group>
          <Text size="xs" ta="center" c="dimmed">
            Group codes are 6-character alphanumeric strings shared by group admins.
            If you don't have a code, ask a friend to invite you or create your own group.
          </Text>
          <Group justify="center" mt="md">
            <Button
              component={Link}
              to="/group/create"
              variant="light"
              size="sm"
              leftSection={<IconPlus size={16} />}
            >
              Create New Group
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
};