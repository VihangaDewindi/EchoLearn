"use client";

import { useState, useEffect } from "react";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import LandingFooter from "@/components/LandingFooter";
import { User, Settings, Accessibility, Shield, Plus, X } from "lucide-react";

export default function StudentProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex flex-col font-sans">
      <DashboardNavbar user={user} />

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-8 md:p-12 flex gap-10">
        
        {/* Sidebar */}
        <aside className="w-[280px] shrink-0">
          <div className="bg-white rounded-[24px] border border-[#E5E9F0] p-4 space-y-2">
            {[
              { label: "Account", icon: User, active: true },
              { label: "Preferences", icon: Settings, active: false },
              { label: "Accessibility", icon: Accessibility, active: false },
              { label: "Security", icon: Shield, active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[15px] font-black transition-all ${
                  item.active 
                    ? "bg-[#33478D] text-white shadow-lg shadow-blue-900/10" 
                    : "text-[#5E6D8F] hover:bg-[#F5F7FB]"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <section className="flex-1 bg-white rounded-[28px] border border-[#E5E9F0] p-12 shadow-sm">
          <h1 className="text-[32px] font-black text-[#1E273F] tracking-tight">Student Profile</h1>
          <p className="text-[#8793AC] font-semibold mt-1 mb-10">Manage your account information and learning preferences.</p>

          <div className="flex items-center gap-8 mb-12">
             <div className="w-28 h-28 rounded-full bg-[#33478D] flex items-center justify-center text-white text-[32px] font-black border-4 border-[#F5F7FB] shadow-md relative group cursor-pointer">
                {user?.fullName?.split(" ").map((n: any) => n[0]).join("").toUpperCase() || "U"}
             </div>
             <div>
                <h4 className="text-[16px] font-black text-[#1E273F]">Profile Picture</h4>
                <div className="flex items-center gap-6 mt-4">
                   <button className="text-[14px] font-black text-[#33478D] hover:underline">Change photo</button>
                   <button className="text-[14px] font-black text-[#FF4D4D] hover:underline">Remove</button>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10">
             <div className="space-y-3">
                <label className="text-[14px] font-black text-[#1E273F] uppercase tracking-wider">Full Name</label>
                <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-[#D5DCEB] rounded-[14px] px-6 py-4 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] transition-all"
                />
             </div>
             <div className="space-y-3">
                <label className="text-[14px] font-black text-[#1E273F] uppercase tracking-wider">Email Address</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-[#D5DCEB] rounded-[14px] px-6 py-4 text-[15px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] transition-all"
                />
             </div>
          </div>

          <div className="flex items-center justify-end gap-6 pt-6 border-t border-[#E5E9F0]">
             <button className="text-[15px] font-black text-[#8793AC] hover:text-[#1E273F] transition-all">Cancel</button>
             <button className="bg-[#33478D] text-white px-10 py-4 rounded-xl font-black text-[16px] shadow-lg shadow-blue-900/10 hover:bg-[#2A3B7A] hover:-translate-y-0.5 transition-all">
                Save Changes
             </button>
          </div>
        </section>

      </main>

      <LandingFooter />
    </div>
  );
}
