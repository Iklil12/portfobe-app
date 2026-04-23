"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import useSWR from 'swr'; 
import { Toaster } from 'react-hot-toast'; 

interface NotificationItem {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'promo' | 'announcement';
  icon: string;
  title: string;
  desc: string;
  link: string;
  btnText?: string;
  btnColor?: string;
  color: string;
  bg: string;
  border: string;
}

// Fetcher kebal cache browser
const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then((res) => {
  if (!res.ok) throw new Error("API Error");
  return res.json();
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession(); 



  // --- MENGGUNAKAN API LAYOUT-SYNC YANG SUDAH TERBUKTI AMAN ---
  const { data: syncData } = useSWR('/api/layout-sync', fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true, 
  });

  React.useEffect(() => {
    if (typeof document !== 'undefined' && !document.querySelector('#font-awesome-cdn')) {
      const link = document.createElement('link');
      link.id = 'font-awesome-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
      document.head.appendChild(link);
    }
  }, []);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const isDesignRoute = pathname === '/dashboard/projects' || pathname === '/dashboard/themes' || pathname === '/dashboard/links';
  const [isDesignMenuOpen, setIsDesignMenuOpen] = useState(isDesignRoute);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

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

  // --- PENARIKAN DATA SWR ---
  const userPlan = syncData?.plan ? String(syncData.plan).toUpperCase() : (typeof (session?.user as any)?.plan === 'string' ? (session?.user as any)?.plan.toUpperCase() : "FREE");
  // Pastikan membaca data yang benar dari syncData
  const isWebLive = syncData && syncData.isLive !== undefined ? syncData.isLive : ((session?.user as any)?.isLive !== false);
  const userSubdomain = syncData ? syncData.subdomain : (session?.user as any)?.subdomain;
  const userProfession = syncData ? syncData.profession : (session?.user as any)?.profession;
  const userBio = syncData ? syncData.bio : (session?.user as any)?.bio;
  const userAvatar = syncData ? syncData.avatar : ((session?.user as any)?.avatar || session?.user?.image);

  const isSubdomainEmpty = !userSubdomain || String(userSubdomain).trim() === '' || String(userSubdomain) === 'null';
  const isProfessionEmpty = !userProfession || String(userProfession).trim() === '' || String(userProfession) === 'null';
  const isBioEmpty = !userBio || String(userBio).trim() === '' || String(userBio) === 'null';
  const isBioShort = !isBioEmpty && String(userBio).trim().length < 30;
  const isAvatarEmpty = !userAvatar || String(userAvatar).includes('ui-avatars.com') || String(userAvatar).trim() === '' || String(userAvatar) === 'null';

  const notifications: NotificationItem[] = [];

  if (!isWebLive) {
    notifications.push({ id: 'offline', type: 'critical', icon: 'fa-eye-slash', title: 'Web Sedang Nonaktif', desc: 'Portofolio Anda disembunyikan. Aktifkan agar bisa diakses publik.', link: '/dashboard/settings', btnText: 'Aktifkan Web', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' });
  }
  if (isSubdomainEmpty) {
    notifications.push({ id: 'subdomain', type: 'warning', icon: 'fa-link', title: 'Subdomain Kosong', desc: 'Klaim URL unik Anda sekarang sebelum diambil orang lain.', link: '/dashboard/profile', btnText: 'Atur URL', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' });
  }
  if (isAvatarEmpty) {
    notifications.push({ id: 'avatar', type: 'warning', icon: 'fa-camera', title: 'Foto Profil Belum Ada', desc: 'Unggah foto asli Anda agar klien lebih mudah mengenali Anda.', link: '/dashboard/profile', btnText: 'Unggah Foto', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' });
  }
  if (isProfessionEmpty) {
    notifications.push({ id: 'profession', type: 'info', icon: 'fa-briefcase', title: 'Profesi Belum Diisi', desc: 'Tambahkan profesi atau keahlian utama Anda.', link: '/dashboard/profile', btnText: 'Isi Profesi', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' });
  }
  if (isBioEmpty) {
    notifications.push({ id: 'bio-empty', type: 'info', icon: 'fa-align-left', title: 'Bio Masih Kosong', desc: 'Ceritakan sedikit tentang perjalanan karir Anda kepada pengunjung.', link: '/dashboard/profile', btnText: 'Tulis Bio', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' });
  } else if (isBioShort) {
    notifications.push({ id: 'bio-short', type: 'info', icon: 'fa-pen-to-square', title: 'Bio Terlalu Singkat', desc: 'Bio yang lebih detail (min. 30 karakter) akan terlihat lebih profesional.', link: '/dashboard/profile', btnText: 'Perpanjang', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' });
  }

  if (userPlan === 'FREE') {
    notifications.push({ id: 'promo', type: 'promo', icon: 'fa-crown', title: 'Upgrade ke Pro', desc: 'Dapatkan analitik mendalam dan kustom domain sesukamu.', link: '/dashboard/upgrade', color: 'text-[#ff9e00]', bg: 'bg-[#ff9e00]/10', border: 'border-[#ff9e00]/20' });
  }
  notifications.push({ id: 'announcement', type: 'announcement', icon: 'fa-bullhorn', title: 'Pembaruan Sistem v2.0', desc: 'Tema Neo Brutalism kini lebih stabil dan cepat diakses!', link: '/dashboard/themes', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' });

  const topBanner = notifications.find(n => n.type === 'critical' || n.type === 'warning' || n.type === 'info');
  const alertCount = notifications.length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) setIsProfileMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
    // --- TAMBAHKAN 3 BARIS INI ---
  const isEditorPage = pathname === '/dashboard/appearance';
  if (isEditorPage) {
    return <>{children}</>; // Render halaman murni tanpa Navbar & Sidebar!
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA] font-sans text-slate-900 selection:bg-slate-200 selection:text-slate-900 relative">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-enter-modal { animation: modalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes modalEnter { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-dropdown { animation: dropdownEnter 0.2s ease-out forwards; transform-origin: top right; }
        @keyframes dropdownEnter { 0% { opacity: 0; transform: scale(0.95) translateY(-10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-page-load { opacity: 0; animation: smoothPageLoad 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes smoothPageLoad { 0% { opacity: 0; transform: translateY(15px); filter: blur(4px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .skeleton-premium { background: linear-gradient(110deg, #f1f5f9 8%, #e2e8f0 18%, #f1f5f9 33%); background-size: 200% 100%; animation: 1.5s shine linear infinite; }
        @keyframes shine { to { background-position-x: -200%; } }
      `}} />

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" onClick={() => !isLoggingOut && setShowLogoutModal(false)}></div>
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

      <aside className={`animate-page-load fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-100 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl w-72' : '-translate-x-full md:relative md:translate-x-0'} 
        ${isSidebarCollapsed ? 'md:w-[88px]' : 'md:w-72'} 
      `}>
        <div className="flex flex-col h-full w-full">
          <div className="h-[88px] shrink-0 flex items-center justify-center border-b border-transparent px-6 transition-all relative">
            {isLoading ? (
              <div className="h-8 w-28 skeleton-premium rounded-lg"></div>
            ) : (
              <Link href="/" className="flex items-center group cursor-pointer w-full justify-center relative h-full">
                 <div className={`absolute inset-0 flex items-center justify-center transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${isSidebarCollapsed ? 'opacity-100 scale-100 rotate-0 duration-500 delay-150' : 'opacity-0 scale-50 -rotate-90 pointer-events-none duration-200 delay-0'}`}>
                   <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">P</div>
                 </div>
                 <img src="/portfo.be.png" alt="Portfo.be Logo" className={`h-7 w-auto object-contain transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${isSidebarCollapsed ? 'opacity-0 scale-50 rotate-90 pointer-events-none absolute duration-200 delay-0' : 'opacity-100 scale-100 rotate-0 group-hover:scale-105 mr-auto duration-500 delay-150'}`} />
              </Link>
            )}
          </div>

          <nav className={`flex-1 space-y-1 mt-4 transition-all ${isSidebarCollapsed ? 'overflow-visible px-3' : 'overflow-y-auto hide-scrollbar px-4'}`}>
            {isLoading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-11 w-full skeleton-premium rounded-2xl"></div>
                ))}
              </div>
            ) : (
              <>
                <div className="relative group/tooltip">
                  <Link href="/dashboard" className={`w-full flex items-center py-3.5 rounded-2xl transition-all duration-300 group ${isActive('/dashboard') ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} ${isSidebarCollapsed ? 'justify-center px-0 gap-0' : 'px-4 gap-4'}`}>
                    <i className={`fas fa-layer-group text-center transition-all duration-300 ${isSidebarCollapsed ? 'text-xl' : 'text-lg w-6'} ${isActive('/dashboard') ? 'text-[#ff9e00]' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                    <span className={`font-extrabold text-[13px] tracking-wide whitespace-nowrap transition-all ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden ${isSidebarCollapsed ? 'max-w-0 opacity-0 duration-200 delay-0' : 'max-w-[200px] opacity-100 duration-500 delay-150'}`}>Overview</span>
                  </Link>
                  {isSidebarCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-300 z-[100] whitespace-nowrap shadow-xl border border-slate-700 translate-x-2 group-hover/tooltip:translate-x-0">
                      Overview
                    </div>
                  )}
                </div>
                
                <div className="pt-2 relative group/design">
                  <button onClick={() => { if(!isSidebarCollapsed) setIsDesignMenuOpen(!isDesignMenuOpen); }} className={`w-full flex items-center transition-all duration-300 group py-3.5 rounded-2xl ${isDesignRoute ? (isSidebarCollapsed ? 'bg-slate-100 text-slate-900' : 'text-slate-900') : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} ${isSidebarCollapsed ? 'justify-center px-0 cursor-default' : 'px-4 justify-between'}`}>
                    <div className={`flex items-center transition-all duration-300 ${isSidebarCollapsed ? 'gap-0' : 'gap-4'}`}>
                      <i className={`fas fa-paint-roller text-center transition-all duration-300 ${isSidebarCollapsed ? 'text-xl' : 'text-lg w-6'} ${isDesignRoute ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                      <span className={`font-extrabold text-[13px] tracking-wide whitespace-nowrap transition-all ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden ${isSidebarCollapsed ? 'max-w-0 opacity-0 duration-200 delay-0' : 'max-w-[200px] opacity-100 duration-500 delay-150'}`}>Desain</span>
                    </div>
                    <i className={`fas fa-chevron-down text-[10px] text-slate-400 transition-all ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden ${isDesignMenuOpen ? 'rotate-180' : ''} ${isSidebarCollapsed ? 'max-w-0 opacity-0 duration-200 delay-0' : 'max-w-[20px] opacity-100 duration-500 delay-150'}`}></i>
                  </button>

                  {isSidebarCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-lg opacity-0 pointer-events-none group-hover/design:opacity-100 transition-all duration-300 z-[90] whitespace-nowrap shadow-xl border border-slate-700 translate-x-2 group-hover/design:translate-x-0 group-hover/design:hidden">
                      Menu Desain
                    </div>
                  )}

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
                  <Link href="/dashboard/analytics" className={`w-full flex items-center py-3.5 rounded-2xl transition-all duration-300 group mt-2 ${isActive('/dashboard/analytics') ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} ${isSidebarCollapsed ? 'justify-center px-0 gap-0' : 'px-4 gap-4'}`}>
                    <i className={`fas fa-chart-pie text-center transition-all duration-300 ${isSidebarCollapsed ? 'text-xl' : 'text-lg w-6'} ${isActive('/dashboard/analytics') ? 'text-[#ff9e00]' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                    <span className={`font-extrabold text-[13px] tracking-wide whitespace-nowrap transition-all ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden ${isSidebarCollapsed ? 'max-w-0 opacity-0 duration-200 delay-0' : 'max-w-[200px] opacity-100 duration-500 delay-150'}`}>Metrics</span>
                  </Link>
                  {isSidebarCollapsed && <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-300 z-[100] whitespace-nowrap shadow-xl border border-slate-700 translate-x-2 group-hover/tooltip:translate-x-0">Metrics</div>}
                </div>

                <div className={`px-5 transition-all ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden ${isSidebarCollapsed ? 'max-h-0 opacity-0 pt-0 pb-0 duration-200 delay-0' : 'max-h-[50px] opacity-100 pt-8 pb-3 duration-500 delay-150'}`}>
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">Pengaturan</p>
                </div>
                <div className={`w-full flex justify-center transition-all ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden ${isSidebarCollapsed ? 'max-h-[50px] opacity-100 pt-6 pb-2 duration-500 delay-150' : 'max-h-0 opacity-0 pt-0 pb-0 duration-200 delay-0'}`}>
                  <div className="w-6 h-[2px] bg-slate-100 rounded-full"></div>
                </div>

                <div className="relative group/tooltip">
                  <Link href="/dashboard/profile" className={`w-full flex items-center py-3.5 rounded-2xl transition-all duration-300 group ${isActive('/dashboard/profile') ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} ${isSidebarCollapsed ? 'justify-center px-0 gap-0' : 'px-4 gap-4'}`}>
                    <i className={`fas fa-user-circle text-center transition-all duration-300 ${isSidebarCollapsed ? 'text-xl' : 'text-lg w-6'} ${isActive('/dashboard/profile') ? 'text-[#ff9e00]' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                    <span className={`font-extrabold text-[13px] tracking-wide whitespace-nowrap transition-all ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden ${isSidebarCollapsed ? 'max-w-0 opacity-0 duration-200 delay-0' : 'max-w-[200px] opacity-100 duration-500 delay-150'}`}>Profil & Bio</span>
                  </Link>
                  {isSidebarCollapsed && <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-300 z-[100] whitespace-nowrap shadow-xl border border-slate-700 translate-x-2 group-hover/tooltip:translate-x-0">Profil</div>}
                </div>
                
                <div className="relative group/tooltip">
                  <Link href="/dashboard/settings" className={`w-full flex items-center py-3.5 rounded-2xl transition-all duration-300 group ${isActive('/dashboard/settings') ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} ${isSidebarCollapsed ? 'justify-center px-0 gap-0' : 'px-4 gap-4'}`}>
                    <i className={`fas fa-cog text-center transition-all duration-300 ${isSidebarCollapsed ? 'text-xl' : 'text-lg w-6'} ${isActive('/dashboard/settings') ? 'text-[#ff9e00]' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                    <span className={`font-extrabold text-[13px] tracking-wide whitespace-nowrap transition-all ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden ${isSidebarCollapsed ? 'max-w-0 opacity-0 duration-200 delay-0' : 'max-w-[200px] opacity-100 duration-500 delay-150'}`}>Akun</span>
                  </Link>
                  {isSidebarCollapsed && <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-300 z-[100] whitespace-nowrap shadow-xl border border-slate-700 translate-x-2 group-hover/tooltip:translate-x-0">Pengaturan Akun</div>}
                </div>
              </>
            )}
          </nav>
          
          <div className={`shrink-0 border-t border-slate-100 bg-white z-10 p-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}>
            <div className={`w-full transition-all ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden ${isSidebarCollapsed ? 'max-h-0 opacity-0 mb-0 duration-200 delay-0' : 'max-h-[300px] opacity-100 mb-4 duration-500 delay-150'}`}>
              {isLoading ? (
                 <div className="h-32 w-full skeleton-premium rounded-3xl"></div>
              ) : userPlan === 'FREE' ? (
                <div className="relative overflow-hidden bg-[#0a0a0a] p-5 rounded-3xl shadow-sm border border-white/10 group hover:border-white/20 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff9e00]/10 blur-[50px] group-hover:bg-[#ff9e00]/20 transition-colors duration-500"></div>
                  <i className="fas fa-gem absolute -bottom-4 -right-3 text-7xl text-white opacity-[0.02] transform rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 pointer-events-none"></i>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] font-extrabold uppercase tracking-widest text-[#ff9e00] mb-3">
                      <i className="fas fa-crown"></i> PRO
                    </div>
                    <p className="text-xs font-bold text-white mb-4 leading-snug whitespace-nowrap">Metrik mendalam.</p>
                    <Link href="/dashboard/upgrade" className="block w-full text-center bg-white text-slate-900 text-[10px] font-extrabold tracking-widest uppercase py-3 px-2 rounded-xl shadow-lg hover:bg-slate-200 active:scale-95 transition-all">
                      Upgrade
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden bg-slate-50 border border-slate-200 p-5 rounded-3xl group">
                  <i className="fas fa-check-circle absolute -bottom-4 -right-3 text-7xl text-[#ff9e00] opacity-[0.05] transform -rotate-12 transition-transform duration-500 group-hover:scale-110 pointer-events-none"></i>
                  <div className="relative z-10">
                    <p className="text-[9px] font-extrabold tracking-widest text-[#ff9e00] mb-2 uppercase whitespace-nowrap">Status Akun</p>
                    <p className="text-sm font-extrabold text-slate-900 mb-1 leading-snug whitespace-nowrap">Pro Creator</p>
                    <p className="text-[10px] text-slate-500 font-medium whitespace-nowrap">Fitur terbuka.</p>
                  </div>
                </div>
              )}
            </div>

            <div className={`w-full flex transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isSidebarCollapsed ? 'justify-center' : 'justify-end'}`}>
              <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="hidden md:flex w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 items-center justify-center transition-all duration-300 ease-in-out active:scale-90 group shadow-sm" title={isSidebarCollapsed ? "Perbesar Sidebar" : "Perkecil Sidebar"}>
                <i className={`fas fa-chevron-left text-[12px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isSidebarCollapsed ? 'rotate-180 group-hover:translate-x-0.5' : 'group-hover:-translate-x-0.5'}`}></i>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAFAFA] relative w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
        <header className="sticky top-0 z-40 h-[88px] w-full bg-white/60 backdrop-blur-xl border-b border-slate-100/50 flex items-center justify-between px-6 sm:px-10 shrink-0 animate-page-load delay-100">
          {/* --- BAGIAN HEADER BARU DENGAN SEARCH BAR PREMIUM --- */}
          <div className="flex items-center gap-6 flex-1">
            {/* Tombol Mobile Hamburger */}
            <button 
              className="md:hidden w-11 h-11 rounded-full border border-slate-200 bg-white/80 text-slate-600 hover:text-slate-900 active:scale-90 transition-all flex items-center justify-center shadow-sm" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <i className="fas fa-bars text-sm"></i>
            </button>

            {/* GLOBAL SEARCH BAR */}
            <div className="hidden md:flex relative group max-w-md w-full">
              <div className={`
                relative flex items-center w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                bg-slate-100/40 border border-slate-200/40 rounded-2xl px-4 py-2.5
                focus-within:bg-white focus-within:border-[#ff9e00]/40 focus-within:ring-4 focus-within:ring-[#ff9e00]/5
                focus-within:w-[110%] group-hover:border-slate-300/60 backdrop-blur-md
              `}>
                <div className="flex items-center justify-center text-slate-400 group-focus-within:text-[#ff9e00] transition-colors duration-300">
                  <i className="fas fa-search text-xs"></i>
                </div>

                <input 
                  type="text" 
                  placeholder="Cari proyek, tema, atau bantuan..." 
                  className="bg-transparent border-none outline-none text-[13px] font-bold text-slate-700 placeholder:text-slate-400/80 w-full px-3"
                />

                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden group-focus-within:block w-3.5 h-3.5 border-2 border-slate-200 border-t-[#ff9e00] rounded-full animate-spin mr-1"></div>
                  <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/80 border border-slate-200 shadow-sm text-[10px] font-black text-slate-400 group-focus-within:opacity-0 transition-opacity">
                    <span className="text-[12px]">⌘</span>
                    <span>K</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-[#ff9e00]/10 blur-2xl rounded-full opacity-0 group-focus-within:opacity-20 transition-opacity duration-500 -z-10"></div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            {!isLoading && (
              <div className="relative" ref={notifRef}>
                <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative w-11 h-11 rounded-full border border-slate-200 bg-white text-slate-400 hover:text-slate-900 hover:bg-slate-50 active:scale-90 transition-all flex items-center justify-center shadow-sm">
                  <i className="fas fa-bell"></i>
                  {alertCount > 0 && <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>}
                </button>

                {isNotifOpen && (
                  <div className="absolute top-[calc(100%+12px)] right-0 w-80 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 py-3 animate-dropdown z-50">
                    <div className="px-5 py-2 border-b border-slate-100 mb-2 flex justify-between items-center">
                      <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-900">Pusat Informasi</p>
                      {alertCount > 0 && <span className="text-[9px] px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-bold">{alertCount} Info</span>}
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="px-5 py-6 text-center text-slate-500 text-xs font-medium">Belum ada notifikasi baru.</div>
                      ) : (
                        notifications.map((notif) => (
                          <Link key={notif.id} href={notif.link} onClick={() => setIsNotifOpen(false)} className="px-5 py-3 hover:bg-slate-50 transition-colors flex items-start gap-4 border-b border-slate-50 last:border-0 group">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${notif.bg} ${notif.color}`}>
                              <i className={`fas ${notif.icon} text-sm`}></i>
                            </div>
                            <div className="flex-1 pt-0.5">
                              <p className={`text-xs font-bold mb-1 ${notif.type === 'critical' ? 'text-red-600' : 'text-slate-900'}`}>{notif.title}</p>
                              <p className="text-[10px] text-slate-500 leading-relaxed">{notif.desc}</p>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="relative" ref={profileMenuRef}>
              {isLoading ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-end gap-2">
                    <div className="h-3 w-24 skeleton-premium rounded-full"></div>
                    <div className="h-2 w-16 skeleton-premium rounded-full"></div>
                  </div>
                  <div className="w-11 h-11 rounded-full skeleton-premium border border-slate-100"></div>
                </div>
              ) : (
                <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                  <div className="hidden sm:block text-right">
                    <p className="text-[13px] font-extrabold text-slate-900 tracking-tight group-hover:text-[#ff9e00] transition-colors">{userName}</p>
                    <p className={`text-[9px] font-extrabold uppercase tracking-widest mt-0.5 ${userPlan === 'PRO' ? 'text-[#ff9e00]' : 'text-slate-400'}`}>{userPlan} PLAN</p>
                  </div>
                  <div className="relative">
                    <div className={`w-11 h-11 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105 ${userPlan === 'PRO' ? 'border-2 border-[#ff9e00] shadow-[0_0_15px_rgba(255,158,0,0.3)]' : 'border border-slate-200'}`}>
                      <img src={userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=f8fafc&color=0f172a&bold=true`} className="w-full h-full object-cover" alt="Profile" />
                    </div>
                    {userPlan === 'PRO' && <div className="absolute -top-1 -right-1 bg-[#ff9e00] text-black rounded-full w-4 h-4 flex items-center justify-center border border-white shadow-sm z-10"><i className="fas fa-crown text-[8px]"></i></div>}
                  </div>
                </div>
              )}

              {isProfileMenuOpen && !isLoading && (
                <div className="absolute top-[calc(100%+16px)] right-0 w-64 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 py-3 animate-dropdown z-50">
                  <div className="px-5 py-3 border-b border-slate-100 mb-2">
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Masuk sebagai</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{userEmail}</p>
                  </div>
                  <div className="flex flex-col">
                    <Link href="/dashboard/profile" className="px-5 py-3 text-[13px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-3" onClick={() => setIsProfileMenuOpen(false)}>
                      <i className="fas fa-user-edit w-5 text-center text-slate-400"></i> Edit Profil
                    </Link>
                    <Link href="/dashboard/settings" className="px-5 py-3 text-[13px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-3" onClick={() => setIsProfileMenuOpen(false)}>
                      <i className="fas fa-cog w-5 text-center text-slate-400"></i> Pengaturan
                    </Link>
                    {userPlan !== 'PRO' && (
                      <Link href="/dashboard/upgrade" className="px-5 py-3 text-[13px] font-bold text-[#ff9e00] hover:bg-[#ff9e00]/10 transition-colors flex items-center gap-3 mt-1" onClick={() => setIsProfileMenuOpen(false)}>
                        <i className="fas fa-arrow-up w-5 text-center"></i> Upgrade Pro
                      </Link>
                    )}
                  </div>
                  <div className="h-px bg-slate-100 my-2 mx-5"></div>
                  <button onClick={() => { setIsProfileMenuOpen(false); setShowLogoutModal(true); }} className="w-full px-5 py-3 text-[13px] font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3 text-left">
                    <i className="fas fa-sign-out-alt w-5 text-center"></i> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {!isLoading && topBanner && (
          <div className={`animate-page-load delay-200 shrink-0 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 sm:px-10 py-3 sm:py-4 transition-all duration-500 ${topBanner.bg} ${topBanner.border}`}>
            <div className={`flex items-start sm:items-center gap-3 ${topBanner.color}`}>
              <div className="mt-0.5 sm:mt-0 shrink-0"><i className={`fas ${topBanner.icon} text-base sm:text-lg animate-pulse`}></i></div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest opacity-80 mb-0.5">{topBanner.title}</p>
                <p className="text-xs sm:text-sm font-semibold">{topBanner.desc}</p>
              </div>
            </div>
            {topBanner.btnText && (
              <Link href={topBanner.link} className={`shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm ${topBanner.btnColor || 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                {topBanner.btnText}
              </Link>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto animate-page-load delay-300">
          {children}
        </div>
      </main>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* --- TOASTER DIPINDAHKAN KE SINI AGAR MELAYANG DI ATAS SEGALANYA --- */}
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        containerStyle={{ zIndex: 999999 }} 
      />

    </div>
  );
}