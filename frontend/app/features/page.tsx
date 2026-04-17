"use client";

import Image from "next/image";
import Link from "next/link";
import LandingNavbar from "@/components/LandingNavbar";
import LandingFooter from "@/components/LandingFooter";
import { Volume2, Mic, Keyboard, Type, Globe } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#111827]">
      <LandingNavbar />

      {/* --- HERO --- */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-10">
        <h1 className="text-6xl font-black text-[#1E1E1E] leading-[1.1]">
          Education Tailored to <br />
          <span className="text-[#1F3F7F]">Every Learner</span>
        </h1>

        <p className="text-gray-900 mt-6 max-w-xl">
          EchoLearn is built from the ground up to ensure that visual, motor,
          or cognitive differences never stand in the way of knowledge.
          Explore our suite of specialized accessibility tools.
        </p>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-2 gap-6">

        {/* TTS CARD */}
        <div className="group bg-gradient-to-br from-[#3A4A8A] to-[#1F3F7F] text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">

          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Volume2 />
            </div>
            <h3 className="font-bold text-lg">Text-to-Speech (TTS)</h3>
          </div>
          <p className="text-sm text-white/90 leading-relaxed">
            Natural, human-like voice narration with adjustable speed,
            pitch, and voice styles for a better learning experience.
          </p>

        </div>


        {/* VOICE NAV */}
        <div className="group bg-gradient-to-br from-[#3A4A8A] to-[#1F3F7F] text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">

          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Mic />
            </div>
            <h3 className="font-bold text-lg">Voice Navigation</h3>
          </div>

          <p className="text-sm text-white/90 leading-relaxed">
            Navigate effortlessly using voice commands. A hands-free
            experience designed for accessibility and speed.
          </p>
        </div>


        {/* KEYBOARD */}
        <div className="group bg-gradient-to-br from-[#3A4A8A] to-[#1F3F7F] text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">

          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Keyboard />
            </div>
            <h3 className="font-bold text-lg">Keyboard Friendly</h3>
          </div>

          <p className="text-sm text-white/90 leading-relaxed">
            Fully navigable without a mouse. Designed for assistive devices
            and seamless keyboard interaction.
          </p>
        </div>


        {/* DYSLEXIA */}
        <div className="group bg-gradient-to-br from-[#3A4A8A] to-[#1F3F7F] text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">

          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Type />
            </div>
            <h3 className="font-bold text-lg">Dyslexia Mode</h3>
          </div>

          <p className="text-sm text-white/90 leading-relaxed">
            Optimized fonts, improved spacing, and high contrast
            color schemes to enhance readability and focus.
          </p>
        </div>

      </section>

      {/* --- LOCAL IMPACT --- */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT */}
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Designed for Local Impact
            </h2>

            <p className="text-gray-900 mb-6">
              True inclusion means language should never be a barrier.
              EchoLearn provides deep native support for local languages.
            </p>

            <div className="space-y-4">
              <div className="bg-[#F3F4F6] p-4 rounded-lg flex items-center gap-3">
                <Globe className="text-[#3A4A8A]" />
                <span className="text-sm font-medium">
                  Personalized Learning Paths
                </span>
              </div>

              <div className="bg-[#F3F4F6] p-4 rounded-lg flex items-center gap-3">
                <Globe className="text-[#3A4A8A]" />
                <span className="text-sm font-medium">
                  Progress Tracking & Insights
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center">
            <div className="absolute w-80 h-80 bg-[#E5ECFF] rounded-full blur-3xl opacity-50"></div>

            <Image
              src="/students.png"
              alt="students"
              width={400}
              height={300}
              className="relative rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-[#1F3F7F] text-white rounded-2xl p-12 text-center shadow-xl relative overflow-hidden">

          <h2 className="text-3xl font-bold mb-4">
            Start your accessible learning journey today
          </h2>

          <p className="text-white/80 mb-6">
            Join thousands of students who are breaking barriers with
            EchoLearn’s inclusive platform.
          </p>

          <div className="flex justify-center gap-4">
            {/* PRIMARY BUTTON */}
            <Link
              href="/signup"
              className="px-7 py-3 rounded-lg font-semibold 
             bg-white text-[#3A4A8A]
             shadow-lg
             transition-all duration-300
             hover:bg-gray-100 hover:scale-105
             active:scale-95
             cursor-pointer"
            >
              Get Started Free
            </Link>

            {/* SECONDARY BUTTON */}
            <Link
              href="/courses"
              className="px-7 py-3 rounded-lg font-semibold text-white border border-white/70
               backdrop-blur-sm
               transition-all duration-300
               hover:bg-white/10 hover:scale-105
               active:scale-95
               cursor-pointer"
            >
              Try a Sample Lesson
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
