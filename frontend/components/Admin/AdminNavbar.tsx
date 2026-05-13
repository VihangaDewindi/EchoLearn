"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();
  const router   = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

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

      <div className="px-5 py-5 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm">
            {adminName?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div>
            <p className="text-[12px] font-bold text-white leading-none">{adminName || "Admin"}</p>
            <p className="text-[10px] text-white/50 mt-0.5">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-white/60 hover:text-white text-[13px] font-bold transition"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
