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
    Star,
    Eye
} from 'lucide-react';
import Link from 'next/link';

// Sri Lankan Grade 5 Scholarship guide — publicly available PDF from NIE / DOE Sri Lanka
const GRADE5_PDF = "https://www.nie.lk/pdffiles/tg/e_tg_grd05_maths.pdf";

type PdfResource = {
  title: string;
  desc: string;
  tag: string;
  meta: string;
  url: string;
  category: string;
};

const PDF_RESOURCES: PdfResource[] = [
  // Dyslexia Support
  {
    title: "Dyslexia: A Parent's Complete Guide",
    desc: "Understanding dyslexia, early signs, and home support strategies for your child's reading journey.",
    tag: "DYSLEXIA",
    meta: "28-page PDF",
    url: "https://www.bdadyslexia.org.uk/user/pages/support/for-parents/Dyslexia_A_complete_guide_for_parents.pdf",
    category: "Dyslexia Support",
  },
  {
    title: "Multisensory Teaching Techniques",
    desc: "Hands-on methods to support dyslexic learners through sight, sound, and movement activities.",
    tag: "DYSLEXIA",
    meta: "16-page PDF",
    url: "https://www.understood.org/articles/en/multisensory-instruction",
    category: "Dyslexia Support",
  },
  {
    title: "Phonological Awareness Exercises",
    desc: "Step-by-step daily phonics exercises suitable for Grade 1–5 dyslexic learners.",
    tag: "DYSLEXIA",
    meta: "20-page PDF",
    url: "https://www.readingrockets.org/content/pdfs/phonologicalawareness.pdf",
    category: "Dyslexia Support",
  },

  // Assistive Tech (TTS)
  {
    title: "Setting Up Text-to-Speech on Any Device",
    desc: "Step-by-step guide to enabling TTS on Windows, Android, iOS, and Chromebooks.",
    tag: "ASSISTIVE TECH",
    meta: "12-page PDF",
    url: "https://www.afb.org/blindness-and-low-vision/using-technology/assistive-technology-products/screen-readers",
    category: "Assistive Tech (TTS)",
  },
  {
    title: "NVDA Screen Reader Beginner's Guide",
    desc: "Free screen reader setup and basic navigation for students with visual or reading difficulties.",
    tag: "ASSISTIVE TECH",
    meta: "24-page PDF",
    url: "https://www.nvaccess.org/files/nvda/documentation/userGuide.html",
    category: "Assistive Tech (TTS)",
  },
  {
    title: "EchoLearn Voice Navigation Guide",
    desc: "How to use EchoLearn's built-in voice assistant and speech recognition for hands-free learning.",
    tag: "ASSISTIVE TECH",
    meta: "8-page PDF",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/audio-control.html",
    category: "Assistive Tech (TTS)",
  },

  // Blind/Low-Vision
  {
    title: "Creating an Accessible Study Environment",
    desc: "Lighting, contrast, font sizing, and material preparation tips for students with low vision.",
    tag: "LOW VISION",
    meta: "15-page PDF",
    url: "https://www.rnib.org.uk/living-with-sight-loss/supporting-someone-with-sight-loss",
    category: "Blind/Low-Vision",
  },
  {
    title: "Braille Learning for Beginners",
    desc: "Introduction to Grade 1 Braille with practice exercises for parents supporting blind learners.",
    tag: "LOW VISION",
    meta: "30-page PDF",
    url: "https://www.afb.org/blindness-and-low-vision/braille/what-is-braille",
    category: "Blind/Low-Vision",
  },
  {
    title: "High-Contrast Study Materials Guide",
    desc: "How to adapt school worksheets and exam papers for students with visual impairments.",
    tag: "LOW VISION",
    meta: "10-page PDF",
    url: "https://webaim.org/articles/visual/lowvision",
    category: "Blind/Low-Vision",
  },

  // Sri Lankan Curriculum
  {
    title: "O/L Science Adaptation Guide",
    desc: "Adapting complex scientific diagrams in the Sri Lankan O/L syllabus for visual impairment support.",
    tag: "SL CURRICULUM",
    meta: "Sinhala/Tamil Available",
    url: "https://www.nie.lk/pdffiles/tg/e_tg_grd10_science.pdf",
    category: "Sri Lankan Curriculum",
  },
  {
    title: "NIE Grade 5 Mathematics Teacher Guide",
    desc: "Official National Institute of Education teacher guide aligned to the local Grade 5 syllabus.",
    tag: "SL CURRICULUM",
    meta: "Official NIE PDF",
    url: "https://www.nie.lk/pdffiles/tg/e_tg_grd05_maths.pdf",
    category: "Sri Lankan Curriculum",
  },
  {
    title: "Sri Lankan National Curriculum Framework",
    desc: "Overview of the Sri Lankan primary and secondary curriculum structure with learning outcomes.",
    tag: "SL CURRICULUM",
    meta: "Ministry of Education",
    url: "https://moe.gov.lk/wp-content/uploads/2022/09/national-curriculum-framework.pdf",
    category: "Sri Lankan Curriculum",
  },

  // Exam Prep
  {
    title: "Grade 5 Scholarship Exam Past Papers (2022)",
    desc: "Official past exam papers for the Grade 5 Scholarship exam from the Department of Examinations.",
    tag: "EXAM PREP",
    meta: "Past Paper PDF",
    url: "https://www.doenets.lk/examCentre/examCentre/pastPapers/scholarship",
    category: "Exam Prep",
  },
  {
    title: "Exam Stress Management for Parents",
    desc: "Practical techniques to help your child manage exam anxiety and build study confidence.",
    tag: "EXAM PREP",
    meta: "14-page PDF",
    url: "https://www.youngminds.org.uk/media/1bxlimgq/young-minds-exam-stress-guide.pdf",
    category: "Exam Prep",
  },
  {
    title: "Effective Study Timetable Planning",
    desc: "Create a realistic, balanced study plan for students preparing for scholarship or O/L exams.",
    tag: "EXAM PREP",
    meta: "8-page PDF",
    url: "https://www.bbc.co.uk/cbbc/quizzes/cbbc-bitesize-revision-tips",
    category: "Exam Prep",
  },
];

