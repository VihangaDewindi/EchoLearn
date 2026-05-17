"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { Search, Trophy, Flame, Star, Plus, Edit3, Trash2, X, Save, Eye, UserCheck } from "lucide-react";

const API = "http://localhost:5001";

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

const computeLevel = (xp: number) => Math.max(1, Math.floor(xp / 500) + 1);

const BLANK_FORM = { fullName: "", email: "", password: "", xp: "0", parentEmail: "", status: "active" };

export default function AdminStudents() {
  const router = useRouter();
  const [admin, setAdmin]       = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [token, setToken]       = useState("");
  const [toast, setToast]       = useState("");

  const [addOpen, setAddOpen]     = useState(false);
  const [addForm, setAddForm]     = useState({ ...BLANK_FORM });
  const [addSaving, setAddSaving] = useState(false);

  const [editStudent, setEditStudent] = useState<any>(null);
  const [editForm, setEditForm]       = useState({ fullName: "", email: "", password: "", xp: "0", parentEmail: "", status: "active" });
  const [editSaving, setEditSaving]   = useState(false);

  const [viewStudent, setViewStudent]   = useState<any>(null);
  const [deleteStudent, setDeleteStudent] = useState<any>(null);
  const [deleting, setDeleting]           = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchStudents = (tok: string, q: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q.trim()) params.set("search", q.trim());
    fetch(`${API}/api/admin/students?${params}`, { headers: { Authorization: `Bearer ${tok}` } })
      .then(r => r.json())
      .then(d => { setStudents(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setStudents([]); setLoading(false); });
  };

  useEffect(() => {
    const raw = localStorage.getItem("user");
    const tok = localStorage.getItem("token") || "";
    if (!raw || !tok) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    if (u.role !== "admin") { router.push("/login"); return; }
    setAdmin(u);
    setToken(tok);
    fetchStudents(tok, "");
  }, [router]);

  useEffect(() => { if (token) fetchStudents(token, search); }, [search]);

  const handleAdd = async () => {
    if (!addForm.fullName.trim() || !addForm.email.trim() || !addForm.password.trim()) return;
    setAddSaving(true);
    const res = await fetch(`${API}/api/admin/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...addForm, grade: "1" }),
    });
    if (res.ok) {
      const created = await res.json();
      setStudents(prev => [created, ...prev]);
      setAddOpen(false);
      setAddForm({ ...BLANK_FORM });
      showToast("Student created successfully.");
    } else {
      const err = await res.json().catch(() => ({}));
      showToast(err.error || "Failed to create student.");
    }
    setAddSaving(false);
  };

  const openEdit = (s: any) => {
    setEditStudent(s);
    setEditForm({
      fullName:    s.fullName,
      email:       s.email,
      password:    "",
      xp:          String(s.xp || 0),
      parentEmail: s.linkedParent?.email || "",
      status:      s.suspended ? "suspended" : "active",
    });
  };

  const handleEdit = async () => {
    if (!editStudent) return;
    setEditSaving(true);
    const body: any = { fullName: editForm.fullName, email: editForm.email, xp: editForm.xp, status: editForm.status };
    if (editForm.password.trim()) body.password = editForm.password;
    const res = await fetch(`${API}/api/admin/students/${editStudent._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const updated = await res.json();
      setStudents(prev => prev.map(s => s._id === updated._id ? { ...s, ...updated, linkedParent: s.linkedParent } : s));
      setEditStudent(null);
      showToast("Student updated.");
    } else { showToast("Failed to update student."); }
    setEditSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteStudent) return;
    setDeleting(true);
    const res = await fetch(`${API}/api/admin/students/${deleteStudent._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setStudents(prev => prev.filter(s => s._id !== deleteStudent._id));
      setDeleteStudent(null);
      showToast("Student deleted.");
    } else { showToast("Failed to delete student."); }
    setDeleting(false);
  };

  if (!admin) return null;

  const levelColor = (lvl: number) => {
    if (lvl >= 8) return "bg-purple-100 text-purple-700";
    if (lvl >= 5) return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AdminNavbar adminName={admin.fullName} />

      {toast && (
        <div className="fixed top-4 right-4 z-[100] bg-[#1E2B5A] text-white px-6 py-3 rounded-xl shadow-xl font-bold text-[14px]">{toast}</div>
      )}

      <main className="ml-64 flex-1 p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-black text-[#1E2B5A]">Students</h1>
            <p className="text-[#8793AC] font-bold mt-1">
              {loading ? "Loading..." : `${students.length} student${students.length !== 1 ? "s" : ""} registered`}
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
              <Plus size={18} /> Add Student
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#F8FAFF] border-b border-[#E9EDF5]">
                {["Student", "Level", "XP", "Streak", "Subject Progress", "Badges", "Last Active", ""].map(h => (
                  <th key={h} className="text-left px-5 py-4 font-black text-[#8793AC] uppercase tracking-wider text-[11px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-[#F4F6FA]">
                    {[...Array(8)].map((_, j) => (<td key={j} className="px-5 py-5"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>))}
                  </tr>
                ))
              ) : students.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-[#8793AC] font-bold">No students found.</td></tr>
              ) : (
                students.map(s => {
                  const displayLevel = computeLevel(s.xp || 0);
                  return (
                    <tr key={s._id} className="border-b border-[#F4F6FA] hover:bg-[#F8FAFF] transition">
                      <td className="px-5 py-4">
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
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-[8px] text-[12px] font-black ${levelColor(displayLevel)}`}>Lv {displayLevel}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 font-black text-[#1E2B5A]"><Star size={14} className="text-yellow-500" />{(s.xp || 0).toLocaleString()}</div>
                      </td>
                      <td className="px-5 py-4">
                        {(s.streak || 0) > 0
                          ? <div className="flex items-center gap-1.5 font-black text-[#1E2B5A]"><Flame size={14} className="text-orange-500" />{s.streak}d</div>
                          : <span className="text-[#C0C8D6] font-bold text-[12px]">No streak</span>}
                      </td>
                      <td className="px-5 py-4 min-w-[160px]">
                        <div className="space-y-1.5">
                          {[["Math", s.progress?.math || 0, "bg-blue-500"], ["Sci", s.progress?.science || 0, "bg-emerald-500"], ["Eng", s.progress?.english || 0, "bg-purple-500"]].map(([label, val, color]) => (
                            <div key={label as string} className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-[#8793AC] w-7">{label}</span>
                              <ProgressBar value={val as number} color={color as string} />
                              <span className="text-[10px] font-black text-[#8793AC] w-7 text-right">{val}%</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {s.badges?.length > 0
                          ? <div className="flex items-center gap-1"><Trophy size={14} className="text-yellow-500" /><span className="font-black text-[#1E2B5A]">{s.badges.length}</span></div>
                          : <span className="text-[#8793AC] font-bold">—</span>}
                      </td>
                      <td className="px-5 py-4 text-[#8793AC] font-bold">{s.lastActive ? new Date(s.lastActive).toLocaleDateString() : "—"}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setViewStudent(s)} className="p-2 rounded-lg text-[#8793AC] hover:bg-blue-50 hover:text-blue-600 transition" title="View"><Eye size={15} /></button>
                          <button onClick={() => openEdit(s)} className="p-2 rounded-lg text-[#8793AC] hover:bg-indigo-50 hover:text-indigo-600 transition" title="Edit"><Edit3 size={15} /></button>
                          <button onClick={() => setDeleteStudent(s)} className="p-2 rounded-lg text-[#8793AC] hover:bg-red-50 hover:text-red-500 transition" title="Delete"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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

      {/* ── Add Student Modal ── */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[520px] p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E2B5A]">Add Student</h2>
              <button onClick={() => setAddOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <StudentForm form={addForm} setForm={setAddForm} showPassword isAdd />
            <div className="flex gap-3 mt-8">
              <button onClick={() => setAddOpen(false)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} disabled={addSaving || !addForm.fullName.trim() || !addForm.email.trim() || !addForm.password.trim()}
                className="flex-1 py-3 rounded-xl bg-[#1E2B5A] text-white text-[14px] font-black hover:bg-[#151F41] disabled:opacity-50">
                {addSaving ? "Creating…" : "Create Student"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Student Modal ── */}
      {editStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[520px] p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E2B5A]">Edit Student</h2>
              <button onClick={() => setEditStudent(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <StudentForm form={editForm} setForm={setEditForm} showPassword showXP />
            <div className="flex gap-3 mt-8">
              <button onClick={() => setEditStudent(null)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Cancel</button>
              <button onClick={handleEdit} disabled={editSaving}
                className="flex-1 py-3 rounded-xl bg-[#1E2B5A] text-white text-[14px] font-black hover:bg-[#151F41] disabled:opacity-50 flex items-center justify-center gap-2">
                <Save size={16} /> {editSaving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Student Modal ── */}
      {viewStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[460px] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E2B5A]">Student Profile</h2>
              <button onClick={() => setViewStudent(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-[28px] mb-3">
                {viewStudent.fullName?.charAt(0)?.toUpperCase()}
              </div>
              <h3 className="text-[20px] font-black text-[#1E2B5A]">{viewStudent.fullName}</h3>
              <p className="text-[14px] text-[#8793AC] font-bold">{viewStudent.email}</p>
            </div>
            <div className="space-y-3 mb-4">
              {[
                { label: "Level",          value: `Level ${computeLevel(viewStudent.xp || 0)}` },
                { label: "XP",             value: (viewStudent.xp || 0).toLocaleString() },
                { label: "Streak",         value: (viewStudent.streak || 0) > 0 ? `${viewStudent.streak} days` : "No streak yet" },
                { label: "Badges",         value: `${viewStudent.badges?.length || 0} earned` },
                { label: "Linked Parent",  value: viewStudent.linkedParent?.fullName || "—" },
                { label: "Last Active",    value: viewStudent.lastActive ? new Date(viewStudent.lastActive).toLocaleDateString() : "—" },
                { label: "Joined",         value: viewStudent.createdAt ? new Date(viewStudent.createdAt).toLocaleDateString() : "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-[#F4F6FA]">
                  <span className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider">{label}</span>
                  <span className="text-[14px] font-black text-[#1E2B5A]">{value}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 mb-6">
              <p className="text-[11px] font-black text-[#8793AC] uppercase tracking-wider mb-2">Subject Progress</p>
              {[["Mathematics", viewStudent.progress?.math || 0, "bg-blue-500"], ["Science", viewStudent.progress?.science || 0, "bg-emerald-500"], ["English", viewStudent.progress?.english || 0, "bg-purple-500"]].map(([label, val, color]) => (
                <div key={label as string} className="flex items-center gap-3">
                  <span className="text-[12px] font-bold text-[#8793AC] w-24">{label}</span>
                  <ProgressBar value={val as number} color={color as string} />
                  <span className="text-[12px] font-black text-[#1E2B5A] w-8 text-right">{val}%</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setViewStudent(null)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Close</button>
              <button onClick={() => { openEdit(viewStudent); setViewStudent(null); }}
                className="flex-1 py-3 rounded-xl bg-[#1E2B5A] text-white text-[14px] font-black hover:bg-[#151F41] flex items-center justify-center gap-2">
                <Edit3 size={15} /> Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[400px] p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={28} className="text-red-500" /></div>
            <h2 className="text-[20px] font-black text-[#1E2B5A] mb-2">Delete Student?</h2>
            <p className="text-[14px] font-bold text-[#8793AC] mb-8">"<span className="text-[#1E2B5A]">{deleteStudent.fullName}</span>" will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteStudent(null)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Cancel</button>
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

function StudentForm({
  form, setForm, showPassword, showXP, isAdd,
}: {
  form: any;
  setForm: (f: any) => void;
  showPassword?: boolean;
  showXP?: boolean;
  isAdd?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Full Name *</label>
        <input type="text" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
          className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A]" />
      </div>
      <div>
        <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Email *</label>
        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A]" />
      </div>
      {showPassword && (
        <div>
          <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">
            Password {!isAdd ? "(leave blank to keep)" : "*"}
          </label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A]" />
        </div>
      )}
      {showXP && (
        <div>
          <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">XP Points</label>
          <input type="number" value={form.xp} onChange={e => setForm({ ...form, xp: e.target.value })} min={0}
            className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[14px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A]" />
          <p className="text-[11px] text-[#8793AC] font-bold mt-1">
            Level auto-upgrades: every 500 XP = 1 level
          </p>
        </div>
      )}
      {/* Linked parent — pre-filled and read-only in edit, editable in add */}
      <div>
        <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">
          {isAdd ? "Parent Email (optional)" : "Linked Parent"}
        </label>
        {isAdd ? (
          <input type="email" value={form.parentEmail} onChange={e => setForm({ ...form, parentEmail: e.target.value })}
            placeholder="Links student to parent account"
            className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A]" />
        ) : (
          <div className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 bg-[#F8FAFF] flex items-center gap-2">
            <UserCheck size={15} className="text-[#8793AC] flex-shrink-0" />
            <span className="text-[14px] font-bold text-[#8793AC]">
              {form.parentEmail || "No parent linked"}
            </span>
            {form.parentEmail && (
              <span className="ml-auto text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">Linked</span>
            )}
          </div>
        )}
        {!isAdd && (
          <p className="text-[11px] text-[#8793AC] font-bold mt-1">Parent link is managed from the Parents section.</p>
        )}
      </div>
      <div>
        <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Status</label>
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
          className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[14px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A] bg-white">
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
    </div>
  );
}
