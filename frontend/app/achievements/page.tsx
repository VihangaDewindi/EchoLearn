"use client";

import React, { useEffect, useState, useRef } from "react";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import StatsCard from "@/components/Achievements/StatsCard";
import BadgeCard from "@/components/Achievements/BadgeCard";
import MilestoneItem from "@/components/Achievements/MilestoneItem";
import { Trophy, Flame, BarChart3, Zap, Calendar, Moon, Settings, Compass, Globe, GraduationCap, Users, Target, Share2, Play, Mic } from "lucide-react";
import { speak, getSpeechRecognition, tryUnlockAudio } from "@/lib/voiceUtils";
import { useRouter } from "next/navigation";

const ICON_MAP: Record<string, any> = {
  Zap, Calendar, Moon, Settings, Compass, Globe, GraduationCap, Users, Target, Trophy,
  ribbon: Trophy, star: Trophy, award: Trophy, medal: Trophy, crown: Trophy, badge: Trophy,
};

const BADGE_STYLES = [
  { color: "bg-indigo-100",  iconColor: "text-indigo-600"  },
  { color: "bg-orange-100",  iconColor: "text-orange-600"  },
  { color: "bg-purple-100",  iconColor: "text-purple-600"  },
  { color: "bg-emerald-100", iconColor: "text-emerald-600" },
  { color: "bg-yellow-100",  iconColor: "text-yellow-600"  },
  { color: "bg-blue-100",    iconColor: "text-blue-600"    },
];

function toTitleCase(name: string) {
  if (!name) return "";
  return name.replace(/\b\w/g, c => c.toUpperCase());
}

