"use client";

import React from 'react';
import Image from 'next/image';
import { ChartBar, BookOpen, UserCheck, Search, Settings } from 'lucide-react';

export default function TeacherDashboard() {
  const students = [
    { name: 'Alex Johnson', grade: '10th', lastActive: '2h ago', progress: 78, quiz: 92 },
    { name: 'Marcus Miller', grade: '10th', lastActive: '2d ago', progress: 32, quiz: 58, support: true },
    { name: 'Chloe Chen', grade: '10th', lastActive: '10m ago', progress: 95, quiz: 98 },
    { name: 'Sasha Brown', grade: '10th', lastActive: '1h ago', progress: 65, quiz: 81 },
  ];

  return (
    <div className="min-h-screen bg-[#F5F6F8] font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <Image src="/logo.png" alt="EchoLearn" width={140} height={36} className="object-contain" />
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-[#2D3E75] border-b-2 border-[#2D3E75] pb-1">Dashboard</a>
            <a href="#" className="text-sm font-medium text-gray-900 hover:text-[#2D3E75]">Classes</a>
            <a href="#" className="text-sm font-medium text-gray-900 hover:text-[#2D3E75]">Students (Active)</a>
            <a href="#" className="text-sm font-medium text-gray-900 hover:text-[#2D3E75]">Curriculum</a>
            <a href="#" className="text-sm font-medium text-gray-900 hover:text-[#2D3E75]">Reports</a>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-1 justify-center px-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-full shadow-sm w-full">
            <Search size={18} className="text-gray-400" />
            <input type="text" placeholder="Quick search..." className="bg-transparent rounded-full px-2 py-1 text-sm w-full focus:outline-none placeholder-gray-400" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Settings size={20} className="text-gray-600" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
            S
          </div>
        </div>
      </nav>

      {/* Header stats */}
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, Sarah!</h1>
            <p className="text-gray-600">Here's a snapshot of your 10th Grade Biology class today.</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">October 24, 2023</p>
            <button className="bg-[#2D3E75] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#24335b]">New Lesson</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-[#E3E8FF] rounded-full flex items-center justify-center">
              <ChartBar className="text-[#2D3E75]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Class average score</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-black text-gray-900">84%</p>
                <p className="text-sm text-green-500">+2.5%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-[#F3E8FF] rounded-full flex items-center justify-center">
              <BookOpen className="text-[#8B5CF6]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Total lessons completed</p>
              <p className="text-2xl font-black text-gray-900">1,240 –</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-[#FEF3C7] rounded-full flex items-center justify-center">
              <UserCheck className="text-[#D97706]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Students needing support</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-black text-gray-900">4</p>
                <p className="text-sm text-orange-500">Δ+1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-white sticky top-0 z-30">
              <tr>
                <th className="p-4 text-gray-700">Student Name</th>
                <th className="p-4 text-gray-700">Grade</th>
                <th className="p-4 text-gray-700">Last Active</th>
                <th className="p-4 text-gray-700">Progress %</th>
                <th className="p-4 text-gray-700">Avg. Quiz Score</th>
                <th className="p-4 text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((s, idx) => (
                <tr key={idx}>
                  <td className="flex items-center gap-3 p-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                      {s.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{s.name}</p>
                      {s.support && <p className="text-xs text-orange-500">! Needs Support</p>}
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">{s.grade}</td>
                  <td className="p-4 text-gray-700">{s.lastActive}</td>
                  <td className="p-4">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2D3E75]" style={{ width: `${s.progress}%` }}></div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700 font-semibold">{s.quiz}%</td>
                  <td className="p-4 text-right">
                    <button className="text-sm text-[#2D3E75] hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 text-xs text-gray-500">Showing 4 of 28 students</div>
        </div>

        {/* Bottom cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Class Engagement Trend</h3>
            <div className="flex items-end gap-1 h-24">
              {/* fixed heights for each day, dark bar for Sunday */}
              <div className="flex-1 bg-[#cfdfff] rounded-t-md" style={{ height: '40%' }}></div>
              <div className="flex-1 bg-[#bedfff] rounded-t-md" style={{ height: '50%' }}></div>
              <div className="flex-1 bg-[#aedfff] rounded-t-md" style={{ height: '60%' }}></div>
              <div className="flex-1 bg-[#9edfff] rounded-t-md" style={{ height: '55%' }}></div>
              <div className="flex-1 bg-[#8edfff] rounded-t-md" style={{ height: '65%' }}></div>
              <div className="flex-1 bg-[#7edfff] rounded-t-md" style={{ height: '70%' }}></div>
              <div className="flex-1 bg-[#2D3E75] rounded-t-md" style={{ height: '80%' }}></div>
            </div>
          </div>
          <div className="bg-[#2D3E75] text-white rounded-xl p-6 shadow-sm relative">
            <span className="uppercase text-xs bg-white/10 px-2 py-1 rounded-full">Proactive Insight</span>
            <h3 className="text-xl font-bold mt-4">Identify struggling students early with EchoLearn AI.</h3>
            <p className="mt-2 text-sm">Our algorithms noticed 3 students are spending 4x more time on 'Cell Mitosis' than the class average. Would you like to schedule a review session?</p>
            <div className="mt-4 flex gap-3">
              <button className="bg-white text-[#2D3E75] px-4 py-2 rounded-lg font-semibold">Schedule Review</button>
              <button className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold">Dismiss</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
