import Footer from '@/components/Footer/Footer';
import Navbar from '@/components/Navbar/Navbar';
import type { ReactNode } from 'react';

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};