export default function AchievementsPage() {
  const router = useRouter();
  const [loading, setLoading]         = useState(true);
  const [userData, setUserData]       = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(false);

  const hasGreetedRef    = useRef(false);
  const keepListeningRef = useRef(true);
  const isSpeakingRef    = useRef(false);
  const recognitionRef   = useRef<any>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    Promise.all([
      fetch("http://localhost:5001/api/achievements/me", { headers })
        .then(r => r.ok ? r.json() : null)
        .catch(() => null),
      fetch("http://localhost:5001/api/achievements/leaderboard")
        .then(r => r.json())
        .catch(() => []),
    ]).then(([ach, lb]) => {
      if (ach) {
        setUserData({
          fullName: ach.fullName,
          xp: ach.xp,
          streak: ach.streak,
          rank: ach.rank,
          xpToTop: ach.xpToTop,
          badges: (ach.badges || []).map((b: any, i: number) => ({
            name: b.name,
            earned: b.earnedDate ? new Date(b.earnedDate).toLocaleDateString() : "Recently",
            icon: ICON_MAP[b.icon] || Trophy,
            color: BADGE_STYLES[i % BADGE_STYLES.length].color,
            iconColor: BADGE_STYLES[i % BADGE_STYLES.length].iconColor,
          })),
          milestones: (ach.milestones || []).map((m: any) => ({
            title: m.title,
            desc: m.description,
            progress: m.progress,
            icon: GraduationCap,
            bg: "bg-indigo-50",
            color: "text-indigo-600",
            info: m.current,
            isPending: m.status === "Pending",
          })),
        });
      } else {
        setUserData({
          fullName: "Student",
          xp: 0, streak: 0, rank: 999, xpToTop: 9999,
          badges: [], milestones: [],
        });
      }
      setLeaderboard(lb || []);
      setLoading(false);
    });
  }, []);

  // Voice assistant
  useEffect(() => {
    if (!userData) return;

    keepListeningRef.current = true;
    isSpeakingRef.current    = false;

    const recognition = getSpeechRecognition();
    if (!recognition) return;
    recognitionRef.current = recognition;
    recognition.continuous      = true;
    recognition.interimResults  = false;
    recognition.lang            = "en-US";
    recognition.maxAlternatives = 5;

    const stopListening  = () => { try { recognition.stop(); } catch {} };
    const startListening = () => {
      if (!keepListeningRef.current) return;
      try { recognition.start(); } catch {}
    };
    const speakThen = (text: string, onEnd?: () => void) => {
      isSpeakingRef.current = true;
      // Keep recognition running during TTS — commands heard the moment speech ends
      speak(text, () => {
        isSpeakingRef.current = false;
        onEnd?.();
        if (keepListeningRef.current) setTimeout(startListening, 150);
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
      if (err === "no-speech" || err === "audio-capture" || err === "network") {
        setTimeout(startListening, 1000);
      }
    };

    recognition.onresult = (event: any) => {
      const lastResult = event.results[event.results.length - 1];
      // Check all alternatives for better command matching
      for (let i = 0; i < lastResult.length; i++) {
        const cmd = lastResult[i].transcript.toLowerCase().trim();
        if (!cmd) continue;
        console.log("[Achievements voice] alt", i, "heard:", cmd);

        if (cmd.includes("lesson") || cmd.includes("learn") || cmd.includes("study") || cmd.includes("go back")) {
          keepListeningRef.current = false;
          stopListening();
          window.speechSynthesis.cancel();
          router.push("/lessons");
          return;
        }
        if (cmd.includes("home") || cmd.includes("dashboard") || cmd.includes("back") || cmd.includes("main") || cmd.includes("navigate home") || cmd.includes("go home") || cmd.includes("student dashboard")) {
          keepListeningRef.current = false;
          stopListening();
          window.speechSynthesis.cancel();
          router.push("/Student/dashboard");
          return;
        }
        if (cmd.includes("share") || cmd.includes("progress") || cmd.includes("copy")) {
          handleShare();
          return;
        }
        if (cmd.includes("where am i") || cmd.includes("where")) {
          speakThen(`You're on the achievements page. You have ${userData.xp} XP, a ${userData.streak}-day streak, and you're rank ${userData.rank}.`);
          return;
        }
        if (cmd.includes("repeat") || cmd.includes("again") || cmd.includes("say that again")) {
          speakThen(`You have ${userData.xp} XP, a ${userData.streak}-day streak, rank ${userData.rank}. Say "go to home" or "continue learning".`);
          return;
        }
      }
      // Fallback — no command matched any alternative
      speakThen(`I didn't catch that. Say "go to home" or "continue learning".`);
    };

    const startAssistant = async () => {
      if (hasGreetedRef.current) return;
      hasGreetedRef.current = true;
      await tryUnlockAudio();
      const firstName = userData.fullName?.split(" ")[0] || "there";
      const badgeCount = userData.badges?.length || 0;
      const badgeSummary = badgeCount === 0
        ? "You have no badges yet — complete a quiz to earn your first one."
        : `You have ${badgeCount} badge${badgeCount !== 1 ? "s" : ""}: ${userData.badges.slice(0, 3).map((b: any) => b.name).join(", ")}${badgeCount > 3 ? ", and more" : ""}.`;
      speakThen(
        `Welcome to the Achievements page, ${firstName}! ` +
        `You have earned ${userData.xp} XP points, a ${userData.streak}-day learning streak, and you are ranked number ${userData.rank}. ` +
        `${badgeSummary} ` +
        `Say "go to home" to return to your dashboard, or "continue learning" to go to lessons.`
      );
    };

    localStorage.removeItem("voiceStart");
    // Start recognition before TTS so it's warm when the student speaks
    setTimeout(startListening, 300);
    startAssistant();

    const unlock = async () => { await tryUnlockAudio(); startAssistant(); };
    window.addEventListener("click",   unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      keepListeningRef.current = false;
      // Do NOT reset hasGreetedRef — prevents double-greeting in Strict Mode re-mount
      window.removeEventListener("click",   unlock);
      window.removeEventListener("keydown", unlock);
      try {
        recognition.onstart  = null; recognition.onend    = null;
        recognition.onresult = null; recognition.onerror  = null;
        recognition.stop();
      } catch {}
      window.speechSynthesis.cancel();
    };
  }, [userData, router]);

  const handleShare = () => {
    if (!userData) return;
    const text = `I have ${userData.xp} XP and a ${userData.streak}-day learning streak on EchoLearn! Rank #${userData.rank}`;
    if (navigator.share) {
      navigator.share({ title: "My EchoLearn Progress", text, url: window.location.origin }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        speak("Progress copied to clipboard!");
      });
    }
  };

  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const xpToTop = userData?.xpToTop ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <DashboardNavbar user={userData} />

      <main className="max-w-6xl mx-auto px-6 mt-8">
        <div className="flex gap-8">

          {/* Left: stats + badges + milestones */}
          <div className="flex-1 flex flex-col gap-10">

            <div className="flex gap-6">
              <StatsCard label="Total Points" value={(userData.xp ?? 0).toLocaleString()} unit="XP" icon={Trophy} iconBg="bg-yellow-100" iconColor="text-yellow-600" />
              <StatsCard label="Current Streak" value={userData.streak ?? 0} unit="Days" icon={Flame} iconBg="bg-orange-100" iconColor="text-orange-600" />
              <StatsCard label="Global Rank" value={`#${userData.rank ?? "—"}`} icon={BarChart3} iconBg="bg-indigo-100" iconColor="text-indigo-600" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Earned Badges</h2>
              </div>
              {userData.badges.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-400 font-medium">
                  Complete quizzes to earn badges!
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {userData.badges.map((badge: any, i: number) => (
                    <BadgeCard key={i} name={badge.name} earnedDate={badge.earned} icon={badge.icon} bgColor={badge.color} iconColor={badge.iconColor} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Milestones</h2>
              <div className="flex flex-col gap-4">
                {userData.milestones.map((ms: any, i: number) => (
                  <MilestoneItem key={i} title={ms.title} description={ms.desc} progress={ms.progress} icon={ms.icon} iconBg={ms.bg} iconColor={ms.color} currentInfo={ms.info} isPending={ms.isPending} />
                ))}
              </div>
            </div>
          </div>

          {/* Right: leaderboard sidebar */}
          <div className="w-80 flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>
                <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">All Students · By XP</p>
              </div>

              <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
                {leaderboard.map((u: any, i: number) => {
                  const isMe = u.fullName === userData?.fullName;
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-2 rounded-xl ${isMe ? "bg-indigo-50 border border-indigo-100 ring-1 ring-indigo-100" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold w-5 ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-orange-400" : "text-gray-400"}`}>
                          {i + 1}
                        </span>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${isMe ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-600"}`}>
                          {toTitleCase(u.fullName)?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${isMe ? "text-indigo-700" : "text-gray-800"}`}>
                            {toTitleCase(u.fullName)}{isMe && <span className="ml-1 bg-indigo-600 text-[8px] text-white px-1 rounded uppercase font-bold">Me</span>}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold">{(u.xp || 0).toLocaleString()} XP</p>
                        </div>
                      </div>
                      {i === 0 && <span className="text-lg">🏆</span>}
                    </div>
                  );
                })}
                {leaderboard.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No students yet.</p>
                )}
              </div>

              <button
                onClick={handleShare}
                className="w-full mt-6 bg-[#1f3f7f] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#152e61] transition-all"
              >
                <Share2 size={16} /> Share Progress
              </button>
            </div>

            {/* Motivation card */}
            <div className="bg-[#2D4496] rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2">
                  {xpToTop > 0 ? "Almost at the Top!" : "You're Number 1!"}
                </h3>
                <p className="text-xs text-indigo-100 mb-6 leading-relaxed">
                  {xpToTop > 0
                    ? `You're just ${xpToTop.toLocaleString()} XP away from the top. Keep studying!`
                    : "You're leading the leaderboard! Keep it up!"}
                </p>
                <button
                  onClick={() => router.push("/lessons")}
                  className="bg-white text-[#2D4496] px-6 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-all flex items-center gap-2"
                >
                  <Play size={14} fill="currentColor" /> Continue Learning
                </button>
              </div>
              <div className="absolute -bottom-8 -right-8 opacity-10">
                <Play size={150} fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Voice indicator */}
      <div className={`fixed bottom-6 left-6 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border transition-colors ${isListening ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200"}`}>
        <Mic size={18} className={isListening ? "animate-pulse" : ""} />
        <span className="text-[13px] font-bold">{isListening ? "Listening…" : "Voice Ready"}</span>
      </div>
    </div>
  );
}
