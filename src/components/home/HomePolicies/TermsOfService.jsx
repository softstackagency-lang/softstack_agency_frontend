"use client";

import React, { useMemo } from "react";
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale, UserX } from "lucide-react";
import { useRestartAnimations } from "@/hooks/useRestartAnimations";

export default function TermsOfService() {
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
            <FileText size={16} />
            Legal Agreement
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Terms of{" "}
            <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Service
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          <Section
            icon={<CheckCircle className="w-6 h-6" />}
            title="Acceptance of Terms"
            content="By accessing and using SoftStack Agency services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services."
          />

          <Section
            icon={<FileText className="w-6 h-6" />}
            title="Use of Services"
            content="You agree to use our services only for lawful purposes and in accordance with these Terms. You are prohibited from using our services in any way that could damage, disable, or impair our servers or networks, or interfere with any other party's use of our services."
          />

          <Section
            icon={<Scale className="w-6 h-6" />}
            title="Intellectual Property"
            content="All content, features, and functionality of our services, including but not limited to text, graphics, logos, and software, are owned by SoftStack Agency and are protected by international copyright, trademark, and other intellectual property laws."
          />

          <Section
            icon={<UserX className="w-6 h-6" />}
            title="Account Termination"
            content="We reserve the right to terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason, including if you breach these Terms of Service."
          />

          <Section
            icon={<XCircle className="w-6 h-6" />}
            title="Limitation of Liability"
            content="In no event shall SoftStack Agency, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our services."
          />

          <Section
            icon={<AlertTriangle className="w-6 h-6" />}
            title="Disclaimer"
            content="Our services are provided 'as is' and 'as available' without any warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted, secure, or error-free."
          />

          <Section
            icon={<FileText className="w-6 h-6" />}
            title="Changes to Terms"
            content="We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. Your continued use of our services after such changes constitutes acceptance of the new Terms."
          />
        </div>

        {/* Contact */}
        <div className="mt-16 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-400 mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-gray-300">
            <p>Email: legal@softstackagency.com</p>
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
