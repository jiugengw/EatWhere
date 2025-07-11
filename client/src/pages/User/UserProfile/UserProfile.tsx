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
import { Profiletab, Passwordtab, Preferencestab } from "./tabs/Tabs";
import { useAuth } from "@/hooks/auth/useAuth";
import classes from "./userprofile.module.css";

export const ProfilePage = () => {
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
      className={activeTab === tab ? classes.activeButton : classes.inactiveButton}
      onClick={() => setActiveTab(tab)}
    >
      {tab[0].toUpperCase() + tab.slice(1)}
    </Button>
  );

  return (
    <Container size="lg" my="xl">
      <Title order={2} mb="xl" className={classes.title}>
        My Profile
      </Title>

      <Paper withBorder shadow="md" radius="lg" className={classes.paper}>
        {/* Side Navigation */}
        <Box className={classes.sidebar}>
          <Stack gap="md">
            <Avatar
              size={80}
              radius={80}
              color='initials'
              className={classes.avatar}
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
        <Box className={classes.content}>{renderContent()}</Box>
      </Paper>
    </Container>
  );
};
