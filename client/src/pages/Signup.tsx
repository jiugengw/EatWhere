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

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

import Footer from "../shared/components/footer";
import Loading from "../shared/UIelements/loading";
import useAxios from "../api/useApi";
import useAuth from "../shared/hooks/auth";
import { signupValidation } from "../shared/validationschemas";

interface SignupFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormInputs>({ mode: "onChange" });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const response = await useAxios.post("/users/signup", {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.firstName,
        email: data.email,
        password: data.password,
        passwordConfirm: data.password,
      });

      const user = response.data.data.User;
      const token = response.data.token;
      const firstName = user.firstName;
      const lastName = user.lastName;
      const fullName = user.fullName;
      const id = user.id;

      setAuth({
        id,
        fullName,
        firstName,
        lastName,
        token,
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
        <Title ta="center" mb="md">
          Create an account
        </Title>

        <Text ta="center" size="sm" mb="lg">
          Already have an account?{" "}
          <Anchor component={Link} to="/login">
            Log in
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p="lg" radius="md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <TextInput
                label="firstName"
                placeholder="Enter your first name"
                {...register("firstName", signupValidation.firstName)}
                error={errors.firstName?.message}
              />
              <TextInput
                label="lastName"
                placeholder="Enter your last name"
                {...register("lastName", signupValidation.lastName)}
                error={errors.lastName?.message}
              />
              <TextInput
                label="email"
                placeholder="Enter your email"
                {...register("email", signupValidation.email)}
                error={errors.email?.message}
              />
              <PasswordInput
                label="password"
                placeholder="Enter your password"
                {...register("password", signupValidation.password)}
                error={errors.password?.message}
              />

              <Checkbox label="I agree to the terms and conditions" required />

              <Button
                type="submit"
                fullWidth
                mt="md"
                disabled={!isValid}
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
