"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ParentNavbar from '@/components/Parent/ParentNavbar';
import {
    Clock,
    CheckCircle,
    BarChart,
    Award,
    BookOpen,
    MessageCircle,
    Layout
} from 'lucide-react';

const API = "http://localhost:5001";

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

const ACTIVITY_ICONS: Record<string, { icon: React.ElementType; iconColor: string; bg: string }> = {
  badge_earned: { icon: Award, iconColor: "text-orange-500", bg: "bg-orange-50" },
  quiz_completed: { icon: CheckCircle, iconColor: "text-blue-500", bg: "bg-blue-50" },
  lesson_completed: { icon: CheckCircle, iconColor: "text-purple-500", bg: "bg-purple-50" },
  lesson_started: { icon: BookOpen, iconColor: "text-purple-500", bg: "bg-purple-50" },
  login: { icon: Layout, iconColor: "text-slate-500", bg: "bg-slate-50" },
  streak: { icon: Award, iconColor: "text-orange-500", bg: "bg-orange-50" },
};

export default function ParentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/parent/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const student = data?.student;
  const stats = data?.stats || { learningTimeHrs: "4.5", lessonsCompleted: 12, avgQuizScore: 88 };
  const subjects = data?.subjects || [
    { name: "Mathematics", progress: 0, color: "bg-[#33478D]" },
    { name: "Science", progress: 0, color: "bg-[#5AAF7B]" },
    { name: "English", progress: 0, color: "bg-[#E5A644]" },
  ];
  const weeklyGoal = data?.weeklyGoal || { completed: 0, total: 5 };
  const activity = data?.activity || [];

  const statCards = [
    { label: "Learning Time", value: `${stats.learningTimeHrs} hrs`, change: "+12%", icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Lessons Completed", value: String(stats.lessonsCompleted), change: "+5%", icon: CheckCircle, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Avg. Quiz Score", value: `${stats.avgQuizScore}%`, change: "+2%", icon: BarChart, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col font-sans text-left">
      <ParentNavbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-8 md:p-12">

        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-[32px] font-black text-[#1E273F] tracking-tight">
             Welcome Back, {user?.fullName?.split(' ')[0] || "Parent"}! 👋
          </h1>
          <p className="text-[#8793AC] font-semibold mt-1">
            Here's an overview of {student?.fullName || "your child"}'s progress and your recent updates.
          </p>
        </div>

        {/* Child Profile Header + Weekly Goal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
           <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-[#E5E9F0] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-6">
                 <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden border-4 border-[#F5F7FB]">
                    <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200" alt="Child" className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <div className="flex items-center gap-3">
                       <h1 className="text-[32px] font-black text-[#1E273F]">{loading ? "Loading..." : (student?.fullName || "Your Child")}</h1>
                       <span className="bg-[#1E273F] text-white text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">LVL {student?.level ?? 1}</span>
                    </div>
                    <p className="text-[#8793AC] font-bold mt-1">{student?.email || "Student"}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <Award size={16} className="text-[#E5A644]" fill="#E5A644" />
                       <span className="text-[14px] font-black text-[#33478D]">{student?.xp ?? 0} pts</span>
                    </div>
                 </div>
              </div>
              <button className="bg-[#F5F7FB] text-[#33478D] px-6 py-3 rounded-xl font-black text-[14px] hover:bg-[#EAEFF7] transition-all">
                 Edit Profile
              </button>
           </div>

           <div className="bg-[#1E2B5A] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/20">
              <div className="absolute top-0 right-0 p-8 opacity-20">
                 <Layout size={80} />
              </div>
              <div className="flex items-center justify-between mb-4">
                 <span className="text-[11px] font-black uppercase tracking-widest text-white/60">Weekly Goal</span>
                 <CheckCircle size={20} className="text-white/40" />
              </div>
              <h3 className="text-[24px] font-black">{weeklyGoal.completed}/{weeklyGoal.total} Lessons completed</h3>
              <div className="h-2 w-full bg-white/10 rounded-full mt-4 overflow-hidden">
                 <div
                   className="h-full bg-white rounded-full transition-all duration-700"
                   style={{ width: `${Math.round((weeklyGoal.completed / weeklyGoal.total) * 100)}%` }}
                 ></div>
              </div>
              <p className="text-[13px] font-medium text-white/70 mt-4 italic">
                {weeklyGoal.completed >= weeklyGoal.total
                  ? "Goal achieved! 🎉"
                  : `${weeklyGoal.total - weeklyGoal.completed} more to hit the target.`}
              </p>
           </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
           {statCards.map((stat) => (
             <div key={stat.label} className="bg-white rounded-[28px] p-8 border border-[#E5E9F0] shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                <div className="flex items-center gap-6">
                   <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                      <stat.icon size={28} strokeWidth={2.5} />
                   </div>
                   <div>
                      <p className="text-[13px] font-black text-[#8793AC] uppercase tracking-wider">{stat.label}</p>
                      <h4 className="text-[28px] font-black text-[#1E273F] mt-1">{loading ? "—" : stat.value}</h4>
                   </div>
                </div>
                <div className="flex items-center gap-1 text-[13px] font-black text-green-500">
                   <span className="text-[16px] leading-none mb-1">↑</span> {stat.change}
                </div>
             </div>
           ))}
        </div>

        {/* Main Content Area: Subject Progress + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

           {/* Subject Progress */}
           <div className="lg:col-span-3 bg-white rounded-[32px] p-8 border border-[#E5E9F0] shadow-sm">
              <div className="flex items-center justify-between mb-10">
                 <h2 className="text-[20px] font-black text-[#1E273F]">Subject Progress</h2>
                 <button className="text-[13px] font-black text-[#33478D] hover:underline">View All Curriculum</button>
              </div>

              <div className="space-y-10">
                 {subjects.map((sub: any) => (
                   <div key={sub.name}>
                      <div className="flex justify-between items-center mb-4">
                         <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gray-50 rounded-lg">
                               <Layout size={18} className="text-[#33478D]" />
                            </div>
                            <h4 className="text-[16px] font-black text-[#1E273F]">{sub.name}</h4>
                         </div>
                         <span className="text-[16px] font-black text-[#1E273F]">{sub.progress}%</span>
                      </div>
                      <div className="h-3 w-full bg-[#F0F2F5] rounded-full overflow-hidden mb-3">
                         <div className={`h-full ${sub.color} rounded-full transition-all duration-700`} style={{ width: `${sub.progress}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Recent Activity */}
           <div className="lg:col-span-2 bg-white rounded-[32px] border border-[#E5E9F0] shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-[#F5F7FB]">
                 <h2 className="text-[20px] font-black text-[#1E273F]">Recent Activity</h2>
              </div>
              <div className="flex-1 p-8 space-y-8">
                 {loading ? (
                   <p className="text-[#8793AC] font-bold text-center">Loading activity...</p>
                 ) : activity.length === 0 ? (
                   <p className="text-[#8793AC] font-bold text-center">No activity yet.</p>
                 ) : activity.map((item: any, idx: number) => {
                   const cfg = ACTIVITY_ICONS[item.type] || ACTIVITY_ICONS.login;
                   const ItemIcon = cfg.icon;
                   return (
                     <div key={idx} className="flex gap-4 relative">
                        {idx !== activity.length - 1 && (
                          <div className="absolute left-[20px] top-[40px] bottom-[-32px] w-0.5 bg-[#F5F7FB]"></div>
                        )}
                        <div className={`w-10 h-10 ${cfg.bg} ${cfg.iconColor} rounded-xl flex items-center justify-center z-10 shrink-0`}>
                           <ItemIcon size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                           <p className="text-[15px] font-black text-[#1E273F]">{item.title}</p>
                           <p className="text-[12px] font-bold text-[#8793AC] mt-1 uppercase tracking-wider">{timeAgo(item.time)}</p>
                        </div>
                     </div>
                   );
                 })}
              </div>
              <button className="w-full py-6 text-[12px] font-black text-[#8793AC] hover:text-[#33478D] bg-gray-50/50 uppercase tracking-[0.2em] transition-all">
                 View Full Activity Log
              </button>
           </div>

        </div>

        {/* Fixed Float Button */}
        <button className="fixed bottom-10 right-10 flex items-center gap-3 bg-white border border-[#E5E9F0] px-6 py-4 rounded-[20px] shadow-2xl hover:-translate-y-1 transition-all z-40 group">
           <div className="w-10 h-10 bg-[#33478D] text-white rounded-xl flex items-center justify-center">
              <MessageCircle size={20} />
           </div>
           <span className="text-[15px] font-black text-[#33478D]">Contact Teacher</span>
        </button>

      </main>

      {/* Footer */}
      <footer className="w-full bg-[#F8FAFD] border-t border-[#E5E9F0] py-12 px-8 flex flex-col items-center gap-10">
         <div className="flex flex-wrap items-center justify-center gap-10">
            <Link href="/" className="flex items-center gap-3 pr-4 border-r border-[#D5DCEB]">
               <Layout size={24} className="text-[#33478D]" />
               <span className="text-[20px] font-black text-[#1E273F] tracking-tight">EchoLearn</span>
            </Link>
            {['Accessibility Center', 'Privacy Policy', 'Terms of Service', 'Support'].map((link) => (
               <Link key={link} href="#" className="text-[14px] font-bold text-[#8793AC] hover:text-[#33478D] transition-colors">{link}</Link>
            ))}
         </div>
         <p className="text-[13px] font-medium text-[#A0A9C0]">© 2024 EchoLearn Education. Empowering kids daily.</p>
      </footer>
    </div>
  );
}
