import {
  Avatar,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  PasswordInput,
  Box,
} from "@mantine/core";
import { useState } from "react";
import type { JSX } from "react";
import { useForm } from "@mantine/form";
import { useUserProfile } from "@/api/useUserProfile";
import { useUpdateUserProfile } from "@/hooks/useUpdateUserProfile";
import { useAuth } from "@/hooks/useAuth";

export const ProfilePage = (): JSX.Element => {
  const { data } = useUserProfile();
  const { auth } = useAuth();
  const updateProfile = useUpdateUserProfile();
  const isPending = updateProfile.isPending || false;

  const user = data?.data?.User ?? {};
  // console.log(user);
  const form = useForm({
    initialValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
    },
  });

  const [activeTab, setActiveTab] = useState<
    "profile" | "password" | "preferences"
  >("profile");

  const handleSubmit = (values: typeof form.values) => {
    updateProfile.mutate(values);
  };

  const renderContent = (): JSX.Element | null => {
    switch (activeTab) {
      case "profile":
        return (
          <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
            <Stack spacing="md">
              <TextInput
                label="First Name"
                styles={{
                  label: { color: "#222222", fontWeight: 500 },
                  input: { backgroundColor: "#F9F9F9" },
                }}
                {...form.getInputProps("firstName")}
              />
              <TextInput
                label="Last Name"
                styles={{
                  label: { color: "#222222", fontWeight: 500 },
                  input: { backgroundColor: "#F9F9F9" },
                }}
                {...form.getInputProps("lastName")}
              />
              <TextInput
                label="Email"
                type="email"
                styles={{
                  label: { color: "#222222", fontWeight: 500 },
                  input: { backgroundColor: "#F9F9F9" },
                }}
                {...form.getInputProps("email")}
              />
              <Group position="right" mt="md">
                <Button
                  radius="xl"
                  style={{
                    backgroundColor: "#FF8C42",
                    color: "white",
                    fontWeight: 600,
                  }}
                  loading={isPending}
                  type="submit"
                >
                  Save Profile
                </Button>
              </Group>
            </Stack>
          </form>
        );

      case "password":
        return (
          <Stack spacing="md">
            <PasswordInput
              label="Current Password"
              placeholder="Enter current password"
              styles={{
                label: { color: "#222222", fontWeight: 500 },
                input: { backgroundColor: "#F9F9F9" },
              }}
            />
            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              styles={{
                label: { color: "#222222", fontWeight: 500 },
                input: { backgroundColor: "#F9F9F9" },
              }}
            />
            <PasswordInput
              label="Confirm New Password"
              placeholder="Re-enter new password"
              styles={{
                label: { color: "#222222", fontWeight: 500 },
                input: { backgroundColor: "#F9F9F9" },
              }}
            />
            <Group position="right" mt="md">
              <Button
                radius="xl"
                style={{
                  backgroundColor: "#FF8C42",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                Update Password
              </Button>
            </Group>
          </Stack>
        );

      case "preferences":
        return (
          <Stack spacing="md">
            <Text>
              Manage your cuisine preferences on the dedicated preferences page.
            </Text>
            <Group position="right" mt="md">
              <Button
                radius="xl"
                component="a"
                href="/preferences"
                style={{
                  backgroundColor: "#FF8C42",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                Go to Preferences
              </Button>
            </Group>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Container size="lg" my="xl">
      <Title order={2} mb="xl" style={{ color: "#222222", fontWeight: 700 }}>
        My Profile
      </Title>

      <Paper
        withBorder
        shadow="md"
        radius="lg"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#e0e0e0",
          display: "flex",
          minHeight: "500px",
        }}
      >
        {/* Side Navigation */}
        <Box
          style={{
            width: "220px",
            borderRight: "1px solid #e0e0e0",
            padding: "1.5rem 1rem",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Stack spacing="md">
            <Avatar
              size={80}
              radius={80}
              color="initials"
              style={{ margin: "0 auto", fontSize: "2rem" }}
              name={auth.fullName}
            >
              {auth.fullName
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")}
            </Avatar>
            <Button
              variant={activeTab === "profile" ? "filled" : "light"}
              radius="xl"
              fullWidth
              style={{
                backgroundColor:
                  activeTab === "profile" ? "#FF8C42" : undefined,
                color: activeTab === "profile" ? "white" : "#222222",
                fontWeight: 500,
              }}
              onClick={() => setActiveTab("profile")}
            >
              Profile Info
            </Button>
            <Button
              variant={activeTab === "password" ? "filled" : "light"}
              radius="xl"
              fullWidth
              style={{
                backgroundColor:
                  activeTab === "password" ? "#FF8C42" : undefined,
                color: activeTab === "password" ? "white" : "#222222",
                fontWeight: 500,
              }}
              onClick={() => setActiveTab("password")}
            >
              Password
            </Button>
            <Button
              variant={activeTab === "preferences" ? "filled" : "light"}
              radius="xl"
              fullWidth
              style={{
                backgroundColor:
                  activeTab === "preferences" ? "#FF8C42" : undefined,
                color: activeTab === "preferences" ? "white" : "#222222",
                fontWeight: 500,
              }}
              onClick={() => setActiveTab("preferences")}
            >
              Preferences
            </Button>
          </Stack>
        </Box>

        {/* Main Content */}
        <Box style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          {renderContent()}
        </Box>
      </Paper>
    </Container>
  );
};
