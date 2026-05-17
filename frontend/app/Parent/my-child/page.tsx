"use client";

import React, { useState, useEffect } from 'react';
import ParentNavbar from '@/components/Parent/ParentNavbar';
import {
    Clock,
    CheckCircle,
    BarChart,
    Award,
    BookOpen,
    ChevronRight,
    Layout,
    Star,
    Shield,
    Lock,
    Target,
    Lightbulb,
    X,
    Flame,
    Trophy,
    Zap,
    BookMarked,
    Brain,
    Minus,
    Plus
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
  quiz_completed: { icon: CheckCircle, iconColor: "text-green-500", bg: "bg-green-50" },
  lesson_completed: { icon: CheckCircle, iconColor: "text-blue-500", bg: "bg-blue-50" },
  lesson_started: { icon: BookOpen, iconColor: "text-blue-500", bg: "bg-blue-50" },
  login: { icon: Layout, iconColor: "text-slate-500", bg: "bg-slate-50" },
  streak: { icon: Award, iconColor: "text-orange-500", bg: "bg-orange-50" },
};

const BADGE_ICONS: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  "First Lesson":     { icon: BookOpen,   color: "text-blue-500",   bg: "bg-blue-50" },
  "Quiz Master":      { icon: Brain,      color: "text-purple-500", bg: "bg-purple-50" },
  "Week Warrior":     { icon: Flame,      color: "text-orange-500", bg: "bg-orange-50" },
  "Top Scorer":       { icon: Trophy,     color: "text-yellow-500", bg: "bg-yellow-50" },
  "Fast Learner":     { icon: Zap,        color: "text-green-500",  bg: "bg-green-50" },
  "Bookworm":         { icon: BookMarked, color: "text-indigo-500", bg: "bg-indigo-50" },
  "Streak Legend":    { icon: Flame,      color: "text-red-500",    bg: "bg-red-50" },
  "All Star":         { icon: Star,       color: "text-amber-500",  bg: "bg-amber-50" },
};

function getBadgeIcon(name: string) {
  return BADGE_ICONS[name] || { icon: Award, color: "text-orange-500", bg: "bg-orange-50" };
}

