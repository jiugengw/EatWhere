import { TextInput, PasswordInput, Paper, Title, Text, Container, Button, Stack, Checkbox, Anchor } from '@mantine/core';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

function SignupPage() {
  return (
    <>
      <Navbar />
      <Container size={420} my={40}>
        <Title style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Create an account
        </Title>

        <Text color="dimmed" size="sm" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Already have an account?{' '}
          <Anchor size="sm" href="#">
            Log in
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p="lg" radius="md">
          <form>
            <Stack>
              <TextInput label="First name" placeholder="Your first name" required />
              <TextInput label="Last name" placeholder="Your last name" required />
              <TextInput label="Email" placeholder="you@example.com" required />
              <PasswordInput label="Password" placeholder="Your password" required />
              <Checkbox label="I agree to the terms and conditions" required />

              <Button fullWidth mt="md" style={{ backgroundColor: 'black', color: 'white' }}>
                Sign up
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
      <Footer />
    </>
  );
}

export default SignupPage;
