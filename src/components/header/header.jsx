"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ArrowRight, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import Image from "next/image";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);
  const { user, loading, signOut: handleSignOut } = useCustomAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  const handleDropdownEnter = (dropdownName) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setActiveDropdown(dropdownName);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 150); // 150ms delay to allow moving to dropdown
    setDropdownTimeout(timeout);
  };

  const services = [
    { name: "Web Development", desc: "Custom websites & web apps", href: "/web-development" },
    { name: "AI Agents", desc: "Intelligent virtual assistants", href: "/ai-agents" },
    { name: "App Development", desc: "iOS & Android development", href: "/app-development" },
    { name: "E-commerce", desc: "Online store solutions" },
  ];

  const aboutUsItems = [
    { name: "Team", desc: "Meet our talented team", href: "/team" },
    { name: "Career", desc: "Join our growing team", href: "/career" },
    { name: "Blog", desc: "Latest news & insights", href: "/blog" },
    { name: "Documentation", desc: "Technical guides & docs", href: "/docs" },
    { name: "Tutorials", desc: "Step-by-step learning", href: "/tutorial" },
    { name: "Help Center", desc: "Support & assistance", href: "/help-center" },
    { name: "Contact Us", desc: "Get in touch with us", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-lg shadow-lg shadow-cyan-500/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0 group cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-linear-to-br from-cyan-400 to-blue-600 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold">
                <span className="text-white">SoftStack </span>
                <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Agency
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <a
              href="/product"
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300 relative group"
            >
              <span>Project</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </a>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter("services")}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                <span>Services</span>
                <ChevronDown
                  className={`ml-1 w-4 h-4 transition-transform duration-300 ${activeDropdown === "services" ? "rotate-180" : ""}`}
                />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </button>

              {activeDropdown === "services" && (
                <div
                  className="absolute top-full left-0 pt-2 w-80"
                  onMouseEnter={() => handleDropdownEnter("services")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <div className="bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden">
                    <div className="p-2">
                      {services.map((service, index) => (
                        <a
                          key={index}
                          href={
                            service.name === "Web Development"
                              ? "/web-development"
                              : service.name === "AI Agents"
                                ? "/ai-agents"
                                : service.name === "App Development"
                                  ? "/app-development"
                                  : service.name === "Digital Marketing"
                                    ? "/digital-marketing"
                                    : service.name === "Branding"
                                      ? "/branding"
                                      : service.name === "E-commerce"
                                        ? "/e-commerce"
                                        : `#${service.name.toLowerCase().replace(/\s+/g, "-")}`
                          }
                          className="block px-4 py-3 rounded-lg hover:bg-linear-to-r hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-300 group"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                                {service.name}
                              </h3>
                              <p className="text-sm text-gray-400 mt-0.5">{service.desc}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a
              href="/demo"
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300 relative group"
            >
              <span>Demo</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </a>

            <a
              href="/pricing"
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300 relative group"
            >
              <span>Pricing</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </a>

            {/* About Us Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter("about")}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                <span>About Us</span>
                <ChevronDown
                  className={`ml-1 w-4 h-4 transition-transform duration-300 ${activeDropdown === "about" ? "rotate-180" : ""}`}
                />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </button>

              {activeDropdown === "about" && (
                <div
                  className="absolute top-full left-0 pt-2 w-72"
                  onMouseEnter={() => handleDropdownEnter("about")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <div className="bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden">
                    <div className="p-2">
                      {aboutUsItems.map((item, index) => (
                        <a
                          key={index}
                          href={item.href}
                          className="block px-4 py-3 rounded-lg hover:bg-linear-to-r hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-300 group"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-400 mt-0.5">{item.desc}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>
          <div className="flex gap-5">
            {/* Auth Links */}
            <div className="hidden lg:flex items-center space-x-3">
              {loading ? (
                // Skeleton loading state
                <div className="flex items-center space-x-3">
                  {/* Avatar skeleton */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700/50 to-gray-600/50" />
                  {/* Sign out button skeleton */}
                  <div className="w-24 h-10 rounded-full bg-gradient-to-r from-gray-700/50 to-gray-600/50" />
                </div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  {/* Profile Dropdown */}
                  <div
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter("profile")}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 flex items-center justify-center cursor-pointer">
                      {user.image || user.picture ? (
                        <Image
                          src={user.image || user.picture}
                          alt={user.name || user.firstName || "User"}
                          width={40}
                          height={40}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </button>

                    {/* Profile Dropdown Menu */}
                    {activeDropdown === "profile" && (
                      <div
                        className="absolute top-full right-0 mt-2 w-56"
                        onMouseEnter={() => handleDropdownEnter("profile")}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <div className="bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden">
                          {/* User Info Header */}
                          <div className="px-4 py-3 border-b border-slate-700/50">
                            <div className="font-medium text-white">
                              {user.name || user.firstName || "User"}
                            </div>
                            <div className="text-gray-300 text-sm">{user.email}</div>
                          </div>

                          {/* Menu Items */}
                          <div className="p-2">
                            {/* Dashboard - Only visible for admin users */}
                            {user.role === "admin" && (
                              <Link
                                href="/dashboard"
                                className="flex items-center px-4 py-3 rounded-lg hover:bg-linear-to-r hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-300 group"
                              >
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3">
                                      <svg
                                        className="w-4 h-4 text-blue-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <h3 className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                                        Dashboard
                                      </h3>
                                    </div>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                </div>
                              </Link>
                            )}

                            <Link
                              href="/track-order"
                              className="flex items-center px-4 py-3 rounded-lg hover:bg-linear-to-r hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-300 group"
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mr-3">
                                    <svg
                                      className="w-4 h-4 text-green-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <h3 className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                                      Track Order
                                    </h3>
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                              </div>
                            </Link>

                            <Link
                              href="/profile"
                              className="flex items-center px-4 py-3 rounded-lg hover:bg-linear-to-r hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-300 group"
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mr-3">
                                    <User className="w-4 h-4 text-purple-400" />
                                  </div>
                                  <div>
                                    <h3 className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                                      Profile
                                    </h3>
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:text-white hover:border-red-400 rounded-full transition-all duration-300 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-linear-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-400 hover:text-white hover:border-cyan-400 rounded-full transition-all duration-300 font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* CTA Button */}
            {!loading && !user && (
              <div className="hidden lg:block">
                <Link href="/contact">
                  <button className="relative px-6 py-2.5 rounded-full font-semibold text-white overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-600 transition-transform duration-300 group-hover:scale-105"></div>
                    <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center cursor-pointer">
                      Schedule a call
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-all duration-300"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="bg-slate-900/98 backdrop-blur-xl border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            <Link
              href="/product"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-300"
            >
              Product
            </Link>

            <div>
              <button
                onClick={() =>
                  setActiveDropdown(activeDropdown === "mobile-services" ? null : "mobile-services")
                }
                className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-300"
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "mobile-services" ? "rotate-180" : ""}`}
                />
              </button>

              {activeDropdown === "mobile-services" && (
                <div className="mt-2 ml-4 space-y-1">
                  {services.map((service, index) => (
                    <Link
                      key={index}
                      href={service.href || `/${service.name.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/demo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-300"
            >
              Demo
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-300"
            >
              Pricing
            </Link>

            <div>
              <button
                onClick={() =>
                  setActiveDropdown(activeDropdown === "mobile-about" ? null : "mobile-about")
                }
                className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-300"
              >
                <span>About Us</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "mobile-about" ? "rotate-180" : ""}`}
                />
              </button>

              {activeDropdown === "mobile-about" && (
                <div className="mt-2 ml-4 space-y-1">
                  {aboutUsItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Links */}
            <div className="border-t border-slate-700 pt-4 mt-4">
              {loading ? (
                // Skeleton loading state for mobile
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-4 py-3 bg-slate-800/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700/50 to-gray-600/50" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 bg-gray-700/50 rounded" />
                      <div className="h-3 w-32 bg-gray-700/50 rounded" />
                    </div>
                  </div>
                  <div className="w-full h-11 rounded-lg bg-gradient-to-r from-gray-700/50 to-gray-600/50" />
                </div>
              ) : user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-4 py-3 bg-slate-800/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-linear-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                      {user.image || user.picture ? (
                        <Image
                          src={user.image || user.picture}
                          alt={user.name || user.firstName || "User"}
                          width={40}
                          height={40}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {user.name || user.firstName || "User"}
                      </div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-all duration-300 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-all duration-300 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-cyan-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-300 font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {!loading && !user && (
              <Link href="/contact" className="w-full">
                <button className="w-full mt-4 px-6 py-3 cursor-pointer rounded-full bg-linear-to-r from-blue-500 to-cyan-400 text-black font-semibold hover:shadow-[0_0_40px_rgba(59,130,246,0.45)] transition-all duration-300">
                  Schedule a call
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
