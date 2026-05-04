"use client";

import React, { useState } from 'react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';
import TeacherFooter from '@/components/Teacher/TeacherFooter';
import SettingsSidebar from '@/components/Teacher/SettingsSidebar';
import { 
    Info, 
    Type, 
    Contrast, 
    Volume2, 
    Mic 
} from 'lucide-react';

export default function AccessibilitySettingsPage() {
  const [dyslexiaFont, setDyslexiaFont] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(true);
  const [voiceSensitivity, setVoiceSensitivity] = useState(50);

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col font-sans text-left">
      <TeacherNavbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-8 md:p-12 flex gap-10">
        <SettingsSidebar />

        {/* Content Section */}
        <section className="flex-1 space-y-8">
          <div className="bg-white rounded-[28px] border border-[#E5E9F0] p-12 shadow-sm">
            <h1 className="text-[32px] font-black text-[#1E273F] tracking-tight">Accessibility Settings</h1>
            <p className="text-[#8793AC] font-semibold mt-1 mb-10">Configure your workspace to better suit your interaction needs.</p>

            {/* Visual Preferences */}
            <div className="bg-white rounded-[24px] border border-[#E5E9F0] overflow-hidden mb-8">
               <div className="bg-[#F8FAFD] px-8 py-4 border-b border-[#E5E9F0]">
                  <h3 className="text-[14px] font-black text-[#1E273F] uppercase tracking-wider">Visual Preferences</h3>
               </div>
               <div className="p-8 space-y-8">
                  <div className="flex items-start justify-between gap-10">
                     <div className="flex-1">
                        <div className="flex items-center gap-2">
                           <h4 className="text-[16px] font-black text-[#1E273F]">Dyslexia-friendly Font</h4>
                           <Info size={16} className="text-[#A0A9C0] cursor-help" />
                        </div>
                        <p className="text-[13px] font-bold text-[#8793AC] mt-1 leading-relaxed">
                           Switches the interface to a font specifically designed to improve readability for users with dyslexia.
                        </p>
                     </div>
                     <button 
                        onClick={() => setDyslexiaFont(!dyslexiaFont)}
                        className={`w-14 h-7 rounded-full transition-all relative shrink-0 ${dyslexiaFont ? 'bg-[#33478D]' : 'bg-[#D5DCEB]'}`}
                     >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${dyslexiaFont ? 'left-8' : 'left-1'}`}></div>
                     </button>
                  </div>
                  <div className="w-full h-px bg-[#F5F7FB]"></div>
                  <div className="flex items-start justify-between gap-10">
                     <div className="flex-1">
                        <h4 className="text-[16px] font-black text-[#1E273F]">High Contrast Mode</h4>
                        <p className="text-[13px] font-bold text-[#8793AC] mt-1 leading-relaxed">
                           Increases contrast ratios for all UI elements to improve visibility for users with visual impairments.
                        </p>
                     </div>
                     <button 
                        onClick={() => setHighContrast(!highContrast)}
                        className={`w-14 h-7 rounded-full transition-all relative shrink-0 ${highContrast ? 'bg-[#33478D]' : 'bg-[#D5DCEB]'}`}
                     >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${highContrast ? 'left-8' : 'left-1'}`}></div>
                     </button>
                  </div>
               </div>
            </div>

            {/* Assistive Technology */}
            <div className="bg-white rounded-[24px] border border-[#E5E9F0] overflow-hidden mb-8">
               <div className="bg-[#F8FAFD] px-8 py-4 border-b border-[#E5E9F0]">
                  <h3 className="text-[14px] font-black text-[#1E273F] uppercase tracking-wider">Assistive Technology</h3>
               </div>
               <div className="p-8">
                  <div className="flex items-start justify-between gap-10">
                     <div className="flex-1">
                        <h4 className="text-[16px] font-black text-[#1E273F]">Screen Reader Support</h4>
                        <p className="text-[13px] font-bold text-[#8793AC] mt-1 leading-relaxed">
                           Optimizes the application structure for screen reading software like JAWS, NVDA, or VoiceOver.
                        </p>
                     </div>
                     <button 
                        onClick={() => setScreenReader(!screenReader)}
                        className={`w-14 h-7 rounded-full transition-all relative shrink-0 ${screenReader ? 'bg-[#33478D]' : 'bg-[#D5DCEB]'}`}
                     >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${screenReader ? 'left-8' : 'left-1'}`}></div>
                     </button>
                  </div>
               </div>
            </div>

            {/* Interaction Controls */}
            <div className="bg-white rounded-[24px] border border-[#E5E9F0] overflow-hidden">
               <div className="bg-[#F8FAFD] px-8 py-4 border-b border-[#E5E9F0]">
                  <h3 className="text-[14px] font-black text-[#1E273F] uppercase tracking-wider">Interaction Controls</h3>
               </div>
               <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                     <h4 className="text-[16px] font-black text-[#1E273F]">Voice Command Sensitivity</h4>
                     <span className="text-[14px] font-black text-[#33478D]">Medium</span>
                  </div>
                  <p className="text-[13px] font-bold text-[#8793AC] mb-8">Adjust how responsive the system is to voice-activated classroom commands.</p>
                  
                  {/* Custom Slider */}
                  <div className="px-2">
                     <input 
                        type="range"
                        min="0"
                        max="100"
                        value={voiceSensitivity}
                        onChange={(e) => setVoiceSensitivity(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-[#E5E9F0] rounded-lg appearance-none cursor-pointer accent-[#33478D]"
                     />
                     <div className="flex justify-between mt-4">
                        <span className="text-[10px] font-black text-[#8793AC] uppercase tracking-widest">Low</span>
                        <span className="text-[10px] font-black text-[#8793AC] uppercase tracking-widest">Medium</span>
                        <span className="text-[10px] font-black text-[#8793AC] uppercase tracking-widest">High</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Page Actions */}
          <div className="flex items-center justify-end gap-6 pb-12">
             <button className="bg-[#F8FAFD] border border-[#E5E9F0] px-8 py-3 rounded-xl font-black text-[14px] text-[#5E6D8F] hover:bg-gray-100 transition-all">
                Reset to Default
             </button>
             <button className="bg-[#33478D] text-white px-10 py-4 rounded-xl font-black text-[16px] shadow-lg shadow-blue-900/10 hover:bg-[#2A3B7A] hover:-translate-y-0.5 transition-all">
                Save Changes
             </button>
          </div>
        </section>
      </main>

      <TeacherFooter />
    </div>
  );
}
