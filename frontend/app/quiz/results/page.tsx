"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Settings, Mic, RotateCcw, LayoutGrid, Star, Award, Sparkles } from "lucide-react";
import { speak, getSpeechRecognition, tryUnlockAudio } from "@/lib/voiceUtils";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const lessonSlug  = searchParams?.get("lesson") || "introduction-to-fractions";
  const scoreStr    = searchParams?.get("score")  || "8";
  const totalStr    = searchParams?.get("total")  || "10";
  const xpStr       = searchParams?.get("xp")    || "150";
  const badgeStr    = searchParams?.get("badge")  || "Quiz Champion";

  const score      = parseInt(scoreStr, 10);
  const total      = parseInt(totalStr, 10);
  const xp         = parseInt(xpStr, 10);
  const badge      = decodeURIComponent(badgeStr);
  const lessonTitle = lessonSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const pct         = Math.round((score / total) * 100);

  const [user, setUser]           = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [statusHint, setStatusHint]   = useState("Reading results…");

  const hasStartedRef    = useRef(false);
  const keepListeningRef = useRef(true);
  const isSpeakingRef    = useRef(false);
  const recognitionRef   = useRef<any>(null);

  useEffect(() => {
    const s = localStorage.getItem("user");
    if (s) setUser(JSON.parse(s));
  }, []);

  useEffect(() => {
    const recognition = getSpeechRecognition();
    if (!recognition) return;
    recognitionRef.current = recognition;

    // Reset on every effect run so Strict Mode re-mount doesn't leave listening dead
    keepListeningRef.current = true;
    isSpeakingRef.current    = false;

    recognition.continuous     = true;
    recognition.interimResults = false;
    recognition.lang           = "en-US";
    recognition.maxAlternatives = 5;

    const stopListening  = () => { try { recognition.stop(); } catch {} };
    const startListening = () => {
      if (!keepListeningRef.current || isSpeakingRef.current) return;
      try { recognition.start(); } catch {}
    };

    const speakThen = (text: string, onEnd?: () => void) => {
      isSpeakingRef.current = true;
      // Keep recognition running during TTS so commands are heard immediately after
      speak(text, () => {
        isSpeakingRef.current = false;
        onEnd?.();
        if (keepListeningRef.current) setTimeout(startListening, 200);
      });
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onend   = () => {
      setIsListening(false);
      if (!keepListeningRef.current) return;
      const tryRestart = () => {
        if (window.speechSynthesis.speaking) { setTimeout(tryRestart, 500); return; }
        if (keepListeningRef.current && !isSpeakingRef.current) startListening();
      };
      setTimeout(tryRestart, 600);
    };
    recognition.onerror = (e: any) => {
      const err = e?.error;
      console.warn("Results recognition error:", err);
      if (err === "no-speech" || err === "audio-capture" || err === "network") {
        setTimeout(startListening, 1200);
      }
    };

    recognition.onresult = (event: any) => {
      const lastResult = event.results[event.results.length - 1];
      // Check all alternatives so short or misheard phrases still navigate correctly
      for (let i = 0; i < lastResult.length; i++) {
        const cmd = lastResult[i].transcript.toLowerCase().trim();
        if (!cmd) continue;
        console.log("[Results voice] alt", i, "heard:", cmd);

        if (cmd.includes("lesson") || cmd.includes("go back") || cmd.includes("review") || cmd.includes("keep learning")) {
          keepListeningRef.current = false;
          stopListening();
          window.speechSynthesis.cancel();
          router.push("/lessons");
          return;
        }
        if (cmd.includes("achievement") || cmd.includes("badge") || cmd.includes("trophy") || cmd.includes("award")) {
          keepListeningRef.current = false;
          stopListening();
          window.speechSynthesis.cancel();
          router.push("/achievements");
          return;
        }
        if (cmd.includes("dashboard") || cmd.includes("home") || cmd.includes("go home") || cmd.includes("main")) {
          keepListeningRef.current = false;
          stopListening();
          window.speechSynthesis.cancel();
          router.push("/Student/dashboard");
          return;
        }
      }
    };

    const startAssistant = async () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      await tryUnlockAudio();

      const gradeMsg = pct >= 80 ? "Excellent work!" : pct >= 60 ? "Good job!" : "Keep practising!";
      const announcement =
        `Quiz complete! ${gradeMsg} You scored ${score} out of ${total} — that's ${pct} percent. ` +
        `You've earned ${xp} XP and the ${badge} badge. ` +
        `Where would you like to go next? ` +
        `Say "go to lessons" to keep learning, "go to achievements" to view your badges, or "go home" to return to your dashboard.`;

      setStatusHint(`Say: "go to lessons", "achievements", or "go home"`);
      speakThen(announcement);
    };

    // Start recognition immediately so it's warm when the student speaks
    setTimeout(startListening, 300);
    if (!hasStartedRef.current) {
      startAssistant();
    } else {
      // Strict Mode second mount: TTS already ran, recognition already started above
    }

    const unlock = async () => { await tryUnlockAudio(); startAssistant(); };
    window.addEventListener("click",   unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      keepListeningRef.current = false;
      // Do NOT reset hasStartedRef — prevents double TTS in Strict Mode re-mount
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
    };
  }, [score, total, xp, badge, pct, lessonSlug, router]);

  return (
    <div className="min-h-screen bg-[#F5F8FA] flex flex-col font-sans">
      <header className="bg-white border-b border-[#EAEAEF] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Image src="/logo.png" alt="EchoLearn Logo" width={140} height={36} priority />
          <div className="flex items-center gap-4 text-[#8C9BB3]">
            <button className="hover:text-[#4A5E95] transition"><Settings size={22} className="stroke-[2.5px]" /></button>
            <div className="w-9 h-9 rounded-full bg-[#1F3F7F] text-white flex items-center justify-center font-bold text-sm cursor-pointer">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center pb-28 pt-10 px-6">
        <div className="flex flex-col items-center max-w-[700px] w-full">

          <div className="w-20 h-20 rounded-full bg-[#FEF4C4] flex items-center justify-center mb-6 shadow-[0_8px_20px_rgba(254,244,196,0.5)]">
            <Sparkles size={36} className="text-[#C49500]" fill="currentColor" strokeWidth={1} />
          </div>

          <h1 className="text-[44px] font-black text-[#1E273F] mb-2 tracking-tight">Quiz Complete!</h1>
          <p className="text-[18px] text-[#616D8A] font-medium mb-10">
            You earned{" "}
            <span className="font-black text-[#C49500]">+{xp} XP</span>{" "}
            for completing <span className="font-semibold text-[#1E273F]">{lessonTitle}</span>!{" "}
            {pct >= 80 ? "Excellent work!" : pct >= 60 ? "Good job!" : "Keep practising!"}
          </p>

          <div className="w-full bg-white rounded-[24px] shadow-[0_8px_30px_rgba(30,41,59,0.06)] border border-[#EBEFF5] overflow-hidden">
            <div className="p-10 flex flex-col md:flex-row items-center gap-10">
              <div className="shrink-0 relative">
                <div className="w-44 h-44 rounded-full border-[10px] border-[#33478D] flex flex-col items-center justify-center shadow-[inset_0_4px_10px_rgba(51,71,141,0.1)]">
                  <span className="text-[46px] font-black text-[#1E273F] tracking-tighter leading-none">{score}/{total}</span>
                  <span className="text-[14px] font-black text-[#8793AC] tracking-[0.15em] mt-1">CORRECT</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-[11px] font-black text-[#8793AC] tracking-[0.15em] uppercase mb-1">LESSON</p>
                <h2 className="text-[26px] font-black text-[#1E273F] mb-3 leading-[1.2]">{lessonTitle}</h2>
                <p className="text-[15px] text-[#616D8A] leading-relaxed">
                  {pct}% score — {pct >= 80 ? "Outstanding mastery of this topic!" : pct >= 60 ? "Solid understanding. A bit more practice will make it perfect." : "Review the lesson and try again — practice makes perfect."}
                </p>
              </div>
            </div>

            <div className="h-[1px] w-[calc(100%-40px)] mx-auto bg-[#EBEFF5]" />

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#EBEFF5]">
              <div className="p-8 flex items-center justify-center md:justify-start gap-5">
                <div className="w-14 h-14 rounded-[14px] bg-[#FFF2DE] flex items-center justify-center text-[#E58814]">
                  <Star size={28} fill="currentColor" strokeWidth={1} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#8793AC]">XP Earned</p>
                  <p className="text-[22px] font-black text-[#1E273F]">+{xp} XP</p>
                </div>
              </div>
              <div className="p-8 flex items-center justify-center md:justify-start gap-5">
                <div className="w-14 h-14 rounded-[14px] bg-[#F0F2FA] flex items-center justify-center text-[#33478D]">
                  <Award size={28} className="stroke-[2px]" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#8793AC]">Badge Earned</p>
                  <p className="text-[20px] font-black text-[#33478D]">{badge}</p>
                </div>
              </div>
            </div>

            <div className="p-8 pt-0 flex flex-col sm:flex-row gap-4 mt-2">
              <button
                onClick={() => { window.speechSynthesis.cancel(); router.push("/lessons"); }}
                className="flex-1 flex items-center justify-center gap-3 bg-[#33478D] hover:bg-[#2A3B7A] text-white px-6 py-4 rounded-[14px] font-black text-[16px] transition shadow-[0_6px_20px_rgba(51,71,141,0.2)]"
              >
                <LayoutGrid size={20} /> Go to Lessons
              </button>
              <button
                onClick={() => { window.speechSynthesis.cancel(); router.push("/achievements"); }}
                className="flex-1 flex items-center justify-center gap-3 bg-white hover:bg-[#F8FAFD] border-2 border-[#EBEFF5] text-[#1E273F] px-6 py-4 rounded-[14px] font-black text-[16px] transition"
              >
                <Award size={20} /> View Achievements
              </button>
              <button
                onClick={() => { window.speechSynthesis.cancel(); router.push(`/lessons/${lessonSlug}`); }}
                className="flex-1 flex items-center justify-center gap-3 bg-white hover:bg-[#F8FAFD] border-2 border-[#EBEFF5] text-[#1E273F] px-6 py-4 rounded-[14px] font-black text-[16px] transition"
              >
                <RotateCcw size={20} /> Review Lesson
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 pointer-events-none p-6 z-50 flex items-end justify-between gap-4">
        <div className="bg-white rounded-[16px] flex items-center p-3 pr-6 shadow-[0_10px_30px_rgba(30,41,59,0.08)] border border-[#EBEFF5] pointer-events-auto">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white mr-4 transition-colors ${isListening ? "bg-[#33478D] animate-pulse" : "bg-[#98A3BE]"}`}>
            <Mic size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black tracking-[0.1em] text-[#243152] uppercase mb-0.5">Voice Active</p>
            <p className="text-[13px] text-[#616D8A]">{statusHint}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function QuizResults() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F8FA] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#33478D] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
