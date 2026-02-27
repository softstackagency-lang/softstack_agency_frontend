"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  Smartphone,
  Bot,
  Globe2,
  Server,
  Zap,
} from "lucide-react";
import Link from "next/link";

const HomecardSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      id: 1,
      icon: Code2,
      title: "Custom Web Development",
      gradient: "from-purple-500 via-pink-500 to-red-500",
      iconBg: "bg-purple-500/20",
      link: "/web-development",
      features: [
        "React, Next.js & modern frameworks",
        "Progressive Web Apps (PWA)",
        "Server-side rendering (SSR)",
        "RESTful & GraphQL APIs",
        "Microservices architecture",
        "Cloud deployment & DevOps",
      ],
    },
    {
      id: 2,
      icon: Smartphone,
      title: "App Development",
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      iconBg: "bg-blue-500/20",
      link: "/app-development",
      features: [
        "Native iOS (Swift) & Android (Kotlin)",
        "Cross-platform (Flutter, React Native)",
        "Real-time data synchronization",
        "Offline-first architecture",
        "In-app payments & monetization",
        "App Store & Play Store deployment",
      ],
    },
    {
      id: 3,
      icon: Bot,
      title: "AI Agent Development",
      gradient: "from-emerald-500 via-green-500 to-lime-500",
      iconBg: "bg-emerald-500/20",
      link: "/ai-agents",
      features: [
        "GPT-4, Claude & custom LLM integration",
        "Natural language processing (NLP)",
        "Computer vision & image recognition",
        "Intelligent automation & workflows",
        "Context-aware conversational AI",
        "Multi-channel deployment (Web, Slack, Discord)",
      ],
    },
    {
      id: 4,
      icon: Globe2,
      title: "WordPress Development",
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      iconBg: "bg-indigo-500/20",
      link: "/contact",
      features: [
        "Custom theme development (Gutenberg-ready)",
        "Advanced Custom Fields (ACF) integration",
        "WooCommerce customization",
        "Headless WordPress with REST API",
        "Performance optimization (caching, CDN)",
        "Multi-language & accessibility support",
      ],
    },
    {
      id: 5,
      icon: Server,
      title: "Domain & Hosting",
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      iconBg: "bg-orange-500/20",
      link: "/contact",
      features: [
        "Domain registration & DNS management",
        "AWS, Azure & Google Cloud hosting",
        "Auto-scaling & load balancing",
        "SSL certificates & HTTPS enforcement",
        "Daily backups & disaster recovery",
        "99.9% uptime SLA guarantee",
      ],
    },
    {
      id: 6,
      icon: Zap,
      title: "Digital Solutions",
      gradient: "from-rose-500 via-red-500 to-pink-500",
      iconBg: "bg-rose-500/20",
      link: "/contact",
      features: [
        "SEO & content marketing strategies",
        "Social media management & ads",
        "Conversion rate optimization (CRO)",
        "Marketing automation & CRM integration",
        "Analytics & performance tracking",
        "E-commerce solutions (Shopify, WooCommerce)",
      ],
    },
  ];

  return (
    <section className="relative py-20 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* glow bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white">
            Services We{" "}
            <span className="bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Offer
            </span>
          </h2>
          <p className="text-slate-400 mt-5 max-w-2xl mx-auto">
            Transform your digital presence with powerful modern solutions
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const active = hoveredCard === service.id;

            return (
              <div
                key={service.id}
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div
                  className={`relative h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-all duration-500 hover:shadow-2xl ${
                    active ? "scale-[1.05]" : ""
                  }`}
                >
                  {/* glow */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-linear-to-br ${service.gradient} opacity-0 blur-xl transition-opacity duration-500 ${
                      active ? "opacity-20" : ""
                    }`}
                  />

                  {/* icon */}
                  <div
                    className={`${service.iconBg} w-16 h-16 rounded-xl flex items-center justify-center mb-6 relative z-10`}
                  >
                    <Icon
                      className={`w-8 h-8 text-white transition-transform duration-500 ${
                        active ? "scale-110 rotate-6" : ""
                      }`}
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 relative z-10">
                    {service.title}
                  </h3>

                  <ul className="space-y-3 relative z-10">
                    {service.features.map((f, i) => (
                      <li
                        key={i}
                        className={`text-sm text-slate-300 transition-all duration-300 ${
                          active ? "translate-x-1 text-white" : ""
                        }`}
                      >
                        • {f}
                      </li>
                    ))}
                  </ul>

                  <Link 
                    href={service.link}
                    className={`relative z-20 mt-8 w-full py-3 rounded-xl font-semibold bg-linear-to-r ${service.gradient} text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        {/* ================= CTA ================= */}
<div className="text-center mt-20">
  <Link href="/pricing">
  
  </Link>
</div>


      </div>
    </section>
  );
};

export default HomecardSection;
