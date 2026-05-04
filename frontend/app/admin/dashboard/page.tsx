"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { Users, BookOpen, Zap, Activity, GraduationCap, UserCheck, UserCog } from "lucide-react";

type Stats = {
  totalUsers: number;
  students: number;
  teachers: number;
  parents: number;
  totalLessons: number;
  recentLogs: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin]   = useState<any>(null);
  const [stats, setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!raw || !token) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    if (u.role !== "admin") { router.push("/login"); return; }
    setAdmin(u);

    fetch("http://localhost:5001/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => { setError("Failed to load stats."); setLoading(false); });
  }, [router]);

  if (!admin) return null;

  const cards = stats
    ? [
        { label: "Total Users",    value: stats.totalUsers,  icon: Users,        color: "bg-indigo-100 text-indigo-600" },
        { label: "Students",       value: stats.students,    icon: GraduationCap, color: "bg-blue-100 text-blue-600" },
        { label: "Teachers",       value: stats.teachers,    icon: UserCheck,    color: "bg-emerald-100 text-emerald-600" },
        { label: "Parents",        value: stats.parents,     icon: UserCog,      color: "bg-orange-100 text-orange-600" },
        { label: "Lessons",        value: stats.totalLessons, icon: BookOpen,    color: "bg-purple-100 text-purple-600" },
        { label: "Activity (7d)",  value: stats.recentLogs,  icon: Activity,     color: "bg-yellow-100 text-yellow-600" },
      ]
    : [];

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AdminNavbar adminName={admin.fullName} />

      <main className="ml-64 flex-1 p-10">
        <div className="mb-10">
          <h1 className="text-[32px] font-black text-[#1E2B5A] leading-none">Admin Dashboard</h1>
          <p className="text-[#8793AC] font-bold mt-2">Platform overview · EchoLearn</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-8 font-bold">{error}</div>}

        {loading ? (
          <div className="grid grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-[20px] p-8 animate-pulse h-32 border border-[#E9EDF5]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6 mb-12">
            {cards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-[20px] p-8 border border-[#E9EDF5] shadow-sm flex items-center gap-6">
                <div className={`w-14 h-14 rounded-[14px] flex items-center justify-center ${color}`}>
                  <Icon size={26} />
                </div>
                <div>
                  <p className="text-[13px] font-black text-[#8793AC] uppercase tracking-wider">{label}</p>
                  <p className="text-[36px] font-black text-[#1E2B5A] leading-none mt-1">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { title: "All Users",      desc: "View, edit roles, and remove users",   href: "/admin/users",     icon: Users,         bg: "bg-indigo-600" },
            { title: "Students",       desc: "XP, level, streak and subject progress",href: "/admin/students",  icon: GraduationCap, bg: "bg-blue-600" },
            { title: "Teachers",       desc: "Browse teachers and their classes",     href: "/admin/teachers",  icon: UserCheck,     bg: "bg-emerald-600" },
            { title: "Parents",        desc: "Parents and their linked children",     href: "/admin/parents",   icon: UserCog,       bg: "bg-orange-500" },
            { title: "Manage Content", desc: "Browse lessons and course content",     href: "/admin/content",   icon: BookOpen,      bg: "bg-purple-600" },
            { title: "Activity Log",   desc: "See recent platform activity",          href: "/admin/activity",  icon: Zap,           bg: "bg-rose-500" },
          ].map(({ title, desc, href, icon: Icon, bg }) => (
            <button
              key={title}
              onClick={() => router.push(href)}
              className="bg-white rounded-[20px] p-8 border border-[#E9EDF5] shadow-sm text-left hover:shadow-md transition group"
            >
              <div className={`w-12 h-12 rounded-[12px] ${bg} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform`}>
                <Icon size={22} />
              </div>
              <h3 className="text-[17px] font-black text-[#1E2B5A] mb-1">{title}</h3>
              <p className="text-[13px] text-[#8793AC] font-bold">{desc}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
