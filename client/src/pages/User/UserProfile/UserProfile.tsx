import {
  Avatar,
  Button,
  Container,
  Paper,
  Stack,
  Title,
  Box,
  Text,
} from "@mantine/core";
import { useState, type JSX } from "react";
import { IconUser, IconLock, IconSettings } from "@tabler/icons-react";
import { Profiletab, Passwordtab, Preferencestab } from "./tabs/Tabs";
import { useAuth } from "@/hooks/auth/useAuth";
import classes from "./UserProfile.module.css";

type TabType = "profile" | "password" | "preferences";

const tabConfig = {
  profile: { label: "Profile", icon: IconUser },
  password: { label: "Password", icon: IconLock },
  preferences: { label: "Preferences", icon: IconSettings },
};

export const ProfilePage = () => {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("profile");

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

  const getInitials = (name: string) => {
    const names = name?.split(" ") || [];
    return names.length > 1
      ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
      : (names[0]?.[0] || '').toUpperCase();
  };

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl" className={classes.pageTitle}>
        My Profile
      </Title>

      <Paper shadow="sm" radius="lg" className={classes.profileContainer}>
        <Box className={classes.sidebar}>
          <Stack gap="lg" align="center">
            <Box className={classes.userSection}>
              <Avatar
                size={100}
                radius="50%"
                className={classes.avatar}
                name={auth.fullName}
                color="initials"
              >
                {getInitials(auth.fullName || "User")}
              </Avatar>
              <Text fw={600} size="lg" ta="center" mt="md" className={classes.userName}>
                {auth.fullName || "User"}
              </Text>
            </Box>

            <Stack gap="xs" w="100%">
              {(Object.keys(tabConfig) as TabType[]).map((tab) => {
                const { label, icon: Icon } = tabConfig[tab];
                return (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? "filled" : "subtle"}
                    size="md"
                    radius="md"
                    fullWidth
                    leftSection={<Icon size={18} />}
                    className={`${classes.navButton} ${activeTab === tab ? classes.activeNavButton : ""
                      }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {label}
                  </Button>
                );
              })}
            </Stack>
          </Stack>
        </Box>

        <Box className={classes.content}>
          <Paper p="xl" radius="md" className={classes.contentWrapper}>
            {renderContent()}
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
};