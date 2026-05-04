"use client";

import React, { useState, useEffect } from 'react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';
import TeacherFooter from '@/components/Teacher/TeacherFooter';
import {
    Plus,
    Search,
    Filter,
    Edit3,
    Link as LinkIcon,
    ChevronUp,
    ChevronDown,
    MoreVertical,
    Eye,
    EyeOff,
    PlayCircle,
    FileText,
    HelpCircle,
    Layers,
    FlaskConical,
    ScrollText,
    BookOpen,
    Globe
} from 'lucide-react';

const API = "http://localhost:5001";

const SUBJECT_ICONS: Record<string, React.ElementType> = {
  Math: Layers,
  Mathematics: Layers,
  Science: FlaskConical,
  History: ScrollText,
  English: BookOpen,
  Literature: BookOpen,
  "Social Studies": Globe,
  Linguistics: Globe,
};

const LESSON_TYPE_CONFIG: Record<string, { iconColor: string; bg: string; icon: React.ElementType }> = {
  Video: { icon: PlayCircle, iconColor: "text-blue-500", bg: "bg-blue-50" },
  Reading: { icon: FileText, iconColor: "text-indigo-500", bg: "bg-indigo-50" },
  Quiz: { icon: HelpCircle, iconColor: "text-orange-500", bg: "bg-orange-50" },
  Activity: { icon: Layers, iconColor: "text-green-500", bg: "bg-green-50" },
};

