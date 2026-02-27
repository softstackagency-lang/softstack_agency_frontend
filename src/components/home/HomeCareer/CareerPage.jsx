"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRestartAnimations } from "@/hooks/useRestartAnimations";
import demoController from "@/controllers/demoController";
import {
  ArrowRight,
  Code2,
  PenTool,
  BadgeCheck,
  TrendingUp,
  Quote,
  Mail,
  Phone,
  User,
  MessageSquare,
  Sparkles,
  X,
} from "lucide-react";

// ================== LOTTIE (SSR SAFE) ==================
const Player = dynamic(
  () =>
    import("@lottiefiles/react-lottie-player").then(
      (mod) => mod.Player
    ),
  { ssr: false }
);

import careerAnimation from "../../../../public/businessman path.json";


/* ================= Data ================= */
const services = [
  {
    title: "Web Development",
    desc: "Next.js, MERN, high-performance sites.",
    icon: Code2,
    cta: "Learn More",
    details: {
      fullDescription: "We create cutting-edge web applications using the latest technologies including Next.js, React, Node.js, and MongoDB. Our focus is on building fast, scalable, and SEO-friendly websites that drive business growth.",
      features: [
        "Next.js & React Development",
        "Full-stack MERN Solutions",
        "Performance Optimization",
        "SEO-friendly Architecture",
        "Responsive Design",
        "API Integration",
        "Database Design & Management",
        "Server-side Rendering (SSR)"
      ],
      benefits: [
        "Lightning-fast load times (< 1s)",
        "95+ Lighthouse scores",
        "Scalable architecture for growth",
        "Mobile-first responsive design",
        "Secure and maintainable code"
      ],
      technologies: ["Next.js", "React", "Node.js", "MongoDB", "Express", "Tailwind CSS", "TypeScript"],
      pricing: "Starting from $2,500",
      timeline: "4-8 weeks"
    }
  },
  {
    title: "UI/UX Design",
    desc: "Modern UI, conversion-focused layouts.",
    icon: PenTool,
    cta: "Learn More",
    details: {
      fullDescription: "Our design team creates beautiful, intuitive interfaces that not only look amazing but also convert visitors into customers. We focus on user-centered design principles to deliver exceptional digital experiences.",
      features: [
        "User Research & Analysis",
        "Wireframing & Prototyping",
        "Visual Design & Branding",
        "Interactive Prototypes",
        "Usability Testing",
        "Design Systems",
        "Mobile App Design",
        "Conversion Optimization"
      ],
      benefits: [
        "Increased user engagement",
        "Higher conversion rates",
        "Improved user satisfaction",
        "Brand consistency",
        "Reduced development time"
      ],
      technologies: ["Figma", "Adobe XD", "Sketch", "InVision", "Principle", "Framer"],
      pricing: "Starting from $1,800",
      timeline: "2-4 weeks"
    }
  },
  {
    title: "Branding",
    desc: "Logo, brand kit, social templates.",
    icon: BadgeCheck,
    cta: "Learn More",
    details: {
      fullDescription: "We help businesses establish a strong brand identity through comprehensive branding solutions including logo design, brand guidelines, and complete visual identity systems that resonate with your target audience.",
      features: [
        "Logo Design & Variations",
        "Brand Identity Guidelines",
        "Color Palette & Typography",
        "Business Card Design",
        "Social Media Templates",
        "Marketing Collateral",
        "Brand Strategy",
        "Style Guide Creation"
      ],
      benefits: [
        "Professional brand presence",
        "Stand out from competitors",
        "Consistent brand messaging",
        "Ready-to-use templates",
        "Increased brand recognition"
      ],
      technologies: ["Adobe Illustrator", "Photoshop", "InDesign", "Canva Pro"],
      pricing: "Starting from $1,200",
      timeline: "2-3 weeks"
    }
  },
  {
    title: "SEO & Marketing",
    desc: "On-page SEO, performance growth.",
    icon: TrendingUp,
    cta: "Learn More",
    details: {
      fullDescription: "Drive organic traffic and improve your search engine rankings with our comprehensive SEO and digital marketing services. We use data-driven strategies to boost your online visibility and generate quality leads.",
      features: [
        "Technical SEO Audit",
        "On-page Optimization",
        "Keyword Research & Strategy",
        "Content Optimization",
        "Link Building",
        "Performance Tracking",
        "Local SEO",
        "Analytics & Reporting"
      ],
      benefits: [
        "Higher search rankings",
        "Increased organic traffic",
        "Better conversion rates",
        "Data-driven insights",
        "Long-term sustainable growth"
      ],
      technologies: ["Google Analytics", "Search Console", "SEMrush", "Ahrefs", "Moz"],
      pricing: "Starting from $800/month",
      timeline: "Ongoing (3-6 months for results)"
    }
  },
];

