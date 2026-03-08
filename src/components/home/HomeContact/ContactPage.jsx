"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Mail, Phone, MapPin, Send, User, MessageSquare, Clock, CheckCircle2, Sparkles, AlertCircle, MessageCircle } from "lucide-react";
import contactAnimation from "../../../../public/Contact Us (1).json";
import { contactApi } from "@/lib/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await contactApi.submitContact(formData);
      setIsSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        setIsSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MessageCircle,
      title: "WhatsApp Us",
      value: "+880 1768-820891",
      link: "https://wa.me/8801768820891",
      color: "from-green-500 to-emerald-400",
      recommended: true
    },
    {
      icon: Mail,
      title: "Email Us",
      value: "sbsakibsarkar8@gmail.com",
      link: "sbsakibsarkar8@gmail.com",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+880 1768-820891",
      link: "tel:+8801768820891",
      color: "from-purple-500 to-pink-400"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "Dhaka, Bangladesh",
      link: "#",
      color: "from-orange-500 to-red-400"
    },
  ];

  const features = [
    { icon: Clock, text: "24/7 Support" },
    { icon: CheckCircle2, text: "Quick Response" },
    { icon: Sparkles, text: "Expert Team" },
  ];

  return (
    <main className="relative min-h-screen bg-[#05060a] text-white overflow-hidden">
      {/* ================= BACKGROUND ================= */}
      <div className="fixed inset-0 -z-10">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            maskImage: "radial-gradient(circle at center, black 40%, transparent 100%)",
          }}
        />

        {/* Gradient Orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/40 rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-400/40 rounded-full blur-[120px] animate-float-slower delay-700" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/30 rounded-full blur-[140px] animate-float-reverse delay-1000" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-7xl mx-auto">

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              <Sparkles size={14} className="sm:w-4 sm:h-4" />
              Get in Touch
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4">
              Lets Start a{" "}
              <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Conversation
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4">
              Have a project in mind? Wed love to hear about it. Send us a message and well respond within 24 hours.
            </p>
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-16 sm:mb-20 lg:mb-24">

            {/* LEFT: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form
                onSubmit={handleSubmit}
                className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 shadow-2xl"
              >
                {/* Success Message Overlay */}
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-green-500/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center z-20"
                  >
                    <CheckCircle2 size={48} className="sm:w-16 sm:h-16 text-white mb-3 sm:mb-4 animate-bounce" />
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-sm sm:text-base text-white/90">Well get back to you soon.</p>
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3"
                  >
                    <AlertCircle size={16} className="sm:w-5 sm:h-5 text-red-400 shrink-0" />
                    <p className="text-red-400 text-xs sm:text-sm">{error}</p>
                  </motion.div>
                )}

                <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6 flex items-center gap-2">
                  <Send className="text-blue-400" size={16} />
                  Send us a Message
                </h2>

                <div className="space-y-3 sm:space-y-5">
                  {/* Name Input */}
                  <div className="relative">
                    <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-4 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition"
                      required
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="relative">
                      <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-4 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-4 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="relative">
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-4 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <MessageSquare className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400" size={16} />
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-4 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition resize-none"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full py-2.5 sm:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 text-black font-semibold transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.45)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* RIGHT: Animation & Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8"
            >
              {/* Lottie Animation */}
              <div className="relative hidden sm:block">
                <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
                <div className="relative">
                  <Lottie animationData={contactAnimation} loop className="w-full max-w-md mx-auto" />
                </div>
              </div>

              {/* Quick WhatsApp Button */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-400 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-white mb-1 sm:mb-2 flex items-center gap-2">
                      <MessageCircle size={18} className="sm:w-6 sm:h-6" />
                      Quick Response via WhatsApp
                    </h3>
                    <p className="text-white/90 text-xs sm:text-sm">Get instant replies to your queries</p>
                  </div>
                  <a
                    href="https://wa.me/8801768820891"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-green-600 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl font-semibold hover:bg-gray-100 transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap"
                  >
                    <MessageCircle size={16} className="sm:w-5 sm:h-5" />
                    Chat Now
                  </a>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition"
                  >
                    <feature.icon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <p className="text-sm text-gray-300 font-medium">{feature.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          >
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                target={info.link.startsWith('http') ? '_blank' : undefined}
                rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all hover:scale-105"
              >
                {info.recommended && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-400 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">
                    Recommended
                  </span>
                )}
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-linear-to-r ${info.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  <info.icon className="text-white" size={20} />
                </div>
                <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2">{info.title}</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition text-xs sm:text-base break-words">{info.value}</p>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
