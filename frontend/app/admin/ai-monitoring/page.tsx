"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { Cpu, CheckCircle, BookOpen, TrendingUp, BarChart3 } from "lucide-react";

const API = "http://localhost:5001";

export default function AdminAIMonitoringPage() {
  const router  = useRouter();
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

    fetch(`${API}/api/admin/ai-stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  if (!admin) return null;

  const SUBJECT_COLORS: Record<string, string> = {
    Mathematics: "bg-indigo-500",
    Science:     "bg-emerald-500",
    English:     "bg-orange-500",
    Other:       "bg-gray-400",
  };

  const subjectEntries = data?.subjectCompletions
    ? Object.entries(data.subjectCompletions as Record<string, number>)
    : [];
  const totalSubjectCompletions = subjectEntries.reduce((a, [, v]) => a + (v as number), 0) || 1;

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AdminNavbar adminName={admin.fullName} />

      <main className="ml-60 flex-1 p-10">
        <div className="mb-8">
          <h1 className="text-[32px] font-black text-[#1E2B5A]">AI & Quiz Monitoring</h1>
          <p className="text-[#8793AC] font-bold mt-1">Track lesson completion, AI engagement, and student quiz activity.</p>
        </div>

        {/* KPI cards */}
        {loading ? (
          <div className="grid grid-cols-4 gap-6 mb-10">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-[20px] h-28 animate-pulse border border-[#E9EDF5]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: "Total Lesson Attempts", value: data?.totalLessonAttempts || 0, icon: BookOpen,     color: "bg-indigo-100 text-indigo-600" },
              { label: "Completed Lessons",      value: data?.completedLessons    || 0, icon: CheckCircle,  color: "bg-emerald-100 text-emerald-600" },
              { label: "In Progress",            value: data?.inProgressLessons   || 0, icon: TrendingUp,   color: "bg-blue-100 text-blue-600" },
              { label: "Completion Rate",        value: `${data?.completionRate   || 0}%`, icon: BarChart3, color: "bg-purple-100 text-purple-600" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-[20px] p-6 border border-[#E9EDF5] shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0 ${color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-[#8793AC] uppercase tracking-wider leading-tight">{label}</p>
                  <p className="text-[28px] font-black text-[#1E2B5A] leading-none mt-1">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Subject completion breakdown */}
          <div className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm p-8">
            <h3 className="text-[18px] font-black text-[#1E2B5A] mb-6">Completions by Subject</h3>
            {loading ? (
              <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded-xl animate-pulse" />)}</div>
            ) : subjectEntries.length === 0 ? (
              <p className="text-[#8793AC] font-bold text-center py-8">No completion data yet.</p>
            ) : (
              <div className="space-y-5">
                {subjectEntries.map(([subject, count]) => {
                  const pct = Math.round(((count as number) / totalSubjectCompletions) * 100);
                  return (
                    <div key={subject}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[14px] font-black text-[#1E2B5A]">{subject}</span>
                        <span className="text-[13px] font-black text-[#5E6D8F]">{count as number} completions</span>
                      </div>
                      <div className="h-3 w-full bg-[#F0F2F5] rounded-full overflow-hidden">
                        <div className={`h-full ${SUBJECT_COLORS[subject] || "bg-gray-400"} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI info card */}
          <div className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm p-8">
            <h3 className="text-[18px] font-black text-[#1E2B5A] mb-4 flex items-center gap-2">
              <Cpu size={20} className="text-[#1E2B5A]" /> AI Quiz Generation
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-[13px] font-black text-indigo-800">Provider</p>
                <p className="text-[15px] font-bold text-indigo-600 mt-1">Groq SDK (llama-3.3-70b)</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-[13px] font-black text-emerald-800">Fallback</p>
                <p className="text-[15px] font-bold text-emerald-600 mt-1">Lesson-based local questions</p>
              </div>
              <div className="p-4 bg-[#F8FAFD] rounded-xl border border-[#E9EDF5]">
                <p className="text-[13px] font-black text-[#8793AC]">Quiz generation is triggered when teachers click "Generate Quiz" on a lesson. Questions are based on the lesson's content blocks.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top attempted lessons table */}
        <div className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm p-8">
          <h3 className="text-[18px] font-black text-[#1E2B5A] mb-6">Top Attempted Lessons</h3>
          {loading ? (
            <div className="space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : !data?.topAttempted?.length ? (
            <p className="text-[#8793AC] font-bold text-center py-8">No lesson activity yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F5F7FB]">
                    <th className="text-left pb-4 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">#</th>
                    <th className="text-left pb-4 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Lesson</th>
                    <th className="text-left pb-4 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Subject</th>
                    <th className="text-left pb-4 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Grade</th>
                    <th className="text-right pb-4 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Attempts</th>
                    <th className="text-right pb-4 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Avg Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topAttempted.map((l: any, i: number) => (
                    <tr key={l.slug} className="border-b border-[#F5F7FB] hover:bg-[#F8FAFD] transition-colors">
                      <td className="py-4 text-[15px] font-black text-[#D5DCEB]">#{i + 1}</td>
                      <td className="py-4 text-[14px] font-black text-[#1E2B5A]">{l.title}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black ${
                          l.subject === "Mathematics" ? "bg-indigo-100 text-indigo-700" :
                          l.subject === "Science"     ? "bg-emerald-100 text-emerald-700" :
                          l.subject === "English"     ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"
                        }`}>{l.subject}</span>
                      </td>
                      <td className="py-4 text-[13px] font-bold text-[#5E6D8F]">
                        {l.grade ? `Grade ${String(l.grade).replace(/^Grade\s+/i, "")}` : "—"}
                      </td>
                      <td className="py-4 text-[15px] font-black text-[#1E2B5A] text-right">{l.attempts}</td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 h-2 bg-[#F0F2F5] rounded-full overflow-hidden">
                            <div className="h-full bg-[#1E2B5A] rounded-full" style={{ width: `${l.avgProgress}%` }} />
                          </div>
                          <span className="text-[13px] font-black text-[#5E6D8F] w-10 text-right">{l.avgProgress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
