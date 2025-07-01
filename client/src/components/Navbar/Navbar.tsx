import {
  Container,
  Flex,
  Group,
  Anchor,
  ActionIcon,
  Box,
  Button,
  Transition,
} from '@mantine/core';
import { IconUserCircle } from '@tabler/icons-react';
import { useState } from 'react';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const links: string[] = ['Home', 'Explore', 'Contact', 'Group', 'History'];

  return (
    <>
      {/* Full-width Navbar wrapper */}
      <Box
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 200,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #e0e0e0',
          width: '100%',
          margin: 0,
          padding: 0,
        }}
      >
        <Container size="lg" py="sm" px={0}>
          <Flex justify="space-between" align="center">
            {/* Logo */}
            <Anchor
              href="/"
              style={{
                fontWeight: 700,
                fontSize: '1.2rem',
                color: '#222222',
                textDecoration: 'none',
              }}
            >
              Where2Eat
            </Anchor>

            {/* Navigation Links */}
            <Group gap="lg">
              {links.map((link) => (
                <Anchor
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  style={{
                    color: '#555555',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = '#FF8C42')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = '#555555')
                  }
                >
                  {link}
                </Anchor>
              ))}
            </Group>

            {/* Profile Icon */}
            <ActionIcon
              variant="transparent"
              size="lg"
              style={{ color: '#555555', cursor: 'pointer' }}
              title="Account"
              onClick={() => setDropdownOpen((o) => !o)}
            >
              <IconUserCircle size={26} />
            </ActionIcon>
          </Flex>
        </Container>
      </Box>

      {/* Full-width Dropdown Panel */}
      <Transition
        mounted={dropdownOpen}
        transition="pop-top-right"
        duration={200}
        timingFunction="ease"
      >
        {(styles) => (
          <Box
            style={{
              ...styles,
              position: 'fixed',
              top: '60px',
              left: 0,
              width: '100vw',
              backgroundColor: '#FFFFFF',
              borderBottom: '1px solid #e0e0e0',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)',
              zIndex: 150,
              padding: '1.5rem 2rem',
            }}
          >
            <Flex
              justify="flex-end"
              gap="md"
              style={{ maxWidth: '1200px', margin: '0 auto' }}
            >
              <Button
                radius="xl"
                style={{
                  backgroundColor: '#FF8C42',
                  color: 'white',
                  fontWeight: 600,
                }}
                component="a"
                href="/login"
              >
                Log In
              </Button>

              <Button
                radius="xl"
                variant="outline"
                style={{
                  color: '#333333',
                  borderColor: '#333333',
                  fontWeight: 500,
                }}
                component="a"
                href="/signup"
              >
                Sign Up
              </Button>
            </Flex>
          </Box>
        )}
      </Transition>
    </>
  );
}
