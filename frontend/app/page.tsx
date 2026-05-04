"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Volume2, Command, Keyboard, Type, CheckCircle2, X, Play, Mic, BookOpen, Award } from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';
import LandingFooter from '@/components/LandingFooter';

const DEMO_STEPS = [
  {
    icon: Mic,
    title: "Voice Navigation",
    desc: "Say commands like 'go to lessons', 'open quiz', or 'show achievements' — hands-free learning for every student.",
    color: "bg-[#1F3F7F]",
  },
  {
    icon: Volume2,
    title: "Text-to-Speech Lessons",
    desc: "Every lesson is read aloud with natural, human-like voices. Students with visual impairments can learn without any barriers.",
    color: "bg-[#2D6A4F]",
  },
  {
    icon: Type,
    title: "Dyslexia-Friendly Mode",
    desc: "Switch to OpenDyslexic font, increased letter spacing, and high-contrast colours with a single voice command.",
    color: "bg-[#6B3FA0]",
  },
  {
    icon: BookOpen,
    title: "Grade-by-Grade Curriculum",
    desc: "Structured lessons from Grade 1 to Grade 10 across Mathematics, Science, English, Sinhala, and Tamil.",
    color: "bg-[#B05C1A]",
  },
  {
    icon: Award,
    title: "XP & Achievements",
    desc: "Students earn XP after each quiz, unlock badges, and compete on a live leaderboard — keeping motivation high.",
    color: "bg-[#8B1A1A]",
  },
];

function DemoModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const current = DEMO_STEPS[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[560px] overflow-hidden">
        {/* Header */}
        <div className={`${current.color} text-white px-10 pt-10 pb-8 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
          >
            <X size={18} />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
            <Icon size={32} />
          </div>

          <p className="text-[11px] font-black tracking-[0.2em] text-white/60 uppercase mb-2">
            Feature {step + 1} of {DEMO_STEPS.length}
          </p>
          <h2 className="text-[28px] font-black leading-tight">{current.title}</h2>
        </div>

        {/* Body */}
        <div className="px-10 py-8">
          <p className="text-[16px] text-gray-600 leading-relaxed">{current.desc}</p>

          {/* Step dots */}
          <div className="flex items-center gap-2 mt-8 mb-6">
            {DEMO_STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? `w-8 ${current.color}` : "w-2 bg-gray-200"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition"
              >
                Back
              </button>
            )}
            {step < DEMO_STEPS.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 py-3 rounded-xl bg-[#1F3F7F] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#162e5f] transition"
              >
                <Play size={16} fill="white" /> Next Feature
              </button>
            ) : (
              <Link
                href="/signup"
                className="flex-1 py-3 rounded-xl bg-[#1F3F7F] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#162e5f] transition"
                onClick={onClose}
              >
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EchoLearnLanding() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans">
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}

      <LandingNavbar />

      {/* --- Hero Section --- */}
      <header className="bg-[#F3F4F6] pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div className="space-y-6 pr-8">
            <h1 className="text-6xl font-black text-[#1E1E1E] leading-[1.1]">
              Accessible <br /> Learning for <br />
              <span className="text-[#1F3F7F]">Every Student</span>
            </h1>

            <p className="text-gray-900 text-lg max-w-md leading-relaxed">
              Empowering Sri Lankan students with specialized tools for visual impairment and dyslexia.
            </p>

            <div className="flex gap-4 pt-4">
              <Link
                href="/signup"
                className="bg-[#1F3F7F] text-white px-8 py-4 rounded-lg font-bold hover:scale-105 transition"
              >
                Get Started
              </Link>
              <button
                onClick={() => setShowDemo(true)}
                className="bg-white border border-gray-300 px-8 py-4 rounded-lg font-bold hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Play size={16} className="text-[#1F3F7F]" fill="#1F3F7F" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="relative max-w-lg ml-auto">
            <Image
              src="/person.png"
              alt="Student"
              width={500}
              height={500}
              className="rounded-2xl w-full object-cover"
            />
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#FDEBD0] rounded-full blur-3xl opacity-50" />
          </div>
        </div>
      </header>

      {/* --- Features Section --- */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <p className="text-[#2D4496] text-m font-extrabold tracking-[0.2em] uppercase">Our Toolbox</p>
          <h2 className="text-4xl font-extrabold text-[#1E1E1E]">Designed for Real Needs</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            We've built EchoLearn from the ground up to ensure that technology is an enabler,
            not a hurdle, for students with different learning styles.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <FeatureCard
              icon={<Volume2 className="w-6 h-6" />}
              title="TTS (Text-to-Speech)"
              desc="Listen to your lessons with natural, high-quality voices. Perfect for students with visual impairments."
            />
            <FeatureCard
              icon={<Command className="w-6 h-6" />}
              title="Voice Navigation"
              desc="Say where you want to go. Navigate the entire dashboard and courses using simple voice commands."
            />
            <FeatureCard
              icon={<Keyboard className="w-6 h-6" />}
              title="Keyboard Friendly"
              desc="Full platform control designed for seamless mouse-free use with high-visibility focus states."
            />
            <FeatureCard
              icon={<Type className="w-6 h-6" />}
              title="Dyslexia Mode"
              desc="Switch to specialized open-dyslexic fonts and high-contrast color schemes with a single click."
            />
          </div>
        </div>
      </section>

      {/* --- Mission/Empowering Section --- */}
      <section className="bg-white py-6 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div className="rounded-7xl overflow-hidden relative p-4">
            <Image
              src="/book.jpg"
              alt="Hand writing in notebook"
              width={600}
              height={400}
              className="rounded-[1rem] w-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-black text-[#1E1E1E] leading-tight">
              Empowering Education <br /> in <span className="text-[#1F3F7F]">Sri Lanka</span>
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              EchoLearn was born out of a simple idea: No student in Sri Lanka should be left behind due to physical or cognitive differences.
              We've partnered with local educators to ensure our content aligns with the national syllabus while remaining 100% accessible.
            </p>
            <div className="space-y-4">
              <CheckItem text="Aligned with National Curriculum" />
              <CheckItem text="Assistive Learning Tools (TTS & Voice Navigation)" />
              <CheckItem text="Dyslexia-Friendly Reading Experience" />
            </div>
          </div>
        </div>
      </section>

      {/* --- Impact Statistics Section --- */}
      <section className="bg-[#F3F4F6] py-15 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h2 className="text-4xl font-black text-[#1E1E1E]">Our Impact</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Measuring our progress in building a more inclusive Sri Lanka
          </p>

          <div className="grid md:grid-cols-1 lg:grid-cols-4 gap-6 mt-10">
            {[
              { n: "12k+", l: "Students Enrolled" },
              { n: "85%", l: "Retention Rate" },
              { n: "45+", l: "Partner Schools" },
              { n: "250+", l: "Audio Modules" },
            ].map(({ n, l }) => (
              <div key={l} className="bg-white p-6 rounded-2xl text-center">
                <p className="text-4xl font-black text-[#1F3F7F] mb-2">{n}</p>
                <p className="text-gray-700 font-semibold">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="bg-[#1F3F7F] text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-black">Ready to start your journey?</h2>
          <p className="text-lg leading-relaxed">
            Join thousands of Sri Lankan students who are already learning without boundaries. Sign up for free today.
          </p>
          <Link
            href="/signup"
            className="bg-white text-[#1F3F7F] px-10 py-4 rounded-lg font-bold hover:bg-gray-200 transition-colors text-lg shadow-xl inline-block"
          >
            Get Started for Free
          </Link>
        </div>
      </section>
      <div className="h-16 bg-[#F3F4F6]"></div>

      <LandingFooter />
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-[#F3F4F6] p-8 rounded-2xl text-left hover:bg-[#E5E7EB] transition-colors group">
      <div className="bg-[#1F3F7F] text-white w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[#1E1E1E] mb-3">{title}</h3>
      <p className="text-gray-800 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-white shadow-sm border border-gray-100 p-1 rounded-full">
        <CheckCircle2 className="w-5 h-5 text-[#2D4496]" />
      </div>
      <span className="font-bold text-[#1E2B5A]">{text}</span>
    </div>
  );
}
