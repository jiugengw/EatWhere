import { TextInput, PasswordInput, Paper, Title, Text, Container, Button, Stack, Anchor, Checkbox } from '@mantine/core';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

function Login() {
  return (
    <>
      <Navbar />
      <Container size={420} my={40}>
        <Title style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Welcome back
        </Title>

        <Text color="dimmed" size="sm" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Don't have an account?{' '}
          <Anchor size="sm" href="#">
            Sign up
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p="lg" radius="md">
          <form>
            <Stack>
              <TextInput label="Username" placeholder="Your username" required />
              <PasswordInput label="Password" placeholder="Your password" required />
              <Checkbox label="Remember me" required />
              <Button fullWidth mt="md" style={{ backgroundColor: 'black', color: 'white' }}>
                Log in
              </Button>
              <Anchor size="sm" href="#">
            Forget Password
            </Anchor>
            </Stack>
          </form>
        </Paper>
      </Container>
      <Footer />
    </>
  );
}

export default Login;
