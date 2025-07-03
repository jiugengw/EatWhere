import { useForm } from '@mantine/form';
import {
  TextInput,
  Textarea,
  Button,
  Container,
  Paper,
  Title,
  Stack,
} from '@mantine/core';
import {
  CreateGroupSchema,
  type CreateGroupInput,
} from '@/shared/schemas/CreateGroupSchema';
import classes from './CreateGroup.module.css';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useCreateGroup } from '@/hooks/useCreateGroup';

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
    <Container size="sm" className={classes.container}>
      <Paper withBorder shadow="md" p="lg" radius="md" className={classes.card}>
        <Title order={2} className={classes.title}>
          Create a New Group
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Group Name"
              placeholder="Enter group name"
              withAsterisk
              {...form.getInputProps('name')}
            />

            <Textarea
              label="Description"
              placeholder="What is this group about?"
              minRows={3}
              autosize
              {...form.getInputProps('description')}
            />

            <Button type="submit" fullWidth loading={createGroup.isPending}>
              Create Group
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};
