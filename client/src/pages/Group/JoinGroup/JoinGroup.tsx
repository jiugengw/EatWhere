import { Button, Container, Paper, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useJoinGroup } from '@/hooks/useJoinGroup';
import type { JoinGroupInput } from '@/shared/schemas/JoinGroupSchema';
import classes from './JoinGroup.module.css';

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
    joinGroup(values);
  };

  return (
    <Container size="xs" className={classes.container}>
      <Paper withBorder shadow="sm" radius="md" p="lg">
        <Title order={3} mb="sm" className={classes.title}>
          Join a Group
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Group Code"
            placeholder="Enter 6-character code"
            {...form.getInputProps('code')}
          />

          <Button type="submit" mt="md" fullWidth loading={isPending}>
            Join Group
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
