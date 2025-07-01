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
import type { JSX } from 'react';
import classes from './Signup.module.css';
import { Link } from '@tanstack/react-router';
import { SignupSchema, type SignupInput } from '@/shared/schemas/SignupSchema';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useSignup } from '@/hooks/useSignup';
import { Loader } from '@mantine/core';

export const SignupPage = (): JSX.Element => {
  const form = useForm<SignupInput>({
    validate: zodResolver(SignupSchema),
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
    validateInputOnBlur: true,
  });

  const signup = useSignup();

  const handleSubmit = (
    values: SignupInput
  ): void => {
    signup.mutate(values);
  };

  return (
    <>
    {signup.status === 'pending' && <Loader/>}
      <Container size="xs" my="xl">
        <Title order={2} className={classes.title}>
          Create an Account
        </Title>
        <Text className={classes.subtitle}>
          Already have an account?{' '}
          <Link to="/login" className={classes.link}>
            Log in
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
                label="Username"
                placeholder="Your username"
                {...form.getInputProps('username')}
                required
                classNames={{
                  label: classes.label,
                  input: classes.input,
                }}
              />

              <TextInput
                label="First Name"
                placeholder="Your first name"
                {...form.getInputProps('firstName')}
                required
                classNames={{
                  label: classes.label,
                  input: classes.input,
                }}
              />

              <TextInput
                label="Last Name"
                placeholder="Your last name"
                {...form.getInputProps('lastName')}
                required
                classNames={{
                  label: classes.label,
                  input: classes.input,
                }}
              />

              <TextInput
                label="Email"
                placeholder="you@example.com"
                {...form.getInputProps('email')}
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

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                {...form.getInputProps('passwordConfirm')}
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
                Sign Up
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </>
  );
};
