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

type Course = {
  _id: string;
  title?: string;
  description?: string;
  rating?: number;
  progress?: number;
  tag?: string;
  image?: string;
  accessibilityRating?: number;
};

const getTagStyles = (tag: string = "") => {
  const t = tag.toUpperCase();
  switch (t) {
    case "SCIENCE":
      return "bg-teal-600 shadow-teal-100";
    case "IT":
      return "bg-slate-700 shadow-slate-100";
    case "GEOGRAPHY":
      return "bg-emerald-600 shadow-emerald-100";
    case "ENGLISH":
      return "bg-purple-600 shadow-purple-100";
    case "MATH":
      return "bg-blue-600 shadow-blue-100";
    case "ART":
      return "bg-rose-600 shadow-rose-100";
    case "HISTORY":
      return "bg-amber-700 shadow-amber-100";
    default:
      return "bg-indigo-600 shadow-indigo-100";
  }
};

const getAccessibilityStyles = (rating: number = 0) => {
  if (rating >= 95) return "bg-green-50 text-green-700 border-green-200";
  if (rating >= 85) return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-yellow-50 text-yellow-700 border-yellow-200";
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  const fetchCourses = async (tag: string) => {
  const res = await fetch(`http://localhost:5000/api/courses?tag=${tag}`);
  const data = await res.json();
  setCourses(data);
};

  const subjects = [
    { name: "Math", tag: "MATH", icon: Calculator, color: "from-blue-500 to-indigo-600" },
    { name: "Science", tag: "SCIENCE", icon: FlaskConical, color: "from-teal-500 to-emerald-600" },
    { name: "English", tag: "ENGLISH", icon: BookOpen, color: "from-purple-500 to-pink-500" },
    { name: "History", tag: "HISTORY", icon: Landmark, color: "from-amber-500 to-orange-600" },
    { name: "Art", tag: "ART", icon: Palette, color: "from-rose-500 to-red-500" },
    { name: "Languages", tag: "LANGUAGES", icon: Globe, color: "from-green-500 to-lime-600" },
  ];

  return (
    <div className="bg-[#F5F7FB] min-h-screen flex flex-col">
      <LandingNavbar />

      <main className="flex-1">

        {/* CONTAINER */}
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* ================= CONTINUE LEARNING ================= */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Continue Learning
            </h2>
          </div>

          <div className="bg-gradient-to-r from-[#1E2A5A] to-[#3A4A8A] rounded-2xl text-white shadow-lg flex overflow-hidden">

            {/* LEFT PANEL */}
            <div className="hidden md:block w-1/3">
              <img
                src="/maths.png"
                alt="Course Preview"
                className="w-full h-full object-cover"
              />
            </div>


            {/* RIGHT CONTENT */}
            <div className="p-6 flex-1">
              <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
                PRIMARY MATHEMATICS • Audio-Optimized
              </span>

              <h3 className="text-xl font-semibold mt-3">
                Addition & Subtraction
              </h3>

              <p className="text-white/70 text-sm mt-1">
                Module 4: Addition & Subtraction
              </p>

              {/* PROGRESS */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>65% Completed</span>
                  <span>Lesson 12 of 18</span>
                </div>

                <div className="w-full bg-white/20 h-2 rounded-full">
                  <div className="bg-green-400 h-2 rounded-full w-[65%]" />
                </div>
              </div>

              <button className="mt-4 bg-white text-[#1E2A5A] px-4 py-2 rounded-lg text-sm font-medium">
                Resume Learning
              </button>
            </div>
          </div>

          {/* ================= COURSE CARDS ================= */}
          <h2 className="mt-10 mb-4 font-semibold text-gray-800">
            Featured Courses
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {/* SCIENCE */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="h-40 relative">
                <img
                  src="/science.jpg"
                  alt="Science"
                  className="w-full h-full object-cover"
                />

                <span className={`absolute top-2 left-2 text-[10px] font-bold tracking-wider text-white px-2 py-0.5 rounded uppercase ${getTagStyles("SCIENCE")}`}>
                  SCIENCE
                </span>
              </div>

              <div className="p-3">
                <h3 className="font-semibold text-gray-800 text-sm">
                  Particles of Motion
                </h3>

                <p className="text-xs text-gray-500 mt-2">
                  Explore motion, energy, and the fundamental forces that shape our physical world.
                </p>
              </div>
            </div>

            {/* IT */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="h-40 relative">
                <img
                  src="/i.png"
                  alt="IT"
                  className="w-full h-full object-cover"
                />

                <span className={`absolute top-2 left-2 text-[10px] font-bold tracking-wider text-white px-2 py-0.5 rounded uppercase ${getTagStyles("IT")}`}>
                  INFORMATION & TECHNOLOGY
                </span>
              </div>

              <div className="p-3">
                <h3 className="font-semibold text-gray-800 text-sm">
                  Hardware & Software Basics
                </h3>

                <p className="text-xs text-gray-500 mt-2">
                  Understand how computers work, from internal hardware to everyday applications.
                </p>
              </div>
            </div>

            {/* ENGLISH */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="h-40 relative">
                <img
                  src="/english.jpg"
                  alt="English"
                  className="w-full h-full object-cover"
                />

                <span className={`absolute top-2 left-2 text-[10px] font-bold tracking-wider text-white px-2 py-0.5 rounded uppercase ${getTagStyles("ENGLISH")}`}>
                  ENGLISH
                </span>
              </div>

              <div className="p-3">
                <h3 className="font-semibold text-gray-800 text-sm">
                  The Story Tree
                </h3>

                <p className="text-xs text-gray-500 mt-2">
                  Build strong reading and writing skills through grammar, vocabulary, and storytelling.
                </p>
              </div>
            </div>

          </div>


          {/* ================= SUBJECTS ================= */}
          {/* ================= SUBJECTS ================= */}
          <h2 className="mt-12 mb-6 font-semibold text-gray-800 text-lg">
            Explore by Subject
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">

            {subjects.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className="group cursor-pointer flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1"
                >
                  {/* ICON (NO BACKGROUND) */}
                  <Icon
                    size={35}
                    className="text-[#1F3F7F] transition-all duration-300 group-hover:scale-110 group-hover:text-[#2B5BB3]"
                  />

                  {/* TEXT */}
                  <span className="mt-3 text-sm font-medium text-gray-700 group-hover:text-[#1F3F7F] transition">
                    {item.name}
                  </span>
                </div>
              );
            })}

          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
