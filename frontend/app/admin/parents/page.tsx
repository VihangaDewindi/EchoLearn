"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { Search, Star, ChevronDown, ChevronUp, UserCheck } from "lucide-react";

type ChildStudent = {
  _id: string;
  fullName: string;
  email: string;
  xp: number;
  level: number;
};

type Parent = {
  _id: string;
  fullName: string;
  email: string;
  lastActive: string;
  createdAt: string;
  children: ChildStudent[];
};

export default function AdminParents() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [parents, setParents] = useState<Parent[]>([]);
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

    fetch(`http://localhost:5001/api/admin/parents?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setParents(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setParents([]); setLoading(false); });
  }, [token, search]);

  if (!admin) return null;

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AdminNavbar adminName={admin.fullName} />

      <main className="ml-64 flex-1 p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-black text-[#1E2B5A]">Parents</h1>
            <p className="text-[#8793AC] font-bold mt-1">
              {loading ? "Loading..." : `${parents.length} parent${parents.length !== 1 ? "s" : ""} registered`}
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
          ) : parents.length === 0 ? (
            <div className="bg-white rounded-[20px] border border-[#E9EDF5] p-12 text-center text-[#8793AC] font-bold">
              No parents found.
            </div>
          ) : (
            parents.map(p => {
              const isOpen = expanded[p._id];
              return (
                <div key={p._id} className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggle(p._id)}
                    className="w-full flex items-center gap-4 px-6 py-5 hover:bg-[#F8FAFF] transition text-left"
                  >
                    <div className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-base flex-shrink-0">
                      {p.fullName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-[#1E2B5A] text-[15px] leading-none">{p.fullName}</p>
                      <p className="text-[12px] text-[#8793AC] mt-1">{p.email}</p>
                    </div>
                    <div className="flex items-center gap-6 text-[13px] font-bold text-[#8793AC] flex-shrink-0">
                      <div className="flex items-center gap-1.5">
                        <UserCheck size={14} />
                        {p.children.length} linked child{p.children.length !== 1 ? "ren" : ""}
                      </div>
                      <span className="text-[11px]">
                        Active {p.lastActive ? new Date(p.lastActive).toLocaleDateString() : "—"}
                      </span>
                      <span className="text-[11px]">
                        Joined {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                      </span>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#E9EDF5] px-6 py-5 bg-[#F8FAFF]">
                      {p.children.length === 0 ? (
                        <p className="text-[13px] font-bold text-[#8793AC]">No linked students yet.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {p.children.map(child => (
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

        {!loading && (
          <div className="mt-4 text-[12px] font-bold text-[#8793AC]">
            {parents.length} parent{parents.length !== 1 ? "s" : ""} shown
          </div>
        )}
      </main>
    </div>
  );
}
