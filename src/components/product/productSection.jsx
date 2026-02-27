"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Sparkles, Zap, TrendingUp, Award, Github, MessageSquare } from "lucide-react";
import { productsController } from "@/controllers";
import { useRestartAnimations } from "@/hooks/useRestartAnimations";

const safeText = (v, fallback = "") => (typeof v === "string" && v.trim() ? v.trim() : fallback);

const safeArray = (v) => (Array.isArray(v) ? v.filter(Boolean) : []);

const ProductsSection = () => {
  // Restart animations when component mounts
  useRestartAnimations();

  const [isVisible, setIsVisible] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Generate stable random values for particles
  const [particles] = useState(() => {
    return [...Array(20)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 5 + Math.random() * 10,
      delay: Math.random() * 5,
    }));
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await productsController.getProducts();

        // ✅ handle: { success:true, data:[...] }
        if (result?.success && Array.isArray(result.data)) {
          setProductsData(result.data);
          return;
        }

        // ✅ handle: { data:[...] }
        if (Array.isArray(result?.data)) {
          setProductsData(result.data);
          return;
        }

        // ✅ handle: direct array
        if (Array.isArray(result)) {
          setProductsData(result);
          return;
        }

        setProductsData([]);
      } catch (err) {
        setError(err?.message || "Failed to fetch products");
        setProductsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const products = useMemo(() => {
    const list = safeArray(productsData);

    return (
      list
        // ✅ status normalize: active / Active 
        .filter((p) => {
          if (!p?.status) return true;
          return String(p.status).toLowerCase() === "active";
        })
        .sort((a, b) => (a?.order ?? 9999) - (b?.order ?? 9999))
        .map((p, index) => {
          const title = safeText(p?.title, "Untitled Product");
          const subtitle = safeText(p?.tagline, "");
          const description = safeText(p?.description, "");

          // ✅ coverImage is object
          const imageUrl =
            safeText(p?.coverImage?.url, "") ||
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop";
          const imageAlt = safeText(p?.coverImage?.alt, title);

          // ✅ badge object
          const badgeLabel = safeText(p?.badge?.label, "");

          // ✅ highlights array -> tags (label: value)
          const tags = safeArray(p?.highlights)
            .map((h) => {
              const label = safeText(h?.label, "");
              const value = safeText(h?.value, "");
              if (label && value) return `${label}: ${value}`;
              return label || value;
            })
            .filter(Boolean)
            .slice(0, 4);

          // ✅ features array
          const features = safeArray(p?.features).slice(0, 5);

          // ✅ CTA
          const ctaText = safeText(p?.cta?.text, "Explore Project");
          const ctaUrl = safeText(p?.cta?.url, "") || safeText(p?.liveLink, "") || "#";

          // ✅ theme is object with colors
          const gradientFrom = safeText(p?.theme?.gradientFrom, "#6366F1");
          const gradientTo = safeText(p?.theme?.gradientTo, "#8B5CF6");

          // Optional links
          const liveLink = safeText(p?.liveLink, "");
          const repoLink = safeText(p?.repoLink, "");

          return {
            id: p?._id || p?.slug || String(index),
            title,
            subtitle,
            description,
            imageUrl,
            imageAlt,
            badgeLabel,
            tags,
            features,
            ctaText,
            ctaUrl,
            gradientFrom,
            gradientTo,
            liveLink,
            repoLink,
          };
        })
    );
  }, [productsData]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-500 rounded-full opacity-20"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-12 sm:mb-16 md:mb-20 transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
            <span className="text-purple-300 text-xs sm:text-sm font-medium">Premium Solutions</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tight px-4">
            Our
            <span className="bg-linear-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              {" "}
              Projects
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4">
            Transforming ideas into powerful AI solutions
          </p>

          <div className="flex justify-center gap-2 mt-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-purple-500"
                style={{
                  animation: "pulse-dot 1.5s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>

          {/* Debug Info */}
        
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
          {products.map((product, index) => {
            const isHovered = hoveredProduct === product.id;

            return (
              <div
                key={product.id}
                className={`transition-all duration-1000 transform ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onMouseMove={handleMouseMove}
              >
                <div className="group relative h-full">
                  {/* Glow Effect */}
                  {isHovered && (
                    <div
                      className="absolute inset-0 opacity-20 blur-3xl transition-opacity duration-500 rounded-3xl"
                      style={{
                        background: `linear-gradient(90deg, ${product.gradientFrom}, ${product.gradientTo})`,
                      }}
                    />
                  )}

                  <div
                    className={`relative bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden transition-all duration-500 h-full ${
                      isHovered ? "scale-105 border-slate-600 shadow-2xl" : ""
                    }`}
                  >
                    {/* Spotlight */}
                    {isHovered && (
                      <div
                        className="absolute inset-0 opacity-30 pointer-events-none transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
                        }}
                      />
                    )}

                    {/* Image */}
                    <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-40 mix-blend-multiply transition-opacity duration-500 z-10"
                        style={{
                          background: `linear-gradient(135deg, ${product.gradientFrom}, ${product.gradientTo})`,
                          opacity: isHovered ? 0.6 : 0.4,
                        }}
                      />

                      <Image
                        src={product.imageUrl}
                        alt={product.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={`object-cover transition-transform duration-700 ${
                          isHovered ? "scale-110" : "scale-100"
                        }`}
                      />

                      {/* Tags (highlights) */}
                      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-wrap gap-1 sm:gap-2 z-20">
                        {product.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 sm:px-3 sm:py-1 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-full text-[10px] sm:text-xs text-slate-300 transition-all duration-300 ${
                              isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                            }`}
                            style={{ transitionDelay: `${idx * 100}ms` }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Badge */}
                      {product.badgeLabel && (
                        <div className="absolute top-4 right-4 z-20">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 border border-slate-700 text-white/90">
                            {product.badgeLabel}
                          </span>
                        </div>
                      )}

                      {/* Corner Icon */}
                      <div
                        className={`absolute bottom-4 right-4 z-20 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                          isHovered ? "rotate-12 scale-110" : ""
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${product.gradientFrom}, ${product.gradientTo})`,
                        }}
                      >
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 md:p-8">
                      <h2
                        className={`text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 transition-all duration-300 ${
                          isHovered
                            ? "bg-linear-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent"
                            : ""
                        }`}
                      >
                        {product.title}
                      </h2>

                      <p className="text-slate-400 text-sm mb-4 font-medium">{product.subtitle}</p>

                      <p className="text-slate-300 leading-relaxed mb-6">{product.description}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        {[
                          { icon: TrendingUp, label: "Built for Growth", value: "Scalable" },
                          { icon: Award, label: "Production Ready", value: "Quality" },
                        ].map((stat, idx) => {
                          const Icon = stat.icon;
                          return (
                            <div
                              key={idx}
                              className={`bg-slate-900/50 rounded-xl p-3 sm:p-4 border border-slate-700/50 transition-all duration-500 ${
                                isHovered ? "border-purple-500/50 translate-x-1" : ""
                              }`}
                              style={{ transitionDelay: `${idx * 100}ms` }}
                            >
                              <Icon className="w-5 h-5 mb-2 text-purple-300" />
                              <div className="text-white font-bold text-sm">{stat.value}</div>
                              <div className="text-slate-400 text-xs">{stat.label}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Features */}
                      <div className="space-y-2 mb-6">
                        {product.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-3 text-slate-300 text-sm transition-all duration-500 ${
                              isHovered ? "translate-x-2" : ""
                            }`}
                            style={{ transitionDelay: `${idx * 50}ms` }}
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background: `linear-gradient(90deg, ${product.gradientFrom}, ${product.gradientTo})`,
                              }}
                            />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Live + Repo links */}
                      {(product.liveLink || product.repoLink) && (
                        <div className="flex gap-2 mb-4">
                          {product.liveLink && (
                            <a
                              href={product.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 rounded-xl border border-slate-700/60 bg-slate-900/40 px-4 py-3 text-sm text-slate-200 hover:bg-slate-900/60 transition flex items-center justify-center gap-2"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Live
                            </a>
                          )}
                          {product.repoLink && (
                            <a
                              href={product.repoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 rounded-xl border border-slate-700/60 bg-slate-900/40 px-4 py-3 text-sm text-slate-200 hover:bg-slate-900/60 transition flex items-center justify-center gap-2"
                            >
                              <Github className="w-4 h-4" />
                              Repo
                            </a>
                          )}
                        </div>
                      )}

                      {/* Contact to Get Project Button */}
                      <Link href="/contact">
                        <button className="w-full mb-4 py-3 rounded-xl border-2 border-blue-500/50 bg-blue-500/10 text-blue-400 font-semibold hover:bg-blue-500/20 hover:border-blue-400 transition-all flex items-center justify-center gap-2 group">
                          <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          Contact to Get Project
                        </button>
                      </Link>

                      {/* CTA */}
                      <a
                        href={product.ctaUrl}
                        target={String(product.ctaUrl).startsWith("http") ? "_blank" : undefined}
                        rel={
                          String(product.ctaUrl).startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className={`group/btn w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-2xl flex items-center justify-center gap-2 overflow-hidden relative ${
                          isHovered ? "scale-105" : ""
                        }`}
                        style={{
                          background: `linear-gradient(90deg, ${product.gradientFrom}, ${product.gradientTo})`,
                        }}
                      >
                        <span className="relative z-10">{product.ctaText}</span>
                        <ExternalLink className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                      </a>
                    </div>

                    {/* Bottom Gradient Line */}
                    <div
                      className={`h-1 transition-all duration-500 ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        background: `linear-gradient(90deg, ${product.gradientFrom}, ${product.gradientTo})`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="mt-10 text-center">
            <p className="text-slate-400">No active products found.</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div
          className={`text-center mt-12 sm:mt-16 md:mt-20 transition-all duration-1000 delay-500 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <p className="text-slate-400 mb-4 sm:mb-6 text-base sm:text-lg px-4">Ready to transform your business?</p>
          <Link href="/pricing">
            <button className="group relative px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-linear-to-r from-blue-500 to-cyan-400 rounded-full text-black font-bold text-sm sm:text-base md:text-lg shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.45)] transition-all duration-500 hover:scale-110 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Get Started Now
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.4;
          }
        }

        @keyframes grid-move {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(50px);
          }
        }

        @keyframes pulse-dot {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductsSection;
