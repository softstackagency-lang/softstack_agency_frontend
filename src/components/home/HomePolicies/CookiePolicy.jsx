"use client";

import React, { useMemo } from "react";
import { Cookie, Settings, Trash2, Eye, Clock, CheckSquare } from "lucide-react";
import { useRestartAnimations } from "@/hooks/useRestartAnimations";

export default function CookiePolicy() {
  // Restart animations when component mounts
  useRestartAnimations();

  // Generate stable deterministic values for particles
  const particles = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      top: (i * 17 + 23) % 100,
      left: (i * 31 + 47) % 100,
      delay: (i * 0.7) % 5,
      duration: 10 + ((i * 3) % 20)
    }));
  }, []);

  return (
    <main className="relative min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
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

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-sm font-semibold mb-6">
            <Cookie size={16} />
            Data & Privacy
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Cookie{" "}
            <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Policy
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          <Section
            icon={<Cookie className="w-6 h-6" />}
            title="What Are Cookies"
            content="Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing how you use our site, and providing personalized content."
          />

          <Section
            icon={<CheckSquare className="w-6 h-6" />}
            title="Types of Cookies We Use"
            content="We use essential cookies (necessary for the website to function), performance cookies (to analyze how visitors use our site), functional cookies (to remember your preferences), and targeting cookies (to provide relevant advertising). You can manage your cookie preferences at any time."
          />

          <Section
            icon={<Eye className="w-6 h-6" />}
            title="How We Use Cookies"
            content="We use cookies to authenticate users, remember user preferences and settings, analyze site traffic and usage patterns, provide personalized content and advertisements, and improve our services based on user behavior and feedback."
          />

          <Section
            icon={<Clock className="w-6 h-6" />}
            title="Cookie Duration"
            content="Session cookies are temporary and are deleted when you close your browser. Persistent cookies remain on your device until they expire or you delete them. The duration varies depending on the type and purpose of the cookie."
          />

          <Section
            icon={<Settings className="w-6 h-6" />}
            title="Managing Your Cookies"
            content="You can control and manage cookies through your browser settings. You can choose to accept or reject cookies, or set your browser to notify you when a cookie is being sent. Please note that disabling certain cookies may affect the functionality of our website."
          />

          <Section
            icon={<Trash2 className="w-6 h-6" />}
            title="Deleting Cookies"
            content="You can delete cookies at any time through your browser settings. The process varies depending on your browser. Please refer to your browser's help documentation for specific instructions on how to delete cookies."
          />
        </div>

        {/* Cookie Types Table */}
        <div className="mt-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Cookie Categories</h2>
          <div className="space-y-4">
            <CookieType
              name="Essential Cookies"
              purpose="Required for basic site functionality"
              canDisable={false}
            />
            <CookieType
              name="Performance Cookies"
              purpose="Help us understand how visitors interact with our site"
              canDisable={true}
            />
            <CookieType
              name="Functional Cookies"
              purpose="Remember your preferences and settings"
              canDisable={true}
            />
            <CookieType
              name="Targeting Cookies"
              purpose="Provide relevant advertising and content"
              canDisable={true}
            />
          </div>
        </div>

        {/* Contact */}
        <div className="mt-16 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-400 mb-4">
            If you have any questions about our Cookie Policy, please contact us:
          </p>
          <div className="space-y-2 text-gray-300">
            <p>Email: privacy@softstackagency.com</p>
            <p>Address: Dhaka, Bangladesh</p>
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({ icon, title, content }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-gray-400 leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
}

function CookieType({ name, purpose, canDisable }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
      <div>
        <h3 className="font-semibold text-white mb-1">{name}</h3>
        <p className="text-sm text-gray-400">{purpose}</p>
      </div>
      <div className="text-sm">
        {canDisable ? (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full">Optional</span>
        ) : (
          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full">Required</span>
        )}
      </div>
    </div>
  );
}
