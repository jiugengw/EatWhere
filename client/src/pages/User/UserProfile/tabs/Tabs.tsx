import {
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  PasswordInput,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { useForm } from "@mantine/form";
import { useUpdateUserProfile } from "@/hooks/users/useUpdateUserProfile";
import { useUserProfile } from "@/hooks/users/useUserProfile";
import { useUpdatePassword } from "@/hooks/auth/useUpdatePassword";
import { zodResolver } from "mantine-form-zod-resolver";

import styles from "./tabs.module.css";
// import { UpdateUserProfileSchema } from "@/shared/schemas/UpdateUserProfileSchema";
import { UpdatePasswordSchema } from "@/shared/schemas/UpdatePasswordSchema";

export const Profiletab = () => {
  const { data } = useUserProfile();
  const { mutate, isPending } = useUpdateUserProfile();

  const user = data?.user ?? {};

  const form = useForm({
    initialValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
    },
    // validate: zodResolver(UpdateUserProfileSchema),
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
    <form onSubmit={form.onSubmit((v) => mutate(v))} noValidate>
      <Stack gap="md">
        <TextInput
          label="Username"
          placeholder={user.username ?? ""}
          classNames={{ label: styles.label, input: styles.input }}
          {...form.getInputProps("username")}
        />
        <TextInput
          label="First Name"
          placeholder={user.firstName ?? ""}
          classNames={{ label: styles.label, input: styles.input }}
          {...form.getInputProps("firstName")}
        />
        <TextInput
          label="Last Name"
          placeholder={user.lastName ?? ""}
          classNames={{ label: styles.label, input: styles.input }}
          {...form.getInputProps("lastName")}
        />
        <TextInput
          label="Email"
          type="email"
          placeholder={user.email ?? ""}
          classNames={{ label: styles.label, input: styles.input }}
          {...form.getInputProps("email")}
        />
        <Group align="right" mt="md">
          <Button
            radius="xl"
            className={styles.button}
            loading={isPending}
            type="submit"
          >
            Save Profile
          </Button>
        </Group>
      </Stack>
    </form>
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
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <PasswordInput
          label="Current Password"
          {...form.getInputProps("passwordCurrent")}
        />
        <PasswordInput
          label="New Password"
          {...form.getInputProps("passwordNew")}
        />
        <PasswordInput
          label="Confirm New Password"
          {...form.getInputProps("passwordConfirm")}
        />
        <Group align="right" mt="md">
          <Button
            radius="xl"
            className={styles.button}
            loading={isPending}
            type="submit"
          >
            Change Password
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export const Preferencestab = () => {
  return (
    <Stack gap="md">
      <Text>
        Manage your cuisine preferences on the dedicated preferences page.
      </Text>
      <Group align="right" mt="md">
        <Button
          radius="xl"
          component={Link}
          to="/preferences"
          className={styles.button}
        >
          Go to Preferences
        </Button>
      </Group>
    </Stack>
  );
};
