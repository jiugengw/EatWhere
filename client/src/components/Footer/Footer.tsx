import { Container, Flex, Text, Group, Anchor } from '@mantine/core';

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: '3rem',
        backgroundColor: '#FFFFFF', // White background
        borderTop: '1px solid #e0e0e0', // Light gray border
        padding: '2rem 0',
      }}
    >
      <Container size="lg">
        <Flex justify="space-between" align="center">
          {/* Left Side */}
          <Text size="sm" style={{ color: '#555555' }}>
            © 2025 Where2Eat
          </Text>

          {/* Right Side Links */}
          <Group spacing="md">
            {['Privacy', 'Terms', 'Contact'].map((link) => (
              <Anchor
                key={link}
                href="#"
                style={{
                  color: '#555555',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FF8C42')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#555555')}
              >
                {link}
              </Anchor>
            ))}
          </Group>
        </Flex>
      </Container>
    </footer>
  );
}
