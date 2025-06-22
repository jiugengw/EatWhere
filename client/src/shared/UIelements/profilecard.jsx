import React from "react";
import { Text, Anchor, Container } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function ProfileCard() {
  return (
    <Container>
      <Anchor underline="hover" size="sm" href="/login">
        Log in
      </Anchor>

      <Text size="xs" fw={400}>
        This should show stuff about you
      </Text>
    </Container>
  );
}
