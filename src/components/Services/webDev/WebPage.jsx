"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import animationData from "../../../../public/animation.json";
import { useRestartAnimations } from "@/hooks/useRestartAnimations";

// ================== LOTTIE (SSR SAFE) ==================
const Player = dynamic(
  () =>
    import("@lottiefiles/react-lottie-player").then(
      (mod) => mod.Player
    ),
  { ssr: false }
);

// ================== ICONS ==================
import {
  FaGlobe,
  FaCode,
  FaServer,
  FaMobileAlt,
  FaUserTie,
  FaBuilding,
  FaRocket,
  FaTachometerAlt,
  FaShieldAlt,
  FaCogs,
  FaSync,
  FaBug,
} from "react-icons/fa";

// ================== ANIMATION VARIANTS ==================
const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 20,
    },
  },
};

// ================== DATA ==================
const services = [
  {
    icon: FaGlobe,
    title: "Web App Development",
    desc: "Scalable, secure, high-performance web applications.",
  },
  {
    icon: FaCode,
    title: "Modern Frontend",
    desc: "Pixel-perfect React & Next.js interfaces.",
  },
  {
    icon: FaServer,
    title: "Backend & APIs",
    desc: "Robust REST & GraphQL architectures.",
  },
  {
    icon: FaMobileAlt,
    title: "Adaptive Design",
    desc: "Optimized experience across all devices.",
  },
  {
    icon: FaUserTie,
    title: "Brand Solutions",
    desc: "Professional digital brand identity.",
  },
  {
    icon: FaBuilding,
    title: "Enterprise Web",
    desc: "High-security, scalable enterprise platforms.",
  },
];

const features = [
  { icon: FaRocket, title: "Fast Deployment", desc: "Optimized CI/CD pipelines." },
  { icon: FaTachometerAlt, title: "Core Vitals", desc: "Top-tier performance scores." },
  { icon: FaShieldAlt, title: "Data Security", desc: "Industry-standard encryption." },
  { icon: FaCogs, title: "Logic First", desc: "Clean, maintainable architecture." },
  { icon: FaSync, title: "Seamless Scaling", desc: "Built to grow with your users." },
  { icon: FaBug, title: "Rigorous QA", desc: "Stability through testing." },
];

const pillars = [
  {
    icon: FaRocket,
    title: "Strategy to Launch",
    desc: "From idea to production-ready solution.",
  },
  {
    icon: FaTachometerAlt,
    title: "Performance-First",
    desc: "Speed as a foundational principle.",
  },
  {
    icon: FaShieldAlt,
    title: "Scalable & Secure",
    desc: "Future-proof architecture you can trust.",
  },
];

// ================== MAIN PAGE ==================
export default function WebPage() {
  const [mounted, setMounted] = useState(false);

  // Restart animations when component mounts
  useRestartAnimations();

  // Generate stable random values for particles (outside useMemo for React 19)
  const [particles] = useState(() => {
    return [...Array(15)].map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20
    }));
  });

  useEffect(() => {
    // SSR error fix
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-gray-300 overflow-hidden font-sans">
      {/* Background Animations */}
      <div className="absolute inset-0 overflow-hidden">
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
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          ></div>
        ))}
      </div>

      {/* ================= HERO ================= */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-20 sm:py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 md:gap-14 items-center z-10">
        <motion.div
          variants={fadeSlideUp}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 sm:mb-5 md:mb-6">
            Build{" "}
            <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Fast & Scalable
            </span>{" "}
            Web Apps
            <br className="hidden md:block" />
            Designed for <span className="text-cyan-400">Growth</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-xl mb-6 sm:mb-8 md:mb-10">
            We craft modern, secure, and high-performance web
            applications engineered to help your business scale
            confidently.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
            <Link href="/pricing">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 text-black font-semibold shadow-lg hover:shadow-[0_0_40px_rgba(59,130,246,0.45)]"
              >
                Get Started
              </motion.button>
            </Link>

            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
              >
                Learn More
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          {mounted && (
            <Player
              autoplay
              loop
              src={animationData}
              style={{ maxWidth: 500, width: "100%" }}
            />
          )}
        </motion.div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-20 sm:py-24 md:py-28">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8"
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeSlideUp}
              whileHover={{ y: -8 }}
              className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 transition"
            >
              <div className="w-12 h-12 mb-6 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <s.icon className="text-2xl text-cyan-400" />
              </div>
              <h3 className="text-white text-xl font-bold mb-3">
                {s.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-[#020617]/60 py-20 sm:py-24 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Capabilities & Features
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-5 sm:p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:bg-slate-900/60"
              >
                <f.icon className="text-blue-400 text-2xl mb-4" />
                <h4 className="text-white font-semibold mb-2">
                  {f.title}
                </h4>
                <p className="text-gray-400 text-sm">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="p-10 md:p-16 rounded-3xl bg-linear-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-2xl border border-white/10 flex flex-col md:flex-row gap-10 justify-between items-center"
        >
          <div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to build the future?
            </h3>
            <p className="text-gray-400 max-w-xl">
              Strategy-driven engineering and modern development
              tailored for your brand.
            </p>
          </div>
          <Link href="/contact">
            <button className="group inline-flex items-center gap-2 whitespace-nowrap px-10 py-5 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 text-black font-bold transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.45)] shadow-xl">
              Let&apos;s Talk Projects
            </button>
          </Link>
        </motion.div>
      </section>

      {/* ================= PILLARS ================= */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Our Pillars of Excellence
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="p-8 rounded-3xl bg-slate-900/20 border border-slate-800/50 space-y-4"
              >
                <p.icon className="text-cyan-400 text-3xl" />
                <h4 className="text-white font-bold">
                  {p.title}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
