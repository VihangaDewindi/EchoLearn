"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { Search, Trophy, Flame, Star, BookOpen, TrendingUp } from "lucide-react";

type Student = {
  _id: string;
  fullName: string;
  email: string;
  xp: number;
  streak: number;
  level: number;
  badges: { name: string; icon: string }[];
  progress: { math: number; science: number; english: number };
  lastActive: string;
  createdAt: string;
};

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

export default function AdminStudents() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("user");
    const tok = localStorage.getItem("token") || "";
    if (!raw || !tok) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    if (u.role !== "admin") { router.push("/login"); return; }
    setAdmin(u);
    setToken(tok);
  }, [router]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());

    fetch(`http://localhost:5001/api/admin/students?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setStudents(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setStudents([]); setLoading(false); });
  }, [token, search]);

  if (!admin) return null;

  const levelColor = (lvl: number) => {
    if (lvl >= 8) return "bg-purple-100 text-purple-700";
    if (lvl >= 5) return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AdminNavbar adminName={admin.fullName} />

      <main className="ml-64 flex-1 p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-black text-[#1E2B5A]">Students</h1>
            <p className="text-[#8793AC] font-bold mt-1">
              {loading ? "Loading..." : `${students.length} student${students.length !== 1 ? "s" : ""} registered`}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-[#E9EDF5] px-4 py-3 rounded-[14px] w-[300px] shadow-sm">
            <Search size={16} className="text-[#8793AC]" />
            <input
              type="text"
              placeholder="Search by name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-[14px] font-bold text-[#1E2B5A] placeholder:text-[#8793AC] focus:outline-none w-full"
            />
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#F8FAFF] border-b border-[#E9EDF5]">
                <th className="text-left px-6 py-4 font-black text-[#8793AC] uppercase tracking-wider text-[11px]">Student</th>
                <th className="text-left px-6 py-4 font-black text-[#8793AC] uppercase tracking-wider text-[11px]">Level</th>
                <th className="text-left px-6 py-4 font-black text-[#8793AC] uppercase tracking-wider text-[11px]">XP</th>
                <th className="text-left px-6 py-4 font-black text-[#8793AC] uppercase tracking-wider text-[11px]">Streak</th>
                <th className="text-left px-6 py-4 font-black text-[#8793AC] uppercase tracking-wider text-[11px]">Subject Progress</th>
                <th className="text-left px-6 py-4 font-black text-[#8793AC] uppercase tracking-wider text-[11px]">Badges</th>
                <th className="text-left px-6 py-4 font-black text-[#8793AC] uppercase tracking-wider text-[11px]">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-[#F4F6FA]">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-6 py-5"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#8793AC] font-bold">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map(s => (
                  <tr key={s._id} className="border-b border-[#F4F6FA] hover:bg-[#F8FAFF] transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                          {s.fullName?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#1E2B5A] leading-none">{s.fullName}</p>
                          <p className="text-[11px] text-[#8793AC] mt-0.5">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-[8px] text-[12px] font-black ${levelColor(s.level)}`}>
                        Lv {s.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-black text-[#1E2B5A]">
                        <Star size={14} className="text-yellow-500" />
                        {(s.xp || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-black text-[#1E2B5A]">
                        <Flame size={14} className="text-orange-500" />
                        {s.streak || 0}d
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[180px]">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-[#8793AC] w-14">Math</span>
                          <ProgressBar value={s.progress?.math || 0} color="bg-blue-500" />
                          <span className="text-[10px] font-black text-[#8793AC] w-7 text-right">{s.progress?.math || 0}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-[#8793AC] w-14">Science</span>
                          <ProgressBar value={s.progress?.science || 0} color="bg-emerald-500" />
                          <span className="text-[10px] font-black text-[#8793AC] w-7 text-right">{s.progress?.science || 0}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-[#8793AC] w-14">English</span>
                          <ProgressBar value={s.progress?.english || 0} color="bg-purple-500" />
                          <span className="text-[10px] font-black text-[#8793AC] w-7 text-right">{s.progress?.english || 0}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {s.badges?.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <Trophy size={14} className="text-yellow-500" />
                          <span className="font-black text-[#1E2B5A]">{s.badges.length}</span>
                        </div>
                      ) : (
                        <span className="text-[#8793AC] font-bold">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#8793AC] font-bold">
                      {s.lastActive ? new Date(s.lastActive).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!loading && (
            <div className="px-6 py-4 bg-[#F8FAFF] border-t border-[#E9EDF5] text-[12px] font-bold text-[#8793AC]">
              {students.length} student{students.length !== 1 ? "s" : ""} shown · sorted by XP
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
