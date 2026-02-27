"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/Dashboard/DashboardNavbar/DashboardSidebar/Sidebar";
import { useCustomAuth } from "@/hooks/useCustomAuth";

export default function Layout({ children }) {
  const { user, loading } = useCustomAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to signin
        router.push('/signin');
      } else if (user.role !== 'admin') {
        // Not an admin, redirect to home
        router.push('/');
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020617]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render dashboard if not authorized
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="h-screen flex bg-[#020617] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-125 h-125 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[30%] right-[-10%] w-150 h-150 bg-purple-600/15 rounded-full blur-[130px] animate-[bounce_10s_infinite]"></div>
      </div>

      <div className="relative z-20 shrink-0 h-full border-r border-blue-500/10">
        <DashboardSidebar />
      </div>

      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 10px;
        }

        aside {
          height: 100% !important;
        }
      `}</style>
    </div>
  );
}
