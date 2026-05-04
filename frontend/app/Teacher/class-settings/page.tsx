"use client";

import React, { useState } from 'react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';
import TeacherFooter from '@/components/Teacher/TeacherFooter';
import SettingsSidebar from '@/components/Teacher/SettingsSidebar';
import { 
    BookOpen, 
    Sparkles, 
    Eye, 
    Accessibility, 
    ChevronDown, 
    Globe, 
    Lock, 
    Mail, 
    Mic, 
    Volume2, 
    Type
} from 'lucide-react';

export default function ClassSettingsPage() {
  const [teachingScope, setTeachingScope] = useState("10th Grade Biology");
  const [academicYear, setAcademicYear] = useState("2023 - 2024 Fall");
  const [visibility, setVisibility] = useState("Public");
  
  const [predictiveInsights, setPredictiveInsights] = useState(true);
  const [autoQuizzes, setAutoQuizzes] = useState(false);
  const [voiceNav, setVoiceNav] = useState(false);
  const [screenReader, setScreenReader] = useState(true);
  const [dyslexiaUI, setDyslexiaUI] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col font-sans text-left">
      <TeacherNavbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-8 md:p-12 flex gap-10">
        <SettingsSidebar />

        {/* Content Section */}
        <section className="flex-1 space-y-8">
          <div className="bg-white rounded-[28px] border border-[#E5E9F0] p-12 shadow-sm">
            <h1 className="text-[32px] font-black text-[#1E273F] tracking-tight">Class Settings</h1>
            <p className="text-[#8793AC] font-semibold mt-1 mb-10">Configure your grade levels, AI features, and class visibility preferences.</p>

            {/* Section 1: Grade & Subject */}
            <div className="space-y-6 mb-12">
               <div className="flex items-center gap-3 mb-2">
                  <BookOpen size={20} className="text-[#33478D]" strokeWidth={2.5} />
                  <h3 className="text-[18px] font-black text-[#1E273F]">Grade & Subject</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <label className="text-[13px] font-black text-[#1E273F] uppercase tracking-wider">Teaching Scope</label>
                     <div className="relative">
                        <input 
                           type="text" 
                           value={teachingScope}
                           onChange={(e) => setTeachingScope(e.target.value)}
                           className="w-full bg-[#F5F7FB] border border-[#D5DCEB] rounded-[14px] px-6 py-4 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] transition-all"
                        />
                        <BookOpen size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-[#A0A9C0]" />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[13px] font-black text-[#1E273F] uppercase tracking-wider">Academic Year</label>
                     <div className="relative">
                        <select 
                           value={academicYear}
                           onChange={(e) => setAcademicYear(e.target.value)}
                           className="w-full bg-[#F5F7FB] border border-[#D5DCEB] rounded-[14px] px-6 py-4 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] transition-all appearance-none"
                        >
                           <option>2023 - 2024 Fall</option>
                           <option>2023 - 2024 Spring</option>
                           <option>2024 - 2025 Fall</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-[#A0A9C0]" />
                     </div>
                  </div>
               </div>
            </div>

            {/* Section 2: EchoLearn Intelligence */}
            <div className="space-y-6 mb-12">
               <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                     <Sparkles size={20} className="text-[#33478D]" strokeWidth={2.5} />
                     <h3 className="text-[18px] font-black text-[#1E273F]">EchoLearn Intelligence</h3>
                  </div>
                  <span className="bg-[#F0F2FA] text-[#33478D] px-3 py-1 rounded-md text-[10px] font-black tracking-widest">BETA</span>
               </div>
               
               <div className="bg-[#F8FAFD] rounded-[20px] p-6 space-y-6 border border-[#E5E9F0]">
                  <div className="flex items-start justify-between gap-6">
                     <div className="flex-1">
                        <h4 className="text-[16px] font-black text-[#1E273F]">Predictive Insights</h4>
                        <p className="text-[13px] font-bold text-[#8793AC] mt-1">AI analyzes student performance to predict potential learning gaps before they occur.</p>
                     </div>
                     <button 
                        onClick={() => setPredictiveInsights(!predictiveInsights)}
                        className={`w-14 h-7 rounded-full transition-all relative ${predictiveInsights ? 'bg-[#33478D]' : 'bg-[#D5DCEB]'}`}
                     >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${predictiveInsights ? 'left-8' : 'left-1'}`}></div>
                     </button>
                  </div>
                  <div className="w-full h-px bg-[#D5DCEB] opacity-50"></div>
                  <div className="flex items-start justify-between gap-6">
                     <div className="flex-1 text-gray-400">
                        <h4 className="text-[16px] font-black text-[#1E273F]/40">Auto-Generated Quizzes</h4>
                        <p className="text-[13px] font-bold text-[#8793AC]/50 mt-1">Automatically creates weekly check-ins based on your lecture notes.</p>
                     </div>
                     <button 
                        onClick={() => setAutoQuizzes(!autoQuizzes)}
                        className={`w-14 h-7 rounded-full transition-all relative ${autoQuizzes ? 'bg-[#33478D]' : 'bg-[#D5DCEB]'}`}
                     >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${autoQuizzes ? 'left-8' : 'left-1'}`}></div>
                     </button>
                  </div>
               </div>
            </div>

            {/* Section 3: Visibility & Access */}
            <div className="space-y-6 mb-12">
               <div className="flex items-center gap-3 mb-2">
                  <Eye size={20} className="text-[#33478D]" strokeWidth={2.5} />
                  <h3 className="text-[18px] font-black text-[#1E273F]">Visibility & Access</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Public", desc: "Visible to all students in school", icon: Globe },
                    { label: "Private", desc: "Only you can see this class", icon: Lock },
                    { label: "Invite Only", desc: "Requires manual approval", icon: Mail },
                  ].map((opt) => (
                    <button 
                        key={opt.label}
                        onClick={() => setVisibility(opt.label)}
                        className={`p-6 rounded-[20px] border-2 text-left transition-all relative ${
                            visibility === opt.label 
                                ? "border-[#33478D] bg-blue-50/30" 
                                : "border-[#E5E9F0] hover:border-[#D5DCEB]"
                        }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${visibility === opt.label ? "bg-[#33478D] text-white" : "bg-[#F5F7FB] text-[#8793AC]"}`}>
                              <opt.icon size={20} />
                           </div>
                           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${visibility === opt.label ? "border-[#33478D]" : "border-[#E5E9F0]"}`}>
                              {visibility === opt.label && <div className="w-2.5 h-2.5 bg-[#33478D] rounded-full"></div>}
                           </div>
                        </div>
                        <h4 className="text-[16px] font-black text-[#1E273F]">{opt.label}</h4>
                        <p className="text-[12px] font-bold text-[#8793AC] mt-1">{opt.desc}</p>
                    </button>
                  ))}
               </div>
            </div>

            {/* Section 4: Accessibility Tools */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 mb-2">
                  <Accessibility size={20} className="text-[#33478D]" strokeWidth={2.5} />
                  <h3 className="text-[18px] font-black text-[#1E273F]">Accessibility Tools</h3>
               </div>
               <div className="space-y-4">
                  {[
                    { label: "Voice Navigation", desc: "Control dashboard using voice commands", icon: Mic, state: voiceNav, setState: setVoiceNav },
                    { label: "Screen Reader Support", desc: "Optimized semantic markup for readers", icon: Volume2, state: screenReader, setState: setScreenReader },
                    { label: "Dyslexia-friendly UI", desc: "Switches to OpenDyslexic font and higher contrast", icon: Type, state: dyslexiaUI, setState: setDyslexiaUI, preview: true },
                  ].map((tool) => (
                    <div key={tool.label} className="p-6 bg-white border border-[#E5E9F0] rounded-[20px] flex items-center justify-between gap-6 hover:shadow-sm transition-all">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-[#F5F7FB] rounded-xl flex items-center justify-center text-[#8793AC]">
                             <tool.icon size={22} />
                          </div>
                          <div>
                             <div className="flex items-center gap-3">
                                <h4 className="text-[16px] font-black text-[#1E273F]">{tool.label}</h4>
                                {tool.preview && <span className="text-[8px] font-black text-[#33478D] uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded">PREVIEW</span>}
                             </div>
                             <p className="text-[13px] font-bold text-[#8793AC] mt-1">{tool.desc}</p>
                          </div>
                       </div>
                       <button 
                          onClick={() => tool.setState(!tool.state)}
                          className={`w-14 h-7 rounded-full transition-all relative ${tool.state ? 'bg-[#33478D]' : 'bg-[#D5DCEB]'}`}
                       >
                          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${tool.state ? 'left-8' : 'left-1'}`}></div>
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Page Actions */}
          <div className="flex items-center justify-end gap-6 pb-12">
             <button className="text-[15px] font-black text-[#8793AC] hover:text-[#1E273F] transition-all">Cancel Changes</button>
             <button className="bg-[#33478D] text-white px-10 py-4 rounded-xl font-black text-[16px] shadow-lg shadow-blue-900/10 hover:bg-[#2A3B7A] hover:-translate-y-0.5 transition-all">
                Save Configuration
             </button>
          </div>
        </section>
      </main>

      <TeacherFooter />
    </div>
  );
}
