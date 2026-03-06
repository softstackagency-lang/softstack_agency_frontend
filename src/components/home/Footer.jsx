"use client";

import Link from "next/link";
import { FaXTwitter, FaLinkedinIn, FaGithub, FaEnvelope } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0b1220] to-[#050914] text-gray-300 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-14 pb-10">

        {/* Top section: Logo + 3 columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">

          {/* Logo & Brand — full width on mobile, 1 col on md+ */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 flex flex-col gap-4 items-start">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold flex items-center gap-1">
                <span className="text-white">SoftStack</span>
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Agency</span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              SoftStack Agency delivers cutting-edge technology solutions and innovative products for businesses worldwide.
            </p>

            <div className="flex items-center gap-3 mt-1">
              <SocialIcon href="#" icon={<FaXTwitter />} />
              <SocialIcon href="#" icon={<FaLinkedinIn />} />
              <SocialIcon href="#" icon={<FaGithub />} />
              <SocialIcon href="#" icon={<FaEnvelope />} />
            </div>
          </div>

          {/* Quick Links */}
          <FooterColumn title="Quick Links">
            <FooterLink href="/product">Product</FooterLink>
            <FooterLink href="/e-commerce">Services</FooterLink>
            <FooterLink href="/demo">Demo</FooterLink>
            <FooterLink href="/pricing">Pricing</FooterLink>
          </FooterColumn>

          {/* Company */}
          <FooterColumn title="Company">
            <FooterLink href="/team">About Us</FooterLink>
            <FooterLink href="/customer">Customers</FooterLink>
            <FooterLink href="/career">Careers</FooterLink>
            <FooterLink href="/contact">Contact Us</FooterLink>
          </FooterColumn>

          {/* Resources */}
          <FooterColumn title="Resources">
            <FooterLink href="/blog">Blog</FooterLink>
            <FooterLink href="/docs">Documentation</FooterLink>
            <FooterLink href="/tutorial">Tutorials</FooterLink>
            <FooterLink href="/help-center">Help Center</FooterLink>
          </FooterColumn>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-gray-400 gap-3 text-center">
          <p>© {new Date().getFullYear()} SoftStack Agency. All Rights Reserved.</p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/cookie-policy" className="hover:text-white transition">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Reusable Components */
function FooterColumn({ title, children }) {
  return (
    <div className="flex flex-col gap-3 items-start">
      <h4 className="text-white font-semibold mb-1">{title}</h4>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link href={href} className="text-gray-400 hover:text-white transition">
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ href, icon }) {
  return (
    <Link
      href={href}
      className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-cyan-500 hover:text-white transition"
    >
      {icon}
    </Link>
  );
}