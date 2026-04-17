import React from 'react';
import Link from 'next/link';
import { Globe, MessageSquare, Send } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-[#0B1220] text-white pt-8 pb-10 px-6">

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">

        {/* LEFT - BRAND */}
        <div>
          {/* 🔥 BIGGER LOGO */}
          <div className="flex items-center gap-3 mb-1 -mt-8">
            <img
              src="/logo.png"
              alt="EchoLearn"
              className="h-20 w-auto brightness-0 invert"
            />
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            Sri Lanka's premier inclusive education platform empowering students
            with visual and cognitive learning differences.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3 mt-6">
            <button className="w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center hover:bg-[#2D4496] transition cursor-pointer">
              <Globe size={18} />
            </button>

            <button className="w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center hover:bg-[#2D4496] transition cursor-pointer">
              <MessageSquare size={18} />
            </button>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
            <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link href="/accessibility" className="hover:text-white transition">Accessibility</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="font-semibold mb-4 text-white">Support</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white transition">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition">Documentation</a></li>
            <li><a href="#" className="hover:text-white transition">For Teachers</a></li>
            <li><a href="#" className="hover:text-white transition">For Schools</a></li>
          </ul>
        </div>

        {/* SUBSCRIBE */}
        <div>
          <h4 className="font-semibold mb-4 text-white">Stay Updated</h4>
          <p className="text-gray-400 text-sm mb-4">
            Get product updates and accessibility tips.
          </p>

          <div className="flex items-center bg-[#1F2937] rounded-lg overflow-hidden border border-gray-700 focus-within:ring-2 focus-within:ring-[#2D4496]/40">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 px-3 py-3 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
            />

            <button className="px-4 py-3 bg-[#2D4496] hover:bg-[#1E2B5A] transition cursor-pointer">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="max-w-6xl mx-auto mt-16 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">

        <p className="text-gray-500 text-xs">
          © 2024 EchoLearn Sri Lanka. All rights reserved.
        </p>

        <div className="flex gap-6 text-xs text-gray-500">
          <Link href="/terms" className="hover:text-white transition">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link href="/contact" className="hover:text-white transition">Contact</Link>
        </div>

      </div>
    </footer>
  );
}
