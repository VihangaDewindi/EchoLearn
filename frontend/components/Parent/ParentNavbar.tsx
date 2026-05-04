"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ParentNavbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const navLinks = [
    { label: "Dashboard", href: "/Parent/dashboard" },
    { label: "My Child", href: "/Parent/my-child" },
    { label: "Resources", href: "/Parent/resources" },
  ];

  return (
    <div className="w-full bg-white flex justify-center sticky top-0 z-50 border-b">
      <nav className="w-full max-w-[1440px] px-8 h-[80px] flex items-center justify-between gap-4">

        {/* LEFT: Logo */}
        <Link href="/parent/dashboard" className="flex items-center">
          <Image
            src="/logo.png"
            alt="EchoLearn"
            width={140}
            height={36}
            priority
          />
        </Link>

        {/* CENTER: Navigation Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <NavLink 
                key={link.label} 
                label={link.label} 
                href={link.href} 
                isActive={pathname === link.href}
            />
          ))}
        </div>

        {/* RIGHT: Search + Profile */}
        <div className="flex items-center gap-6">

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-[#F8FAFD] px-5 py-2.5 rounded-xl border border-[#E5E9F0] w-64 lg:w-80">
            <Search size={18} className="text-[#A0A9C0]" />
            <input
              type="text"
              placeholder="Quick search..."
              className="bg-transparent text-sm font-bold text-[#1E273F] w-full focus:outline-none placeholder-[#A0A9C0]"
            />
          </div>

          {/* Settings icon */}
          <button className="p-2.5 bg-[#F8FAFD] border border-[#E5E9F0] rounded-xl text-[#8793AC] hover:text-[#33478D] transition-colors">
            <Settings size={20} />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2">
             <div className="text-right hidden sm:block">
                <p className="text-[14px] font-black text-[#1E273F]">
                   Welcome, {user?.fullName || "Parent"}
                </p>
                <p className="text-[11px] font-bold text-[#8793AC] uppercase tracking-widest">
                   {user?.role || "Parent Account"}
                </p>
             </div>
             <div className="w-10 h-10 rounded-full bg-[#D5A67C] flex items-center justify-center text-white text-[16px] font-black cursor-pointer border-2 border-white shadow-sm overflow-hidden">
                {user?.fullName ? (
                  user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                ) : (
                  "P"
                )}
             </div>
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
      className={`relative text-[15px] font-black transition-colors group py-2 ${
        isActive ? "text-[#33478D]" : "text-[#8793AC] hover:text-[#33478D]"
      }`}
    >
      {label}
      <span className={`absolute left-0 bottom-[-10px] h-[3px] bg-[#33478D] rounded-t-full transition-all duration-300 ${
        isActive ? "w-full" : "w-0 group-hover:w-full"
      }`}></span>
    </Link>
  );
}
