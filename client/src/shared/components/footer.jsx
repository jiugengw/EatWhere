import { Container, Group, Text, Anchor, Divider, rem } from '@mantine/core';
import React from 'react';

export default function Footer() {
  return (
    <footer>
      <Divider my="xl" />
      <Container size="lg" py="md">
        <Group position="apart" spacing="xl">
          <Text size="sm" color="dimmed">
            © 2025 Where2Eat. All rights reserved.
          </Text>

          <Group spacing="md">
            <Anchor href="#" size="sm" color="dimmed">
              About
            </Anchor>
            <Anchor href="#" size="sm" color="dimmed">
              Contact
            </Anchor>
            <Anchor href="#" size="sm" color="dimmed">
              Privacy
            </Anchor>
          </Group>
        </Group>
      </Container>
    </footer>
  );
}