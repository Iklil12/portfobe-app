//app/login/LoginClient.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { verifyRegistrationOtp, resendVerificationEmail } from '@/app/actions/auth';
import { X, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // --- STATE KHUSUS UNVERIFIED EMAIL (OTP) ---
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [passwordToLogin, setPasswordToLogin] = useState("");

  React.useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // --- STATE KHUSUS LUPA PASSWORD ---
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotStatus, setForgotStatus] = useState({ type: "", message: "" });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      if (res.error === "EMAIL_NOT_VERIFIED") {
        setUnverifiedEmail(email);
        setPasswordToLogin(password);
        setResendCooldown(120);
        // Otomatis kirim ulang OTP yang baru (karena yang lama pasti sudah basi jika mereka login berjam-jam kemudian)
        await resendVerificationEmail(email);
        setIsLoading(false);
        return;
      }
      setErrorMsg(res.error === "CredentialsSignin" ? "The email or password you entered is incorrect." : res.error);
      setIsLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const result = await verifyRegistrationOtp(unverifiedEmail!, otp);
    if (result?.error) {
      setErrorMsg(result.error);
      setIsLoading(false);
    } else {
      const loginRes = await signIn("credentials", {
        email: unverifiedEmail,
        password: passwordToLogin,
        redirect: false,
      });

      if (loginRes?.error) {
        setUnverifiedEmail(null);
        setErrorMsg("Something went wrong during login.");
        setIsLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !unverifiedEmail) return;
    
    setIsLoading(true);
    setErrorMsg("");
    const result = await resendVerificationEmail(unverifiedEmail);
    
    setIsLoading(false);
    if (result?.error) {
      setErrorMsg(result.error);
    } else {
      setResendCooldown(120);
      setErrorMsg("Kode verifikasi baru telah dikirim!");
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsForgotLoading(true);
    setForgotStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      
      if (res.ok) {
        setForgotStatus({ type: "success", message: "If your email is registered, we have sent reset instructions to your inbox." });
        setForgotEmail(""); // Kosongkan input
      } else {
        setForgotStatus({ type: "error", message: "Network error occurred. Please try again later." });
      }
    } catch (error) {
      setForgotStatus({ type: "error", message: "A server error occurred." });
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="bg-[#050505] text-white flex min-h-screen font-sans selection:bg-[#ff9e00] selection:text-black relative overflow-hidden">
      
      {/* INJEKSI CSS UNTUK ANIMASI & FONT */}
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

      {/* --- MODAL LUPA PASSWORD --- */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
            onClick={() => !isForgotLoading && setShowForgotModal(false)}
          ></div>
          
          <div className="relative bg-zinc-950 border border-white/10 rounded-none p-8 md:p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 fade-in duration-200 z-10">
            <button 
              onClick={() => setShowForgotModal(false)} 
              disabled={isForgotLoading}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-display font-bold text-white mb-2 uppercase tracking-wider">Forgot Password?</h3>
            <p className="text-xs font-mono text-white/50 mb-8 leading-relaxed">
              Enter your registered email address. We will send you a link to reset your password.
            </p>
            
            {forgotStatus.message && (
              <div className={`mb-6 p-4 rounded-none text-xs font-mono font-bold border flex items-start gap-3 ${forgotStatus.type === 'success' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' : 'bg-rose-500/5 text-rose-400 border-rose-500/10'}`}>
                {forgotStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                <p className="leading-relaxed">{forgotStatus.message}</p>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="flex flex-col gap-5">
              <div>
                <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input 
                    type="email" 
                    required 
                    value={forgotEmail} 
                    onChange={(e) => setForgotEmail(e.target.value)} 
                    className="w-full pl-11 pr-4 py-3.5 bg-black border border-white/10 rounded-none text-xs font-mono font-bold text-white outline-none focus:border-[#ff9e00] focus:ring-1 focus:ring-[#ff9e00]/20 transition-all" 
                    placeholder="email@anda.com" 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isForgotLoading || !forgotEmail} 
                className={`mt-2 py-4 rounded-none font-mono font-bold uppercase tracking-widest text-[11px] text-black bg-[#ff9e00] hover:bg-[#ffaa22] transition-all flex items-center justify-center gap-2 ${isForgotLoading || !forgotEmail ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
              >
                {isForgotLoading ? <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> : 'Send Reset Link'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SISI KIRI: LOGIN FORM AREA */}
      <div className="w-full lg:w-[55%] bg-[#050505] flex flex-col justify-center px-6 sm:px-16 md:px-24 xl:px-40 relative z-10 border-r border-white/5">
        {/* Grid Background */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>

        <Link href="/" className="absolute top-10 left-8 sm:left-16 md:left-24 xl:left-40 group z-20">
          <img src="/portfo.be.png" alt="Logo" className="h-6 w-auto object-contain invert brightness-0 group-hover:scale-105 transition-transform duration-300" />
        </Link>

        <div className="w-full max-w-md mx-auto py-12 mt-12 md:mt-0 relative z-10">
          <div className="mb-10">
             <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ff9e00]/20 bg-[#ff9e00]/5 text-[#ff9e00] text-[9px] font-mono uppercase tracking-[0.2em] mb-4">
               Sign In
             </div>
             <h1 className="text-3xl font-display font-bold text-white tracking-tight">Welcome Back</h1>
             <p className="text-white/40 text-xs font-mono mt-2 leading-relaxed">Sign in to manage your professional portfolio.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-rose-500/5 border border-rose-500/15 text-rose-400 text-xs font-mono font-bold animate-in fade-in slide-in-from-top-2 duration-300">
               <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
               <p className="leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {unverifiedEmail ? (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6">
                <p className="text-white/60 text-xs font-mono leading-relaxed">
                  Email Anda belum diverifikasi. Kami baru saja mengirimkan ulang kode verifikasi ke <br/>
                  <span className="text-[#ff9e00] font-bold">{unverifiedEmail}</span>.
                </p>
              </div>
              <div className="group">
                <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-white/45 mb-2 group-focus-within:text-[#ff9e00] transition-colors">6-Digit Code</label>
                <input 
                  name="otp" 
                  type="text" 
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000000" 
                  className="w-full px-4 py-4 rounded-none border border-white/15 bg-black focus:border-l-4 focus:border-l-[#ff9e00] focus:border-[#ff9e00] focus:ring-0 outline-none transition-all text-2xl tracking-[0.5em] text-center font-mono font-bold text-white placeholder:text-white/10" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading || otp.length !== 6}
                className={`w-full relative bg-[#ff9e00] text-black py-4.5 rounded-none text-[11px] font-mono font-bold uppercase tracking-widest transition-all duration-300 transform active:scale-[0.98] hover:shadow-[4px_4px_0px_rgba(255,255,255,0.15)] ${(isLoading || otp.length !== 6) ? 'bg-zinc-800 text-white/40 opacity-70 cursor-not-allowed' : 'hover:bg-[#ffaa22]'}`}
              >
                <div className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                  Verify & Sign In <ArrowRight className="w-4 h-4" />
                </div>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  </div>
                )}
              </button>
              
              <div className="flex flex-col items-center gap-3">
                <button 
                  type="button" 
                  disabled={resendCooldown > 0 || isLoading}
                  onClick={handleResendOtp}
                  className={`text-xs font-mono transition-colors ${resendCooldown > 0 ? 'text-white/20 cursor-not-allowed' : 'text-white/60 hover:text-white'}`}
                >
                  {resendCooldown > 0 ? `Kirim ulang dalam ${resendCooldown}s` : "Tidak menerima email? Kirim ulang kode"}
                </button>

                <button 
                  type="button" 
                  onClick={() => { setUnverifiedEmail(null); setOtp(""); setErrorMsg(""); setResendCooldown(0); }}
                  className="text-xs text-[#ff9e00]/60 mt-2 font-mono hover:text-[#ff9e00] transition-colors"
                >
                  &larr; Kembali ke Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6" suppressHydrationWarning>
            <div className="group">
              <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-white/45 mb-2 group-focus-within:text-[#ff9e00] transition-colors">Email Address</label>
              <input 
                name="email" 
                type="email" 
                placeholder="nama@kreator.com" 
                className="w-full px-4 py-4 rounded-none border border-white/15 bg-black focus:border-l-4 focus:border-l-[#ff9e00] focus:border-[#ff9e00] focus:ring-0 outline-none transition-all text-xs font-mono font-bold text-white placeholder:text-white/25" 
                required 
                suppressHydrationWarning
              />
            </div>

            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-white/45 group-focus-within:text-[#ff9e00] transition-colors">Password</label>
                
                {/* --- TOMBOL TRIGGER MODAL LUPA PASSWORD --- */}
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForgotModal(true);
                    setForgotStatus({ type: "", message: "" });
                  }}
                  className="text-[9px] font-mono font-bold text-white/40 hover:text-[#ff9e00] uppercase tracking-widest transition-colors outline-none"
                >
                  Forgot Password?
                </button>
              </div>
              
              <div className="relative">
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full px-4 py-4 rounded-none border border-white/15 bg-black focus:border-l-4 focus:border-l-[#ff9e00] focus:border-[#ff9e00] focus:ring-0 outline-none transition-all text-xs font-mono font-bold text-white placeholder:text-white/25 tracking-widest" 
                  required 
                  suppressHydrationWarning
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

            <button 
              type="submit" 
              disabled={isLoading || isGoogleLoading}
              className={`w-full relative bg-[#ff9e00] text-black py-4.5 rounded-none text-[11px] font-mono font-bold uppercase tracking-widest transition-all duration-300 transform active:scale-[0.98] hover:shadow-[4px_4px_0px_rgba(255,255,255,0.15)] ${isLoading ? 'bg-zinc-800 text-white/55' : 'hover:bg-[#ffaa22]'}`}
            >
              <div className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                Sign In to Dashboard <ArrowRight className="w-4 h-4" />
              </div>
              
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </form>
          )}

          {!unverifiedEmail && (
            <>
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="px-4 text-[9px] font-mono font-bold text-white/20 uppercase tracking-widest">Or sign in with</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
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
            
            {isGoogleLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </button>
            </>
          )}

          <p className="text-center text-xs text-white/40 mt-10 font-mono">
            Don't have an account? <Link href="/register" className="text-white font-bold hover:text-[#ff9e00] transition-colors ml-1 uppercase tracking-wider">Register Now</Link>
          </p>
        </div>
      </div>

      {/* SISI KANAN: VISUAL PRESTIGE */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-black items-center justify-center p-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#ff9e00]/10 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-zinc-950 border border-white/15 rounded-none p-10 shadow-none relative overflow-hidden group hover:border-white/25 hover:shadow-[8px_8px_0px_rgba(255,158,0,0.15)] transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#ff9e00] to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/15 bg-white/5 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-white/60 mb-8">
              <div className="w-1.5 h-1.5 rounded-none bg-[#ff9e00] animate-pulse"></div> Featured Creator
            </div>
            
            <h2 className="text-2xl font-display font-bold text-white leading-relaxed tracking-tight mb-10">
              &quot;Portfo.be changes how clients and agencies view my work professionally.&quot;
            </h2>
            
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 border border-[#ff9e00]/30 p-0.5 relative rounded-none">
                  <div className="absolute inset-0 border border-[#ff9e00] animate-ping opacity-10 rounded-none"></div>
                  <img src="https://i.pravatar.cc/150?img=11" className="w-full h-full object-cover rounded-none" alt="Avatar" />
               </div>
               <div>
                  <p className="text-white font-mono font-bold text-xs tracking-wide">Aris Setiawan</p>
                  <p className="text-[#ff9e00] text-[10px] font-mono font-bold mt-1 uppercase tracking-widest">Commercial Photographer</p>
               </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
