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
import { useForm } from "react-hook-form";
import { signupValidation } from "../shared/validationschemas";

function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/signup",
        {
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.firstName,
          email: data.email,
          password: data.password,
          passwordConfirm: data.password,
        }
      );

      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (err) {
      console.log(err);
      setErrorMsg("Signup failed. Check your inputs.");
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
          <Anchor size="sm" href="/login">
            Log in
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p="lg" radius="md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <TextInput
                label="firstName"
                placeholder="Enter your first name"
                {...register(
                  "firstName",
                  signupValidation.firstName
                )}
                error={errors.firstName?.message}
              />
              <TextInput
                label="lastName"
                placeholder="Enter your last name"
                {...register(
                  "lastName",
                  signupValidation.lastName
                )}
                error={errors.lastName?.message}
              />
              <TextInput
                label="email"
                placeholder="Enter your email"
                {...register(
                  "email",
                  signupValidation.email
                )}
                error={errors.email?.message}
              />
              <PasswordInput
                label="password"
                placeholder="Enter your password"
                {...register(
                  "password",
                  signupValidation.password
                )}
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

export default SignupPage;
