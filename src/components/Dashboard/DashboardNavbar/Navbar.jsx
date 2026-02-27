import React from "react";
import { Bell, ChevronDown, Settings } from "lucide-react";
import Image from "next/image";

export default function DashboardNavbar() {
  return (
    <header className="h-16 w-full bg-[#050b1d] border-b border-white/10 flex items-center justify-between px-6">
      {/* Left Section */}
      <div>
        <h1 className="text-lg font-semibold text-white">
          Welcome back, <span className="text-blue-400">Prem!</span>
        </h1>
        <p className="text-xs text-gray-400">{"Here's a snapshot of your agency."}</p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Notification */}
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5 text-gray-300 hover:text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">
            4
          </span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <Image
            src="https://i.pravatar.cc/40"
            alt="Profile"
            width={36}
            height={36}
            className="rounded-full border border-white/20"
          />
          <div className="hidden sm:block">
            <p className="text-sm text-white font-medium">Ben Beckman</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>

        {/* Settings */}
        <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
      </div>
    </header>
  );
}
