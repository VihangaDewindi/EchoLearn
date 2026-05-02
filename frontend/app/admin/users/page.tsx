"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { Search, Trash2, ChevronDown } from "lucide-react";

const ROLES = ["all", "student", "teacher", "parent", "admin"] as const;
type Role = (typeof ROLES)[number];

export default function AdminUsers() {
  const router  = useRouter();
  const [admin, setAdmin]   = useState<any>(null);
  const [users, setUsers]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<Role>("all");
  const [search, setSearch] = useState("");
  const [token, setToken]   = useState("");
  const [actionMsg, setActionMsg] = useState("");

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

    fetch(`http://localhost:5001/api/admin/users?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setUsers(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setUsers([]); setLoading(false); });
  }, [token, roleFilter, search]);

  const changeRole = async (userId: string, newRole: string) => {
    const res = await fetch(`http://localhost:5001/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      setActionMsg("Role updated.");
      setTimeout(() => setActionMsg(""), 2000);
    }
  };

  const deleteUser = async (userId: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`http://localhost:5001/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setUsers(prev => prev.filter(u => u._id !== userId));
      setActionMsg("User deleted.");
      setTimeout(() => setActionMsg(""), 2000);
    }
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

      <main className="ml-64 flex-1 p-10">
        <div className="mb-8">
          <h1 className="text-[32px] font-black text-[#1E2B5A]">User Management</h1>
          <p className="text-[#8793AC] font-bold mt-1">View and manage all registered accounts</p>
        </div>

        {actionMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-2xl mb-6 font-bold text-[14px]">
            {actionMsg}
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-white border border-[#E9EDF5] px-4 py-3 rounded-[14px] flex-1 max-w-[360px] shadow-sm">
            <Search size={16} className="text-[#8793AC]" />
            <input
              type="text"
              placeholder="Search by name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-[14px] font-bold text-[#1E2B5A] placeholder:text-[#8793AC] focus:outline-none w-full"
            />
          </div>
          <div className="flex gap-2">
            {ROLES.map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-4 py-2 rounded-[10px] text-[13px] font-black capitalize transition ${
                  roleFilter === r ? "bg-[#1E2B5A] text-white" : "bg-white border border-[#E9EDF5] text-[#8793AC] hover:border-[#1E2B5A] hover:text-[#1E2B5A]"
                }`}
              >
                {r}
              </button>
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
                <th className="text-left px-6 py-4 font-black text-[#8793AC] uppercase tracking-wider text-[11px]">Joined</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-[#F4F6FA]">
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-[#8793AC] font-bold">No users found.</td></tr>
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
                      <div className="relative inline-block">
                        <select
                          value={u.role}
                          onChange={e => changeRole(u._id, e.target.value)}
                          className={`appearance-none pr-7 pl-3 py-1.5 rounded-[8px] text-[12px] font-black cursor-pointer focus:outline-none ${roleBadge[u.role] || "bg-gray-100 text-gray-700"}`}
                        >
                          {["student", "teacher", "parent", "admin"].map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#1E2B5A]">{(u.xp || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-[#8793AC] font-bold">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteUser(u._id, u.fullName)}
                        className="p-2 rounded-[8px] text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
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
    </div>
  );
}
