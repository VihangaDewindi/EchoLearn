"use client";

import Image from "next/image";
import Link from "next/link";
import { Compass } from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";
import LandingFooter from "@/components/LandingFooter";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans">
      <LandingNavbar />

      {/* --- Hero Section --- */}
      <header className="bg-[#F3F4F6] pt-23 pb-16">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div className="space-y-6 pr-8">
            <h1 className="text-6xl font-black text-[#1E1E1E] leading-[1.1]">
              Democratizing <br />Education for <br />
              <span className="text-[#1F3F7F]">Every Learner. </span>
            </h1>

            <p className="text-gray-900 text-lg max-w-md leading-relaxed">
              EchoLearn is building the digital infrastructure to bridge
              the educational divide across our island.
            </p>
          </div>

          {/* Right */}
          <div className="relative max-w-lg ml-auto">
            <Image
              src="/student.jpg"
              alt="Student"
              width={500}
              height={500}
              className="rounded-2xl w-full object-cover"
            />

            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#FDEBD0] rounded-full blur-3xl opacity-50" />
          </div>

        </div>
      </header>

      {/* ================= STORY ================= */}
      <section className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-12 items-center">

        {/* IMAGE */}
        <div>
          <img
            src="/class.jpg"
            alt="student"
            className="rounded-xl shadow-md"
          />
        </div>

        {/* TEXT */}
        <div className="space-y-6">
          <h2 className="text-4xl font-black text-[#1E1E1E] leading-tight">
            The Spark Behind <br /> <span className="text-[#1F3F7F]">EchoLearn</span>
          </h2>

          <p className="text-gray-700 leading-relaxed text-lg">
            EchoLearn was built on a simple idea to access to quality
            education should not depend on where you live.
            <br />
            Across Sri Lanka, many students face limitations in resources,
            guidance, and opportunities, even though their potential is limitless.
            We saw how technology could bridge this gap and
            create a more equal learning environment for everyone.


          </p>

          <p className="text-[#1F3F7F] mt-5 text-sm font-bold">
            — A journey of a thousand students.
          </p>
        </div>
      </section>

      {/* ================= IMPACT ================= */}
      <section className="bg-[#F3F4F6] py-15 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h2 className="text-4xl font-black text-[#1E1E1E]">Our Impact</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tangible growth across the nation through accessible digital transformation.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-10">
            <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center text-center w-64">
              <p className="text-4xl font-black text-[#1F3F7F] mb-2">12k+</p>
              <p className="text-gray-700 font-semibold">Active Students</p>
            </div>
            <div className="bg-[#2B3674] text-white p-7 rounded-xl shadow-md text-center scale-105 w-64">
              <p className="text-4xl font-white text-white mb-2">85%</p>
              <p className="text-white font-semibold">Retention Rate</p>

              <p className="text-[11px] mt-4 opacity-70 leading-relaxed">
                “Our retention speaks to the engagement and quality of our
                active-learning content.”
              </p>
            </div>
            {/* RIGHT */}
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="bg-white p-6 rounded-2xl text-center w-64">
                <p className="text-4xl font-black text-[#1F3F7F] mb-2">450+</p>
                <p className="text-gray-700 font-semibold">Partner Schools</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= REACH ================= */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-start">

          {/* LEFT TEXT */}
          <div className="space-y-4">

            <h2 className="text-4xl font-black text-[#1E1E1E]">
              Island-wide Reach
            </h2>

            <p className="text-gray-700 leading-relaxed max-w-md">
              From Colombo to Jaffna, our platform is optimized for low-bandwidth
              areas, ensuring no student is left behind.
            </p>
            <p className="text-gray-700 leading-relaxed max-w-md">
              By combining smart technology with accessible design, we make learning
              seamless and reliable for students across both urban and rural communities.
            </p>
          </div>

          {/* RIGHT MAP */}
          <div className="flex justify-end items-start">
            <img
              src="/map.png"
              alt="Sri Lanka map"
              className="w-98 scale-120 object-contain"
            />
          </div>

        </div>
      </section>


      {/* ================= MISSION ================= */}
      <section className="bg-[#F3F4F6] py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-start">

          {/* LEFT TEXT */}
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-[#1E1E1E]">
              Our Mission
            </h2>

            <p className="text-gray-700 text-lg max-w-lg leading-relaxed">
              To build a future where every Sri Lankan student, regardless of their socioeconomic background, <br/>
              has access to world-class education through local-first digital innovation.
            </p>

            {/* FEATURES */}
            <div className="flex flex-wrap gap-3 pt-4">
              <span className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-semibold text-[#1F3F7F]">
                Localized Content
              </span>
              <span className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-semibold text-[#1F3F7F]">
                Offline Accessibility
              </span>
              <span className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-semibold text-[#1F3F7F]">
                Affordable Pricing
              </span>
            </div>
          </div>

          {/* RIGHT ICON (MATCHING STYLE WITH MAP) */}
          <div className="flex justify-end items-start relative">
            <div className="w-40 h-40 bg-white rounded-full shadow-md flex items-center justify-center">
              <Compass size={60} className="text-[#1F3F7F]" />
            </div>
          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-[#1F3F7F] text-white py-24 px-6">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <h2 className="text-4xl font-black">Ready to make a difference?
                <p className="text-lg leading-relaxed">Join us in our mission to reshape the educational landscape of Sri Lanka.</p>
        </h2>

        <Link href="/signup"
          className="bg-white text-[#1F3F7F] px-10 py-4 rounded-lg font-bold hover:bg-gray-200 transition-colors text-lg shadow-xl inline-block">Get Started for Free
        </Link>
        </div>
      </section>
    <div className="h-16 bg-[#F3F4F6]"></div>
       
<LandingFooter />
    </div >
  );
}
