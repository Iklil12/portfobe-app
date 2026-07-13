"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import GlobalSearch from "@/components/GlobalSearch";
import { NotificationItem } from '@/features/dashboard';
import LanguageSwitcherPrivate from '@/components/ui/LanguageSwitcherPrivate';
import {
  Menu,
  Bell,
  BellOff,
  Gift,
  ExternalLink,
  User as UserIcon,
  Settings as SettingsIcon,
  HelpCircle,
  TrendingUp,
  LogOut,
  X,
  Crown
} from 'lucide-react';

interface TopbarProps {
  isLoading: boolean;
  userName: string;
  userEmail: string;
  userPlan: string;
  userAvatar: string;
  userSubdomain?: string;
  canClaimTrial?: boolean;
  alertCount: number;
  notifications: NotificationItem[];
  onToggleSidebar: () => void;
  onToggleDesktopSidebar?: () => void;
}

export function Topbar({
  isLoading,
  userName,
  userEmail,
  userPlan,
  userAvatar,
  userSubdomain,
  canClaimTrial,
  alertCount,
  notifications,
  onToggleSidebar,
  onToggleDesktopSidebar
}: TopbarProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const t = useTranslations('DashboardTopbar');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) setIsProfileMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
    };

    const handleTourOpen = () => setIsProfileMenuOpen(true);
    const handleTourClose = () => setIsProfileMenuOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("tour-open-profile", handleTourOpen);
    window.addEventListener("tour-close-profile", handleTourClose);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("tour-open-profile", handleTourOpen);
      window.removeEventListener("tour-close-profile", handleTourClose);
    };
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
      <header className="sticky top-0 z-40 h-[72px] w-full bg-[#111111]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 sm:px-10 shrink-0 animate-page-load delay-100">
        <div className="flex items-center md:flex-1">
          <button className="md:hidden w-11 h-11 rounded-md border border-white/10 bg-zinc-900 text-white/70 hover:text-white active:scale-95 transition-all flex items-center justify-center shadow-sm" onClick={onToggleSidebar}>
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="hidden md:flex justify-center flex-[2] max-w-[600px]">
          <GlobalSearch />
        </div>

        <div className="flex items-center justify-end gap-4 sm:gap-6 md:flex-1">
          <LanguageSwitcherPrivate />
          {!isLoading && (
            <>
              {canClaimTrial && (
                <Link href="/dashboard/billing" className="flex items-center justify-center gap-2 px-4 py-2 border border-[#ff9e00]/30 bg-[#ff9e00]/10 text-[#ff9e00] rounded-md text-[10px] font-sans font-medium hover:bg-[#ff9e00]/20 hover:scale-105 active:scale-95 transition-all" title={t('claimTrial')}>
                  <Gift className="w-4 h-4 animate-pulse" />
                  <span className="hidden sm:inline">{t('claimTrial')}</span>
                </Link>
              )}

              <div className="relative" ref={notifRef}>
                <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative w-11 h-11 text-white/60 hover:text-white active:scale-95 transition-colors flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                  {alertCount > 0 && <span className="absolute top-2.5 right-3.5 w-2 h-2 bg-[#ff9e00] rounded-full animate-pulse"></span>}
                </button>

                {isNotifOpen && (
                  <div className="absolute top-[calc(100%+12px)] right-[-60px] md:right-0 w-[320px] bg-zinc-950 rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 py-2 animate-dropdown z-50">
                    <div className="px-4 py-3 border-b border-white/10 mb-1 flex justify-between items-center">
                      <p className="text-[10px] font-sans font-medium text-white">{t('infoCenter')}</p>
                      {alertCount > 0 && (
                        <span className="text-[9px] px-2 py-0.5 bg-[#ff9e00]/10 border border-[#ff9e00]/20 text-[#ff9e00] font-sans font-medium">
                          {alertCount} Info
                        </span>
                      )}
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto px-2 hide-scrollbar flex flex-col gap-1">
                      {notifications.length === 0 ? (
                        <div className="px-5 py-8 text-center text-white/60">
                          <BellOff className="w-8 h-8 mx-auto mb-2 opacity-20" />
                          <p className="text-xs font-sans font-medium">{t('noNotif')}</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <Link key={notif.id} href={notif.link} onClick={() => setIsNotifOpen(false)} className="p-3 hover:bg-white/5 rounded-md transition-colors flex items-start gap-3 group border border-transparent hover:border-white/5">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 border ${notif.type === 'critical' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/10 text-white/80'}`}>
                              <Bell className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 pt-0.5">
                              <p className={`text-xs font-medium mb-1 ${notif.type === 'critical' ? 'text-red-400' : 'text-white'}`}>{notif.title}</p>
                              <p className="text-[11px] text-white/50 font-sans leading-relaxed">{notif.desc}</p>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="relative" ref={profileMenuRef}>
            {isLoading ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end gap-2">
                  <div className="h-3 w-24 skeleton-premium rounded-md"></div>
                  <div className="h-2 w-16 skeleton-premium rounded-md"></div>
                </div>
                <div className="w-10 h-10 rounded-full skeleton-premium border border-white/5"></div>
              </div>
            ) : (
              <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-sans font-medium text-white tracking-wide group-hover:text-[#ff9e00] transition-colors uppercase">{userName}</p>
                  <p className={`text-[9px] font-sans font-bold mt-0.5 tracking-wider text-[#ff9e00]`}>{userPlan} PLAN</p>
                </div>
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105 border-[2px] border-[#ff9e00] shadow-[0_0_15px_rgba(255,158,0,0.4)]`}>
                    <img src={userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=18181b&color=ffffff&bold=true`} className="w-full h-full object-cover" alt="Profile" />
                  </div>
                  {userPlan !== 'FREE' && (
                    <div className={`absolute -bottom-1 -right-1 border-2 border-black rounded-full shadow-sm z-10 w-4 h-4 flex items-center justify-center bg-[#ff9e00] text-black`}>
                      <Crown className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={`absolute top-[calc(100%+16px)] right-0 w-[280px] bg-zinc-950 rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 py-2 z-50 transition-all duration-200 ${isProfileMenuOpen && !isLoading ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'}`}>
              {/* Header Profile */}
              <div className="px-4 py-3 flex items-center gap-3 border-b border-white/10 mb-1">
                <div className="relative shrink-0">
                  {userAvatar ? (
                    <img src={userAvatar} alt="Avatar" className="w-10 h-10 object-cover border border-white/10" />
                  ) : (
                    <div className="w-10 h-10 bg-zinc-900 flex items-center justify-center text-white font-sans font-medium border border-white/10">
                      {userName ? userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-black rounded-full"></div>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <p className="text-xs font-sans font-medium text-white truncate">{userName || "User"}</p>
                  <p className="text-[10px] font-sans text-white/50 truncate">{userEmail}</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col px-2">
                {/* Lihat Web */}
                {userSubdomain ? (
                  <a
                    id="tour-preview-btn"
                    href={`/${userSubdomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group px-3 py-2.5 text-[11px] font-sans font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors flex items-center gap-3"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-[#ff9e00] transition-colors" />
                    <span className="flex-1">{t('viewSite')}</span>
                  </a>
                ) : (
                  <div id="tour-preview-btn" className="px-3 py-2.5 text-[11px] font-sans font-medium text-white/20 flex items-center gap-3 cursor-not-allowed" title={t('setSubdomain')}>
                    <ExternalLink className="w-4 h-4" />
                    <span className="flex-1">{t('viewSite')}</span>
                  </div>
                )}
                <div className="h-px bg-white/10 my-1 mx-2"></div>

                <Link href="/dashboard/profile" className="px-3 py-2.5 text-[11px] font-sans font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors flex items-center gap-3" onClick={() => setIsProfileMenuOpen(false)}>
                  <UserIcon className="w-4 h-4 text-white/60" />
                  <span className="flex-1">{t('editProfile')}</span>
                </Link>

                <Link href="/dashboard/settings" className="px-3 py-2.5 text-[11px] font-sans font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors flex items-center gap-3" onClick={() => setIsProfileMenuOpen(false)}>
                  <SettingsIcon className="w-4 h-4 text-white/60" />
                  <span className="flex-1">{t('settings')}</span>
                </Link>

                <div className="h-px bg-white/10 my-1 mx-2"></div>

                <Link href="/support" className="px-3 py-2.5 text-[11px] font-sans font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors flex items-center gap-3" onClick={() => setIsProfileMenuOpen(false)}>
                  <HelpCircle className="w-4 h-4 text-white/60" />
                  <span className="flex-1">{t('helpCenter')}</span>
                </Link>

                {userPlan === 'FREE' && (
                  <Link href="/pricing" className="px-3 py-2.5 text-[11px] font-sans font-medium text-[#ff9e00] hover:bg-[#ff9e00]/10 border border-[#ff9e00]/20 rounded-md transition-colors flex items-center gap-3 mt-1" onClick={() => setIsProfileMenuOpen(false)}>
                    <TrendingUp className="w-4 h-4" />
                    <span className="flex-1">{t('upgradePro')}</span>
                  </Link>
                )}
              </div>

              <div className="h-px bg-white/10 mt-2 mb-3"></div>

              {/* Sign Out Button */}
              <div className="px-4 pb-2">
                <button onClick={() => { setIsProfileMenuOpen(false); setShowLogoutModal(true); }} className="w-full px-4 py-2.5 text-[11px] font-sans font-medium text-white border border-white/10 rounded-md hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <LogOut className="w-4 h-4 text-white/60" /> {t('logout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* LOGOUT MODAL */}
      {showLogoutModal && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300" onClick={() => !isLoggingOut && setShowLogoutModal(false)}></div>

          <div className="relative z-10 w-full max-w-[340px] md:max-w-[400px] animate-enter-modal mx-auto">
            <div className="absolute inset-[-12px] bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-md shadow-2xl"></div>

            <div className="relative bg-zinc-950 border border-white/15 p-6 md:p-8 flex flex-col text-center rounded-md">

              <button onClick={() => !isLoggingOut && setShowLogoutModal(false)} className="absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>

              <div className="relative flex items-center justify-center mx-auto mb-4 w-12 h-12">
                <div className="absolute inset-0 bg-[#ff9e00]/20 rounded-full animate-ping opacity-60"></div>
                <div className="absolute inset-1.5 bg-[#ff9e00]/10 rounded-full"></div>
                <div className="relative w-6 h-6 bg-[#ff9e00] text-black rounded-full flex items-center justify-center shadow-md">
                  <LogOut className="w-3.5 h-3.5" />
                </div>
              </div>

              <h3 className="text-lg font-sans font-medium text-white mb-2 tracking-wide">{t('logoutConfirm')}</h3>
              <p className="text-xs font-sans text-white/50 mb-6 leading-relaxed px-1">
                {t('logoutDesc')}
              </p>

              <div className="flex flex-row gap-3 w-full">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 py-3 bg-[#ff9e00] hover:bg-[#ffaa22] rounded-md font-sans font-medium text-black active:scale-95 transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
                >
                  {isLoggingOut ? t('loading') : t('logout')}
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
                  className="flex-1 py-3 bg-transparent border border-white/10 hover:bg-white/5 text-white rounded-md font-sans font-medium active:scale-95 transition-all text-xs disabled:opacity-50"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
