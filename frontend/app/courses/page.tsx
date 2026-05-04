"use client";

import { useEffect, useState } from "react";
import {
  Calculator,
  FlaskConical,
  BookOpen,
  Landmark,
  Palette,
  Globe
} from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";
import LandingFooter from "@/components/LandingFooter";
import { speak, getSpeechRecognition, tryUnlockAudio } from "@/lib/voiceUtils";
import { useRouter } from "next/navigation";

const getTagStyles = (tag: string = "") => {
  switch (tag.toUpperCase()) {
    case "SCIENCE": return "bg-teal-600";
    case "IT": return "bg-slate-700";
    case "ENGLISH": return "bg-purple-600";
    case "MATH": return "bg-blue-600";
    case "ART": return "bg-rose-600";
    case "HISTORY": return "bg-amber-700";
    default: return "bg-indigo-600";
  }
};

const subjects = [
  { name: "Math",      icon: Calculator, },
  { name: "Science",   icon: FlaskConical },
  { name: "English",   icon: BookOpen },
  { name: "History",   icon: Landmark },
  { name: "Art",       icon: Palette },
  { name: "Languages", icon: Globe },
];

const FEATURED = [
  { img: "/science.jpg", tag: "SCIENCE", title: "Particles of Motion",       desc: "Explore motion, energy, and the fundamental forces that shape our physical world." },
  { img: "/i.png",       tag: "IT",      title: "Hardware & Software Basics", desc: "Understand how computers work, from internal hardware to everyday applications." },
  { img: "/english.jpg", tag: "ENGLISH", title: "The Story Tree",             desc: "Build strong reading and writing skills through grammar, vocabulary, and storytelling." },
];

export default function CoursesPage() {
  const [hasGreeted, setHasGreeted] = useState(false);
  const router = useRouter();

  const goToLogin = () => router.push("/login");

  // Voice assistant
  useEffect(() => {
    if (hasGreeted) return;

    const recognition = getSpeechRecognition();

    const startAssistant = async () => {
      await tryUnlockAudio();
      speak(
        `Welcome to the courses page! Browse our featured courses or explore by subject. ` +
        `Say "open math", "open science", or "open english" to filter. ` +
        `Say "go to dashboard" to head back.`,
        () => {
          if (recognition) { try { recognition.start(); } catch {} }
        }
      );
      setHasGreeted(true);
    };

    startAssistant();

    const unlockAudio = () => {
      tryUnlockAudio();
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
    window.addEventListener("click", unlockAudio);
    window.addEventListener("keydown", unlockAudio);

    if (recognition) {
      recognition.onend = () => {
        setTimeout(() => { try { recognition.start(); } catch {} }, 1500);
      };
      recognition.onresult = (event: any) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        if (command.includes("go to dashboard") || command.includes("back to dashboard")) {
          router.push("/Student/dashboard");
        } else if (command.includes("log in") || command.includes("login") || command.includes("sign in")) {
          router.push("/login");
        } else if (command.includes("where am i")) {
          speak("You're on the courses page. Log in to start learning.");
        }
      };
    }

    return () => {
      if (recognition) { try { recognition.stop(); } catch {} }
      window.speechSynthesis.cancel();
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, [hasGreeted, router]);

  return (
    <div className="bg-[#F5F7FB] min-h-screen flex flex-col">
      <LandingNavbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* ===== CONTINUE LEARNING ===== */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Continue Learning</h2>

          <div className="bg-gradient-to-r from-[#1E2A5A] to-[#3A4A8A] rounded-2xl text-white shadow-lg flex overflow-hidden">
            <div className="hidden md:block w-1/3">
              <img src="/maths.png" alt="Course Preview" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex-1">
              <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
                PRIMARY MATHEMATICS • Audio-Optimized
              </span>
              <h3 className="text-xl font-semibold mt-3">Addition &amp; Subtraction</h3>
              <p className="text-white/70 text-sm mt-1">Module 4: Addition &amp; Subtraction</p>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>65% Completed</span><span>Lesson 12 of 18</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full">
                  <div className="bg-green-400 h-2 rounded-full w-[65%]" />
                </div>
              </div>
              <button
                onClick={goToLogin}
                className="mt-4 bg-white text-[#1E2A5A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
              >
                Resume Learning
              </button>
            </div>
          </div>

          {/* ===== FEATURED COURSES ===== */}
          <h2 className="mt-10 mb-4 font-semibold text-gray-800">Featured Courses</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURED.map((c) => (
              <div
                key={c.title}
                onClick={goToLogin}
                className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer group"
              >
                <div className="h-40 relative">
                  <img
                    src={c.img}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className={`absolute top-2 left-2 text-[10px] font-bold tracking-wider text-white px-2 py-0.5 rounded uppercase ${getTagStyles(c.tag)}`}>
                    {c.tag === "IT" ? "INFORMATION & TECHNOLOGY" : c.tag}
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm">{c.title}</h3>
                  <p className="text-xs text-gray-500 mt-2">{c.desc}</p>
                  <p className="text-xs text-[#1F3F7F] font-bold mt-2">Log in to start →</p>
                </div>
              </div>
            ))}
          </div>

          {/* ===== EXPLORE BY SUBJECT ===== */}
          <h2 className="mt-12 mb-6 font-semibold text-gray-800 text-lg">Explore by Subject</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {subjects.map(({ name, icon: Icon }) => (
              <div
                key={name}
                onClick={goToLogin}
                className="group cursor-pointer flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1"
              >
                <Icon size={35} className="text-[#1F3F7F] transition-all duration-300 group-hover:scale-110 group-hover:text-[#2B5BB3]" />
                <span className="mt-3 text-sm font-medium text-gray-700 group-hover:text-[#1F3F7F] transition">{name}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 bg-[#1F3F7F] rounded-2xl p-8 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Ready to start learning?</h3>
            <p className="text-white/70 text-sm mb-4">Sign up for free and access all courses with full voice navigation.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => router.push("/signup")} className="bg-white text-[#1F3F7F] font-bold px-6 py-2.5 rounded-lg hover:bg-gray-100 transition">
                Sign Up Free
              </button>
              <button onClick={goToLogin} className="border border-white/40 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-white/10 transition">
                Log In
              </button>
            </div>
          </div>

        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
