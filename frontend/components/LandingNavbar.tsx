"use client";

import React from "react";
import Link from "next/link";

export default function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/logo2.png" alt="EchoLearn Logo" className="h-9 w-auto" />
          <span className="font-bold text-lg text-[#1E1E1E] group-hover:text-[#2D4496] transition">
            EchoLearn
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/features" label="Features" />
          <NavLink href="/about" label="About" />
          <NavLink href="/accessibility" label="Accessibility" />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">

          {/* Login */}
          <button className="text-sm font-medium text-gray-700 hover:text-[#2D4496] transition">
            Login
          </button>

          {/* CTA */}
          <button className="bg-[#2D4496] text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:bg-[#1E2B5A] hover:shadow-lg transition-all">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}

/* Reusable Nav Link */
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative text-sm font-medium text-gray-700 hover:text-[#2D4496] transition"
    >
      {label}
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#2D4496] transition-all group-hover:w-full"></span>
    </Link>
  );
}
