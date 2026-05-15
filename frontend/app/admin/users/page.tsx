"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { Search, Trash2, ChevronDown, Plus, Edit3, X, Save, Eye } from "lucide-react";

const API = "http://localhost:5001";
const ROLES = ["all", "student", "teacher", "parent", "admin"] as const;
type Role = (typeof ROLES)[number];

const BLANK_FORM = { fullName: "", email: "", password: "", role: "student", xp: "", status: "active" };

function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[540px] p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const router = useRouter();
  const [admin, setAdmin]     = useState<any>(null);
  const [users, setUsers]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<Role>("all");
  const [search, setSearch]   = useState("");
  const [token, setToken]     = useState("");
  const [toast, setToast]     = useState("");

  // Modals
  const [addOpen, setAddOpen]   = useState(false);
  const [addForm, setAddForm]   = useState({ ...BLANK_FORM });
  const [addSaving, setAddSaving] = useState(false);

  const [editUser, setEditUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ fullName: "", email: "", xp: "", role: "student", status: "active", password: "" });
  const [editSaving, setEditSaving] = useState(false);

  const [viewUser, setViewUser] = useState<any>(null);
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const [deleting, setDeleting]   = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

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
    if (roleFilter !== "all") params.set("role", roleFilter);
    if (search.trim()) params.set("search", search.trim());
    fetch(`${API}/api/admin/users?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setUsers(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setUsers([]); setLoading(false); });
  }, [token, roleFilter, search]);

  const handleAdd = async () => {
    if (!addForm.fullName.trim() || !addForm.email.trim() || !addForm.password.trim()) return;
    setAddSaving(true);
    const res = await fetch(`${API}/api/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(addForm),
    });
    if (res.ok) {
      const created = await res.json();
      setUsers(prev => [created, ...prev]);
      setAddOpen(false);
      setAddForm({ ...BLANK_FORM });
      showToast("User created successfully.");
    } else {
      const err = await res.json();
      showToast(err.error || "Failed to create user.");
    }
    setAddSaving(false);
  };

  const openEdit = (u: any) => {
    setEditUser(u);
    setEditForm({ fullName: u.fullName, email: u.email, xp: String(u.xp || 0), role: u.role, status: u.suspended ? "suspended" : "active", password: "" });
  };

  const handleEdit = async () => {
    if (!editUser) return;
    setEditSaving(true);
    const body: any = { fullName: editForm.fullName, email: editForm.email, role: editForm.role, xp: Number(editForm.xp), status: editForm.status };
    if (editForm.password.trim()) body.password = editForm.password;
    const res = await fetch(`${API}/api/admin/users/${editUser._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers(prev => prev.map(u => u._id === updated._id ? updated : u));
      setEditUser(null);
      showToast("User updated.");
    } else { showToast("Failed to update user."); }
    setEditSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleting(true);
    const res = await fetch(`${API}/api/admin/users/${deleteUser._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setUsers(prev => prev.filter(u => u._id !== deleteUser._id));
      setDeleteUser(null);
      showToast("User deleted.");
    } else { showToast("Failed to delete user."); }
    setDeleting(false);
  };

  if (!admin) return null;

  const roleBadge: Record<string, string> = {
    student: "bg-blue-100 text-blue-700",
    teacher: "bg-emerald-100 text-emerald-700",
    parent:  "bg-orange-100 text-orange-700",
    admin:   "bg-red-100 text-red-700",
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AdminNavbar adminName={admin.fullName} />

      {toast && (
        <div className="fixed top-4 right-4 z-[100] bg-[#1E2B5A] text-white px-6 py-3 rounded-xl shadow-xl font-bold text-[14px]">
          {toast}
        </div>
      )}

      <main className="ml-64 flex-1 p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-black text-[#1E2B5A]">User Management</h1>
            <p className="text-[#8793AC] font-bold mt-1">Create, view, edit, and delete user accounts</p>
          </div>
          <button onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 bg-[#1E2B5A] text-white px-6 py-3 rounded-xl font-black text-[14px] shadow-lg hover:bg-[#151F41] transition">
            <Plus size={18} /> Add User
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-white border border-[#E9EDF5] px-4 py-3 rounded-[14px] flex-1 max-w-[360px] shadow-sm">
            <Search size={16} className="text-[#8793AC]" />
            <input type="text" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-[14px] font-bold text-[#1E2B5A] placeholder:text-[#8793AC] focus:outline-none w-full" />
          </div>
          <div className="flex gap-2">
            {ROLES.map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-4 py-2 rounded-[10px] text-[13px] font-black capitalize transition ${
                  roleFilter === r ? "bg-[#1E2B5A] text-white" : "bg-white border border-[#E9EDF5] text-[#8793AC] hover:border-[#1E2B5A] hover:text-[#1E2B5A]"
                }`}>{r}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm overflow-hidden">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-[#F8FAFF] border-b border-[#E9EDF5]">
                <th className="text-left px-6 py-4 font-black text-[#8793AC] uppercase tracking-wider text-[11px]">Name</th>
                <th className="text-left px-6 py-4 font-black text-[#8793AC] uppercase tracking-wider text-[11px]">Email</th>
                <th className="text-left px-6 py-4 font-black text-[#8793AC] uppercase tracking-wider text-[11px]">Role</th>
                <th className="text-left px-6 py-4 font-black text-[#8793AC] uppercase tracking-wider text-[11px]">XP</th>
                <th className="text-left px-6 py-4 font-black text-[#8793AC] uppercase tracking-wider text-[11px]">Status</th>
                <th className="text-left px-6 py-4 font-black text-[#8793AC] uppercase tracking-wider text-[11px]">Joined</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-[#F4F6FA]">
                    {[...Array(7)].map((_, j) => (<td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-[#8793AC] font-bold">No users found.</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u._id} className="border-b border-[#F4F6FA] hover:bg-[#F8FAFF] transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1E2B5A] text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                          {u.fullName?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-bold text-[#1E2B5A]">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#8793AC] font-bold">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-[8px] text-[12px] font-black capitalize ${roleBadge[u.role] || "bg-gray-100 text-gray-700"}`}>{u.role}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#1E2B5A]">{(u.xp || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-[8px] text-[11px] font-black ${u.suspended ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                        {u.suspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#8793AC] font-bold">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewUser(u)} className="p-2 rounded-[8px] text-[#8793AC] hover:bg-blue-50 hover:text-blue-600 transition" title="View profile"><Eye size={15} /></button>
                        <button onClick={() => openEdit(u)} className="p-2 rounded-[8px] text-[#8793AC] hover:bg-indigo-50 hover:text-indigo-600 transition" title="Edit"><Edit3 size={15} /></button>
                        <button onClick={() => setDeleteUser(u)} className="p-2 rounded-[8px] text-red-400 hover:bg-red-50 hover:text-red-600 transition" title="Delete"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!loading && (
            <div className="px-6 py-4 bg-[#F8FAFF] border-t border-[#E9EDF5] text-[12px] font-bold text-[#8793AC]">
              {users.length} user{users.length !== 1 ? "s" : ""} shown
            </div>
          )}
        </div>
      </main>

      {/* ── Add User Modal ── */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[520px] p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E2B5A]">Add New User</h2>
              <button onClick={() => setAddOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <UserForm form={addForm} setForm={setAddForm} showPassword />
            <div className="flex gap-3 mt-8">
              <button onClick={() => setAddOpen(false)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} disabled={addSaving || !addForm.fullName.trim() || !addForm.email.trim() || !addForm.password.trim()}
                className="flex-1 py-3 rounded-xl bg-[#1E2B5A] text-white text-[14px] font-black hover:bg-[#151F41] disabled:opacity-50">
                {addSaving ? "Creating…" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit User Modal ── */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[520px] p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E2B5A]">Edit User</h2>
              <button onClick={() => setEditUser(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <UserForm form={editForm} setForm={setEditForm} showPassword />
            <div className="flex gap-3 mt-8">
              <button onClick={() => setEditUser(null)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Cancel</button>
              <button onClick={handleEdit} disabled={editSaving}
                className="flex-1 py-3 rounded-xl bg-[#1E2B5A] text-white text-[14px] font-black hover:bg-[#151F41] disabled:opacity-50 flex items-center justify-center gap-2">
                <Save size={16} /> {editSaving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Profile Modal ── */}
      {viewUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[460px] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E2B5A]">User Profile</h2>
              <button onClick={() => setViewUser(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#1E2B5A] text-white flex items-center justify-center font-black text-[28px] mb-3">
                {viewUser.fullName?.charAt(0)?.toUpperCase()}
              </div>
              <h3 className="text-[20px] font-black text-[#1E2B5A]">{viewUser.fullName}</h3>
              <p className="text-[14px] text-[#8793AC] font-bold">{viewUser.email}</p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Role",     value: viewUser.role },
                { label: "XP",      value: (viewUser.xp || 0).toLocaleString() },
                { label: "Level",   value: viewUser.level || 1 },
                { label: "Streak",  value: `${viewUser.streak || 0} days` },
                { label: "Status",  value: viewUser.suspended ? "Suspended" : "Active" },
                { label: "Joined",  value: viewUser.createdAt ? new Date(viewUser.createdAt).toLocaleDateString() : "—" },
                { label: "Last Active", value: viewUser.lastActive ? new Date(viewUser.lastActive).toLocaleDateString() : "—" },
                { label: "Badges",  value: (viewUser.badges?.length || 0) + " earned" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-[#F4F6FA]">
                  <span className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider">{label}</span>
                  <span className="text-[14px] font-black text-[#1E2B5A] capitalize">{String(value)}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setViewUser(null)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Close</button>
              <button onClick={() => { openEdit(viewUser); setViewUser(null); }}
                className="flex-1 py-3 rounded-xl bg-[#1E2B5A] text-white text-[14px] font-black hover:bg-[#151F41] flex items-center justify-center gap-2">
                <Edit3 size={15} /> Edit User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[400px] p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h2 className="text-[20px] font-black text-[#1E2B5A] mb-2">Delete User?</h2>
            <p className="text-[14px] font-bold text-[#8793AC] mb-8">
              "<span className="text-[#1E2B5A]">{deleteUser.fullName}</span>" will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteUser(null)} className="flex-1 py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50">Cancel</button>
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

function UserForm({ form, setForm, showPassword }: { form: any; setForm: (f: any) => void; showPassword?: boolean }) {
  const roles = ["student", "teacher", "parent", "admin"];
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
            Password {form._id ? "(leave blank to keep current)" : "*"}
          </label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder={form._id ? "Leave blank to keep current" : "Set password"}
            className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A]" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Role</label>
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
            className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[14px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A] bg-white capitalize">
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
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
      <div>
        <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">XP Points</label>
        <input type="number" value={form.xp} onChange={e => setForm({ ...form, xp: e.target.value })} min={0}
          className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A]" />
      </div>
    </div>
  );
}
