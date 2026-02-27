"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header/header";
import Footer from "@/components/home/Footer";
import { LayoutProvider } from "@/context/LayoutContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideHeaderFooter = pathname?.startsWith('/dashboard') || pathname === '/signin' || pathname === '/signup';

  return (
    <LayoutProvider>
      {/* Animated Floating Orbs Background - Global for all pages */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        {/* Large Blue Orb - Top Left */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-slow" />
        
        {/* Medium Purple Orb - Top Right */}
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-float-slower" />
        
        {/* Small Cyan Orb - Bottom Left */}
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-float-delayed" />
        
        {/* Medium Blue Orb - Bottom Right */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-float-reverse" />
        
        {/* Small Purple Orb - Center Left */}
        <div className="absolute top-1/3 -left-10 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-float" />
        
        {/* Small Cyan Orb - Center Right */}
        <div className="absolute top-2/3 -right-10 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl animate-float-simple" />
      </div>

      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
      
      {/* Toast Notifications */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="mt-16"
      />
    </LayoutProvider>
  );
}