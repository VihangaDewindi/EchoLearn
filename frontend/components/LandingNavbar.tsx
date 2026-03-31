import React from 'react';
import Link from 'next/link';

export default function LandingNavbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <img src="/logo2.png" alt="EchoLearn Logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Links */}
        <div className="flex items-center gap-10">
          <Link href="/features" className="text-sm font-medium text-gray-700 hover:text-[#2D4496] transition">
            Features
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-[#2D4496] transition">
            About
          </Link>
          <Link href="/accessibility" className="text-sm font-medium text-gray-700 hover:text-[#2D4496] transition">
            Accessibility
          </Link>

          {/* Login Button */}
          <button className="bg-[#2D4496] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1E2B5A] transition">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
