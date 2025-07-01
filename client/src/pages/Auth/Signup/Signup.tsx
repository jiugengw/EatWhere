import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Stack,
  Checkbox,
  Anchor,
} from '@mantine/core';
import type { JSX } from 'react';

export const SignupPage = (): JSX.Element => {
  return (
    <>
      <Container size="xs" my="xl">
        <Title
          order={2}
          style={{
            textAlign: 'center',
            marginBottom: '1rem',
            color: '#222222',
            fontWeight: 700,
            letterSpacing: '-0.5px',
          }}
        >
          Create an Account
        </Title>

        <Text
          size="sm"
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            color: '#555555',
          }}
        >
          Already have an account?{' '}
          <Anchor
            href="#"
            style={{
              color: '#FF8C42',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Log in
          </Anchor>
        </Text>

        <Paper
          withBorder
          shadow="md"
          radius="lg"
          p="xl"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#e0e0e0',
          }}
        >
          <form>
            <Stack spacing="md">
              <TextInput
                label="First Name"
                placeholder="Your first name"
                required
                styles={{
                  label: { color: '#222222', fontWeight: 500 },
                  input: { backgroundColor: '#F9F9F9' },
                }}
              />

              <TextInput
                label="Last Name"
                placeholder="Your last name"
                required
                styles={{
                  label: { color: '#222222', fontWeight: 500 },
                  input: { backgroundColor: '#F9F9F9' },
                }}
              />

              <TextInput
                label="Email"
                placeholder="you@example.com"
                required
                styles={{
                  label: { color: '#222222', fontWeight: 500 },
                  input: { backgroundColor: '#F9F9F9' },
                }}
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                styles={{
                  label: { color: '#222222', fontWeight: 500 },
                  input: { backgroundColor: '#F9F9F9' },
                }}
              />

              <Checkbox
                label="I agree to the terms and conditions"
                required
                styles={{
                  label: { color: '#555555', fontSize: '0.9rem' },
                }}
              />

              <Button
                fullWidth
                size="md"
                radius="xl"
                style={{
                  backgroundColor: '#FF8C42',
                  color: 'white',
                  fontWeight: 600,
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#e07b30')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = '#FF8C42')
                }
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
