"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRestartAnimations } from "@/hooks/useRestartAnimations";

const BLOG_API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api"}/blogs`;

export default function BlogPage() {
  // Restart animations when component mounts
  useRestartAnimations();

  const [particles] = useState(() => {
    return Array.from({ length: 15 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20,
    }));
  });

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(BLOG_API_BASE, {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Failed to fetch blogs");
        }

        const blogList = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];

        setBlogs(blogList);
      } catch (err) {
        setError(err.message || "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden text-white bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* ================= Background Animations ================= */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
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
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          ></div>
        ))}
      </div>

      {/* ================= Old Background (kept for compatibility) ================= */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Animated Grid */}
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
        <div className="absolute inset-0 pointer-events-none">
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
      </div>

      {/* ================= Page Header ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-white drop-shadow-lg">
            Our Blog
          </h1>
          <p className="max-w-3xl mx-auto text-gray-300 text-base sm:text-lg md:text-xl px-4">
            Explore our latest articles, tutorials, and tips to boost your skills and knowledge.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-14 text-gray-300">Loading blogs...</div>
        ) : error ? (
          <div className="text-center py-14 text-red-300">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-14 text-gray-300">No blogs available yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {blogs.map((blog, index) => (
              <Link
                key={blog.id || index}
                href={`/blog/${blog.id}`}
                className="flex flex-col bg-white/5 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <div className="relative w-full h-44 sm:h-48 md:h-56 bg-black/20">
                  {blog.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={blog.image}
                      alt={blog.title || "Blog"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5 md:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{blog.title}</h3>
                  <p className="text-gray-300 text-sm sm:text-base line-clamp-4">{blog.description}</p>
                  {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {blog.tags.map((tag) => (
                        <span
                          key={`${blog.id || index}-${tag}`}
                          className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
