"use client";

import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { faqApi } from "@/lib/api";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await faqApi.getAllFAQs();
        setFaqs(response.data || []);
      } catch (err) {
      }
    };
    fetchFAQs();
  }, []);

  return (
    <section className="relative w-full py-16 md:py-24 px-4 sm:px-6 md:px-16 bg-gray-900 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gray-900">
        <div className="absolute top-10 left-10 w-60 h-60 bg-cyan-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-400 leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-gray-300 text-sm sm:text-base">
            Everything you need to know about our services
          </p>
          <div className="mx-auto mt-4 h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
              className={`cursor-pointer rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur-lg px-5 py-4 transition-all
              ${
                activeIndex === index
                  ? "bg-cyan-500/10 border-cyan-400/40"
                  : "hover:bg-gray-800/80"
              }`}
            >
              {/* Question */}
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base sm:text-lg font-semibold text-white leading-snug">
                  {faq.question}
                </h3>
                <span className="text-cyan-400 shrink-0">
                  {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>

              {/* Answer */}
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
