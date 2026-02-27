"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, Mail } from "lucide-react";
import Lottie from "lottie-react";
import { useLayout } from "@/context/LayoutContext";

import forgotPasswordAnim from "../../../public/Anima Bot.json";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { setShowHeader, setShowFooter } = useLayout();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setShowHeader(false);
    setShowFooter(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 0);

    return () => {
      clearTimeout(timer);
      setShowHeader(true);
      setShowFooter(true);
    };
  }, [setShowHeader, setShowFooter]);

  if (!isVisible) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Password reset link sent to ${email}`);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center p-6 md:p-10 bg-[#0b1220]">
      {/* MAIN CARD CONTAINER */}
      <div className="relative flex w-full max-w-7xl md:max-w-5xl h-full md:h-130 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(56,189,248,0.15)] border border-cyan-500/10">
        {/* LEFT SIDE: FORM AREA */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-8 md:px-16 bg-[#020617] relative z-10">
          <div className="w-full max-w-sm route-container">
            <Link
              href="/signin"
              className="flex items-center gap-2 text-cyan-400 hover:text-white mb-8 transition-colors text-sm group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Sign In
            </Link>

            <h2 className="text-3xl font-semibold text-white mb-3">Forgot Password</h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              Enter your email address and we&apos;ll send you a link to reset your password. Please
              check your inbox and spam folder.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#0b1220] border border-cyan-500/20 text-white pl-4 pr-12 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600"
                />
                <Mail
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={18}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all active:scale-[0.98] cursor-pointer"
              >
                Send Reset Link
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-xs text-gray-500 text-center">
                Remember your password?{" "}
                <Link href="/signin" className="text-cyan-400 hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: LOTTIE AREA */}
        <div className="hidden md:flex md:w-1/2 relative bg-[#0f172a] items-center justify-center overflow-hidden">
          {/* Animated Glow Backdrops */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/30 rounded-full blur-[100px] animate-float-slow" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-700" />

          {/* Background Grid Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, #22d3ee 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          <div className="relative z-10 w-full flex flex-col items-center justify-center p-12">
            {/* Lottie Animation Container */}
            <div className="w-full max-w-85 aspect-square">
              <Lottie animationData={forgotPasswordAnim} loop={true} />
            </div>

            {/* Bottom Info Card */}
            <div className="mt-8 w-full max-w-[320px]">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
                <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">
                  Security Check
                </p>
                <p className="text-white/80 text-sm">
                  We verify every request to ensure your account stays protected at all times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}