export default function MyChildProgressPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Adjust Goal dialog
  const [goalOpen, setGoalOpen] = useState(false);
  const [goalInput, setGoalInput] = useState(5);
  const [savingGoal, setSavingGoal] = useState(false);

  // Trophy Room dialog
  const [trophyOpen, setTrophyOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/parent/my-child`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const student = data?.student;
  const stats = data?.stats || { totalPoints: 0, lessonsCompleted: 0, avgQuizScore: 0 };
  const subjects = data?.subjects || [
    { name: "Math", progress: 0, recent: "Getting started", color: "bg-[#33478D]" },
    { name: "Science", progress: 0, recent: "Getting started", color: "bg-[#5AAF7B]" },
    { name: "English", progress: 0, recent: "Getting started", color: "bg-[#E5A644]" },
  ];
  const weeklyGoal = data?.weeklyGoal || { completed: 0, total: 5 };
  const activity = data?.activity || [];
  const badges: { name: string; earnedDate?: string; icon?: string }[] =
    (student?.badges || []).map((b: any) =>
      typeof b === "string" ? { name: b } : b
    );

  const initials = student?.fullName
    ? student.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const streak = student?.streak ?? 0;

  const statCards = [
    { label: "Total Points",       value: (stats.totalPoints || 0).toLocaleString(), change: "+12%", icon: Star,      color: "text-blue-500",   bg: "bg-blue-50" },
    { label: "Lessons Completed",  value: String(stats.lessonsCompleted),             change: "+5%",  icon: BookOpen,  color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Avg. Quiz Score",    value: `${stats.avgQuizScore}%`,                   change: "+2%",  icon: BarChart,  color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const ACHIEVEMENT_PREVIEW = [
    { icon: Award,  color: 'text-orange-500', locked: badges.length < 1 },
    { icon: Shield, color: 'text-green-600',  locked: badges.length < 2 },
    { icon: Clock,  color: 'text-blue-600',   locked: badges.length < 3 },
    { icon: Lock,   color: 'text-slate-400',  locked: badges.length < 4 },
  ];

  const goalPercent = weeklyGoal.total > 0
    ? Math.min(100, Math.round((weeklyGoal.completed / weeklyGoal.total) * 100))
    : 0;
  const circumference = 502.4;
  const dashOffset = circumference * (1 - goalPercent / 100);

  const openGoalDialog = () => {
    setGoalInput(weeklyGoal.total || 5);
    setGoalOpen(true);
  };

  const saveGoal = async () => {
    setSavingGoal(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/api/parent/weekly-goal`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ total: goalInput }),
      });
      setData((prev: any) => ({
        ...prev,
        weeklyGoal: { ...prev?.weeklyGoal, total: goalInput },
      }));
    } catch {}
    setSavingGoal(false);
    setGoalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col font-sans text-left">
      <ParentNavbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-8 md:p-12">

        {/* Profile Header Block */}
        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-16 rounded-full bg-[#33478D] flex items-center justify-center shadow-inner shrink-0">
            <span className="text-white text-[22px] font-black">{initials}</span>
          </div>
          <div>
            <h1 className="text-[28px] font-black text-[#1E273F]">
              {loading ? "Loading..." : `${student?.fullName || "Your Child"}'s Progress`}
            </h1>
            <p className="text-[#8793AC] font-bold mt-1 uppercase tracking-widest text-[11px] flex items-center gap-2">
              Level {student?.level ?? 1} Student
              <span className="inline-flex items-center gap-1">
                •
                {streak > 0 ? (
                  <><Flame size={13} className="text-orange-500 inline" /> {streak} Day Streak</>
                ) : (
                  "No Streak"
                )}
              </span>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-white rounded-[24px] p-8 border border-[#E5E9F0] shadow-sm flex flex-col gap-6 group">
              <div className="flex items-center justify-between">
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                  <stat.icon size={26} strokeWidth={2.5} />
                </div>
                <div className="flex items-center gap-1 text-[13px] font-black text-green-500">
                  <span className="text-[14px]">↑</span> {stat.change} this month
                </div>
              </div>
              <div>
                <p className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider">{stat.label}</p>
                <h4 className="text-[36px] font-black text-[#1E273F] mt-1 tracking-tight">
                  {loading ? "—" : stat.value}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* Subjects & Progress Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Detailed Progress */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[32px] p-8 border border-[#E5E9F0] shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-[20px] font-black text-[#1E273F]">Subject Progress</h2>
                <button className="text-[13px] font-black text-[#33478D] hover:underline">View Details</button>
              </div>

              <div className="space-y-12">
                {subjects.map((sub: any) => (
                  <div key={sub.name}>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <Layout size={18} className="text-[#33478D]" />
                        <h4 className="text-[16px] font-black text-[#1E273F]">{sub.name}</h4>
                      </div>
                      <span className="text-[16px] font-black text-[#1E273F]">{sub.progress}%</span>
                    </div>
                    <div className="h-4 w-full bg-[#F0F2F5] rounded-full overflow-hidden mb-3">
                      <div className={`h-full ${sub.color} rounded-full transition-all duration-1000`} style={{ width: `${sub.progress}%` }}></div>
                    </div>
                    <p className="text-[11px] font-black text-[#A0A9C0] tracking-wider">
                      RECENTLY: <span className="text-[#5E6D8F]">{sub.recent}</span>
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Activity Log */}
            <section className="bg-white rounded-[32px] p-8 border border-[#E5E9F0] shadow-sm">
              <h2 className="text-[20px] font-black text-[#1E273F] mb-8">Recent Activity</h2>
              <div className="space-y-8">
                {loading ? (
                  <p className="text-[#8793AC] font-bold text-center">Loading activity...</p>
                ) : activity.length === 0 ? (
                  <p className="text-[#8793AC] font-bold text-center">No activity yet.</p>
                ) : activity.map((item: any, idx: number) => {
                  const cfg = ACTIVITY_ICONS[item.type] || ACTIVITY_ICONS.login;
                  const ItemIcon = cfg.icon;
                  return (
                    <div key={idx} className="flex gap-6 group">
                      <div className={`w-12 h-12 ${cfg.bg} ${cfg.iconColor} rounded-2xl flex items-center justify-center shrink-0`}>
                        <ItemIcon size={24} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h4 className="text-[16px] font-black text-[#1E273F]">{item.title}</h4>
                        <p className="text-[13px] font-bold text-[#8793AC] mt-1">{timeAgo(item.time)}</p>
                        {item.score != null && (
                          <div className="mt-3 bg-[#F0FAF4] text-[#2E7D32] px-3 py-1 rounded-lg text-[11px] font-black tracking-widest uppercase w-fit">
                            Score: {item.score}/100
                          </div>
                        )}
                        {item.details && (
                          <p className="text-[12px] font-bold text-[#5E6D8F] mt-2">{item.details}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Weekly Goal Circle */}
            <div className="bg-[#1E2B5A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/40 py-12 flex flex-col items-center text-center">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Target size={120} />
              </div>
              <h3 className="text-[18px] font-black mb-8">Weekly Goal</h3>

              <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="96" cy="96" r="80" className="stroke-white/10 fill-none" strokeWidth="16" />
                  <circle
                    cx="96" cy="96" r="80"
                    className="stroke-white fill-none"
                    strokeWidth="16"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-[48px] font-black leading-tight">{weeklyGoal.completed}/{weeklyGoal.total}</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Units</span>
                </div>
              </div>

              <p className="text-[14px] font-medium text-white/70 max-w-[240px] mb-8 leading-relaxed">
                {weeklyGoal.completed >= weeklyGoal.total
                  ? "Weekly goal achieved! Great work!"
                  : `Almost there! ${weeklyGoal.total - weeklyGoal.completed} more lesson${weeklyGoal.total - weeklyGoal.completed > 1 ? 's' : ''} to reach this week's target.`}
              </p>
              <button
                onClick={openGoalDialog}
                className="w-full bg-white text-[#1E2B5A] py-4 rounded-xl font-black text-[15px] hover:scale-105 transition-all shadow-xl shadow-black/10"
              >
                Adjust Goal
              </button>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-[32px] p-8 border border-[#E5E9F0] shadow-sm">
              <h3 className="text-[18px] font-black text-[#1E273F] mb-6">Achievements</h3>
              <div className="flex items-center gap-4 mb-6">
                {ACHIEVEMENT_PREVIEW.map((item, idx) => (
                  <div key={idx} className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.locked ? 'opacity-20 bg-slate-100' : 'bg-[#F5F7FB]'}`}>
                    <item.icon size={24} className={item.color} />
                  </div>
                ))}
              </div>
              <p className="text-[12px] font-bold text-[#8793AC] mb-4">{badges.length} badge{badges.length !== 1 ? "s" : ""} earned</p>
              <button
                onClick={() => setTrophyOpen(true)}
                className="flex items-center gap-2 text-[13px] font-black text-[#33478D] hover:underline"
              >
                View Trophy Room <ChevronRight size={16} strokeWidth={3} />
              </button>
            </div>

            {/* Parent Tip */}
            <div className="bg-[#F0F5FF] rounded-[32px] p-8 border border-[#D5E1FF] relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-white/50 rounded-lg flex items-center justify-center">
                  <Lightbulb size={20} className="text-[#33478D]" />
                </div>
                <span className="text-[14px] font-black text-[#33478D]">Parent Tip</span>
              </div>
              <p className="text-[14px] font-bold text-[#5E6D8F] leading-relaxed">
                {subjects[0]?.progress > 70
                  ? `${student?.fullName?.split(' ')[0] || 'Your child'} is excelling in ${subjects[0]?.name}! Consider exploring more advanced topics together.`
                  : "Encourage your child to practice a little each day. Consistency builds confidence!"}
              </p>
            </div>
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-[#E5E9F0] py-10 px-8 mt-12">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-[13px] font-bold text-[#8793AC]">
            © 2024 EchoLearn Education Platforms. All rights reserved.
          </span>
          <div className="flex items-center gap-10">
            {["Accessibility Center", "Privacy Policy", "Terms of Service", "Support"].map(link => (
              <a key={link} href="#" className="text-[13px] font-bold text-[#8793AC] hover:text-[#33478D] transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── Adjust Goal Dialog ── */}
      {goalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[440px] overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#F5F7FB]">
              <div>
                <h2 className="text-[20px] font-black text-[#1E273F]">Adjust Weekly Goal</h2>
                <p className="text-[12px] font-bold text-[#8793AC] mt-0.5">Set how many lessons per week</p>
              </div>
              <button onClick={() => setGoalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X size={20} className="text-[#8793AC]" />
              </button>
            </div>

            <div className="p-8">
              <div className="bg-[#F8FAFD] rounded-2xl p-6 mb-6">
                <p className="text-[12px] font-black text-[#8793AC] uppercase tracking-widest mb-4 text-center">Lessons per week</p>
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => setGoalInput(g => Math.max(1, g - 1))}
                    className="w-12 h-12 rounded-xl bg-white border border-[#E5E9F0] flex items-center justify-center text-[#33478D] hover:bg-[#33478D] hover:text-white transition-all shadow-sm"
                  >
                    <Minus size={20} strokeWidth={3} />
                  </button>
                  <span className="text-[56px] font-black text-[#1E273F] w-20 text-center leading-none">{goalInput}</span>
                  <button
                    onClick={() => setGoalInput(g => Math.min(14, g + 1))}
                    className="w-12 h-12 rounded-xl bg-white border border-[#E5E9F0] flex items-center justify-center text-[#33478D] hover:bg-[#33478D] hover:text-white transition-all shadow-sm"
                  >
                    <Plus size={20} strokeWidth={3} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {[3, 5, 7].map(n => (
                  <button
                    key={n}
                    onClick={() => setGoalInput(n)}
                    className={`py-3 rounded-xl text-[13px] font-black border transition-all ${
                      goalInput === n
                        ? "bg-[#33478D] text-white border-[#33478D]"
                        : "bg-white text-[#5E6D8F] border-[#E5E9F0] hover:border-[#33478D]"
                    }`}
                  >
                    {n} / week
                    {n === 5 && <span className="block text-[10px] font-bold opacity-70">Recommended</span>}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setGoalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-[#E5E9F0] text-[14px] font-black text-[#8793AC] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveGoal}
                  disabled={savingGoal}
                  className="flex-1 py-3 rounded-xl bg-[#33478D] text-white text-[14px] font-black hover:bg-[#2a3c7a] disabled:opacity-60 transition-all"
                >
                  {savingGoal ? "Saving..." : "Save Goal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Trophy Room Dialog ── */}
      {trophyOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[520px] max-h-[80vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#F5F7FB]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                  <Trophy size={22} className="text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-[20px] font-black text-[#1E273F]">Trophy Room</h2>
                  <p className="text-[12px] font-bold text-[#8793AC] mt-0.5">{badges.length} badge{badges.length !== 1 ? "s" : ""} earned</p>
                </div>
              </div>
              <button onClick={() => setTrophyOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X size={20} className="text-[#8793AC]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {badges.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Trophy size={28} className="text-slate-300" />
                  </div>
                  <p className="text-[16px] font-black text-[#1E273F] mb-2">No badges yet</p>
                  <p className="text-[13px] font-bold text-[#8793AC] max-w-[260px] leading-relaxed">
                    {student?.fullName?.split(' ')[0] || 'Your child'} will earn badges by completing lessons, quizzes, and maintaining streaks.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {badges.map((badge, idx) => {
                    const { icon: BadgeIcon, color, bg } = getBadgeIcon(badge.name);
                    return (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-[#F8FAFD] rounded-2xl border border-[#E5E9F0]">
                        <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                          <BadgeIcon size={24} className={color} />
                        </div>
                        <div>
                          <p className="text-[14px] font-black text-[#1E273F]">{badge.name}</p>
                          <p className="text-[11px] font-bold text-[#8793AC] mt-0.5">
                            {badge.earnedDate ? timeAgo(badge.earnedDate) : "Earned"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="px-8 py-5 border-t border-[#F5F7FB]">
              <button
                onClick={() => setTrophyOpen(false)}
                className="w-full py-3 rounded-xl border border-[#E9EDF5] text-[14px] font-black text-[#8793AC] hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
