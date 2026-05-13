"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { Plus, Search, Edit3, Trash2, X, Save, ExternalLink, BookOpen } from "lucide-react";

const API      = "http://localhost:5001";
const SUBJECTS = ["Mathematics", "Science", "English"];
const GRADES   = Array.from({ length: 10 }, (_, i) => `${i + 1}`);
const LEVELS   = ["Beginner", "Intermediate", "Advanced"];

export default function AdminLessonsPage() {
  const router = useRouter();
  const [admin, setAdmin]     = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [toast, setToast]     = useState("");

  // Edit modal
  const [editLesson, setEditLesson]   = useState<any>(null);
  const [editForm, setEditForm]       = useState({ title: "", subject: "Mathematics", grade: "1", duration: "12 min read", level: "Beginner", description: "" });
  const [editSaving, setEditSaving]   = useState(false);

  // Add modal
  const [addOpen, setAddOpen]     = useState(false);
  const [addForm, setAddForm]     = useState({ title: "", subject: "Mathematics", grade: "1", duration: "12 min read", level: "Beginner", description: "" });
  const [addSaving, setAddSaving] = useState(false);

  // Delete confirm
  const [deleteLesson, setDeleteLesson] = useState<any>(null);
  const [deleting, setDeleting]         = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchLessons = (token: string) => {
    const params = new URLSearchParams();
    if (filterSubject !== "all") params.set("subject", filterSubject);
    if (search.trim()) params.set("search", search.trim());
    fetch(`${API}/api/admin/lessons?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setLessons(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    const raw = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!raw || !token) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    if (u.role !== "admin") { router.push("/login"); return; }
    setAdmin(u);
    fetchLessons(token);
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchLessons(token);
  }, [filterSubject, search]);

  const openEdit = (l: any) => {
    setEditLesson(l);
    setEditForm({
      title:       l.title       || "",
      subject:     l.subject     || "Mathematics",
      grade:       String(l.grade).replace(/^Grade\s+/i, "") || "1",
      duration:    l.duration    || "12 min read",
      level:       l.level       || "Beginner",
      description: l.description || "",
    });
  };

  const handleSave = async () => {
    if (!editLesson || !editForm.title.trim()) return;
    setEditSaving(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/admin/lessons/${editLesson._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      const updated = await res.json();
      setLessons(prev => prev.map(l => l._id === updated._id ? updated : l));
      setEditLesson(null);
      showToast("Lesson updated!");
    } else { showToast("Failed to update lesson."); }
    setEditSaving(false);
  };

  const handleAdd = async () => {
    if (!addForm.title.trim()) return;
    setAddSaving(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/admin/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(addForm),
    });
    if (res.ok) {
      const created = await res.json();
      setLessons(prev => [created, ...prev]);
      setAddOpen(false);
      setAddForm({ title: "", subject: "Mathematics", grade: "1", duration: "12 min read", level: "Beginner", description: "" });
      showToast("Lesson created!");
    } else { showToast("Failed to create lesson."); }
    setAddSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteLesson) return;
    setDeleting(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/admin/lessons/${deleteLesson._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setLessons(prev => prev.filter(l => l._id !== deleteLesson._id));
      setDeleteLesson(null);
      showToast("Lesson deleted.");
    } else { showToast("Failed to delete lesson."); }
    setDeleting(false);
  };

  if (!admin) return null;

  const SUBJECT_COLORS: Record<string, string> = {
    Mathematics: "bg-indigo-100 text-indigo-700",
    Science:     "bg-emerald-100 text-emerald-700",
    English:     "bg-orange-100 text-orange-700",
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AdminNavbar adminName={admin.fullName} />

      {toast && (
        <div className="fixed top-4 right-4 z-[100] bg-[#1E2B5A] text-white px-6 py-3 rounded-xl shadow-xl font-bold text-[14px]">
          {toast}
        </div>
      )}

      <main className="ml-60 flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[32px] font-black text-[#1E2B5A]">Lesson Management</h1>
            <p className="text-[#8793AC] font-bold mt-1">{lessons.length} lessons in the platform</p>
          </div>
          <button onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 bg-[#1E2B5A] text-white px-6 py-3 rounded-xl font-black text-[14px] shadow-lg hover:bg-[#151F41] transition">
            <Plus size={18} /> Add Lesson
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-[#E9EDF5] flex-1 focus-within:border-[#1E2B5A] transition-all">
            <Search size={16} className="text-[#A0A9C0]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search lessons…"
              className="bg-transparent text-[14px] font-bold text-[#1E2B5A] focus:outline-none placeholder-[#A0A9C0] w-full" />
          </div>
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)}
            className="bg-white border border-[#E9EDF5] rounded-xl px-4 py-3 text-[14px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A]">
            <option value="all">All Subjects</option>
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F5F7FB]">
                <th className="text-left px-6 py-4 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-4 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Subject</th>
                <th className="text-left px-4 py-4 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Grade</th>
                <th className="text-left px-4 py-4 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Level</th>
                <th className="text-left px-4 py-4 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Duration</th>
                <th className="text-right px-6 py-4 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-[#F5F7FB]">
                    {[...Array(6)].map((__, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : lessons.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-[#8793AC] font-bold">No lessons found.</td></tr>
              ) : lessons.map(lesson => (
                <tr key={lesson._id} className="border-b border-[#F5F7FB] hover:bg-[#F8FAFD] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <BookOpen size={16} className="text-[#8793AC] shrink-0" />
                      <span className="text-[14px] font-black text-[#1E2B5A]">{lesson.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black ${SUBJECT_COLORS[lesson.subject] || "bg-gray-100 text-gray-600"}`}>
                      {lesson.subject}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[13px] font-bold text-[#5E6D8F]">
                    Grade {String(lesson.grade).replace(/^Grade\s+/i, "")}
                  </td>
                  <td className="px-4 py-4 text-[13px] font-bold text-[#5E6D8F]">{lesson.level || "Beginner"}</td>
                  <td className="px-4 py-4 text-[13px] font-bold text-[#5E6D8F]">{lesson.duration || "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {lesson.slug && (
                        <a href={`/lessons/${lesson.slug}`} target="_blank" rel="noopener"
                          title="Preview lesson"
                          className="p-2 rounded-lg text-[#8793AC] hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <button onClick={() => openEdit(lesson)} title="Edit"
                        className="p-2 rounded-lg text-[#8793AC] hover:bg-blue-50 hover:text-blue-600 transition-all">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => setDeleteLesson(lesson)} title="Delete"
                        className="p-2 rounded-lg text-[#8793AC] hover:bg-red-50 hover:text-red-500 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* ── Edit Lesson Modal ── */}
      {editLesson && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[520px] p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E2B5A]">Edit Lesson</h2>
              <button onClick={() => setEditLesson(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <LessonForm form={editForm} setForm={setEditForm} />
            <div className="flex gap-3 mt-8">
              <button onClick={() => setEditLesson(null)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={editSaving || !editForm.title.trim()}
                className="flex-1 py-3 rounded-xl bg-[#1E2B5A] text-white text-[14px] font-black hover:bg-[#151F41] disabled:opacity-50 flex items-center justify-center gap-2">
                <Save size={16} /> {editSaving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Lesson Modal ── */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[520px] p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E2B5A]">Add New Lesson</h2>
              <button onClick={() => setAddOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <LessonForm form={addForm} setForm={setAddForm} />
            <div className="flex gap-3 mt-8">
              <button onClick={() => setAddOpen(false)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} disabled={addSaving || !addForm.title.trim()}
                className="flex-1 py-3 rounded-xl bg-[#1E2B5A] text-white text-[14px] font-black hover:bg-[#151F41] disabled:opacity-50">
                {addSaving ? "Creating…" : "Create Lesson"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteLesson && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[400px] p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h2 className="text-[20px] font-black text-[#1E2B5A] mb-2">Delete Lesson?</h2>
            <p className="text-[14px] font-bold text-[#8793AC] mb-8">
              "<span className="text-[#1E2B5A]">{deleteLesson.title}</span>" will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteLesson(null)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-[14px] font-black hover:bg-red-600 disabled:opacity-50">
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LessonForm({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const SUBJECTS = ["Mathematics", "Science", "English"];
  const GRADES   = Array.from({ length: 10 }, (_, i) => `${i + 1}`);
  const LEVELS   = ["Beginner", "Intermediate", "Advanced"];
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Title *</label>
        <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
          className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A]" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Subject</label>
          <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
            className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[14px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A] bg-white">
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Grade</label>
          <select value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}
            className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[14px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A] bg-white">
            {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Duration</label>
          <input type="text" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
            placeholder="12 min read"
            className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[14px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A]" />
        </div>
        <div>
          <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Level</label>
          <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}
            className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[14px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A] bg-white">
            {LEVELS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Description</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[14px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A] resize-none" />
      </div>
    </div>
  );
}
