"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// --- HELPER: FORMAT WAKTU (Tetap di luar agar bersih) ---
function timeAgo(dateParam: string | Date) {
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const today = new Date();
  const seconds = Math.round((today.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit yang lalu`;
  if (hours < 24) return `${hours} jam yang lalu`;
  if (days === 1) return 'Kemarin';
  if (days < 7) return `${days} hari yang lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

// --- HELPER: IKON AKTIVITAS ---
function getActivityIcon(actionType: string) {
  const iconMap: Record<string, string> = {
    'UPDATE_AVATAR': 'fa-camera',
    'UPDATE_PROFILE': 'fa-user-edit',
    'ADD_LINK': 'fa-link',
    'UPDATE_LINK': 'fa-link',
    'DELETE_LINK': 'fa-trash-alt', 
    'CHANGE_THEME': 'fa-palette',
    'UPLOAD_PROJECT': 'fa-cloud-upload-alt',
    'UPDATE_PROJECT': 'fa-edit',
  };
  if (iconMap[actionType]) return iconMap[actionType];
  if (actionType.includes('LINK')) return 'fa-link';
  if (actionType.includes('THEME')) return 'fa-palette';
  if (actionType.includes('PROJECT')) return 'fa-project-diagram';
  if (actionType.includes('CERTIFICATE')) return 'fa-award';
  return 'fa-check-circle';
}

export default function DashboardOverview() {
  // --- STATE DATA ---
  const [activities, setActivities] = useState<any[]>([]);
  const [subdomain, setSubdomain] = useState<string>(''); 
  const [stats, setStats] = useState({
    projects: 0,
    awards: 0,
    links: 0,
    themeName: 'Loading...'
  });

  // --- STATE LOADING (Untuk Efek Skeleton) ---
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, projRes, certRes, linkRes, actRes] = await Promise.all([
          fetch('/api/appearance').catch(() => null),
          fetch('/api/projects').catch(() => null),
          fetch('/api/certificates').catch(() => null),
          fetch('/api/links').catch(() => null),
          fetch('/api/activity').catch(() => null)
        ]);

        const appData = appRes?.ok ? await appRes.json() : {};
        const projData = projRes?.ok ? await projRes.json() : [];
        const certData = certRes?.ok ? await certRes.json() : [];
        const linkData = linkRes?.ok ? await linkRes.json() : [];
        const actData = actRes?.ok ? await actRes.json() : [];

        // FIX: Panggil data dari laci yang tepat sesuai skema baru
        if (appData?.profile?.subdomain) setSubdomain(appData.profile.subdomain);

        let tName = "Neo Brutalism";
        const currentTheme = appData?.siteAppearance?.themeTemplate;
        if (currentTheme === 'minimalist') tName = "Minimalist Clean";
        if (currentTheme === 'elegant') tName = "Elegant Serif";
        if (currentTheme === 'cinematic') tName = "Cinematic Dark";
        if (currentTheme === 'acid') tName = "Acid Punk";

        setStats({
          projects: Array.isArray(projData) ? projData.length : 0,
          awards: Array.isArray(certData) ? certData.length : 0,
          links: Array.isArray(linkData) ? linkData.length : 0,
          themeName: tName
        });

        setActivities(Array.isArray(actData) ? actData : []);
      } catch (error) {
        console.error("Gagal memuat data dashboard", error);
      } finally {
        setIsLoadingStats(false);
        setIsLoadingActivities(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] font-sans selection:bg-slate-200 selection:text-slate-900 pb-32 overflow-hidden">
      
      {/* INJEKSI ANIMASI, SKELETON PREMIUM, DAN BACKGROUND */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { 
            opacity: 0; 
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUpFade {
              0% { 
                  opacity: 0; 
                  transform: translateY(15px) scale(0.98); /* Mulai dari bawah & agak kecil */
                  filter: blur(4px); /* Efek blur halus saat muncul */
              }
              100% { 
                  opacity: 1; 
                  transform: translateY(0) scale(1); 
                  filter: blur(0);
              }
          }
            
        /* Background Grid Modern */
        .bg-grid {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
        }

        /* Animasi Muter Pelan untuk Ikon */
        .animate-spin-slow {
            animation: spin 8s linear infinite;
        }

        /* Shimmer Loading Effect (Lebih mewah dari sekadar kedap-kedip) */
        .shimmer {
            background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
      `}} />

      {/* ELEMEN DEKORASI BACKGROUND */}
      <div className="absolute inset-0 bg-grid pointer-events-none z-0 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff9e00]/5 rounded-full blur-[100px] pointer-events-none z-0 translate-x-1/3 -translate-y-1/4"></div>

      {/* KONTEN UTAMA (Dibungkus z-10 agar di atas background) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 relative z-10">

        {/* HEADER OVERVIEW (DENGAN ANIMASI & LOOPING ICON) */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-enter">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2 flex items-center gap-3">
              Overview. 
              {/* Looping Icon Bintang Oranye */}
              <i className="fas fa-certificate text-[#ff9e00] text-[1.2rem] md:text-[1.5rem] animate-spin-slow opacity-80"></i>
            </h1>
            <p className="text-sm font-medium text-slate-500">Ringkasan performa dan data portofolio Anda saat ini.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {subdomain && (
                <a 
                    href={`/${subdomain}`} 
                    target="_blank" 
                    rel="noreferrer"
                    // Tambahkan 'animate-enter' di sini agar munculnya halus
                    className="animate-enter group inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-full text-[11px] font-extrabold uppercase tracking-widest hover:border-slate-300 hover:bg-slate-50 transition-all duration-500 shadow-sm active:scale-95"
                >
                    <i className="fas fa-external-link-alt text-slate-400 group-hover:text-[#ff9e00] transition-colors"></i>
                    Lihat Portofolio
                </a>
            )}
            <Link 
                href="/dashboard/projects" 
                // Tambahkan juga di sini supaya seirama saat loading selesai
                className="animate-enter inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-[11px] font-extrabold uppercase tracking-widest rounded-full hover:bg-slate-800 transition-all active:scale-95 shadow-md"
                style={{ animationDelay: '100ms' }} // Beri sedikit delay agar bergantian
            >
                <i className="fas fa-plus text-[10px]"></i> New Project
            </Link>
        </div>
        </div>

        {/* STAT CARDS (DENGAN EFEK HOVER & TRANSISI) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-10">
          
          {/* CARD 1: Projects */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 animate-enter" style={{animationDelay: '100ms'}}>
            <div className="flex justify-between items-start mb-6">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Proyek</p>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><i className="fas fa-folder-open text-xs"></i></div>
            </div>
            <div className="flex items-end justify-between">
              {isLoadingStats ? (
                 <div className="w-16 h-10 shimmer rounded-lg"></div>
              ) : (
                 <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{stats.projects}</h3>
              )}
              <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-extrabold uppercase border border-slate-100">Live</span>
            </div>
          </div>

          {/* CARD 2: Awards */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 animate-enter" style={{animationDelay: '150ms'}}>
            <div className="flex justify-between items-start mb-6">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Penghargaan</p>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><i className="fas fa-award text-xs"></i></div>
            </div>
            <div className="flex items-end justify-between">
              {isLoadingStats ? (
                 <div className="w-16 h-10 shimmer rounded-lg"></div>
              ) : (
                 <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{stats.awards}</h3>
              )}
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-extrabold uppercase border border-emerald-100">Verified</span>
            </div>
          </div>

          {/* CARD 3: Links */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 animate-enter" style={{animationDelay: '200ms'}}>
            <div className="flex justify-between items-start mb-6">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Tautan Publik</p>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><i className="fas fa-link text-xs"></i></div>
            </div>
            <div className="flex items-end justify-between">
              {isLoadingStats ? (
                 <div className="w-16 h-10 shimmer rounded-lg"></div>
              ) : (
                 <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{stats.links}</h3>
              )}
              <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-extrabold uppercase shadow-sm">Aktif</span>
            </div>
          </div>

          {/* CARD 4: Active Theme (DENGAN ANIMASI PULSE) */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 animate-enter" style={{animationDelay: '250ms'}}>
            <div className="flex justify-between items-start mb-6">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 relative flex">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Active Theme
                </p>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><i className="fas fa-swatchbook text-xs"></i></div>
            </div>
            <div className="flex items-end justify-between">
              {isLoadingStats ? (
                 <div className="w-24 h-6 shimmer rounded-md mb-1"></div>
              ) : (
                 <h3 className="text-[15px] md:text-base font-black text-slate-900 tracking-tight leading-none truncate pr-2 uppercase italic">{stats.themeName}</h3>
              )}
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY SECTION (DENGAN PREMIUM SHIMMER LOADING) */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] animate-enter" style={{animationDelay: '300ms'}}>
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Activity</h3>
            <Link href="/dashboard/history" className="text-xs font-extrabold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors group flex items-center gap-1">
              View All <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>
          
          <div className="space-y-2">
            {isLoadingActivities ? (
                // SKELETON PREMIUM SHIMMER
                [1,2,3].map(i => (
                  <div key={i} className="flex gap-4 p-4 items-center">
                      <div className="w-12 h-12 rounded-2xl shimmer shrink-0"></div>
                      <div className="flex-1 space-y-2.5 py-1">
                        <div className="h-3.5 shimmer rounded-md w-3/4"></div>
                        <div className="h-2.5 shimmer rounded-md w-1/4"></div>
                      </div>
                  </div>
                ))
            ) : activities.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm font-medium">Belum ada aktivitas baru.</div>
            ) : (
              activities.map((activity, index) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all duration-300 group cursor-default border border-transparent hover:border-slate-100">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-900 shadow-sm transition-all group-hover:shadow group-hover:scale-105">
                      <i className={`fas ${getActivityIcon(activity.actionType)} text-sm`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {activity.details.split(/"|'/).map((part: string, i: number) => 
                            i % 2 === 0 ? part : <span key={i} className="text-[#ff9e00] font-black underline decoration-2 underline-offset-4">"{part}"</span>
                        )}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{timeAgo(activity.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}