export default function CurriculumPage() {
  const [activeSubject, setActiveSubject] = useState('');
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const [curriculum, setCurriculum] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/teacher/curriculum`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setCurriculum(d || {});
        const subjects = Object.keys(d || {});
        if (subjects.length > 0) setActiveSubject(subjects[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const subjects = Object.keys(curriculum);
  const currentUnits = curriculum[activeSubject] || [];

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col font-sans text-left">
      <TeacherNavbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-8 md:p-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] font-bold text-[#8793AC] mb-6">
          <span>Curriculum</span>
          <span className="text-[#A0A9C0]">{">"}</span>
          <span className="text-[#33478D]">{activeSubject}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-[36px] font-black text-[#1E273F] tracking-tight">Curriculum Management</h1>
            <p className="text-[#8793AC] font-semibold mt-1">Organize units, lessons, and assignments for your classes.</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 bg-[#F5F7FB] text-[#33478D] px-6 py-3 rounded-xl font-black text-[14px] hover:bg-[#EAEFF7] transition-all">
                <Edit3 size={18} strokeWidth={2.5} />
                Edit Curriculum
             </button>
             <button className="flex items-center gap-2 bg-[#33478D] text-white px-6 py-3 rounded-xl font-black text-[14px] shadow-lg shadow-blue-900/10 hover:bg-[#2A3B7A] transition-all">
                <LinkIcon size={18} strokeWidth={2.5} />
                Assign to Class
             </button>
          </div>
        </div>

        {/* Subject Tabs */}
        <div className="flex items-center gap-10 mb-8 border-b border-[#E5E9F0] overflow-x-auto">
           {loading ? (
             <div className="pb-4 text-[#8793AC] font-bold">Loading subjects...</div>
           ) : subjects.map((sub) => {
             const SubIcon = SUBJECT_ICONS[sub] || Layers;
             return (
               <button
                 key={sub}
                 onClick={() => setActiveSubject(sub)}
                 className={`flex items-center gap-3 pb-4 text-[15px] font-black transition-all relative whitespace-nowrap ${
                   activeSubject === sub ? "text-[#33478D]" : "text-[#8793AC] hover:text-[#1E273F]"
                 }`}
               >
                 <SubIcon size={18} strokeWidth={activeSubject === sub ? 3 : 2} />
                 {sub}
                 {activeSubject === sub && (
                   <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#33478D] rounded-t-full"></div>
                 )}
               </button>
             );
           })}
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-8 gap-4">
           <div className="flex-1 max-w-3xl flex items-center gap-3 bg-white px-6 py-4 rounded-xl border border-[#E5E9F0] shadow-sm focus-within:border-[#33478D] transition-all">
              <Search size={20} className="text-[#A0A9C0]" />
              <input
                type="text"
                placeholder="Search units or specific lessons..."
                className="bg-transparent text-[15px] font-bold text-[#1E273F] focus:outline-none placeholder-[#A0A9C0] w-full"
              />
           </div>
           <button className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl border border-[#E5E9F0] shadow-sm text-[15px] font-black text-[#1E273F] hover:bg-gray-50 transition-all">
              <Filter size={20} strokeWidth={2.5} />
              Filters
           </button>
        </div>

        {/* Units List */}
        <div className="space-y-6 mb-10">
           {loading ? (
             <div className="p-10 text-center text-[#8793AC] font-bold">Loading curriculum...</div>
           ) : currentUnits.length === 0 ? (
             <div className="p-10 text-center text-[#8793AC] font-bold">No units found for {activeSubject}.</div>
           ) : currentUnits.map((unit: any) => (
             <div key={unit._id} className="bg-white rounded-[24px] border border-[#E5E9F0] shadow-sm overflow-hidden">
                {/* Unit Header */}
                <div
                    onClick={() => setExpandedUnit(expandedUnit === unit._id ? null : unit._id)}
                    className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-all"
                >
                   <div className="flex items-center gap-6">
                      <div className="w-10 h-10 flex flex-col gap-1 items-center justify-center text-[#D5DCEB]">
                         <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                         <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                         <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                      </div>
                      <div>
                         <div className="flex items-center gap-3">
                            <h3 className="text-[20px] font-black text-[#1E273F]">{unit.title}</h3>
                            <span className="bg-[#E9F7EF] text-[#2E7D32] px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-widest">
                               ACTIVE
                            </span>
                         </div>
                         <p className="text-[13px] font-bold text-[#8793AC] mt-1">
                            {unit.lessonCount} Lesson{unit.lessonCount !== 1 ? 's' : ''}
                         </p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <button className="p-2 text-[#8793AC] hover:bg-[#F5F7FB] rounded-lg transition-all">
                         <Eye size={20} />
                      </button>
                      <button className="p-2 text-[#8793AC] hover:bg-[#F5F7FB] rounded-lg transition-all">
                         <MoreVertical size={20} />
                      </button>
                      <div className="text-[#33478D] font-black">
                         {expandedUnit === unit._id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                      </div>
                   </div>
                </div>

                {/* Lessons */}
                {expandedUnit === unit._id && unit.lessons.length > 0 && (
                  <div className="border-t border-[#F5F7FB]">
                     {unit.lessons.map((lesson: any, lIdx: number) => {
                       const config = LESSON_TYPE_CONFIG[lesson.type] || LESSON_TYPE_CONFIG.Reading;
                       const LessonIcon = config.icon;
                       return (
                         <div key={lIdx} className="p-6 pl-20 flex items-center justify-between border-b border-[#F5F7FB] last:border-b-0 hover:bg-[#F8FAFD] transition-colors">
                            <div className="flex items-center gap-5">
                               <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center shrink-0`}>
                                  <LessonIcon className={config.iconColor} size={22} strokeWidth={2.5} />
                               </div>
                               <div>
                                  <h4 className="text-[16px] font-black text-[#1E273F]">{lesson.name}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                     <span className="text-[10px] font-black text-[#8793AC] uppercase tracking-wider">{lesson.type}</span>
                                     <span className="text-[#D5DCEB]">•</span>
                                     <span className="text-[10px] font-black text-[#8793AC] uppercase tracking-wider">{lesson.duration}</span>
                                  </div>
                               </div>
                            </div>
                         </div>
                       );
                     })}
                  </div>
                )}
             </div>
           ))}
        </div>

        {/* Add Unit Button */}
        <button className="w-full py-6 flex items-center justify-center gap-3 text-[#33478D] font-black hover:bg-[#33478D]/5 rounded-2xl transition-all border-2 border-dashed border-transparent hover:border-[#33478D]/20">
           <div className="w-8 h-8 rounded-full bg-[#33478D] text-white flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Plus size={20} strokeWidth={3} />
           </div>
           Add New Unit to {activeSubject}
        </button>
      </main>

      <TeacherFooter />
    </div>
  );
}
