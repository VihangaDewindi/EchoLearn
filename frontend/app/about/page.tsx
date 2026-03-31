import React from 'react';
import LandingNavbar from '@/components/LandingNavbar';
import LandingFooter from '@/components/LandingFooter';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans">
      <LandingNavbar />
      
      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h1 className="text-5xl font-black text-[#1E1E1E] mb-8">About EchoLearn</h1>
        
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              EchoLearn was born from a simple yet powerful mission: to make education in Sri Lanka 
              accessible to every student, regardless of physical or cognitive differences.
            </p>
            <p>
              We realized that students with visual impairments and dyslexia often lacked customized tools 
              to engage with the standard national curriculum. EchoLearn bridges this gap by providing 
              a platform that adapts to the learner, not the other way around.
            </p>
            <p className="font-semibold text-[#1F3F7F]">
              Our platform supports both Sinhala and Tamil languages, ensuring native language accessibility 
              for curriculum content.
            </p>
          </div>
          
          <div className="bg-[#F3F4F6] p-10 rounded-3xl">
            <h3 className="text-2xl font-bold text-[#1E1E1E] mb-6">Our Mission</h3>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="text-[#2D4496] font-bold text-xl">1.</span>
                <span className="text-gray-800">Eliminate barriers to learning for all students.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-[#2D4496] font-bold text-xl">2.</span>
                <span className="text-gray-800">Provide specialized learning tools at zero cost.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-[#2D4496] font-bold text-xl">3.</span>
                <span className="text-gray-800">Partner with local schools for syllabus alignment.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
