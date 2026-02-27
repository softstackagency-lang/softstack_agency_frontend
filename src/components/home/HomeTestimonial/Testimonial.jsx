"use client"

import { useEffect, useState } from "react"
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
    ;(async () => {
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
    <section className="py-28 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* -------- HEADING -------- */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            What Our{" "}
            <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text ">
              Clients Say
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Dont just take our word for it - hear from our satisfied clients
          </p>
        </div>

        <div className="grid lg:grid-cols-[6rem_1fr] gap-12">

        {/* -------- LEFT AVATARS -------- */}
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={prev}
            className="text-gray-400 hover:text-cyan-400"
          >
            <FaChevronUp />
          </button>

          {data.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(index)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition
                ${
                  index === active
                    ? "border-cyan-400 ring-4 ring-cyan-400/30"
                    : "border-gray-600 opacity-60 hover:opacity-100"
                }`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          ))}

          <button
            type="button"
            onClick={next}
            className="text-gray-400 hover:text-cyan-400"
          >
            <FaChevronDown />
          </button>
        </div>

        {/* -------- CONTENT -------- */}
        <div className="relative min-h-[400px]">
          <div
            key={active}
            className="h-full bg-white/4 backdrop-blur-xl
              border border-white/10 rounded-3xl
              p-8 md:p-12 shadow-2xl"
          >
            <Quote className="w-10 h-10 text-cyan-400/40 mb-6" />

            <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed">
              {activeItem.text}
            </p>

            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <img
                src={activeItem.image}
                alt={activeItem.name}
                className="w-16 h-16 rounded-xl object-cover"
              />

              <div>
                <h4 className="font-semibold">{activeItem.name}</h4>
                <p className="text-sm text-gray-400">{activeItem.role}</p>

                <div className="flex gap-1 mt-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
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
