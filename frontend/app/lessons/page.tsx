"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Grid,
  List,
  Mic,
  Play,
  RotateCcw,
  Sigma,
  FlaskConical,
  Languages,
  CheckCircle2
} from "lucide-react";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import { speak, getSpeechRecognition, tryUnlockAudio } from "@/lib/voiceUtils";

type LessonItem = {
  slug: string;
  id: string;
  title: string;
  subject: string;
  progress: number;
  status: "In Progress" | "Completed" | "Not Started";
  image: string;
  unit: string;
};


const SUBJECT_IMAGES: Record<string, string> = {
  "Mathematics": "/maths.png",
  "Science": "/lessons_livingthings.png",
  "English": "/english.png",
};

export default function LessonsListPage() {
  const router = useRouter();
  const [activeSubject, setActiveSubject] = useState("Mathematics");
  const [activeGrade, setActiveGrade] = useState("Grade 3");
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [allProgress, setAllProgress] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isListening, setIsListening] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const assistantRef = useRef(false);
  const voiceLessonsRef = useRef<LessonItem[]>([]);

  const subjects = [
    { name: "Mathematics", icon: Sigma, count: 10 },
    { name: "Science", icon: FlaskConical, count: 10 },
    { name: "English", icon: Languages, count: 10 },
  ];

  const grades = Array.from({ length: 10 }, (_, i) => `Grade ${i + 1}`);

  // Fetch Lessons & Progress
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5001/api/lessons?subject=${activeSubject}&grade=${activeGrade}`);
        const data = await res.json();

        const progRes = await fetch(`http://localhost:5001/api/progress/lessons`);
        const progData = await progRes.json();

        setLessons(data);
        setAllProgress(progData);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [activeSubject, activeGrade]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const [voiceStep, setVoiceStep] = useState<"IDLE" | "GRADE" | "SUBJECT" | "LESSON_SELECT" | "CONFIRM" | "READY">("IDLE");
  const [voiceGrade, setVoiceGrade] = useState("");
  const [voiceSubject, setVoiceSubject] = useState("");

  // Voice Navigation
  const startFlow = async () => {
    await tryUnlockAudio();
    setVoiceStep("GRADE");
    speak("Welcome to the lessons hub. The grades from 1 to 10 are available. Which grade are you choosing?", () => {
      // Logic handled by useEffect monitoring voiceStep
    });
  };

  const startAssistant = () => {
    if (assistantRef.current) return;
    assistantRef.current = true;
    const shouldVoiceStart = localStorage.getItem("voiceStart") === "true";
    if (shouldVoiceStart) localStorage.removeItem("voiceStart");
    startFlow();
  };

