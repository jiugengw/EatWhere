import { Container, Flex, Text, Group } from '@mantine/core';
import classes from './Footer.module.css';
import { Link } from '@tanstack/react-router';

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <Container size="lg">
        <Flex justify="space-between" align="center">
          {/* Left Side */}
          <Text size="sm" className={classes.leftText}>
            © 2025 Where2Eat
          </Text>

          {/* Right Side Links */}
          <Group gap="md">
            {['Privacy', 'Terms', 'Contact'].map((link) => (
              <Link key={link} to="/" className={classes.link}>
                {link}
              </Link>
            ))}
          </Group>
        </Flex>
      </Container>
    </footer>
  );
}
