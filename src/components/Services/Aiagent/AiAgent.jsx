"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Lottie from "lottie-react";
import { useRestartAnimations } from "@/hooks/useRestartAnimations";
import {
  FaRobot,
  FaCogs,
  FaCloud,
  FaChartLine,
  FaShieldAlt,
  FaCheck,
  FaRocket,
  FaTachometerAlt,
  FaLightbulb,
  FaSync,
  FaArrowRight,
} from "react-icons/fa";

import animationData from "../../../../public/Assistant-Bot.json";

const AiAgent = () => {
  // Generate stable random values for particles
  const particles = React.useMemo(() => {
    return [...Array(15)].map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20
    }));
  }, []);

  const features = [
    {
      icon: <FaCloud className="text-4xl mb-4 text-blue-400" />,
      title: "Workflow Automation (Zapier / n8n Style)",
      desc: "Build and deploy complex multi-step automation flows across CRM, marketing, support, and finance systems.",
    },
    {
      icon: <FaRobot className="text-4xl mb-4 text-blue-400" />,
      title: "Custom LLM Agents",
      desc: "Develop intelligent GPT-powered agents that interact with APIs, databases, and business rules autonomously.",
    },
    {
      icon: <FaCogs className="text-4xl mb-4 text-blue-400" />,
      title: "Support & Maintenance Bots",
      desc: "Automated monitoring, maintenance handling, and smart ticket triaging systems.",
    },
  
  ];

  const pillars = [
    {
      icon: <FaRocket className="text-4xl text-blue-400 mb-4 mx-auto" />,
      title: "Strategy → Launch",
      desc: "Clear roadmaps aligned with business goals from discovery to MVP.",
    },
    {
      icon: <FaTachometerAlt className="text-4xl text-blue-400 mb-4 mx-auto" />,
      title: "Performance-First Design",
      desc: "Fast, accessible, scalable UI & system architecture.",
    },
    {
      icon: <FaLightbulb className="text-4xl text-blue-400 mb-4 mx-auto" />,
      title: "Insight-Led Delivery",
      desc: "Data-driven decisions through analytics & feedback loops.",
    },
  ];

  // Restart animations when component mounts
  useRestartAnimations();

  return (
    <div className="relative bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-gray-100 font-sans overflow-hidden">
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

 <section className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-20 sm:py-24 md:py-32 z-10">
  <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-10 md:gap-12">
    {/* Text Content */}
    <div className="md:w-1/2">
      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-5 md:mb-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        AI Agent & Workflow Development
        <span className="block text-blue-400 mt-2">
          Autonomous Business Logic
        </span>
      </motion.h1>

      <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8">
        We build intelligent automation agents combining Zapier-like workflows with advanced LLM orchestration.
      </p>

     <div className="text-gray-400 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
  {[
    "No-Code & Low-Code Workflows",
    "Custom LLM Agents",
    "200+ SaaS Integrations",
    "Automated Data Pipelines",
    "Real-Time Monitoring",
    "Scalable Execution",
  ].map((item, i) => (
    <div key={i} className="flex items-center gap-2">
      <FaCheck className="text-blue-400 flex-shrink-0" />
      <span className="text-sm sm:text-base">{item}</span>
    </div>
  ))}
</div>

    </div>

    {/* Animation Strictly Right */}
    <div className="md:w-1/2 flex justify-center md:justify-end">
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: '100%', maxWidth: 400, height: 'auto' }}
      />
    </div>
  </div>
</section>



      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-14 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="bg-gray-800 p-5 sm:p-6 rounded-xl hover:shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            {f.icon}
            <h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-2">
              {f.title}
            </h3>
            <p className="text-gray-300 text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* ================= CTA (NOW BEFORE PILLARS) ================= */}
      <section className="relative py-20 text-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 z-10">
        <h2 className="text-4xl font-bold mb-4">
          Partner for Intelligent Automation
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Automate repetitive work and let your team focus on high-impact strategy.
        </p>

        <Link href="/contact" className="inline-block relative z-20">
          <button className="group inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 px-8 py-4 text-sm font-semibold text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.45)]">
            Schedule a Call <FaArrowRight />
          </button>
        </Link>
      </section>

      {/* ================= PILLARS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">
          Pillars of Excellence
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              className="bg-gray-800 p-6 rounded-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              {p.icon}
              <h3 className="text-xl font-semibold text-blue-400 mb-2">
                {p.title}
              </h3>
              <p className="text-gray-300 text-sm">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AiAgent;
