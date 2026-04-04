"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { User, Contact, Users, AtSign, Lock, Eye, HelpCircle } from 'lucide-react';

const LoginPage = () => {
  const [role, setRole] = useState('student');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    // overflow-hidden prevents the body from ever scrolling
    <div className="h-screen w-full bg-[#F3F4F6] flex flex-col font-sans text-[#1F2937] overflow-hidden">
      
      {/* Navbar - Shrink-0 keeps it from collapsing */}
      <nav className="w-full h-12 px-6 md:px-12 flex justify-between items-center bg-white/50 border-b border-gray-200 backdrop-blur-sm shrink-0">
        <div className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="EchoLearn Logo" 
            width={120} 
            height={50} 
            className="object-contain"
            priority 
          />
        </div>
        
        
        <button 
          type="button"
          suppressHydrationWarning
          className="flex items-center gap-2 text-xs text-gray-600 border border-gray-200 px-3 py-1 rounded-lg hover:bg-white transition font-medium"
        >
          <HelpCircle size={16} />
          Help 
        </button>
      </nav>

      {/* Main Container - Uses flex-grow to occupy remaining space */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div 
          className="bg-white w-full max-w-[460px] max-h-[85vh] rounded-2xl shadow-xl border border-gray-50 flex flex-col p-8 md:p-10"
          style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)' }}
        >
          {/* Header Section */}
          <div className="text-center mb-6 shrink-0">
            <h2 className="text-3xl font-extrabold mb-2 text-[#111827]">Welcome back</h2>
            <p className="text-gray-500 text-sm">Please enter your details to sign in</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6 shrink-0">
            <p className="text-center font-bold text-sm mb-4 text-[#374151]">Select your role</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'student', label: 'Student', icon: User },
                { id: 'teacher', label: 'Teacher', icon: Contact },
                { id: 'parent', label: 'Parent', icon: Users },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setRole(item.id)}
                  className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl border-2 transition-all ${
                    role === item.id
                      ? 'border-[#2D3E75] bg-white ring-1 ring-[#2D3E75]'
                      : 'border-gray-100 bg-white text-gray-400 hover:border-gray-100'
                  }`}
                >
                  <item.icon size={24} className={role === item.id ? 'text-[#2D3E75]' : 'text-gray-400'} />
                  <span className={`text-[11px] uppercase tracking-wider font-bold mt-2 ${role === item.id ? 'text-[#111827]' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <form className="space-y-5 flex-grow overflow-y-auto no-scrollbar" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-bold mb-2 text-[#374151]">Email or Username</label>
              <div className="relative">
                <input
                  type="text"
                  suppressHydrationWarning
                  placeholder="e.g. alex_smith"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3E75]/20 focus:border-[#2D3E75] transition text-black placeholder:text-gray-300"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-[#374151]">Password</label>
                <button 
                  type="button" 
                  suppressHydrationWarning
                  className="text-xs font-bold text-[#2D3E75] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  suppressHydrationWarning
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3E75]/20 focus:border-[#2D3E75] transition text-black placeholder:text-gray-300"
                />
                <button 
                  type="button" 
                  suppressHydrationWarning
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              suppressHydrationWarning
              className="w-full bg-[#2D3E75] text-white font-bold py-3.5 rounded-xl hover:bg-[#1e2a52] transition-colors shadow-lg shadow-blue-900/10"
            >
              Log In
            </button>
          </form>

          {/* Footer Section */}
          <p className="text-center mt-6 text-sm text-gray-500 shrink-0">
            Don't have an account?{' '}
            <button 
              type="button" 
              suppressHydrationWarning
              className="text-[#2D3E75] font-bold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;