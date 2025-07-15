import { Container, Flex, Text } from '@mantine/core';
import classes from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <Container size="lg">
        <Flex justify="space-between" align="center">
          {/* Left Side */}
          <Text size="sm" className={classes.leftText}>
            © 2025 Where2Eat
          </Text>
        </Flex>
      </Container>
    </footer>
  );
}
