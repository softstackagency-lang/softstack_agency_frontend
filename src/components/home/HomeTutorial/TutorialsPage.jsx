"use client";

import Image from "next/image";
import { useState } from "react";
import { useRestartAnimations } from "@/hooks/useRestartAnimations";

export default function TutorialsPage() {
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

  const tutorials = [
    {
      title: "React Basics",
      desc: "Learn the fundamentals of React and start building dynamic web apps.",
      img: "https://i.ibb.co.com/wrxfV7FV/download-7.jpg",
    },
    {
      title: "Advanced JavaScript",
      desc: "Deep dive into ES6+ features and best practices.",
      img: "https://i.ibb.co.com/bRL2PyYX/download.png",
    },
    {
      title: "Node.js Backend",
      desc: "Build scalable backend applications using Node.js.",
      img: "https://i.ibb.co.com/mrkS6MX6/download-8.jpg",
    },
    {
      title: "CSS Animations",
      desc: "Create smooth and interactive animations with CSS.",
      img: "https://i.ibb.co.com/0pyCJmwD/images-6.jpg",
    },
    {
      title: "Next.js Guide",
      desc: "Build production-ready apps using Next.js and React.",
      img: "https://i.ibb.co.com/MkDpgNS9/download-9.jpg",
    },
    {
      title: "MongoDB Essentials",
      desc: "Learn how to design, query, and manage MongoDB databases.",
      img: "https://i.ibb.co.com/1G94hWnJ/download-1.png",
    },
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
          Tutorials
        </h1>
        <p className="max-w-3xl mx-auto text-gray-300 text-lg md:text-xl">
          Explore step-by-step tutorials to enhance your skills and build amazing projects.
        </p>
      </div>

      {/* ================= Tutorials Grid ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {tutorials.map((tutorial, index) => (
          <div
            key={index}
            className="flex flex-col bg-white/5 rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <div className="relative w-full h-48 md:h-56">
              <Image
                src={tutorial.img}
                alt={tutorial.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{tutorial.title}</h3>
              <p className="text-gray-300 text-sm">{tutorial.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
