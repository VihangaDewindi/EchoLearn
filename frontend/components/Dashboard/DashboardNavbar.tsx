"use client";

import Image from "next/image";
import { Search, Settings } from "lucide-react";

export default function DashboardNavbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      
      {/* Left Side */}
      <div className="flex items-center gap-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo2.png"
            alt="EchoLearn"
            width={140}
            height={36}
            className="object-contain"
          />
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#2D3E75]">
            Lessons
          </a>
          <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#2D3E75]">
            Achievements
          </a>
          <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#2D3E75]">
            Quiz
          </a>
          <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#2D3E75]">
            Library
          </a>
        </div>

      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1 justify-center px-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-full shadow-sm w-full">
          <Search size={18} className="text-gray-700" />
          <input
            type="text"
            placeholder="Search lessons, topics, or help..."
            className="bg-transparent rounded-full px-2 py-1 text-sm w-full focus:outline-none"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
          <Settings size={20} className="text-gray-600" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
          A
        </div>

      </div>

    </nav>
  );
}
