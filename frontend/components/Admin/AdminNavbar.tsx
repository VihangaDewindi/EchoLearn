"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard, Users, BookOpen, ActivitySquare, LogOut,
  GraduationCap, UserCheck, UserCog, Layers, BarChart3,
  Settings, Cpu, ShieldCheck,
} from "lucide-react";

const links = [
  { label: "Dashboard",        href: "/admin/dashboard",     icon: LayoutDashboard },
  { label: "User Management",  href: "/admin/users",         icon: Users },
  { label: "Curriculum",       href: "/admin/curriculum",    icon: Layers },
  { label: "Lessons",          href: "/admin/lessons",       icon: BookOpen },
  { label: "Teachers",         href: "/admin/teachers",      icon: UserCheck },
  { label: "Students",         href: "/admin/students",      icon: GraduationCap },
  { label: "Parents",          href: "/admin/parents",       icon: UserCog },
  { label: "Reports",          href: "/admin/reports",       icon: BarChart3 },
  { label: "AI Monitoring",    href: "/admin/ai-monitoring", icon: Cpu },
  { label: "Security",         href: "/admin/security",      icon: ShieldCheck },
  { label: "Settings",         href: "/admin/settings",      icon: Settings },
  { label: "Activity Log",     href: "/admin/activity",      icon: ActivitySquare },
];

export default function AdminNavbar({ adminName }: { adminName?: string }) {
  const pathname    = usePathname();
  const router      = useRouter();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const initials = adminName
    ? adminName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  return (
    <aside className="w-60 min-h-screen bg-[#1E2B5A] flex flex-col fixed top-0 left-0 z-40 overflow-y-auto">
      <div className="px-5 py-5 border-b border-white/10">
        <Image src="/logo.png" alt="EchoLearn" width={110} height={30} priority className="brightness-0 invert" />
        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">Admin Panel</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-bold transition-all ${
                active ? "bg-white text-[#1E2B5A]" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setDropOpen(prev => !prev)}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-[12px] hover:bg-white/10 transition group"
            title="Account options"
          >
            <div className="w-9 h-9 rounded-full bg-[#D5A67C] flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-sm group-hover:ring-2 group-hover:ring-white/30 transition">
              {initials}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[12px] font-black text-white leading-none truncate">{adminName || "Admin"}</p>
              <p className="text-[10px] text-white/50 mt-0.5">Administrator</p>
            </div>
            <LogOut size={14} className="text-white/40 group-hover:text-white/80 flex-shrink-0 transition" />
          </button>

          {dropOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-[#E9EDF5] rounded-[16px] shadow-2xl py-2 z-50">
              <div className="px-4 py-3 border-b border-[#F4F6FA]">
                <p className="text-[13px] font-black text-[#1E2B5A] truncate">{adminName || "Admin"}</p>
                <p className="text-[11px] text-[#8793AC] font-bold">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-black text-red-500 hover:bg-red-50 transition rounded-b-[16px]"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
