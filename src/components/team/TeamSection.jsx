"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Linkedin, Twitter, Github, Mail, MapPin, Calendar, Search } from "lucide-react";
import { teamController } from '@/controllers';
import { useRestartAnimations } from "@/hooks/useRestartAnimations";


const safeText = (v, fallback = "-") => (typeof v === "string" && v.trim() ? v.trim() : fallback);

const getDepartmentNameFromMember = (m) => {
  if (!m) return "";
  if (typeof m.department === "string") return m.department;
  if (m.department && typeof m.department === "object") return m.department.name || "";
  // fallback keys
  return m.departmentName || m.categoryName || "";
};

const getMemberImage = (m) =>
  m?.profileImage ||
  m?.image ||
  m?.photo ||
  m?.avatar ||
  "https://images.unsplash.com/photo-1520975958225-8f3c3c5bb99a?auto=format&fit=crop&w=600&q=80";

const normalizeSkills = (m) => {
  const s = m?.skills ?? m?.skill ?? m?.tags ?? [];
  if (Array.isArray(s)) return s.filter(Boolean).map(String);
  if (typeof s === "string")
    return s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  return [];
};

const getFullLocation = (loc) => {
  if (!loc) return "";
  if (typeof loc === "string") return loc;
  const parts = [loc.city, loc.state, loc.country].filter(Boolean);
  return parts.join(", ");
};

const formatDate = (v) => {
  if (!v) return "—";

  try {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return String(v);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return String(v);
  }
};

