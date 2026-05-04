"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { Activity, BookOpen, Trophy, Zap, LogIn, Flame } from "lucide-react";

const TYPE_META: Record<string, { label: string; icon: any; color: string }> = {
  lesson_started:    { label: "Lesson Started",    icon: BookOpen, color: "bg-blue-100 text-blue-600" },
  lesson_completed:  { label: "Lesson Completed",  icon: BookOpen, color: "bg-emerald-100 text-emerald-600" },
  quiz_completed:    { label: "Quiz Completed",    icon: Zap,      color: "bg-purple-100 text-purple-600" },
  badge_earned:      { label: "Badge Earned",      icon: Trophy,   color: "bg-yellow-100 text-yellow-600" },
  login:             { label: "Login",             icon: LogIn,    color: "bg-gray-100 text-gray-600" },
  streak:            { label: "Streak",            icon: Flame,    color: "bg-orange-100 text-orange-600" },
};

export default function AdminActivity() {
  const router = useRouter();
  const [admin, setAdmin]   = useState<any>(null);
  const [logs, setLogs]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken]   = useState("");

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
    fetch("http://localhost:5001/api/admin/activity", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setLogs(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setLogs([]); setLoading(false); });
  }, [token]);

  if (!admin) return null;

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AdminNavbar adminName={admin.fullName} />

      <main className="ml-64 flex-1 p-10">
        <div className="mb-8">
          <h1 className="text-[32px] font-black text-[#1E2B5A]">Activity Log</h1>
          <p className="text-[#8793AC] font-bold mt-1">Recent platform events across all users</p>
        </div>

        <div className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-[10px] bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                  <div className="h-3 bg-gray-100 rounded w-20" />
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-[#8793AC] font-bold">
              <Activity size={40} className="mx-auto mb-4 opacity-30" />
              No activity logs yet.
            </div>
          ) : (
            <div className="divide-y divide-[#F4F6FA]">
              {logs.map((log: any, i: number) => {
                const meta = TYPE_META[log.type] || { label: log.type, icon: Activity, color: "bg-gray-100 text-gray-600" };
                const Icon = meta.icon;
                const user = log.userId;
                return (
                  <div key={log._id || i} className="flex items-center gap-5 px-6 py-5 hover:bg-[#F8FAFF] transition">
                    <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-[14px] text-[#1E2B5A] truncate">{log.title}</p>
                      <p className="text-[12px] text-[#8793AC] font-bold mt-0.5">
                        {user?.fullName || "Unknown user"} · {user?.role || ""}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`text-[11px] font-black uppercase px-2 py-1 rounded-[6px] ${meta.color}`}>{meta.label}</span>
                      <p className="text-[11px] text-[#8793AC] font-bold mt-1">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && logs.length > 0 && (
            <div className="px-6 py-4 bg-[#F8FAFF] border-t border-[#E9EDF5] text-[12px] font-bold text-[#8793AC]">
              {logs.length} recent event{logs.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
