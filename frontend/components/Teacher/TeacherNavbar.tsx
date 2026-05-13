"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function TeacherNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const navLinks = [
    { label: "Dashboard", href: "/Teacher/dashboard" },
    { label: "Classes", href: "/Teacher/classes" },
    { label: "Students", href: "/Teacher/students" },
    { label: "Curriculum", href: "/Teacher/curriculum" },
    { label: "Reports", href: "/Teacher/reports" },
  ];

  return (
    <div className="w-full bg-white flex justify-center sticky top-0 z-50 border-b">
      <nav className="w-full max-w-[1440px] px-8 h-[72px] flex items-center justify-between gap-4">

        {/* LEFT: Logo */}
        <Link href="/Teacher/dashboard" className="flex items-center">
          <Image src="/logo.png" alt="EchoLearn" width={140} height={36} priority />
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

        {/* RIGHT: Search + Avatar */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full w-64">
            <Search size={16} className="text-gray-700" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-100 text-sm w-full focus:outline-none"
            />
          </div>

          {/* Avatar dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="w-8 h-8 rounded-full bg-[#E58814] flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:opacity-90 transition"
            >
              {user?.fullName?.charAt(0)?.toUpperCase() || "T"}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-900 truncate">{user?.fullName || "Teacher"}</p>
                  <p className="text-[11px] text-gray-400 truncate">{user?.email || ""}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={15} /> Log Out
                </button>
              </div>
            )}
          </div>
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
