import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Volume2, Command, Keyboard, Type, CheckCircle2, Globe, MessageSquare } from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';
import LandingFooter from '@/components/LandingFooter';

export default function EchoLearnLanding() {
  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans">
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
              <button className="bg-white border px-8 py-4 rounded-lg font-bold">
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
              EchoLearn was born out of a simple idea: <br
              /> No student in Sri Lanka should be left behind due to physical or cognitive differences. We've partnered with local educators to ensure our content aligns with the national syllabus while remaining 100% accessible.
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
            <div className="bg-white p-6 rounded-2xl text-center">
              <p className="text-4xl font-black text-[#1F3F7F] mb-2">12k+</p>
              <p className="text-gray-700 font-semibold">Students Enrolled</p>
            </div>
            <div className="bg-white p-6 rounded-2xl text-center">
              <p className="text-4xl font-black text-[#1F3F7F] mb-2">85%</p>
              <p className="text-gray-700 font-semibold">Retention Rate</p>
            </div>
            <div className="bg-white p-6 rounded-2xl text-center">
              <p className="text-4xl font-black text-[#1F3F7F] mb-2">45+</p>
              <p className="text-gray-700 font-semibold">Partner Schools</p>
            </div>
            <div className="bg-white p-6 rounded-2xl text-center">
              <p className="text-4xl font-black text-[#1F3F7F] mb-2">250+</p>
              <p className="text-gray-700 font-semibold">Audio Modules</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="bg-[#1F3F7F] text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-black">Ready to start your journey?</h2>
          <p className="text-lg leading-relaxed">
            Join thousands of Sri Lankan students who are already <br></br> learning without boundaries. Sign up for free today.
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

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
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

function StatCard({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-5xl font-black text-[#2D4496]">{number}</p>
      <p className="text-gray-600 font-semibold text-lg">{label}</p>
    </div>
  );

}