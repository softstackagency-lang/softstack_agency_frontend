"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Users,
  Code,
} from "lucide-react";
import Link from "next/link";
import { useRestartAnimations } from "@/hooks/useRestartAnimations";

const AboutSection = () => {
  useRestartAnimations();

  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const [particles] = useState(() => {
    return [...Array(15)].map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20,
    }));
  });

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      text: "Innovation with measurable impact",
      color: "cyan",
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Global engineering excellence",
      color: "blue",
    },
    {
      icon: <Code className="w-5 h-5" />,
      text: "Cutting-edge technologies & best practices",
      color: "purple",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      {/* Background Animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-cyan-500/40 blur-3xl animate-float-slow"></div>
        <div className="absolute right-10 bottom-20 h-96 w-96 rounded-full bg-blue-500/35 blur-3xl animate-float-slower"></div>
        <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/30 blur-3xl animate-float-reverse"></div>

        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-cyan-400/30 animate-float-random"
            style={{
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div
            className={`space-y-8 transform transition-all duration-1000 ${isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-20 opacity-0"
              }`}
          >
            <div className="inline-flex animate-fade-in items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <span className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
                About Adventiq Labs
              </span>
            </div>

            <div>
              <h2 className="mb-4 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
                <span className="text-white">Driving </span>
                <span className="relative inline-block">
                  <span className="relative z-10 bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
                    Next-Gen
                  </span>
                  <div className="absolute -inset-2 -z-10 animate-pulse bg-linear-to-r from-cyan-500/20 to-blue-500/20 blur-xl"></div>
                </span>
              </h2>
              <h2 className="text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
                <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Innovation
                </span>
              </h2>
            </div>

            <p className="max-w-xl text-lg leading-relaxed text-gray-400">
              Crafting intelligent software solutions that power global
              businesses.
            </p>

            <p className="max-w-xl leading-relaxed text-gray-400">
              At Adventiq Labs, we combine strategy, creativity, and
              cutting-edge technology to build scalable, impactful solutions.
              Our global team of engineers brings innovation to life, shaping
              the future of digital experiences.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 rounded-xl border p-4 transition-all duration-500 transform ${activeFeature === index
                    ? "scale-105 border-cyan-500/30 bg-linear-to-r from-cyan-500/10 to-blue-500/10"
                    : "border-slate-700/30 bg-slate-800/30 hover:border-cyan-500/20"
                    }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-500 ${activeFeature === index
                      ? "bg-linear-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50"
                      : "bg-slate-700"
                      }`}
                  >
                    {activeFeature === index ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <div className="text-cyan-400">{feature.icon}</div>
                    )}
                  </div>
                  <span
                    className={`text-base font-medium transition-colors duration-500 sm:text-lg ${activeFeature === index ? "text-white" : "text-gray-400"
                      }`}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Link href="/pricing">
                <button className="group inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 px-8 py-4 font-semibold text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.45)]">
                  Get Started
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>

              <Link href="/contact">
                <button className="group rounded-xl border-2 border-slate-700 px-8 py-4 font-semibold text-white transition-all duration-300 hover:border-cyan-500 hover:bg-cyan-500/5">
                  <span className="flex items-center justify-center">
                    Learn More
                    <TrendingUp className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Content - Real Video */}
          <div
            className={`transform transition-all duration-1000 delay-300 ${isVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-20 opacity-0"
              }`}
          >
            <div className="relative group">
              <div className="absolute -inset-4 animate-pulse-slow rounded-3xl bg-linear-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 blur-2xl opacity-50 transition-opacity duration-500 group-hover:opacity-75"></div>

              <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-linear-to-r from-slate-800 to-slate-900 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                <div className="relative aspect-video bg-slate-800">
                  <video
                    className="h-full w-full object-cover"
                    src="/video.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                  />

                  {/* Overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-slate-950/10"></div>

                  {/* Bottom Label */}
                  <div className="absolute bottom-4 left-4 rounded-lg bg-black/50 px-3 py-1 backdrop-blur-sm">
                    <span className="text-sm font-medium text-white">
                      Adventiq Labs Showcase
                    </span>
                  </div>

                  {/* Decorative Corners */}
                  <div className="absolute top-4 left-4 h-12 w-12 rounded-tl-lg border-t-2 border-l-2 border-cyan-500/50"></div>
                  <div className="absolute top-4 right-4 h-12 w-12 rounded-tr-lg border-t-2 border-r-2 border-blue-500/50"></div>
                  <div className="absolute bottom-4 left-4 h-12 w-12 rounded-bl-lg border-b-2 border-l-2 border-cyan-500/50"></div>
                  <div className="absolute right-4 bottom-4 h-12 w-12 rounded-br-lg border-r-2 border-b-2 border-blue-500/50"></div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-3 -left-1 animate-float-up-down rounded-lg border border-cyan-500/30 bg-slate-800/90 p-1.5 sm:p-4 shadow-2xl backdrop-blur-xl sm:-bottom-6 sm:-left-6">
                <div className="flex items-center space-x-1.5 sm:space-x-3">
                  <div className="flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-md sm:rounded-lg bg-linear-to-br from-cyan-500 to-blue-600">
                    <TrendingUp className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white sm:text-2xl leading-none">
                      500+
                    </div>
                    <div className="text-[8px] sm:text-xs text-gray-400 mt-0.5 leading-none">
                      Projects Delivered
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-3 -right-1 animate-float-up-down-delayed rounded-lg border border-blue-500/30 bg-slate-800/90 p-1.5 sm:p-4 shadow-2xl backdrop-blur-xl sm:-top-6 sm:-right-6">
                <div className="flex items-center space-x-1.5 sm:space-x-3">
                  <div className="flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-md sm:rounded-lg bg-linear-to-br from-blue-500 to-purple-600">
                    <Users className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white sm:text-2xl leading-none">
                      98%
                    </div>
                    <div className="text-[8px] sm:text-xs text-gray-400 mt-0.5 leading-none">
                      Client Satisfaction
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-slower {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes float-random {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          25% {
            opacity: 0.5;
          }
          50% {
            transform: translateY(-100px) translateX(50px);
            opacity: 1;
          }
          75% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-200px) translateX(0);
            opacity: 0;
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float-up-down {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float-up-down-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }

        .animate-float-random {
          animation: float-random linear infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-float-up-down {
          animation: float-up-down 3s ease-in-out infinite;
        }

        .animate-float-up-down-delayed {
          animation: float-up-down-delayed 3s ease-in-out infinite 1s;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .bg-grid-pattern {
          background-image: linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </section>
  );
};

export default AboutSection;