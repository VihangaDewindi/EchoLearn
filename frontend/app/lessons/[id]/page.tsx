"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import {
  ArrowLeft, Clock3, BarChart3, Mic,
  SkipBack, Pause, Play, SkipForward,
  SquarePen, MonitorPlay, ChevronDown, Settings,
} from "lucide-react";
import { speak, getSpeechRecognition, tryUnlockAudio } from "@/lib/voiceUtils";

type LessonBlock =
  | { type: "paragraph"; text: string }
  | { type: "highlight"; text: string }
  | { type: "cards"; items: { title: string; text: string; icon?: string }[] }
  | { type: "quote"; text: string }
  | { type: "visualizer"; text: string };

type Lesson = {
  _id: string; slug: string; title: string; subject: string;
  unit: string; duration: string; level: string; progress: number;
  description?: string; image?: string; quizRoute?: string;
  blocks: LessonBlock[];
};

export default function LessonReaderPage() {
  const router   = useRouter();
  const params   = useParams();
  const lessonId = params?.id as string;

  const [user, setUser]         = useState<any>(null);
  const [lesson, setLesson]     = useState<Lesson | null>(null);
  const [loading, setLoading]   = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);

  const hasStartedRef   = useRef(false);
  const currentBlockRef = useRef(0);
  const lastSpokenRef   = useRef("");
  const readableRef     = useRef<{ content: string }[]>([]);
  // "READING" only — mode selection removed (student is voice-only)
  const voiceStepRef    = useRef<"READING">("READING");
  const recognitionRef  = useRef<any>(null);

  useEffect(() => {
    const s = localStorage.getItem("user");
    if (s) setUser(JSON.parse(s));
  }, []);

  useEffect(() => {
    if (!lessonId) return;
    fetch(`http://localhost:5001/api/lessons/${lessonId}`)
      .then(r => r.json())
      .then(d => { setLesson(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [lessonId]);

  const readableBlocks = useMemo(() => {
    if (!lesson) return [];
    return lesson.blocks.flatMap((b) => {
      if (b.type === "paragraph" || b.type === "highlight" || b.type === "quote" || b.type === "visualizer")
        return [{ content: b.text }];
      if (b.type === "cards")
        return [{ content: b.items.map(i => `${i.title}. ${i.text}`).join(". ") }];
      return [];
    });
  }, [lesson]);

  useEffect(() => { readableRef.current = readableBlocks; }, [readableBlocks]);

  // ── Voice engine ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!lesson) return;

    const recognition = getSpeechRecognition();
    if (!recognition) return;
    recognitionRef.current = recognition;

    let keepListening = true;
    let isSpeaking    = false;

    const stopListening  = () => { try { recognition.stop(); } catch {} };
    const startListening = () => {
      if (!keepListening || isSpeaking) return;
      try { recognition.start(); } catch {}
    };

    const speakThen = (text: string, onEnd?: () => void, resumeAfter = true) => {
      isSpeaking = true;
      setIsPlaying(true);
      lastSpokenRef.current = text;
      stopListening();
      speak(text, () => {
        isSpeaking = false;
        setIsPlaying(false);
        onEnd?.();
        if (resumeAfter && keepListening) setTimeout(startListening, 400);
      });
    };

    const readFromBlock = (idx: number) => {
      const blocks = readableRef.current;
      if (idx >= blocks.length) {
        speakThen(
          `You've reached the end of the lesson — "${lesson.title}". ` +
          `Fantastic work! Say "go to quiz" to test your knowledge, or "go to lessons" to go back.`
        );
        return;
      }
      currentBlockRef.current = idx;
      setCurrentBlockIndex(idx);

      speakThen(blocks[idx].content, () => {
        if (keepListening && voiceStepRef.current === "READING") {
          setTimeout(() => readFromBlock(idx + 1), 600);
        }
      });
    };

    const startReadingFlow = () => {
      voiceStepRef.current = "READING";
      speakThen(
        `Great! Starting the lesson now. You can say "pause", "repeat", "next", "previous", or "go to quiz" at any time.`,
        () => {
          currentBlockRef.current = 0;
          setCurrentBlockIndex(0);
          setTimeout(() => readFromBlock(0), 400);
        }
      );
    };

    // ── Greeting — straight to reading, no mode selection ─────────────────
    const startAssistant = async () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      await tryUnlockAudio();
      speakThen(
        `Welcome! You're now in the lesson "${lesson.title}". Starting in just a moment.`,
        () => setTimeout(startReadingFlow, 600)
      );
    };

    recognition.continuous    = true;
    recognition.interimResults = false;
    recognition.lang          = "en-US";
    recognition.maxAlternatives = 3;

    recognition.onstart = () => setIsListening(true);

    // TTS-aware restart: poll speechSynthesis.speaking before calling start()
    recognition.onend = () => {
      setIsListening(false);
      if (!keepListening) return;
      const tryRestart = () => {
        if (window.speechSynthesis.speaking) { setTimeout(tryRestart, 500); return; }
        if (keepListening && !isSpeaking) startListening();
      };
      setTimeout(tryRestart, 600);
    };

    // Restart recognition after recoverable errors
    recognition.onerror = (e: any) => {
      const err = e?.error;
      console.warn("Lesson recognition error:", err);
      if (err === "no-speech" || err === "audio-capture" || err === "network") {
        setTimeout(startListening, 1200);
      }
    };

    recognition.onresult = (event: any) => {
      // Check all alternatives for better command matching
      let cmd = "";
      for (let i = 0; i < event.results.length; i++) {
        const r = event.results[event.results.length - 1 - i];
        if (r && r[0]) { cmd = r[0].transcript.toLowerCase().trim(); break; }
      }
      console.log(`[Lesson voice] heard:`, cmd);

      if (cmd.includes("pause") || cmd.includes("stop")) {
        keepListening = false;
        window.speechSynthesis.cancel();
        isSpeaking = false; setIsPlaying(false);
        speakThen(`Paused. Say "resume" or "next" when you're ready.`, () => {
          keepListening = true;
        });
        return;
      }
      if (cmd.includes("resume") || cmd.includes("continue") || cmd.includes("play")) {
        readFromBlock(currentBlockRef.current);
        return;
      }
      if (cmd.includes("repeat")) {
        if (lastSpokenRef.current) speakThen(lastSpokenRef.current);
        return;
      }
      if (cmd.includes("next")) {
        window.speechSynthesis.cancel();
        readFromBlock(Math.min(currentBlockRef.current + 1, readableRef.current.length - 1));
        return;
      }
      if (cmd.includes("previous") || cmd.includes("go back")) {
        window.speechSynthesis.cancel();
        readFromBlock(Math.max(currentBlockRef.current - 1, 0));
        return;
      }
      if (cmd.includes("quiz") || cmd.includes("go to quiz")) {
        keepListening = false;
        stopListening();
        speakThen("Opening the quiz now. Good luck!", () => {
          router.push(lesson.quizRoute || `/quiz?lesson=${lesson.slug}`);
        }, false);
        return;
      }
      if (cmd.includes("lesson") || cmd.includes("back")) {
        keepListening = false;
        stopListening();
        speakThen("Heading back to the lessons hub.", () => {
          localStorage.setItem("voiceStart", "true");
          router.push("/lessons");
        }, false);
        return;
      }
      if (cmd.includes("where am i") || cmd.includes("where")) {
        speakThen(
          `You're in the lesson "${lesson.title}". ` +
          `You can say next, previous, pause, repeat, or go to quiz.`
        );
        return;
      }
    };

    // Start recognition immediately — before TTS begins
    setTimeout(startListening, 200);
    startAssistant();

    const unlock = async () => { await tryUnlockAudio(); startAssistant(); };
    window.addEventListener("click",   unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      keepListening = false;
      // Do NOT reset hasStartedRef — prevents double-greeting on Strict Mode re-mount
      window.removeEventListener("click",   unlock);
      window.removeEventListener("keydown", unlock);
      try {
        recognition.onstart  = null;
        recognition.onend    = null;
        recognition.onresult = null;
        recognition.onerror  = null;
        recognition.stop();
      } catch {}
      window.speechSynthesis.cancel();
      setIsListening(false);
      setIsPlaying(false);
    };
  }, [lesson, router]);

  // Manual playback controls
  const pauseSpeech       = () => { window.speechSynthesis.cancel(); setIsPlaying(false); };
  const speakCurrentBlock = () => {
    const b = readableBlocks[currentBlockIndex];
    if (b) { setIsPlaying(true); speak(b.content, () => setIsPlaying(false)); }
  };
  const nextBlock = () => {
    const idx = Math.min(currentBlockIndex + 1, readableBlocks.length - 1);
    setCurrentBlockIndex(idx); currentBlockRef.current = idx;
    const b = readableBlocks[idx];
    if (b) { setIsPlaying(true); speak(b.content, () => setIsPlaying(false)); }
  };
  const prevBlock = () => {
    const idx = Math.max(currentBlockIndex - 1, 0);
    setCurrentBlockIndex(idx); currentBlockRef.current = idx;
    const b = readableBlocks[idx];
    if (b) { setIsPlaying(true); speak(b.content, () => setIsPlaying(false)); }
  };

  if (loading || !lesson) {
    return (
      <div className="min-h-screen bg-[#F3F4F8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1E2B5A] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#1E2B5A] font-bold text-lg">Loading lesson…</p>
        </div>
      </div>
    );
  }

  const sideBarContent = (
    <div className="space-y-6">
      <button
        onClick={() => router.push(lesson.quizRoute || `/quiz?lesson=${lesson.slug}`)}
        className="w-full bg-[#1E2B5A] text-white rounded-[24px] p-8 shadow-xl hover:bg-[#152042] transition-all group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10"><SquarePen size={80} /></div>
        <div className="flex flex-col items-center relative z-10">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4"><SquarePen size={24} /></div>
          <h3 className="text-[18px] font-black uppercase">Generate Quiz</h3>
          <p className="text-[13px] text-white/60 mt-1">Test your knowledge</p>
        </div>
      </button>

      <div className="bg-[#F4F6FA] border border-[#E9EDF5] rounded-[24px] p-8">
        <div className="flex items-center gap-2 text-[15px] font-black text-[#1D2742] uppercase tracking-wider mb-6">
          <Mic size={20} className="text-[#33478D]" /> Voice Commands
        </div>
        <div className="space-y-5">
          <CommandChip label="Next"       text="move to next section" />
          <CommandChip label="Previous"   text="go back one section" />
          <CommandChip label="Pause"      text="pause reading" />
          <CommandChip label="Resume"     text="continue reading" />
          <CommandChip label="Repeat"     text="hear section again" />
          <CommandChip label="Go to Quiz" text="start the quiz" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F4F6FA] min-h-screen">
      <DashboardNavbar user={user} />

      <div className="max-w-[1440px] mx-auto px-10 pt-10 pb-32">
        <div className="grid gap-12 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px]">

          {/* Lesson Content */}
          <div className="bg-white border border-[#E9EDF5] rounded-[32px] overflow-hidden shadow-sm flex flex-col">
            {lesson.image && (
              <div className="relative h-52 overflow-hidden">
                <img
                  src={lesson.image}
                  alt={lesson.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const subjectImages: Record<string, string> = {
                      Mathematics: "/maths.png",
                      Science: "/lessons_livingthings.png",
                      English: "/english.png",
                    };
                    const fb = subjectImages[lesson.subject] || "/book.png";
                    (e.target as HTMLImageElement).src = fb;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
              </div>
            )}
            <div className="px-12 pt-10 pb-6">
              <button onClick={() => router.push("/lessons")} className="flex items-center gap-2 text-[14px] font-bold text-[#33478D] hover:underline mb-8">
                <ArrowLeft size={16} /> Back to Lessons
              </button>
              <h1 className="text-[48px] font-black tracking-tight text-[#1E2B5A] leading-[1.1]">{lesson.title}</h1>
              <div className="flex items-center gap-6 mt-6 mb-8">
                <span className="flex items-center gap-2 text-[#8793AC] font-black text-[15px] uppercase tracking-wider">
                  <Clock3 size={18} /> {lesson.duration || "12 min"}
                </span>
                <span className="flex items-center gap-2 text-[#8793AC] font-black text-[15px] uppercase tracking-wider">
                  <BarChart3 size={18} /> {lesson.level || "Beginner"}
                </span>
              </div>
              {lesson.description && (
                <p className="text-[20px] text-[#5E6D8F] font-bold leading-relaxed max-w-[800px]">{lesson.description}</p>
              )}
            </div>

            {/* Blocks */}
            <div className="px-12 pb-20 space-y-12 text-[#1D2742] font-sans leading-relaxed text-[20px]">
              {lesson.blocks.map((block: any, index: number) => {
                const isActive = index === currentBlockIndex;
                const highlight = isActive ? "ring-2 ring-[#33478D]/20 bg-[#F8FAFF] rounded-lg" : "";

                if (block.type === "paragraph")
                  return <p key={index} className={`transition-all duration-300 ${highlight} p-2`}>{block.text}</p>;

                if (block.type === "highlight")
                  return (
                    <div key={index} className={`transition-all duration-300 ${highlight}`}>
                      <div className="bg-[#F0F4FF] border-l-[6px] border-[#1E2B5A] p-10 rounded-r-2xl font-bold text-[#1E2B5A]">{block.text}</div>
                    </div>
                  );

                if (block.type === "cards")
                  return (
                    <div key={index} className="grid md:grid-cols-2 gap-8">
                      {block.items.map((item: any, i: number) => (
                        <div key={i} className="bg-[#F8FAFF] border border-[#E9EDF5] rounded-[24px] p-10 hover:shadow-md transition">
                          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-8 shadow-sm">
                            <ChevronDown size={24} className="text-[#33478D]" />
                          </div>
                          <h3 className="text-[22px] font-black text-[#1E2B5A] mb-4">{item.title}</h3>
                          <p className="text-[17px] leading-relaxed text-[#5E6D8F]">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  );

                if (block.type === "visualizer")
                  return (
                    <div key={index} className="flex flex-col items-center py-10">
                      <div className="bg-white rounded-[32px] border border-[#E9EDF5] p-16 shadow-sm flex flex-col items-center w-full max-w-[700px]">
                        <div className="flex gap-10 mb-10">
                          <div className="w-36 h-36 rounded-full border-[12px] border-[#1E2B5A] flex items-center justify-center text-4xl font-black text-[#1E2B5A]">1/4</div>
                          <div className="w-36 h-36 rounded-full border-[12px] border-[#E9EDF5] flex items-center justify-center text-4xl font-black text-[#D1D9E6]">3/4</div>
                        </div>
                        <p className="text-center text-[12px] font-black uppercase tracking-widest text-[#8793AC]">{block.text}</p>
                      </div>
                    </div>
                  );

                if (block.type === "quote")
                  return (
                    <div key={index} className={`bg-[#F8FAFF] rounded-[28px] p-12 italic font-medium text-[24px] text-[#2C3852] border-l-[8px] border-[#33478D] leading-[1.8] ${highlight}`}>
                      &ldquo;{block.text}&rdquo;
                    </div>
                  );
                return null;
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden xl:block">{sideBarContent}</div>
        </div>
      </div>

      {/* Footer player */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E9EDF5] h-[110px] flex items-center px-12 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] z-50">
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button onClick={prevBlock} className="text-[#8793AC] hover:text-[#1E2B5A]"><SkipBack size={24} /></button>
            <button
              onClick={isPlaying ? pauseSpeech : speakCurrentBlock}
              className="w-16 h-16 rounded-full bg-[#1E2B5A] text-white flex items-center justify-center shadow-xl hover:scale-105 transition"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} className="translate-x-0.5" />}
            </button>
            <button onClick={nextBlock} className="text-[#8793AC] hover:text-[#1E2B5A]"><SkipForward size={24} /></button>
          </div>

          <div className="flex-1 max-w-[500px] mx-10">
            <div className="flex justify-between items-center text-[12px] font-black uppercase tracking-[0.2em] text-[#8793AC] mb-4">
              <span>Progress</span>
              <span>{Math.round(((currentBlockIndex + 1) / Math.max(readableBlocks.length, 1)) * 100)}% Completed</span>
            </div>
            <div className="h-3 w-full bg-[#F0F4FF] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1E2B5A] rounded-full transition-all duration-700"
                style={{ width: `${Math.round(((currentBlockIndex + 1) / Math.max(readableBlocks.length, 1)) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 bg-[#F8FAFF] border border-[#E9EDF5] px-6 py-4 rounded-2xl cursor-pointer hover:border-[#1E2B5A] transition">
              <Settings size={18} className="text-[#33478D]" />
              <span className="text-[14px] font-black text-[#1E2B5A] whitespace-nowrap">1.0× Speed</span>
            </div>
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl ${isListening ? "bg-[#1E2B5A] text-white" : "bg-[#F8FAFF] border border-[#E9EDF5] text-[#1E2B5A]"}`}>
              <Mic size={18} className={isListening ? "animate-pulse" : ""} />
              <span className="text-[14px] font-black whitespace-nowrap">
                {isListening ? "Listening…" : "Voice Ready"}
              </span>
            </div>
            <button
              onClick={() => router.push(lesson.quizRoute || `/quiz?lesson=${lesson.slug}`)}
              className="bg-[#9BB3DD] text-[#1E2B5A] font-black uppercase text-[12px] tracking-widest px-10 py-[18px] rounded-2xl flex items-center gap-3 hover:bg-[#8AA7D7] transition shadow-md"
            >
              <MonitorPlay size={20} /> Take Quiz
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CommandChip({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-white border border-[#D1D9E6] px-4 py-2 rounded-xl text-[12px] font-black text-[#1E2B5A] uppercase tracking-wider whitespace-nowrap">
        &ldquo;{label}&rdquo;
      </div>
      <span className="text-[15px] font-bold text-[#5E6D8F]">{text}</span>
    </div>
  );
}
