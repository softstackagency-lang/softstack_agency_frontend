"use client";

import Image from "next/image";
import { useState } from "react";
import { useRestartAnimations } from "@/hooks/useRestartAnimations";

export default function BlogPage() {
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

  const blogs = [
    {
      title: "How to Build Modern Web Apps",
      desc: "Learn the latest techniques in web development to build fast, responsive, and beautiful web apps.",
      img: "https://i.ibb.co.com/4R5tWBBs/download-10.jpg",
    },
    {
      title: "Top 10 JavaScript Tips",
      desc: "Boost your JS skills with these practical tips that every developer should know.",
      img: "https://i.ibb.co.com/rKS1rgbD/download-11.jpg",
    },
    {
      title: "React Performance Optimization",
      desc: "Optimize your React applications for maximum performance and smoother user experience.",
      img: "https://i.ibb.co.com/KpVdVB5y/download-2.png",
    },
    {
      title: "Node.js Best Practices",
      desc: "Write clean, maintainable, and efficient Node.js code with these best practices.",
      img: "https://i.ibb.co.com/RGxpxs2b/download-12.jpg",
    },
    {
      title: "CSS Tricks You Should Know",
      desc: "Enhance your frontend designs with these essential CSS tricks and hacks.",
      img: "https://i.ibb.co.com/BVQsTHT7/images-7.jpg",
    },
    {
      title: "Deploying Your App to Production",
      desc: "Step-by-step guide to safely deploy your applications to production servers.",
      img: "https://i.ibb.co.com/1tCCQM4H/download-13.jpg",
    },
  ];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 text-white bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
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

      {/* ================= Old Background (kept for compatibility) ================= */}
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
      <div className="text-center mb-12 sm:mb-14 md:mb-16 mt-8 sm:mt-12 md:mt-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-white drop-shadow-lg">
          Our Blog
        </h1>
        <p className="max-w-3xl mx-auto text-gray-300 text-base sm:text-lg md:text-xl px-4">
          Explore our latest articles, tutorials, and tips to boost your skills and knowledge.
        </p>
      </div>

      {/* ================= Blog Grid ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 w-full max-w-6xl">
        {blogs.map((blog, index) => (
          <div
            key={index}
            className="flex flex-col bg-white/5 rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <div className="relative w-full h-44 sm:h-48 md:h-56">
              <Image
                src={blog.img}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 sm:p-5 md:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2">{blog.title}</h3>
              <p className="text-gray-300 text-sm sm:text-base">{blog.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
