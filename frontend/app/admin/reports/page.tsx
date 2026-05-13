"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { Users, BookOpen, TrendingUp, AlertTriangle, Zap, BarChart3 } from "lucide-react";

const API = "http://localhost:5001";
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getDayLabels() {
  const today = new Date().getDay(); // 0=Sun
  return Array.from({ length: 7 }, (_, i) => DAYS[((today - 6 + i + 7) % 7 + 1) % 7 === 0 ? 6 : ((today - 6 + i + 7) % 7 + 1) - 1]);
}

export default function AdminReportsPage() {
  const router = useRouter();
  const [admin, setAdmin]   = useState<any>(null);
  const [data, setData]     = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!raw || !token) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    if (u.role !== "admin") { router.push("/login"); return; }
    setAdmin(u);

    fetch(`${API}/api/admin/reports`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  if (!admin) return null;

  const dayLabels = getDayLabels();
  const raw       = data?.dailyActive || [];
  const maxVal    = Math.max(...raw, 1);

  const subjectBars = data ? [
    { label: "Mathematics", value: data.subjectAvgs?.math    || 0, color: "bg-indigo-500" },
    { label: "Science",     value: data.subjectAvgs?.science || 0, color: "bg-emerald-500" },
    { label: "English",     value: data.subjectAvgs?.english || 0, color: "bg-orange-500" },
    { label: "Overall",     value: data.subjectAvgs?.overall || 0, color: "bg-[#1E2B5A]" },
  ] : [];

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AdminNavbar adminName={admin.fullName} />

      <main className="ml-60 flex-1 p-10">
        <div className="mb-8">
          <h1 className="text-[32px] font-black text-[#1E2B5A]">Reports & Analytics</h1>
          <p className="text-[#8793AC] font-bold mt-1">Platform-wide performance and engagement statistics.</p>
        </div>

        {/* KPI cards */}
        {loading ? (
          <div className="grid grid-cols-3 gap-6 mb-10">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-[20px] h-28 animate-pulse border border-[#E9EDF5]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: "Total Students",  value: data?.overview?.totalStudents  || 0, icon: Users,         color: "bg-indigo-100 text-indigo-600" },
              { label: "Total Teachers",  value: data?.overview?.totalTeachers  || 0, icon: Users,         color: "bg-emerald-100 text-emerald-600" },
              { label: "Total Lessons",   value: data?.overview?.totalLessons   || 0, icon: BookOpen,      color: "bg-purple-100 text-purple-600" },
              { label: "Total XP Earned", value: (data?.overview?.totalXP || 0).toLocaleString(), icon: Zap, color: "bg-yellow-100 text-yellow-600" },
              { label: "Active Classes",  value: data?.overview?.totalClasses   || 0, icon: BarChart3,     color: "bg-blue-100 text-blue-600" },
              { label: "At Risk Students",value: data?.overview?.atRisk         || 0, icon: AlertTriangle, color: "bg-red-100 text-red-600" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-[20px] p-7 border border-[#E9EDF5] shadow-sm flex items-center gap-5">
                <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center ${color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider">{label}</p>
                  <p className="text-[30px] font-black text-[#1E2B5A] leading-none mt-1">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Subject Averages */}
          <div className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm p-8">
            <h3 className="text-[18px] font-black text-[#1E2B5A] mb-6">Subject Average Progress</h3>
            {loading ? (
              <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded-xl animate-pulse" />)}</div>
            ) : subjectBars.length === 0 ? (
              <p className="text-[#8793AC] font-bold text-center py-8">No student data available yet.</p>
            ) : (
              <div className="space-y-5">
                {subjectBars.map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[14px] font-black text-[#1E2B5A]">{label}</span>
                      <span className="text-[14px] font-black text-[#5E6D8F]">{value}%</span>
                    </div>
                    <div className="h-3 w-full bg-[#F0F2F5] rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Daily Active Users chart */}
          <div className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm p-8">
            <h3 className="text-[18px] font-black text-[#1E2B5A] mb-6">Daily Active Learners (Last 7 Days)</h3>
            {loading ? (
              <div className="h-40 bg-gray-100 rounded-xl animate-pulse" />
            ) : (
              <div className="flex items-end justify-between gap-2 h-48">
                {raw.map((val: number, i: number) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-[11px] font-black text-[#8793AC]">{val}</span>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 ${i === 6 ? "bg-[#1E2B5A]" : val > 0 ? "bg-[#7B9ED6]" : "bg-[#F0F2F5]"}`}
                      style={{ height: `${Math.round((val / maxVal) * 140) + 4}px` }}
                    />
                    <span className="text-[11px] font-black text-[#8793AC]">{dayLabels[i]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Lessons */}
        <div className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp size={20} className="text-[#1E2B5A]" />
            <h3 className="text-[18px] font-black text-[#1E2B5A]">Top Lessons by Participation</h3>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : !data?.topLessons?.length ? (
            <p className="text-[#8793AC] font-bold text-center py-8">No lesson activity recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topLessons.map((lesson: any, i: number) => (
                <div key={lesson.slug} className="flex items-center gap-5 p-4 bg-[#F8FAFD] rounded-xl border border-[#E9EDF5]">
                  <span className="text-[22px] font-black text-[#D5DCEB] w-8">#{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-[14px] font-black text-[#1E2B5A]">{lesson.title}</p>
                    <p className="text-[12px] font-bold text-[#8793AC]">{lesson.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] font-black text-[#1E2B5A]">{lesson.count}</p>
                    <p className="text-[11px] font-bold text-[#8793AC]">students</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