export default function TeamSection() {
  // Restart animations when component mounts
  useRestartAnimations();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Generate stable random values for particles
  const [particles] = useState(() => {
    return [...Array(15)].map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20
    }));
  });

  const [oldParticles] = useState(() => {
    return [...Array(10)].map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 10 + Math.random() * 14,
      size: 1 + Math.random() * 2,
      opacity: 0.08 + Math.random() * 0.12,
    }));
  });

  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // API states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [members, setMembers] = useState([]);

  // UI states
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const handleDepartmentChange = (deptKey) => {
    setSelectedDepartment(deptKey);
    setCurrentPage(1);
  };

  // Fetch
  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [catsRaw, memsRaw] = await Promise.all([
          teamController.getCategories().catch(() => []),
          teamController.getMembers(),
        ]);

        if (!alive) return;

        // Normalize API categories
        const apiCats = Array.isArray(catsRaw)
          ? catsRaw
              .map((c) => ({
                key: c?._id || c?.id || c?.departmentId || c?.value,
                name: safeText(c?.name || c?.title || c?.departmentName || c?.label, ""),
                source: "api",
              }))
              .filter((c) => c.key && c.name)
          : [];

        const apiNameToKey = new Map(apiCats.map((c) => [c.name.toLowerCase(), c.key]));
        const apiKeySet = new Set(apiCats.map((c) => c.key));

        // Normalize members + attach __deptKey consistently
        const normalizedMembers = Array.isArray(memsRaw)
          ? memsRaw.map((m) => {
              const deptName = safeText(getDepartmentNameFromMember(m), "");
              const deptLower = deptName.toLowerCase();

              // ✅ If member dept matches API category name, use API key
              let deptKey = apiNameToKey.get(deptLower);

              // ✅ If member has dept already as an API id (rare), accept
              if (!deptKey && typeof m?.department === "string" && apiKeySet.has(m.department)) {
                deptKey = m.department;
              }

              // ✅ Otherwise fallback "local" key based on name
              if (!deptKey) {
                deptKey = deptName ? `local:${deptLower}` : "local:unknown";
              }

              return {
                ...m,
                _id: m?._id || m?.id,
                name: safeText(m?.name || m?.fullName),
                role: safeText(m?.role || m?.position || m?.designation),
                bio: safeText(m?.bio || m?.about || m?.description, ""),
                profileImage: getMemberImage(m),
                skills: normalizeSkills(m),
                locationObj: m?.location,
                locationText:
                  getFullLocation(m?.location) ||
                  safeText(m?.location || m?.address || m?.city, ""),
                joinedDate: m?.joinedDate || m?.joinDate || m?.joinedAt || m?.createdAt || "",
                status: m?.status || "",
                socialLinks: {
                  linkedin: m?.socialLinks?.linkedin || m?.social?.linkedin || m?.linkedin || "",
                  twitter: m?.socialLinks?.twitter || m?.social?.twitter || m?.twitter || "",
                  github: m?.socialLinks?.github || m?.social?.github || m?.github || "",
                  email: m?.socialLinks?.email || m?.social?.email || m?.email || "",
                },
                __deptName: deptName || "Unknown",
                __deptKey: deptKey,
              };
            })
          : [];

        // Build member-derived categories if missing in API
        const memberDeptMap = new Map();
        for (const m of normalizedMembers) {
          const name = (m.__deptName || "").trim();
          if (!name) continue;
          const lower = name.toLowerCase();
          if (!memberDeptMap.has(lower)) memberDeptMap.set(lower, name);
        }

        const derivedCats = Array.from(memberDeptMap.entries())
          .filter(([lowerName]) => !apiNameToKey.has(lowerName))
          .map(([lowerName, displayName]) => ({
            key: `local:${lowerName}`,
            name: displayName,
            source: "derived",
          }));

        const finalCats = [...apiCats, ...derivedCats];

        setMembers(normalizedMembers);
        setCategories(finalCats);

        // If selectedDepartment invalid now, reset
        if (selectedDepartment !== "All" && !finalCats.some((c) => c.key === selectedDepartment)) {
          setSelectedDepartment("All");
        }
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Something went wrong");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tabs with counts
  const departments = useMemo(() => {
    const allCount = members.length;

    const items = categories
      .map((c) => {
        const count = members.filter((m) => m.__deptKey === c.key).length;
        return { id: c.key, name: c.name, count };
      })
      // ✅ empty category hide (All ছাড়া)
      .filter((d) => d.count > 0);

    return [{ id: "All", name: "All", count: allCount }, ...items];
  }, [categories, members]);

  // Filtering
  const filteredMembers = useMemo(() => {
    const byDept =
      selectedDepartment === "All"
        ? members
        : members.filter((m) => m.__deptKey === selectedDepartment);

    const q = query.trim().toLowerCase();
    if (!q) return byDept;

    return byDept.filter((m) => {
      const hay = [
        m.name,
        m.role,
        m.__deptName,
        m.locationText,
        ...(m.skills || []),
        m.status || "",
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [members, selectedDepartment, query]);

  // Pagination
  const membersPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / membersPerPage));
  const startIndex = (currentPage - 1) * membersPerPage;
  const endIndex = startIndex + membersPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
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

      {/* Old Background for compatibility */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-24 -left-24 h-105 w-105 rounded-full bg-cyan-500/10 blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
          }}
        />
        <div
          className="absolute -bottom-28 -right-28 h-115 w-115 rounded-full bg-blue-500/10 blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -0.008}px, ${mousePosition.y * -0.008}px)`,
          }}
        />

        <div className="particle-layer particle-1" />
        <div className="particle-layer particle-2" />
        <div className="particle-layer particle-3" />

        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-cyan-300/40 animate-float-slow"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-xs font-medium text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/80 animate-pulse-slow" />
            Our People
          </div>

          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Meet the team at
            <br className="mb-2" />
            <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              SoftStack Agency
            </span>
          </h1>

          <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
            A focused group of designers, engineers, and builders delivering clean, reliable digital
            products.
          </p>

          {/* Search */}
          <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <div className="relative w-full sm:w-80 md:w-96 lg:w-105">
              <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-linear-to-r from-cyan-500/20 via-sky-500/10 to-blue-500/20 blur-xl" />
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-200/80" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, role, skill..."
                className={[
                  "relative w-full rounded-2xl",
                  "border border-white/10",
                  "bg-slate-950/40 backdrop-blur-xl",
                  "px-10 sm:px-11 py-3 sm:py-3.5 text-sm text-white",
                  "placeholder:text-white/45",
                  "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_50px_rgba(0,0,0,0.35)]",
                  "transition-all duration-300",
                  "focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/15",
                  "hover:border-white/15",
                ].join(" ")}
              />
            </div>
          </div>

          {/* Status */}
          <div className="mt-6">
            {loading && <p className="text-sm text-white/55">Loading team data...</p>}
            {!loading && error && <p className="text-sm text-rose-300/90">{error}</p>}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 sm:mt-8 md:mt-10 flex flex-wrap justify-center gap-2 animate-fade-in-up-delayed">
          {departments.map((dept) => {
            const active = selectedDepartment === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => handleDepartmentChange(dept.id)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  "border",
                  active
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                    : "border-white/10 bg-white/2 text-white/70 hover:bg-white/4 hover:text-white",
                ].join(" ")}
              >
                {dept.name}{" "}
                <span className={active ? "text-cyan-200/80" : "text-white/40"}>
                  ({dept.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Empty */}
        {!loading && !error && filteredMembers.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-white/55">No members found.</p>
          </div>
        )}

        {/* Grid */}
        <div className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 animate-fade-in-up-more-delayed">
          {currentMembers.map((member) => (
            <article
              key={member._id}
              className={[
                "group relative overflow-hidden rounded-2xl border border-cyan-500/20",
                "bg-gradient-to-br from-slate-800/60 via-slate-900/70 to-slate-950/80 p-4 sm:p-5 md:p-6",
                "shadow-[0_0_0_1px_rgba(6,182,212,0.05),0_20px_40px_rgba(0,0,0,0.4)]",
                "transition-all duration-500 ease-out",
                "hover:-translate-y-3 hover:scale-[1.02]",
                "hover:border-cyan-400/50",
                "hover:bg-gradient-to-br hover:from-cyan-950/40 hover:via-slate-900/60 hover:to-blue-950/50",
                "hover:shadow-[0_0_0_1px_rgba(6,182,212,0.3),0_30px_70px_rgba(6,182,212,0.15),0_0_80px_rgba(6,182,212,0.1)]",
              ].join(" ")}
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute -top-24 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
                <div className="absolute -bottom-28 right-1/3 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
              </div>

              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan-400/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex items-start gap-3 sm:gap-4">
                <div className="relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-900/40 to-blue-900/30 shadow-lg shadow-cyan-500/10">
                  <Image
                    src={member.profileImage}
                    alt={member.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm sm:text-base font-semibold text-white group-hover:text-cyan-100 transition-colors duration-300">{member.name}</h3>
                  <p className="mt-0.5 text-xs sm:text-sm text-white/70 group-hover:text-cyan-200/80 transition-colors duration-300">{member.role}</p>

                  <div className="mt-2 inline-flex items-center rounded-full border border-cyan-500/30 bg-gradient-to-r from-cyan-900/30 to-blue-900/20 px-3 py-1 text-xs text-cyan-200/90 shadow-sm">
                    {member.__deptName || "—"}
                  </div>

                  {member.status && (
                    <div className="mt-2 ml-2 inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-900/20 px-3 py-1 text-[11px] text-cyan-300/80">
                      Status: <span className="ml-1 text-cyan-200">{member.status}</span>
                    </div>
                  )}
                </div>
              </div>

              {member.bio ? (
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/65 group-hover:text-white/75 transition-colors duration-300">
                  {member.bio}
                </p>
              ) : (
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/45">
                  No bio available.
                </p>
              )}

              <div className="mt-5 grid gap-2 text-xs text-white/60">
                <div className="flex items-center gap-2 group-hover:text-cyan-200/80 transition-colors duration-300">
                  <MapPin className="h-4 w-4 text-cyan-400/90" />
                  <span className="truncate">{member.locationText || "Remote"}</span>
                </div>
                <div className="flex items-center gap-2 group-hover:text-cyan-200/80 transition-colors duration-300">
                  <Calendar className="h-4 w-4 text-cyan-400/90" />
                  <span>Joined {formatDate(member.joinedDate)}</span>
                </div>
              </div>

              {Array.isArray(member.skills) && member.skills.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {member.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-cyan-500/25 bg-gradient-to-r from-cyan-900/25 to-blue-900/15 px-3 py-1 text-xs text-cyan-200/80 transition-all duration-300 group-hover:border-cyan-400/40 group-hover:bg-gradient-to-r group-hover:from-cyan-800/30 group-hover:to-blue-800/20 group-hover:text-cyan-100 group-hover:shadow-lg group-hover:shadow-cyan-500/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {member?.socialLinks?.linkedin && (
                    <a
                      href={member.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-btn"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4 text-cyan-400/90" />
                    </a>
                  )}
                  {member?.socialLinks?.twitter && (
                    <a
                      href={member.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-btn"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-4 w-4 text-cyan-400/90" />
                    </a>
                  )}
                  {member?.socialLinks?.github && (
                    <a
                      href={member.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-btn"
                      aria-label="GitHub"
                    >
                      <Github className="h-4 w-4 text-cyan-400/90" />
                    </a>
                  )}
                  {member?.socialLinks?.email && (
                    <a
                      href={`mailto:${member.socialLinks.email}`}
                      className="icon-btn"
                      aria-label="Email"
                    >
                      <Mail className="h-4 w-4 text-cyan-400/90" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 sm:mt-10 md:mt-12 flex items-center justify-center gap-2 animate-fade-in-up">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={[
                "rounded-xl border px-3 sm:px-4 py-2 text-sm font-medium transition",
                currentPage === 1
                  ? "border-white/10 bg-white/2 text-white/30 cursor-not-allowed"
                  : "border-white/10 bg-white/3 text-white/70 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const active = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={[
                    "h-9 w-9 sm:h-10 sm:w-10 rounded-xl border text-xs sm:text-sm font-semibold transition",
                    active
                      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                      : "border-white/10 bg-white/3 text-white/65 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={[
                "rounded-xl border px-3 sm:px-4 py-2 text-sm font-medium transition",
                currentPage === totalPages
                  ? "border-white/10 bg-white/2 text-white/30 cursor-not-allowed"
                  : "border-white/10 bg-white/3 text-white/70 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              Next
            </button>
          </div>
        )}

        {/* Results info */}
        <div className="mt-6 text-center animate-fade-in-up-delayed">
          <p className="text-sm text-white/45">
            Showing {filteredMembers.length === 0 ? 0 : startIndex + 1}–
            {Math.min(endIndex, filteredMembers.length)} of {filteredMembers.length} members
            {selectedDepartment !== "All"
              ? ` in ${departments.find((d) => d.id === selectedDepartment)?.name || "Selected"}`
              : ""}
            {query.trim() ? ` (filtered)` : ""}
          </p>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        :global(.icon-btn) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1px solid rgba(6, 182, 212, 0.25);
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(59, 130, 246, 0.05));
          color: rgba(6, 182, 212, 0.9);
          transition: all 300ms ease;
          box-shadow: 0 0 0 rgba(6, 182, 212, 0);
        }
        :global(.icon-btn:hover) {
          border-color: rgba(6, 182, 212, 0.5);
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.1));
          color: rgba(6, 182, 212, 1);
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(6, 182, 212, 0.2);
        }
      `}</style>
    </section>
  );
}
