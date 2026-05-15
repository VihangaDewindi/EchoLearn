"use client";

import React, { useState, useEffect } from "react";
import TeacherNavbar from "@/components/Teacher/TeacherNavbar";
import TeacherFooter from "@/components/Teacher/TeacherFooter";
import {
  Plus, Search, Edit3, ChevronUp, ChevronDown,
  Eye, MoreVertical, PlayCircle, FileText, HelpCircle,
  Layers, FlaskConical, BookOpen, X, Save, Loader2,
  ExternalLink, Zap,
} from "lucide-react";

const API      = "http://localhost:5001";
const SUBJECTS = ["Mathematics", "Science", "English"];
const GRADES   = Array.from({ length: 10 }, (_, i) => `${i + 1}`);
const LEVELS   = ["Beginner", "Intermediate", "Advanced"];

const SUBJECT_ICONS: Record<string, React.ElementType> = {
  Mathematics: Layers,
  Math:        Layers,
  Science:     FlaskConical,
  English:     BookOpen,
};

const LESSON_TYPE_CONFIG: Record<string, { iconColor: string; bg: string; icon: React.ElementType }> = {
  Video:    { icon: PlayCircle, iconColor: "text-blue-500",   bg: "bg-blue-50"   },
  Reading:  { icon: FileText,   iconColor: "text-indigo-500", bg: "bg-indigo-50" },
  Quiz:     { icon: HelpCircle, iconColor: "text-orange-500", bg: "bg-orange-50" },
  Activity: { icon: Layers,     iconColor: "text-green-500",  bg: "bg-green-50"  },
};

