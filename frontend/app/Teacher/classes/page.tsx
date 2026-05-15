"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import TeacherNavbar from "@/components/Teacher/TeacherNavbar";
import TeacherFooter from "@/components/Teacher/TeacherFooter";
import { Plus, Users, LayoutGrid, ChevronDown, X, Edit2, Archive, UserPlus, Trash2, RotateCcw, TrendingUp, Search } from "lucide-react";

const API = "http://localhost:5001";
const SUBJECTS = ["Mathematics", "Science", "English"];
const GRADES   = Array.from({ length: 10 }, (_, i) => `Grade ${i + 1}`);
const SESSIONS = ["Morning Session", "Afternoon Session", "Full Day", "Elective"];

function timeAgo(date: string) {
  if (!date) return "Never";
  const diff = Date.now() - new Date(date).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function scoreLabel(avg: number): { label: string; bg: string; text: string } {
  if (avg >= 90) return { label: "Excellent",            bg: "bg-[#ECFDF5]", text: "text-[#065F46]" };
  if (avg >= 75) return { label: "Very Good",            bg: "bg-[#F0FDF4]", text: "text-[#166534]" };
  if (avg >= 60) return { label: "Good Performance",     bg: "bg-[#EFF6FF]", text: "text-[#1E40AF]" };
  if (avg >= 50) return { label: "Moderate Performance", bg: "bg-[#FEFCE8]", text: "text-[#92400E]" };
  if (avg >= 40) return { label: "Below Average",        bg: "bg-[#FFF7ED]", text: "text-[#C2410C]" };
  return           { label: "Needs Support",             bg: "bg-[#FFF1F1]", text: "text-[#C81E1E]" };
}

export default function TeacherClassesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All Classes");
  const [classes, setClasses]     = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);

  // Create class dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "Mathematics", gradeLevel: "Grade 1", session: "Morning Session" });
  const [saving, setSaving] = useState(false);

  // Edit class dialog
  const [editClass, setEditClass]   = useState<any>(null);
  const [editForm, setEditForm]     = useState({ name: "", subject: "Mathematics", gradeLevel: "Grade 1", session: "Morning Session" });
  const [editSaving, setEditSaving] = useState(false);

  // Archive confirm
  const [archiveClass, setArchiveClass] = useState<any>(null);
  const [archiving, setArchiving]       = useState(false);

  // Assign students dialog
  const [assignClass, setAssignClass]     = useState<any>(null);
  const [assignSearch, setAssignSearch]   = useState("");
  const [assignResults, setAssignResults] = useState<any[]>([]);
  const [assignMsg, setAssignMsg]         = useState("");
  const [assignSaving, setAssignSaving]   = useState(false);
  const [assignSearching, setAssignSearching] = useState(false);

  // Roster modal
  const [rosterClass, setRosterClass]       = useState<any>(null);
  const [rosterStudents, setRosterStudents] = useState<any[]>([]);
  const [rosterLoading, setRosterLoading]   = useState(false);
  const [removingId, setRemovingId]         = useState<string | null>(null);

  // Popular lessons
  const [popularLessons, setPopularLessons] = useState<any[]>([]);

  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchClasses = () => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/teacher/classes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { setClasses(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const fetchPopularLessons = () => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/teacher/popular-lessons`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setPopularLessons(Array.isArray(d) ? d : []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchClasses();
    fetchPopularLessons();
  }, []);

  // Search students for Assign dialog (debounced)
  useEffect(() => {
    if (!assignClass) return;
    const timer = setTimeout(async () => {
      setAssignSearching(true);
      try {
        const token = localStorage.getItem("token");
        const url = `${API}/api/teacher/students/search-all?q=${encodeURIComponent(assignSearch)}&classId=${assignClass._id}`;
        const res  = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setAssignResults(Array.isArray(data) ? data : []);
      } catch { setAssignResults([]); }
      finally { setAssignSearching(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [assignSearch, assignClass]);

  const filtered = classes.filter((c) => {
    if (activeTab.startsWith("All Classes")) return true;
    if (activeTab === "Active")   return !c.isArchived;
    if (activeTab === "Archived") return c.isArchived;
    return true;
  });

  const totalStudents = classes.reduce((a, c) => a + (c.studentCount || 0), 0);
  const avgProgress   = classes.length > 0
    ? Math.round(classes.reduce((a, c) => a + (c.progress || 0), 0) / classes.length)
    : 0;

  /* ── Create class ── */
  const handleCreateClass = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/teacher/classes`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify(form),
      });
      if (res.ok) {
        const created = await res.json();
        setClasses((prev) => [created, ...prev]);
        setCreateOpen(false);
        setForm({ name: "", subject: "Mathematics", gradeLevel: "Grade 1", session: "Morning Session" });
        showToast("Class created successfully!");
      } else {
        showToast("Failed to create class.");
      }
    } catch { showToast("Network error."); }
    finally { setSaving(false); }
  };

  /* ── Edit class ── */
  const openEdit = (cls: any) => {
    setEditClass(cls);
    setEditForm({ name: cls.name, subject: cls.subject, gradeLevel: cls.gradeLevel, session: cls.session });
  };

  const handleEditClass = async () => {
    if (!editClass || !editForm.name.trim()) return;
    setEditSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/teacher/classes/${editClass._id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify(editForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setClasses((prev) => prev.map((c) => (c._id === updated._id ? { ...c, ...updated } : c)));
        setEditClass(null);
        showToast("Class updated!");
      } else { showToast("Failed to update class."); }
    } catch { showToast("Network error."); }
    finally { setEditSaving(false); }
  };

  /* ── Archive class ── */
  const handleArchive = async () => {
    if (!archiveClass) return;
    setArchiving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/teacher/classes/${archiveClass._id}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setClasses((prev) => prev.map((c) => c._id === archiveClass._id ? { ...c, isArchived: true } : c));
        setArchiveClass(null);
        showToast("Class archived.");
      } else { showToast("Failed to archive class."); }
    } catch { showToast("Network error."); }
    finally { setArchiving(false); }
  };

  /* ── Unarchive class ── */
  const handleUnarchive = async (cls: any) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/teacher/classes/${cls._id}/unarchive`, {
        method:  "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setClasses((prev) => prev.map((c) => c._id === cls._id ? { ...c, isArchived: false } : c));
        showToast("Class restored to active.");
      } else { showToast("Failed to restore class."); }
    } catch { showToast("Network error."); }
  };

  /* ── Assign student ── */
  const handleAssignStudent = async (student: any) => {
    if (!assignClass) return;
    setAssignSaving(true);
    setAssignMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/teacher/classes/${assignClass._id}/students`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ studentEmail: student.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setAssignMsg(`✓ ${data.student.fullName} added to class.`);
        setAssignResults((prev) => prev.filter((s) => s._id !== student._id));
        setClasses((prev) => prev.map((c) =>
          c._id === assignClass._id ? { ...c, studentCount: (c.studentCount || 0) + 1 } : c
        ));
      } else {
        setAssignMsg(`✗ ${data.error}`);
      }
    } catch { setAssignMsg("✗ Network error."); }
    finally { setAssignSaving(false); }
  };

  /* ── View roster ── */
  const handleViewRoster = async (cls: any) => {
    setRosterClass(cls);
    setRosterStudents([]);
    setRosterLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/teacher/classes/${cls._id}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRosterStudents(Array.isArray(data) ? data : []);
    } catch { setRosterStudents([]); }
    finally { setRosterLoading(false); }
  };

  /* ── Remove student from roster ── */
  const handleRemoveStudent = async (studentId: string) => {
    if (!rosterClass) return;
    setRemovingId(studentId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/teacher/classes/${rosterClass._id}/students/${studentId}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setRosterStudents((prev) => prev.filter((s) => s._id !== studentId));
        setClasses((prev) => prev.map((c) =>
          c._id === rosterClass._id ? { ...c, studentCount: Math.max(0, (c.studentCount || 1) - 1) } : c
        ));
      } else { showToast("Failed to remove student."); }
    } catch { showToast("Network error."); }
    finally { setRemovingId(null); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col font-sans">
      <TeacherNavbar />

      {toast && (
        <div className="fixed top-4 right-4 z-[100] bg-[#1E2B5A] text-white px-6 py-3 rounded-xl shadow-xl font-bold text-[14px]">
          {toast}
        </div>
      )}

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-8 md:p-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] font-bold text-[#8793AC] mb-6">
          <span>Dashboard</span>
          <span className="text-[#A0A9C0]">{">"}</span>
          <span className="text-[#33478D]">Classes</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-[36px] font-black text-[#1E273F] tracking-tight">My Classes</h1>
            <p className="text-[#8793AC] font-semibold mt-1">Manage your active teaching sections and monitor student progress.</p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="bg-[#33478D] text-white px-8 py-3.5 rounded-xl font-black text-[15px] flex items-center gap-3 shadow-lg shadow-blue-900/10 hover:bg-[#2A3B7A] hover:-translate-y-0.5 transition-all"
          >
            <Plus size={20} strokeWidth={3} />
            Add New Class
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-8 border-b border-[#E5E9F0]">
          <div className="flex items-center gap-10">
            {[`All Classes (${classes.length})`, "Active", "Archived"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[15px] font-black transition-all relative ${
                  activeTab === tab || (tab.startsWith("All Classes") && activeTab.startsWith("All Classes"))
                    ? "text-[#33478D]"
                    : "text-[#8793AC] hover:text-[#1E273F]"
                }`}
              >
                {tab}
                {(activeTab === tab || (tab.startsWith("All Classes") && activeTab.startsWith("All Classes"))) && (
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#33478D] rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[12px] font-black uppercase tracking-wider text-[#8793AC] pb-4">
            SORT BY:
            <button className="flex items-center gap-1 text-[#1E273F]">
              Recently Accessed <ChevronDown size={14} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Archive tab description */}
        {activeTab === "Archived" && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6 flex items-center gap-4">
            <Archive size={20} className="text-orange-500 shrink-0" />
            <div>
              <p className="text-[14px] font-black text-orange-800">Archived Classes</p>
              <p className="text-[13px] font-bold text-orange-600 mt-0.5">
                These classes are hidden from the active view. Students are not removed. Click <strong>Restore</strong> to make a class active again.
              </p>
            </div>
          </div>
        )}

        {/* Class Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {loading ? (
            <div className="col-span-4 p-10 text-center text-[#8793AC] font-bold">Loading classes...</div>
          ) : filtered.length === 0 && activeTab === "Archived" ? (
            <div className="col-span-4 p-10 text-center">
              <Archive size={40} className="text-[#D5DCEB] mx-auto mb-4" />
              <p className="text-[#8793AC] font-bold">No archived classes yet.</p>
              <p className="text-[13px] text-[#A0A9C0] font-medium mt-1">Classes you archive will appear here.</p>
            </div>
          ) : filtered.length === 0 && activeTab === "Active" ? (
            <div className="col-span-4 p-10 text-center text-[#8793AC] font-bold">
              No active classes. Create one above.
            </div>
          ) : filtered.map((cls: any) => (
            <div key={cls._id} className={`bg-white rounded-[24px] border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group ${cls.isArchived ? "border-orange-200 opacity-80" : "border-[#E5E9F0]"}`}>
              <div className="h-[180px] relative overflow-hidden">
                {cls.image ? (
                  <img
                    src={cls.image}
                    alt={cls.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/book.png"; }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#1E2B5A] flex items-center justify-center text-white/30 text-[48px] font-black">
                    {cls.subject?.[0]}
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#33478D]">
                    {cls.isArchived ? "Archived" : cls.session}
                  </span>
                </div>
                {/* Action icons — edit/archive for active, restore for archived */}
                <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  {!cls.isArchived ? (
                    <>
                      <button onClick={() => openEdit(cls)} title="Edit class"
                        className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#33478D] shadow-md hover:bg-[#33478D] hover:text-white transition-all">
                        <Edit2 size={14} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => setArchiveClass(cls)} title="Archive class"
                        className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-orange-500 shadow-md hover:bg-orange-500 hover:text-white transition-all">
                        <Archive size={14} strokeWidth={2.5} />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleUnarchive(cls)} title="Restore class"
                      className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-green-600 shadow-md hover:bg-green-600 hover:text-white transition-all">
                      <RotateCcw size={14} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-[20px] font-black text-[#1E273F] mb-1 group-hover:text-[#33478D] transition-colors">{cls.name}</h3>
                <p className="text-[12px] font-bold text-[#8793AC] mb-4">{cls.gradeLevel} · {cls.subject}</p>

                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-[#5E6D8F] font-bold text-[14px]">
                    <Users size={16} strokeWidth={2.5} />
                    {cls.studentCount} Enrolled
                  </div>
                  <div className="text-[#33478D] font-black text-[13px]">
                    {cls.participantCount ?? 0} Participating
                  </div>
                </div>

                <div className="h-2 w-full bg-[#F0F2F5] rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-[#33478D] transition-all duration-700" style={{ width: `${cls.progress}%` }}></div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewRoster(cls)}
                      className="flex-1 py-2.5 bg-[#F5F7FB] text-[#33478D] rounded-xl font-black text-[13px] flex items-center justify-center gap-1.5 hover:bg-[#EAEFF7] transition-all"
                    >
                      <LayoutGrid size={14} strokeWidth={2.5} />
                      Roster
                    </button>
                    {!cls.isArchived && (
                      <button
                        onClick={() => { setAssignClass(cls); setAssignSearch(""); setAssignMsg(""); setAssignResults([]); }}
                        className="flex-1 py-2.5 bg-[#F5F7FB] text-[#5E6D8F] rounded-xl font-black text-[13px] flex items-center justify-center gap-1.5 hover:bg-[#EAEFF7] hover:text-[#33478D] transition-all"
                      >
                        <UserPlus size={14} strokeWidth={2.5} />
                        Assign
                      </button>
                    )}
                    {cls.isArchived && (
                      <button
                        onClick={() => handleUnarchive(cls)}
                        className="flex-1 py-2.5 bg-green-50 text-green-700 rounded-xl font-black text-[13px] flex items-center justify-center gap-1.5 hover:bg-green-100 transition-all"
                      >
                        <RotateCcw size={14} strokeWidth={2.5} />
                        Restore
                      </button>
                    )}
                  </div>
                  {!cls.isArchived && (
                    <button
                      onClick={() => router.push("/Teacher/dashboard")}
                      className="w-full py-2 text-[#8793AC] hover:text-[#33478D] font-bold text-[13px] transition-colors"
                    >
                      Open Class Dashboard
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Create New Class placeholder — only show in non-archived tabs */}
          {activeTab !== "Archived" && (
            <div
              onClick={() => setCreateOpen(true)}
              className="border-2 border-dashed border-[#D5DCEB] rounded-[24px] p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#33478D] transition-all bg-white/50"
            >
              <div className="w-14 h-14 bg-[#F5F7FB] rounded-full flex items-center justify-center text-[#8793AC] group-hover:bg-[#33478D] group-hover:text-white transition-all mb-4">
                <Plus size={28} strokeWidth={3} />
              </div>
              <h3 className="text-[18px] font-black text-[#1E273F]">Create New Class</h3>
              <p className="text-[#8793AC] text-[13px] font-medium mt-2 max-w-[180px]">Set up a new section, add students, and assign curriculum.</p>
            </div>
          )}
        </div>

        {/* Popular Lessons — shown in Active tab */}
        {(activeTab === "Active" || activeTab.startsWith("All Classes")) && popularLessons.length > 0 && (
          <div className="bg-white rounded-[24px] border border-[#E5E9F0] shadow-sm p-8 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={20} className="text-[#33478D]" />
              <h3 className="text-[18px] font-black text-[#1E273F]">Most Popular Lessons</h3>
              <span className="text-[11px] font-black text-[#8793AC] bg-[#F5F7FB] px-2 py-0.5 rounded-md uppercase tracking-wider">By Participation</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {popularLessons.map((lesson: any, i: number) => (
                <div key={lesson.slug} className="bg-[#F8FAFD] rounded-[16px] p-4 border border-[#E5E9F0]">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[11px] font-black text-[#33478D] bg-[#F0F3FF] px-2 py-0.5 rounded-md">{lesson.subject}</span>
                    <span className="text-[22px] font-black text-[#D5DCEB]">#{i + 1}</span>
                  </div>
                  <p className="text-[14px] font-black text-[#1E273F] leading-tight mb-3">{lesson.title}</p>
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#8793AC]">
                    <span>{lesson.participants} students</span>
                    <span>{lesson.avgProgress}% avg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="bg-[#1F3F7F] border border-[#142952] rounded-[24px] p-8 shadow-xl shadow-blue-900/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: classes.length,                           label: "Total Classes" },
              { value: totalStudents,                            label: "Total Students" },
              { value: `${avgProgress}%`,                        label: "Overall Progress" },
              { value: classes.filter(c => !c.isArchived).length, label: "Active Classes" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center border-r border-white/10 last:border-0 text-center">
                <span className="text-[32px] font-black text-white">{value}</span>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60 mt-1">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <TeacherFooter />

      {/* ── Create Class Dialog ── */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[480px] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E273F]">Create New Class</h2>
              <button onClick={() => setCreateOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Class Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Grade 3 Mathematics"
                  className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Subject *</label>
                  <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] bg-white">
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Grade Level *</label>
                  <select value={form.gradeLevel} onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}
                    className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] bg-white">
                    {GRADES.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Session</label>
                <select value={form.session} onChange={(e) => setForm({ ...form, session: e.target.value })}
                  className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] bg-white">
                  {SESSIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setCreateOpen(false)} className="flex-1 py-3 rounded-xl border border-[#E5E9F0] text-[14px] font-black text-[#8793AC] hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleCreateClass} disabled={saving || !form.name.trim()}
                className="flex-1 py-3 rounded-xl bg-[#33478D] text-white text-[14px] font-black hover:bg-[#2A3B7A] transition disabled:opacity-50">
                {saving ? "Creating…" : "Create Class"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Class Dialog ── */}
      {editClass && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[480px] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E273F]">Edit Class</h2>
              <button onClick={() => setEditClass(null)} className="p-2 hover:bg-gray-100 rounded-xl transition"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Class Name *</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Subject *</label>
                  <select value={editForm.subject} onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                    className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] bg-white">
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Grade Level *</label>
                  <select value={editForm.gradeLevel} onChange={(e) => setEditForm({ ...editForm, gradeLevel: e.target.value })}
                    className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] bg-white">
                    {GRADES.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Session</label>
                <select value={editForm.session} onChange={(e) => setEditForm({ ...editForm, session: e.target.value })}
                  className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] bg-white">
                  {SESSIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setEditClass(null)} className="flex-1 py-3 rounded-xl border border-[#E5E9F0] text-[14px] font-black text-[#8793AC] hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleEditClass} disabled={editSaving || !editForm.name.trim()}
                className="flex-1 py-3 rounded-xl bg-[#33478D] text-white text-[14px] font-black hover:bg-[#2A3B7A] transition disabled:opacity-50">
                {editSaving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Archive Confirm ── */}
      {archiveClass && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[400px] p-8 text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Archive size={28} className="text-orange-500" />
            </div>
            <h2 className="text-[20px] font-black text-[#1E273F] mb-2">Archive Class?</h2>
            <p className="text-[14px] font-bold text-[#8793AC] mb-8">
              <span className="text-[#1E273F]">{archiveClass.name}</span> will be moved to the Archived tab. Students remain in the class and can be restored anytime.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setArchiveClass(null)} className="flex-1 py-3 rounded-xl border border-[#E5E9F0] text-[14px] font-black text-[#8793AC] hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleArchive} disabled={archiving}
                className="flex-1 py-3 rounded-xl bg-orange-500 text-white text-[14px] font-black hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2">
                <Trash2 size={16} /> {archiving ? "Archiving…" : "Archive"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Assign Student Dialog ── */}
      {assignClass && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[480px] p-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[20px] font-black text-[#1E273F]">Assign Student</h2>
              <button onClick={() => setAssignClass(null)} className="p-2 hover:bg-gray-100 rounded-xl transition"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <p className="text-[13px] font-bold text-[#8793AC] mb-5">
              Add students to <span className="text-[#33478D]">{assignClass.name}</span>. Only students not already enrolled are shown.
            </p>

            {/* Search */}
            <div className="flex items-center gap-3 bg-[#F8FAFD] px-4 py-3 rounded-xl border border-[#E5E9F0] mb-4 focus-within:border-[#33478D] transition-all">
              <Search size={16} className="text-[#A0A9C0]" />
              <input
                type="text"
                value={assignSearch}
                onChange={(e) => setAssignSearch(e.target.value)}
                placeholder="Search student name or email…"
                className="bg-transparent text-[14px] font-bold text-[#1E273F] focus:outline-none placeholder-[#A0A9C0] w-full"
              />
            </div>

            {/* Student List */}
            <div className="space-y-2 max-h-[280px] overflow-y-auto">
              {assignSearching ? (
                <div className="text-center py-6 text-[#8793AC] font-bold text-[13px]">Searching…</div>
              ) : assignResults.length === 0 ? (
                <div className="text-center py-6 text-[#8793AC] font-bold text-[13px]">
                  {assignSearch ? "No matching students found." : "Type to search for students."}
                </div>
              ) : assignResults.map((student: any) => (
                <div key={student._id} className="flex items-center justify-between p-3 bg-[#F8FAFD] rounded-xl border border-[#E5E9F0] hover:border-[#33478D] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#33478D] flex items-center justify-center text-white text-[12px] font-black">
                      {student.fullName.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-[13px] font-black text-[#1E273F]">{student.fullName}</p>
                      <p className="text-[11px] font-bold text-[#8793AC]">{student.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAssignStudent(student)}
                    disabled={assignSaving}
                    className="px-3 py-1.5 bg-[#33478D] text-white rounded-lg text-[12px] font-black hover:bg-[#2A3B7A] transition disabled:opacity-50 flex items-center gap-1"
                  >
                    <UserPlus size={12} /> Add
                  </button>
                </div>
              ))}
            </div>

            {assignMsg && (
              <p className={`mt-3 text-[13px] font-bold ${assignMsg.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>{assignMsg}</p>
            )}

            <button onClick={() => setAssignClass(null)} className="w-full mt-5 py-3 rounded-xl border border-[#E5E9F0] text-[14px] font-black text-[#8793AC] hover:bg-gray-50 transition">
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── Roster Modal ── */}
      {rosterClass && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[620px] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-8 border-b border-[#E5E9F0]">
              <div>
                <h2 className="text-[20px] font-black text-[#1E273F]">{rosterClass.name} — Roster</h2>
                <p className="text-[13px] font-bold text-[#8793AC] mt-0.5">
                  {rosterClass.gradeLevel} · {rosterClass.subject} · {rosterClass.session}
                </p>
              </div>
              <button onClick={() => setRosterClass(null)} className="p-2 hover:bg-gray-100 rounded-xl transition"><X size={20} className="text-[#8793AC]" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {rosterLoading ? (
                <div className="text-center py-10 text-[#8793AC] font-bold">Loading students…</div>
              ) : rosterStudents.length === 0 ? (
                <div className="text-center py-10">
                  <Users size={36} className="text-[#D5DCEB] mx-auto mb-3" />
                  <p className="text-[#8793AC] font-bold">No students enrolled yet.</p>
                  <p className="text-[13px] text-[#A0A9C0] mt-1">Use the Assign button to add students.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rosterStudents.map((s: any) => (
                    <div key={s._id} className="flex items-center justify-between p-4 bg-[#F8FAFD] rounded-xl border border-[#E5E9F0]">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-black ${
                          s.status === "excelling" ? "bg-[#5AAF7B]" : s.status === "struggling" ? "bg-[#E85A4F]" : "bg-[#33478D]"
                        }`}>
                          {s.fullName.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-[14px] font-black text-[#1E273F]">{s.fullName}</p>
                          <p className="text-[12px] font-bold text-[#8793AC]">{s.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* Subject progress bars */}
                        <div className="hidden md:flex items-center gap-3 text-[11px] font-bold text-[#8793AC]">
                          {[["Math", s.math], ["Sci", s.science], ["Eng", s.english]].map(([label, val]) => (
                            <div key={label} className="text-center">
                              <div className="w-8 h-8 relative flex items-center justify-center">
                                <svg className="absolute inset-0" viewBox="0 0 32 32">
                                  <circle cx="16" cy="16" r="12" fill="none" stroke="#F0F2F5" strokeWidth="4" />
                                  <circle cx="16" cy="16" r="12" fill="none" stroke="#33478D" strokeWidth="4"
                                    strokeDasharray={`${(Number(val) / 100) * 75.4} 75.4`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 16 16)" />
                                </svg>
                                <span className="text-[8px] font-black text-[#1E273F] relative z-10">{val}%</span>
                              </div>
                              <p className="mt-0.5">{label}</p>
                            </div>
                          ))}
                        </div>
                        {(() => {
                          const sl = scoreLabel(s.progress ?? 0);
                          return (
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black ${sl.bg} ${sl.text}`}>
                              {sl.label}
                            </span>
                          );
                        })()}
                        <button
                          onClick={() => handleRemoveStudent(s._id)}
                          disabled={removingId === s._id}
                          title="Remove from class"
                          className="p-1.5 rounded-lg text-[#8793AC] hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-40"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-[#E5E9F0] bg-[#F8FAFD] rounded-b-[28px]">
              <p className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider text-center">
                {rosterStudents.length} student{rosterStudents.length !== 1 ? "s" : ""} enrolled
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
