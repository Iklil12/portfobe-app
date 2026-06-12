// app/register/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from "@/app/actions/auth";
import { signIn } from 'next-auth/react';
import ReCAPTCHA from "react-google-recaptcha";
import { Eye, EyeOff, ArrowRight, AlertTriangle, User, Mail, ShieldAlert } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // State baru khusus untuk loading tombol Google
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    // Verifikasi CAPTCHA sebelum lanjut (Abaikan jika key belum di-set)
    if (!captchaToken && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      setErrorMsg("Harap selesaikan verifikasi reCAPTCHA terlebih dahulu.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    if (captchaToken) formData.append("captchaToken", captchaToken);

    const result = await registerUser(formData);

    if (result?.error) {
      setErrorMsg(result.error);
      setIsLoading(false);
    } else {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        router.push('/login');
      } else {
        router.push('/dashboard');
      }
    }
  };

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="bg-[#050505] text-white flex min-h-screen font-sans selection:bg-[#ff9e00] selection:text-black overflow-hidden relative">
      
      {/* INJEKSI CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { font-family: 'Space Grotesk', sans-serif; }
        input, button, pre, code, .font-mono, label, placeholder { font-family: 'Space Mono', monospace !important; }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 10s infinite ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}} />

      {/* SISI KIRI: DESAIN MINIMALIS & PRESTIGE */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-black items-center justify-center p-16 overflow-hidden border-r border-white/5">
        {/* Abstract Background Decor */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#ff9e00]/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <Link href="/">
            <img src="/portfo.be.png" alt="Logo" className="h-6 mb-24 invert brightness-0 opacity-90 hover:opacity-100 transition-opacity cursor-pointer" />
          </Link>
          
          <h2 className="text-4xl font-display font-bold text-white leading-tight tracking-tight mb-6">
            Pamerkan karya terbaikmu <br /> <span className="text-[#ff9e00] font-mono text-xl tracking-wider uppercase block mt-3">dalam 5 menit.</span>
          </h2>
          <p className="text-white/50 text-xs font-mono max-w-sm leading-relaxed">
            Bergabunglah dengan komunitas kreator visual paling eksklusif tanpa perlu menulis baris kode apapun.
          </p>
          
          {/* Testimonial Kecil agar Terlihat Pro */}
          <div className="mt-24 pt-12 border-t border-white/15 flex items-center gap-5">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 border border-[#050505] bg-zinc-900 flex items-center justify-center overflow-hidden rounded-none hover:scale-110 hover:z-10 transition-transform">
                  <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="user" className="w-full h-full object-cover rounded-none" />
                </div>
              ))}
            </div>
            <div>
               <p className="text-xs font-mono font-bold text-white tracking-wide">+1.2k Kreator</p>
               <p className="text-[10px] font-mono text-white/40">telah bergabung bulan ini</p>
            </div>
          </div>
        </div>
      </div>

      {/* SISI KANAN: FORM REFINED DENGAN GOOGLE BUTTON */}
      <div className="w-full lg:w-[55%] bg-[#050505] flex flex-col justify-center px-6 sm:px-16 md:px-24 xl:px-40 relative z-10">
        {/* Grid Background */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>

        {/* Logo for mobile only */}
        <Link href="/" className="absolute top-10 left-8 sm:left-16 lg:hidden group z-20">
          <img src="/portfo.be.png" alt="Logo" className="h-6 w-auto object-contain invert brightness-0 group-hover:scale-105 transition-transform" />
        </Link>

        <div className="w-full max-w-md mx-auto py-12 mt-12 lg:mt-0 relative z-10">
          <div className="mb-10 text-left">
             <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ff9e00]/20 bg-[#ff9e00]/5 text-[#ff9e00] text-[9px] font-mono uppercase tracking-[0.2em] mb-4">
               Register Account
             </div>
             <h1 className="text-3xl font-display font-bold text-white tracking-tight">Buat Akun Portfo.be</h1>
             <p className="text-white/40 text-xs font-mono mt-2">Gratis selamanya, tanpa perlu kartu kredit.</p>
          </div>

          {/* Elegant Error Alert */}
          {errorMsg && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-rose-500/5 border border-rose-500/15 text-rose-400 text-xs font-mono font-bold animate-in fade-in slide-in-from-top-2 duration-300">
               <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
               <p className="leading-relaxed">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="group">
              <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-white/45 mb-2 group-focus-within:text-[#ff9e00] transition-colors">Nama Lengkap</label>
              <input 
                name="fullName" 
                type="text" 
                placeholder="Iklil Uyun" 
                className="w-full px-4 py-4 rounded-none border border-white/15 bg-black focus:border-l-4 focus:border-l-[#ff9e00] focus:border-[#ff9e00] focus:ring-0 outline-none transition-all text-xs font-mono font-bold text-white placeholder:text-white/25" 
                required 
              />
            </div>

            <div className="group">
              <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-white/45 mb-2 group-focus-within:text-[#ff9e00] transition-colors">Alamat Email</label>
              <input 
                name="email" 
                type="email" 
                placeholder="halo@kreator.com" 
                className="w-full px-4 py-4 rounded-none border border-white/15 bg-black focus:border-l-4 focus:border-l-[#ff9e00] focus:border-[#ff9e00] focus:ring-0 outline-none transition-all text-xs font-mono font-bold text-white placeholder:text-white/25" 
                required 
              />
            </div>

            <div className="group">
              <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-white/45 mb-2 group-focus-within:text-[#ff9e00] transition-colors">Password</label>
              <div className="relative">
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Min. 8 karakter" 
                  className="w-full px-4 py-4 rounded-none border border-white/15 bg-black focus:border-l-4 focus:border-l-[#ff9e00] focus:border-[#ff9e00] focus:ring-0 outline-none transition-all text-xs font-mono font-bold text-white placeholder:text-white/25 tracking-widest" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#ff9e00] transition-colors w-8 h-8 flex items-center justify-center rounded-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Google ReCAPTCHA v2 Widget */}
            <div className="flex justify-center my-2">
              {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
                <ReCAPTCHA
                  theme="dark"
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  onChange={(token) => setCaptchaToken(token)}
                />
              ) : (
                <div className="text-[10px] text-red-400 font-mono font-bold p-3 bg-red-500/5 rounded-none border border-red-500/10 text-center w-full">
                  ⚠️ ReCAPTCHA Site Key belum diset di .env
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isLoading || isGoogleLoading || (!captchaToken && !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)}
              className={`w-full relative bg-[#ff9e00] text-black py-4.5 rounded-none text-[11px] font-mono font-bold uppercase tracking-widest transition-all duration-300 transform active:scale-[0.98] hover:shadow-[4px_4px_0px_rgba(255,255,255,0.15)] ${(isLoading || (!captchaToken && !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)) ? 'bg-zinc-800 text-white/40 opacity-70 cursor-not-allowed' : 'hover:bg-[#ffaa22]'}`}
            >
              <div className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                Buat Akun Sekarang <ArrowRight className="w-4 h-4" />
              </div>
              
              {/* Spinner Overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </form>

          {/* DIVIDER: ATAU LANJUTKAN DENGAN */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="px-4 text-[9px] font-mono font-bold text-white/20 uppercase tracking-widest">Atau daftar dengan</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* TOMBOL GOOGLE */}
          <button 
            type="button"
            onClick={handleGoogleRegister}
            disabled={isLoading || isGoogleLoading}
            className={`w-full relative bg-transparent border border-white/15 text-white py-4 rounded-none text-[11px] font-mono font-bold uppercase tracking-wider transition-all duration-300 transform active:scale-[0.98] hover:shadow-[4px_4px_0px_rgba(255,158,0,0.15)] ${isGoogleLoading ? 'bg-white/5' : 'hover:bg-white/5 hover:border-white/25'}`}
          >
            <div className={`flex items-center justify-center gap-3 transition-opacity duration-300 ${isGoogleLoading ? 'opacity-0' : 'opacity-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.649-3.342-11.123-8.027l-6.573 4.819C9.656 39.663 16.318 44 24 44z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
              </svg>
              Google Authentication
            </div>
            
            {/* Google Spinner */}
            {isGoogleLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </button>

          <p className="text-center text-xs text-white/40 mt-10 font-mono">
            Sudah memiliki akun? <Link href="/login" className="text-white font-bold hover:text-[#ff9e00] transition-colors ml-1 uppercase tracking-wider">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}