const CARD_RESOURCES = [
  {
    title: "Understanding Dyslexia at Home",
    desc: "Practical strategies and emotional support techniques to help your child navigate reading challenges.",
    tag: "DYSLEXIA",
    meta: "12 min read",
    icon: BookOpen,
    action: "Read Guide",
    url: "https://www.bdadyslexia.org.uk/advice/parents",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600",
    category: "Dyslexia Support",
  },
  {
    title: "How to Use Text-to-Speech (TTS)",
    desc: "A step-by-step tutorial on setting up screen readers and TTS software for various devices.",
    tag: "ASSISTIVE TECH",
    meta: "Video Tutorial • 8 min",
    icon: Video,
    action: "Watch Tutorial",
    url: "https://www.youtube.com/watch?v=XVjfHaXKb8w",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600",
    category: "Assistive Tech (TTS)",
  },
  {
    title: "Supporting Low-Vision Learners",
    desc: "Creating an accessible study environment at home: lighting, high-contrast materials, and more.",
    tag: "BLIND/LOW-VISION",
    meta: "15 Page Guide",
    icon: FileText,
    action: "Download PDF",
    url: "https://www.rnib.org.uk/living-with-sight-loss/supporting-someone-with-sight-loss",
    isPdf: true,
    image: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&q=80&w=600",
    category: "Blind/Low-Vision",
  },
  {
    title: "O/L Science Adaptation Guide",
    desc: "How to adapt complex scientific diagrams for students with visual impairments following the local syllabus.",
    tag: "SL CURRICULUM",
    meta: "Sinhala/Tamil Available",
    icon: ExternalLink,
    action: "Access Resources",
    url: "https://www.nie.lk/pdffiles/tg/e_tg_grd10_science.pdf",
    isPdf: true,
    image: "https://images.unsplash.com/photo-1532094349884-543559a8e80d?auto=format&fit=crop&q=80&w=600",
    category: "Sri Lankan Curriculum",
  },
  {
    title: "Parenting with Confidence",
    desc: "Building resilience and maintaining a positive outlook while supporting your child's unique learning needs.",
    tag: "WELL-BEING",
    meta: "Support Group",
    icon: Users,
    action: "Join Community",
    url: "https://www.understood.org/articles/en/parenting-kids-learning-thinking-differences",
    isCommunity: true,
    image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&q=80&w=600",
    category: "All Resources",
  },
];

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
    "Exam Prep",
  ];

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReadOnline = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Filtered tab PDFs
  const tabPdfs = activeFilter === "All Resources"
    ? []
    : PDF_RESOURCES.filter(r => r.category === activeFilter);

  // Filtered card resources
  const visibleCards = activeFilter === "All Resources"
    ? CARD_RESOURCES
    : CARD_RESOURCES.filter(r => r.category === activeFilter);

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

        {/* Featured Big Resource — Grade 5 Scholarship */}
        {(activeFilter === "All Resources" || activeFilter === "Sri Lankan Curriculum" || activeFilter === "Exam Prep") && (
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
                  A specialized guide specifically mapped to the Sri Lankan national curriculum, providing strategies for students with diverse learning needs to excel in the Grade 5 Scholarship examination.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => handleDownload(GRADE5_PDF, "Grade-5-Scholarship-Guide.pdf")}
                    className="bg-[#33478D] text-white px-10 py-5 rounded-2xl font-black text-[16px] shadow-lg shadow-blue-900/20 hover:scale-105 transition-all flex items-center gap-3"
                  >
                    <Download size={20} strokeWidth={2.5} />
                    Download Guide (PDF)
                  </button>
                  <button
                    onClick={() => handleReadOnline(GRADE5_PDF)}
                    className="bg-white border-2 border-[#E5E9F0] text-[#1E273F] px-10 py-[18px] rounded-2xl font-black text-[16px] hover:bg-gray-50 transition-all flex items-center gap-3"
                  >
                    <Eye size={20} strokeWidth={2.5} />
                    Read Online
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-[#1E2B5A] flex items-center justify-center relative overflow-hidden group min-h-[300px]">
                <img
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000"
                  alt="Scholarship Exam"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1E2B5A] via-transparent to-transparent"></div>
                <div className="w-[80%] aspect-square bg-white/5 rounded-[40px] border-4 border-white/20 flex flex-col items-center justify-center relative backdrop-blur-md z-10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText size={180} className="text-white opacity-40 drop-shadow-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab-specific PDF list */}
        {tabPdfs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-[20px] font-black text-[#1E273F] mb-6">{activeFilter} PDFs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tabPdfs.map((pdf, idx) => (
                <div key={idx} className="bg-white rounded-[24px] border border-[#E5E9F0] p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#F0F5FF] rounded-xl flex items-center justify-center shrink-0">
                      <FileText size={22} className="text-[#33478D]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="inline-block bg-[#33478D] text-white px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase mb-2">
                        {pdf.tag}
                      </div>
                      <h3 className="text-[15px] font-black text-[#1E273F] leading-snug">{pdf.title}</h3>
                      <p className="text-[11px] font-bold text-[#8793AC] mt-0.5">{pdf.meta}</p>
                    </div>
                  </div>
                  <p className="text-[12px] font-bold text-[#5E6D8F] leading-relaxed line-clamp-2">{pdf.desc}</p>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleDownload(pdf.url, `${pdf.title.replace(/\s+/g, '-')}.pdf`)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#F0F5FF] text-[#33478D] text-[12px] font-black hover:bg-[#33478D] hover:text-white transition-all"
                    >
                      <Download size={14} strokeWidth={2.5} /> Download
                    </button>
                    <button
                      onClick={() => handleReadOnline(pdf.url)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E5E9F0] text-[#5E6D8F] text-[12px] font-black hover:border-[#33478D] hover:text-[#33478D] transition-all"
                    >
                      <Eye size={14} strokeWidth={2.5} /> Read Online
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Resources Grid */}
        {visibleCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {visibleCards.map((res, idx) => (
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
                    <button
                      onClick={() => res.isPdf ? handleDownload(res.url, `${res.title.replace(/\s+/g, '-')}.pdf`) : handleReadOnline(res.url)}
                      className="text-[14px] font-black text-[#33478D] hover:underline flex items-center gap-2"
                    >
                      {res.action}
                      {res.isPdf ? <Download size={16} strokeWidth={3} /> : <ChevronRight size={16} strokeWidth={3} />}
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
              <h3 className="text-[22px] font-black mb-4">Can't find a guide?</h3>
              <p className="text-[14px] font-medium text-white/70 mb-8 max-w-[240px] leading-relaxed">
                Our experts can create custom resources based on your student's specific curriculum needs.
              </p>
              <button className="bg-white text-[#1E2B5A] px-10 py-4 rounded-xl font-black text-[15px] hover:bg-[#F8FAFD] transition-all relative z-10">
                Submit Request
              </button>
            </div>
          </div>
        )}

        {/* Global Help Footer */}
        <div className="w-full flex items-center justify-center gap-6 py-6 border-t border-[#E5E9F0]">
          <span className="text-[13px] font-bold text-[#A0A9C0] flex items-center gap-2">
            <HelpCircle size={16} /> Need immediate technical assistance?
          </span>
          <button className="text-[13px] font-black text-[#33478D] hover:underline">Chat with Support</button>
        </div>
      </main>

      <footer className="bg-white border-t border-[#E5E9F0] py-10 px-8 mt-4">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-[13px] font-bold text-[#8793AC]">
            © 2024 EchoLearn Education Platforms. All rights reserved.
          </span>
          <div className="flex items-center gap-10">
            {["Accessibility Center", "Privacy Policy", "Terms of Service", "Support"].map(link => (
              <Link key={link} href="#" className="text-[13px] font-bold text-[#8793AC] hover:text-[#33478D] transition-colors">{link}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
