"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GraduationCap, X, Mic, ArrowRight } from "lucide-react";
import { speak, getSpeechRecognition, tryUnlockAudio } from "@/lib/voiceUtils";

type Option = {
  letter: string;
  title: string;
  description: string;
  isCorrect: boolean;
};

type Question = {
  question: string;
  options: Option[];
};

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonSlug = searchParams?.get("lesson") || "introduction-to-fractions";
  const lessonTitle = lessonSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const [questions, setQuestions]           = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx]         = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [showResult, setShowResult]         = useState(false);
  const [isCorrect, setIsCorrect]           = useState(false);
  const [loading, setLoading]               = useState(true);
  const [isListening, setIsListening]       = useState(false);
  const [statusHint, setStatusHint]         = useState("Loading quiz…");

  // Refs for stale-closure-free voice handlers
  const questionsRef    = useRef<Question[]>([]);
  const currentIdxRef   = useRef(0);
  const scoreRef        = useRef(0);
  const hasStartedRef   = useRef(false);
  const keepListeningRef = useRef(true);
  const isSpeakingRef   = useRef(false);
  // INTRO → AWAITING_ANSWER → FEEDBACK → DONE
  const voiceStepRef    = useRef<"INTRO" | "AWAITING_ANSWER" | "FEEDBACK" | "DONE">("INTRO");
  const recognitionRef  = useRef<any>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/ai/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: lessonSlug.replace(/-/g, " ") }),
        });
        const data = await res.json();
        if (data.quiz) {
          setQuestions(data.quiz);
          questionsRef.current = data.quiz;
        }
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [lessonSlug]);

  // ── Voice engine (single effect, starts when questions load) ────────────────
  useEffect(() => {
    if (loading || questionsRef.current.length === 0) return;

    const recognition = getSpeechRecognition();
    if (!recognition) return;
    recognitionRef.current = recognition;

    recognition.continuous     = true;
    recognition.interimResults = false;
    recognition.lang           = "en-US";
    recognition.maxAlternatives = 5;

    const stopListening  = () => { try { recognition.stop(); } catch {} };
    const startListening = () => {
      if (!keepListeningRef.current || isSpeakingRef.current) return;
      try { recognition.start(); } catch {}
    };

    // Extract a letter answer from any transcript variant (including phonetic mishearings)
    const extractLetter = (t: string): string | null => {
      if (t === "a" || t === "ay" || t.startsWith("a ") || t.endsWith(" a") || t.includes("option a") || t.includes("answer a") || t.includes("select a") || t.includes("choose a")) return "A";
      if (t === "b" || t === "bee" || t === "be" || t.startsWith("b ") || t.endsWith(" b") || t.includes("option b") || t.includes("answer b") || t.includes("select b") || t.includes("choose b")) return "B";
      if (t === "c" || t === "see" || t === "sea" || t.startsWith("c ") || t.endsWith(" c") || t.includes("option c") || t.includes("answer c") || t.includes("select c") || t.includes("choose c")) return "C";
      if (t === "d" || t === "dee" || t.startsWith("d ") || t.endsWith(" d") || t.includes("option d") || t.includes("answer d") || t.includes("select d") || t.includes("choose d")) return "D";
      return null;
    };

    const speakThen = (text: string, onEnd?: () => void) => {
      isSpeakingRef.current = true;
      stopListening();
      speak(text, () => {
        isSpeakingRef.current = false;
        onEnd?.();
        if (keepListeningRef.current) setTimeout(startListening, 400);
      });
    };

    const readQuestion = (idx: number) => {
      const qs = questionsRef.current;
      if (idx >= qs.length) return;

      currentIdxRef.current = idx;
      setCurrentIdx(idx);
      setSelectedLetter(null);
      setShowResult(false);
      setIsCorrect(false);
      voiceStepRef.current = "AWAITING_ANSWER";

      const q = qs[idx];
      const opts = q.options.map(o => `${o.letter}: ${o.title}`).join(". ");
      const text = `Question ${idx + 1} of ${qs.length}. ${q.question}. ${opts}. Say A, B, C, or D to answer.`;

      setStatusHint(`Listening for A, B, C, or D…`);
      speakThen(text);
    };

    const handleAnswer = (letter: string) => {
      if (voiceStepRef.current !== "AWAITING_ANSWER") return;
      voiceStepRef.current = "FEEDBACK";
      stopListening();

      const qs  = questionsRef.current;
      const idx = currentIdxRef.current;
      const q   = qs[idx];
      const choice = q.options.find(o => o.letter === letter.toUpperCase());
      if (!choice) { voiceStepRef.current = "AWAITING_ANSWER"; return; }

      const correct = choice.isCorrect;
      if (correct) {
        scoreRef.current += 1;
      }
      setSelectedLetter(letter.toUpperCase());
      setShowResult(true);
      setIsCorrect(correct);

      window.speechSynthesis.cancel();

      const feedback = correct
        ? `That's correct! Great job.`
        : `Not quite. The correct answer was ${q.options.find(o => o.isCorrect)?.letter}: ${q.options.find(o => o.isCorrect)?.title}.`;

      const nextIdx = idx + 1;
      if (nextIdx < qs.length) {
        speakThen(`${feedback} Moving on.`, () => {
          setTimeout(() => readQuestion(nextIdx), 400);
        });
      } else {
        voiceStepRef.current = "DONE";
        keepListeningRef.current = false;
        stopListening();
        speakThen(
          `${feedback} That was the last question! Opening your results now.`,
          () => submitAndNavigate()
        );
      }
    };

    const submitAndNavigate = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch("http://localhost:5001/api/progress/quiz-result", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            lessonSlug,
            score: scoreRef.current,
            totalQuestions: questionsRef.current.length,
          }),
        });
        const data = await res.json();
        router.push(
          `/quiz/results?lesson=${encodeURIComponent(lessonSlug)}&score=${scoreRef.current}&total=${questionsRef.current.length}&xp=${data.xpEarned || 150}&badge=${encodeURIComponent(data.badgeEarned || "Quiz Champion")}`
        );
      } catch {
        router.push(
          `/quiz/results?lesson=${encodeURIComponent(lessonSlug)}&score=${scoreRef.current}&total=${questionsRef.current.length}&xp=150&badge=${encodeURIComponent("Quiz Champion")}`
        );
      }
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onend   = () => {
      setIsListening(false);
      if (!keepListeningRef.current) return;
      // TTS-aware restart: don't start recognition while TTS is speaking
      const tryRestart = () => {
        if (window.speechSynthesis.speaking) { setTimeout(tryRestart, 500); return; }
        if (keepListeningRef.current && !isSpeakingRef.current) startListening();
      };
      setTimeout(tryRestart, 600);
    };
    recognition.onerror = (e: any) => {
      const err = e?.error;
      console.warn("Quiz recognition error:", err);
      if (err === "no-speech" || err === "audio-capture" || err === "network") {
        setTimeout(startListening, 1200);
      }
    };

    recognition.onresult = (event: any) => {
      const lastResult = event.results[event.results.length - 1];
      const cmd = lastResult[0].transcript.toLowerCase().trim();
      console.log(`[Quiz voice | step=${voiceStepRef.current}] heard:`, cmd);

      if (voiceStepRef.current === "AWAITING_ANSWER") {
        // Check ALL alternatives for a letter answer (handles phonetic misrecognitions)
        for (let i = 0; i < lastResult.length; i++) {
          const alt = lastResult[i].transcript.toLowerCase().trim();
          const letter = extractLetter(alt);
          if (letter) { handleAnswer(letter); return; }
        }
        if (cmd.includes("repeat") || cmd.includes("again")) {
          window.speechSynthesis.cancel();
          readQuestion(currentIdxRef.current);
          return;
        }
        if (cmd.includes("exit") || cmd.includes("quit") || cmd.includes("go home")) {
          keepListeningRef.current = false;
          stopListening();
          window.speechSynthesis.cancel();
          router.push("/Student/dashboard");
          return;
        }
        if (cmd.includes("where am i")) {
          speakThen(`You are on question ${currentIdxRef.current + 1} of ${questionsRef.current.length}. ${questionsRef.current[currentIdxRef.current].question}`);
          return;
        }
      }
    };

    const startAssistant = async () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      await tryUnlockAudio();
      voiceStepRef.current = "INTRO";
      setStatusHint("Preparing quiz…");
      speakThen(
        `Welcome to the quiz for ${lessonTitle}. There are ${questionsRef.current.length} questions. I'll read each one aloud. Say the letter A, B, C, or D to answer. Let's begin!`,
        () => setTimeout(() => readQuestion(0), 400)
      );
    };

    startAssistant();

    const unlock = async () => { await tryUnlockAudio(); startAssistant(); };
    window.addEventListener("click",   unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      keepListeningRef.current = false;
      hasStartedRef.current    = false;
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
  }, [loading, lessonSlug, lessonTitle, router]);

  // ── Manual answer selection (click) ────────────────────────────────────────
  const handleClickAnswer = (letter: string) => {
    if (showResult || voiceStepRef.current === "FEEDBACK" || voiceStepRef.current === "DONE") return;

    const qs  = questionsRef.current;
    const idx = currentIdxRef.current;
    const q   = qs[idx];
    const choice = q.options.find(o => o.letter === letter);
    if (!choice) return;

    const correct = choice.isCorrect;
    if (correct) { scoreRef.current += 1; }
    setSelectedLetter(letter);
    setShowResult(true);
    setIsCorrect(correct);
    voiceStepRef.current = "FEEDBACK";
    window.speechSynthesis.cancel();
    try { recognitionRef.current?.stop(); } catch {}

    const feedback = correct
      ? `Correct! Well done.`
      : `Not quite. The answer was ${q.options.find(o => o.isCorrect)?.letter}: ${q.options.find(o => o.isCorrect)?.title}.`;

    const nextIdx = idx + 1;
    if (nextIdx < qs.length) {
      speak(`${feedback} Moving on.`, () => {
        isSpeakingRef.current = false;
        setTimeout(() => {
          const qi = currentIdxRef.current + 1;
          currentIdxRef.current = qi;
          setCurrentIdx(qi);
          setSelectedLetter(null);
          setShowResult(false);
          setIsCorrect(false);
          voiceStepRef.current = "AWAITING_ANSWER";
          const nq = qs[qi];
          const opts = nq.options.map(o => `${o.letter}: ${o.title}`).join(". ");
          speak(`Question ${qi + 1} of ${qs.length}. ${nq.question}. ${opts}. Say A, B, C, or D to answer.`, () => {
            isSpeakingRef.current = false;
            setTimeout(() => { try { recognitionRef.current?.start(); } catch {} }, 400);
          });
        }, 400);
      });
    } else {
      voiceStepRef.current = "DONE";
      keepListeningRef.current = false;
      speak(
        `${feedback} Quiz complete! Opening your results now.`,
        async () => {
          const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
          try {
            const res = await fetch("http://localhost:5001/api/progress/quiz-result", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({ lessonSlug, score: scoreRef.current, totalQuestions: qs.length }),
            });
            const data = await res.json();
            router.push(
              `/quiz/results?lesson=${encodeURIComponent(lessonSlug)}&score=${scoreRef.current}&total=${qs.length}&xp=${data.xpEarned || 150}&badge=${encodeURIComponent(data.badgeEarned || "Quiz Champion")}`
            );
          } catch {
            router.push(
              `/quiz/results?lesson=${encodeURIComponent(lessonSlug)}&score=${scoreRef.current}&total=${qs.length}&xp=150&badge=${encodeURIComponent("Quiz Champion")}`
            );
          }
        }
      );
    }
  };

  // Manual "Next" button — only advances UI, voice already handled it
  const advanceManually = () => {
    const qs  = questionsRef.current;
    const idx = currentIdxRef.current;
    const next = idx + 1;
    if (next < qs.length) {
      currentIdxRef.current = next;
      setCurrentIdx(next);
      setSelectedLetter(null);
      setShowResult(false);
      setIsCorrect(false);
      voiceStepRef.current = "AWAITING_ANSWER";
      setStatusHint("Listening for A, B, C, or D…");
      window.speechSynthesis.cancel();
      const nq   = qs[next];
      const opts = nq.options.map(o => `${o.letter}: ${o.title}`).join(". ");
      speak(`Question ${next + 1} of ${qs.length}. ${nq.question}. ${opts}. Say A, B, C, or D to answer.`, () => {
        isSpeakingRef.current = false;
        setTimeout(() => { try { recognitionRef.current?.start(); } catch {} }, 400);
      });
    } else {
      // Last question — go to results
      const submitAndGo = async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        try {
          const res = await fetch("http://localhost:5001/api/progress/quiz-result", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ lessonSlug, score: scoreRef.current, totalQuestions: qs.length }),
          });
          const data = await res.json();
          router.push(`/quiz/results?lesson=${encodeURIComponent(lessonSlug)}&score=${scoreRef.current}&total=${qs.length}&xp=${data.xpEarned || 150}&badge=${encodeURIComponent(data.badgeEarned || "Quiz Champion")}`);
        } catch {
          router.push(`/quiz/results?lesson=${encodeURIComponent(lessonSlug)}&score=${scoreRef.current}&total=${qs.length}&xp=150&badge=${encodeURIComponent("Quiz Champion")}`);
        }
      };
      submitAndGo();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-[#33478D] border-t-transparent rounded-full animate-spin" />
        <p className="text-[18px] font-bold text-[#27314D] animate-pulse">Generating your personalised quiz…</p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center">
        <div className="text-xl font-bold text-red-500">Failed to load quiz. Please try again.</div>
      </div>
    );
  }

  const currentQ       = questions[currentIdx];
  const progressPct    = ((currentIdx + 1) / questions.length) * 100;
  const minsRemaining  = Math.max(1, Math.round((questions.length - currentIdx) * 1.2));

  return (
    <div className="min-h-screen bg-[#F5F8FA] flex flex-col font-sans">
      <header className="bg-white border-b border-[#EAEAEF] px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#33478D] rounded-xl flex items-center justify-center text-white">
            <GraduationCap size={26} />
          </div>
          <div>
            <h1 className="text-[20px] font-extrabold text-[#232F4B] capitalize">{lessonTitle}</h1>
            <p className="text-[12px] font-extrabold text-[#8793AC] tracking-widest uppercase">Quiz · {questions.length} Questions</p>
          </div>
        </div>
        <button
          onClick={() => { window.speechSynthesis.cancel(); router.push("/Student/dashboard"); }}
          className="flex items-center gap-2 border border-[#D5DCEB] text-[#4F5B7B] font-bold px-5 py-2.5 rounded-[12px] hover:bg-[#F3F6FA] transition"
        >
          <X size={18} /> Exit Quiz
        </button>
      </header>

      <main className="flex-1 max-w-[1000px] w-full mx-auto px-6 pt-10 pb-36">
        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[11px] font-extrabold text-[#33478D] tracking-widest uppercase mb-1">Progress</p>
              <div className="text-[24px] font-black text-[#1F2942]">
                Question {currentIdx + 1}{" "}
                <span className="text-[#A2ABB8] font-normal text-[20px]">of {questions.length}</span>
              </div>
            </div>
            <div className="text-[13px] font-bold text-[#66728B]">~{minsRemaining} min remaining</div>
          </div>
          <div className="h-[10px] w-full bg-[#E3E8F0] rounded-full overflow-hidden">
            <div className="h-full bg-[#33478D] transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-[24px] p-10 md:p-14 shadow-sm border border-[#E9EEF5]">
          {showResult && (
            <div className={`mb-6 px-6 py-4 rounded-[14px] font-bold text-[16px] ${
              isCorrect ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {isCorrect ? "✓ Correct! Well done." : `✗ Not quite — the correct answer was ${currentQ.options.find(o => o.isCorrect)?.letter}: ${currentQ.options.find(o => o.isCorrect)?.title}.`}
            </div>
          )}

          <h2 className="text-[28px] md:text-[34px] font-black text-[#1E273F] leading-[1.3] mb-10">
            {currentQ.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {currentQ.options.map((option) => {
              const isSelected = selectedLetter === option.letter;
              let border = "border-[#E7ECF3]";
              let bg     = "bg-white";
              if (showResult) {
                if (isSelected)         { border = option.isCorrect ? "border-green-500" : "border-red-500"; bg = option.isCorrect ? "bg-green-50" : "bg-red-50"; }
                else if (option.isCorrect) { border = "border-green-400"; bg = "bg-green-50/60"; }
              } else if (isSelected)    { border = "border-[#33478D]"; bg = "bg-[#F0F4FF]"; }

              return (
                <button
                  key={option.letter}
                  onClick={() => handleClickAnswer(option.letter)}
                  disabled={showResult}
                  className={`text-left rounded-[16px] p-6 border-2 transition-all ${border} ${bg} ${
                    !showResult ? "hover:border-[#D0D7E7] hover:shadow-sm" : ""
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-[16px] flex-shrink-0 ${
                      showResult && option.isCorrect ? "bg-green-500 text-white" :
                      showResult && isSelected       ? "bg-red-400 text-white"   : "bg-[#F3F6FA] text-[#4E5A7B]"
                    }`}>
                      {option.letter}
                    </div>
                    <h3 className="text-[17px] font-black text-[#1F2942]">{option.title}</h3>
                  </div>
                  <p className="text-[14px] text-[#6E7892] leading-[1.6] pl-14">{option.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Floating footer */}
      <footer className="fixed bottom-0 left-0 right-0 pointer-events-none p-6 z-50">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between gap-4 pointer-events-auto">
          <div className="bg-white rounded-[16px] flex items-center p-3 pr-6 shadow-[0_10px_30px_rgba(30,41,59,0.08)] border border-[#EBEFF5]">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white mr-4 transition-colors ${isListening ? "bg-[#33478D] animate-pulse" : "bg-[#98A3BE]"}`}>
              <Mic size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-[#243152] uppercase mb-0.5">Voice Active</p>
              <p className="text-[13px] text-[#616D8A]">{statusHint}</p>
            </div>
          </div>

          {showResult && currentIdx < questions.length - 1 && (
            <button
              onClick={advanceManually}
              className="bg-[#33478D] hover:bg-[#2A3B7A] transition text-white px-8 py-4 flex items-center gap-3 rounded-[16px] font-bold text-[16px] shadow-[0_8px_20px_rgba(51,71,141,0.2)]"
            >
              Next Question <ArrowRight size={20} />
            </button>
          )}
          {showResult && currentIdx === questions.length - 1 && (
            <button
              onClick={advanceManually}
              className="bg-[#33478D] hover:bg-[#2A3B7A] transition text-white px-8 py-4 flex items-center gap-3 rounded-[16px] font-bold text-[16px] shadow-[0_8px_20px_rgba(51,71,141,0.2)]"
            >
              View Results <ArrowRight size={20} />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#33478D] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
