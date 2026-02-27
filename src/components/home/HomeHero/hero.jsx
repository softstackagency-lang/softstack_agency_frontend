"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Palette, Rocket, ShieldCheck, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { bannerApi } from "@/lib/api";

export default function HeroSection() {
  const [bannerData, setBannerData] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await bannerApi.getAllBanners();
        if (response.data && response.data.length > 0) {
          const banner = response.data[0];
          // Fix image URLs if they have .com at the end
          if (banner.images) {
            banner.images = banner.images.map(img => ({
              ...img,
              imageUrl: img.imageUrl?.replace('i.ibb.co.com', 'i.ibb.co') || img.imageUrl
            }));
          }
          setBannerData(banner);
        }
      } catch (err) {
      }
    };
    fetchBanner();
  }, []);

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
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 sm:gap-12 md:gap-14 px-4 sm:px-6 md:px-8 py-24 sm:py-32 md:py-40 pb-28 sm:pb-32 md:pb-40 md:grid-cols-2">
        {/* LEFT SIDE */}
        <div>
          <span className="mb-3 sm:mb-4 inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm text-blue-400">
            <Sparkles size={16} />
            SoftStack Agency
          </span>

          <h1 className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {bannerData?.title ? (
              <>
                {bannerData.title.text}{" "}
                {bannerData.title.highlight && (
                  <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {bannerData.title.highlight}
                  </span>
                )}
              </>
            ) : (
              <>
                Build{" "}
                <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Modern
                </span>{" "}
                &<br />
                Scalable Web Experiences
              </>
            )}
          </h1>

          <p className="mt-4 sm:mt-5 md:mt-6 max-w-xl text-sm sm:text-base md:text-lg text-gray-400">
            {bannerData?.description ||
              "We design and develop high-performance websites and web applications using modern technologies like React, Next.js and Tailwind CSS."}
          </p>

          <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
            <Link href="/pricing" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base font-semibold text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.45)]">
                {bannerData?.ctaButtons?.[0]?.text || "Get Started"}
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </Link>

            <Link href="/product" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto rounded-full border border-white/10 px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base text-gray-300 transition-all hover:border-blue-400/40 hover:text-white">
                {bannerData?.ctaButtons?.[1]?.text || "View Our Work"}
              </button>
            </Link>
          </div>
        </div>

      {/* ===== RIGHT SIDE : FLOATING IMAGE BENTO GRID ===== */}
<div className="relative mt-6 md:mt-12 translate-y-4 grid grid-cols-3 grid-rows-3 gap-2 sm:gap-3 md:gap-4 h-72 sm:h-80 md:h-88 lg:h-104">

  {/* background glow */}
  <motion.div
    animate={{ y: [0, -15, 0] }}
    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    className="absolute -z-10 w-80 h-80 rounded-full bg-sky-500/10 blur-[110px]"
  />

 {/* ===== IMAGE 1 : MAIN ===== */}
<motion.div
  animate={{ y: [0, -10, 0] }}
  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
  whileHover={{ scale: 1.03 }}
  className="
    relative
    col-span-2 row-span-2
    rounded-2xl overflow-hidden
    bg-linear-to-br from-sky-500/20 to-blue-600/20
    border border-white/10
  "
>
  {(bannerData?.images?.[0]?.imageUrl && bannerData.images[0].imageUrl.trim() !== "") && (
    <Image
      src={bannerData.images[0].imageUrl}
      alt={bannerData.images[0].title || "UI UX"}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 50vw"
      priority
    />
  )}
</motion.div>

{/* ===== IMAGE 2 ===== */}
<motion.div
  animate={{ y: [0, 8, 0] }}
  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
  whileHover={{ y: -6 }}
  className="relative rounded-xl overflow-hidden border border-white/10"
>
  {(bannerData?.images?.[1]?.imageUrl && bannerData.images[1].imageUrl.trim() !== "") && (
    <Image
      src={bannerData.images[1].imageUrl}
      alt={bannerData.images[1].title || "Visual"}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 33vw"
    />
  )}
</motion.div>

{/* ===== IMAGE 3 ===== */}
<motion.div
  animate={{ y: [0, -6, 0] }}
  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
  whileHover={{ y: -6 }}
  className="relative rounded-xl overflow-hidden border border-white/10"
>
  {(bannerData?.images?.[2]?.imageUrl && bannerData.images[2].imageUrl.trim() !== "") && (
    <Image
      src={bannerData.images[2].imageUrl}
      alt={bannerData.images[2].title || "WordPress"}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 33vw"
    />
  )}
</motion.div>

{/* ===== IMAGE 4 ===== */}
<motion.div
  animate={{ y: [0, 10, 0] }}
  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
  whileHover={{ y: -6 }}
  className="relative rounded-xl overflow-hidden border border-white/10"
>
  {(bannerData?.images?.[3]?.imageUrl && bannerData.images[3].imageUrl.trim() !== "") && (
    <Image
      src={bannerData.images[3].imageUrl}
      alt={bannerData.images[3].title || "App"}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 33vw"
    />
  )}
</motion.div>

{/* ===== IMAGE 5 : WIDE ===== */}
<motion.div
  animate={{ y: [0, -12, 0] }}
  transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
  whileHover={{ scale: 1.05 }}
  className="
    relative
    col-span-2 row-span-1
    rounded-xl overflow-hidden
    border border-white/10
  "
>
  {(bannerData?.images?.[4]?.imageUrl && bannerData.images[4].imageUrl.trim() !== "") && (
    <Image
      src={bannerData.images[4].imageUrl}
      alt={bannerData.images[4].title || "E-commerce"}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  )}
</motion.div>

</div>




        
      </div>
    </section>
  );
}