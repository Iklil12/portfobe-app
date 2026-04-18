"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from "@/app/actions/auth";
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
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

  return (
    <div className="bg-[#F8F9FB] text-gray-900 flex min-h-screen font-sans selection:bg-black selection:text-white">
      {/* SISI KIRI: DESAIN MINIMALIS & PRESTIGE */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-black items-center justify-center p-16 overflow-hidden">
        {/* Abstract Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full opacity-40">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative z-10 w-full">
          <img src="/portfo.be.png" alt="Logo" className="h-8 mb-24 brightness-0 invert opacity-80" />
          <h2 className="text-5xl font-medium text-white leading-[1.1] tracking-tight mb-6">
            Pamerkan karya terbaikmu <br /> dalam 5 menit.
          </h2>
          <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
            Bergabunglah dengan komunitas kreator visual paling eksklusif di dunia.
          </p>
          
          {/* Testimonial Kecil agar Terlihat Pro */}
          <div className="mt-24 pt-12 border-t border-white/10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 font-medium">+1.2k Kreator baru bulan ini</p>
          </div>
        </div>
      </div>

      {/* SISI KANAN: FORM REFINED */}
      <div className="w-full lg:w-[55%] bg-white flex flex-col justify-center px-6 sm:px-16 md:px-24 xl:px-40 relative shadow-[-20px_0_50px_rgba(0,0,0,0.02)]">
        
        <div className="w-full max-w-md mx-auto py-12">
          <div className="mb-10 text-center lg:text-left">
             <h1 className="text-3xl font-bold tracking-tight mb-3">Buat Akun Portfo.be</h1>
             <p className="text-gray-500 text-sm">Gratis selamanya, tanpa perlu kartu kredit.</p>
          </div>

          {/* Elegant Error Alert */}
          {errorMsg && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                 <i className="fas fa-exclamation text-[10px]"></i>
              </div>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2 group-focus-within:text-black transition-colors">Nama Lengkap</label>
              <input 
                name="fullName" 
                type="text" 
                placeholder="Iklil Uyun" 
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-black focus:ring-[4px] focus:ring-black/5 outline-none transition-all text-sm font-medium" 
                required 
              />
            </div>

            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2 group-focus-within:text-black transition-colors">Alamat Email</label>
              <input 
                name="email" 
                type="email" 
                placeholder="hello@iklil.uyun" 
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-black focus:ring-[4px] focus:ring-black/5 outline-none transition-all text-sm font-medium" 
                required 
              />
            </div>

            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2 group-focus-within:text-black transition-colors">Password</label>
              <div className="relative">
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Min. 8 karakter" 
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-black focus:ring-[4px] focus:ring-black/5 outline-none transition-all text-sm font-medium" 
                  required 
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
              disabled={isLoading}
              className={`w-full relative bg-black text-white py-4 rounded-2xl text-sm font-bold tracking-wide overflow-hidden transition-all duration-300 transform active:scale-[0.98] ${isLoading ? 'bg-gray-800' : 'hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:-translate-y-0.5'}`}
            >
              <div className={`flex items-center justify-center gap-3 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                Buat Akun Sekarang
                <i className="fas fa-arrow-right text-[10px]"></i>
              </div>
              
              {/* Spinner Overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-10">
            Sudah punya akun? <Link href="/login" className="text-black font-bold hover:underline underline-offset-4">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}