import React from 'react';
import LandingNavbar from '@/components/LandingNavbar';
import LandingFooter from '@/components/LandingFooter';

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans">
      <LandingNavbar />
      
      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h1 className="text-5xl font-black text-[#1E1E1E] mb-8">Accessibility Commitment</h1>
        
        <div className="max-w-3xl space-y-8 text-lg text-gray-700 leading-relaxed">
          <p>
            At EchoLearn, accessibility isn't an afterthought—it's the core of everything we build. 
            We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA 
            to ensure that our platform is perceivable, operable, understandable, and robust.
          </p>

          <div className="bg-[#F3F4F6] p-8 rounded-2xl border-l-4 border-[#2D4496]">
            <h3 className="text-2xl font-bold text-[#1E1E1E] mb-4">Navigating This Site</h3>
            <p className="mb-4">You can navigate this platform using:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-800">
              <li>Standard keyboard shortcuts (Tab, Enter, Space arrow keys)</li>
              <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
              <li>EchoLearn's built-in voice command module</li>
            </ul>
          </div>

          <h3 className="text-3xl font-bold text-[#1E1E1E] mt-12 mb-6">Built-in Assistance</h3>
          <p>
            We provide our own built-in screen reading and contrast toggles so that users on public 
            or shared computers without dedicated software can still access materials.
          </p>

          <p className="bg-[#1F3F7F] text-white p-6 rounded-xl mt-8">
            <strong>Feedback:</strong> We continually test our platform to find and fix accessibility 
            issues. If you encounter any barriers, please contact our support team.
          </p>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
