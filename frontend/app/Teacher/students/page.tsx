"use client";

import React, { useState, useEffect } from "react";
import TeacherNavbar from "@/components/Teacher/TeacherNavbar";
import TeacherFooter from "@/components/Teacher/TeacherFooter";
import { Search, X, Trash2 } from "lucide-react";

const API = "http://localhost:5001";

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2)  return "Active now";
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function ProgressBar({ value, color = "bg-[#33478D]" }: { value: number; color?: string }) {
  return (
    <div className="w-full h-[6px] bg-[#F0F2F5] rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-700`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

export default function StudentManagementPage() {
  const [activeTab, setActiveTab] = useState("All Students");
  const [search, setSearch]       = useState("");
  const [students, setStudents]   = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [detail, setDetail]       = useState<any>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [toast, setToast]         = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchStudents = () => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/teacher/students`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { setStudents(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(fetchStudents, []);

  const filtered = students.filter((s) => {
    const matchesTab =
      activeTab === "All Students" ||
      (activeTab === "Struggling" && s.status === "struggling") ||
      (activeTab === "Excelling"  && s.status === "excelling");
    const q = search.toLowerCase();
    const matchesSearch =
      s.fullName.toLowerCase().includes(q) ||
      (s.email || "").toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const handleRemoveFromClass = async (studentId: string, classId: string, className: string) => {
    setRemovingId(`${classId}-${studentId}`);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/teacher/classes/${classId}/students/${studentId}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        // Update detail panel and student list
        setDetail((prev: any) => prev
          ? { ...prev, classes: prev.classes.filter((c: any) => c._id !== classId) }
          : prev
        );
        setStudents((prev) => prev.map((s) =>
          s._id === studentId
            ? { ...s, classes: s.classes.filter((c: any) => c._id !== classId) }
            : s
        ));
        showToast(`Removed from ${className}`);
      } else {
        showToast("Failed to remove student.");
      }
    } catch { showToast("Network error."); }
    finally { setRemovingId(null); }
  };

  const statusColor = (status: string) =>
    status === "excelling" ? "bg-[#5AAF7B]" : status === "struggling" ? "bg-[#E85A4F]" : "bg-[#33478D]";

  const badgeColor = (status: string) =>
    status === "excelling"
      ? "bg-[#F3FAF7] text-[#03543F]"
      : status === "struggling"
      ? "bg-[#FFF1F1] text-[#C81E1E]"
      : "bg-[#F0F2FA] text-[#33478D]";

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col font-sans">
      <TeacherNavbar />

      {toast && (
        <div className="fixed top-4 right-4 z-[100] bg-[#1E2B5A] text-white px-6 py-3 rounded-xl shadow-xl font-bold text-[14px]">
          {toast}
        </div>
      )}

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-8 md:p-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-[36px] font-black text-[#1E273F] tracking-tight">Student Management</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[#8793AC] font-bold">Total:</span>
              <span className="text-[14px] font-black text-[#33478D]">{students.length} Students</span>
            </div>
          </div>
        </div>

        {/* Tabs + Search */}
        <div className="flex items-center justify-between mb-8 bg-white p-2 rounded-[20px] border border-[#E5E9F0] shadow-sm">
          <div className="flex items-center gap-2">
            {["All Students", "Struggling", "Excelling"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-[14px] font-black transition-all ${
                  activeTab === tab ? "bg-[#F5F7FB] text-[#33478D] shadow-inner" : "text-[#8793AC] hover:text-[#1E273F]"
                }`}
              >
                {tab}
                {tab !== "All Students" && (
                  <span className="ml-2 text-[11px] bg-[#E5E9F0] px-2 py-0.5 rounded-full">
                    {tab === "Struggling"
                      ? students.filter((s) => s.status === "struggling").length
                      : students.filter((s) => s.status === "excelling").length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 bg-[#F5F7FB] px-5 py-3 rounded-xl w-80 mr-2">
            <Search size={18} className="text-[#A0A9C0]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="bg-transparent text-[14px] font-bold text-[#1E273F] focus:outline-none placeholder-[#A0A9C0] w-full"
            />
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-[28px] border border-[#E5E9F0] overflow-hidden shadow-[0_4px_24px_rgba(30,39,63,0.03)]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E5E9F0] bg-gray-50/50">
                <th className="p-6 text-[12px] font-black text-[#8793AC] uppercase tracking-widest pl-10">Student Name</th>
                <th className="p-6 text-[12px] font-black text-[#8793AC] uppercase tracking-widest text-center">Status</th>
                <th className="p-6 text-[12px] font-black text-[#8793AC] uppercase tracking-widest">Last Active</th>
                <th className="p-6 text-[12px] font-black text-[#8793AC] uppercase tracking-widest">Progress</th>
                <th className="p-6 text-[12px] font-black text-[#8793AC] uppercase tracking-widest text-center">Quiz Avg</th>
                <th className="p-6 text-[12px] font-black text-[#8793AC] uppercase tracking-widest text-right pr-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F7FB]">
              {loading ? (
                <tr><td colSpan={6} className="p-10 text-center text-[#8793AC] font-bold">Loading students...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-10 text-center text-[#8793AC] font-bold">
                  {search ? `No students matching "${search}".` : `No ${activeTab.toLowerCase()} students found.`}
                </td></tr>
              ) : filtered.map((student: any) => (
                <tr
                  key={student._id}
                  className="group hover:bg-[#F8FAFD] transition-colors cursor-pointer"
                  onClick={() => setDetail(student)}
                >
                  <td className="p-6 pl-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-[15px] font-black shadow-sm group-hover:scale-105 transition-transform ${statusColor(student.status)}`}>
                        {student.fullName.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-[16px] font-black text-[#1E273F]">{student.fullName}</p>
                        <p className="text-[13px] font-bold text-[#8793AC] mt-0.5">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[13px] font-black capitalize ${badgeColor(student.status)}`}>
                        {student.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 text-[14px] font-bold text-[#5E6D8F]">{timeAgo(student.lastActive)}</td>
                  <td className="p-6">
                    <div className="flex flex-col gap-2">
                      <ProgressBar
                        value={student.progress.avg}
                        color={student.progress.avg > 80 ? "bg-[#5AAF7B]" : student.progress.avg < 50 ? "bg-[#E85A4F]" : "bg-[#33478D]"}
                      />
                      <span className="text-[11px] font-black text-[#8793AC]">{student.progress.avg}%</span>
                    </div>
                  </td>
                  <td className="p-6 text-center text-[16px] font-black text-[#1E273F]">{student.progress.avg}%</td>
                  <td className="p-6 text-right pr-10">
                    <button
                      onClick={(e) => { e.stopPropagation(); setDetail(student); }}
                      className="text-[13px] font-black text-[#33478D] hover:underline uppercase tracking-wider"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-8 bg-gray-50/50 flex items-center justify-between border-t border-[#E5E9F0]">
            <span className="text-[13px] font-black text-[#8793AC] uppercase tracking-widest">
              Showing {filtered.length} of {students.length} students
            </span>
          </div>
        </div>
      </main>

      <TeacherFooter />

      {/* ── Student Detail Modal ── */}
      {detail && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[540px] max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-[#E5E9F0]">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-[18px] font-black ${statusColor(detail.status)}`}>
                  {detail.fullName.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div>
                  <h2 className="text-[20px] font-black text-[#1E273F]">{detail.fullName}</h2>
                  <p className="text-[13px] font-bold text-[#8793AC]">{detail.email}</p>
                </div>
              </div>
              <button onClick={() => setDetail(null)} className="p-2 hover:bg-gray-100 rounded-xl transition">
                <X size={20} className="text-[#8793AC]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Quiz Average",    value: `${detail.progress.avg}%` },
                  { label: "XP Points",       value: (detail.xp || 0).toLocaleString() },
                  { label: "Badges Earned",   value: detail.badges ?? 0 },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#F8FAFD] rounded-[16px] p-4 text-center border border-[#E5E9F0]">
                    <p className="text-[24px] font-black text-[#1E273F]">{value}</p>
                    <p className="text-[11px] font-black text-[#8793AC] uppercase tracking-wider mt-1">{label}</p>
                  </div>
                ))}
              </div>

              {/* Subject progress */}
              <div className="bg-[#F8FAFD] rounded-[16px] p-6 border border-[#E5E9F0]">
                <h3 className="text-[14px] font-black text-[#1E273F] mb-4 uppercase tracking-wider">Subject Progress</h3>
                <div className="space-y-4">
                  {[
                    { label: "Mathematics", value: detail.progress.math,    color: "bg-[#33478D]" },
                    { label: "Science",     value: detail.progress.science, color: "bg-[#5AAF7B]" },
                    { label: "English",     value: detail.progress.english, color: "bg-[#E58814]" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[13px] font-black text-[#5E6D8F]">{label}</span>
                        <span className="text-[13px] font-black text-[#1E273F]">{value}%</span>
                      </div>
                      <ProgressBar value={value} color={color} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F8FAFD] rounded-[16px] p-4 border border-[#E5E9F0]">
                  <p className="text-[11px] font-black text-[#8793AC] uppercase tracking-wider mb-1">Last Active</p>
                  <p className="text-[15px] font-black text-[#1E273F]">{timeAgo(detail.lastActive)}</p>
                </div>
                <div className="bg-[#F8FAFD] rounded-[16px] p-4 border border-[#E5E9F0]">
                  <p className="text-[11px] font-black text-[#8793AC] uppercase tracking-wider mb-1">Streak</p>
                  <p className="text-[15px] font-black text-[#1E273F]">{detail.streak ?? 0} days 🔥</p>
                </div>
              </div>

              {/* Class memberships */}
              {detail.classes && detail.classes.length > 0 && (
                <div>
                  <h3 className="text-[14px] font-black text-[#1E273F] mb-3 uppercase tracking-wider">Enrolled Classes</h3>
                  <div className="space-y-2">
                    {detail.classes.map((cls: any) => (
                      <div key={cls._id} className="flex items-center justify-between p-3 bg-[#F8FAFD] rounded-xl border border-[#E5E9F0]">
                        <span className="text-[14px] font-black text-[#1E273F]">{cls.name}</span>
                        <button
                          onClick={() => handleRemoveFromClass(detail._id, cls._id, cls.name)}
                          disabled={removingId === `${cls._id}-${detail._id}`}
                          className="flex items-center gap-1.5 text-[12px] font-black text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status badge */}
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-[13px] font-black capitalize ${badgeColor(detail.status)}`}>
                  {detail.status}
                </span>
                <span className="text-[13px] font-bold text-[#8793AC]">
                  {detail.status === "struggling"
                    ? "Quiz average < 60% — consider a review session."
                    : detail.status === "excelling"
                    ? "Quiz average ≥ 80% — performing well!"
                    : "On track — quiz average 60–79%."}
                </span>
              </div>
            </div>

            <div className="p-6 border-t border-[#E5E9F0] bg-[#F8FAFD] rounded-b-[28px]">
              <button
                onClick={() => setDetail(null)}
                className="w-full py-3 rounded-xl bg-[#33478D] text-white text-[14px] font-black hover:bg-[#2A3B7A] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
