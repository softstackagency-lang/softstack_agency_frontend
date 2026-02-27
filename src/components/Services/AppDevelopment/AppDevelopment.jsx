"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Lottie from "lottie-react";
import mobileAppShowcase from "../../../../public/Mobile App Showcase.json";
import { useRestartAnimations } from "@/hooks/useRestartAnimations";
import {
  Rocket,
  Code2,
  Smartphone,
  Palette,
  Zap,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Database,
  Bell,
  ShieldCheck,
  RefreshCw,
  Activity,
  Layers,
  LineChart,
  Target,
  Heart,
} from "lucide-react";

const AppDevelopment = () => {
  // Restart animations when component mounts
  useRestartAnimations();

  // Generate stable random values for particles
  const [particles] = useState(() => {
    return [...Array(15)].map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20
    }));
  });

  useEffect(() => {
    const observerOptions = { threshold: 0.12, rootMargin: "0px 0px -40px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".scroll-anim");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    "Cross-Platform Speed & Efficiency",
    "Native Performance Optimization",
    "Data-Driven UI/UX Excellence",
    "Flutter & React Native (Expo) Focus",
    "Scalable Cloud Backends & APIs",
    "Seamless App Store Deployment",
  ];

  const services = [
    {
      title: "Flutter Development",
      desc: "Build beautiful, natively compiled apps for mobile, web, and desktop from one codebase. We ensure high-fidelity UIs with smooth performance across all platforms.",
      icon: <Rocket className="w-6 h-6 text-cyan-400" />,
    },
    {
      title: "React Native & Expo Apps",
      desc: "Deliver scalable iOS and Android apps using JavaScript/TypeScript. We utilize Expo-based workflows for rapid development and seamless native module integration.",
      icon: <Code2 className="w-6 h-6 text-cyan-400" />,
    },
    {
      title: "Native iOS/Android",
      desc: "For maximum performance and hardware access, we build using Swift and Kotlin. Optimized for device-specific features like ARKit, sensors, and background tasks.",
      icon: <Smartphone className="w-6 h-6 text-cyan-400" />,
    },
    {
      title: "App UI/UX Design",
      desc: "Crafting intuitive user flows and stunning, accessible designs. Our process focuses on reducing friction and creating engaging, performance-first mobile interfaces.",
      icon: <Palette className="w-6 h-6 text-cyan-400" />,
    },
    {
      title: "API & Backend Services",
      desc: "Secure, real-time backend infrastructure using Firebase, AWS, or custom APIs. We ensure effortless scaling with robust data modeling and enterprise-grade security.",
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
    },
    {
      title: "Maintenance & Support",
      desc: "Proactive maintenance, version updates, and bug fixes post-launch. We manage App Store compliance to ensure your application stays optimized and up-to-date.",
      icon: <Wrench className="w-6 h-6 text-cyan-400" />,
    },
  ];

  const capabilities = [
    {
      title: "Offline Sync & Persistence",
      desc: "Reliable app performance without internet. We implement local caching and background sync to keep data consistent anytime.",
      icon: <Database className="w-5 h-5 text-red-500" />,
      bgColor: "bg-red-500/10",
      borderColor: "group-hover:border-red-500/40",
    },
    {
      title: "Push Notifications",
      desc: "Drive retention with real-time alerts. Seamless integration of FCM and APNs for personalized and timely user engagement.",
      icon: <Bell className="w-5 h-5 text-blue-500" />,
      bgColor: "bg-blue-500/10",
      borderColor: "group-hover:border-blue-500/40",
    },
    {
      title: "Biometric Auth & Security",
      desc: "Protect user data with Face ID, Touch ID, and multi-factor auth using industry-standard encryption protocols.",
      icon: <ShieldCheck className="w-5 h-5 text-green-500" />,
      bgColor: "bg-green-500/10",
      borderColor: "group-hover:border-green-500/40",
    },
    {
      title: "Automated CI/CD Pipelines",
      desc: "Fast, stable updates via automated testing and deployment pipelines to TestFlight and Google Play Store.",
      icon: <Layers className="w-5 h-5 text-orange-400" />,
      bgColor: "bg-orange-400/10",
      borderColor: "group-hover:border-orange-400/40",
    },
    {
      title: "Performance Monitoring",
      desc: "Real-time crash reports and usage analytics to proactively monitor app health and optimize user experience.",
      icon: <Activity className="w-5 h-5 text-pink-500" />,
      bgColor: "bg-pink-500/10",
      borderColor: "group-hover:border-pink-500/40",
    },
    {
      title: "Over-the-Air (OTA) Updates",
      desc: "Deploy critical bug fixes and UI updates instantly, bypassing long app store review cycles with CodePush.",
      icon: <RefreshCw className="w-5 h-5 text-cyan-400" />,
      bgColor: "bg-cyan-400/10",
      borderColor: "group-hover:border-cyan-400/40",
    },
  ];

  const pillars = [
    {
      title: "Strategic MVP & Launch",
      subTitle: "Growth-Oriented Roadmap",
      desc: "We transform your vision into a scalable roadmap, prioritizing essential features for rapid market entry and long-term stability.",
      icon: <Target className="w-6 h-6 text-cyan-400" />,
    },
    {
      title: "Performance Design & UX",
      subTitle: "Speed & User Retention",
      desc: "We craft lightning-fast, intuitive interfaces focused on native performance to ensure maximum user engagement and retention.",
      icon: <Heart className="w-6 h-6 text-cyan-400" />,
    },
    {
      title: "Data-Driven Delivery",
      subTitle: "Continuous Improvement",
      desc: "Real-time analytics and telemetry are baked into your app, providing the insights needed to optimize performance and grow.",
      icon: <LineChart className="w-6 h-6 text-cyan-400" />,
    },
  ];

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
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

      <div className="relative max-w-7xl mx-auto route-container z-10">
        {/* SECTION 1: HERO (mb-32) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 md:gap-12 mb-20 sm:mb-24 md:mb-32">
          <div className="flex-1 space-y-6 sm:space-y-8 text-left scroll-anim order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Cross-Platform App <br />
              <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Development. Fast, Fluid, & Future-Ready.
              </span>
            </h1>
            <p className="text-gray-300/90 text-base sm:text-lg leading-relaxed max-w-2xl">
              We build native-quality mobile apps using{" "}
              <span className="text-cyan-400 font-semibold">Flutter</span> and{" "}
              <span className="text-blue-400 font-semibold">React Native</span>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4">
              {features.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-gray-200/90">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center items-center order-1 lg:order-2 scroll-anim relative">
            <div className="absolute -inset-6 bg-cyan-500/10 blur-3xl rounded-full opacity-60 animate-appGlowPulse" />
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              <Lottie animationData={mobileAppShowcase} loop={true} className="w-full h-auto" />
            </div>
          </div>
        </div>

        {/* SECTION 2: SERVICES GRID (mb-32) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 mb-20 sm:mb-24 md:mb-32">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 sm:p-7 md:p-8 rounded-3xl bg-slate-900/45 border border-slate-700/60 backdrop-blur-md shadow-lg transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ease-out group"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-slate-800/70 group-hover:bg-cyan-500/20 text-white text-2xl transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-200/80 text-sm leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>

        {/* SECTION 3: CAPABILITIES (Header + Grid + Button) (mb-32) */}
        <div className="mb-32">
          <div className="text-center mb-12 sm:mb-14 md:mb-16 scroll-anim">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Integrated Mobile Capabilities
            </h2>
            <p className="text-gray-200/75 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed px-4">
              We integrate essential, high-performance features into every app to ensure
              reliability, top-tier security, and seamless user engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 mb-8 sm:mb-10 md:mb-12">
            {capabilities.map((cap, index) => (
              <div
                key={index}
                className="p-6 sm:p-7 md:p-8 rounded-3xl bg-slate-900/45 border border-slate-700/50 backdrop-blur-md shadow-md transition-colors duration-500 scroll-anim group hover:border-cyan-500/30 hover:bg-slate-900/55"
              >
                <div
                  className={`mb-6 w-14 h-14 rounded-full flex items-center justify-center border border-slate-700/50 transition-all duration-500 ${cap.bgColor} ${cap.borderColor} text-white text-2xl group-hover:bg-cyan-500/20 group-hover:border-cyan-400`}
                >
                  {cap.icon}
                </div>

                <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-cyan-400 transition-colors duration-500">
                  {cap.title}
                </h3>

                <p className="text-gray-200/80 text-sm leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center scroll-anim">
            <Link href="/pricing">
              <button className="group inline-flex items-center gap-2 px-8 py-3 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 text-black text-sm font-bold transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.45)]">
                Explore All Features
              </button>
            </Link>
          </div>
        </div>

        {/* SECTION 4: PARTNER CALLOUT (mb-32) */}
        <div className="p-6 sm:p-8 md:p-12 lg:p-16 rounded-[2.5rem] bg-slate-900/45 border border-slate-800/70 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10 md:gap-12 mb-20 sm:mb-24 md:mb-32 scroll-anim shadow-lg hover:border-cyan-500/25 transition-colors">
          <div className="max-w-xl text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-5 md:mb-6 leading-snug">
              Partner for Flawless Delivery
            </h2>
            <p className="text-gray-200/80 text-base md:text-lg leading-relaxed">
              We handle the entire development lifecycle—from initial concept and strategic planning
              to final App Store acceptance and post-launch optimization.
            </p>
          </div>

          <Link href="/contact">
            <button className="group inline-flex items-center gap-2 px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base rounded-full bg-linear-to-r from-blue-500 to-cyan-400 text-black font-bold transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.45)] whitespace-nowrap">
              Schedule a Consultation{" "}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        {/* SECTION 5: PILLARS */}
        <div className="scroll-anim">
          <div className="text-center mb-12 sm:mb-14 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              The Core Pillars of Our Delivery
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className="p-6 sm:p-7 md:p-8 rounded-3xl bg-slate-900/35 border border-slate-800/60 text-left space-y-4 sm:space-y-5 scroll-anim transition-all duration-500 ease-out transform hover:-translate-y-1 hover:bg-slate-900/50 hover:border-cyan-500/40 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-slate-800/60 rounded-2xl transition-colors duration-500 group-hover:bg-cyan-500/20">
                    {pillar.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight transition-colors duration-500 group-hover:text-cyan-400">
                    {pillar.title}
                  </h3>
                </div>

                <div className="space-y-2">
                  <h4 className="text-cyan-400 text-md font-bold">{pillar.subTitle}</h4>
                  <p className="text-gray-200/75 text-sm leading-relaxed transition-colors duration-500 group-hover:text-gray-100/90">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Local CSS (allowed in JSX) ===== */}
      <style jsx global>{`
        /* scroll reveal helper (works with your observer) */
        .scroll-anim {
          opacity: 0;
          transform: translateY(18px);
          transition:
            opacity 700ms ease,
            transform 700ms ease;
          will-change: opacity, transform;
        }
        .scroll-anim.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* particles */
        .app-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-repeat: repeat;
          filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.22));
        }
        .app-p1 {
          background-image:
            radial-linear(circle, rgba(255, 255, 255, 0.8) 1px, transparent 2px),
            radial-linear(circle, rgba(34, 211, 238, 0.75) 1px, transparent 2px),
            radial-linear(circle, rgba(59, 130, 246, 0.65) 1px, transparent 2px);
          background-size:
            220px 220px,
            280px 280px,
            360px 360px;
          background-position:
            0 0,
            60px 90px,
            140px 180px;
          opacity: 0.45;
          animation:
            appParticleDrift 12s ease-in-out infinite,
            appTwinkle 4.5s ease-in-out infinite;
        }
        .app-p2 {
          background-image:
            radial-linear(circle, rgba(34, 211, 238, 0.55) 1px, transparent 2px),
            radial-linear(circle, rgba(255, 255, 255, 0.55) 1px, transparent 2px);
          background-size:
            420px 420px,
            520px 520px;
          background-position:
            90px 60px,
            220px 140px;
          opacity: 0.28;
          filter: drop-shadow(0 0 14px rgba(59, 130, 246, 0.22));
          animation:
            appParticleDrift 16s ease-in-out infinite,
            appTwinkle 7s ease-in-out infinite;
        }
        .app-p3 {
          background-image:
            radial-linear(circle, rgba(59, 130, 246, 0.45) 1px, transparent 2px),
            radial-linear(circle, rgba(34, 211, 238, 0.35) 1px, transparent 2px);
          background-size:
            620px 620px,
            780px 780px;
          background-position:
            140px 260px,
            300px 420px;
          opacity: 0.18;
          filter: drop-shadow(0 0 16px rgba(34, 211, 238, 0.18));
          animation:
            appParticleDrift 20s ease-in-out infinite,
            appTwinkle 9s ease-in-out infinite;
        }

        @keyframes appTwinkle {
          0%,
          100% {
            opacity: 0.18;
            transform: translateY(0);
          }
          50% {
            opacity: 0.62;
            transform: translateY(-6px);
          }
        }
        @keyframes appParticleDrift {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(18px, -12px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        /* background motion */
        @keyframes appFloat1 {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(18px, 14px, 0) scale(1.03);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes appFloat2 {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-18px, -12px, 0) scale(1.04);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes appSweep1 {
          0% {
            transform: translateX(-50%) translateY(0) rotate(12deg);
            opacity: 0.28;
          }
          50% {
            transform: translateX(-50%) translateY(12px) rotate(12deg);
            opacity: 0.55;
          }
          100% {
            transform: translateX(-50%) translateY(0) rotate(12deg);
            opacity: 0.28;
          }
        }
        @keyframes appSweep2 {
          0% {
            transform: translateX(-50%) translateY(0) rotate(-12deg);
            opacity: 0.24;
          }
          50% {
            transform: translateX(-50%) translateY(-14px) rotate(-12deg);
            opacity: 0.52;
          }
          100% {
            transform: translateX(-50%) translateY(0) rotate(-12deg);
            opacity: 0.24;
          }
        }
        @keyframes appGlowPulse {
          0%,
          100% {
            opacity: 0.45;
            filter: blur(30px);
          }
          50% {
            opacity: 0.78;
            filter: blur(42px);
          }
        }

        .animate-appFloat1 {
          animation: appFloat1 10s ease-in-out infinite;
        }
        .animate-appFloat2 {
          animation: appFloat2 12s ease-in-out infinite;
        }
        .animate-appSweep1 {
          animation: appSweep1 9s ease-in-out infinite;
        }
        .animate-appSweep2 {
          animation: appSweep2 10s ease-in-out infinite;
        }
        .animate-appGlowPulse {
          animation: appGlowPulse 3.5s ease-in-out infinite;
        }

        /* accessibility */
        @media (prefers-reduced-motion: reduce) {
          .scroll-anim,
          .app-particles,
          .animate-appFloat1,
          .animate-appFloat2,
          .animate-appSweep1,
          .animate-appSweep2,
          .animate-appGlowPulse {
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
          .scroll-anim {
            opacity: 1 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AppDevelopment;