export default function CurriculumPage() {
  const [activeSubject, setActiveSubject] = useState("Mathematics");
  const [expandedUnit, setExpandedUnit]   = useState<string | null>(null);
  const [curriculum, setCurriculum]       = useState<Record<string, any[]>>({});
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [toast, setToast]                 = useState("");

  // Add Unit dialog
  const [addUnitOpen, setAddUnitOpen] = useState(false);
  const [unitForm, setUnitForm]       = useState({ title: "", grade: "1", lessonNames: "" });
  const [unitSaving, setUnitSaving]   = useState(false);

  // Edit Unit dialog
  const [editUnit, setEditUnit]       = useState<any>(null);
  const [editTitle, setEditTitle]     = useState("");
  const [editSaving, setEditSaving]   = useState(false);

  // Edit Lesson dialog
  const [editLesson, setEditLesson]   = useState<any>(null);
  const [lessonForm, setLessonForm]   = useState({ title: "", subject: "", grade: "", unit: "", duration: "", level: "", description: "" });
  const [lessonSaving, setLessonSaving] = useState(false);

  // Add Lesson dialog
  const [addLessonOpen, setAddLessonOpen] = useState(false);
  const [newLessonForm, setNewLessonForm] = useState({ title: "", subject: "Mathematics", grade: "1", description: "", duration: "12 min read" });
  const [newLessonSaving, setNewLessonSaving] = useState(false);

  // Generate Quiz modal
  const [quizLesson, setQuizLesson]   = useState<any>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizData, setQuizData]       = useState<any[]>([]);
  const [quizSource, setQuizSource]   = useState("");
  const [quizSaving, setQuizSaving]   = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchCurriculum = () => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/teacher/curriculum`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setCurriculum(d || {});
        const subs = Object.keys(d || {}).filter((s) => SUBJECTS.includes(s));
        if (subs.length > 0) setActiveSubject(subs[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(fetchCurriculum, []);

  const subjects     = Object.keys(curriculum).filter((s) => SUBJECTS.includes(s));
  const currentUnits = (curriculum[activeSubject] || []).filter((u: any) => {
    if (!search) return true;
    return (
      u.title.toLowerCase().includes(search.toLowerCase()) ||
      u.lessons?.some((l: any) => l.name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  /* ── Add Unit ── */
  const handleAddUnit = async () => {
    if (!unitForm.title.trim()) return;
    setUnitSaving(true);
    try {
      const token = localStorage.getItem("token");
      const lessonNames = unitForm.lessonNames.split("\n").map((l) => l.trim()).filter(Boolean);
      const res = await fetch(`${API}/api/teacher/units`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ title: unitForm.title, subject: activeSubject, grade: unitForm.grade, lessonNames }),
      });
      if (res.ok) {
        setAddUnitOpen(false);
        setUnitForm({ title: "", grade: "1", lessonNames: "" });
        showToast("Unit added!");
        fetchCurriculum();
      } else { showToast("Failed to add unit."); }
    } catch { showToast("Network error."); }
    finally { setUnitSaving(false); }
  };

  /* ── Edit Unit ── */
  const handleEditUnitSave = async () => {
    if (!editUnit || !editTitle.trim()) return;
    setEditSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/teacher/units/${editUnit._id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ title: editTitle }),
      });
      if (res.ok) {
        setEditUnit(null);
        showToast("Unit updated!");
        fetchCurriculum();
      } else {
        setCurriculum((prev) => {
          const next = { ...prev };
          next[activeSubject] = next[activeSubject].map((u) =>
            u._id === editUnit._id ? { ...u, title: editTitle } : u
          );
          return next;
        });
        setEditUnit(null);
        showToast("Unit title updated.");
      }
    } catch { showToast("Network error."); }
    finally { setEditSaving(false); }
  };

  /* ── Edit Lesson ── */
  const openEditLesson = (lesson: any) => {
    setEditLesson(lesson);
    setLessonForm({
      title:       lesson.name || lesson.title || "",
      subject:     activeSubject,
      grade:       lesson.grade || "1",
      unit:        lesson.unit  || "Teacher Created",
      duration:    lesson.duration || "12 min read",
      level:       lesson.level    || "Beginner",
      description: lesson.description || "",
    });
  };

  const handleSaveLesson = async () => {
    if (!editLesson?.slug || !lessonForm.title.trim()) return;
    setLessonSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/teacher/lessons/${editLesson.slug}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify(lessonForm),
      });
      if (res.ok) {
        setEditLesson(null);
        showToast("Lesson updated!");
        fetchCurriculum();
      } else { showToast("Failed to update lesson."); }
    } catch { showToast("Network error."); }
    finally { setLessonSaving(false); }
  };

  /* ── Add Lesson ── */
  const handleAddLesson = async () => {
    if (!newLessonForm.title.trim()) return;
    setNewLessonSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/teacher/lessons`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify(newLessonForm),
      });
      if (res.ok) {
        setAddLessonOpen(false);
        setNewLessonForm({ title: "", subject: "Mathematics", grade: "1", description: "", duration: "12 min read" });
        showToast("Lesson created!");
        fetchCurriculum();
      } else { showToast("Failed to create lesson."); }
    } catch { showToast("Network error."); }
    finally { setNewLessonSaving(false); }
  };

  /* ── Generate Quiz ── */
  const generateQuizQuestions = async (lesson: any) => {
    setQuizData([]);
    setQuizSource("");
    setQuizLoading(true);
    try {
      const res = await fetch(`${API}/api/ai/generate-quiz`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ lessonSlug: lesson.slug }),
      });
      const data = await res.json();
      setQuizData(data.quiz || []);
      setQuizSource(data.source || "ai");
    } catch { showToast("Failed to generate quiz."); }
    finally { setQuizLoading(false); }
  };

  const handleGenerateQuiz = async (lesson: any) => {
    if (!lesson.slug) { showToast("Cannot generate quiz — no lesson slug."); return; }
    setQuizLesson(lesson);
    await generateQuizQuestions(lesson);
  };

  /* ── Save Quiz to Lesson ── */
  const handleSaveQuiz = async () => {
    if (!quizLesson?.slug || quizData.length === 0) return;
    setQuizSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/teacher/lessons/${quizLesson.slug}/save-quiz`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ quiz: quizData }),
      });
      if (res.ok) {
        showToast(`Quiz saved to "${quizLesson.name}" successfully!`);
      } else {
        showToast("Failed to save quiz.");
      }
    } catch { showToast("Network error saving quiz."); }
    finally { setQuizSaving(false); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col font-sans text-left">
      <TeacherNavbar />

      {toast && (
        <div className="fixed top-4 right-4 z-[100] bg-[#1E2B5A] text-white px-6 py-3 rounded-xl shadow-xl font-bold text-[14px]">
          {toast}
        </div>
      )}

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
            <p className="text-[#8793AC] font-semibold mt-1">Organize units and lessons for each subject and grade.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAddLessonOpen(true)}
              className="flex items-center gap-2 bg-white border border-[#E5E9F0] text-[#33478D] px-5 py-3 rounded-xl font-black text-[14px] hover:bg-[#F5F7FB] transition-all shadow-sm"
            >
              <Plus size={18} strokeWidth={2.5} /> Add Lesson
            </button>
            <button
              onClick={() => setAddUnitOpen(true)}
              className="flex items-center gap-2 bg-[#33478D] text-white px-6 py-3 rounded-xl font-black text-[14px] shadow-lg shadow-blue-900/10 hover:bg-[#2A3B7A] transition-all"
            >
              <Edit3 size={18} strokeWidth={2.5} /> Add Unit
            </button>
          </div>
        </div>

        {/* Subject Tabs */}
        <div className="flex items-center gap-10 mb-8 border-b border-[#E5E9F0] overflow-x-auto">
          {loading ? (
            <div className="pb-4 text-[#8793AC] font-bold">Loading subjects...</div>
          ) : subjects.length === 0 ? (
            <div className="pb-4 text-[#8793AC] font-bold">No curriculum data. Run the seed script to populate lessons.</div>
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
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#33478D] rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl border border-[#E5E9F0] shadow-sm mb-8 focus-within:border-[#33478D] transition-all">
          <Search size={20} className="text-[#A0A9C0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeSubject} units or lessons…`}
            className="bg-transparent text-[15px] font-bold text-[#1E273F] focus:outline-none placeholder-[#A0A9C0] w-full"
          />
        </div>

        {/* Units / Grade Groups */}
        <div className="space-y-6 mb-10">
          {loading ? (
            <div className="p-10 text-center text-[#8793AC] font-bold">Loading curriculum...</div>
          ) : currentUnits.length === 0 ? (
            <div className="p-10 text-center text-[#8793AC] font-bold">
              {search ? `No results for "${search}".` : `No units found for ${activeSubject}.`}
            </div>
          ) : currentUnits.map((unit: any) => (
            <div key={unit._id} className="bg-white rounded-[24px] border border-[#E5E9F0] shadow-sm overflow-hidden">
              {/* Unit Header */}
              <div
                onClick={() => setExpandedUnit(expandedUnit === unit._id ? null : unit._id)}
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 flex flex-col gap-1 items-center justify-center text-[#D5DCEB]">
                    {[0, 1, 2].map((i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-current" />)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-[20px] font-black text-[#1E273F]">{unit.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-widest ${
                        unit.isCustom ? "bg-[#FFF8EC] text-[#C67B00]" : "bg-[#E9F7EF] text-[#2E7D32]"
                      }`}>
                        {unit.isCustom ? "CUSTOM" : "ACTIVE"}
                      </span>
                    </div>
                    <p className="text-[13px] font-bold text-[#8793AC] mt-1">
                      {unit.lessonCount} Lesson{unit.lessonCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditUnit(unit); setEditTitle(unit.title); }}
                    className="p-2 text-[#8793AC] hover:bg-[#F5F7FB] hover:text-[#33478D] rounded-lg transition-all"
                    title="Edit unit title"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button onClick={(e) => e.stopPropagation()} className="p-2 text-[#8793AC] hover:bg-[#F5F7FB] rounded-lg transition-all">
                    <Eye size={20} />
                  </button>
                  <button onClick={(e) => e.stopPropagation()} className="p-2 text-[#8793AC] hover:bg-[#F5F7FB] rounded-lg transition-all">
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
                    const config    = LESSON_TYPE_CONFIG[lesson.type] || LESSON_TYPE_CONFIG.Reading;
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

                        {/* Lesson actions — only for DB lessons that have a slug */}
                        <div className="flex items-center gap-2">
                          {lesson.slug && (
                            <>
                              <button
                                onClick={() => window.open(`/lessons/${lesson.slug}`, "_blank")}
                                title="Preview lesson"
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F5F7FB] text-[#33478D] text-[12px] font-black hover:bg-[#EAEFF7] transition-all"
                              >
                                <ExternalLink size={14} strokeWidth={2.5} /> Preview
                              </button>
                              <button
                                onClick={() => openEditLesson(lesson)}
                                title="Edit lesson"
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F5F7FB] text-[#5E6D8F] text-[12px] font-black hover:bg-[#EAEFF7] hover:text-[#33478D] transition-all"
                              >
                                <Edit3 size={14} strokeWidth={2.5} /> Edit
                              </button>
                              <button
                                onClick={() => handleGenerateQuiz(lesson)}
                                title="Generate quiz from lesson"
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFF8EC] text-[#C67B00] text-[12px] font-black hover:bg-[#FFE9B0] transition-all"
                              >
                                <Zap size={14} strokeWidth={2.5} /> Generate Quiz
                              </button>
                            </>
                          )}
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
        <button
          onClick={() => setAddUnitOpen(true)}
          className="w-full py-6 flex items-center justify-center gap-3 text-[#33478D] font-black hover:bg-[#33478D]/5 rounded-2xl transition-all border-2 border-dashed border-transparent hover:border-[#33478D]/20"
        >
          <div className="w-8 h-8 rounded-full bg-[#33478D] text-white flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Plus size={20} strokeWidth={3} />
          </div>
          Add New Unit to {activeSubject}
        </button>
      </main>

      <TeacherFooter />

      {/* ── Add Unit Dialog ── */}
      {addUnitOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[480px] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E273F]">Add New Unit</h2>
              <button onClick={() => setAddUnitOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Unit Title *</label>
                <input type="text" value={unitForm.title} onChange={(e) => setUnitForm({ ...unitForm, title: e.target.value })}
                  placeholder="e.g. Algebra Basics"
                  className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D]" />
              </div>
              <div>
                <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Subject</label>
                <input type="text" value={activeSubject} readOnly className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#8793AC] bg-[#F8FAFD]" />
              </div>
              <div>
                <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Grade Level</label>
                <select value={unitForm.grade} onChange={(e) => setUnitForm({ ...unitForm, grade: e.target.value })}
                  className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] bg-white">
                  {GRADES.map((g) => <option key={g} value={g}>Grade {g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Lesson Names (one per line, optional)</label>
                <textarea value={unitForm.lessonNames} onChange={(e) => setUnitForm({ ...unitForm, lessonNames: e.target.value })}
                  placeholder={"Lesson 1: Introduction\nLesson 2: Practice"} rows={4}
                  className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[14px] font-medium text-[#1E273F] focus:outline-none focus:border-[#33478D] resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setAddUnitOpen(false)} className="flex-1 py-3 rounded-xl border border-[#E5E9F0] text-[14px] font-black text-[#8793AC] hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleAddUnit} disabled={unitSaving || !unitForm.title.trim()}
                className="flex-1 py-3 rounded-xl bg-[#33478D] text-white text-[14px] font-black hover:bg-[#2A3B7A] transition disabled:opacity-50">
                {unitSaving ? "Adding…" : "Add Unit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Unit Dialog ── */}
      {editUnit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[420px] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E273F]">Edit Unit</h2>
              <button onClick={() => setEditUnit(null)} className="p-2 hover:bg-gray-100 rounded-xl transition"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <div>
              <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Unit Title</label>
              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D]" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditUnit(null)} className="flex-1 py-3 rounded-xl border border-[#E5E9F0] text-[14px] font-black text-[#8793AC] hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleEditUnitSave} disabled={editSaving || !editTitle.trim()}
                className="flex-1 py-3 rounded-xl bg-[#33478D] text-white text-[14px] font-black flex items-center justify-center gap-2 hover:bg-[#2A3B7A] transition disabled:opacity-50">
                <Save size={16} /> {editSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Lesson Dialog ── */}
      {editLesson && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[520px] p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E273F]">Edit Lesson</h2>
              <button onClick={() => setEditLesson(null)} className="p-2 hover:bg-gray-100 rounded-xl transition"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Title *</label>
                <input type="text" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Subject</label>
                  <select value={lessonForm.subject} onChange={(e) => setLessonForm({ ...lessonForm, subject: e.target.value })}
                    className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] bg-white">
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Grade</label>
                  <select value={lessonForm.grade} onChange={(e) => setLessonForm({ ...lessonForm, grade: e.target.value })}
                    className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] bg-white">
                    {GRADES.map((g) => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Duration</label>
                  <input type="text" value={lessonForm.duration} onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                    placeholder="12 min read"
                    className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D]" />
                </div>
                <div>
                  <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Level</label>
                  <select value={lessonForm.level} onChange={(e) => setLessonForm({ ...lessonForm, level: e.target.value })}
                    className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] bg-white">
                    {LEVELS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Unit</label>
                <input type="text" value={lessonForm.unit} onChange={(e) => setLessonForm({ ...lessonForm, unit: e.target.value })}
                  placeholder="e.g. Fractions & Decimals"
                  className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D]" />
              </div>
              <div>
                <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  rows={3} className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setEditLesson(null)} className="flex-1 py-3 rounded-xl border border-[#E5E9F0] text-[14px] font-black text-[#8793AC] hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleSaveLesson} disabled={lessonSaving || !lessonForm.title.trim()}
                className="flex-1 py-3 rounded-xl bg-[#33478D] text-white text-[14px] font-black flex items-center justify-center gap-2 hover:bg-[#2A3B7A] transition disabled:opacity-50">
                <Save size={16} /> {lessonSaving ? "Saving…" : "Save Lesson"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Lesson Dialog ── */}
      {addLessonOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[480px] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-[#1E273F]">Add New Lesson</h2>
              <button onClick={() => setAddLessonOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition"><X size={20} className="text-[#8793AC]" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Lesson Title *</label>
                <input type="text" value={newLessonForm.title} onChange={(e) => setNewLessonForm({ ...newLessonForm, title: e.target.value })}
                  placeholder="e.g. Introduction to Fractions"
                  className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Subject *</label>
                  <select value={newLessonForm.subject} onChange={(e) => setNewLessonForm({ ...newLessonForm, subject: e.target.value })}
                    className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] bg-white">
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Grade *</label>
                  <select value={newLessonForm.grade} onChange={(e) => setNewLessonForm({ ...newLessonForm, grade: e.target.value })}
                    className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] bg-white">
                    {GRADES.map((g) => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Duration</label>
                <input type="text" value={newLessonForm.duration} onChange={(e) => setNewLessonForm({ ...newLessonForm, duration: e.target.value })}
                  placeholder="e.g. 15 min read"
                  className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D]" />
              </div>
              <div>
                <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea value={newLessonForm.description} onChange={(e) => setNewLessonForm({ ...newLessonForm, description: e.target.value })}
                  placeholder="Brief overview…" rows={3}
                  className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setAddLessonOpen(false)} className="flex-1 py-3 rounded-xl border border-[#E5E9F0] text-[14px] font-black text-[#8793AC] hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleAddLesson} disabled={newLessonSaving || !newLessonForm.title.trim()}
                className="flex-1 py-3 rounded-xl bg-[#33478D] text-white text-[14px] font-black hover:bg-[#2A3B7A] transition disabled:opacity-50">
                {newLessonSaving ? "Creating…" : "Create Lesson"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Generate Quiz Modal ── */}
      {quizLesson && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[680px] max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-8 border-b border-[#E5E9F0]">
              <div>
                <h2 className="text-[20px] font-black text-[#1E273F]">Generated Quiz</h2>
                <p className="text-[13px] font-bold text-[#8793AC] mt-0.5">
                  {quizLesson.name} · {quizSource === "ai" ? "AI Generated" : "Lesson-based fallback"}
                </p>
              </div>
              <button onClick={() => { setQuizLesson(null); setQuizData([]); }} className="p-2 hover:bg-gray-100 rounded-xl transition">
                <X size={20} className="text-[#8793AC]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {quizLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 size={36} className="text-[#33478D] animate-spin" />
                  <p className="text-[15px] font-bold text-[#8793AC]">Generating quiz questions…</p>
                </div>
              ) : quizData.length === 0 ? (
                <p className="text-center text-[#8793AC] font-bold py-10">No questions generated. The lesson may need more content.</p>
              ) : (
                <div className="space-y-6">
                  {quizData.map((q: any, qi: number) => (
                    <div key={qi} className="bg-[#F8FAFD] rounded-[16px] p-6 border border-[#E5E9F0]">
                      <p className="text-[15px] font-black text-[#1E273F] mb-4">
                        <span className="text-[#33478D]">Q{qi + 1}.</span> {q.question}
                      </p>
                      <div className="space-y-2">
                        {(q.options || []).map((opt: any) => (
                          <div key={opt.letter} className={`flex items-start gap-3 p-3 rounded-xl text-[14px] font-bold border ${
                            opt.isCorrect
                              ? "bg-green-50 border-green-200 text-green-800"
                              : "bg-white border-[#E5E9F0] text-[#5E6D8F]"
                          }`}>
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-black shrink-0 ${
                              opt.isCorrect ? "bg-green-500 text-white" : "bg-[#E5E9F0] text-[#8793AC]"
                            }`}>{opt.letter}</span>
                            {opt.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!quizLoading && quizData.length > 0 && (
              <div className="p-6 border-t border-[#E5E9F0] bg-[#F8FAFD] rounded-b-[28px] flex items-center justify-between gap-4">
                <p className="text-[12px] font-black text-[#8793AC]">
                  {quizData.length} questions · {quizSource === "ai" ? "AI Generated" : "Lesson-based"}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => quizLesson && generateQuizQuestions(quizLesson)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F5F7FB] text-[#33478D] text-[13px] font-black hover:bg-[#EAEFF7] transition-all"
                  >
                    <Zap size={14} strokeWidth={2.5} /> Regenerate
                  </button>
                  <button
                    onClick={handleSaveQuiz}
                    disabled={quizSaving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#33478D] text-white text-[13px] font-black hover:bg-[#2A3B7A] transition-all disabled:opacity-50"
                  >
                    <Save size={14} strokeWidth={2.5} />
                    {quizSaving ? "Saving…" : "Save to Lesson"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
