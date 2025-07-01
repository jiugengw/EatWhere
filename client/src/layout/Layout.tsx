import type { ReactNode } from 'react';
import { Header } from '@/components/Header/Header';
import { Navbar } from '@/components/Navbar/Navbar';
import { Footer } from '@/components/Footer/Footer';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import { Flex, Box } from '@mantine/core';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <Flex>
        <Navbar />
        <Box style={{ flex: 1, padding: '2rem' }}>
          <ColorSchemeToggle />
          {children}
        </Box>
      </Flex>
      <Footer />
    </>
  );
}
