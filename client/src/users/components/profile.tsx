import { Avatar, Paper, Title, Text } from "@mantine/core";
import useAuth from "../../shared/hooks/auth";
import React from 'react';

export default function Profile() {
  const { auth } = useAuth();
  const fullName = auth.fullName;
  const email = auth.email;

  return (
    <React.Fragment>
      <Paper
        withBorder
        shadow="sm"
        p="xl"
        radius="md"
        style={{ textAlign: "center" }}
      >
        <Avatar
          size={120}
          radius={120}
          color="initials"
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "1rem",
          }}
          name={fullName}
          
        />
        <Title order={4} style={{ marginBottom: "0.5rem" }}>
          {fullName}
        </Title>
        <Text color="dimmed" size="sm" style={{ marginBottom: "0.75rem" }}>
          {email}
        </Text>
      </Paper>
    </React.Fragment>
  );
}
