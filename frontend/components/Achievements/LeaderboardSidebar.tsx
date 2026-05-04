import React from "react";
import { User, Share2, Play } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: string;
  isCurrentUser?: boolean;
}

export default function LeaderboardSidebar() {
  const topUsers: LeaderboardUser[] = [
    { rank: 1, name: "Sarah Jenkins", xp: "9,820 XP" },
    { rank: 2, name: "David Chen", xp: "8,450 XP" },
    { rank: 3, name: "Maria Rodriguez", xp: "7,120 XP" },
  ];

  const currentUser: LeaderboardUser = { rank: 124, name: "You", xp: "2,450 XP", isCurrentUser: true };
  const nextUser: LeaderboardUser = { rank: 125, name: "Alex Rivera", xp: "2,410 XP" };

  return (
    <div className="w-80 flex flex-col gap-6">
      {/* Main Leaderboard Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Monthly Competition</p>
        </div>

        <div className="flex flex-col gap-4">
          {topUsers.map((user) => (
            <div key={user.rank} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-yellow-600 w-4">{user.rank}</span>
                <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white overflow-hidden">
                   <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                     {user.name.charAt(0)}
                   </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{user.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold tracking-tighter">{user.xp}</p>
                </div>
              </div>
              {user.rank === 1 && <span className="text-yellow-500">🏆</span>}
            </div>
          ))}

          <div className="flex justify-center py-2">
            <div className="w-1 h-5 bg-gray-100 rounded-full"></div>
          </div>

          {[currentUser, nextUser].map((user) => (
            <div key={user.rank} className={`flex items-center justify-between p-2 rounded-xl ${user.isCurrentUser ? 'bg-indigo-50 border border-indigo-100 ring-1 ring-indigo-100' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-4">{user.rank}</span>
                <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white overflow-hidden">
                   <div className={`w-full h-full ${user.isCurrentUser ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'} flex items-center justify-center font-bold`}>
                     {user.name.charAt(0)}
                   </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-bold text-gray-800">{user.name}</p>
                    {user.isCurrentUser && <span className="bg-indigo-600 text-[8px] text-white px-1 rounded uppercase font-bold">Me</span>}
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold tracking-tighter">{user.xp}</p>
                </div>
              </div>
              {user.isCurrentUser && <span className="text-indigo-400 text-xs">▲</span>}
            </div>
          ))}
        </div>

        <button className="w-full mt-8 bg-[#1f3f7f] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#152e61] transition-all">
          <Share2 size={16} />
          Share Progress
        </button>
      </div>

      {/* Motivation Card */}
      <div className="bg-[#2D4496] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-2">Almost at the Top!</h3>
          <p className="text-xs text-indigo-100 mb-6 leading-relaxed">
            You're just 200 XP away from breaking into the Top 100. Keep studying!
          </p>
          <button className="bg-white text-[#2D4496] px-6 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-all flex items-center gap-2">
            Continue Lesson
          </button>
        </div>
        <div className="absolute -bottom-8 -right-8 opacity-10">
            <Play size={150} fill="currentColor" />
        </div>
      </div>
    </div>
  );
}
