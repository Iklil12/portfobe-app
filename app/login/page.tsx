"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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
      setErrorMsg("Kredensial yang Anda masukkan tidak cocok.");
      setIsLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="bg-[#F8F9FB] text-gray-900 flex min-h-screen font-sans selection:bg-black selection:text-white">
      
      {/* SISI KIRI: LOGIN FORM AREA */}
      <div className="w-full lg:w-[55%] bg-white flex flex-col justify-center px-6 sm:px-16 md:px-24 xl:px-40 relative shadow-[20px_0_50px_rgba(0,0,0,0.02)] z-10">
        
        <Link href="/" className="absolute top-10 left-8 sm:left-16 md:left-24 xl:left-40">
          <img src="/portfo.be.png" alt="Logo" className="h-7 w-auto object-contain" />
        </Link>

        <div className="w-full max-w-md mx-auto py-12">
          <div className="mb-10">
             <h1 className="text-3xl font-bold tracking-tight mb-3">Selamat Datang Kembali</h1>
             <p className="text-gray-500 text-sm font-medium">Masuk untuk mengelola portofolio profesional Anda.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl text-orange-700 text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                 <i className="fas fa-shield-alt text-[10px]"></i>
              </div>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6" suppressHydrationWarning>
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2 group-focus-within:text-black transition-colors">Email</label>
              <input 
                name="email" 
                type="email" 
                placeholder="email@anda.com" 
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-black focus:ring-[4px] focus:ring-black/5 outline-none transition-all text-sm font-medium" 
                required 
                suppressHydrationWarning
              />
            </div>

            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 group-focus-within:text-black transition-colors">Password</label>
                <Link href="#" className="text-[11px] font-bold text-gray-400 hover:text-black uppercase tracking-wider transition-colors">Lupa Password?</Link>
              </div>
              <div className="relative">
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-black focus:ring-[4px] focus:ring-black/5 outline-none transition-all text-sm font-medium" 
                  required 
                  suppressHydrationWarning
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  <i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || isGoogleLoading}
              className={`w-full relative bg-black text-white py-4 rounded-2xl text-[13px] font-bold tracking-wide overflow-hidden transition-all duration-300 transform active:scale-[0.98] ${isLoading ? 'bg-gray-800' : 'hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:-translate-y-0.5'}`}
            >
              <div className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                Masuk ke Dashboard
              </div>
              
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Atau</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            className={`w-full relative bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl text-[13px] font-bold tracking-wide overflow-hidden transition-all duration-300 transform active:scale-[0.98] ${isGoogleLoading ? 'bg-gray-50' : 'hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'}`}
          >
            <div className={`flex items-center justify-center gap-3 transition-opacity duration-300 ${isGoogleLoading ? 'opacity-0' : 'opacity-100'}`}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              Lanjutkan dengan Google
            </div>
            
            {isGoogleLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
              </div>
            )}
          </button>

          <p className="text-center text-sm text-gray-500 mt-10 font-medium">
            Belum punya akun? <Link href="/register" className="text-black font-bold hover:underline underline-offset-4">Mulai Gratis Sekarang</Link>
          </p>
        </div>
      </div>

      {/* SISI KANAN: VISUAL PRESTIGE */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-[#0D0D0D] items-center justify-center p-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 w-full text-center">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-8">
            Featured Creator
          </div>
          <h2 className="text-4xl font-medium text-white leading-tight tracking-tight mb-12">
            &quot;Portfo.be mengubah cara klien melihat hasil karya saya.&quot;
          </h2>
          
          <div className="flex flex-col items-center gap-3">
             <div className="w-14 h-14 rounded-full border border-white/20 p-1">
                <img src="https://i.pravatar.cc/150?u=creative" className="w-full h-full rounded-full grayscale hover:grayscale-0 transition-all duration-700" alt="Avatar" />
             </div>
             <div>
                <p className="text-white font-bold text-sm tracking-wide">Aris Setiawan</p>
                <p className="text-white/40 text-xs mt-1">Commercial Photographer</p>
             </div>
          </div>
        </div>

        <div className="absolute top-[20%] right-[10%] w-32 h-32 bg-blue-600/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[20%] left-[10%] w-32 h-32 bg-purple-600/20 rounded-full blur-[80px]"></div>
      </div>
    </div>
  );
}