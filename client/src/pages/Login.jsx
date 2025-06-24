import { useForm } from "react-hook-form";
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
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginValidation } from "../shared/validationschemas";
import { AuthContext } from "../shared/context/auth-context";
import Footer from "../shared/components/footer";
import Loading from "../shared/UIelements/loading";



export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        {
          usernameOrEmail: data.usernameOrEmail,
          password: data.password,
        }
      );

      const userId = response.data.data.User._id;
      const name = response.data.data.User.name;
      console.log(name);
      const token = response.data.token;

      localStorage.setItem("token", token);
      auth.login(userId,name);

      navigate("/home");
    } catch (err) {
      console.error(err);
      setErrorMsg("Invalid username or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
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
          <Anchor size="sm" href="/">
            Sign up
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p="lg" radius="md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <TextInput
                label="Username or Email"
                placeholder="Your username or email"
                {...register(
                  "usernameOrEmail",
                  loginValidation.usernameOrEmail
                )}
                error={errors.usernameOrEmail?.message}
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                {...register("password", loginValidation.password)}
                error={errors.password?.message}
              />

              <Checkbox label="Remember me" {...register("rememberMe")} />

              <Button
                type="submit"
                fullWidth
                mt="md"
                disabled={!isValid}
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
