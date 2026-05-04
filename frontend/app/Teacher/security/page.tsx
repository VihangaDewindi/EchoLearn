"use client";

import React, { useState } from 'react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';
import TeacherFooter from '@/components/Teacher/TeacherFooter';
import SettingsSidebar from '@/components/Teacher/SettingsSidebar';
import { 
    Shield, 
    Monitor, 
    Smartphone, 
    Tablet, 
    LogOut, 
    Clock, 
    ExternalLink,
    ChevronDown
} from 'lucide-react';

export default function SecuritySettingsPage() {
  const [twoFactor, setTwoFactor] = useState(false);

  const devices = [
    { name: "iMac 27\" - Chrome", location: "San Francisco, USA • 192.168.1.1", status: "Active Now", current: true, icon: Monitor },
    { name: "iPhone 15 Pro - App", location: "San Francisco, USA • 172.24.12.8", status: "", current: false, icon: Smartphone },
    { name: "iPad Pro - Safari", location: "Oakland, USA • 192.168.1.5", status: "", current: false, icon: Tablet },
  ];

  const activity = [
    { date: "Oct 24, 2023", time: "10:42 AM", status: "Success", location: "San Francisco, CA" },
    { date: "Oct 23, 2023", time: "09:15 PM", status: "Success", location: "San Francisco, CA" },
    { date: "Oct 21, 2023", time: "08:02 AM", status: "Failed Attempt", location: "San Francisco, CA" },
    { date: "Oct 20, 2023", time: "03:30 PM", status: "Success", location: "Oakland, CA" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col font-sans text-left">
      <TeacherNavbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-8 md:p-12 flex gap-10">
        <SettingsSidebar />

        {/* Content Section */}
        <section className="flex-1 space-y-8">
          <div className="bg-white rounded-[28px] border border-[#E5E9F0] p-12 shadow-sm">
            <h1 className="text-[32px] font-black text-[#1E273F] tracking-tight">Security Settings</h1>
            <p className="text-[#8793AC] font-semibold mt-1 mb-10">Manage your credentials, sessions, and multi-factor authentication.</p>

            {/* Change Password */}
            <div className="bg-white rounded-[24px] border border-[#E5E9F0] overflow-hidden mb-8 shadow-sm">
               <div className="bg-[#F8FAFD] px-8 py-4 border-b border-[#E5E9F0]">
                  <h3 className="text-[14px] font-black text-[#1E273F] uppercase tracking-wider">Change Password</h3>
               </div>
               <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                     <div className="space-y-3">
                        <label className="text-[13px] font-black text-[#1E273F] uppercase tracking-wider">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-white border border-[#E5E9F0] rounded-xl px-4 py-3 text-[14px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] transition-all" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[13px] font-black text-[#1E273F] uppercase tracking-wider">New Password</label>
                        <input type="password" placeholder="Enter new password" className="w-full bg-white border border-[#E5E9F0] rounded-xl px-4 py-3 text-[14px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] transition-all" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[13px] font-black text-[#1E273F] uppercase tracking-wider">Confirm New Password</label>
                        <input type="password" placeholder="Re-type new password" className="w-full bg-white border border-[#E5E9F0] rounded-xl px-4 py-3 text-[14px] font-bold text-[#1E273F] focus:outline-none focus:border-[#33478D] transition-all" />
                     </div>
                  </div>
                  <div className="flex items-center justify-between">
                     <button className="text-[13px] font-black text-[#33478D] hover:underline">Forgot your password?</button>
                     <button className="bg-[#33478D] text-white px-8 py-3 rounded-xl font-black text-[14px] hover:bg-[#2A3B7A] transition-all shadow-md">
                        Update Password
                     </button>
                  </div>
               </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-white rounded-[24px] border border-[#E5E9F0] p-8 flex items-center justify-between shadow-sm mb-8">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-[#FFFBEB] rounded-xl flex items-center justify-center text-[#D97706]">
                     <Shield size={22} className="rotate-12" />
                  </div>
                  <div>
                     <div className="flex items-center gap-3">
                        <h4 className="text-[16px] font-black text-[#1E273F]">Two-Factor Authentication</h4>
                        <span className="bg-[#FFFBEB] text-[#D97706] px-2.5 py-0.5 rounded text-[9px] font-black tracking-widest uppercase">Highly Recommended</span>
                     </div>
                     <p className="text-[13px] font-bold text-[#8793AC] mt-1">Add an extra layer of security to your account by requiring more than just a password to log in.</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <span className={`text-[11px] font-black uppercase tracking-widest ${!twoFactor ? 'text-[#33478D]' : 'text-[#8793AC]'}`}>Disabled</span>
                  <button 
                     onClick={() => setTwoFactor(!twoFactor)}
                     className={`w-14 h-7 rounded-full transition-all relative ${twoFactor ? 'bg-[#33478D]' : 'bg-[#E5E9F0]'}`}
                  >
                     <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${twoFactor ? 'left-8' : 'left-1'}`}></div>
                  </button>
                  <span className={`text-[11px] font-black uppercase tracking-widest ${twoFactor ? 'text-[#33478D]' : 'text-[#8793AC]'}`}>Enabled</span>
               </div>
            </div>

            {/* Active Devices & Recent Activity Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
               {/* Active Devices */}
               <div className="lg:col-span-3 bg-white rounded-[24px] border border-[#E5E9F0] overflow-hidden shadow-sm">
                  <div className="px-8 py-6 border-b border-[#E5E9F0] flex items-center justify-between">
                     <h3 className="text-[16px] font-black text-[#1E273F]">Active Devices</h3>
                     <button className="text-[12px] font-black text-[#8793AC] hover:text-[#FF4D4D] transition-colors">Logout of All Devices</button>
                  </div>
                  <div className="p-4 space-y-3">
                     {devices.map((device, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${device.current ? 'bg-blue-50/30 border-blue-100' : 'bg-white border-[#F0F2F5]'}`}>
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-[#F5F7FB] rounded-xl flex items-center justify-center text-[#8793AC]">
                                 <device.icon size={20} />
                              </div>
                              <div>
                                 <div className="flex items-center gap-2">
                                    <h4 className="text-[14px] font-black text-[#1E273F]">{device.name}</h4>
                                    {device.current && <span className="bg-[#1E2B5A] text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">Current</span>}
                                 </div>
                                 <p className="text-[11px] font-bold text-[#8793AC] mt-0.5">{device.location}</p>
                              </div>
                           </div>
                           {device.current ? (
                              <span className="text-[12px] font-black text-[#33478D]">Active Now</span>
                           ) : (
                             <button className="p-2 text-[#8793AC] hover:text-[#FF4D4D] transition-colors">
                                <LogOut size={18} />
                             </button>
                           )}
                        </div>
                     ))}
                  </div>
               </div>

               {/* Recent Login Activity */}
               <div className="lg:col-span-2 bg-white rounded-[24px] border border-[#E5E9F0] overflow-hidden shadow-sm">
                  <div className="px-8 py-6 border-b border-[#E5E9F0] flex items-center justify-between">
                     <h3 className="text-[16px] font-black text-[#1E273F]">Recent Login Activity</h3>
                     <button className="text-[12px] font-black text-[#33478D] hover:underline">View Full Logs</button>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-[#F8FAFD] border-b border-[#E5E9F0]">
                              <th className="px-6 py-4 text-[9px] font-black text-[#8793AC] uppercase tracking-widest">Date & Time</th>
                              <th className="px-6 py-4 text-[9px] font-black text-[#8793AC] uppercase tracking-widest text-center">Status</th>
                              <th className="px-6 py-4 text-[9px] font-black text-[#8793AC] uppercase tracking-widest text-right">Location</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F7FB]">
                           {activity.map((item, idx) => (
                              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                 <td className="px-6 py-4">
                                    <p className="text-[12px] font-black text-[#1E273F]">{item.date}</p>
                                    <p className="text-[10px] font-bold text-[#8793AC]">{item.time}</p>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex justify-center">
                                       <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                                          item.status.includes('Success') ? 'bg-[#E9F7EF] text-[#2E7D32]' : 'bg-[#FFF1F1] text-[#C81E1E]'
                                       }`}>
                                          <div className={`w-1 h-1 rounded-full ${item.status.includes('Success') ? 'bg-[#2E7D32]' : 'bg-[#C81E1E]'}`}></div>
                                          {item.status}
                                       </span>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-right text-[11px] font-bold text-[#5E6D8F]">{item.location}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            {/* Deactivate Account */}
            <div className="bg-[#FFF5F5] border border-[#FAD2D2] rounded-[24px] p-8 flex items-center justify-between shadow-sm">
               <div className="flex-1">
                  <h4 className="text-[16px] font-black text-[#C81E1E]">Deactivate Account</h4>
                  <p className="text-[13px] font-bold text-[#D98A8A] mt-1 leading-relaxed">
                     Permanently remove your data and access to all classes. This action is irreversible.
                  </p>
               </div>
               <button className="bg-[#E85A4F] text-white px-8 py-3 rounded-xl font-black text-[14px] hover:bg-[#D94F45] transition-all shadow-md">
                  Deactivate Account
               </button>
            </div>
          </div>
        </section>
      </main>

      <TeacherFooter />
    </div>
  );
}
