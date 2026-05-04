"use client";

import React, { useState, useEffect } from 'react';
import ParentNavbar from '@/components/Parent/ParentNavbar';
import { 
    Search, 
    Download, 
    ChevronRight, 
    BookOpen, 
    Video, 
    FileText, 
    Users, 
    HelpCircle,
    Plus,
    ExternalLink,
    Star
} from 'lucide-react';

export default function ParentResourcesPage() {
  const [activeFilter, setActiveFilter] = useState('All Resources');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const filters = [
    "All Resources", 
    "Dyslexia Support", 
    "Assistive Tech (TTS)", 
    "Blind/Low-Vision", 
    "Sri Lankan Curriculum", 
    "Exam Prep"
  ];

  const resources = [
    {
      title: "Understanding Dyslexia at Home",
      desc: "Practical strategies and emotional support techniques to help your child navigate reading challenges.",
      tag: "DYSLEXIA",
      meta: "12 min read • 1.2k views",
      icon: BookOpen,
      action: "Read Guide",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "How to Use Text-to-Speech (TTS)",
      desc: "A step-by-step tutorial on setting up screen readers and TTS software for various devices.",
      tag: "ASSISTIVE TECH",
      meta: "Video Tutorial • 8 min",
      icon: Video,
      action: "Watch Tutorial",
      image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Supporting Low-Vision Learners",
      desc: "Creating an accessible study environment at home: lighting, high-contrast materials, and more.",
      tag: "BLIND/LOW-VISION",
      meta: "15 Page Guide • 20 min read",
      icon: FileText,
      action: "Download PDF",
      hasDownload: true,
      image: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "O/L Science Adaptation Guide",
      desc: "How to adapt complex scientific diagrams for students with visual impairments following the local syllabus.",
      tag: "SL CURRICULUM",
      meta: "Sinhala/Tamil Available",
      icon: ExternalLink,
      action: "Access Resources",
      image: "https://images.unsplash.com/photo-1512820790803-73cad7a65573?auto=format&fit=crop&q=80&w=600"
    },
    {
       title: "Parenting with Confidence",
       desc: "Building resilience and maintaining a positive outlook while supporting your child's unique needs.",
       tag: "WELL-BEING",
       meta: "Support Group",
       icon: Users,
       action: "Join Community",
       isCommunity: true,
       image: "https://images.unsplash.com/photo-1536640712247-c454413acca3?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col font-sans text-left">
      <ParentNavbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-8 md:p-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
           <div className="max-w-2xl">
              <h1 className="text-[36px] font-black text-[#1E273F] tracking-tight">Parent Resources</h1>
              <p className="text-[#8793AC] font-semibold mt-2 leading-relaxed">
                 A comprehensive library of educational guides, assistive technology tutorials, and support materials curated for your child's success.
              </p>
           </div>
           <button className="bg-[#1E2B5A] text-white px-8 py-4 rounded-[18px] font-black text-[15px] flex items-center gap-3 shadow-lg shadow-blue-900/20 hover:bg-[#151F41] transition-all whitespace-nowrap">
              <Plus size={20} className="bg-white/20 rounded p-0.5" />
              Request a Custom Guide
           </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative mb-8">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#A0A9C0]" size={22} />
           <input 
              type="text" 
              placeholder="Search for guides, TTS tutorials, or curriculum support..."
              className="w-full bg-white border border-[#E5E9F0] rounded-[24px] py-6 pl-16 pr-8 text-[16px] font-bold text-[#1E273F] shadow-sm focus:outline-none focus:border-[#33478D] transition-all placeholder-[#A0A9C0]"
           />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
           {filters.map((filter) => (
             <button
               key={filter}
               onClick={() => setActiveFilter(filter)}
               className={`px-6 py-3 rounded-full text-[13px] font-black transition-all border ${
                 activeFilter === filter 
                   ? "bg-[#33478D] text-white border-[#33478D] shadow-md shadow-blue-900/10" 
                   : "bg-white text-[#8793AC] border-[#E5E9F0] hover:border-[#33478D] hover:text-[#33478D]"
               }`}
             >
                {filter}
             </button>
           ))}
        </div>

        {/* Featured Big Resource */}
        <section className="mb-12">
           <div className="bg-[#FFFFFF] rounded-[40px] border border-[#E5E9F0] overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-xl transition-all duration-700 group">
              <div className="flex-1 p-12 lg:p-16 flex flex-col justify-center">
                 <div className="flex items-center gap-2 mb-4 text-[#33478D]">
                    <Star size={16} fill="currentColor" />
                    <span className="text-[12px] font-black uppercase tracking-[0.2em]">Featured Resource</span>
                 </div>
                 <h2 className="text-[36px] font-black text-[#1E273F] leading-tight mb-6">
                    Mastering the Sri Lankan Grade 5 Scholarship Exam
                 </h2>
                 <p className="text-[#5E6D8F] font-bold text-[16px] leading-relaxed mb-10 max-w-xl">
                    A specialized guide specifically mapped to the local national curriculum, providing strategies for students with diverse learning needs to excel in competitive exams.
                 </p>
                 <div className="flex flex-wrap items-center gap-4">
                    <button className="bg-[#33478D] text-white px-10 py-5 rounded-2xl font-black text-[16px] shadow-lg shadow-blue-900/20 hover:scale-105 transition-all">
                       Download Guide (PDF)
                    </button>
                    <button className="bg-white border-2 border-[#E5E9F0] text-[#1E273F] px-10 py-[18px] rounded-2xl font-black text-[16px] hover:bg-gray-50 transition-all">
                       Read Online
                    </button>
                 </div>
              </div>
              <div className="flex-1 bg-[#1E2B5A] flex items-center justify-center relative overflow-hidden group">
                 <img 
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000" 
                    alt="Scholarship Exam"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-[#1E2B5A] via-transparent to-transparent"></div>
                 <div className="w-[80%] aspect-square bg-white/5 rounded-[40px] border-4 border-white/20 flex flex-col items-center justify-center relative backdrop-blur-md z-10">
                    <BookOpen size={100} className="text-white opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <FileText size={180} className="text-white opacity-40 drop-shadow-2xl" />
                    </div>
                 </div>
                 <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl"></div>
              </div>
           </div>
        </section>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
           {resources.map((res, idx) => (
             <div key={idx} className="bg-white rounded-[32px] border border-[#E5E9F0] overflow-hidden flex flex-col shadow-sm hover:translate-y-[-8px] transition-all duration-500 hover:shadow-xl group">
                <div className="h-56 bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-[#F5F7FB]">
                   <img 
                      src={res.image} 
                      alt={res.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
                   <res.icon size={64} className="text-[#33478D] relative z-10 opacity-80 group-hover:rotate-6 transition-transform" strokeWidth={1.5} />
                   <div className="absolute top-4 left-4 bg-[#33478D] text-white px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase shadow-lg">
                      {res.tag}
                   </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                   <div className="flex items-center gap-2 mb-3">
                      <span className="text-[11px] font-bold text-[#8793AC] uppercase tracking-wider">{res.meta}</span>
                   </div>
                   <h3 className="text-[20px] font-black text-[#1E273F] mb-4 group-hover:text-[#33478D] transition-colors line-clamp-2">{res.title}</h3>
                   <p className="text-[13px] font-bold text-[#5E6D8F] leading-relaxed mb-10 overflow-hidden line-clamp-2">
                      {res.desc}
                   </p>
                   <div className="mt-auto pt-4 border-t border-[#F5F7FB] flex items-center justify-between">
                      <button className="text-[14px] font-black text-[#33478D] hover:underline flex items-center gap-2">
                         {res.action} 
                         {res.hasDownload ? <Download size={16} strokeWidth={3} /> : <ChevronRight size={16} strokeWidth={3} />}
                      </button>
                      {res.isCommunity && <Users size={18} className="text-[#8793AC]" />}
                   </div>
                </div>
             </div>
           ))}

           {/* Submit Request Box */}
           <div className="bg-[#1E2B5A] text-white rounded-[32px] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-xl min-h-[400px]">
              <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/20 transform group-hover:scale-110 transition-transform">
                 <HelpCircle size={28} />
              </div>
              <h3 className="text-[22px] font-black mb-4">Can’t find a guide?</h3>
              <p className="text-[14px] font-medium text-white/70 mb-8 max-w-[240px] leading-relaxed">
                 Our experts can create custom resources based on your student’s specific curriculum needs.
              </p>
              <button className="bg-white text-[#1E2B5A] px-10 py-4 rounded-xl font-black text-[15px] hover:bg-[#F8FAFD] transition-all relative z-10">
                 Submit Request
              </button>
           </div>
        </div>

        {/* Global Help Footer */}
        <div className="w-full flex items-center justify-center gap-6 py-6 border-t border-[#E5E9F0]">
           <span className="text-[13px] font-bold text-[#A0A9C0] flex items-center gap-2">
              <HelpCircle size={16} /> Need immediate technical assistance?
           </span>
           <button className="text-[13px] font-black text-[#33478D] hover:underline">Chat with Support</button>
        </div>
      </main>
    </div>
  );
}
