"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Star, Quote } from "lucide-react"
import { FaChevronUp, FaChevronDown } from "react-icons/fa"
import { testimonialApi } from "@/lib/api"

const FALLBACK_AVATAR = "https://i.pravatar.cc/150";

export default function Testimonial() {
  const [data, setData] = useState([])
  const [active, setActive] = useState(0)

  const total = data.length

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    ; (async () => {
      try {
        const res = await testimonialApi.getAllTestimonials()
        if (res?.data?.length) {
          setData(
            res.data.map((i) => {
              // Filter out invalid URLs and use fallback
              let avatarUrl = i.avatar || "https://i.pravatar.cc/150";

              // Check if URL is from invalid domains
              if (avatarUrl.includes('example.com') || avatarUrl.includes('yourdomain.com')) {
                avatarUrl = "https://i.pravatar.cc/150";
              }

              return {
                id: i._id,
                name: i.name || "Anonymous",
                role: i.designation || "Client",
                image: avatarUrl,
                text: i.message || "Great service!",
                rating: i.rating || 5,
              };
            })
          )
        }
      } catch (err) {
      }
    })()
  }, [])

  /* ---------------- SAFETY ---------------- */
  if (!total) {
    return null // nothing to show if API returns empty
  }

  const activeItem = data[active]

  const next = () => setActive((p) => (p + 1) % total)
  const prev = () => setActive((p) => (p - 1 + total) % total)

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* -------- HEADING -------- */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            What Our{" "}
            <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text ">
              Clients Say
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Dont just take our word for it - hear from our satisfied clients
          </p>
        </div>

        <div className="grid lg:grid-cols-[6rem_1fr] gap-12">

          {/* -------- LEFT AVATARS - Column on Desktop, Row on Mobile -------- */}
          <div className="flex lg:flex-col flex-row justify-center lg:justify-start items-center gap-4 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
            <button
              type="button"
              onClick={prev}
              className="text-gray-400 hover:text-cyan-400 shrink-0 rotate-0 lg:rotate-0"
            >
              <FaChevronUp className="hidden lg:block" />
              <FaChevronDown className="lg:hidden rotate-90" />
            </button>

            {data.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition
                ${index === active
                    ? "border-cyan-400 ring-4 ring-cyan-400/30"
                    : "border-gray-600 opacity-60 hover:opacity-100"
                  }`}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            ))}

            <button
              type="button"
              onClick={next}
              className="text-gray-400 hover:text-cyan-400 shrink-0"
            >
              <FaChevronDown className="hidden lg:block" />
              <FaChevronUp className="lg:hidden rotate-90" />
            </button>
          </div>

          {/* -------- CONTENT -------- */}
          <div className="relative min-h-[300px] sm:min-h-[350px] md:min-h-[400px]">
            <div
              key={active}
              className="h-full bg-white/4 backdrop-blur-xl
              border border-white/10 rounded-2xl sm:rounded-3xl
              p-5 sm:p-6 md:p-8 lg:p-12 shadow-2xl"
            >
              <Quote className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-cyan-400/40 mb-4 sm:mb-5 md:mb-6" />

              <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-6 sm:mb-7 md:mb-8 leading-relaxed">
                {activeItem.text}
              </p>

              <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-white/10">
                <Image
                  src={activeItem.image}
                  alt={activeItem.name}
                  width={64}
                  height={64}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl object-cover"
                />

                <div>
                  <h4 className="text-sm sm:text-base md:text-lg font-semibold">{activeItem.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-400">{activeItem.role}</p>

                  <div className="flex gap-1 mt-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className="sm:w-3.5 sm:h-3.5 md:w-[14px] md:h-[14px]"
                        fill={i < activeItem.rating ? "currentColor" : "none"}
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
