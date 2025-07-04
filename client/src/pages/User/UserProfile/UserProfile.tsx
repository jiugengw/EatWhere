import {
  Avatar,
  Button,
  Container,
  Paper,
  Stack,
  Title,
  Box,
} from "@mantine/core";
import { useState,type JSX } from "react";
import { Profiletab, Passwordtab, Preferencestab } from "./tabs/tabs";
import { useAuth } from "@/hooks/useAuth";
import styles from "./userprofile.module.css";

export const ProfilePage = (): JSX.Element => {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "preferences">("profile");

  const renderContent = (): JSX.Element | null => {
    switch (activeTab) {
      case "profile":
        return <Profiletab />;
      case "password":
        return <Passwordtab />;
      case "preferences":
        return <Preferencestab />;
      default:
        return null;
    }
  };

  const renderButton = (tab: typeof activeTab) => (
    <Button
      variant={activeTab === tab ? "filled" : "light"}
      radius="xl"
      fullWidth
      className={activeTab === tab ? styles.activeButton : styles.inactiveButton}
      onClick={() => setActiveTab(tab)}
    >
      {tab[0].toUpperCase() + tab.slice(1)}
    </Button>
  );

  return (
    <Container size="lg" my="xl">
      <Title order={2} mb="xl" className={styles.title}>
        My Profile
      </Title>

      <Paper withBorder shadow="md" radius="lg" className={styles.paper}>
        {/* Side Navigation */}
        <Box className={styles.sidebar}>
          <Stack spacing="md">
            <Avatar
              size={80}
              radius={80}
              color='initials'
              className={styles.avatar}
              name={auth.fullName}
            >
              {auth.fullName
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")}
            </Avatar>

            {renderButton("profile")}
            {renderButton("password")}
            {renderButton("preferences")}
          </Stack>
        </Box>

        {/* Main Content */}
        <Box className={styles.content}>{renderContent()}</Box>
      </Paper>
    </Container>
  );
};
