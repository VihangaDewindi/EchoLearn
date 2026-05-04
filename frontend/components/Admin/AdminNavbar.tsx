"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, ActivitySquare, LogOut, GraduationCap, UserCheck, UserCog } from "lucide-react";

const links = [
  { label: "Dashboard",  href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "All Users",  href: "/admin/users",     icon: Users },
  { label: "Students",   href: "/admin/students",  icon: GraduationCap },
  { label: "Teachers",   href: "/admin/teachers",  icon: UserCheck },
  { label: "Parents",    href: "/admin/parents",   icon: UserCog },
  { label: "Content",    href: "/admin/content",   icon: BookOpen },
  { label: "Activity",   href: "/admin/activity",  icon: ActivitySquare },
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
    <aside className="w-64 min-h-screen bg-[#1E2B5A] flex flex-col fixed top-0 left-0 z-40">
      <div className="px-6 py-6 border-b border-white/10">
        <Image src="/logo.png" alt="EchoLearn" width={120} height={32} priority className="brightness-0 invert" />
        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">Admin Panel</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-[12px] text-[14px] font-bold transition-all ${
                active ? "bg-white text-[#1E2B5A]" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-6 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm">
            {adminName?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div>
            <p className="text-[13px] font-bold text-white leading-none">{adminName || "Admin"}</p>
            <p className="text-[10px] text-white/50 mt-0.5">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-white/60 hover:text-white text-[13px] font-bold transition"
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
