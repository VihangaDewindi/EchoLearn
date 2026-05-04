"use client";

import { useState, useEffect } from "react";
import TeacherNavbar from "@/components/Teacher/TeacherNavbar";
import TeacherFooter from "@/components/Teacher/TeacherFooter";
import { Plus, Users, LayoutGrid, ChevronDown } from "lucide-react";

const API = "http://localhost:5001";

export default function TeacherClassesPage() {
  const [activeTab, setActiveTab] = useState("All Classes");
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/teacher/classes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { setClasses(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = classes.filter((c) => {
    if (activeTab === "All Classes" || activeTab.startsWith("All Classes (")) return true;
    if (activeTab === "Active") return !c.isArchived;
    if (activeTab === "Archived") return c.isArchived;
    return true;
  });

  const totalStudents = classes.reduce((a, c) => a + c.studentCount, 0);
  const avgProgress = classes.length > 0
    ? Math.round(classes.reduce((a, c) => a + c.progress, 0) / classes.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col font-sans">
      <TeacherNavbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-8 md:p-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] font-bold text-[#8793AC] mb-6">
          <span>Dashboard</span>
          <span className="text-[#A0A9C0]">{">"}</span>
          <span className="text-[#33478D]">Classes</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-[36px] font-black text-[#1E273F] tracking-tight">My Classes</h1>
            <p className="text-[#8793AC] font-semibold mt-1">Manage your active teaching sections and monitor student progress.</p>
          </div>
          <button className="bg-[#33478D] text-white px-8 py-3.5 rounded-xl font-black text-[15px] flex items-center gap-3 shadow-lg shadow-blue-900/10 hover:bg-[#2A3B7A] hover:-translate-y-0.5 transition-all">
            <Plus size={20} strokeWidth={3} />
            Add New Class
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-8 border-b border-[#E5E9F0]">
          <div className="flex items-center gap-10">
            {[`All Classes (${classes.length})`, "Active", "Archived"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[15px] font-black transition-all relative ${
                  activeTab === tab || (tab.startsWith("All Classes") && activeTab.startsWith("All Classes"))
                    ? "text-[#33478D]"
                    : "text-[#8793AC] hover:text-[#1E273F]"
                }`}
              >
                {tab}
                {(activeTab === tab || (tab.startsWith("All Classes") && activeTab.startsWith("All Classes"))) && (
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#33478D] rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[12px] font-black uppercase tracking-wider text-[#8793AC] pb-4">
             SORT BY:
             <button className="flex items-center gap-1 text-[#1E273F]">
                Recently Accessed <ChevronDown size={14} strokeWidth={3} />
             </button>
          </div>
        </div>

        {/* Class Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {loading ? (
            <div className="col-span-4 p-10 text-center text-[#8793AC] font-bold">Loading classes...</div>
          ) : filtered.map((cls: any) => (
            <div key={cls._id} className="bg-white rounded-[24px] border border-[#E5E9F0] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className="h-[180px] relative overflow-hidden">
                {cls.image ? (
                  <img
                    src={cls.image}
                    alt={cls.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1E2B5A] flex items-center justify-center text-white/30 text-[48px] font-black">
                    {cls.subject[0]}
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md">
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#33478D]">{cls.session}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-[20px] font-black text-[#1E273F] mb-4 group-hover:text-[#33478D] transition-colors">{cls.name}</h3>

                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2 text-[#5E6D8F] font-bold text-[14px]">
                      <Users size={16} strokeWidth={2.5} />
                      {cls.studentCount} Students
                   </div>
                   <div className="text-[#33478D] font-black text-[14px]">
                      {cls.progress}% Progress
                   </div>
                </div>

                <div className="h-2 w-full bg-[#F0F2F5] rounded-full overflow-hidden mb-6">
                   <div
                      className="h-full bg-[#33478D] transition-all duration-700"
                      style={{ width: `${cls.progress}%` }}
                   ></div>
                </div>

                <div className="flex flex-col gap-2">
                   <button className="w-full py-3 bg-[#F5F7FB] text-[#33478D] rounded-xl font-black text-[14px] flex items-center justify-center gap-2 hover:bg-[#EAEFF7] transition-all">
                      <LayoutGrid size={16} strokeWidth={2.5} />
                      View Roster
                   </button>
                   <button className="w-full py-2 text-[#8793AC] hover:text-[#33478D] font-bold text-[13px] transition-colors">
                      Open Class Dashboard
                   </button>
                </div>
              </div>
            </div>
          ))}

          {/* Create New Class Placeholder */}
          <div className="border-2 border-dashed border-[#D5DCEB] rounded-[24px] p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#33478D] transition-all bg-white/50">
             <div className="w-14 h-14 bg-[#F5F7FB] rounded-full flex items-center justify-center text-[#8793AC] group-hover:bg-[#33478D] group-hover:text-white transition-all mb-4">
                <Plus size={28} strokeWidth={3} />
             </div>
             <h3 className="text-[18px] font-black text-[#1E273F]">Create New Class</h3>
             <p className="text-[#8793AC] text-[13px] font-medium mt-2 max-w-[180px]">Set up a new section, add students, and assign curriculum.</p>
          </div>
        </div>

        {/* Global Summary Stats */}
        <div className="bg-[#1F3F7F] border border-[#142952] rounded-[24px] p-8 shadow-xl shadow-blue-900/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               <div className="flex flex-col items-center border-r border-white/10 last:border-0">
                  <span className="text-[32px] font-black text-white">{classes.length}</span>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60 mt-1">Total Classes</span>
               </div>
               <div className="flex flex-col items-center border-r border-white/10 last:border-0 text-center">
                  <span className="text-[32px] font-black text-white">{totalStudents}</span>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60 mt-1">Total Students</span>
               </div>
               <div className="flex flex-col items-center border-r border-white/10 last:border-0">
                  <span className="text-[32px] font-black text-white">{avgProgress}%</span>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60 mt-1">Overall Progress</span>
               </div>
               <div className="flex flex-col items-center">
                  <span className="text-[32px] font-black text-white">{classes.filter((c) => !c.isArchived).length}</span>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60 mt-1">Active Classes</span>
               </div>
            </div>
        </div>

      </main>

      <TeacherFooter />
    </div>
  );
}
