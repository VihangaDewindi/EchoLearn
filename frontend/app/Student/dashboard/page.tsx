"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookOpen, FlaskConical, Mic, Play, Trophy, Flame,
  Lightbulb, MessageSquare, Users, Calculator,
} from "lucide-react";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import { speak, getSpeechRecognition, tryUnlockAudio } from "@/lib/voiceUtils";
import { useRouter } from "next/navigation";

const API = "http://localhost:5001";

export default function Dashboard() {
  const [user, setUser]       = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<{day: string; label: string; value: number; color: string}[]>([]);
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();

  // Prevent double-greeting across renders
  const hasGreetedRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const saved = localStorage.getItem("user");
        const parsedUser = saved ? JSON.parse(saved) : null;
        if (parsedUser) setUser(parsedUser);

        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const pr = await fetch(`${API}/api/progress`, { headers });
        const prData = await pr.json();
        setProgress(prData);
        if (prData.xp !== undefined) {
          setUser((u: any) => u ? { ...u, xp: prData.xp } : u);
        }

        // Fetch real lessons for weekly plan
        const gradeNum = Math.min(10, Math.max(1, parsedUser?.level || 3));
        const grade = encodeURIComponent(`Grade ${gradeNum}`);
        const [mathL, sciL, engL] = await Promise.all([
          fetch(`${API}/api/lessons?subject=Mathematics&grade=${grade}`).then(r => r.json()).catch(() => []),
          fetch(`${API}/api/lessons?subject=Science&grade=${grade}`).then(r => r.json()).catch(() => []),
          fetch(`${API}/api/lessons?subject=English&grade=${grade}`).then(r => r.json()).catch(() => []),
        ]);
        const trunc = (s: string, n: number) => s.length > n ? s.slice(0, n - 1) + "…" : s;
        const plan = [
          { day: "Mon", label: `Mon: ${trunc(mathL[0]?.title || "Mathematics", 18)}`, value: prData.math ?? 0, color: "#E7873C" },
          { day: "Tue", label: `Tue: ${trunc(sciL[0]?.title  || "Science",     18)}`, value: prData.science ?? 0, color: "#5AAF7B" },
          { day: "Wed", label: `Wed: ${trunc(engL[0]?.title  || "English",     18)}`, value: prData.english ?? 0, color: "#A15EFF" },
          { day: "Thu", label: `Thu: ${trunc(mathL[1]?.title || mathL[0]?.title || "Mathematics", 18)}`, value: prData.math ?? 0, color: "#E7873C" },
        ];
        setWeeklyPlan(plan);
      } catch (err) {
        console.error("API error:", err);
      }
    };
    fetchData();
  }, []);

  // Voice assistant — starts exactly once after user+progress are loaded
  useEffect(() => {
    if (!user || !progress) return;

    const recognition = getSpeechRecognition();
    if (!recognition) return;

    let keepListening = true;
    let isSpeaking    = false;

    const stopListening  = () => { try { recognition.stop(); } catch {} };
    const startListening = () => {
      if (!keepListening || isSpeaking) return;
      try { recognition.start(); } catch {}
    };

    const speakAndResume = (text: string, onEnd?: () => void) => {
      isSpeaking = true;
      stopListening();
      speak(text, () => {
        isSpeaking = false;
        onEnd?.();
        if (keepListening) setTimeout(startListening, 400);
      });
    };

    recognition.continuous     = true;
    recognition.interimResults = false;
    recognition.lang           = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend   = () => {
      setIsListening(false);
      if (!keepListening) return;
      // Wait for any active TTS to finish before restarting
      const tryRestart = () => {
        if (window.speechSynthesis.speaking) { setTimeout(tryRestart, 500); return; }
        if (keepListening && !isSpeaking) startListening();
      };
      setTimeout(tryRestart, 600);
    };
    recognition.onerror = (e: any) => {
      const err = e?.error;
      if (err === "no-speech" || err === "audio-capture" || err === "network") {
        setTimeout(startListening, 1000);
      }
    };

    recognition.onresult = (event: any) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      console.log("Dashboard heard:", command);

      // resume lesson — navigate to actual last lesson, not hardcoded slug
      if (
        command.includes("resume") ||
        command.includes("continue lesson") ||
        command.includes("continue learning")
      ) {
        const slug = progress?.lastLesson?.slug || "intro-to-fractions";
        keepListening = false;
        stopListening();
        speakAndResume("Sure! Resuming your lesson now.", () => {
          localStorage.setItem("voiceStart", "true");
          router.push(`/lessons/${slug}`);
        });
        return;
      }

      // go to lessons — match singular/plural
      if (command.includes("lesson")) {
        keepListening = false;
        stopListening();
        speakAndResume("Taking you to the lessons hub!", () => {
          localStorage.setItem("voiceStart", "true");
          router.push("/lessons");
        });
        return;
      }

      // go to quiz
      if (command.includes("quiz")) {
        speakAndResume(
          "To take a quiz, please start a lesson first. Taking you to the lessons hub.",
          () => {
            keepListening = false;
            stopListening();
            localStorage.setItem("voiceStart", "true");
            router.push("/lessons");
          }
        );
        return;
      }

      // achievements
      if (command.includes("achievement") || command.includes("badge") || command.includes("trophy")) {
        keepListening = false;
        stopListening();
        speakAndResume("Opening your achievements!", () => {
          localStorage.setItem("voiceStart", "true");
          router.push("/achievements");
        });
        return;
      }

      // where am i
      if (command.includes("where")) {
        speakAndResume(
          "You're on your student dashboard. Say: resume lesson, go to lessons, or go to achievements."
        );
        return;
      }

      // unrecognised — give a gentle hint without making an API call
      speakAndResume("I didn't catch that. Try saying: lessons, achievements, or resume lesson.");
    };

    // Start recognition immediately — don't wait for greeting to finish
    try { recognition.start(); } catch {}

    // Greet only once
    const greet = async () => {
      if (hasGreetedRef.current) return;
      hasGreetedRef.current = true;
      await tryUnlockAudio();
      const firstName = user.fullName?.split(" ")[0] || "there";
      speakAndResume(
        `Hey ${firstName}, welcome back! You're on your student dashboard. ` +
        `Say "lessons", "achievements", or "resume lesson" at any time.`
      );
    };

    greet();

    const unlockAndGreet = async () => { await tryUnlockAudio(); greet(); };
    window.addEventListener("click",   unlockAndGreet, { once: true });
    window.addEventListener("keydown", unlockAndGreet, { once: true });

    return () => {
      keepListening = false;
      window.removeEventListener("click",   unlockAndGreet);
      window.removeEventListener("keydown", unlockAndGreet);
      try {
        recognition.onstart  = null;
        recognition.onend    = null;
        recognition.onresult = null;
        recognition.onerror  = null;
        recognition.stop();
      } catch {}
      window.speechSynthesis.cancel();
    };
  }, [user, progress, router]);

  if (!user || !progress) {
    return <p className="p-10 text-[#2B3551]">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-[#F3F4F8]">
      <DashboardNavbar user={user} />

      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-7">

        {/* Welcome */}
        <div className="bg-white rounded-[22px] border border-[#E7EAF2] px-7 py-8 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 shadow-[0_4px_18px_rgba(24,39,75,0.04)]">
          <div>
            <h1 className="text-[26px] md:text-[30px] font-extrabold text-[#27314D] tracking-[-0.02em]">
              Welcome back, {user.fullName}! 👋
            </h1>
            {(() => {
              const xp = progress?.xp ?? user?.xp ?? 0;
              const nextMilestone = Math.max(100, Math.ceil((xp + 1) / 100) * 100);
              const xpNeeded = nextMilestone - xp;
              return (
                <p className="mt-2 text-[15px] text-[#677189] font-medium">
                  You're doing great! You've earned{" "}
                  <span className="text-[#34498D] font-semibold">{xp} XP</span>{" "}
                  from your quizzes.{" "}
                  {xpNeeded > 0
                    ? <>{`Just `}<span className="text-[#34498D] font-semibold">{xpNeeded} XP</span>{` to your next milestone!`}</>
                    : "Keep it up!"}
                </p>
              );
            })()}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-fit">
            <TopStatCard title="CURRENT LEVEL" value={user.level ?? 1} />
            <TopStatCard title="TOTAL XP"       value={(progress?.xp ?? user.xp ?? 0).toLocaleString()} />
            <TopGoalCard />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-7">

          {/* Left */}
          <div className="xl:col-span-8 space-y-6">

            {/* Continue Learning */}
            <section>
              {(() => {
                const ll = progress.lastLesson;
                const slug    = ll?.slug    || "intro-to-fractions";
                const title   = ll?.title   || "Introduction to Fractions";
                const subject = ll?.subject || "Mathematics";
                const prog    = ll?.progress ?? progress.math ?? 0;
                const subjectColors: Record<string, string> = {
                  Mathematics: "bg-[#3B4FA0]",
                  Science:     "bg-[#2E7D5B]",
                  English:     "bg-[#7C3D9E]",
                };
                const bgColor = subjectColors[subject] || "bg-[#98A089]";
                return (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-[18px] font-extrabold text-[#27314D]">Continue Learning</h2>
                    </div>
                    <div className="bg-white rounded-[22px] overflow-hidden border border-[#E7EAF2] shadow-[0_4px_18px_rgba(24,39,75,0.04)] grid grid-cols-1 md:grid-cols-[230px_minmax(0,1fr)]">
                      <div className={`${bgColor} min-h-[240px] flex flex-col items-center justify-center text-white`}>
                        <div className="text-[18px] tracking-[0.25em] font-extrabold">LESSON</div>
                        <div className="text-[11px] opacity-80 mt-2 uppercase tracking-[0.12em]">{subject}</div>
                      </div>
                      <div className="p-6 md:p-7">
                        <div className="flex items-center gap-3 text-[12px] font-bold">
                          <span className="px-3 py-1 rounded-md bg-[#EEF2FF] text-[#3C4E92] uppercase tracking-wide">{subject}</span>
                        </div>
                        <h3 className="mt-4 text-[24px] font-extrabold text-[#27314D] tracking-[-0.02em]">{title}</h3>
                        <div className="mt-6">
                          <div className="flex items-center justify-between text-[14px] font-bold text-[#3A4566] mb-2">
                            <span>Progress</span><span>{prog}%</span>
                          </div>
                          <div className="h-[7px] rounded-full bg-[#E8EBF3] overflow-hidden">
                            <div className="h-full rounded-full bg-[#33478D]" style={{ width: `${prog}%` }} />
                          </div>
                        </div>
                        <div className="mt-7 flex flex-wrap gap-3">
                          <button
                            onClick={() => router.push(`/lessons/${slug}`)}
                            className="inline-flex items-center gap-2 bg-[#33478D] text-white px-5 py-3 rounded-[12px] font-bold shadow-md hover:bg-[#2b3d7a] transition"
                          >
                            <Play size={16} fill="white" /> Resume Lesson
                          </button>
                          <button
                            onClick={() => speak(`${title}.`)}
                            className="inline-flex items-center gap-2 bg-[#EAF7EE] text-[#2E8B57] px-5 py-3 rounded-[12px] font-bold hover:bg-[#dff1e5] transition"
                          >
                            <Mic size={16} /> Read Lesson
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </section>

            {/* Progress Overview */}
            <section>
              <h2 className="text-[18px] font-extrabold text-[#27314D] mb-3">My Progress Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ProgressOverviewCard title="Math"    value={progress.math    ?? 0} icon={<Calculator  size={18} className="text-[#E7873C]" />} iconBg="bg-[#FFF1E4]" barColor="#E7873C" />
                <ProgressOverviewCard title="Science" value={progress.science ?? 0} icon={<FlaskConical size={18} className="text-[#5AAF7B]" />} iconBg="bg-[#E9F7EF]" barColor="#5AAF7B" />
                <ProgressOverviewCard title="English" value={progress.english ?? 0} icon={<BookOpen    size={18} className="text-[#A15EFF]" />} iconBg="bg-[#F4ECFF]" barColor="#A15EFF" />
              </div>
            </section>

            {/* Weekly Study Plan */}
            <section>
              <h2 className="text-[18px] font-extrabold text-[#27314D] mb-3">Weekly Study Plan</h2>
              <div className="bg-white rounded-[22px] border border-[#E7EAF2] shadow-[0_4px_18px_rgba(24,39,75,0.04)] px-5 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  {weeklyPlan.length > 0
                    ? weeklyPlan.map(p => <MiniPlan key={p.day} label={p.label} value={p.value} color={p.color} />)
                    : <>
                        <MiniPlan label="Mon: Mathematics" value={progress.math    ?? 0} color="#E7873C" />
                        <MiniPlan label="Tue: Science"     value={progress.science ?? 0} color="#5AAF7B" />
                        <MiniPlan label="Wed: English"     value={progress.english ?? 0} color="#A15EFF" />
                        <MiniPlan label="Thu: Mathematics" value={progress.math    ?? 0} color="#D3D9E8" />
                      </>
                  }
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <h2 className="text-[18px] font-extrabold text-[#27314D] mb-3">Recent Activity</h2>
              <div className="bg-white rounded-[22px] border border-[#E7EAF2] shadow-[0_4px_18px_rgba(24,39,75,0.04)] px-6 py-4">
                <ActivityRow dotColor="bg-[#E7873C]" title="Completed Quiz: Algebra I"      time="2 hours ago" />
                <ActivityRow dotColor="bg-[#E8C84A]" title="Earned Speed Learner Badge"     time="Yesterday" />
                <ActivityRow dotColor="bg-[#5AAF7B]" title="Started Lesson: Cell Structure" time="Yesterday" last />
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-4 space-y-6">

            {/* Achievements */}
            <section>
              <h2 className="text-[18px] font-extrabold text-[#27314D] mb-3">Recent Achievements</h2>
              <div className="bg-white rounded-[22px] border border-[#E7EAF2] shadow-[0_4px_18px_rgba(24,39,75,0.04)] p-5">
                <AchievementItem icon={<Trophy   size={18} className="text-[#C49A1D]" />} iconBg="bg-[#F7EFC4]" title="Speed Learner"  desc="Completed 3 lessons in under an hour" />
                <AchievementItem icon={<Flame    size={18} className="text-[#E85A4F]" />} iconBg="bg-[#F8E2E0]" title="7-Day Streak"   desc="You've logged in for 7 consecutive days!" />
                <AchievementItem icon={<Lightbulb size={18} className="text-[#4A67D6]" />} iconBg="bg-[#E2E8FF]" title="Math Whiz"     desc="Scored 100% on the Fractions Quiz" />
                <button
                  onClick={() => router.push("/achievements")}
                  className="mt-5 w-full rounded-[12px] border border-[#E0E5EF] py-3 text-[14px] font-bold text-[#4B556D] hover:bg-[#F8FAFD]"
                >
                  View All Badges
                </button>
              </div>
            </section>

            {/* Recommended */}
            <section>
              <h2 className="text-[18px] font-extrabold text-[#27314D] mb-3">Recommended for You</h2>
              <div className="space-y-4">
                <RecommendedCard color="bg-[#E08135]" title="Advanced Geometry"       desc="Explore complex shapes, theorems, and spatial reasoning."    badge="Advanced Geometry" />
                <RecommendedCard color="bg-[#57B47D]" title="Organic Chemistry Basics" desc="Introduction to carbon-based compounds and reactions."        badge="Organic Chemistry" />
              </div>
            </section>

            {/* Voice Assistant */}
            <section className="relative overflow-hidden bg-[#33478D] rounded-[22px] text-white px-6 py-7">
              <div className="absolute right-[-22px] bottom-[-24px] w-32 h-32 bg-white/10 rounded-full" />
              <div className="absolute right-16 top-6 w-14 h-14 bg-white/10 rounded-full" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center mb-5">
                  <Mic size={24} />
                </div>
                <h3 className="text-[28px] font-extrabold tracking-[-0.02em]">Voice Assistant Active</h3>
                <p className="mt-4 text-[15px] text-white/90 leading-7 max-w-[320px]">
                  I announce myself once and keep listening for your commands.
                </p>
                <div className="mt-4 text-sm text-white/80 font-medium">
                  {isListening ? "🎤 Listening…" : "Ready to help…"}
                </div>
              </div>
            </section>

            {/* Learning Community */}
            <section className="bg-white rounded-[22px] border border-[#E7EAF2] shadow-[0_4px_18px_rgba(24,39,75,0.04)] p-5 relative">
              <h2 className="text-[18px] font-extrabold text-[#27314D] mb-4">Learning Community</h2>
              <div className="grid grid-cols-2 gap-4">
                <CommunityCard icon={<MessageSquare size={18} />} label="Ask a Tutor" />
                <CommunityCard icon={<Users size={18} />}         label="Study Groups" />
              </div>
              <button className="absolute -bottom-3 right-5 w-14 h-14 rounded-full bg-[#4D63A8] text-white flex items-center justify-center shadow-lg hover:bg-[#415594] transition">
                <Mic size={22} />
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function TopStatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-[#EFF2F8] rounded-[16px] px-6 py-4 min-w-[124px] text-center">
      <p className="text-[10px] font-extrabold tracking-[0.18em] text-[#6F7891] uppercase">{title}</p>
      <p className="mt-2 text-[18px] font-extrabold text-[#33478D]">{value}</p>
    </div>
  );
}

function TopGoalCard() {
  return (
    <div className="bg-[#EFF2F8] rounded-[16px] px-5 py-4 min-w-[136px]">
      <p className="text-[10px] font-extrabold tracking-[0.18em] text-[#6F7891] uppercase">DAILY GOAL</p>
      <p className="mt-1 text-[12px] font-extrabold text-[#33478D]">45/60m</p>
      <div className="mt-2 h-[6px] rounded-full bg-white overflow-hidden">
        <div className="h-full w-[75%] rounded-full bg-[#33478D]" />
      </div>
      <p className="mt-2 text-[11px] font-semibold text-[#6F7891]">75% of study target</p>
    </div>
  );
}

function ProgressOverviewCard({ title, value, icon, iconBg, barColor }: { title: string; value: number; icon: React.ReactNode; iconBg: string; barColor: string }) {
  const hasData = value > 0;
  return (
    <div className="bg-white rounded-[18px] border border-[#E7EAF2] shadow-[0_4px_18px_rgba(24,39,75,0.04)] p-5">
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-[10px] ${iconBg} flex items-center justify-center`}>{icon}</div>
        <span className={`text-[17px] font-extrabold ${hasData ? "text-[#27314D]" : "text-[#C0C8D6]"}`}>
          {hasData ? `${value}%` : "–"}
        </span>
      </div>
      <p className="mt-5 text-[15px] font-extrabold text-[#3A4566]">{title}</p>
      {hasData ? (
        <div className="mt-4 h-[6px] bg-[#E8EBF3] rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: barColor }} />
        </div>
      ) : (
        <p className="mt-3 text-[12px] text-[#B0BACC] font-medium">Complete a quiz to track progress</p>
      )}
    </div>
  );
}

function MiniPlan({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[13px] font-bold text-[#4A546E]">
        <span>{label}</span><span className="text-[#34498D]">{value}%</span>
      </div>
      <div className="mt-2 h-[6px] bg-[#E8EBF3] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function ActivityRow({ dotColor, title, time, last = false }: { dotColor: string; title: string; time: string; last?: boolean }) {
  return (
    <div className={`flex items-start gap-4 py-5 ${!last ? "border-b border-[#EDF0F6]" : ""}`}>
      <div className={`w-2 h-2 rounded-full mt-2 ${dotColor}`} />
      <div>
        <p className="text-[16px] font-bold text-[#33415C]">{title}</p>
        <p className="text-[13px] text-[#9AA3B6] mt-1">{time}</p>
      </div>
    </div>
  );
}

function AchievementItem({ icon, iconBg, title, desc }: { icon: React.ReactNode; iconBg: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4 py-3">
      <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>{icon}</div>
      <div>
        <p className="text-[16px] font-extrabold text-[#27314D]">{title}</p>
        <p className="text-[13px] text-[#7E879C] mt-1 leading-5">{desc}</p>
      </div>
    </div>
  );
}

function RecommendedCard({ color, title, desc, badge }: { color: string; title: string; desc: string; badge: string }) {
  return (
    <div className="bg-white rounded-[20px] border border-[#E7EAF2] shadow-[0_4px_18px_rgba(24,39,75,0.04)] p-4 flex gap-4 items-center">
      <div className={`w-[92px] h-[66px] rounded-[14px] ${color} text-white flex items-center justify-center text-[11px] font-extrabold uppercase tracking-wide text-center px-2 leading-4 shrink-0`}>
        {badge}
      </div>
      <div>
        <h3 className="text-[18px] font-extrabold text-[#27314D]">{title}</h3>
        <p className="mt-1 text-[13px] text-[#7E879C] leading-6">{desc}</p>
      </div>
    </div>
  );
}

function CommunityCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="h-[96px] rounded-[16px] border border-[#E3E7F0] bg-[#F8FAFD] flex flex-col items-center justify-center gap-2 text-[#33478D] font-bold hover:bg-[#F1F5FB] transition">
      {icon}
      <span className="text-[14px]">{label}</span>
    </button>
  );
}
