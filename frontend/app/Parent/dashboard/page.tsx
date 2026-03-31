"use client";

import React from 'react';
import Image from 'next/image';
import { Clock, CheckCircle, BarChart2, Search, Settings, BookOpen, User, LayoutGrid, Award, Monitor, MessageCircle } from 'lucide-react';


export default function ParentDashboard() {
  return (
    <div className="min-h-screen bg-[#F5F6F8] font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <Image src="/logo.png" alt="EchoLearn" width={140} height={36} className="object-contain" />
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-[#2D3E75] border-b-2 border-[#2D3E75] pb-1">Dashboard</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#2D3E75]">My Child</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#2D3E75]">Resources</a>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-1 justify-center px-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-full shadow-sm w-full">
            <Search size={18} className="text-gray-400" />
            <input type="text" placeholder="Quick search..." className="bg-transparent rounded-full px-2 py-1 text-sm w-full focus:outline-none" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Settings size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <span className="text-sm text-gray-700">Parent Account</span>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
              <Image src="/avatar1.png" alt="Alex Johnson" width={80} height={80} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Alex Johnson</h2>
              <p className="text-gray-600">Grade 4 • Lincoln Elementary</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="bg-[#2D3E75] text-white px-4 py-2 rounded-lg">
              LVL 12
            </div>
            <div className="text-gray-900 font-bold">1,240 pts</div>
            <button className="ml-4 bg-gray-100 px-4 py-2 rounded-lg text-sm">Edit Profile</button>
          </div>
        </div>

        {/* Weekly goal */}
        <div className="bg-[#2D3E75] text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start">
          <div>
            <p className="text-lg font-bold">WEEKLY GOAL</p>
            <p className="text-2xl font-black">3/5 Lessons completed</p>
            <div className="w-full h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-white" style={{ width: '60%' }}></div>
            </div>
            <p className="text-sm mt-1">Almost there! 2 more to hit the target.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="bg-white text-[#2D3E75] px-4 py-2 rounded-lg font-semibold">View Dashboard</button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-[#E0F2FE] rounded-full flex items-center justify-center">
              <Clock className="text-[#0284C7]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Learning Time</p>
              <p className="text-2xl font-black text-gray-900">4.5 hrs</p>
              <p className="text-sm text-green-500">+12%</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-[#F3E8FF] rounded-full flex items-center justify-center">
              <CheckCircle className="text-[#8B5CF6]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Lessons Completed</p>
              <p className="text-2xl font-black text-gray-900">12</p>
              <p className="text-sm text-green-500">+5%</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-[#FEF3C7] rounded-full flex items-center justify-center">
              <BarChart2 className="text-[#D97706]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Avg. Quiz Score</p>
              <p className="text-2xl font-black text-gray-900">88%</p>
              <p className="text-sm text-green-500">+2%</p>
            </div>
          </div>
        </div>

        {/* Subject Progress & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Subject Progress</h3>
              <a href="#" className="text-sm text-[#2D3E75] hover:underline">View All Curriculum</a>
            </div>
            <div className="space-y-4">
              {[
                { subject: 'Mathematics', percent: 75, color: '#2D3E75', detail: 'Chapter 4: Long Division' },
                { subject: 'Science', percent: 60, color: '#22C55E', detail: 'The Solar System & Planets' },
                { subject: 'English', percent: 90, color: '#FBBF24', detail: 'Advanced Sentence Structure' },
              ].map((s, idx) => (
                <div key={idx}>
                  <p className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    <LayoutGrid size={16} className="text-gray-400" /> {s.subject}
                  </p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full" style={{ width: `${s.percent}%`, backgroundColor: s.color }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Currently: {s.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { icon: <Award size={20} className="text-yellow-500" />, text: "Earned 'Fraction Master' Badge", time: '2 hours ago' },
                { icon: <BookOpen size={20} className="text-purple-500" />, text: "Completed 'Intro to Fractions' Quiz", time: 'Yesterday, 4:30 PM' },
                { icon: <LayoutGrid size={20} className="text-blue-500" />, text: 'Started Lesson: Solar System', time: 'Oct 24, 2:15 PM' },
                { icon: <Monitor size={20} className="text-gray-500" />, text: 'Logged in from Desktop', time: 'Oct 24, 2:00 PM' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{item.text}</p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-[#2D3E75] hover:underline">View Full Activity Log</a>
            </div>
          </div>
        </div>

        {/* Contact teacher button */}
        <div className="fixed bottom-6 right-6">
          <button className="bg-[#2D3E75] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <MessageCircle size={20} /> Contact Teacher
          </button>
        </div>
      </div>
    </div>
  );
}
