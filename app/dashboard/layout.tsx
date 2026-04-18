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
  const [isDesignMenuOpen, setIsDesignMenuOpen] = useState(
    pathname === '/dashboard/projects' || 
    pathname === '/dashboard/themes' || 
    pathname === '/dashboard/links'
  );

  const isActive = (path: string) => pathname === path;

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Overview';
    if (pathname === '/dashboard/projects') return 'Proyek & Karya';
    if (pathname === '/dashboard/themes') return 'Tampilan Web';
    if (pathname === '/dashboard/links') return 'Tautan (Links)';
    if (pathname === '/dashboard/analytics') return 'Analitik Web';
    if (pathname === '/dashboard/profile') return 'Profil & Bio';
    if (pathname === '/dashboard/settings') return 'Pengaturan Akun';
    return 'Panel Admin';
  };

  const userName = session?.user?.name || "User Portfo";
  const isLoading = status === "loading"; 

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fa] text-gray-800">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col justify-between transition-transform duration-300`}>
        <div className="overflow-y-auto hide-scrollbar">
          
          {/* BAGIAN LOGO */}
          <div className="h-20 flex items-center px-8 border-b border-gray-50 shrink-0">
            {isLoading ? (
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <Link href="/" className="text-2xl font-black tracking-tighter text-gray-900">
                portfo<span className="text-gray-400">.be</span>
              </Link>
            )}
          </div>

          {/* BAGIAN MENU NAVIGASI */}
          <nav className="p-4 space-y-1 mt-2">
            {isLoading ? (
              <div className="space-y-4 px-2 py-4">
                <div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse"></div>
                <div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse"></div>
                <div className="pl-8 space-y-2">
                  <div className="h-8 w-3/4 bg-gray-50 rounded-lg animate-pulse"></div>
                  <div className="h-8 w-3/4 bg-gray-50 rounded-lg animate-pulse"></div>
                </div>
                <div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-50 rounded mt-6 mb-2 animate-pulse"></div>
                <div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse"></div>
              </div>
            ) : (
              <>
                <Link href="/dashboard" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all group ${isActive('/dashboard') ? 'bg-gray-100 text-gray-900 border-r-4 border-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <i className="fas fa-grid-2 text-lg w-6 text-center"></i> Overview
                </Link>
                
                <div>
                  <button onClick={() => setIsDesignMenuOpen(!isDesignMenuOpen)} className="w-full flex items-center justify-between px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-semibold transition-all group">
                    <div className="flex items-center gap-3">
                      <i className="fas fa-pen-nib text-lg w-6 text-center"></i> Desain
                    </div>
                    <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${isDesignMenuOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  
                  <div className={`${isDesignMenuOpen ? 'flex' : 'hidden'} flex-col pl-12 pr-2 py-1 space-y-1`}>
                    <Link href="/dashboard/projects" className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${isActive('/dashboard/projects') ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
                      Proyek & Karya
                    </Link>
                    <Link href="/dashboard/themes" className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${isActive('/dashboard/themes') ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
                      Tampilan Web
                    </Link>
                    <Link href="/dashboard/links" className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${isActive('/dashboard/links') ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
                      Tautan (Links)
                    </Link>
                  </div>
                </div>

                <Link href="/dashboard/analytics" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all group ${isActive('/dashboard/analytics') ? 'bg-gray-100 text-gray-900 border-r-4 border-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <i className="fas fa-chart-line text-lg w-6 text-center"></i> Analitik Web
                </Link>

                <div className="pt-6 px-4 pb-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Pengaturan</p>
                </div>

                <Link href="/dashboard/profile" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all group ${isActive('/dashboard/profile') ? 'bg-gray-100 text-gray-900 border-r-4 border-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <i className="fas fa-user-circle text-lg w-6 text-center"></i> Profil & Bio
                </Link>
                <Link href="/dashboard/settings" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all group ${isActive('/dashboard/settings') ? 'bg-gray-100 text-gray-900 border-r-4 border-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <i className="fas fa-cog text-lg w-6 text-center"></i> Akun
                </Link>
              </>
            )}
          </nav>
          
          {/* BAGIAN KOTAK UPGRADE */}
          <div className="px-4 mt-6 mb-4">
            {isLoading ? (
               <div className="h-32 w-full bg-gray-100 rounded-2xl animate-pulse"></div>
            ) : userPlan === 'FREE' ? (
              <div className="relative overflow-hidden bg-[#161b26] p-5 rounded-2xl shadow-lg group">
                <i className="fas fa-crown absolute -bottom-4 -right-3 text-7xl text-white opacity-[0.03] transform rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"></i>
                <div className="relative z-10">
                  <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-1 uppercase">Upgrade</p>
                  <p className="text-[15px] font-bold text-white mb-4 leading-snug">Dapatkan Paket Pro</p>
                  <Link href="/dashboard/upgrade" className="block w-full text-center bg-white text-[#161b26] text-[11px] font-bold py-3 px-2 rounded-xl hover:bg-gray-100 transition-colors active:scale-95">
                    BERLANGGANAN
                  </Link>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] border border-gray-200 p-5 rounded-2xl group">
                <i className="fas fa-check-decagram absolute -bottom-4 -right-3 text-7xl text-blue-600 opacity-[0.04] transform -rotate-12 transition-transform duration-500 group-hover:scale-110"></i>
                <div className="relative z-10">
                  <p className="text-[10px] font-bold tracking-widest text-blue-600 mb-1 uppercase">Status Anda</p>
                  <p className="text-[15px] font-bold text-gray-900 mb-1 leading-snug">Paket Pro Aktif</p>
                  <p className="text-[10px] text-gray-500 font-medium">Semua fitur premium terbuka.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BAGIAN TOMBOL KELUAR */}
        <div className="p-4 border-t border-gray-50">
          {isLoading ? (
             <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse"></div>
          ) : (
            <button 
              onClick={() => signOut({redirect: true,callbackUrl: '/login' })} 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-500 hover:bg-red-50 transition-all"
            >
              <i className="fas fa-sign-out-alt text-lg w-6 text-center"></i> Keluar
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* GLOBAL HEADER */}
        <header className="h-20 bg-white border-b border-gray-50 flex items-center justify-between px-8 shrink-0 relative z-40">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-3 rounded-lg text-gray-900 hover:text-black hover:bg-gray-100 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center w-12 h-12"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
            <h2 className="text-xl font-bold text-gray-900">{getPageTitle()}</h2>
          </div>
          
          {/* USER INFO AREA */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <>
                <div className="hidden sm:flex flex-col items-end gap-1.5">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-100 animate-pulse"></div>
              </>
            ) : (
              <>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold">{userName}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded inline-block ${
                      userPlan === 'PRO' 
                      ? 'text-yellow-600 bg-yellow-50 border border-yellow-200/50' // Mengubah warna teks PRO menjadi tema emas/kuning
                      : 'text-gray-400 bg-gray-100'
                  }`}>
                      {userPlan} PLAN
                  </p>
                </div>
                
                {/* INI BAGIAN FOTO YANG BERUBAH: Tambahan logika bingkai emas */}
                <div className="relative">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`} 
                    className={`w-10 h-10 rounded-full cursor-pointer object-cover transition-all duration-300 ${
                      userPlan === 'PRO' 
                        ? 'border-[2.5px] border-yellow-400 ring-4 ring-yellow-50 shadow-[0_0_12px_rgba(250,204,21,0.4)]' // Bingkai Emas
                        : 'border border-gray-200' // Bingkai Abu-abu standar
                    }`} 
                    alt="Profile" 
                  />
                  {/* Bintang kecil opsional untuk akun Pro (silakan hapus jika tidak suka) */}
                  {userPlan === 'PRO' && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full w-4 h-4 flex items-center justify-center border border-white shadow-sm">
                      <i className="fas fa-star text-[8px]"></i>
                    </div>
                  )}
                </div>

              </>
            )}
          </div>
        </header>

        {/* DYNAMIC PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#fdfcfb]">
          {children}
        </div>

      </main>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
}