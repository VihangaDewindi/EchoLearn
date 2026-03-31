import React from 'react';
import Link from 'next/link';
import { Globe, MessageSquare } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-[#0f1720] py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 mb-12 items-start">
        
        <div className="col-span-1">
          <div className="flex items-center gap-3 mb-3">
            <img src="/logo2.png" alt="EchoLearn" className="h-10 w-auto" />
          </div>
          <p className="text-gray-700 text-sm leading-relaxed max-w-xs">
            Sri Lanka's premier inclusive education platform for students with visual and cognitive learning differences.
          </p>

          <div className="flex gap-3 mt-6">
            <button aria-label="Visit site" className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-200">
              <Globe className="w-5 h-5 text-[#1E1E1E]" />
            </button>
            <button aria-label="Messages" className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-200">
              <MessageSquare className="w-5 h-5 text-[#1E1E1E]" />
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-3 text-gray-700 text-sm">
            <li><Link href="/features" className="hover:text-[#2D4496] transition-colors">Features</Link></li>
            <li><Link href="/about" className="hover:text-[#2D4496] transition-colors">About Us</Link></li>
            <li><Link href="/accessibility" className="hover:text-[#2D4496] transition-colors">Accessibility</Link></li>
            <li><a href="#" className="hover:text-[#2D4496] transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-bold mb-4">Support</h4>
          <ul className="space-y-3 text-gray-700 text-sm">
            <li><a href="#" className="hover:text-[#2D4496] transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-[#2D4496] transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-[#2D4496] transition-colors">For Teachers</a></li>
            <li><a href="#" className="hover:text-[#2D4496] transition-colors">For Schools</a></li>
          </ul>
        </div>

        {/* Subscribe (right) */}
        <div>
          <h4 className="font-bold mb-4">Subscribe</h4>
          <p className="text-gray-600 text-sm mb-4">Stay updated with our latest features.</p>
          <div className="flex items-center gap-3">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm placeholder-gray-500 focus:outline-none"
            />
            <button className="w-10 h-10 rounded-lg bg-[#2D4496] text-white flex items-center justify-center hover:bg-[#1E2B5A] transition-colors">
              →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-800 text-xs text-center">
          © 2024 EchoLearn Sri Lanka. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
