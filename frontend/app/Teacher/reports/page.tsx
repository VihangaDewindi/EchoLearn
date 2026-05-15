"use client";

import React, { useState, useEffect } from 'react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';
import TeacherFooter from '@/components/Teacher/TeacherFooter';
import {
  Download, Share2, RefreshCw,
  Star, CheckCircle2, Users, AlertCircle,
  ArrowUpRight, Search, ArrowUpDown, FileText, TrendingUp,
} from 'lucide-react';

const API = "http://localhost:5001";

export default function ReportsPage() {
  const [data, setData]           = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [tableSearch, setTableSearch] = useState('');
  const [sortDesc, setSortDesc]   = useState(true);
  const [toast, setToast]         = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadData = () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    fetch(`${API}/api/teacher/reports`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(loadData, []);

  const students    = data?.students || [];
  const kpis        = data?.kpis || { avgQuizScore: "—", completionRate: 92, engagementRate: 78, atRisk: 0 };
  const subjectAvgs = data?.subjectAverages || [];

  const filteredStudents = students
    .filter((s: any) =>
      s.fullName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(tableSearch.toLowerCase())
    )
    .sort((a: any, b: any) => sortDesc ? b.quizAvg - a.quizAvg : a.quizAvg - b.quizAvg);

  // ── CSV Export ──────────────────────────────────────────────────
  const handleCSVDownload = () => {
    if (!students.length) { showToast("No data to export."); return; }

    const headers = ["Name", "Email", "Mathematics %", "Science %", "English %", "Avg Score %", "Badges", "Streak", "Status"];
    const rows = students.map((s: any) => [
      `"${s.fullName}"`,
      `"${s.email}"`,
      s.math,
      s.science,
      s.english,
      s.quizAvg,
      s.badges,
      s.streak,
      s.status,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r: any[]) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href     = url;
    link.download = `EchoLearn_Report_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("CSV downloaded successfully!");
  };

  // ── Export PDF (print-to-PDF) ────────────────────────────────────
  const handlePrint = () => {
    showToast("Print dialog opened — choose 'Save as PDF' to download.");
    setTimeout(() => window.print(), 400);
  };

  function scoreLabel(avg: number): { label: string; bg: string; text: string } {
    if (avg >= 90) return { label: "Excellent",            bg: "bg-[#ECFDF5]", text: "text-[#065F46]" };
    if (avg >= 75) return { label: "Very Good",            bg: "bg-[#F0FDF4]", text: "text-[#166534]" };
    if (avg >= 60) return { label: "Good Performance",     bg: "bg-[#EFF6FF]", text: "text-[#1E40AF]" };
    if (avg >= 50) return { label: "Moderate Performance", bg: "bg-[#FEFCE8]", text: "text-[#92400E]" };
    if (avg >= 40) return { label: "Below Average",        bg: "bg-[#FFF7ED]", text: "text-[#C2410C]" };
    return           { label: "Needs Support",             bg: "bg-[#FFF1F1]", text: "text-[#C81E1E]" };
  }

  // ── Share ───────────────────────────────────────────────────────
  const handleShare = () => {
    const summary =
      `EchoLearn Class Report\n` +
      `Avg Quiz Score: ${kpis.avgQuizScore}%\n` +
      `Lesson Completion: ${kpis.completionRate}%\n` +
      `Student Engagement: ${kpis.engagementRate}%\n` +
      `At-Risk Students: ${kpis.atRisk}`;

    if (navigator.share) {
      navigator.share({ title: "EchoLearn Report", text: summary }).catch(() => {});
    } else {
      navigator.clipboard.writeText(summary).then(() => showToast("Report summary copied to clipboard!"));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col font-sans text-left">
      <TeacherNavbar />

      {toast && (
        <div className="fixed top-4 right-4 z-[100] bg-[#1E2B5A] text-white px-6 py-3 rounded-xl shadow-xl font-bold text-[14px]">
          {toast}
        </div>
      )}

      {/* Print styles */}
      <style>{`
        @media print {
          nav, footer, .no-print { display: none !important; }
          body { background: white !important; }
          .print-page { padding: 20px !important; }
        }
      `}</style>

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-8 md:p-12 print-page">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] font-bold text-[#8793AC] mb-6">
          <span>Analytics</span>
          <span className="text-[#A0A9C0]">{">"}</span>
          <span className="text-[#33478D]">Academic Reports</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-[36px] font-black text-[#1E273F] tracking-tight">Performance Reports</h1>
            <p className="text-[#8793AC] font-semibold mt-1">Detailed student and class progress insights</p>
          </div>
          <div className="flex items-center gap-3 no-print">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-[#F5F7FB] text-[#33478D] px-6 py-3 rounded-xl font-black text-[14px] hover:bg-[#EAEFF7] transition-all"
            >
              <Share2 size={18} strokeWidth={2.5} />
              Share
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#1E2B5A] text-white px-6 py-3 rounded-xl font-black text-[14px] shadow-lg shadow-blue-900/10 hover:bg-[#151F41] transition-all"
            >
              <Download size={18} strokeWidth={2.5} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Refresh action */}
        <div className="flex justify-end mb-10 no-print">
          <button
            onClick={loadData}
            className="p-2.5 text-[#8793AC] hover:bg-[#F5F7FB] rounded-xl transition-all border border-[#E5E9F0]"
            title="Refresh data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[24px] border border-[#E5E9F0] shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                <Star size={20} fill="currentColor" />
              </div>
              <div className="flex items-center gap-1 text-[#2E7D32] bg-[#E9F7EF] px-2 py-1 rounded-lg text-[12px] font-black">
                <ArrowUpRight size={14} /> Live
              </div>
            </div>
            <p className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Avg. Quiz Score</p>
            <h3 className="text-[32px] font-black text-[#1E273F] mt-1">{loading ? "—" : `${kpis.avgQuizScore}%`}</h3>
            <p className="text-[12px] font-bold text-[#A0A9C0] mt-3">Based on all enrolled students</p>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-[#E5E9F0] shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
                <CheckCircle2 size={20} />
              </div>
              <div className="flex items-center gap-1 text-[#2E7D32] bg-[#E9F7EF] px-2 py-1 rounded-lg text-[12px] font-black">
                <ArrowUpRight size={14} /> Live
              </div>
            </div>
            <p className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Lesson Completion</p>
            <h3 className="text-[32px] font-black text-[#1E273F] mt-1">{kpis.completionRate}%</h3>
            <p className="text-[12px] font-bold text-[#A0A9C0] mt-3">Average across all classes</p>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-[#E5E9F0] shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                <Users size={20} />
              </div>
              <div className="text-[#8793AC] bg-[#F5F7FB] px-2 py-1 rounded-lg text-[12px] font-black">Stable</div>
            </div>
            <p className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Student Engagement</p>
            <h3 className="text-[32px] font-black text-[#1E273F] mt-1">{kpis.engagementRate}%</h3>
            <p className="text-[12px] font-bold text-[#A0A9C0] mt-3">Platform activity rate</p>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-[#E5E9F0] shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                <AlertCircle size={20} />
              </div>
              <div className="flex items-center gap-1 text-[#C81E1E] bg-[#FFF1F1] px-2 py-1 rounded-lg text-[12px] font-black">
                <TrendingUp size={14} /> {kpis.atRisk}
              </div>
            </div>
            <p className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider">At-Risk Students</p>
            <h3 className="text-[32px] font-black text-[#1E273F] mt-1">{loading ? "—" : kpis.atRisk}</h3>
            <p className="text-[12px] font-bold text-[#A0A9C0] mt-3">Scoring below 40%</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Subject Averages */}
          <div className="bg-white p-8 rounded-[28px] border border-[#E5E9F0] shadow-sm">
            <h3 className="text-[18px] font-black text-[#1E273F] mb-8">Subject Averages</h3>
            <div className="space-y-6">
              {loading ? (
                <div className="text-[#8793AC] font-bold text-center py-4">Loading...</div>
              ) : subjectAvgs.length > 0 ? subjectAvgs.map((item: any) => (
                <div key={item.subject}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px] font-black text-[#1E273F]">{item.subject}</span>
                    <span className="text-[13px] font-black text-[#1E273F]">{item.avg}%</span>
                  </div>
                  <div className="h-2 bg-[#F0F2F5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1E2B5A] rounded-full transition-all duration-700"
                      style={{ width: `${item.avg}%` }}
                    ></div>
                  </div>
                </div>
              )) : (
                <div className="text-[#8793AC] font-bold text-center py-4">No subject data yet.</div>
              )}
            </div>
          </div>

          {/* Score Distribution */}
          <div className="bg-white p-8 rounded-[28px] border border-[#E5E9F0] shadow-sm">
            <h3 className="text-[18px] font-black text-[#1E273F] mb-8">Student Score Distribution</h3>
            <div className="h-48 flex items-end justify-between px-2 gap-2">
              {loading ? (
                <div className="w-full text-center text-[#8793AC] font-bold">Loading...</div>
              ) : students.length === 0 ? (
                <div className="w-full text-center text-[#8793AC] font-bold self-center">No student data yet.</div>
              ) : (() => {
                const tiers = [
                  { label: "< 40%",   color: "bg-[#E85A4F]", min: 0,  max: 40  },
                  { label: "40–49%",  color: "bg-[#EA580C]", min: 40, max: 50  },
                  { label: "50–59%",  color: "bg-[#D97706]", min: 50, max: 60  },
                  { label: "60–74%",  color: "bg-[#3B82F6]", min: 60, max: 75  },
                  { label: "75–89%",  color: "bg-[#16a34a]", min: 75, max: 90  },
                  { label: "90–100%", color: "bg-[#059669]", min: 90, max: 101 },
                ];
                const counts = tiers.map(t =>
                  students.filter((s: any) => s.quizAvg >= t.min && s.quizAvg < t.max).length
                );
                const maxVal = Math.max(...counts, 1);
                return tiers.map((t, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[11px] font-black text-[#1E273F]">{counts[i]}</span>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 ${t.color}`}
                      style={{ height: `${Math.max((counts[i] / maxVal) * 100, 4)}%` }}
                    ></div>
                    <span className="text-[9px] font-bold text-[#A0A9C0] text-center leading-tight">{t.label}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Student Performance Table */}
        <div className="bg-white rounded-[28px] border border-[#E5E9F0] shadow-sm overflow-hidden mb-12">
          <div className="p-8 border-b border-[#E5E9F0] flex items-center justify-between bg-gray-50/30">
            <h3 className="text-[18px] font-black text-[#1E273F]">Individual Student Performance</h3>
            <div className="flex items-center gap-3 no-print">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A9C0]" size={16} />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filter by student..."
                  className="bg-[#F8FAFD] border border-[#E5E9F0] rounded-xl pl-10 pr-4 py-2 text-[14px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] w-64"
                />
              </div>
              <button
                onClick={() => setSortDesc(!sortDesc)}
                className="flex items-center gap-2 bg-[#F8FAFD] px-4 py-2 rounded-xl border border-[#E5E9F0] text-[13px] font-black text-[#1E273F] hover:bg-gray-100 transition-all"
                title={sortDesc ? "Sorted: Highest first" : "Sorted: Lowest first"}
              >
                <ArrowUpDown size={16} /> {sortDesc ? "Highest" : "Lowest"}
              </button>
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-6 text-[11px] font-black text-[#8793AC] uppercase tracking-widest pl-10">Student Name</th>
                <th className="p-6 text-[11px] font-black text-[#8793AC] uppercase tracking-widest text-center">Status</th>
                <th className="p-6 text-[11px] font-black text-[#8793AC] uppercase tracking-widest text-center">Avg. Score</th>
                <th className="p-6 text-[11px] font-black text-[#8793AC] uppercase tracking-widest">Subject Progress</th>
                <th className="p-6 text-[11px] font-black text-[#8793AC] uppercase tracking-widest text-center">Badges</th>
                <th className="p-6 text-[11px] font-black text-[#8793AC] uppercase tracking-widest text-right pr-10 no-print">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F7FB]">
              {loading ? (
                <tr><td colSpan={6} className="p-10 text-center text-[#8793AC] font-bold">Loading report data...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={6} className="p-10 text-center text-[#8793AC] font-bold">
                  {tableSearch ? `No students matching "${tableSearch}".` : "No student data yet."}
                </td></tr>
              ) : filteredStudents.map((student: any, idx: number) => {
                const sl = scoreLabel(student.quizAvg);
                return (
                  <tr key={idx} className="hover:bg-[#F8FAFD] transition-colors">
                    <td className="p-6 pl-10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#1E2B5A] flex items-center justify-center text-white text-[14px] font-black">
                          {student.fullName.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-[15px] font-black text-[#1E273F]">{student.fullName}</p>
                          <p className="text-[12px] font-bold text-[#8793AC] mt-0.5">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${sl.bg} ${sl.text}`}>
                          {sl.label}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <p className="text-[15px] font-black text-[#1E273F]">{student.quizAvg}%</p>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${sl.bg} ${sl.text}`}>
                        {sl.label}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="space-y-1.5">
                        {[
                          { label: "Math", val: student.math,    bar: "bg-[#33478D]" },
                          { label: "Sci",  val: student.science, bar: "bg-[#5AAF7B]" },
                          { label: "Eng",  val: student.english, bar: "bg-[#E58814]" },
                        ].map(({ label, val, bar }) => (
                          <div key={label} className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-[#8793AC] w-7 shrink-0">{label}</span>
                            <div className="flex-1 h-1.5 bg-[#F0F2F5] rounded-full overflow-hidden">
                              <div className={`h-full ${bar}`} style={{ width: `${val}%` }} />
                            </div>
                            <span className="text-[10px] font-black text-[#8793AC] w-7 text-right">{val}%</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-6 text-center text-[14px] font-bold text-[#1E273F]">
                      {student.badges}
                    </td>
                    <td className="p-6 text-right pr-10 no-print">
                      <button
                        onClick={() => {
                          const detail = `${student.fullName}\nMaths: ${student.math}%  Science: ${student.science}%  English: ${student.english}%\nAvg: ${student.quizAvg}%  Badges: ${student.badges}`;
                          navigator.clipboard?.writeText(detail).then(() => showToast(`${student.fullName}'s report copied!`));
                        }}
                        className="p-2 text-[#8793AC] hover:bg-[#F5F7FB] hover:text-[#33478D] rounded-lg transition-all"
                        title="Copy student report"
                      >
                        <FileText size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="p-8 bg-gray-50/50 flex items-center justify-between border-t border-[#E5E9F0]">
            <span className="text-[13px] font-black text-[#8793AC] uppercase tracking-widest">
              Showing {filteredStudents.length} of {students.length} students
            </span>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#EDF0F7] rounded-[32px] p-10 flex items-center justify-between border border-[#D5DCEB] no-print">
          <div>
            <h3 className="text-[20px] font-black text-[#1E2B5A]">Need a detailed printed copy?</h3>
            <p className="text-[#5E6D8F] font-bold mt-2">
              Generate a comprehensive summary of all quiz results, lesson completions, and student progress.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCSVDownload}
              className="flex items-center gap-3 bg-white border border-[#D5DCEB] text-[#33478D] px-8 py-4 rounded-2xl font-black text-[15px] hover:bg-gray-50 transition-all shadow-sm"
            >
              <Download size={20} strokeWidth={2.5} /> Detailed CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-3 bg-[#1E2B5A] text-white px-8 py-4 rounded-2xl font-black text-[15px] shadow-lg shadow-blue-900/20 hover:bg-[#151F41] transition-all"
            >
              <FileText size={20} strokeWidth={2.5} /> Print Summary
            </button>
          </div>
        </div>
      </main>

      <TeacherFooter />
    </div>
  );
}
