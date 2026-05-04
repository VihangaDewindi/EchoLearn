"use client";

import React, { useState, useEffect } from 'react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';
import TeacherFooter from '@/components/Teacher/TeacherFooter';
import {
    Filter,
    Search,
    MessageSquare,
    Eye,
    AlertTriangle,
    TrendingDown,
    Users,
    ArrowUpRight
} from 'lucide-react';

const API = "http://localhost:5001";

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return "Active now";
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export default function StudentManagementPage() {
  const [activeTab, setActiveTab] = useState('All Students');
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/teacher/students`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { setStudents(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) => {
    const matchesTab =
      activeTab === 'All Students' ||
      (activeTab === 'Struggling' && s.status === 'struggling') ||
      (activeTab === 'Excelling' && s.status === 'excelling');
    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const struggling = students.filter((s) => s.status === 'struggling').length;
  const excelling = students.filter((s) => s.status === 'excelling').length;

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col font-sans">
      <TeacherNavbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-8 md:p-12">

        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-[36px] font-black text-[#1E273F] tracking-tight">Student Management</h1>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-[#8793AC] font-bold">Total:</span>
                <span className="text-[14px] font-black text-[#33478D]">{students.length} Students</span>
            </div>
          </div>
          <button className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl border border-[#E5E9F0] shadow-sm text-[14px] font-black text-[#1E273F] hover:bg-gray-50 transition-all">
            <Filter size={18} strokeWidth={2.5} />
            Filters
          </button>
        </div>

        {/* Weekly Performance Insights */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-[#33478D]" />
             </div>
             <h2 className="text-[18px] font-black text-[#1E273F]">Weekly Performance Review</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-[#FFF9EA] border border-[#F9E6B5] rounded-[24px] p-6 flex items-start gap-5 relative group overflow-hidden">
                <div className="w-12 h-12 bg-[#F9E6B5] rounded-xl flex items-center justify-center shrink-0">
                   <AlertTriangle className="text-[#8E6A00]" size={24} />
                </div>
                <div className="z-10">
                   <h3 className="text-[16px] font-black text-[#8E6A00]">Low Engagement Alert</h3>
                   <p className="text-[13px] font-medium text-[#8E6A00]/80 mt-2 leading-relaxed">
                      {struggling > 0 ? `${struggling} student${struggling > 1 ? 's' : ''} showing decreased performance this week.` : 'No low engagement issues this week.'}
                   </p>
                   <button className="mt-4 text-[13px] font-black text-[#8E6A00] underline underline-offset-4 flex items-center gap-1">
                      View Students <ArrowUpRight size={14} />
                   </button>
                </div>
             </div>

             <div className="bg-[#FFF1F1] border border-[#FBD5D5] rounded-[24px] p-6 flex items-start gap-5 relative group overflow-hidden">
                <div className="w-12 h-12 bg-[#FBD5D5] rounded-xl flex items-center justify-center shrink-0">
                   <TrendingDown className="text-[#C81E1E]" size={24} />
                </div>
                <div className="z-10">
                   <h3 className="text-[16px] font-black text-[#C81E1E]">Students At Risk</h3>
                   <p className="text-[13px] font-medium text-[#C81E1E]/80 mt-2 leading-relaxed">
                      {struggling} student{struggling !== 1 ? 's' : ''} scoring below 60% across subjects.
                   </p>
                   <button className="mt-4 text-[13px] font-black text-[#C81E1E] underline underline-offset-4 flex items-center gap-1">
                      Adjust Curriculum <ArrowUpRight size={14} />
                   </button>
                </div>
             </div>

             <div className="bg-[#F3FAF7] border border-[#DEF7EC] rounded-[24px] p-6 flex items-start gap-5 relative group overflow-hidden">
                <div className="w-12 h-12 bg-[#DEF7EC] rounded-xl flex items-center justify-center shrink-0">
                   <Users className="text-[#03543F]" size={24} />
                </div>
                <div className="z-10">
                   <h3 className="text-[16px] font-black text-[#03543F]">Top Performers</h3>
                   <p className="text-[13px] font-medium text-[#03543F]/80 mt-2 leading-relaxed">
                      {excelling} student{excelling !== 1 ? 's are' : ' is'} excelling and ready for advanced content.
                   </p>
                   <button className="mt-4 text-[13px] font-black text-[#03543F] underline underline-offset-4 flex items-center gap-1">
                      Assign Groups <ArrowUpRight size={14} />
                   </button>
                </div>
             </div>
          </div>
        </section>

        {/* Filters & Tabs Section */}
        <div className="flex items-center justify-between mb-8 bg-white p-2 rounded-[20px] border border-[#E5E9F0] shadow-sm">
          <div className="flex items-center gap-2">
            {['All Students', 'Struggling', 'Excelling'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-[14px] font-black transition-all ${
                  activeTab === tab
                    ? "bg-[#F5F7FB] text-[#33478D] shadow-inner"
                    : "text-[#8793AC] hover:text-[#1E273F]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-[#F5F7FB] px-5 py-3 rounded-xl w-80 mr-2">
            <Search size={18} className="text-[#A0A9C0]" />
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="bg-transparent text-[14px] font-bold text-[#1E273F] focus:outline-none placeholder-[#A0A9C0] w-full"
            />
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-[28px] border border-[#E5E9F0] overflow-hidden shadow-[0_4px_24px_rgba(30,39,63,0.03)]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E5E9F0] bg-gray-50/50">
                <th className="p-6 text-[12px] font-black text-[#8793AC] uppercase tracking-widest pl-10">Student Name</th>
                <th className="p-6 text-[12px] font-black text-[#8793AC] uppercase tracking-widest text-center">Status</th>
                <th className="p-6 text-[12px] font-black text-[#8793AC] uppercase tracking-widest">Last Active</th>
                <th className="p-6 text-[12px] font-black text-[#8793AC] uppercase tracking-widest">Curriculum Progress</th>
                <th className="p-6 text-[12px] font-black text-[#8793AC] uppercase tracking-widest text-center">Quiz Avg</th>
                <th className="p-6 text-[12px] font-black text-[#8793AC] uppercase tracking-widest text-right pr-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F7FB]">
              {loading ? (
                <tr><td colSpan={6} className="p-10 text-center text-[#8793AC] font-bold">Loading students...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-10 text-center text-[#8793AC] font-bold">No students found. Add students to your classes.</td></tr>
              ) : filtered.map((student: any, idx: number) => (
                <tr key={idx} className="group hover:bg-[#F8FAFD] transition-colors">
                  <td className="p-6 pl-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-[15px] font-black shadow-sm group-hover:scale-105 transition-transform ${
                          student.status === 'excelling' ? 'bg-[#5AAF7B]' :
                          student.status === 'struggling' ? 'bg-[#E85A4F]' : 'bg-[#33478D]'
                      }`}>
                         {student.fullName.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-[16px] font-black text-[#1E273F]">{student.fullName}</p>
                        <p className="text-[13px] font-bold text-[#8793AC] mt-0.5">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center">
                        <span className={`px-4 py-1.5 rounded-full text-[13px] font-black flex items-center gap-2 capitalize ${
                            student.status === 'excelling' ? 'bg-[#F3FAF7] text-[#03543F]' :
                            student.status === 'struggling' ? 'bg-[#FFF1F1] text-[#C81E1E]' : 'bg-[#F0F2FA] text-[#33478D]'
                        }`}>
                            {student.status}
                        </span>
                    </div>
                  </td>
                  <td className="p-6 text-[14px] font-bold text-[#5E6D8F]">
                    {timeAgo(student.lastActive)}
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[11px] font-black text-[#8793AC]">
                            <span>{student.progress.avg}%</span>
                        </div>
                        <div className="w-32 h-[6px] bg-[#F0F2F5] rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-700 ${
                                    student.progress.avg > 80 ? 'bg-[#5AAF7B]' :
                                    student.progress.avg < 50 ? 'bg-[#E85A4F]' : 'bg-[#33478D]'
                                }`}
                                style={{ width: `${student.progress.avg}%` }}
                            ></div>
                        </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="text-[16px] font-black text-[#1E273F] text-center">{student.progress.avg}%</p>
                  </td>
                  <td className="p-6 text-right pr-10">
                    <div className="flex items-center justify-end gap-3">
                        <button className="p-2.5 rounded-xl bg-[#F5F7FB] text-[#33478D] hover:bg-[#33478D] hover:text-white transition-all shadow-sm">
                            <MessageSquare size={18} strokeWidth={2.5} />
                        </button>
                        <button className="p-2.5 rounded-xl bg-[#F5F7FB] text-[#8793AC] hover:bg-[#1E273F] hover:text-white transition-all shadow-sm">
                            <Eye size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-8 bg-gray-50/50 flex items-center justify-between border-t border-[#E5E9F0]">
             <span className="text-[13px] font-black text-[#8793AC] uppercase tracking-widest">Showing {filtered.length} of {students.length} students</span>
          </div>
        </div>
      </main>

      <TeacherFooter />
    </div>
  );
}
