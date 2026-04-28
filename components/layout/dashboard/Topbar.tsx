"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import GlobalSearch from "@/components/GlobalSearch";
import { NotificationItem } from '@/hooks/useDashboardLayout';

interface TopbarProps {
  isLoading: boolean;
  userName: string;
  userEmail: string;
  userPlan: string;
  userAvatar: string;
  alertCount: number;
  notifications: NotificationItem[];
  onToggleSidebar: () => void;
}

export function Topbar({
  isLoading,
  userName,
  userEmail,
  userPlan,
  userAvatar,
  alertCount,
  notifications,
  onToggleSidebar
}: TopbarProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) setIsProfileMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem("hasSeenWelcomePromo");
    }
    signOut({ redirect: true, callbackUrl: '/login' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-[88px] w-full bg-white/60 backdrop-blur-xl border-b border-slate-100/50 flex items-center justify-between px-6 sm:px-10 shrink-0 animate-page-load delay-100">
        <div className="flex items-center gap-6 flex-1">
          <button className="md:hidden w-11 h-11 rounded-full border border-slate-200 bg-white/80 text-slate-600 hover:text-slate-900 active:scale-90 transition-all flex items-center justify-center shadow-sm" onClick={onToggleSidebar}>
            <i className="fas fa-bars text-sm"></i>
          </button>
          <GlobalSearch />
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
                  <Link href="/support" className="px-5 py-3 text-[13px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-3" onClick={() => setIsProfileMenuOpen(false)}>
                    <i className="fas fa-headset w-5 text-center text-slate-400"></i> Pusat Bantuan
                  </Link>
                  {userPlan !== 'PRO' && (
                    <Link href="/pricing" className="px-5 py-3 text-[13px] font-bold text-[#ff9e00] hover:bg-[#ff9e00]/10 transition-colors flex items-center gap-3 mt-1" onClick={() => setIsProfileMenuOpen(false)}>
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

      {/* LOGOUT MODAL */}
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
    </>
  );
}
