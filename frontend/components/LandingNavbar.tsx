"use client";

import Link from "next/link";
import Image from "next/image";


export default function LandingNavbar() {


  return (
    <div className="w-full bg-white flex justify-center sticky top-0 z-50">
      <nav className="relative w-full max-w-6xl px-6 h-[72px] flex items-center justify-between">

        {/* Logo (Left) */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="EchoLearn"
            width={140}
            height={36}
            priority
          />
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <NavLink label="Home" href="/" />
          <NavLink label="Features" href="/features" />
          <NavLink label="Courses" href="/courses" />
          <NavLink label="About Us" href="/about" />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="bg-[#2D4496] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E2B5A] transition"
          >
            Login
          </Link>
        </div>

      </nav>

    </div>
  );
}

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="relative text-sm font-semibold text-gray-600 hover:text-[#1E2B5A] transition-colors group py-2"
    >
      {label}
      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#3A4A8A] transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}
