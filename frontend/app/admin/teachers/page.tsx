"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { Search, BookOpen, Users, ChevronDown, ChevronUp, Plus, Edit3, Trash2, X, Save, Eye } from "lucide-react";

const API = "http://localhost:5001";

const SUBJECT_COLORS: Record<string, string> = {
  mathematics: "bg-blue-100 text-blue-700",
  science:     "bg-emerald-100 text-emerald-700",
  english:     "bg-purple-100 text-purple-700",
};

const BLANK_FORM = { fullName: "", email: "", password: "", status: "active" };

export default function AdminTeachers() {
  const router = useRouter();
  const [admin, setAdmin]       = useState<any>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [token, setToken]       = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [toast, setToast]       = useState("");

  const [addOpen, setAddOpen]     = useState(false);
  const [addForm, setAddForm]     = useState({ ...BLANK_FORM });
  const [addSaving, setAddSaving] = useState(false);

  const [editTeacher, setEditTeacher] = useState<any>(null);
  const [editForm, setEditForm]       = useState({ fullName: "", email: "", password: "", status: "active" });
  const [editSaving, setEditSaving]   = useState(false);

  const [viewTeacher, setViewTeacher]     = useState<any>(null);
  const [deleteTeacher, setDeleteTeacher] = useState<any>(null);
  const [deleting, setDeleting]           = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchTeachers = (tok: string, q: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q.trim()) params.set("search", q.trim());
    fetch(`${API}/api/admin/teachers?${params}`, { headers: { Authorization: `Bearer ${tok}` } })
      .then(r => r.json())
      .then(d => { setTeachers(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setTeachers([]); setLoading(false); });
  };

  useEffect(() => {
    const raw = localStorage.getItem("user");
    const tok = localStorage.getItem("token") || "";
    if (!raw || !tok) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    if (u.role !== "admin") { router.push("/login"); return; }
    setAdmin(u);
    setToken(tok);
    fetchTeachers(tok, "");
  }, [router]);

  useEffect(() => { if (token) fetchTeachers(token, search); }, [search]);

  const handleAdd = async () => {
    if (!addForm.fullName.trim() || !addForm.email.trim() || !addForm.password.trim()) return;
    setAddSaving(true);
    const res = await fetch(`${API}/api/admin/teachers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(addForm),
    });
    if (res.ok) {
      const created = await res.json();
      setTeachers(prev => [{ ...created, classes: [], lessons: [] }, ...prev]);
      setAddOpen(false);
      setAddForm({ ...BLANK_FORM });
      showToast("Teacher created successfully.");
    } else {
      const err = await res.json().catch(() => ({}));
      showToast(err.error || "Failed to create teacher.");
    }
    setAddSaving(false);
  };

  const openEdit = (t: any) => {
    setEditTeacher(t);
    setEditForm({ fullName: t.fullName, email: t.email, password: "", status: "active" });
  };

  const handleEdit = async () => {
    if (!editTeacher) return;
    setEditSaving(true);
    const body: any = { fullName: editForm.fullName, email: editForm.email };
    if (editForm.password.trim()) body.password = editForm.password;
    const res = await fetch(`${API}/api/admin/teachers/${editTeacher._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const updated = await res.json();
      setTeachers(prev => prev.map(t => t._id === updated._id ? { ...t, ...updated } : t));
      setEditTeacher(null);
      showToast("Teacher updated.");
    } else { showToast("Failed to update teacher."); }
    setEditSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTeacher) return;
    setDeleting(true);
    const res = await fetch(`${API}/api/admin/teachers/${deleteTeacher._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setTeachers(prev => prev.filter(t => t._id !== deleteTeacher._id));
      setDeleteTeacher(null);
      showToast("Teacher deleted.");
    } else { showToast("Failed to delete teacher."); }
    setDeleting(false);
  };

  if (!admin) return null;
  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AdminNavbar adminName={admin.fullName} />

      {toast && (
        <div className="fixed top-4 right-4 z-[100] bg-[#1E2B5A] text-white px-6 py-3 rounded-xl shadow-xl font-bold text-[14px]">{toast}</div>
      )}

      <main className="ml-64 flex-1 p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-black text-[#1E2B5A]">Teachers</h1>
            <p className="text-[#8793AC] font-bold mt-1">
              {loading ? "Loading..." : `${teachers.length} teacher${teachers.length !== 1 ? "s" : ""} registered`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-[#E9EDF5] px-4 py-3 rounded-[14px] w-[280px] shadow-sm">
              <Search size={16} className="text-[#8793AC]" />
              <input type="text" placeholder="Search by name…" value={search} onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-[14px] font-bold text-[#1E2B5A] placeholder:text-[#8793AC] focus:outline-none w-full" />
            </div>
            <button onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 bg-[#1E2B5A] text-white px-5 py-3 rounded-xl font-black text-[14px] shadow-lg hover:bg-[#151F41] transition">
              <Plus size={18} /> Add Teacher
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            [...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-[20px] border border-[#E9EDF5] p-6 animate-pulse h-24" />)
          ) : teachers.length === 0 ? (
            <div className="bg-white rounded-[20px] border border-[#E9EDF5] p-12 text-center text-[#8793AC] font-bold">No teachers found.</div>
          ) : (
            teachers.map(t => {
              const isOpen       = expanded[t._id];
              const lessonCount  = (t.lessons || []).length;
              const totalStudents = (t.classes || []).reduce((s: number, c: any) => s + (c.students?.length || 0), 0);
              return (
                <div key={t._id} className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm overflow-hidden">
                  <div className="flex items-center gap-4 px-6 py-5">
                    <button onClick={() => toggle(t._id)} className="flex items-center gap-4 flex-1 text-left hover:opacity-80 transition">
                      <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-base flex-shrink-0">
                        {t.fullName?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-[#1E2B5A] text-[15px] leading-none">{t.fullName}</p>
                        <p className="text-[12px] text-[#8793AC] mt-1">{t.email}</p>
                      </div>
                      <div className="flex items-center gap-5 text-[13px] font-bold text-[#8793AC] flex-shrink-0">
                        <div className="flex items-center gap-1.5">
                          <BookOpen size={14} />
                          {lessonCount} lesson{lessonCount !== 1 ? "s" : ""}
                        </div>
                        <div className="flex items-center gap-1.5"><Users size={14} />{totalStudents} student{totalStudents !== 1 ? "s" : ""}</div>
                        <span className="text-[11px]">Active {t.lastActive ? new Date(t.lastActive).toLocaleDateString() : "—"}</span>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>
                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                      <button onClick={() => setViewTeacher(t)} className="p-2 rounded-lg text-[#8793AC] hover:bg-blue-50 hover:text-blue-600 transition" title="View profile"><Eye size={16} /></button>
                      <button onClick={() => openEdit(t)} className="p-2 rounded-lg text-[#8793AC] hover:bg-indigo-50 hover:text-indigo-600 transition" title="Edit"><Edit3 size={16} /></button>
                      <button onClick={() => setDeleteTeacher(t)} className="p-2 rounded-lg text-[#8793AC] hover:bg-red-50 hover:text-red-500 transition" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-[#E9EDF5] px-6 py-5 bg-[#F8FAFF]">
                      {lessonCount === 0 ? (
                        <p className="text-[13px] font-bold text-[#8793AC]">No lessons assigned yet.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {(t.lessons || []).map((l: any) => (
                            <div key={l._id} className="bg-white border border-[#E9EDF5] rounded-[14px] px-4 py-3 flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="font-black text-[#1E2B5A] text-[13px] truncate">{l.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-[6px] capitalize ${SUBJECT_COLORS[l.subject?.toLowerCase()] || "bg-gray-100 text-gray-600"}`}>
                                    {l.subject}
                                  </span>
                                  <span className="text-[11px] text-[#8793AC] font-bold">Grade {l.grade}</span>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <span className="text-[11px] font-bold text-[#8793AC] capitalize">{l.level || "Beginner"}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        {!loading && <div className="mt-4 text-[12px] font-bold text-[#8793AC]">{teachers.length} teacher{teachers.length !== 1 ? "s" : ""} shown</div>}
      </main>

      {/* ── Add Teacher Modal ── */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[480px] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E2B5A]">Add Teacher</h2>
              <button onClick={() => setAddOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Full Name *", key: "fullName", type: "text" },
                { label: "Email *", key: "email", type: "email" },
                { label: "Password *", key: "password", type: "password" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">{label}</label>
                  <input type={type} value={addForm[key as keyof typeof addForm]}
                    onChange={e => setAddForm({ ...addForm, [key]: e.target.value })}
                    className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A]" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setAddOpen(false)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} disabled={addSaving || !addForm.fullName.trim() || !addForm.email.trim() || !addForm.password.trim()}
                className="flex-1 py-3 rounded-xl bg-[#1E2B5A] text-white text-[14px] font-black hover:bg-[#151F41] disabled:opacity-50">
                {addSaving ? "Creating…" : "Create Teacher"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Teacher Modal ── */}
      {editTeacher && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[480px] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E2B5A]">Edit Teacher</h2>
              <button onClick={() => setEditTeacher(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Full Name", key: "fullName", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "New Password (leave blank to keep)", key: "password", type: "password" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">{label}</label>
                  <input type={type} value={editForm[key as keyof typeof editForm]}
                    onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                    className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A]" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setEditTeacher(null)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Cancel</button>
              <button onClick={handleEdit} disabled={editSaving}
                className="flex-1 py-3 rounded-xl bg-[#1E2B5A] text-white text-[14px] font-black hover:bg-[#151F41] disabled:opacity-50 flex items-center justify-center gap-2">
                <Save size={16} /> {editSaving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Profile Modal ── */}
      {viewTeacher && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[440px] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E2B5A]">Teacher Profile</h2>
              <button onClick={() => setViewTeacher(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-[28px] mb-3">
                {viewTeacher.fullName?.charAt(0)?.toUpperCase()}
              </div>
              <h3 className="text-[20px] font-black text-[#1E2B5A]">{viewTeacher.fullName}</h3>
              <p className="text-[14px] text-[#8793AC] font-bold">{viewTeacher.email}</p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Assigned Lessons", value: `${(viewTeacher.lessons || []).length} lesson${(viewTeacher.lessons || []).length !== 1 ? "s" : ""}` },
                { label: "Total Students", value: (viewTeacher.classes || []).reduce((s: number, c: any) => s + (c.students?.length || 0), 0) },
                { label: "Last Active", value: viewTeacher.lastActive ? new Date(viewTeacher.lastActive).toLocaleDateString() : "—" },
                { label: "Joined", value: viewTeacher.createdAt ? new Date(viewTeacher.createdAt).toLocaleDateString() : "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-[#F4F6FA]">
                  <span className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider">{label}</span>
                  <span className="text-[14px] font-black text-[#1E2B5A]">{String(value)}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setViewTeacher(null)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Close</button>
              <button onClick={() => { openEdit(viewTeacher); setViewTeacher(null); }}
                className="flex-1 py-3 rounded-xl bg-[#1E2B5A] text-white text-[14px] font-black hover:bg-[#151F41] flex items-center justify-center gap-2">
                <Edit3 size={15} /> Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTeacher && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[400px] p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={28} className="text-red-500" /></div>
            <h2 className="text-[20px] font-black text-[#1E2B5A] mb-2">Delete Teacher?</h2>
            <p className="text-[14px] font-bold text-[#8793AC] mb-8">"<span className="text-[#1E2B5A]">{deleteTeacher.fullName}</span>" will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTeacher(null)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Cancel</button>
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
