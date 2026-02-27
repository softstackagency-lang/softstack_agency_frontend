"use client";

import Image from "next/image";
import { useState } from "react";
import { useRestartAnimations } from "@/hooks/useRestartAnimations";

export default function CustomersPage() {
  // Restart animations when component mounts
  useRestartAnimations();

  const [particles] = useState(() => {
    return Array.from({ length: 15 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20,
    }));
  });

  const customers = [
    { name: "Acme Corp", logo: "https://i.ibb.co.com/Q3frLsdm/download-14.jpg", bg: "bg-blue-500/20" },
    { name: "Globex Inc", logo: "https://i.ibb.co.com/1Gj1K87H/download-15.jpg", bg: "bg-green-500/20" },
    { name: "Initech", logo: "https://i.ibb.co.com/svv5XxZh/download-16.jpg", bg: "bg-purple-500/20" },
    { name: "Umbrella Corp", logo: "https://i.ibb.co.com/zHFwZPD9/images-9.jpg", bg: "bg-red-500/20" },
    { name: "Soylent Corp", logo: "https://i.ibb.co.com/xtYjrQSq/images-10.jpg", bg: "bg-yellow-500/20" },
    { name: "Stark Industries", logo: "https://i.ibb.co.com/nMQ7HV6F/images-8.jpg", bg: "bg-pink-500/20" },
  ];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start px-6 py-24 text-white overflow-hidden bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">

      {/* ================= Background Animations ================= */}
      <div className="fixed inset-0 -z-10">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/40 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/35 rounded-full blur-3xl animate-float-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-float-reverse"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Floating Elements */}
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-float-random"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          ></div>
        ))}
      </div>

      {/* ================= Old BACKGROUND ================= */}
      <div className="fixed inset-0 -z-10">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        />

        {/* Floating Particles */}
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-500 rounded-full opacity-20"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animation: `float ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* ================= HEADER ================= */}
      <div className="text-center mb-20 mt-12 md:mt-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          Our Customers
        </h1>
        <p className="max-w-3xl mx-auto text-gray-300 text-lg md:text-xl">
          We proudly work with forward-thinking companies around the world,
          helping them scale, innovate, and succeed.
        </p>
      </div>

      {/* ================= CUSTOMERS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full max-w-6xl">
        {customers.map((customer, index) => (
          <div
            key={index}
            className={`group flex flex-col items-center justify-center p-8 rounded-3xl ${customer.bg}
              backdrop-blur border border-white/10
              shadow-lg hover:shadow-2xl hover:shadow-white/10
              hover:-translate-y-1 hover:scale-105
              transition-all duration-300`}
          >
            {/* Logo */}
            <div className="relative w-28 h-28 mb-5 rounded-full bg-white/10 flex items-center justify-center">
              <Image
                src={customer.logo}
                alt={customer.name}
                fill
                className="object-cover rounded-full p-2"
              />
            </div>

            {/* Name */}
            <h3 className="text-xl font-semibold text-white text-center">
              {customer.name}
            </h3>
          </div>
        ))}
      </div>
    </main>
  );
}
