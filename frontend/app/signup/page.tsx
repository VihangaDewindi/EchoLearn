"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Contact, Users, AtSign, Lock, Eye, EyeOff, HelpCircle, Loader2 } from 'lucide-react';

const SignUpPage = () => {
  const router = useRouter();
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, ...formData })
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/login');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Failed to connect to server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-screen w-full bg-[#F3F4F6] flex flex-col font-sans text-[#1F2937] overflow-hidden">

      <nav className="w-full h-16 px-6 md:px-12 flex justify-between items-center bg-white/50 border-b border-gray-200 backdrop-blur-sm shrink-0">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="EchoLearn Logo" width={120} height={50} className="object-contain" priority />
        </Link>
        <button type="button" suppressHydrationWarning className="flex items-center gap-2 text-xs text-gray-600 border border-gray-200 px-3 py-1 rounded-lg hover:bg-white transition font-medium">
          <HelpCircle size={16} /> Help
        </button>
      </nav>

      <main className="flex-grow flex items-center justify-center p-4">
        <div
          className="bg-white w-full max-w-[460px] max-h-[90vh] rounded-2xl shadow-xl border border-gray-50 flex flex-col p-8 md:p-10"
          style={{ boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)' }}
        >
          <div className="text-center mb-6 shrink-0">
            <h2 className="text-3xl font-extrabold mb-2 text-[#111827]">Create your Account</h2>
            <p className="text-gray-500 text-sm">Join EchoLearn Today</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6 shrink-0">
            <p className="text-center font-bold text-sm mb-4 text-[#374151]">Select your role</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'student', label: 'Student', icon: User },
                { id: 'teacher', label: 'Teacher', icon: Contact },
                { id: 'parent',  label: 'Parent',  icon: Users },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setRole(item.id)}
                  className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl border-2 transition-all ${
                    role === item.id
                      ? 'border-[#2D3E75] bg-white ring-1 ring-[#2D3E75]'
                      : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
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

          {/* Form */}
          <form className="space-y-5 flex-grow overflow-y-auto no-scrollbar" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center font-medium">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold mb-2 text-[#374151]">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-400 pointer-events-none">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  suppressHydrationWarning
                  placeholder="e.g. Alex Smith"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3E75]/20 focus:border-[#2D3E75] transition text-black placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold mb-2 text-[#374151]">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-400 pointer-events-none">
                  <AtSign size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  suppressHydrationWarning
                  placeholder="e.g. alex@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3E75]/20 focus:border-[#2D3E75] transition text-black placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold mb-2 text-[#374151]">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-400 pointer-events-none">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  suppressHydrationWarning
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3E75]/20 focus:border-[#2D3E75] transition text-black placeholder:text-gray-300"
                />
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning
              className="w-full bg-[#2D3E75] text-white font-bold py-3.5 rounded-xl hover:bg-[#1e2a52] transition-colors shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500 shrink-0">
            Already have an account?{' '}
            <Link href="/login" className="text-[#2D3E75] font-bold hover:underline">Log In</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
