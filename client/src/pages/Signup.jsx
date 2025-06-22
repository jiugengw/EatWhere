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
} from "@mantine/core";
import Footer from "../shared/components/footer";
import Loading from "../shared/UIelements/loading";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {

      const response = await axios.post(
        "http://localhost:8080/api/users/signup",
        {
          email,
          password,
          passwordConfirm: password,
          username:firstName,
          lastName,
        }
      );

      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (err) {
      console.log(err);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <Container size={420} my={40}>
        <Title style={{ textAlign: "center", marginBottom: "1rem" }}>
          Create an account
        </Title>

        <Text
          color="dimmed"
          size="sm"
          style={{ textAlign: "center", marginBottom: "1.5rem" }}
        >
          Already have an account?{" "}
          <Anchor size="sm" href="/login">
            Log in
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p="lg" radius="md">
          <form onSubmit={handlelogin}>
            <Stack>
              <TextInput
                label="First name"
                placeholder="Your first name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                required
              />
              <TextInput
                label="Last name"
                placeholder="Your last name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                required
              />
              <TextInput 
                label="Email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required 
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
              <Checkbox label="I agree to the terms and conditions" required />

              <Button
                type="submit"
                fullWidth
                mt="md"
                style={{ backgroundColor: "black", color: "white" }}
              >
                Sign up
              </Button>
              {errorMsg && (
                <Text color="red" size="sm">
                  {errorMsg}
                </Text>
              )}
            </Stack>
          </form>
        </Paper>
      </Container>
      <Footer />
    </>
  );
}

export default SignupPage;