const stateRef = useRef<{
  voiceStep: "IDLE" | "GRADE" | "SUBJECT" | "LESSON_SELECT" | "CONFIRM" | "READY";
  voiceGrade: string;
  voiceSubject: string;
  activeSubject: string;
  activeGrade: string;
  lessons: LessonItem[];
}>({
  voiceStep,
  voiceGrade,
  voiceSubject,
  activeSubject,
  activeGrade,
  lessons,
});
  useEffect(() => {
    stateRef.current = { voiceStep, voiceGrade, voiceSubject, activeSubject, activeGrade, lessons };
  }, [voiceStep, voiceGrade, voiceSubject, activeSubject, activeGrade, lessons]);

  useEffect(() => {
    const recognition = getSpeechRecognition();
    if (!recognition) return;

    recognition.continuous     = true;
    recognition.interimResults = false;
    recognition.lang           = "en-US";

    // ── Low-level helpers ──────────────────────────────────────────────────
    const stopRec  = () => { try { recognition.stop(); } catch {} };
    const startRec = () => { try { recognition.start(); } catch {} };

    // Stop recognition, speak, then restart recognition after speech finishes
    const speakAndListen = (text: string, onEnd?: () => void) => {
      stopRec();
      speak(text, () => {
        onEnd?.();
        setTimeout(startRec, 400);
      });
    };

    recognition.onstart = () => setIsListening(true);

    recognition.onend = () => {
      setIsListening(false);
      // Always try to restart. If TTS is still playing, wait for it first.
      const tryRestart = () => {
        if (window.speechSynthesis.speaking) {
          setTimeout(tryRestart, 500);
          return;
        }
        startRec();
      };
      setTimeout(tryRestart, 400);
    };

    recognition.onerror = (e: any) => {
      const err = e?.error;
      if (err === "no-speech" || err === "audio-capture" || err === "network") {
        setTimeout(startRec, 1000);
      }
    };

    // ── Command handler ────────────────────────────────────────────────────
    recognition.onresult = (event: any) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      const current = stateRef.current;
      console.log(`Lessons voice [${current.voiceStep}] heard:`, command);

      if (command.includes("dashboard")) {
        speakAndListen("Returning to dashboard.", () => router.push("/Student/dashboard"));
        return;
      }

      if (command.includes("go to lessons") || command.includes("open lessons")) {
        speakAndListen("You are already in the lessons hub. Which grade would you like to choose?");
        return;
      }

      if (current.voiceStep === "GRADE") {
        const numberWords: Record<string, number> = {
          one: 1, two: 2, three: 3, four: 4, five: 5,
          six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
        };
        let num: number | null = null;
        const digitMatch = command.match(/\d+/);
        if (digitMatch) {
          num = parseInt(digitMatch[0]);
        } else {
          for (const [word, val] of Object.entries(numberWords)) {
            if (command.includes(word)) { num = val; break; }
          }
        }

        if (num !== null) {
          if (num >= 1 && num <= 10) {
            const selectedGrade = `Grade ${num}`;
            setVoiceGrade(selectedGrade);
            setActiveGrade(selectedGrade);
            setVoiceStep("SUBJECT");
            speakAndListen(
              `Grade ${num} selected. We have Mathematics, Science, and English available. Which subject are you choosing?`
            );
          } else {
            speakAndListen("I'm sorry, I couldn't find that grade. Please choose a grade between 1 and 10.");
          }
        } else {
          speakAndListen("I didn't hear a grade number. The grades from 1 to 10 are available. Which grade are you choosing?");
        }
        return;
      }

      if (current.voiceStep === "SUBJECT") {
        const found = subjects.find(s => command.includes(s.name.toLowerCase()));
        if (found) {
          setVoiceSubject(found.name);
          setActiveSubject(found.name);

          fetch(`http://localhost:5001/api/lessons?subject=${found.name}&grade=${current.voiceGrade}`)
            .then(r => r.json())
            .then((fetchedLessons: LessonItem[]) => {
              setLessons(fetchedLessons);
              voiceLessonsRef.current = fetchedLessons;

              if (fetchedLessons.length === 0) {
                setVoiceStep("SUBJECT");
                speakAndListen(`There are no lessons for ${found.name} in ${current.voiceGrade}. Please choose another subject.`);
              } else if (fetchedLessons.length === 1) {
                setVoiceStep("READY");
                speakAndListen(`There is one lesson available: ${fetchedLessons[0].title}. Say "start lesson" to begin.`);
              } else {
                setVoiceStep("LESSON_SELECT");
                const titles = fetchedLessons.map((l: LessonItem) => l.title).join(", ");
                speakAndListen(`We found ${fetchedLessons.length} lessons: ${titles}. Which lesson would you like?`);
              }
            })
            .catch(() => {
              setVoiceStep("SUBJECT");
              speakAndListen("I had trouble loading the lessons. Please say the subject again.");
            });
        } else {
          speakAndListen("I didn't catch that. We have Mathematics, Science, or English. Which subject are you choosing?");
        }
        return;
      }

      if (current.voiceStep === "LESSON_SELECT") {
        const selectedLesson = current.lessons.find((l: LessonItem) =>
          command.includes(l.title.toLowerCase()) || l.title.toLowerCase().includes(command)
        );
        if (selectedLesson) {
          setVoiceStep("READY");
          voiceLessonsRef.current = [selectedLesson];
          speakAndListen(`${selectedLesson.title} selected. Say "start lesson" to begin.`);
        } else {
          speakAndListen("I didn't catch that lesson name. Which lesson would you like to choose?");
        }
        return;
      }

      if (current.voiceStep === "READY") {
        const wantsStart =
          command.includes("start lesson") ||
          command.includes("start the lesson") ||
          command.includes("begin lesson") ||
          command.includes("begin the lesson") ||
          command === "start" ||
          command === "begin" ||
          command === "yes" ||
          command === "okay" ||
          command === "ok";

        if (wantsStart) {
          const matched = voiceLessonsRef.current[0] || current.lessons[0];
          if (matched) {
            speakAndListen(
              `Starting ${matched.title} for ${current.voiceGrade} ${current.voiceSubject}.`,
              () => {
                localStorage.setItem("voiceStart", "true");
                router.push(`/lessons/${matched.slug}`);
              }
            );
          } else {
            speakAndListen("I couldn't find any lessons. Let's start again. Which grade would you like?", () => {
              setVoiceStep("GRADE");
            });
          }
        } else {
          speakAndListen(`To begin, say "start lesson".`);
        }
        return;
      }

      if (command.includes("restart") || command.includes("help") || command.includes("start over")) {
        startFlow();
      }
    };

    // ── Auto-start ─────────────────────────────────────────────────────────
    const shouldVoiceStart = localStorage.getItem("voiceStart") === "true";
    let discoveryTimeout: any;
    if (shouldVoiceStart) {
      startAssistant();
    } else {
      discoveryTimeout = setTimeout(() => {
        if (stateRef.current.voiceStep === "IDLE") startAssistant();
      }, 1500);
    }

    // Start recognition immediately so commands are heard right away
    startRec();

    return () => {
      clearTimeout(discoveryTimeout);
      try {
        recognition.onend    = null;
        recognition.onstart  = null;
        recognition.onresult = null;
        recognition.onerror  = null;
        recognition.stop();
      } catch {}
    };
  }, [router]);

  // Only cancel speech when component fully unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      assistantRef.current = false;
    };
  }, []);

  const handleManualVoiceToggle = () => {
    tryUnlockAudio();
    if (voiceStep === "IDLE") {
      setActiveGrade("Grade 1"); // Reset context if needed
      assistantRef.current = false; // Force re-allow
      // We can't call startAssistant here easily because it's inside useEffect
      // Actually, let's just trigger startFlow directly if we want
      startFlow();
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans">
      <DashboardNavbar user={user} />

      <div className="flex-1 flex max-w-[1440px] mx-auto w-full">
        {/* SIDEBAR */}
        <aside className="w-[280px] bg-white border-r border-[#E5E9F0] p-8 hidden lg:block overflow-y-auto no-scrollbar">
          <div className="mb-10">
            <h3 className="text-[12px] font-black text-[#A0A9C0] tracking-[0.14em] uppercase mb-6">Subject</h3>
            <div className="space-y-2">
              {subjects.map((sub) => (
                <button
                  key={sub.name}
                  onClick={() => setActiveSubject(sub.name)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 ${activeSubject === sub.name
                    ? "bg-[#33478D] text-white shadow-lg shadow-blue-900/10"
                    : "text-[#5E6D8F] hover:bg-[#F5F7FB]"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <sub.icon size={18} />
                    <span className="text-[15px] font-bold">{sub.name}</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${activeSubject === sub.name ? "bg-white/20" : "bg-[#F0F2F5] text-[#8793AC]"
                    }`}>
                    {sub.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-black text-[#A0A9C0] tracking-[0.14em] uppercase mb-6">Grade</h3>
            <div className="grid grid-cols-2 gap-3">
              {grades.map((grade) => (
                <button
                  key={grade}
                  onClick={() => setActiveGrade(grade)}
                  className={`py-3 rounded-xl border-2 text-[13px] font-black transition-all ${activeGrade === grade
                    ? "border-[#33478D] bg-white text-[#33478D] ring-1 ring-[#33478D]"
                    : "border-transparent bg-white text-[#8793AC] hover:border-[#D5DCEB]"
                    }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-8 md:p-12 min-h-screen">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-[32px] font-black text-[#1E273F] tracking-tight">{activeSubject} Lessons</h2>
              <p className="text-[#8793AC] font-bold mt-1 text-[16px]">Continue your learning journey in {activeGrade}</p>
            </div>

            <div className="flex items-center bg-white rounded-xl border border-[#E5E9F0] p-1 shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-[#33478D] text-white" : "text-[#A0A9C0] hover:bg-gray-50"}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-[#33478D] text-white" : "text-[#A0A9C0] hover:bg-gray-50"}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
              <div className="w-16 h-16 border-4 border-[#33478D] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-6 font-black text-[#33478D] animate-pulse">Fetching lessons...</p>
            </div>
          ) : lessons.length === 0 ? (
            <div className="bg-white rounded-[24px] border-2 border-dashed border-[#D5DCEB] p-20 text-center">
              <div className="w-20 h-20 bg-[#F5F7FB] rounded-full flex items-center justify-center mx-auto mb-6">
                <Sigma size={32} className="text-[#8793AC]" />
              </div>
              <h3 className="text-[22px] font-black text-[#1E273F]">No lessons found</h3>
              <p className="text-[#8793AC] font-bold mt-2">Try a different grade or subject</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-40">
              {lessons.map((lesson) => {
                const progObj = allProgress.find(p => p.lessonSlug === lesson.slug);
                const currentProgress = progObj ? progObj.progress : (lesson.progress || 0);
                const currentStatus: "Completed" | "In Progress" | "Not Started" =
                  currentProgress >= 100 ? "Completed" :
                  currentProgress > 0    ? "In Progress" :
                                           "Not Started";

                const lessonImage = lesson.image || SUBJECT_IMAGES[lesson.subject] || "/book.png";

                return (
                  <div
                    key={lesson.slug}
                    className="bg-white rounded-[24px] border border-[#E5E9F0] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col h-full"
                  >
                    <div className="h-[200px] relative overflow-hidden bg-gray-100">
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 rounded-md bg-[#33478D] text-white text-[10px] font-black uppercase tracking-widest bg-opacity-90 backdrop-blur-sm">
                          {lesson.subject}
                        </span>
                      </div>
                      <img
                        src={lessonImage}
                        alt={lesson.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          const fallback = SUBJECT_IMAGES[lesson.subject] || "/book.png";
                          if (!img.src.endsWith(fallback)) img.src = fallback;
                        }}
                      />
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-[22px] font-black text-[#1E273F] leading-tight mb-4 group-hover:text-[#33478D] transition-colors line-clamp-2">
                        {lesson.title}
                      </h3>

                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-3 text-[12px] font-black uppercase tracking-wider">
                          <span className={currentStatus === "Completed" ? "text-green-500 flex items-center gap-1.5" : "text-[#33478D]"}>
                            {currentStatus === "Completed" && <CheckCircle2 size={14} />}
                            {currentStatus}
                          </span>
                          <span className="text-[#8793AC]">{currentProgress}%</span>
                        </div>

                        <div className="h-2 w-full bg-[#F0F2F5] rounded-full overflow-hidden mb-8">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${currentStatus === "Completed" ? "bg-green-500" : "bg-[#33478D]"
                              }`}
                            style={{ width: `${currentProgress}%` }}
                          ></div>
                        </div>

                        <button
                          onClick={() => router.push(`/lessons/${lesson.slug}`)}
                          className={`w-full py-4 rounded-xl font-black text-[15px] flex items-center justify-center gap-3 transition-all duration-300 ${currentStatus === "Completed"
                            ? "bg-[#F5F7FB] text-[#33478D] hover:bg-[#EAEFF7]"
                            : "bg-[#33478D] text-white shadow-lg shadow-blue-900/10 hover:bg-[#2A3B7A] hover:-translate-y-1"
                            }`}
                        >
                          {currentStatus === "Completed" ? (
                            <>
                              <RotateCcw size={18} />
                              Review Lesson
                            </>
                          ) : (
                            <>
                              <Play size={18} fill="currentColor" />
                              {currentStatus === "Not Started" ? "Start Lesson" : "Resume Lesson"}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* FLOAT VOICE ACTION */}
      <div className="fixed bottom-10 right-10 z-[100]">
        <button
          onClick={handleManualVoiceToggle}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isListening ? "bg-[#33478D] scale-110" : "bg-white text-[#33478D] hover:scale-105"
            }`}
        >
          {isListening ? (
            <div className="relative">
              <Mic size={28} className="text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            </div>
          ) : (
            <Mic size={28} />
          )}
        </button>
      </div>
    </div>
  );
}
