"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import demoController from "@/controllers/demoController" 

export default function OurProjects() {
  const [active, setActive] = useState("All")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Generate stable random values for particles
  const particles = useMemo(() => {
    return [...Array(15)].map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20
    }));
  }, []);

  // ================= FETCH DATA =================
  useEffect(() => {
    let mounted = true

    const loadProjects = async () => {
      try {
        setLoading(true)
        setError("")

        const res = await demoController.getProjects()

        
        const raw = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.categories)
          ? res.data.categories
          : []

        const normalized = raw.map((cat) => ({
          id: cat?.id || cat?._id,
          name: cat?.name || cat?.title || "Category",
          projects: Array.isArray(cat?.projects) ? cat.projects : [],
        }))

        if (mounted) setCategories(normalized)
      } catch (err) {
        if (mounted) setError("Failed to load projects")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProjects()
    return () => (mounted = false)
  }, [])

  // ================= TABS =================
  const tabs = useMemo(() => {
    return [
      { key: "All", label: "All" },
      ...categories.map((c) => ({
        key: c.id,
        label: c.name,
      })),
    ]
  }, [categories])

  // ================= FLATTEN PROJECTS =================
  const allProjects = useMemo(() => {
    return categories.flatMap((cat) =>
      cat.projects.map((p) => ({
        id: p?.id || p?._id,
        title: p?.title || p?.name || "Untitled Project",
        image:
          p?.image ||
          p?.thumbnail ||
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
        desc:
          p?.desc ||
          p?.description ||
          "No description available.",
        badge: p?.bage || p?.badge || cat.name,
        categoryId: cat.id,
        preview: p?.previewUrl || p?.liveUrl || "",
      }))
    )
  }, [categories])

  const filtered =
    active === "All"
      ? allProjects
      : allProjects.filter((p) => p.categoryId === active)

  // ================= UI =================
  return (
    <section className="relative w-full min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center text-4xl md:text-5xl font-bold text-white mb-4"
        >
          Our Projects
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-center text-gray-400 max-w-2xl mx-auto mb-12"
        >
          Explore a curated showcase of websites, AI projects, and applications.
        </motion.p>

        {/* States */}
        {loading && (
          <p className="text-center text-gray-300">Loading projects...</p>
        )}

        {!loading && error && (
          <p className="text-center text-red-400">{error}</p>
        )}

        {/* Tabs */}
        {!loading && !error && (
          <div className="flex justify-center gap-3 flex-wrap mb-14">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition
                  ${
                    active === tab.key
                      ? "bg-cyan-500 text-black shadow-lg"
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading &&
            !error &&
            filtered.map((item, i) => (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-5 shadow-xl"
              >
                <div className="relative h-40 rounded-xl overflow-hidden mb-5">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <span className="text-xs bg-sky-900 text-cyan-400 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-4">{item.desc}</p>

                <div className="space-y-2">
                  <button
                    onClick={() =>
                      item.preview
                        ? window.open(item.preview, "_blank")
                        : alert("Preview not available")
                    }
                    className="w-full py-2 rounded-xl bg-linear-to-r from-cyan-400 to-blue-500 text-white font-semibold hover:shadow-lg transition-all"
                  >
                    Preview
                  </button>

                  <Link href="/contact">
                    <button className="w-full py-2 rounded-xl border-2 border-blue-500/50 bg-blue-500/10 text-blue-400 font-semibold hover:bg-blue-500/20 hover:border-blue-400 transition-all">
                      Contact to Get Project
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  )
}
