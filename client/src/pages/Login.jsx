import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Stack,
  Anchor,
  Checkbox,
} from "@mantine/core";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setpassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data);
        const firstname = data.data.user.firstName;
        localStorage.setItem("name", firstname);

        navigate("/home");
      } else {
        setErrorMsg(data.message || "Invalid login");
      }
    } catch (err) {
      console.log(err);
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <Container size={420} my={40}>
        <Title style={{ textAlign: "center", marginBottom: "1rem" }}>
          Welcome back
        </Title>

        <Text
          color="dimmed"
          size="sm"
          style={{ textAlign: "center", marginBottom: "1.5rem" }}
        >
          Don't have an account?{" "}
          <Anchor size="sm" href="#">
            Sign up
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p="lg" radius="md">
          <form onSubmit={handlelogin}>
            <Stack>
              <TextInput
                label="Username"
                placeholder="Your username"
                value={usernameOrEmail}
                onChange={(e) => {
                  setUsernameOrEmail(e.target.value);
                }}
                required
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                value={password}
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                required
              />
              <Checkbox label="Remember me" />
              <Button
                type="submit"
                fullWidth
                mt="md"
                style={{ backgroundColor: "black", color: "white" }}
              >
                Log in
              </Button>
              {errorMsg && (
                <Text color="red" size="sm">
                  {errorMsg}
                </Text>
              )}
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
