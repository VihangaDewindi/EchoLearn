"use client";

import React from 'react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';
import TeacherFooter from '@/components/Teacher/TeacherFooter';
import { ChartBar, BookOpen, UserCheck, BarChart3 } from 'lucide-react';

const API = "http://localhost:5001";

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function TeacherDashboard() {
  const [user, setUser] = React.useState<any>(null);
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/teacher/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const firstName = user?.fullName?.split(" ")[0] || "Teacher";
  const students = data?.students || [];

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col font-sans">
      <TeacherNavbar />

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full text-left">
        <div className="flex items-center justify-between mb-8 mt-4">
          <div>
            <h1 className="text-[32px] font-black text-[#1E273F] tracking-tight">Welcome back, {firstName}!</h1>
            <p className="text-[#8793AC] font-semibold mt-1">Here's a snapshot of your classes today.</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-bold text-[#8793AC]">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            <button className="bg-[#33478D] text-white text-[14px] px-6 py-2.5 rounded-xl font-black shadow-lg shadow-blue-900/10 hover:bg-[#2A3B7A] transition-all">New Lesson</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-[24px] p-8 flex items-center gap-6 shadow-sm border border-[#E5E9F0]">
            <div className="w-14 h-14 bg-[#F0F2FA] rounded-2xl flex items-center justify-center">
              <ChartBar className="text-[#33478D]" size={28} />
            </div>
            <div>
              <p className="text-[11px] font-black text-[#8793AC] uppercase tracking-wider mb-1">Class average score</p>
              <div className="flex items-center gap-2">
                <p className="text-[28px] font-black text-[#1E273F]">{loading ? "—" : `${data?.avgQuizScore ?? 84}%`}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[24px] p-8 flex items-center gap-6 shadow-sm border border-[#E5E9F0]">
            <div className="w-14 h-14 bg-[#F5F3FF] rounded-2xl flex items-center justify-center">
              <BookOpen className="text-[#8B5CF6]" size={28} />
            </div>
            <div>
              <p className="text-[11px] font-black text-[#8793AC] uppercase tracking-wider mb-1">Total Students</p>
              <p className="text-[28px] font-black text-[#1E273F]">{loading ? "—" : data?.totalStudents ?? 0}</p>
            </div>
          </div>
          <div className="bg-white rounded-[24px] p-8 flex items-center gap-6 shadow-sm border border-[#E5E9F0]">
            <div className="w-14 h-14 bg-[#FFFBEB] rounded-2xl flex items-center justify-center">
              <UserCheck className="text-[#D97706]" size={28} />
            </div>
            <div>
              <p className="text-[11px] font-black text-[#8793AC] uppercase tracking-wider mb-1">Students needing support</p>
              <p className="text-[28px] font-black text-[#1E273F]">{loading ? "—" : data?.studentsNeedingSupport ?? 0}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-[#E5E9F0] mb-10">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E5E9F0]">
                <th className="p-6 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Student Name</th>
                <th className="p-6 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Level</th>
                <th className="p-6 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Last Active</th>
                <th className="p-6 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Progress %</th>
                <th className="p-6 text-[12px] font-black text-[#8793AC] uppercase tracking-wider">Avg. Quiz Score</th>
                <th className="p-6 text-[12px] font-black text-[#8793AC] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F7FB]">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-[#8793AC] font-bold">Loading students...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-[#8793AC] font-bold">No students enrolled yet. Add students to your classes.</td></tr>
              ) : students.map((s: any, idx: number) => (
                <tr key={idx} className="hover:bg-[#F8FAFD] transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#33478D] flex items-center justify-center text-white text-[14px] font-black">
                        {s.fullName.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-[15px] font-black text-[#1E273F]">{s.fullName}</p>
                        {s.status === 'struggling' && <p className="text-[11px] font-bold text-orange-500 mt-1 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                          Needs Support
                        </p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-[14px] font-bold text-[#5E6D8F]">LVL {s.level}</td>
                  <td className="p-6 text-[14px] font-bold text-[#5E6D8F]">{timeAgo(s.lastActive)}</td>
                  <td className="p-6 text-[14px]">
                    <div className="w-32 h-2 bg-[#F0F2F5] rounded-full overflow-hidden">
                      <div className="h-full bg-[#33478D] transition-all duration-700 shadow-sm" style={{ width: `${s.progress}%` }}></div>
                    </div>
                    <span className="text-[11px] font-black text-[#8793AC] mt-1 block">{s.progress}%</span>
                  </td>
                  <td className="p-6 text-[15px] font-black text-[#1E273F]">{s.quizAvg}%</td>
                  <td className="p-6 text-right">
                    <button className="text-[13px] font-black text-[#33478D] hover:underline uppercase tracking-wider">View Full Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-6 bg-[#F5F7FB] border-t border-[#D5DCEB] text-[12px] font-black text-[#8793AC] uppercase tracking-wider">
            Showing {students.length} of {data?.totalStudents ?? students.length} students
          </div>
        </div>

        {/* Bottom cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-[24px] p-8 shadow-sm border border-[#E5E9F0]">
            <h3 className="text-[16px] font-black text-[#1E273F] mb-6">Class Engagement Trend</h3>
            <div className="flex items-end gap-2 h-32 px-2">
              {[40, 50, 60, 55, 65, 70, 80].map((h, i) => (
                <div key={i} className={`flex-1 rounded-t-xl transition-all ${i === 6 ? 'bg-[#33478D]' : 'bg-[#F0F2F5] hover:bg-[#33478D]'}`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[11px] font-black text-[#8793AC] uppercase tracking-[0.2em] px-2">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <span key={d}>{d}</span>)}
            </div>
          </div>
          <div className="bg-[#1E2B5A] text-white rounded-[24px] p-8 shadow-xl relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-8 opacity-10"><BarChart3 size={120} /></div>
            <span className="w-fit uppercase text-[10px] font-black bg-white/10 px-3 py-1 rounded-md tracking-widest border border-white/20">Proactive Insight</span>
            <h3 className="text-[24px] font-black mt-4 leading-tight">Identify struggling students early with EchoLearn AI.</h3>
            <p className="mt-3 text-[14px] text-white/70 font-medium leading-relaxed">
              {data?.studentsNeedingSupport > 0
                ? `${data.studentsNeedingSupport} student${data.studentsNeedingSupport > 1 ? 's are' : ' is'} scoring below 60%. Consider scheduling a review session.`
                : "All students are on track! Keep up the great teaching."}
            </p>
            <div className="mt-8 flex gap-4">
              <button className="bg-white text-[#1E2B5A] px-6 py-3 rounded-xl font-black text-[14px] hover:scale-105 transition-all">Schedule Review</button>
              <button className="bg-white/10 text-white px-6 py-3 rounded-xl font-black text-[14px] border border-white/20 hover:bg-white/20 transition-all">Dismiss</button>
            </div>
          </div>
        </div>
      </main>

      <TeacherFooter />
    </div>
  );
}
