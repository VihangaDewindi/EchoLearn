"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { Search, Star, ChevronDown, ChevronUp, UserCheck, Plus, Edit3, Trash2, X, Save, Eye } from "lucide-react";

const API = "http://localhost:5001";
const BLANK_FORM = { fullName: "", email: "", password: "", childEmail: "", status: "active" };

export default function AdminParents() {
  const router = useRouter();
  const [admin, setAdmin]     = useState<any>(null);
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [token, setToken]     = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [toast, setToast]     = useState("");

  const [addOpen, setAddOpen]     = useState(false);
  const [addForm, setAddForm]     = useState({ ...BLANK_FORM });
  const [addSaving, setAddSaving] = useState(false);

  const [editParent, setEditParent] = useState<any>(null);
  const [editForm, setEditForm]     = useState({ fullName: "", email: "", password: "", childEmail: "", status: "active" });
  const [editSaving, setEditSaving] = useState(false);

  const [viewParent, setViewParent]   = useState<any>(null);
  const [deleteParent, setDeleteParent] = useState<any>(null);
  const [deleting, setDeleting]         = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchParents = (tok: string, q: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q.trim()) params.set("search", q.trim());
    fetch(`${API}/api/admin/parents?${params}`, { headers: { Authorization: `Bearer ${tok}` } })
      .then(r => r.json())
      .then(d => { setParents(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setParents([]); setLoading(false); });
  };

  useEffect(() => {
    const raw = localStorage.getItem("user");
    const tok = localStorage.getItem("token") || "";
    if (!raw || !tok) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    if (u.role !== "admin") { router.push("/login"); return; }
    setAdmin(u);
    setToken(tok);
    fetchParents(tok, "");
  }, [router]);

  useEffect(() => { if (token) fetchParents(token, search); }, [search]);

  const handleAdd = async () => {
    if (!addForm.fullName.trim() || !addForm.email.trim() || !addForm.password.trim()) return;
    setAddSaving(true);
    const res = await fetch(`${API}/api/admin/parents`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(addForm),
    });
    if (res.ok) {
      const created = await res.json();
      setParents(prev => [{ ...created, children: [] }, ...prev]);
      setAddOpen(false);
      setAddForm({ ...BLANK_FORM });
      showToast("Parent created successfully.");
    } else {
      const err = await res.json().catch(() => ({}));
      showToast(err.error || "Failed to create parent.");
    }
    setAddSaving(false);
  };

  const openEdit = (p: any) => {
    setEditParent(p);
    setEditForm({ fullName: p.fullName, email: p.email, password: "", childEmail: p.children?.[0]?.email || "", status: "active" });
  };

  const handleEdit = async () => {
    if (!editParent) return;
    setEditSaving(true);
    const body: any = { fullName: editForm.fullName, email: editForm.email };
    if (editForm.password.trim()) body.password = editForm.password;
    if (editForm.childEmail.trim()) body.childEmail = editForm.childEmail;
    const res = await fetch(`${API}/api/admin/parents/${editParent._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const updated = await res.json();
      setParents(prev => prev.map(p => p._id === updated._id ? { ...p, ...updated } : p));
      setEditParent(null);
      showToast("Parent updated.");
    } else { showToast("Failed to update parent."); }
    setEditSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteParent) return;
    setDeleting(true);
    const res = await fetch(`${API}/api/admin/parents/${deleteParent._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setParents(prev => prev.filter(p => p._id !== deleteParent._id));
      setDeleteParent(null);
      showToast("Parent deleted.");
    } else { showToast("Failed to delete parent."); }
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
            <h1 className="text-[32px] font-black text-[#1E2B5A]">Parents</h1>
            <p className="text-[#8793AC] font-bold mt-1">
              {loading ? "Loading..." : `${parents.length} parent${parents.length !== 1 ? "s" : ""} registered`}
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
              <Plus size={18} /> Add Parent
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            [...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-[20px] border border-[#E9EDF5] p-6 animate-pulse h-24" />)
          ) : parents.length === 0 ? (
            <div className="bg-white rounded-[20px] border border-[#E9EDF5] p-12 text-center text-[#8793AC] font-bold">No parents found.</div>
          ) : (
            parents.map(p => {
              const isOpen = expanded[p._id];
              return (
                <div key={p._id} className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm overflow-hidden">
                  <div className="flex items-center gap-4 px-6 py-5">
                    <button onClick={() => toggle(p._id)} className="flex items-center gap-4 flex-1 text-left hover:opacity-80 transition">
                      <div className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-base flex-shrink-0">
                        {p.fullName?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-[#1E2B5A] text-[15px] leading-none">{p.fullName}</p>
                        <p className="text-[12px] text-[#8793AC] mt-1">{p.email}</p>
                      </div>
                      <div className="flex items-center gap-5 text-[13px] font-bold text-[#8793AC] flex-shrink-0">
                        <div className="flex items-center gap-1.5"><UserCheck size={14} />{(p.children || []).length} linked child{(p.children || []).length !== 1 ? "ren" : ""}</div>
                        <span className="text-[11px]">Active {p.lastActive ? new Date(p.lastActive).toLocaleDateString() : "—"}</span>
                        <span className="text-[11px]">Joined {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}</span>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>
                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                      <button onClick={() => setViewParent(p)} className="p-2 rounded-lg text-[#8793AC] hover:bg-blue-50 hover:text-blue-600 transition" title="View"><Eye size={16} /></button>
                      <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-[#8793AC] hover:bg-indigo-50 hover:text-indigo-600 transition" title="Edit"><Edit3 size={16} /></button>
                      <button onClick={() => setDeleteParent(p)} className="p-2 rounded-lg text-[#8793AC] hover:bg-red-50 hover:text-red-500 transition" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-[#E9EDF5] px-6 py-5 bg-[#F8FAFF]">
                      {(p.children || []).length === 0 ? (
                        <p className="text-[13px] font-bold text-[#8793AC]">No linked students yet.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {(p.children || []).map((child: any) => (
                            <div key={child._id} className="bg-white border border-[#E9EDF5] rounded-[14px] px-4 py-3 flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                                {child.fullName?.charAt(0)?.toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-black text-[#1E2B5A] text-[13px] truncate">{child.fullName}</p>
                                <p className="text-[11px] text-[#8793AC] truncate">{child.email}</p>
                              </div>
                              <div className="text-right flex-shrink-0 space-y-0.5">
                                <div className="flex items-center gap-1 justify-end">
                                  <Star size={11} className="text-yellow-500" />
                                  <span className="text-[12px] font-black text-[#1E2B5A]">{(child.xp || 0).toLocaleString()} XP</span>
                                </div>
                                <p className="text-[10px] font-bold text-[#8793AC]">Level {child.level || 1}</p>
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
        {!loading && <div className="mt-4 text-[12px] font-bold text-[#8793AC]">{parents.length} parent{parents.length !== 1 ? "s" : ""} shown</div>}
      </main>

      {/* ── Add Parent Modal ── */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[480px] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E2B5A]">Add Parent</h2>
              <button onClick={() => setAddOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <ParentForm form={addForm} setForm={setAddForm} showPassword />
            <div className="flex gap-3 mt-8">
              <button onClick={() => setAddOpen(false)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} disabled={addSaving || !addForm.fullName.trim() || !addForm.email.trim() || !addForm.password.trim()}
                className="flex-1 py-3 rounded-xl bg-[#1E2B5A] text-white text-[14px] font-black hover:bg-[#151F41] disabled:opacity-50">
                {addSaving ? "Creating…" : "Create Parent"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Parent Modal ── */}
      {editParent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[480px] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E2B5A]">Edit Parent</h2>
              <button onClick={() => setEditParent(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <ParentForm form={editForm} setForm={setEditForm} showPassword />
            <div className="flex gap-3 mt-8">
              <button onClick={() => setEditParent(null)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Cancel</button>
              <button onClick={handleEdit} disabled={editSaving}
                className="flex-1 py-3 rounded-xl bg-[#1E2B5A] text-white text-[14px] font-black hover:bg-[#151F41] disabled:opacity-50 flex items-center justify-center gap-2">
                <Save size={16} /> {editSaving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Profile Modal ── */}
      {viewParent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[440px] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E2B5A]">Parent Profile</h2>
              <button onClick={() => setViewParent(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-[28px] mb-3">
                {viewParent.fullName?.charAt(0)?.toUpperCase()}
              </div>
              <h3 className="text-[20px] font-black text-[#1E2B5A]">{viewParent.fullName}</h3>
              <p className="text-[14px] text-[#8793AC] font-bold">{viewParent.email}</p>
            </div>
            <div className="space-y-3 mb-4">
              {[
                { label: "Linked Children", value: `${(viewParent.children || []).length} student${(viewParent.children || []).length !== 1 ? "s" : ""}` },
                { label: "Last Active", value: viewParent.lastActive ? new Date(viewParent.lastActive).toLocaleDateString() : "—" },
                { label: "Joined", value: viewParent.createdAt ? new Date(viewParent.createdAt).toLocaleDateString() : "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-[#F4F6FA]">
                  <span className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider">{label}</span>
                  <span className="text-[14px] font-black text-[#1E2B5A]">{value}</span>
                </div>
              ))}
            </div>
            {(viewParent.children || []).length > 0 && (
              <div className="mb-4">
                <p className="text-[11px] font-black text-[#8793AC] uppercase tracking-wider mb-2">Linked Children</p>
                {(viewParent.children || []).map((child: any) => (
                  <div key={child._id} className="flex items-center gap-3 py-2 border-b border-[#F4F6FA]">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                      {child.fullName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-black text-[#1E2B5A]">{child.fullName}</p>
                      <p className="text-[11px] text-[#8793AC]">{child.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-black text-[#1E2B5A]">{(child.xp || 0)} XP</p>
                      <p className="text-[10px] text-[#8793AC]">Lv {child.level || 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setViewParent(null)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Close</button>
              <button onClick={() => { openEdit(viewParent); setViewParent(null); }}
                className="flex-1 py-3 rounded-xl bg-[#1E2B5A] text-white text-[14px] font-black hover:bg-[#151F41] flex items-center justify-center gap-2">
                <Edit3 size={15} /> Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteParent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[400px] p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={28} className="text-red-500" /></div>
            <h2 className="text-[20px] font-black text-[#1E2B5A] mb-2">Delete Parent?</h2>
            <p className="text-[14px] font-bold text-[#8793AC] mb-8">"<span className="text-[#1E2B5A]">{deleteParent.fullName}</span>" will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteParent(null)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Cancel</button>
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

function ParentForm({ form, setForm, showPassword }: { form: any; setForm: (f: any) => void; showPassword?: boolean }) {
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
          <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Password {form._id ? "(leave blank to keep)" : "*"}</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A]" />
        </div>
      )}
      <div>
        <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Linked Child Email (optional)</label>
        <input type="email" value={form.childEmail} onChange={e => setForm({ ...form, childEmail: e.target.value })}
          placeholder="Student email to link"
          className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A]" />
      </div>
      <div>
        <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Status</label>
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
          className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[14px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A] bg-white">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
}
