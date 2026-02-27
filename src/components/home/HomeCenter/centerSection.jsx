"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Play, CheckCircle, Sparkles, TrendingUp, Users, Code } from 'lucide-react';
import Link from 'next/link';
import { useRestartAnimations } from '@/hooks/useRestartAnimations';

 const AboutSection = ()=> {
  // Restart animations when component mounts
  useRestartAnimations();

  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

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
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { 
      icon: <Sparkles className="w-5 h-5" />, 
      text: 'Innovation with measurable impact',
      color: 'cyan'
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      text: 'Global engineering excellence',
      color: 'blue'
    },
    { 
      icon: <Code className="w-5 h-5" />, 
      text: 'Cutting-edge technologies & best practices',
      color: 'purple'
    }
  ];

  return (
    <section className="relative min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden py-20 px-4">
      
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

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            
            {/* Label */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full backdrop-blur-sm animate-fade-in">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">About Adventiq Labs</span>
            </div>

            {/* Main Heading */}
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                <span className="text-white">Driving </span>
                <span className="relative inline-block">
                  <span className="relative z-10 bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
                    Next-Gen
                  </span>
                  <div className="absolute -inset-2 bg-linear-to-r from-cyan-500/20 to-blue-500/20 blur-xl -z-10 animate-pulse"></div>
                </span>
              </h2>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Innovation
                </span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              Crafting intelligent software solutions that power global businesses.
            </p>

            <p className="text-gray-400 leading-relaxed max-w-xl">
              At Adventiq Labs, we combine strategy, creativity, and cutting-edge technology to build scalable, impactful solutions. Our global team of engineers brings innovation to life, shaping the future of digital experiences.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-500 transform ${
                    activeFeature === index
                      ? 'bg-linear-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 scale-105'
                      : 'bg-slate-800/30 border border-slate-700/30 hover:border-cyan-500/20'
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    activeFeature === index
                      ? 'bg-linear-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50'
                      : 'bg-slate-700'
                  } transition-all duration-500`}>
                    {activeFeature === index ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <div className="text-cyan-400">{feature.icon}</div>
                    )}
                  </div>
                  <span className={`text-base sm:text-lg font-medium transition-colors duration-500 ${
                    activeFeature === index ? 'text-white' : 'text-gray-400'
                  }`}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/pricing">
                <button className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 text-black font-semibold transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.45)]">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <Link href="/contact">
                <button className="group px-8 py-4 rounded-xl font-semibold text-white border-2 border-slate-700 hover:border-cyan-500 transition-all duration-300 hover:bg-cyan-500/5">
                  <span className="flex items-center justify-center">
                    Learn More
                    <TrendingUp className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Content - Video */}
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            <div className="relative group">
              
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-linear-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse-slow"></div>
              
              {/* Video Container */}
              <div className="relative bg-linear-to-r from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500">
                
                {/* Video Placeholder */}
                <div className="relative aspect-video bg-slate-800">
                  {/* Simulated Video Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Background Image Placeholder */}
                      <div className="absolute inset-0 bg-linear-to-r from-slate-700 via-slate-800 to-slate-900"></div>
                      
                      {/* Tech Elements Animation */}
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="absolute top-1/4 left-1/4 w-20 h-20 border-2 border-cyan-500/30 rounded-lg animate-spin-slow"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 border-2 border-blue-500/30 rounded-full animate-ping"></div>
                        
                        {/* Company Logo */}
                        <div className="relative z-10 text-center p-8">
                          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                            <h3 className="text-3xl font-bold text-white mb-2">Adventiq Labs</h3>
                            <p className="text-cyan-400 text-sm">Digital Innovation Studio</p>
                          </div>
                        </div>
                      </div>

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-300">
                        <button className="w-20 h-20 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-2xl shadow-cyan-500/50 animate-pulse-slow">
                          <Play className="w-8 h-8 text-white ml-1" fill="white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Video Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
                    <div className="h-full w-1/3 bg-linear-to-r from-cyan-500 to-blue-500 animate-progress"></div>
                  </div>

                  {/* Video Time */}
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-lg">
                    <span className="text-white text-sm font-mono">0:00 / 0:16</span>
                  </div>

                  {/* Video Controls Icons */}
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <button className="w-8 h-8 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-black/80 transition-colors">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                    <button className="w-8 h-8 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-black/80 transition-colors">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Decorative Corner Elements */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg"></div>
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-blue-500/50 rounded-tr-lg"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-lg"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-blue-500/50 rounded-br-lg"></div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-slate-800/90 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 shadow-2xl animate-float-up-down">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-linear-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-xs text-gray-400">Projects Delivered</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-slate-800/90 backdrop-blur-xl border border-blue-500/30 rounded-xl p-4 shadow-2xl animate-float-up-down-delayed">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">98%</div>
                    <div className="text-xs text-gray-400">Client Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes float-random {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          25% { opacity: 0.5; }
          50% { transform: translateY(-100px) translateX(50px); opacity: 1; }
          75% { opacity: 0.5; }
          100% { transform: translateY(-200px) translateX(0); opacity: 0; }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 33%; }
        }
        @keyframes float-up-down {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-up-down-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 6s ease-in-out infinite; }
        .animate-float-random { animation: float-random linear infinite; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-progress { animation: progress 16s linear infinite; }
        .animate-float-up-down { animation: float-up-down 3s ease-in-out infinite; }
        .animate-float-up-down-delayed { animation: float-up-down-delayed 3s ease-in-out infinite 1s; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </section>
  );
}
export default AboutSection;