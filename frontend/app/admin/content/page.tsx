"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { BookOpen, Clock3, BarChart3, ExternalLink } from "lucide-react";

export default function AdminContent() {
  const router = useRouter();
  const [admin, setAdmin]     = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken]     = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

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
    fetch("http://localhost:5001/api/admin/lessons", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setLessons(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setLessons([]); setLoading(false); });
  }, [token]);

  if (!admin) return null;

  const subjects = ["all", ...Array.from(new Set(lessons.map(l => l.subject).filter(Boolean)))];
  const filtered = subjectFilter === "all" ? lessons : lessons.filter(l => l.subject === subjectFilter);

  const subjectColor: Record<string, string> = {
    mathematics: "bg-blue-100 text-blue-700",
    science:     "bg-emerald-100 text-emerald-700",
    english:     "bg-purple-100 text-purple-700",
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AdminNavbar adminName={admin.fullName} />

      <main className="ml-64 flex-1 p-10">
        <div className="mb-8">
          <h1 className="text-[32px] font-black text-[#1E2B5A]">Content Management</h1>
          <p className="text-[#8793AC] font-bold mt-1">All lessons available on the platform</p>
        </div>

        {/* Subject filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setSubjectFilter(s)}
              className={`px-4 py-2 rounded-[10px] text-[13px] font-black capitalize transition ${
                subjectFilter === s ? "bg-[#1E2B5A] text-white" : "bg-white border border-[#E9EDF5] text-[#8793AC] hover:border-[#1E2B5A] hover:text-[#1E2B5A]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-[20px] h-40 animate-pulse border border-[#E9EDF5]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-[20px] p-12 text-center border border-[#E9EDF5] text-[#8793AC] font-bold">
            No lessons found for this subject.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {filtered.map((lesson: any) => (
              <div key={lesson._id || lesson.slug} className="bg-white rounded-[20px] p-6 border border-[#E9EDF5] shadow-sm hover:shadow-md transition flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 bg-[#F0F4FF] rounded-[12px] flex items-center justify-center">
                    <BookOpen size={20} className="text-[#1E2B5A]" />
                  </div>
                  <button
                    onClick={() => router.push(`/lessons/${lesson.slug || lesson._id}`)}
                    className="p-2 rounded-[8px] text-[#8793AC] hover:bg-[#F0F4FF] hover:text-[#1E2B5A] transition"
                    title="Preview lesson"
                  >
                    <ExternalLink size={15} />
                  </button>
                </div>

                <div>
                  <span className={`text-[11px] font-black uppercase tracking-wider px-2 py-1 rounded-[6px] ${subjectColor[lesson.subject?.toLowerCase()] || "bg-gray-100 text-gray-600"}`}>
                    {lesson.subject || "General"}
                  </span>
                  <h3 className="text-[16px] font-black text-[#1E2B5A] mt-3 leading-snug">{lesson.title}</h3>
                </div>

                <div className="flex items-center gap-4 text-[12px] font-bold text-[#8793AC] mt-auto">
                  <span className="flex items-center gap-1"><Clock3 size={13} /> {lesson.duration || "—"}</span>
                  <span className="flex items-center gap-1"><BarChart3 size={13} /> {lesson.level || "Beginner"}</span>
                </div>

                <div className="w-full h-1.5 bg-[#F0F4FF] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1E2B5A] rounded-full" style={{ width: `${lesson.progress || 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <p className="mt-6 text-[12px] font-bold text-[#8793AC]">{filtered.length} lesson{filtered.length !== 1 ? "s" : ""} shown</p>
        )}
      </main>
    </div>
  );
}
