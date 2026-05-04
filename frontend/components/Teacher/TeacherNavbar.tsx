"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function TeacherNavbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const navLinks = [
    { label: "Dashboard", href: "/Teacher/dashboard" },
    { label: "Classes", href: "/Teacher/classes" },
    { label: "Students (Active)", href: "/Teacher/students" },
    { label: "Curriculum", href: "/Teacher/curriculum" },
    { label: "Reports", href: "/Teacher/reports" },
  ];

  return (
    <div className="w-full bg-white flex justify-center sticky top-0 z-50 border-b">
      <nav className="w-full max-w-[1440px] px-8 h-[72px] flex items-center justify-between gap-4">

        {/* LEFT: Logo */}
        <Link href="/Teacher/dashboard" className="flex items-center">
          <Image
            src="/logo.png"
            alt="EchoLearn"
            width={140}
            height={36}
            priority
          />
        </Link>

        {/* CENTER: Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-10">
          {navLinks.map((link) => (
            <NavLink 
                key={link.label} 
                label={link.label} 
                href={link.href} 
                isActive={pathname === link.href}
            />
          ))}
        </div>

        {/* RIGHT: Search + Settings + Avatar */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full w-64">
            <Search size={16} className="text-gray-700" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-100 text-sm w-full focus:outline-none"
            />
          </div>

          {/* Settings */}
          <Link href="/Teacher/profile">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Settings size={20} className="text-gray-700" />
            </button>
          </Link>

          {/* Avatar */}
          <Link href="/Teacher/profile">
            <div className="w-8 h-8 rounded-full bg-[#E58814] flex items-center justify-center text-white text-sm font-bold cursor-pointer">
              {user?.fullName?.charAt(0)?.toUpperCase() || "T"}          
            </div>
          </Link>

        </div>

      </nav>
    </div>
  );
}

function NavLink({ label, href, isActive }: { label: string; href: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`relative text-sm font-semibold transition-colors group py-2 ${
        isActive ? "text-[#1E2B5A]" : "text-gray-600 hover:text-[#1E2B5A]"
      }`}
    >
      {label}
      <span className={`absolute left-0 bottom-0 h-[2px] bg-[#3A4A8A] transition-all duration-300 ${
        isActive ? "w-full" : "w-0 group-hover:w-full"
      }`}></span>
    </Link>
  );
}
