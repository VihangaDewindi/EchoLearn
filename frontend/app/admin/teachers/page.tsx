"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { Search, BookOpen, Users, ChevronDown, ChevronUp } from "lucide-react";

type ClassItem = {
  _id: string;
  name: string;
  subject: string;
  gradeLevel: string;
  students: string[];
};

type Teacher = {
  _id: string;
  fullName: string;
  email: string;
  lastActive: string;
  createdAt: string;
  classes: ClassItem[];
};

const SUBJECT_COLORS: Record<string, string> = {
  mathematics: "bg-blue-100 text-blue-700",
  science:     "bg-emerald-100 text-emerald-700",
  english:     "bg-purple-100 text-purple-700",
  sinhala:     "bg-yellow-100 text-yellow-700",
  tamil:       "bg-orange-100 text-orange-700",
};

export default function AdminTeachers() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [token, setToken] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

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
    if (search.trim()) params.set("search", search.trim());

    fetch(`http://localhost:5001/api/admin/teachers?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setTeachers(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setTeachers([]); setLoading(false); });
  }, [token, search]);

  if (!admin) return null;

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AdminNavbar adminName={admin.fullName} />

      <main className="ml-64 flex-1 p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-black text-[#1E2B5A]">Teachers</h1>
            <p className="text-[#8793AC] font-bold mt-1">
              {loading ? "Loading..." : `${teachers.length} teacher${teachers.length !== 1 ? "s" : ""} registered`}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-[#E9EDF5] px-4 py-3 rounded-[14px] w-[300px] shadow-sm">
            <Search size={16} className="text-[#8793AC]" />
            <input
              type="text"
              placeholder="Search by name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-[14px] font-bold text-[#1E2B5A] placeholder:text-[#8793AC] focus:outline-none w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-[20px] border border-[#E9EDF5] p-6 animate-pulse h-24" />
            ))
          ) : teachers.length === 0 ? (
            <div className="bg-white rounded-[20px] border border-[#E9EDF5] p-12 text-center text-[#8793AC] font-bold">
              No teachers found.
            </div>
          ) : (
            teachers.map(t => {
              const isOpen = expanded[t._id];
              const totalStudents = t.classes.reduce((sum, c) => sum + (c.students?.length || 0), 0);
              return (
                <div key={t._id} className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggle(t._id)}
                    className="w-full flex items-center gap-4 px-6 py-5 hover:bg-[#F8FAFF] transition text-left"
                  >
                    <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-base flex-shrink-0">
                      {t.fullName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-[#1E2B5A] text-[15px] leading-none">{t.fullName}</p>
                      <p className="text-[12px] text-[#8793AC] mt-1">{t.email}</p>
                    </div>
                    <div className="flex items-center gap-6 text-[13px] font-bold text-[#8793AC] flex-shrink-0">
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={14} />
                        {t.classes.length} class{t.classes.length !== 1 ? "es" : ""}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={14} />
                        {totalStudents} student{totalStudents !== 1 ? "s" : ""}
                      </div>
                      <span className="text-[11px]">
                        Active {t.lastActive ? new Date(t.lastActive).toLocaleDateString() : "—"}
                      </span>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#E9EDF5] px-6 py-5 bg-[#F8FAFF]">
                      {t.classes.length === 0 ? (
                        <p className="text-[13px] font-bold text-[#8793AC]">No classes assigned yet.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {t.classes.map(c => (
                            <div key={c._id} className="bg-white border border-[#E9EDF5] rounded-[14px] px-4 py-3 flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="font-black text-[#1E2B5A] text-[13px] truncate">{c.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-[6px] capitalize ${SUBJECT_COLORS[c.subject?.toLowerCase()] || "bg-gray-100 text-gray-600"}`}>
                                    {c.subject}
                                  </span>
                                  <span className="text-[11px] text-[#8793AC] font-bold">{c.gradeLevel}</span>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="font-black text-[#1E2B5A] text-[15px]">{c.students?.length || 0}</p>
                                <p className="text-[10px] text-[#8793AC] font-bold">students</p>
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

        {!loading && (
          <div className="mt-4 text-[12px] font-bold text-[#8793AC]">
            {teachers.length} teacher{teachers.length !== 1 ? "s" : ""} shown
          </div>
        )}
      </main>
    </div>
  );
}
