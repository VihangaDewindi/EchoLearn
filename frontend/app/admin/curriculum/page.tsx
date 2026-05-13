"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { BookOpen, ChevronDown, ChevronUp, Search, ExternalLink, Layers, FlaskConical } from "lucide-react";

const API = "http://localhost:5001";

const SUBJECT_ICONS: Record<string, any> = {
  Mathematics: Layers,
  Science:     FlaskConical,
  English:     BookOpen,
};

export default function AdminCurriculumPage() {
  const router = useRouter();
  const [admin, setAdmin]           = useState<any>(null);
  const [curriculum, setCurriculum] = useState<Record<string, any>>({});
  const [loading, setLoading]       = useState(true);
  const [activeSubject, setActiveSubject] = useState("Mathematics");
  const [expandedGrade, setExpandedGrade] = useState<string | null>(null);
  const [search, setSearch]         = useState("");
  const [toast, setToast]           = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    const raw = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!raw || !token) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    if (u.role !== "admin") { router.push("/login"); return; }
    setAdmin(u);

    fetch(`${API}/api/admin/curriculum`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setCurriculum(d || {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  if (!admin) return null;

  const subjects = Object.keys(curriculum);
  const gradeGroups = (curriculum[activeSubject] || []).filter((g: any) => {
    if (!search) return true;
    return g.label.toLowerCase().includes(search.toLowerCase()) ||
      g.lessons.some((l: any) => l.title.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AdminNavbar adminName={admin.fullName} />

      {toast && (
        <div className="fixed top-4 right-4 z-[100] bg-[#1E2B5A] text-white px-6 py-3 rounded-xl shadow-xl font-bold text-[14px]">
          {toast}
        </div>
      )}

      <main className="ml-60 flex-1 p-10">
        <div className="mb-8">
          <h1 className="text-[32px] font-black text-[#1E2B5A]">Curriculum Management</h1>
          <p className="text-[#8793AC] font-bold mt-1">Browse all lessons organised by subject and grade level.</p>
        </div>

        {/* Subject tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {loading ? (
            <div className="text-[#8793AC] font-bold">Loading…</div>
          ) : subjects.map((sub) => {
            const Icon = SUBJECT_ICONS[sub] || BookOpen;
            return (
              <button key={sub} onClick={() => setActiveSubject(sub)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[14px] transition-all ${
                  activeSubject === sub ? "bg-[#1E2B5A] text-white shadow-lg" : "bg-white border border-[#E9EDF5] text-[#5E6D8F] hover:border-[#1E2B5A]"
                }`}>
                <Icon size={16} /> {sub}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white px-5 py-3.5 rounded-xl border border-[#E9EDF5] shadow-sm mb-6 focus-within:border-[#1E2B5A] transition-all">
          <Search size={18} className="text-[#A0A9C0]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${activeSubject} lessons…`}
            className="bg-transparent text-[14px] font-bold text-[#1E2B5A] focus:outline-none placeholder-[#A0A9C0] w-full" />
        </div>

        {/* Grade groups */}
        <div className="space-y-4">
          {loading ? (
            [...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-[20px] h-16 animate-pulse border border-[#E9EDF5]" />)
          ) : gradeGroups.length === 0 ? (
            <div className="bg-white rounded-[20px] p-10 text-center text-[#8793AC] font-bold border border-[#E9EDF5]">
              No lessons found{search ? ` for "${search}"` : ""}.
            </div>
          ) : gradeGroups.map((grp: any) => (
            <div key={grp.grade} className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedGrade(expandedGrade === grp.grade ? null : grp.grade)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-[12px] flex items-center justify-center text-indigo-600 font-black text-[14px]">
                    {grp.grade}
                  </div>
                  <div className="text-left">
                    <h3 className="text-[17px] font-black text-[#1E2B5A]">{grp.label}</h3>
                    <p className="text-[12px] font-bold text-[#8793AC]">{grp.lessons.length} lesson{grp.lessons.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                {expandedGrade === grp.grade ? <ChevronUp size={20} className="text-[#8793AC]" /> : <ChevronDown size={20} className="text-[#8793AC]" />}
              </button>

              {expandedGrade === grp.grade && (
                <div className="border-t border-[#F5F7FB]">
                  {grp.lessons.map((lesson: any, i: number) => (
                    <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-[#F5F7FB] last:border-b-0 hover:bg-[#F8FAFD] transition-colors">
                      <div className="flex items-center gap-4">
                        <BookOpen size={18} className="text-indigo-400" />
                        <div>
                          <p className="text-[15px] font-black text-[#1E2B5A]">{lesson.title}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[11px] font-bold text-[#8793AC]">{lesson.duration || "12 min"}</span>
                            {lesson.level && <span className="text-[11px] font-bold text-[#8793AC]">{lesson.level}</span>}
                            {lesson.slug && <span className="text-[11px] font-bold text-indigo-400 font-mono">{lesson.slug}</span>}
                          </div>
                        </div>
                      </div>
                      {lesson.slug && (
                        <a href={`/lessons/${lesson.slug}`} target="_blank" rel="noopener"
                          className="flex items-center gap-1.5 text-[12px] font-black text-indigo-600 hover:underline">
                          <ExternalLink size={14} /> Preview
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
