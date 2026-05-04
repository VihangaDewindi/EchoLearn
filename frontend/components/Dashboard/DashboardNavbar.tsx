"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DashboardNavbar({ user }: { user: any }) {
  const pathname = usePathname();

  const links = [
    { label: "Home",         href: "/Student/dashboard" },
    { label: "Lessons",      href: "/lessons" },
    { label: "Achievements", href: "/achievements" },
    { label: "Quiz",         href: "/quiz" },
  ];

  return (
    <div className="w-full bg-white flex justify-center sticky top-0 z-50 border-b">
      <nav className="relative w-full max-w-6xl px-6 h-[72px] flex items-center justify-between">

        {/* LEFT: Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="EchoLearn" width={140} height={36} priority />
        </Link>

        {/* CENTER: Navigation Links */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {links.map(({ label, href }) => (
            <NavLink key={label} label={label} href={href} active={pathname === href} />
          ))}
        </div>

        {/* RIGHT: Search + Settings + Avatar */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full w-64">
            <Search size={16} className="text-gray-700" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-100 text-sm w-full focus:outline-none"
            />
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1F3F7F] flex items-center justify-center text-white text-sm font-bold">
            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>

      </nav>
    </div>
  );
}

function NavLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`relative text-sm font-semibold transition-colors group py-2 ${
        active ? "text-[#1E2B5A]" : "text-gray-600 hover:text-[#1E2B5A]"
      }`}
    >
      {label}
      <span
        className={`absolute left-0 bottom-0 h-[2px] bg-[#3A4A8A] transition-all duration-300 ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
}
