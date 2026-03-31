import React from 'react';
import LandingNavbar from '@/components/LandingNavbar';
import LandingFooter from '@/components/LandingFooter';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans">
      <LandingNavbar />
      
      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h1 className="text-5xl font-black text-[#1E1E1E] mb-8">Our Features</h1>
        <p className="text-xl text-gray-700 max-w-3xl leading-relaxed mb-16">
          EchoLearn provides a comprehensive set of tools designed specifically for students 
          with visual impairments and dyslexia in Sri Lanka. Explore our core features below.
        </p>

        {/* Feature list from landing page could be reused or expanded here */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Mocked feature sections */}
          <div className="bg-[#F3F4F6] p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-[#1E1E1E] mb-4">Text-to-Speech (TTS)</h3>
            <p className="text-gray-800 leading-relaxed">
              Experience natural, high-quality Sinhala and Tamil voices that read lesson materials aloud. 
              Adjust reading speed and voice settings to match your learning pace.
            </p>
          </div>
          
          <div className="bg-[#F3F4F6] p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-[#1E1E1E] mb-4">Voice Navigation</h3>
            <p className="text-gray-800 leading-relaxed">
              Navigate the platform seamlessly using your voice. Move between courses, take quizzes, 
              and control playback without needing a keyboard or mouse.
            </p>
          </div>

          <div className="bg-[#F3F4F6] p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-[#1E1E1E] mb-4">Dyslexia Support</h3>
            <p className="text-gray-800 leading-relaxed">
              Toggle specific reading modes featuring OpenDyslexic fonts, customizable color contrasts, 
              and reading rulers to reduce visual stress and improve comprehension.
            </p>
          </div>

          <div className="bg-[#F3F4F6] p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-[#1E1E1E] mb-4">Keyboard Friendly</h3>
            <p className="text-gray-800 leading-relaxed">
              Full platform functionality is accessible via keyboard shortcuts. We provide high-visibility 
              focus states so you always know where you are on the page.
            </p>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
