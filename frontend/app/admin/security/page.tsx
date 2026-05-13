"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { ShieldCheck, Users, Clock, UserCheck } from "lucide-react";

const API = "http://localhost:5001";

function timeAgo(date: string) {
  if (!date) return "Never";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const ROLE_COLORS: Record<string, string> = {
  admin:   "bg-red-100 text-red-700",
  teacher: "bg-emerald-100 text-emerald-700",
  student: "bg-blue-100 text-blue-600",
  parent:  "bg-orange-100 text-orange-700",
};

export default function AdminSecurityPage() {
  const router = useRouter();
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

    fetch(`${API}/api/admin/security`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  if (!admin) return null;

  const roleCounts: Record<string, number> = {};
  (data?.roleCounts || []).forEach((r: any) => { roleCounts[r._id] = r.count; });

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AdminNavbar adminName={admin.fullName} />

      <main className="ml-60 flex-1 p-10">
        <div className="mb-8">
          <h1 className="text-[32px] font-black text-[#1E2B5A]">Security & Access Control</h1>
          <p className="text-[#8793AC] font-bold mt-1">Monitor admin accounts, role assignments, and recent sign-ups.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Role breakdown */}
          <div className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm p-8">
            <h3 className="text-[16px] font-black text-[#1E2B5A] mb-5 flex items-center gap-2">
              <Users size={18} /> Users by Role
            </h3>
            {loading ? (
              <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}</div>
            ) : (
              <div className="space-y-3">
                {["admin", "teacher", "student", "parent"].map(role => (
                  <div key={role} className="flex items-center justify-between p-3 bg-[#F8FAFD] rounded-xl border border-[#E9EDF5]">
                    <span className={`px-3 py-1 rounded-full text-[12px] font-black capitalize ${ROLE_COLORS[role] || "bg-gray-100 text-gray-600"}`}>
                      {role}
                    </span>
                    <span className="text-[18px] font-black text-[#1E2B5A]">{roleCounts[role] || 0}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Admin accounts */}
          <div className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm p-8">
            <h3 className="text-[16px] font-black text-[#1E2B5A] mb-5 flex items-center gap-2">
              <ShieldCheck size={18} className="text-red-500" /> Admin Accounts
            </h3>
            {loading ? (
              <div className="space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
            ) : !data?.admins?.length ? (
              <p className="text-[#8793AC] font-bold text-[13px]">No admins found.</p>
            ) : (
              <div className="space-y-3">
                {data.admins.map((a: any) => (
                  <div key={a._id} className="p-3 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-[14px] font-black text-[#1E2B5A]">{a.fullName}</p>
                    <p className="text-[12px] font-bold text-[#8793AC]">{a.email}</p>
                    <p className="text-[11px] font-bold text-red-400 mt-1 flex items-center gap-1">
                      <Clock size={10} /> Last active: {timeAgo(a.lastActive)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Security notes */}
          <div className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm p-8">
            <h3 className="text-[16px] font-black text-[#1E2B5A] mb-5 flex items-center gap-2">
              <UserCheck size={18} className="text-emerald-500" /> Access Policy
            </h3>
            <div className="space-y-3 text-[13px] font-bold text-[#5E6D8F]">
              {[
                "JWT tokens expire after 7 days.",
                "Admin role cannot be self-assigned through registration.",
                "Admin accounts are created via the createAdmin.js script.",
                "Passwords are hashed with bcryptjs (10 rounds).",
                "All admin routes require Bearer token + admin role.",
                "Role changes are applied immediately on next request.",
              ].map((note, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-[#F8FAFD] rounded-lg border border-[#E9EDF5]">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent sign-ups */}
        <div className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm p-8">
          <h3 className="text-[18px] font-black text-[#1E2B5A] mb-6">Recent Registrations</h3>
          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : !data?.recentSignups?.length ? (
            <p className="text-[#8793AC] font-bold text-center py-8">No recent registrations.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F5F7FB]">
                    <th className="text-left pb-4 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">User</th>
                    <th className="text-left pb-4 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Email</th>
                    <th className="text-left pb-4 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Role</th>
                    <th className="text-right pb-4 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Registered</th>
                    <th className="text-right pb-4 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentSignups.map((u: any) => (
                    <tr key={u._id} className="border-b border-[#F5F7FB] hover:bg-[#F8FAFD] transition-colors">
                      <td className="py-4 text-[14px] font-black text-[#1E2B5A]">{u.fullName}</td>
                      <td className="py-4 text-[13px] font-bold text-[#5E6D8F]">{u.email}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-black capitalize ${ROLE_COLORS[u.role] || "bg-gray-100 text-gray-600"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 text-[13px] font-bold text-[#8793AC] text-right">{timeAgo(u.createdAt)}</td>
                      <td className="py-4 text-[13px] font-bold text-[#8793AC] text-right">{timeAgo(u.lastActive)}</td>
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
