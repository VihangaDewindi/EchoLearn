"use client";

import React from 'react';
import Image from 'next/image';
import { Search, Settings, Users, Award, Mic } from 'lucide-react';
import DashboardNavbar from '@/components/Dashboard/DashboardNavbar';
import VoiceAssistantButton from '../../../components/Dashboard/VoiceAssisstantButton';

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-[#F5F6F8] font-sans">
     <DashboardNavbar />

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-white rounded-xl p-8 mb-6 flex flex-col md:flex-row justify-between items-start border border-gray-100 shadow-sm">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back, Alex! <span className="inline-block">👋</span></h1>
            <p className="text-gray-600 text-sm">You're doing great! You are <span className="font-bold">250 points away</span> from Level 10.</p>
          </div>

          <div className="flex gap-4 md:gap-6 w-full md:w-auto justify-start md:justify-end">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm w-32">
              <p className="text-gray-500 text-xs font-semibold mb-1">CURRENT LEVEL</p>
              <p className="text-3xl font-black text-gray-900">9</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm w-36">
              <p className="text-gray-500 text-xs font-semibold mb-1">TOTAL XP</p>
              <p className="text-3xl font-black text-gray-900">2,450</p>
            </div>
            <div className="rounded-lg p-4 text-center w-40" style={{ backgroundColor: '#1F3F7F' }}>
              <p className="text-white text-xs font-semibold mb-1">DAILY GOAL/10min</p>
              <div className="w-28 h-2 bg-white/20 rounded-full mt-2 overflow-hidden mx-auto">
                <div className="h-full bg-white" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (wide) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
                <a href="#" className="text-sm font-semibold text-[#2D3E75] hover:underline">View Library</a>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#8B977F] rounded-2xl p-8 text-white flex flex-col items-center justify-center aspect-[3/2]">
                  <p className="text-2xl font-black text-center">LESSON</p>
                  <p className="text-xs mt-2 opacity-80">#FractionIntro</p>
                </div>

                <div className="md:col-span-2 bg-gray-50 rounded-2xl p-6">
                  <p className="text-xs font-bold text-gray-600 tracking-widest uppercase mb-2">MATHEMATICS Unit 3: Fractions</p>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Introduction to Fractions</h3>
                  <p className="text-sm text-gray-600 mb-4">Master the basics of numerators, denominators, and equivalent fractions through visual puzzles.</p>
                  
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Progress</p>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2D3E75]" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">65%</p>
                  </div>

                  <button className="bg-[#2D3E75] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#24335b] flex items-center gap-2">
                    ▶ Resume Lesson
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">My Progress Overview</h2>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-4xl font-black text-gray-900 mb-1">80%</p>
                  <div className="w-full h-1 bg-orange-100 rounded-full mb-3 overflow-hidden">
                    <div className="h-full bg-orange-400" style={{ width: '80%' }}></div>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Math</p>
                </div>
                <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-4xl font-black text-gray-900 mb-1">45%</p>
                  <div className="w-full h-1 bg-green-100 rounded-full mb-3 overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '45%' }}></div>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Science</p>
                </div>
                <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-4xl font-black text-gray-900 mb-1">90%</p>
                  <div className="w-full h-1 bg-purple-100 rounded-full mb-3 overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: '90%' }}></div>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">English</p>
                </div>
              </div>
            </div>

            {/* Weekly Study Plan */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Study Plan</h2>
              
              <div className="space-y-4">
                {[
                  { day: 'Mon', subject: 'Algebra', progress: 90 },
                  { day: 'Tue', subject: 'Biology', progress: 40 },
                  { day: 'Wed', subject: 'Literature', progress: 20 },
                  { day: 'Thu', subject: 'Physics', progress: 0 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700 w-20">{item.day}</span>
                    <span className="text-sm text-gray-600 w-24">{item.subject}</span>
                    <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.progress === 90 ? 'bg-orange-400' : item.progress === 40 ? 'bg-green-500' : item.progress === 20 ? 'bg-purple-500' : 'bg-gray-300'}`}
                        style={{ width: `${item.progress || 5}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-700 w-12 text-right">{item.progress}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Completed Quiz: Algebra I</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Earned Speed Learner Badge</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Started Lesson: Cell Structure</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent Achievements</h2>
                <a href="#" className="text-xs font-semibold text-[#2D3E75] hover:underline">View All</a>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-yellow-50 p-3 rounded-lg">
                  <div className="bg-yellow-300 rounded-lg p-2 flex-shrink-0">
                    <Award size={20} className="text-yellow-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Speed Learner</p>
                    <p className="text-xs text-gray-600">Completed 1 lesson in under an hour</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg">
                  <div className="bg-red-300 rounded-lg p-2 flex-shrink-0">
                    <Award size={20} className="text-red-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">7-Day Streak</p>
                    <p className="text-xs text-gray-600">You've logged in for 7 consecutive days!</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                  <div className="bg-blue-300 rounded-lg p-2 flex-shrink-0">
                    <Award size={20} className="text-blue-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Math Whiz</p>
                    <p className="text-xs text-gray-600">Scored 100% on the Fractions Quiz</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recommended for You</h2>
              
              <div className="space-y-3">
                <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-400">
                  <p className="text-xs font-bold text-orange-600 mb-1">ADVANCED</p>
                  <p className="font-semibold text-sm text-gray-900">Advanced Geometry</p>
                  <p className="text-xs text-gray-600 mt-1">Explore complex shapes, theorems, and spatial reasoning</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <p className="text-xs font-bold text-green-600 mb-1">ORGANIC</p>
                  <p className="font-semibold text-sm text-gray-900">Organic Chemistry Basics</p>
                  <p className="text-xs text-gray-600 mt-1">Introduction to carbon-based compounds and reactions</p>
                </div>
              </div>
            </div>

            {/* Voice Assistant */}
            <div className="bg-[#2D3E75] text-white rounded-xl p-6 text-center shadow-sm">
              <div className="bg-white/20 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <Mic size={24} />
              </div>
              <h3 className="font-bold text-white mb-2">Voice Assistant Active</h3>
              <p className="text-sm text-blue-100">Try saying \"Go to Lessons\" to navigate instantly.</p>
            </div>

            {/* Learning Community */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Learning Community</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 text-center transition">
                  <Mic size={24} className="mx-auto mb-2 text-gray-600" />
                  <p className="font-semibold text-sm text-gray-900">Ask a Tutor</p>
                </button>
                <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 text-center transition">
                  <Users size={24} className="mx-auto mb-2 text-gray-600" />
                  <p className="font-semibold text-sm text-gray-900">Study Group</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VoiceAssistantButton />
    </div>
  );
}
