"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight, Star, ShieldCheck, Zap, Sparkles } from "lucide-react";
import heroAnimation from "../../../../public/Shopping.json";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

const Ecommerce = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const products = [
    { id: 1, name: "Premium Laptop", price: "$1299", category: "Electronics", span: "md:col-span-2 md:row-span-2", img: "/view-3d-laptop-device-with-screen-keyboard (1).jpg" },
    { id: 2, name: "Wireless Headphones", price: "$199", category: "Audio", span: "col-span-1", img: "/headphones-displayed-against-dark-background (1).jpg" },
    { id: 3, name: "Smart Watch", price: "$299", category: "Wearable", span: "col-span-1", img: "/rendering-smart-home-device (1).jpg" },
  ];

  const features = [
    { icon: Zap, title: "Fast Delivery", desc: "Get your products delivered within 24 hours." },
    { icon: ShieldCheck, title: "Secure Payment", desc: "100% safe & encrypted transactions." },
    { icon: Star, title: "Premium Quality", desc: "Handpicked products from trusted brands." },
  ];

  const testimonials = [
    { name: "Alice Johnson", text: "Amazing service and fast delivery. Highly recommend!" },
    { name: "Mark Wilson", text: "Quality products at great prices. Loved it!" },
    { name: "Mark Wilson", text: "Quality products at great prices. Loved it!" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#05060a] text-white">
      {/* ================= GRID BACKGROUND ================= */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(circle at center, black 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 60%, transparent 100%)",
        }}
      />

      {/* ================= GLOW BACKGROUND ================= */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/3 h-130 w-130 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/15 blur-[160px]" />
        <div className="absolute top-1/3 right-1/4 h-105 w-105 rounded-full bg-cyan-400/15 blur-[140px]" />
        <div className="absolute -bottom-64 left-1/2 h-155 w-155 -translate-x-1/2 rounded-full bg-purple-500/10 blur-[180px]" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-40 pb-20">
        {/* ===== Hero Section ===== */}
        <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-2 mb-32">
          {/* ===== Left Text Content ===== */}
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1 text-sm text-blue-400"
            >
              <Sparkles size={16} />
              Summer Sale: Up to 50% Off
            </motion.span>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }} 
              className="mt-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
            >
              Driving Next-Gen{" "}
              <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                E-Commerce
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }} 
              className="mt-6 max-w-xl text-base text-gray-400 md:text-lg"
            >
              Experience the next generation of shopping. Clean, fast, and designed for the modern era with cutting-edge technology.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }} 
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <button className="group inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 px-8 py-4 text-sm font-semibold text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.45)]">
                Shop Now
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>

              <button className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/10">
                View Catalog
              </button>
            </motion.div>
          </div>

          {/* ===== Right Lottie Animation ===== */}
          <motion.div 
            className="w-full"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Player
              autoplay
              loop
              src={heroAnimation}
              className="w-full"
            />
          </motion.div>
        </div>
        {/* ===== Features Section ===== */}
        <div className="py-20">
          <h2 className="text-center text-4xl font-bold mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const IconComponent = f.icon;
              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }} 
                  className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition hover:scale-105"
                >
                  <IconComponent size={36} className="mx-auto mb-4 text-cyan-400" />
                  <h3 className="mb-2 text-xl font-bold">{f.title}</h3>
                  <p className="text-gray-400">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ===== Bento Grid Products ===== */}
        <div className="py-20">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="mb-2 text-4xl font-bold">Editor Choice</h2>
              <p className="text-gray-400">Handpicked premium products for you.</p>
            </div>
            <button className="flex items-center gap-1 font-medium text-cyan-400 hover:underline">
              View all <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid auto-rows-[300px] grid-cols-1 gap-6 md:grid-cols-3">
            {products.map((p) => (
              <motion.div 
                key={p.id} 
                whileHover={{ y: -10 }} 
                className={`${p.span} group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5`}
              >
                <img 
                  src={p.img} 
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100" 
                  alt={p.name} 
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                    {p.category}
                  </span>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{p.name}</h3>
                      <p className="font-medium text-gray-400">{p.price}</p>
                    </div>
                    <button className="translate-y-4 rounded-xl bg-white p-3 text-black opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ===== Testimonials ===== */}
        <div className="py-20">
          <h2 className="text-center text-4xl font-bold mb-12">What Our Customers Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition hover:scale-105"
              >
                {/* Decorative blur circle */}
                <div className="pointer-events-none absolute -left-2.5 -top-2.5 h-16 w-16 rounded-full bg-cyan-400/20 blur-2xl" />

                {/* Testimonial content */}
                <p className="mb-6 italic text-gray-300">{t.text}</p>

                {/* User info + icon */}
                <div className="flex items-center gap-3">
                  <Star size={20} className="text-yellow-400" />
                  <h4 className="font-bold text-white">{t.name}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ecommerce;