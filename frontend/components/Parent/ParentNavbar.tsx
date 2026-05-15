"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ParentNavbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [user, setUser]           = useState<any>(null);
  const [dropOpen, setDropOpen]   = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "P";

  const navLinks = [
    { label: "Dashboard", href: "/Parent/dashboard" },
    { label: "My Child",  href: "/Parent/my-child"  },
    { label: "Resources", href: "/Parent/resources"  },
  ];

  return (
    <div className="w-full bg-white flex justify-center sticky top-0 z-50 border-b">
      <nav className="w-full max-w-[1440px] px-8 h-[80px] flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/Parent/dashboard" className="flex items-center">
          <Image src="/logo.png" alt="EchoLearn" width={140} height={36} priority />
        </Link>

        {/* Nav links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <NavLink key={link.label} label={link.label} href={link.href} isActive={pathname === link.href} />
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center gap-2 bg-[#F8FAFD] px-5 py-2.5 rounded-xl border border-[#E5E9F0] w-64">
            <Search size={18} className="text-[#A0A9C0]" />
            <input type="text" placeholder="Quick search..." className="bg-transparent text-sm font-bold text-[#1E273F] w-full focus:outline-none placeholder-[#A0A9C0]" />
          </div>

          {/* Avatar with logout dropdown */}
          <div className="relative" ref={dropRef}>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[14px] font-black text-[#1E273F]">{user?.fullName || "Parent"}</p>
              </div>
              <button
                onClick={() => setDropOpen(prev => !prev)}
                className="w-10 h-10 rounded-full bg-[#D5A67C] flex items-center justify-center text-white text-[15px] font-black cursor-pointer border-2 border-white shadow-sm hover:ring-2 hover:ring-[#D5A67C]/40 transition"
                title="Account options"
              >
                {initials}
              </button>
            </div>

            {dropOpen && (
              <div className="absolute right-0 top-12 bg-white border border-[#E5E9F0] rounded-[16px] shadow-xl w-[180px] py-2 z-50">
                <div className="px-4 py-3 border-b border-[#F4F6FA]">
                  <p className="text-[13px] font-black text-[#1E2B5A] truncate">{user?.fullName}</p>
                  <p className="text-[11px] text-[#8793AC] font-bold truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-black text-red-500 hover:bg-red-50 transition rounded-b-[16px]"
                >
                  <LogOut size={16} /> Log Out
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
    <Link href={href}
      className={`relative text-[15px] font-black transition-colors group py-2 ${isActive ? "text-[#33478D]" : "text-[#8793AC] hover:text-[#33478D]"}`}>
      {label}
      <span className={`absolute left-0 bottom-[-10px] h-[3px] bg-[#33478D] rounded-t-full transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
    </Link>
  );
}
