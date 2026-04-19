"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (typeof document !== 'undefined' && !document.querySelector('#font-awesome-cdn')) {
      const link = document.createElement('link');
      link.id = 'font-awesome-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
      document.head.appendChild(link);
    }
  }, []);
  
  const pathname = usePathname();
  const { data: session, status } = useSession(); 
  
  const rawPlan = (session?.user as any)?.plan || "FREE";
  const userPlan = typeof rawPlan === 'string' ? rawPlan.toUpperCase() : "FREE";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Deteksi rute desain untuk membuka akordion secara default
  const isDesignRoute = pathname === '/dashboard/projects' || pathname === '/dashboard/themes' || pathname === '/dashboard/links';
  const [isDesignMenuOpen, setIsDesignMenuOpen] = useState(isDesignRoute);

  // STATE BARU: Untuk mengontrol modal konfirmasi logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (path: string) => pathname === path;

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Overview';
    if (pathname === '/dashboard/projects') return 'Proyek & Karya';
    if (pathname === '/dashboard/themes') return 'Koleksi Tema';
    if (pathname === '/dashboard/links') return 'Tautan (Links)';
    if (pathname === '/dashboard/analytics') return 'Audience Metrics';
    if (pathname === '/dashboard/profile') return 'Profil & Bio';
    if (pathname === '/dashboard/settings') return 'Pengaturan Akun';
    return 'Panel Creator';
  };

  const userName = session?.user?.name || "Creator";
  const isLoading = status === "loading"; 

  // FUNGSI BARU: Eksekusi Logout dengan Loading State
  const handleLogout = () => {
    setIsLoggingOut(true);
    signOut({ redirect: true, callbackUrl: '/login' });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA] font-sans text-slate-900 selection:bg-slate-200 selection:text-slate-900 relative">
      
      {/* INJEKSI CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .animate-enter-modal { animation: modalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes modalEnter {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}} />

      {/* --- MODAL KONFIRMASI LOGOUT --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Latar Belakang Blur */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
            onClick={() => !isLoggingOut && setShowLogoutModal(false)}
          ></div>
          
          {/* Kotak Modal */}
          <div className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-slate-100 animate-enter-modal z-10">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-sign-out-alt text-xl translate-x-0.5"></i>
            </div>
            
            <h3 className="text-2xl font-extrabold text-center mb-2 text-slate-900 tracking-tight">Keluar dari akun?</h3>
            <p className="text-slate-500 text-sm font-medium text-center mb-8 leading-relaxed px-2">
              Sesi Anda akan diakhiri. Anda perlu masuk kembali untuk mengakses dashboard kreator.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutModal(false)} 
                disabled={isLoggingOut} 
                className="flex-1 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-700 active:scale-95 transition-all text-sm disabled:opacity-50"
              >
                Batalkan
              </button>
              <button 
                onClick={handleLogout} 
                disabled={isLoggingOut} 
                className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isLoggingOut ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Ya, Keluar'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ---------------------------------- */}

      {/* SIDEBAR SISI KIRI */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transform ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col justify-between transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}>
        <div className="overflow-y-auto hide-scrollbar flex flex-col h-full">
          
          {/* BAGIAN LOGO */}
          <div className="h-[88px] flex items-center px-8 shrink-0">
            {isLoading ? (
              <div className="h-6 w-32 bg-slate-100 rounded animate-pulse"></div>
            ) : (
              <Link href="/" className="flex items-center group cursor-pointer">
                <img src="/portfo.be.png" alt="Portfo.be Logo" className="h-7 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
              </Link>
            )}
          </div>

          {/* BAGIAN MENU NAVIGASI */}
          <nav className="px-4 space-y-1 mt-2">
            {isLoading ? (
              <div className="space-y-4 px-2 py-4">
                <div className="h-12 w-full bg-slate-50 rounded-2xl animate-pulse"></div>
                <div className="h-12 w-full bg-slate-50 rounded-2xl animate-pulse"></div>
                <div className="pl-12 space-y-2">
                  <div className="h-8 w-3/4 bg-slate-50/50 rounded-xl animate-pulse"></div>
                  <div className="h-8 w-3/4 bg-slate-50/50 rounded-xl animate-pulse"></div>
                </div>
              </div>
            ) : (
              <>
                {/* Menu: Overview */}
                <Link href="/dashboard" className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-extrabold text-[13px] tracking-wide transition-all group ${isActive('/dashboard') ? 'bg-slate-900 text-white shadow-[0_10px_20px_rgba(0,0,0,0.1)]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <i className={`fas fa-layer-group text-lg w-6 text-center transition-colors ${isActive('/dashboard') ? 'text-[#ff9e00]' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                  Overview
                </Link>
                
                {/* Menu Akordion: Desain */}
                <div className="pt-2">
                  <button onClick={() => setIsDesignMenuOpen(!isDesignMenuOpen)} className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl font-extrabold text-[13px] tracking-wide transition-all group ${isDesignRoute ? 'text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                    <div className="flex items-center gap-4">
                      <i className={`fas fa-paint-roller text-lg w-6 text-center transition-colors ${isDesignRoute ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                      Desain
                    </div>
                    <i className={`fas fa-chevron-down text-[10px] text-slate-400 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isDesignMenuOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  
                  {/* Sub-menu Desain */}
                  <div className={`flex flex-col pl-[3.25rem] pr-2 space-y-1 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isDesignMenuOpen ? 'max-h-40 py-2 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
                    <Link href="/dashboard/projects" className={`w-full flex items-center px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all relative ${isActive('/dashboard/projects') ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'}`}>
                      {isActive('/dashboard/projects') && <div className="absolute left-0 w-1 h-1/2 bg-[#ff9e00] rounded-r-full"></div>}
                      Proyek & Karya
                    </Link>
                    <Link href="/dashboard/themes" className={`w-full flex items-center px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all relative ${isActive('/dashboard/themes') ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'}`}>
                      {isActive('/dashboard/themes') && <div className="absolute left-0 w-1 h-1/2 bg-[#ff9e00] rounded-r-full"></div>}
                      Koleksi Tema
                    </Link>
                    <Link href="/dashboard/links" className={`w-full flex items-center px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all relative ${isActive('/dashboard/links') ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'}`}>
                      {isActive('/dashboard/links') && <div className="absolute left-0 w-1 h-1/2 bg-[#ff9e00] rounded-r-full"></div>}
                      Tautan (Links)
                    </Link>
                  </div>
                </div>

                {/* Menu: Analytics */}
                <Link href="/dashboard/analytics" className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-extrabold text-[13px] tracking-wide transition-all group mt-2 ${isActive('/dashboard/analytics') ? 'bg-slate-900 text-white shadow-[0_10px_20px_rgba(0,0,0,0.1)]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <i className={`fas fa-chart-pie text-lg w-6 text-center transition-colors ${isActive('/dashboard/analytics') ? 'text-[#ff9e00]' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                  Metrics
                </Link>

                <div className="pt-8 px-5 pb-3">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Pengaturan</p>
                </div>

                <Link href="/dashboard/profile" className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-extrabold text-[13px] tracking-wide transition-all group ${isActive('/dashboard/profile') ? 'bg-slate-900 text-white shadow-[0_10px_20px_rgba(0,0,0,0.1)]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <i className={`fas fa-user-circle text-lg w-6 text-center transition-colors ${isActive('/dashboard/profile') ? 'text-[#ff9e00]' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                  Profil & Bio
                </Link>
                
                <Link href="/dashboard/settings" className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-extrabold text-[13px] tracking-wide transition-all group ${isActive('/dashboard/settings') ? 'bg-slate-900 text-white shadow-[0_10px_20px_rgba(0,0,0,0.1)]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <i className={`fas fa-cog text-lg w-6 text-center transition-colors ${isActive('/dashboard/settings') ? 'text-[#ff9e00]' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                  Akun
                </Link>
              </>
            )}
          </nav>
          
          {/* BAGIAN KOTAK UPGRADE (DARK & PREMIUM) */}
          <div className="px-6 mt-auto mb-6 pt-10">
            {isLoading ? (
               <div className="h-32 w-full bg-slate-50 rounded-2xl animate-pulse"></div>
            ) : userPlan === 'FREE' ? (
              <div className="relative overflow-hidden bg-[#0a0a0a] p-6 rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.1)] border border-white/10 group hover:border-white/20 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff9e00]/10 blur-[50px] group-hover:bg-[#ff9e00]/20 transition-colors duration-500"></div>
                <i className="fas fa-gem absolute -bottom-4 -right-3 text-7xl text-white opacity-[0.02] transform rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 pointer-events-none"></i>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] font-extrabold uppercase tracking-widest text-[#ff9e00] mb-4">
                    <i className="fas fa-crown"></i> PRO
                  </div>
                  <p className="text-[14px] font-bold text-white mb-5 leading-snug">Dapatkan akses ke fitur metrik mendalam.</p>
                  
                  <Link href="/dashboard/upgrade" className="block w-full text-center bg-white text-slate-900 text-[11px] font-extrabold tracking-widest uppercase py-3.5 px-2 rounded-xl shadow-lg hover:bg-slate-200 active:scale-95 transition-all">
                    Upgrade
                  </Link>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden bg-slate-50 border border-slate-200 p-6 rounded-3xl group">
                <i className="fas fa-check-circle absolute -bottom-4 -right-3 text-7xl text-[#ff9e00] opacity-[0.05] transform -rotate-12 transition-transform duration-500 group-hover:scale-110 pointer-events-none"></i>
                <div className="relative z-10">
                  <p className="text-[10px] font-extrabold tracking-widest text-[#ff9e00] mb-2 uppercase">Status Akun</p>
                  <p className="text-[15px] font-extrabold text-slate-900 mb-1 leading-snug">Pro Creator</p>
                  <p className="text-[11px] text-slate-500 font-medium">Semua fitur terbuka.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BAGIAN TOMBOL KELUAR - MODIFIED */}
        <div className="p-6 border-t border-slate-100 bg-white shrink-0">
          {isLoading ? (
             <div className="h-12 w-full bg-slate-50 rounded-2xl animate-pulse"></div>
          ) : (
            <button 
              onClick={() => setShowLogoutModal(true)} 
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm text-slate-500 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95 group"
            >
              Keluar <i className="fas fa-sign-out-alt text-xs group-hover:translate-x-1 transition-transform"></i>
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAFAFA] relative">
        
        {/* GLOBAL HEADER HEADER */}
        <header className="h-[88px] bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 sm:px-10 shrink-0 relative z-40">
          <div className="flex items-center gap-4">
            {/* Hamburger Button untuk Mobile */}
            <button 
              className="md:hidden w-11 h-11 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:scale-90 transition-all flex items-center justify-center shadow-sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <i className="fas fa-bars text-sm"></i>
            </button>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">{getPageTitle()}</h2>
          </div>
          
          {/* USER INFO AREA */}
          <div className="flex items-center gap-5">
            {isLoading ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end gap-1.5">
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-slate-100 rounded animate-pulse"></div>
                </div>
                <div className="w-11 h-11 rounded-full bg-slate-200 border border-slate-100 animate-pulse"></div>
              </div>
            ) : (
              <div className="flex items-center gap-4 cursor-pointer group">
                <div className="hidden sm:block text-right">
                  <p className="text-[13px] font-extrabold text-slate-900 tracking-tight group-hover:text-[#ff9e00] transition-colors">{userName}</p>
                  <p className={`text-[9px] font-extrabold uppercase tracking-widest mt-0.5 ${
                      userPlan === 'PRO' ? 'text-[#ff9e00]' : 'text-slate-400'
                  }`}>
                      {userPlan} PLAN
                  </p>
                </div>
                
                {/* Avatar dengan Peringatan Props (Jika PRO) */}
                <div className="relative">
                  <div className={`w-11 h-11 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105 ${
                      userPlan === 'PRO' 
                        ? 'border-2 border-[#ff9e00] shadow-[0_0_15px_rgba(255,158,0,0.3)]' 
                        : 'border border-slate-200' 
                    }`}
                  >
                    <img 
                      src={(session?.user as any)?.avatar || session?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=f8fafc&color=0f172a&bold=true`} 
                      className="w-full h-full object-cover" 
                      alt="Profile" 
                    />
                  </div>
                  
                  {userPlan === 'PRO' && (
                    <div className="absolute -top-1 -right-1 bg-[#ff9e00] text-black rounded-full w-4 h-4 flex items-center justify-center border border-white shadow-sm z-10">
                      <i className="fas fa-crown text-[8px]"></i>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* DYNAMIC PAGE CONTENT (Tempat halaman anak dirender) */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

      </main>

      {/* OVERLAY GELAP SAAT SIDEBAR MOBILE TERBUKA */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
}