"use client";
import { useLayout } from '@/context/LayoutContext';

export default function LayoutWrapper({ Header, Footer, children }) {
  const { showHeader, showFooter } = useLayout();

  return (
    <>
      {showHeader && <Header />}
      {children}
      {showFooter && <Footer />}
    </>
  );
}
