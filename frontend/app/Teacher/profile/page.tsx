"use client";

import React, { useState, useEffect } from 'react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';
import TeacherFooter from '@/components/Teacher/TeacherFooter';
import SettingsSidebar from '@/components/Teacher/SettingsSidebar';
import { X, Plus, Image as ImageIcon } from 'lucide-react';

export default function TeacherProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("I have been teaching Mathematics for over 12 years, with a focus on making complex concepts accessible through interactive learning experiences. I believe every student has the capacity to excel with the right guidance.");
  const [credentials, setCredentials] = useState([
    "Ph.D. in Mathematics Education",
    "Certified Online Educator (COE)",
    "Advanced Curriculum Design"
  ]);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "Dr. Sarah Mitchell");
      setEmail(user.email || "s.mitchell@echolearn.edu");
    }
  }, [user]);

  const removeCredential = (index: number) => {
    setCredentials(credentials.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col font-sans text-left">
      <TeacherNavbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-8 md:p-12 flex gap-10">
        <SettingsSidebar />

        {/* Content Section */}
        <section className="flex-1 bg-white rounded-[28px] border border-[#E5E9F0] p-12 shadow-sm">
          <h1 className="text-[32px] font-black text-[#1E273F] tracking-tight">Profile Settings</h1>
          <p className="text-[#8793AC] font-semibold mt-1 mb-10">Update your personal information and professional background.</p>

          {/* Profile Picture */}
          <div className="flex items-center gap-8 mb-12">
             <div className="w-28 h-28 rounded-full bg-[#E58814] flex items-center justify-center text-white text-[32px] font-black border-4 border-[#F5F7FB] shadow-md relative group cursor-pointer overflow-hidden">
                {/* Mockup Profile Image (placeholder) */}
                <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" 
                    alt="Profile"
                    className="w-full h-full object-cover"
                />
             </div>
             <div>
                <h4 className="text-[16px] font-black text-[#1E273F]">Profile Picture</h4>
                <p className="text-[12px] font-bold text-[#A0A9C0] mt-1">JPG, GIF or PNG. Max size 2MB.</p>
                <div className="flex items-center gap-6 mt-4">
                   <button className="text-[14px] font-black text-[#33478D] hover:underline">Change photo</button>
                   <button className="text-[14px] font-black text-[#FF4D4D] hover:underline">Remove</button>
                </div>
             </div>
          </div>

          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
             <div className="space-y-3">
                <label className="text-[13px] font-black text-[#1E273F] uppercase tracking-wider">Full Name</label>
                <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-[#D5DCEB] rounded-[14px] px-6 py-4 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] transition-all"
                />
             </div>
             <div className="space-y-3">
                <label className="text-[13px] font-black text-[#1E273F] uppercase tracking-wider">Email Address</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-[#D5DCEB] rounded-[14px] px-6 py-4 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] transition-all"
                />
             </div>
          </div>

          {/* Biography */}
          <div className="space-y-3 mb-10">
             <label className="text-[13px] font-black text-[#1E273F] uppercase tracking-wider">Biography</label>
             <textarea 
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#F5F7FB] border border-[#D5DCEB] rounded-[18px] px-6 py-4 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] transition-all leading-relaxed"
             />
          </div>

          {/* Professional Credentials */}
          <div className="space-y-4 mb-10">
             <div className="flex items-center justify-between">
                <label className="text-[13px] font-black text-[#1E273F] uppercase tracking-wider">Professional Credentials</label>
                <button className="flex items-center gap-2 text-[#33478D] text-[13px] font-black hover:underline transition-all">
                   <Plus size={16} strokeWidth={3} /> Add Credential
                </button>
             </div>
             <div className="flex flex-wrap gap-3">
                {credentials.map((cred, i) => (
                   <div key={i} className="flex items-center gap-3 bg-[#F0F2FA] border border-[#D5DCEB] rounded-[50px] px-5 py-2 group hover:border-[#33478D] transition-all">
                      <span className="text-[13px] font-black text-[#33478D]">{cred}</span>
                      <button onClick={() => removeCredential(i)} className="text-[#8793AC] hover:text-[#FF4D4D] transition-colors">
                         <X size={14} strokeWidth={3} />
                      </button>
                   </div>
                ))}
                <div className="min-w-[200px] flex-1">
                   <input 
                      type="text" 
                      placeholder="e.g. M.Ed in Special Education"
                      className="w-full bg-[#F5F7FB] border border-[#D5DCEB] rounded-[50px] px-5 py-2 text-[14px] font-medium text-[#1E273F] focus:outline-none focus:border-[#33478D] transition-all"
                   />
                </div>
             </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-6 pt-6 border-t border-[#E5E9F0]">
             <button className="text-[15px] font-black text-[#8793AC] hover:text-[#1E273F] transition-all">Cancel</button>
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
