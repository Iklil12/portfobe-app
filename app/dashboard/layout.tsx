// File: app/dashboard/layout.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const isDesignRoute = pathname === '/dashboard/projects' || pathname === '/dashboard/themes' || pathname === '/dashboard/links';
  const [isDesignMenuOpen, setIsDesignMenuOpen] = useState(isDesignRoute);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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
  const userEmail = session?.user?.email || "user@portfo.be";
  const isLoading = status === "loading"; 

  const handleLogout = () => {
    setIsLoggingOut(true);
    signOut({ redirect: true, callbackUrl: '/login' });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA] font-sans text-slate-900 selection:bg-slate-200 selection:text-slate-900 relative">
      
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
        
        .animate-dropdown { animation: dropdownEnter 0.2s ease-out forwards; transform-origin: top right; }
        @keyframes dropdownEnter {
          0% { opacity: 0; transform: scale(0.95) translateY(-10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}} />

      {/* --- MODAL KONFIRMASI LOGOUT --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={() => !isLoggingOut && setShowLogoutModal(false)}></div>
          <div className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-slate-100 animate-enter-modal z-10">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-sign-out-alt text-xl translate-x-0.5"></i>
            </div>
            <h3 className="text-2xl font-extrabold text-center mb-2 text-slate-900 tracking-tight">Keluar dari akun?</h3>
            <p className="text-slate-500 text-sm font-medium text-center mb-8 leading-relaxed px-2">Sesi Anda akan diakhiri. Anda perlu masuk kembali untuk mengakses dashboard kreator.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} disabled={isLoggingOut} className="flex-1 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-700 active:scale-95 transition-all text-sm disabled:opacity-50">Batalkan</button>
              <button onClick={handleLogout} disabled={isLoggingOut} className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                {isLoggingOut ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Ya, Keluar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SIDEBAR DINAMIS --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-100 flex flex-col transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl w-72' : '-translate-x-full md:relative md:translate-x-0'} 
        ${isSidebarCollapsed ? 'md:w-[88px]' : 'md:w-72'} 
      `}>
        
        {/* STRUKTUR SIDEBAR YANG MEMASTIKAN FLYOUT TIDAK TERPOTONG */}
        <div className="flex flex-col h-full w-full">
          
          {/* HEADER SIDEBAR: LOGO */}
          <div className="h-[88px] shrink-0 flex items-center justify-center border-b border-transparent px-6 transition-all">
            {isLoading ? (
              <div className="h-6 w-24 bg-slate-100 rounded animate-pulse"></div>
            ) : (
              <Link href="/" className="flex items-center group cursor-pointer w-full justify-center transition-all duration-300">
                 {isSidebarCollapsed ? (
                   <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">P</div>
                 ) : (
                   <img src="/portfo.be.png" alt="Portfo.be Logo" className="h-7 w-auto object-contain group-hover:scale-105 transition-transform duration-300 mr-auto" />
                 )}
              </Link>
            )}
          </div>

          {/* MENU NAVIGASI: Hanya bisa di-scroll jika TIDAK diperkecil (agar flyout tidak ketelan) */}
          <nav className={`flex-1 space-y-1 mt-4 transition-all ${isSidebarCollapsed ? 'overflow-visible px-3' : 'overflow-y-auto hide-scrollbar px-4'}`}>
            {isLoading ? (
              <div className="space-y-4 py-4">
                <div className="h-12 w-full bg-slate-50 rounded-2xl animate-pulse"></div>
                <div className="h-12 w-full bg-slate-50 rounded-2xl animate-pulse"></div>
              </div>
            ) : (
              <>
                <div className="relative group/tooltip">
                  <Link href="/dashboard" className={`w-full flex items-center py-3.5 rounded-2xl transition-all group ${isActive('/dashboard') ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4 gap-4'}`}>
                    <i className={`fas fa-layer-group text-center transition-colors ${isSidebarCollapsed ? 'text-xl' : 'text-lg w-6'} ${isActive('/dashboard') ? 'text-[#ff9e00]' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                    {!isSidebarCollapsed && <span className="font-extrabold text-[13px] tracking-wide">Overview</span>}
                  </Link>
                  {isSidebarCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-300 z-[100] whitespace-nowrap shadow-xl border border-slate-700 translate-x-2 group-hover/tooltip:translate-x-0">
                      Overview
                    </div>
                  )}
                </div>
                
                {/* --- MENU DESAIN (FLYOUT HOVER MURNI CSS - ANTI NGEBUG) --- */}
                <div className="pt-2 relative group/design">
                  <button onClick={() => { if(!isSidebarCollapsed) setIsDesignMenuOpen(!isDesignMenuOpen); }} className={`w-full flex items-center transition-all group py-3.5 rounded-2xl ${isDesignRoute ? (isSidebarCollapsed ? 'bg-slate-100 text-slate-900' : 'text-slate-900') : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} ${isSidebarCollapsed ? 'justify-center px-0 cursor-default' : 'px-4 justify-between'}`}>
                    <div className={`flex items-center ${isSidebarCollapsed ? '' : 'gap-4'}`}>
                      <i className={`fas fa-paint-roller text-center transition-colors ${isSidebarCollapsed ? 'text-xl' : 'text-lg w-6'} ${isDesignRoute ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                      {!isSidebarCollapsed && <span className="font-extrabold text-[13px] tracking-wide">Desain</span>}
                    </div>
                    {!isSidebarCollapsed && <i className={`fas fa-chevron-down text-[10px] text-slate-400 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isDesignMenuOpen ? 'rotate-180' : ''}`}></i>}
                  </button>

                  {/* Tooltip Tulisan 'Desain' (Hilang jika sedang melihat flyout) */}
                  {isSidebarCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-lg opacity-0 pointer-events-none group-hover/design:opacity-100 transition-all duration-300 z-[90] whitespace-nowrap shadow-xl border border-slate-700 translate-x-2 group-hover/design:translate-x-0 group-hover/design:hidden">
                      Menu Desain
                    </div>
                  )}

                  {/* Kotak Melayang (Flyout) saat Diperkecil */}
                  {isSidebarCollapsed && (
                    <div className="absolute left-full top-0 w-56 pl-3 opacity-0 pointer-events-none group-hover/design:opacity-100 group-hover/design:pointer-events-auto transition-all duration-300 z-[100] -translate-x-2 group-hover/design:translate-x-0">
                      <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] py-2 px-1">
                        <div className="px-4 py-2 border-b border-slate-100 mb-1">
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Menu Desain</p>
                        </div>
                        <Link href="/dashboard/projects" className={`w-full flex items-center px-4 py-3 rounded-xl font-bold text-[13px] transition-all ${isActive('/dashboard/projects') ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                          Proyek & Karya
                        </Link>
                        <Link href="/dashboard/themes" className={`w-full flex items-center px-4 py-3 rounded-xl font-bold text-[13px] transition-all ${isActive('/dashboard/themes') ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                          Koleksi Tema
                        </Link>
                        <Link href="/dashboard/links" className={`w-full flex items-center px-4 py-3 rounded-xl font-bold text-[13px] transition-all ${isActive('/dashboard/links') ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                          Tautan (Links)
                        </Link>
                      </div>
                    </div>
                  )}
                  
                  {/* Dropdown Biasa (Ke bawah) saat Diperbesar */}
                  {!isSidebarCollapsed && (
                    <div className={`flex flex-col pl-[3.25rem] pr-2 space-y-1 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isDesignMenuOpen ? 'max-h-40 py-2 opacity-100' : 'max-h-0 py-0 opacity-0 hidden'}`}>
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
                  )}
                </div>

                <div className="relative group/tooltip">
                  <Link href="/dashboard/analytics" className={`w-full flex items-center py-3.5 rounded-2xl transition-all group mt-2 ${isActive('/dashboard/analytics') ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4 gap-4'}`}>
                    <i className={`fas fa-chart-pie text-center transition-colors ${isSidebarCollapsed ? 'text-xl' : 'text-lg w-6'} ${isActive('/dashboard/analytics') ? 'text-[#ff9e00]' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                    {!isSidebarCollapsed && <span className="font-extrabold text-[13px] tracking-wide">Metrics</span>}
                  </Link>
                  {isSidebarCollapsed && <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-300 z-[100] whitespace-nowrap shadow-xl border border-slate-700 translate-x-2 group-hover/tooltip:translate-x-0">Metrics</div>}
                </div>

                {!isSidebarCollapsed ? (
                  <div className="pt-8 px-5 pb-3 transition-opacity duration-300">
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Pengaturan</p>
                  </div>
                ) : (
                  <div className="pt-6 pb-2 w-full flex justify-center"><div className="w-6 h-[2px] bg-slate-100 rounded-full"></div></div>
                )}

                <div className="relative group/tooltip">
                  <Link href="/dashboard/profile" className={`w-full flex items-center py-3.5 rounded-2xl transition-all group ${isActive('/dashboard/profile') ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4 gap-4'}`}>
                    <i className={`fas fa-user-circle text-center transition-colors ${isSidebarCollapsed ? 'text-xl' : 'text-lg w-6'} ${isActive('/dashboard/profile') ? 'text-[#ff9e00]' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                    {!isSidebarCollapsed && <span className="font-extrabold text-[13px] tracking-wide">Profil & Bio</span>}
                  </Link>
                  {isSidebarCollapsed && <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-300 z-[100] whitespace-nowrap shadow-xl border border-slate-700 translate-x-2 group-hover/tooltip:translate-x-0">Profil</div>}
                </div>
                
                <div className="relative group/tooltip">
                  <Link href="/dashboard/settings" className={`w-full flex items-center py-3.5 rounded-2xl transition-all group ${isActive('/dashboard/settings') ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4 gap-4'}`}>
                    <i className={`fas fa-cog text-center transition-colors ${isSidebarCollapsed ? 'text-xl' : 'text-lg w-6'} ${isActive('/dashboard/settings') ? 'text-[#ff9e00]' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                    {!isSidebarCollapsed && <span className="font-extrabold text-[13px] tracking-wide">Akun</span>}
                  </Link>
                  {isSidebarCollapsed && <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-300 z-[100] whitespace-nowrap shadow-xl border border-slate-700 translate-x-2 group-hover/tooltip:translate-x-0">Pengaturan Akun</div>}
                </div>
              </>
            )}
          </nav>
          
          {/* AREA 3: FOOTER SIDEBAR (SELALU DI BAWAH & ANTI KETELAN) */}
          <div className={`shrink-0 border-t border-slate-100 bg-white z-10 p-4 transition-all duration-300`}>
             
            {/* KOTAK PRO (HILANG JIKA COLLAPSED) */}
            {!isSidebarCollapsed && (
              <div className="w-full mb-4">
                {isLoading ? (
                   <div className="h-32 w-full bg-slate-50 rounded-2xl animate-pulse"></div>
                ) : userPlan === 'FREE' ? (
                  <div className="relative overflow-hidden bg-[#0a0a0a] p-5 rounded-3xl shadow-sm border border-white/10 group hover:border-white/20 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff9e00]/10 blur-[50px] group-hover:bg-[#ff9e00]/20 transition-colors duration-500"></div>
                    <i className="fas fa-gem absolute -bottom-4 -right-3 text-7xl text-white opacity-[0.02] transform rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 pointer-events-none"></i>
                    
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] font-extrabold uppercase tracking-widest text-[#ff9e00] mb-3">
                        <i className="fas fa-crown"></i> PRO
                      </div>
                      <p className="text-xs font-bold text-white mb-4 leading-snug">Metrik mendalam.</p>
                      
                      <Link href="/dashboard/upgrade" className="block w-full text-center bg-white text-slate-900 text-[10px] font-extrabold tracking-widest uppercase py-3 px-2 rounded-xl shadow-lg hover:bg-slate-200 active:scale-95 transition-all">
                        Upgrade
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="relative overflow-hidden bg-slate-50 border border-slate-200 p-5 rounded-3xl group">
                    <i className="fas fa-check-circle absolute -bottom-4 -right-3 text-7xl text-[#ff9e00] opacity-[0.05] transform -rotate-12 transition-transform duration-500 group-hover:scale-110 pointer-events-none"></i>
                    <div className="relative z-10">
                      <p className="text-[9px] font-extrabold tracking-widest text-[#ff9e00] mb-2 uppercase">Status Akun</p>
                      <p className="text-sm font-extrabold text-slate-900 mb-1 leading-snug">Pro Creator</p>
                      <p className="text-[10px] text-slate-500 font-medium">Fitur terbuka.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- TOMBOL TOGGLE MINIMALIS KOTAK ICON --- */}
            <div className={`w-full flex ${isSidebarCollapsed ? 'justify-center' : 'justify-end'} transition-all duration-300`}>
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                className="hidden md:flex w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 items-center justify-center transition-all duration-300 ease-in-out active:scale-90 group shadow-sm"
                title={isSidebarCollapsed ? "Perbesar Sidebar" : "Perkecil Sidebar"}
              >
                <i className={`fas fa-chevron-left text-[12px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isSidebarCollapsed ? 'rotate-180 group-hover:translate-x-0.5' : 'group-hover:-translate-x-0.5'}`}></i>
              </button>
            </div>

          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAFAFA] relative w-full">
        
        {/* GLOBAL HEADER */}
        <header className="h-[88px] bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 sm:px-10 shrink-0 relative z-40">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden w-11 h-11 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:scale-90 transition-all flex items-center justify-center shadow-sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <i className="fas fa-bars text-sm"></i>
            </button>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">{getPageTitle()}</h2>
          </div>
          
          {/* USER INFO AREA */}
          <div className="relative" ref={profileMenuRef}>
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
                <div 
                  className="flex items-center gap-4 cursor-pointer group" 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <div className="hidden sm:block text-right">
                    <p className="text-[13px] font-extrabold text-slate-900 tracking-tight group-hover:text-[#ff9e00] transition-colors">{userName}</p>
                    <p className={`text-[9px] font-extrabold uppercase tracking-widest mt-0.5 ${
                        userPlan === 'PRO' ? 'text-[#ff9e00]' : 'text-slate-400'
                    }`}>
                        {userPlan} PLAN
                    </p>
                  </div>
                  
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

            {/* KOTAK DROPDOWN MENU PROFIL */}
            {isProfileMenuOpen && !isLoading && (
              <div className="absolute top-[calc(100%+16px)] right-0 w-64 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 py-3 animate-dropdown z-50">
                <div className="px-5 py-3 border-b border-slate-100 mb-2">
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Masuk sebagai</p>
                  <p className="text-sm font-bold text-slate-900 truncate">{userEmail}</p>
                </div>
                
                <div className="flex flex-col">
                  <Link 
                    href="/dashboard/profile" 
                    className="px-5 py-3 text-[13px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-3"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <i className="fas fa-user-edit w-5 text-center text-slate-400"></i> Edit Profil
                  </Link>
                  <Link 
                    href="/dashboard/settings" 
                    className="px-5 py-3 text-[13px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-3"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <i className="fas fa-cog w-5 text-center text-slate-400"></i> Pengaturan
                  </Link>
                  
                  {userPlan !== 'PRO' && (
                    <Link 
                      href="/dashboard/upgrade" 
                      className="px-5 py-3 text-[13px] font-bold text-[#ff9e00] hover:bg-[#ff9e00]/10 transition-colors flex items-center gap-3 mt-1"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <i className="fas fa-arrow-up w-5 text-center"></i> Upgrade Pro
                    </Link>
                  )}
                </div>

                <div className="h-px bg-slate-100 my-2 mx-5"></div>

                <button 
                  onClick={() => { setIsProfileMenuOpen(false); setShowLogoutModal(true); }}
                  className="w-full px-5 py-3 text-[13px] font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3 text-left"
                >
                  <i className="fas fa-sign-out-alt w-5 text-center"></i> Keluar
                </button>
              </div>
            )}
          </div>

        </header>

        {/* DYNAMIC PAGE CONTENT */}
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