//mantine imports
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

//react imports
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

//own imports
import { loginValidation } from "../shared/validationschemas";
import useAxios from "../api/useApi";
import useAuth from "../shared/hooks/auth";
import Footer from "../shared/components/footer";
import Loading from "../shared/UIelements/loading";

interface LoginFormInputs {
  usernameOrEmail: string;
  password: string;
  rememberMe?: boolean;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormInputs>({ mode: "onChange" });

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const response = await useAxios.post("/users/login", {
        usernameOrEmail: data.usernameOrEmail,
        password: data.password,
      });

      const user = response.data.data.User;
      const token = response.data.token;
      const firstName = user.firstName;
      const lastName = user.lastName;
      const fullName = user.fullName;
      const email = user.email;
      const id = user.id;

      setAuth({
        id,
        fullName,
        firstName,
        lastName,
        token,
        email,
      });

      localStorage.setItem("token", token);
      navigate("/home");
    } catch (err: any) {
      
      console.error("Caught error:", err);
      if (!err?.response) {
        setErrorMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrorMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrorMsg("Unauthorized");
      } else {
        setErrorMsg("Incorrect Username or password");
      }
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
          <Anchor component={Link} to="/">
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
