"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    User, 
    Settings, 
    Accessibility, 
    Shield, 
    Zap 
} from 'lucide-react';

export default function SettingsSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: "Profile", icon: User, href: "/Teacher/profile" },
    { label: "Class Settings", icon: Settings, href: "/Teacher/class-settings" },
    { label: "Accessibility", icon: Accessibility, href: "/Teacher/accessibility" },
    { label: "Security", icon: Shield, href: "/Teacher/security" },
  ];

  return (
    <aside className="w-[300px] shrink-0 flex flex-col gap-6">
      <div className="bg-white rounded-[24px] border border-[#E5E9F0] p-4 space-y-2 shadow-sm">
        {pathname && pathname.includes('security') && (
            <p className="text-[10px] font-black text-[#A0A9C0] uppercase tracking-[0.2em] px-6 pt-4 mb-2">Account Settings</p>
        )}
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[15px] font-black transition-all ${
                isActive 
                  ? "bg-[#33478D] text-white shadow-lg shadow-blue-900/10" 
                  : "text-[#5E6D8F] hover:bg-[#F5F7FB]"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 3 : 2.5} />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Conditional Banners Based on Page */}
      {pathname && pathname.includes('class-settings') && (
        <div className="bg-[#F8FAFD] border-2 border-dashed border-[#D5DCEB] rounded-[24px] p-6 text-left">
            <span className="text-[10px] font-black text-[#33478D] uppercase tracking-widest">PRO PLAN</span>
            <p className="text-[13px] font-bold text-[#5E6D8F] mt-2 mb-6">Upgrade for advanced student analytics.</p>
            <button className="w-full bg-[#33478D] text-white py-3 rounded-xl font-black text-[13px] hover:bg-[#2A3B7A] transition-all">
                Upgrade Now
            </button>
        </div>
      )}

      {pathname && pathname.includes('security') && (
        <div className="bg-[#33478D] rounded-[24px] p-6 text-white text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Shield size={60} />
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/20">
                <Shield size={20} />
            </div>
            <h4 className="text-[16px] font-black">Enhanced Protection</h4>
            <p className="text-[12px] font-medium text-white/70 mt-2">Your account is currently protected with advanced encryption protocols.</p>
        </div>
      )}
    </aside>
  );
}
