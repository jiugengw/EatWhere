import {
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  PasswordInput,
  Title,
  Paper,
  Alert,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { useForm } from "@mantine/form";
import { IconUser, IconLock, IconSettings, IconInfoCircle } from "@tabler/icons-react";
import { useUpdateUserProfile } from "@/hooks/users/useUpdateUserProfile";
import { useUserProfile } from "@/hooks/users/useUserProfile";
import { useUpdatePassword } from "@/hooks/auth/useUpdatePassword";
import { zodResolver } from "mantine-form-zod-resolver";

import styles from "./tabs.module.css";
import { UpdatePasswordSchema } from "@/shared/schemas/UpdatePasswordSchema";

export const Profiletab = () => {
  const { data } = useUserProfile();
  const { mutate, isPending } = useUpdateUserProfile();

  const user = data?.data?.user ?? {};

  const form = useForm({
    initialValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
    },
    transformValues: (values) => {
      const transformed: Partial<typeof values> = {};
      for (const key in values) {
        const trimmed = values[key as keyof typeof values].trim();
        const original = user[key as keyof typeof user]?.trim?.() ?? "";
        if (trimmed !== "" && trimmed !== original) {
          transformed[key as keyof typeof values] = trimmed;
        }
      }
      return transformed;
    },
  });

  return (
    <div className={styles.tabContainer}>
      <Group gap="sm" mb="lg">
        <IconUser size={20} className={styles.tabIcon} />
        <Title order={3} className={styles.tabTitle}>
          Profile Information
        </Title>
      </Group>

      <form onSubmit={form.onSubmit((v) => mutate(v))} noValidate>
        <Stack gap="lg">
          <TextInput
            label="Username"
            placeholder={user.username ?? "Enter username"}
            classNames={{ 
              label: styles.label, 
              input: styles.input,
              wrapper: styles.inputWrapper 
            }}
            {...form.getInputProps("username")}
          />
          <TextInput
            label="First Name"
            placeholder={user.firstName ?? "Enter first name"}
            classNames={{ 
              label: styles.label, 
              input: styles.input,
              wrapper: styles.inputWrapper 
            }}
            {...form.getInputProps("firstName")}
          />
          <TextInput
            label="Last Name"
            placeholder={user.lastName ?? "Enter last name"}
            classNames={{ 
              label: styles.label, 
              input: styles.input,
              wrapper: styles.inputWrapper 
            }}
            {...form.getInputProps("lastName")}
          />
          <TextInput
            label="Email"
            type="email"
            placeholder={user.email ?? "Enter email"}
            classNames={{ 
              label: styles.label, 
              input: styles.input,
              wrapper: styles.inputWrapper 
            }}
            {...form.getInputProps("email")}
          />
          
          <Group justify="flex-end" mt="xl">
            <Button
              size="md"
              radius="md"
              className={styles.submitButton}
              loading={isPending}
              type="submit"
            >
              Save Profile
            </Button>
          </Group>
        </Stack>
      </form>
    </div>
  );
};

export const Passwordtab = () => {
  const { mutate, isPending } = useUpdatePassword();

  const form = useForm({
    initialValues: {
      passwordCurrent: "",
      passwordNew: "",
      passwordConfirm: "",
    },
    validate: zodResolver(UpdatePasswordSchema),
  });

  const handleSubmit = (values: typeof form.values) => {
    mutate(values);
    form.reset();
  };

  return (
    <div className={styles.tabContainer}>
      <Group gap="sm" mb="lg">
        <IconLock size={20} className={styles.tabIcon} />
        <Title order={3} className={styles.tabTitle}>
          Change Password
        </Title>
      </Group>

      <Alert 
        icon={<IconInfoCircle size={16} />} 
        color="blue" 
        variant="light" 
        mb="lg"
        className={styles.alert}
      >
        Use a strong password with at least 8 characters, including uppercase, lowercase, special characters and numbers.
      </Alert>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
          <PasswordInput
            label="Current Password"
            placeholder="Enter your current password"
            classNames={{ 
              label: styles.label, 
              input: styles.input,
              wrapper: styles.inputWrapper 
            }}
            {...form.getInputProps("passwordCurrent")}
          />
          <PasswordInput
            label="New Password"
            placeholder="Enter your new password"
            classNames={{ 
              label: styles.label, 
              input: styles.input,
              wrapper: styles.inputWrapper 
            }}
            {...form.getInputProps("passwordNew")}
          />
          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm your new password"
            classNames={{ 
              label: styles.label, 
              input: styles.input,
              wrapper: styles.inputWrapper 
            }}
            {...form.getInputProps("passwordConfirm")}
          />
          
          <Group justify="flex-end" mt="xl">
            <Button
              size="md"
              radius="md"
              className={styles.submitButton}
              loading={isPending}
              type="submit"
            >
              Change Password
            </Button>
          </Group>
        </Stack>
      </form>
    </div>
  );
};

export const Preferencestab = () => {
  return (
    <div className={styles.tabContainer}>
      <Group gap="sm" mb="lg">
        <IconSettings size={20} className={styles.tabIcon} />
        <Title order={3} className={styles.tabTitle}>
          Cuisine Preferences
        </Title>
      </Group>

      <Paper p="lg" className={styles.preferencesCard}>
        <Stack gap="md" align="center">
          <Text ta="center" c="dimmed">
            Customize your cuisine preferences to get better restaurant recommendations 
            tailored to your taste.
          </Text>
          
          <Button
            size="md"
            radius="md"
            component={Link}
            to="/preferences"
            className={styles.submitButton}
            leftSection={<IconSettings size={18} />}
          >
            Manage Preferences
          </Button>
        </Stack>
      </Paper>
    </div>
  );
};