"use client";

import { FaBook, FaCode, FaCogs, FaTools, FaServer, FaRocket } from "react-icons/fa";
import { useState } from "react";
import { useRestartAnimations } from "@/hooks/useRestartAnimations";

export default function DocumentationPage() {
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

  const docs = [
    { title: "Getting Started", desc: "Quick start guide to setup your project.", icon: <FaRocket /> },
    { title: "API Reference", desc: "Detailed API documentation and usage examples.", icon: <FaCode /> },
    { title: "Components Guide", desc: "Learn about all reusable components.", icon: <FaCogs /> },
    { title: "CLI Commands", desc: "Command line interface usage guide.", icon: <FaTools /> },
    { title: "Server Setup", desc: "Backend setup and configuration instructions.", icon: <FaServer /> },
    { title: "Tutorials", desc: "Step-by-step tutorials to build apps.", icon: <FaBook /> },
  ];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start px-6 py-24 text-white bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* ================= Background Animations ================= */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
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

      {/* ================= Old Full-screen Animated Background ================= */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
              animation: "grid-move 20s linear infinite",
            }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-500 rounded-full opacity-20"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animation: `float ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* ================= Page Header ================= */}
      <div className="text-center mb-16 mt-12 md:mt-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
          Documentation
        </h1>
        <p className="max-w-3xl mx-auto text-gray-300 text-lg md:text-xl">
          Find all guides, tutorials, and references you need to integrate and use our platform.
        </p>
      </div>

      {/* ================= Docs Grid ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {docs.map((doc, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-6 rounded-3xl shadow-lg hover:scale-105 transition-transform duration-300 bg-white/5 backdrop-blur-md"
          >
            <div className="text-4xl mb-4 text-purple-400">{doc.icon}</div>
            <h3 className="text-xl font-bold mb-2">{doc.title}</h3>
            <p className="text-gray-300 text-center">{doc.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