// Projects will be fetched from API

const testimonials = [
  {
    text: "Their team transformed our website speed in a matter of weeks. We've seen a 45% drop in bounce rate.",
    name: "Sarah L.",
    role: "Marketing Director",
  },
  {
    text: "Outstanding design work that boosted our conversions. Transparent, reliable and innovative.",
    name: "David R.",
    role: "E-commerce Manager",
  },
];

/* ================= Helpers ================= */
function useMouseParallax() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setPos({ x: e.clientX, y: e.clientY }));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);
  return pos;
}

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function makeParticles(count = 12, seed = 1337) {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    top: rand() * 100,
    left: rand() * 100,
    delay: rand() * 6,
    duration: 10 + rand() * 14,
    size: 1 + rand() * 2,
    opacity: 0.08 + rand() * 0.12,
  }));
}

/* ================= Premium Card ================= */
function GlowCard({ children, className = "" }) {
  return (
    <div className={`group relative rounded-3xl p-px ${className}`}>
      <div className="absolute inset-0 rounded-3xl bg-[radial-linear(900px_circle_at_20%_10%,rgba(34,211,238,.18),transparent_45%),linear-linear(to_right,rgba(51,65,85,.22),rgba(30,41,59,.35))] opacity-70 blur-[10px] transition-opacity duration-300 group-hover:opacity-100" />
      <div
        className={[
          "relative rounded-3xl overflow-hidden",
          "border border-white/10",
          "bg-[#0b1225]/75 backdrop-blur-2xl",
          "shadow-[0_20px_50px_rgba(0,0,0,0.35)]",
          "transition-all duration-300 ease-out",
          "group-hover:-translate-y-1 group-hover:border-cyan-200/20 group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.55)]",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute -top-28 left-1/3 h-72 w-72 rounded-full bg-cyan-400/5 blur-3xl" />
          <div className="absolute -bottom-28 right-1/4 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-linear(to_bottom,rgba(255,255,255,0.035),transparent)]" />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

/* ================= Service Modal ================= */
function ServiceModal({ service, isOpen, onClose }) {
  if (!isOpen || !service) return null;

  const Icon = service.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header */}
        <div className="relative p-8 pb-6 border-b border-white/10">
          <div className="flex items-start gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shrink-0">
              <Icon className="h-8 w-8 text-cyan-200" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{service.title}</h2>
              <p className="text-slate-300 text-lg">{service.details.fullDescription}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Features */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
              What is Included
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {service.details.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                  <span className="text-slate-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-purple-400 to-blue-500 rounded-full" />
              Key Benefits
            </h3>
            <div className="space-y-3">
              {service.details.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                  <BadgeCheck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-500 rounded-full" />
              Technologies We Use
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.details.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
              <p className="text-sm text-cyan-300 mb-2 font-semibold">Pricing</p>
              <p className="text-2xl font-bold text-white">{service.details.pricing}</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
              <p className="text-sm text-purple-300 mb-2 font-semibold">Timeline</p>
              <p className="text-2xl font-bold text-white">{service.details.timeline}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <Link 
              href="/contact"
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 text-black font-semibold transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.45)]"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Section Header ================= */
function SectionHeader({ label, title, desc }) {
  return (
    <div className="text-center space-y-4 reveal">
      {label ? (
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
            {label}
          </span>
        </div>
      ) : null}

      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
        <span className="bg-linear-to-r from-cyan-200 via-slate-100 to-blue-300 bg-clip-text text-transparent">
          {title}
        </span>
      </h2>

      {desc ? (
        <p className="text-sm md:text-base text-slate-300/90 leading-relaxed max-w-2xl mx-auto">
          {desc}
        </p>
      ) : null}
    </div>
  );
}

/* ================= Hero Micro UI ================= */
function Badge({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
      <Icon className="h-3.5 w-3.5 text-cyan-200" />
      {children}
    </span>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-lg font-semibold text-slate-50 leading-none">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-300/80">{label}</p>
    </div>
  );
}

export default function NeonAgencyLanding() {
  const mouse = useMouseParallax();
  const particles = useMemo(() => makeParticles(12, 20260201), []);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentProjects, setRecentProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const openServiceModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 300);
  };

  // Restart animations when component mounts
  useRestartAnimations();

  // Fetch latest 3 projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true);
        const res = await demoController.getProjects();
        
        const raw = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.categories)
          ? res.data.categories
          : [];

        // Flatten all projects from all categories
        const allProjects = raw.flatMap((cat) =>
          Array.isArray(cat?.projects) ? cat.projects.map((p) => ({
            id: p?.id || p?._id,
            title: p?.title || p?.name || "Untitled Project",
            image: p?.image || p?.thumbnail || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
            slug: p?.slug || p?.id || p?._id,
            previewUrl: p?.previewUrl || p?.liveUrl || "",
            categoryName: cat?.name || "Project"
          })) : []
        );

        // Get latest 3 projects
        setRecentProjects(allProjects.slice(0, 3));
      } catch (error) {
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Service Modal */}
      <ServiceModal 
        service={selectedService} 
        isOpen={isModalOpen} 
        onClose={closeServiceModal} 
      />

      {/* ================= Background Animations ================= */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/40 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/35 rounded-full blur-3xl animate-float-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-float-reverse"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Floating Elements */}
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-float-random"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              animationDelay: `${p.delay || 0}s`,
              animationDuration: `${p.duration || 15}s`
            }}
          ></div>
        ))}
      </div>

      {/* Old Background for compatibility */}
      <div className="pointer-events-none absolute inset-0">
        {/* aurora blobs */}
        <div
          className="absolute -top-40 -left-40 h-130 w-130 rounded-full bg-cyan-500/12 blur-3xl animate-aurora-slow"
          style={{ transform: `translate(${mouse.x * 0.01}px, ${mouse.y * 0.01}px)` }}
        />
        <div
          className="absolute -bottom-44 -right-44 h-155 w-155 rounded-full bg-blue-500/12 blur-3xl animate-aurora-slower"
          style={{ transform: `translate(${mouse.x * -0.01}px, ${mouse.y * -0.01}px)` }}
        />
      </div>

      {/* ================= Content ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-24 space-y-16 sm:space-y-20 md:space-y-24 lg:space-y-28">
        {/* HERO / BANNER (improved) */}
        {/* HERO / BANNER (NEW) */}
        <section className="grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center pt-12 sm:pt-14 md:pt-16 lg:pt-0">
          {/* Left */}
          <div className="lg:col-span-6 space-y-7 reveal">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,.55)]" />
              Premium agency • Clean UI • High conversion
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
              We Build Websites <br />
              <span className="bg-linear-to-r from-cyan-200 via-slate-100 to-blue-300 bg-clip-text text-transparent">
                That Look Expensive
              </span>
            </h1>

            <p className="text-slate-300/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl">
              Design-first development for brands that want premium visuals, fast performance, and
              more leads—without messy code.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-1">
              <Link href="/blog" className="btn-shine group inline-flex items-center gap-2 rounded-xl px-7 py-4 bg-linear-to-r from-blue-500 to-cyan-400 text-black transition-all font-semibold shadow-lg hover:shadow-[0_0_40px_rgba(59,130,246,0.45)]">
                Get a Free Quote
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>

              <Link href="/product" className="inline-flex items-center gap-2 rounded-xl px-7 py-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-semibold text-slate-200">
                View Work
              </Link>
            </div>

            {/* social proof */}
            <div className="pt-5 space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300/80">
                Trusted by teams & founders
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {["ROQUET", "GOLFHUB", "RSFINANCE", "NORTHBYTE"].map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200/80"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-6 reveal">
            <div className="relative flex items-center justify-center">
              {/* glow */}
              <div className="absolute -inset-10 rounded-[3rem] bg-[radial-linear(closest-side,rgba(34,211,238,.14),transparent_70%)] blur-2xl" />
              <div className="absolute -inset-14 rounded-[3rem] bg-[radial-linear(closest-side,rgba(59,130,246,.10),transparent_70%)] blur-3xl" />

              {/* Lottie Animation - Smaller Size */}
              <div className="relative w-full max-w-md h-80 md:h-96">
                <Player
                  autoplay
                  loop
                  src={careerAnimation}
                  style={{ height: '100%', width: '100%' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="space-y-10 md:space-y-12">
          <SectionHeader
            label="Services"
            title="What We Do"
            desc="High-end digital solutions crafted with precision and deep technical expertise."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <GlowCard key={i} className="h-full reveal">
                  <div className="flex h-68 flex-col justify-between p-8">
                    <div>
                      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                        <Icon className="h-7 w-7 text-cyan-200" />
                      </div>

                      <h3 className="text-lg font-semibold tracking-tight text-slate-50">
                        {s.title}
                      </h3>

                      <p className="mt-3 text-sm leading-relaxed text-slate-300/90">{s.desc}</p>
                    </div>

                    <button 
                      onClick={() => openServiceModal(s)}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-cyan-100 transition"
                    >
                      {s.cta}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </GlowCard>
              );
            })}
          </div>
        </section>

        {/* CASE STUDIES */}
        <section className="space-y-10 md:space-y-12">
          <SectionHeader
            label="Work"
            title="Recent Projects"
            desc="Real outcomes for real growing businesses."
          />

          {projectsLoading ? (
            <div className="text-center py-12">
              <p className="text-slate-300">Loading projects...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {recentProjects.length > 0 ? (
                recentProjects.map((project, i) => (
                  <GlowCard key={project.id || i} className="reveal">
                    <div className="p-5 space-y-5">
                      <div className="relative h-48 rounded-2xl overflow-hidden border border-white/10">
                        <Image 
                          src={project.image} 
                          alt={project.title} 
                          fill 
                          className="object-cover" 
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/15 to-transparent" />
                        <span className="absolute top-4 left-4 text-xs font-semibold text-cyan-100 bg-cyan-500/10 px-2 py-1 rounded border border-white/10">
                          {project.categoryName}
                        </span>
                      </div>

                      <div className="px-1">
                        <h3 className="text-lg font-semibold tracking-tight text-slate-50">
                          {project.title}
                        </h3>
                        <p className="text-sm text-slate-300/90 leading-relaxed">Slug: {project.slug}</p>

                        <div className="mt-4">
                          <button 
                            onClick={() => project.previewUrl ? window.open(project.previewUrl, "_blank") : null}
                            disabled={!project.previewUrl}
                            className={`w-full py-2.5 rounded-xl font-semibold transition-all inline-flex items-center justify-center gap-2 ${
                              project.previewUrl 
                                ? "bg-linear-to-r from-cyan-400 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/30" 
                                : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            Go Live <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-slate-300">No projects available</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* TESTIMONIALS */}
        <section className="space-y-10 md:space-y-12">
          <SectionHeader
            label="Proof"
            title="Client Success"
            desc="What people say after working with us."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <GlowCard key={i} className="reveal">
                <div className="p-10">
                  <Quote className="w-8 h-8 text-white/20 mb-6" />
                  <p className="text-slate-200/95 text-base md:text-lg italic leading-relaxed">
                    {t.text}
                  </p>

                  <div className="mt-8 flex items-center gap-4">
                    <div className="h-1 bg-linear-to-r from-cyan-400 to-blue-500 w-10 rounded-full" />
                    <div>
                      <p className="font-semibold text-slate-50">{t.name}</p>
                      <p className="text-xs text-slate-300 uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </section>

        {/* COMPANY INFO SECTION */}
        <section className="space-y-10 md:space-y-12">
          <SectionHeader 
            label="About Us" 
            title="Why Choose SoftStack Agency" 
            desc="Leading the way in innovative digital solutions with expertise and dedication." 
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {/* Company Stats */}
            <GlowCard className="reveal">
              <div className="p-8 space-y-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                  <TrendingUp className="h-7 w-7 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">500+</h3>
                  <p className="text-sm text-slate-300 mb-1 font-semibold">Projects Completed</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Successfully delivered projects across web development, design, and digital marketing
                  </p>
                </div>
              </div>
            </GlowCard>

            <GlowCard className="reveal">
              <div className="p-8 space-y-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <BadgeCheck className="h-7 w-7 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">98%</h3>
                  <p className="text-sm text-slate-300 mb-1 font-semibold">Client Satisfaction</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Our clients trust us for quality work, timely delivery, and exceptional support
                  </p>
                </div>
              </div>
            </GlowCard>

            <GlowCard className="reveal">
              <div className="p-8 space-y-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20">
                  <Code2 className="h-7 w-7 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">5+</h3>
                  <p className="text-sm text-slate-300 mb-1 font-semibold">Years Experience</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Industry veterans with deep expertise in modern web technologies and frameworks
                  </p>
                </div>
              </div>
            </GlowCard>
          </div>

          {/* Company Values */}
          <GlowCard className="reveal">
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
                      <Sparkles className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">Our Mission</h3>
                    <p className="text-slate-300 leading-relaxed">
                      To empower businesses with cutting-edge digital solutions that drive growth, enhance user experiences, and deliver measurable results. We believe in creating technology that makes a difference.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4">
                      <BadgeCheck className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">Our Approach</h3>
                    <p className="text-slate-300 leading-relaxed">
                      We combine technical expertise with creative innovation to deliver solutions that exceed expectations. Every project is treated with care, attention to detail, and a commitment to excellence.
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10 my-8" />

              {/* Core Values */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-6 text-center">Our Core Values</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl mb-2">🎯</div>
                    <p className="text-sm font-semibold text-slate-200 mb-1">Quality First</p>
                    <p className="text-xs text-slate-400">Excellence in every detail</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl mb-2">⚡</div>
                    <p className="text-sm font-semibold text-slate-200 mb-1">Innovation</p>
                    <p className="text-xs text-slate-400">Pushing boundaries daily</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl mb-2">🤝</div>
                    <p className="text-sm font-semibold text-slate-200 mb-1">Partnership</p>
                    <p className="text-xs text-slate-400">Your success is our goal</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl mb-2">🚀</div>
                    <p className="text-sm font-semibold text-slate-200 mb-1">Results</p>
                    <p className="text-xs text-slate-400">Measurable outcomes</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10 my-8" />

              {/* Technologies & Expertise */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-6 text-center">Technologies We Master</h3>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {['Next.js', 'React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'Figma', 'AWS', 'Docker', 'Firebase', 'PostgreSQL', 'GraphQL'].map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-xs sm:text-sm text-slate-300 font-medium hover:border-cyan-400/40 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </GlowCard>
        </section>
      </div>
    </div>
  );
}
