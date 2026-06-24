//app/reset-password/page.tsx
"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff, CheckCircle2, AlertCircle, Link2Off, ArrowLeft, Loader2 } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setStatus({ type: "error", message: "Token reset tidak ditemukan. Silakan minta link baru." });
      return;
    }
    if (newPassword.length < 6) {
      setStatus({ type: "error", message: "Password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "Konfirmasi sandi tidak cocok." });
      return;
    }

    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setStatus({ type: "success", message: "Password successfully updated! Redirecting to login page..." });
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setStatus({ type: "error", message: data.error || "Failed to reset password." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "A server error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !isSuccess && !status.message) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-none flex items-center justify-center mx-auto mb-6">
          <Link2Off className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-display font-bold text-white mb-2 uppercase tracking-wider">Tautan Tidak Valid</h2>
        <p className="text-white/40 mb-8 text-xs font-mono leading-relaxed">Link reset password tidak ditemukan atau formatnya salah.</p>
        <Link href="/login" className="inline-flex items-center gap-2 bg-[#ff9e00] text-black px-8 py-3.5 rounded-none text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#ffaa22] transition-all">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Login
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12 animate-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-none flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-display font-bold text-white mb-2 uppercase tracking-wider">Berhasil!</h2>
        <p className="text-white/50 mb-8 text-xs font-mono leading-relaxed">{status.message}</p>
        <div className="w-5 h-5 border-2 border-[#ff9e00]/20 border-t-[#ff9e00] rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ff9e00]/20 bg-[#ff9e00]/5 text-[#ff9e00] text-[9px] font-mono uppercase tracking-[0.2em] mb-4">
          Reset Password
        </div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Buat Sandi Baru</h1>
        <p className="text-white/45 text-xs font-mono mt-2 leading-relaxed">Pastikan kata sandi baru Anda kuat dan mudah diingat.</p>
      </div>

      {status.message && (
        <div className={`mb-6 p-4 rounded-none text-xs font-mono font-bold border flex items-start gap-3 ${status.type === 'error' ? 'bg-rose-500/5 text-rose-400 border-rose-500/15' : 'bg-emerald-500/5 text-emerald-400 border-emerald-500/15'}`}>
          {status.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
          <p className="leading-relaxed">{status.message}</p>
        </div>
      )}

      <form onSubmit={handleReset} className="space-y-6">
        <div className="group">
          <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-white/45 mb-2 group-focus-within:text-[#ff9e00] transition-colors">Sandi Baru</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters" 
              className="w-full px-4 py-4 rounded-none border border-white/15 bg-black focus:border-l-4 focus:border-l-[#ff9e00] focus:border-[#ff9e00] focus:ring-0 outline-none transition-all text-xs font-mono font-bold text-white placeholder:text-white/25 tracking-widest" 
              required 
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#ff9e00] transition-colors w-8 h-8 flex items-center justify-center rounded-none">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="group">
          <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-white/45 mb-2 group-focus-within:text-[#ff9e00] transition-colors">Konfirmasi Sandi Baru</label>
          <input 
            type={showPassword ? "text" : "password"} 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi sandi baru" 
            className="w-full px-4 py-4 rounded-none border border-white/15 bg-black focus:border-l-4 focus:border-l-[#ff9e00] focus:border-[#ff9e00] focus:ring-0 outline-none transition-all text-xs font-mono font-bold text-white placeholder:text-white/25 tracking-widest" 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full relative bg-[#ff9e00] text-black py-4.5 rounded-none text-[11px] font-mono font-bold uppercase tracking-widest transition-all duration-300 transform active:scale-[0.98] hover:shadow-[4px_4px_0px_rgba(255,255,255,0.15)] ${isLoading ? 'bg-zinc-800 text-white/55' : 'hover:bg-[#ffaa22]'}`}
        >
          <div className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            Simpan Sandi Baru <CheckCircle2 className="w-4 h-4" />
          </div>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            </div>
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-[#050505] text-white flex min-h-screen font-sans selection:bg-[#ff9e00] selection:text-black overflow-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { font-family: 'Space Grotesk', sans-serif; }
        input, button, pre, code, .font-mono, label, placeholder { font-family: 'Space Mono', monospace !important; }
      `}} />

      <div className="w-full lg:w-[55%] bg-[#050505] flex flex-col justify-center px-6 sm:px-16 md:px-24 xl:px-40 relative z-10 border-r border-white/5">
        {/* Grid Background */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>

        <Link href="/" className="absolute top-10 left-8 sm:left-16 md:left-24 xl:left-40 group z-20">
          <img src="/portfo.be.png" alt="Logo" className="h-6 w-auto object-contain invert brightness-0 group-hover:scale-105 transition-transform duration-300" />
        </Link>
        <div className="w-full max-w-md mx-auto py-12 mt-12 md:mt-0 relative z-10">
          <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#ff9e00] animate-spin" /></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[45%] relative bg-black items-center justify-center p-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#ff9e00]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 w-full max-w-md bg-zinc-950 border border-white/15 rounded-none p-10 shadow-none hover:border-white/25 hover:shadow-[8px_8px_0px_rgba(255,158,0,0.15)] transition-all duration-500 text-center">
           <div className="w-16 h-16 bg-white/5 border border-white/15 rounded-none flex items-center justify-center mx-auto mb-8 backdrop-blur-md">
              <ShieldCheck className="w-8 h-8 text-white" />
           </div>
           <h2 className="text-2xl font-display font-bold text-white leading-snug tracking-tight mb-4 uppercase">Keamanan Tingkat Tinggi</h2>
           <p className="text-white/40 text-xs font-mono leading-relaxed">Sistem proteksi Portfo.be mengamankan seluruh data kredensial Anda dengan standar enkripsi industri terkini.</p>
        </div>
      </div>
    </div>
  );
}