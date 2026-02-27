"use client";

import React, { useMemo } from "react";
import { Shield, Lock, Eye, UserCheck, Database, Bell } from "lucide-react";

export default function PrivacyPolicy() {
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
            <Shield size={16} />
            Legal
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Privacy{" "}
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
            icon={<Eye className="w-6 h-6" />}
            title="Information We Collect"
            content="We collect information you provide directly to us, including name, email address, phone number, and any other information you choose to provide. We also automatically collect certain information about your device when you use our services, including IP address, browser type, and usage data."
          />

          <Section
            icon={<Database className="w-6 h-6" />}
            title="How We Use Your Information"
            content="We use the information we collect to provide, maintain, and improve our services, to communicate with you, to monitor and analyze trends and usage, and to personalize your experience. We may also use your information to send you technical notices, updates, and promotional communications."
          />

          <Section
            icon={<Lock className="w-6 h-6" />}
            title="Information Sharing"
            content="We do not sell your personal information. We may share your information with third-party service providers who perform services on our behalf, such as hosting, data analysis, and customer service. We may also share information when required by law or to protect our rights."
          />

          <Section
            icon={<UserCheck className="w-6 h-6" />}
            title="Your Rights"
            content="You have the right to access, update, or delete your personal information. You may also opt out of receiving promotional communications from us. To exercise these rights, please contact us using the information provided below."
          />

          <Section
            icon={<Shield className="w-6 h-6" />}
            title="Data Security"
            content="We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure."
          />

          <Section
            icon={<Bell className="w-6 h-6" />}
            title="Changes to This Policy"
            content="We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date. We encourage you to review this Privacy Policy periodically."
          />
        </div>

        {/* Contact */}
        <div className="mt-16 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-400 mb-4">
            If you have any questions about this Privacy Policy, please contact us:
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
