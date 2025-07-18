import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Stack,
} from '@mantine/core';
import classes from './Login.module.css';
import { Link } from '@tanstack/react-router';
import { LoginSchema, type LoginInput } from '@/shared/schemas/LoginSchema';
import { useLogin } from '@/hooks/auth/useLogin';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { Loading } from '@/UIelements/loading';

export const LoginPage = () => {
  const form = useForm<LoginInput>({
    validate: zodResolver(LoginSchema),
    initialValues: {
      usernameOrEmail: '',
      password: '',
    },
    validateInputOnBlur: true,
  });

  
  const login = useLogin();

  const handleSubmit = (values: LoginInput): void => {
    login.mutate(values);
  };
  return (
    <>
    {login.status === 'pending' && <Loading/>}
      <Container size="xs" my="xl">
        <Title order={2} className={classes.title}>
          Welcome Back
        </Title>

        <Text size="sm" className={classes.subtitle}>
          Don’t have an account?{' '}
          <Link to="/signup" className={classes.link}>
            Sign up
          </Link>
        </Text>

        <Paper
          withBorder
          shadow="md"
          radius="lg"
          p="xl"
          className={classes.formWrapper}
        >
          <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
            <Stack gap="md">
              <TextInput
                label="Username/Email"
                placeholder="Your username or email"
                {...form.getInputProps('usernameOrEmail')}
                required
                classNames={{
                  label: classes.label,
                  input: classes.input,
                }}
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                {...form.getInputProps('password')}
                required
                classNames={{
                  label: classes.label,
                  input: classes.input,
                }}
              />

              <Button
                type="submit"
                fullWidth
                size="md"
                radius="xl"
                className={classes.button}
              >
                Log In
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </>
  );
};
