"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AtSign, Lock, Eye, EyeOff, HelpCircle, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';

type Step = "email" | "reset" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [mounted, setMounted] = useState(false);

  // Step 1 — email
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Step 2 — reset
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');

  useEffect(() => { setMounted(true); }, []);

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailError('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        // In a real app this would be in email; for demo we show the token directly
        if (data.token) setToken(data.token);
        setStep("reset");
      } else {
        setEmailError(data.error || 'Could not find an account with that email.');
      }
    } catch {
      setEmailError('Failed to connect to server. Please try again.');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters.');
      return;
    }
    setResetLoading(true);
    setResetError('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("done");
      } else {
        setResetError(data.error || 'Reset failed. The link may have expired.');
      }
    } catch {
      setResetError('Failed to connect to server. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-screen w-full bg-[#F3F4F6] flex flex-col font-sans text-[#1F2937] overflow-hidden">

      {/* Navbar */}
      <nav className="w-full h-16 px-6 md:px-12 flex justify-between items-center bg-white/50 border-b border-gray-200 backdrop-blur-sm shrink-0">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="EchoLearn Logo" width={120} height={50} className="object-contain" priority />
        </Link>
        <button className="flex items-center gap-2 text-xs text-gray-600 border border-gray-200 px-3 py-1 rounded-lg hover:bg-white transition font-medium">
          <HelpCircle size={16} /> Help
        </button>
      </nav>

      <main className="flex-grow flex items-center justify-center p-4">
        <div
          className="bg-white w-full max-w-[460px] rounded-2xl shadow-xl border border-gray-50 flex flex-col p-8 md:p-10"
          style={{ boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)' }}
        >

          {/* ── STEP 1: Enter email ── */}
          {step === "email" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[#EEF2FF] flex items-center justify-center mx-auto mb-4">
                  <AtSign size={28} className="text-[#2D3E75]" />
                </div>
                <h2 className="text-2xl font-extrabold text-[#111827]">Forgot your password?</h2>
                <p className="text-gray-500 text-sm mt-2">Enter your email address and we'll send you a reset link.</p>
              </div>

              <form className="space-y-5" onSubmit={handleSendReset}>
                {emailError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center font-medium">
                    {emailError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold mb-2 text-[#374151]">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center text-gray-400 pointer-events-none">
                      <AtSign size={18} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="e.g. alex@email.com"
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3E75]/20 focus:border-[#2D3E75] transition text-black placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={emailLoading}
                  className="w-full bg-[#2D3E75] text-white font-bold py-3.5 rounded-xl hover:bg-[#1e2a52] transition-colors shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
                >
                  {emailLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {emailLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="inline-flex items-center gap-1 text-sm font-bold text-[#2D3E75] hover:underline">
                  <ArrowLeft size={14} /> Back to Login
                </Link>
              </div>
            </>
          )}

          {/* ── STEP 2: Enter new password ── */}
          {step === "reset" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[#EEF2FF] flex items-center justify-center mx-auto mb-4">
                  <Lock size={28} className="text-[#2D3E75]" />
                </div>
                <h2 className="text-2xl font-extrabold text-[#111827]">Set a new password</h2>
                <p className="text-gray-500 text-sm mt-2">Choose a strong password for your account.</p>
              </div>

              {/* Demo: show token for testing */}
              {token && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700 font-mono break-all">
                  <span className="font-bold block mb-1">Reset token (demo):</span>
                  {token}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleResetPassword}>
                {resetError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center font-medium">
                    {resetError}
                  </div>
                )}

                {/* Token input (hidden when pre-filled) */}
                {!token && (
                  <div>
                    <label className="block text-sm font-bold mb-2 text-[#374151]">Reset Token</label>
                    <input
                      type="text"
                      value={token}
                      onChange={e => setToken(e.target.value)}
                      required
                      placeholder="Paste your reset token"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3E75]/20 focus:border-[#2D3E75] transition text-black"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold mb-2 text-[#374151]">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center text-gray-400 pointer-events-none">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3E75]/20 focus:border-[#2D3E75] transition text-black placeholder:text-gray-300"
                    />
                    <button type="button" onClick={() => setShowNew(v => !v)} className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600">
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-[#374151]">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center text-gray-400 pointer-events-none">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3E75]/20 focus:border-[#2D3E75] transition text-black placeholder:text-gray-300"
                    />
                    <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-[#2D3E75] text-white font-bold py-3.5 rounded-xl hover:bg-[#1e2a52] transition-colors shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
                >
                  {resetLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {resetLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 3: Done ── */}
          {step === "done" && (
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#111827] mb-2">Password Reset!</h2>
              <p className="text-gray-500 text-sm mb-8">
                Your password has been successfully updated. You can now log in with your new password.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-[#2D3E75] text-white font-bold py-3.5 rounded-xl hover:bg-[#1e2a52] transition-colors shadow-lg shadow-blue-900/10"
              >
                Go to Login
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
