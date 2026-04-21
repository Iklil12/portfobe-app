// app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Helper untuk format waktu (misal: "2 jam yang lalu")
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

// Helper untuk Ikon berdasarkan actionType
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
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  // --- STATE BARU UNTUK STATISTIK DARI DATABASE ---
  const [stats, setStats] = useState({
    projects: 0,
    awards: 0,
    links: 0,
    themeName: 'Loading...'
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    // Fetch History Aktivitas
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/activity');
        if (res.ok) {
          const data = await res.json();
          setActivities(data);
        }
      } catch (error) {
        console.error("Gagal memuat aktivitas", error);
      } finally {
        setIsLoadingActivities(false);
      }
    };

    // Fetch Statistik Database Real-time
    const fetchStats = async () => {
      try {
        // Tarik data dari semua tabel secara bersamaan (Paralel) agar ngebut
        const [appRes, projRes, certRes, linkRes] = await Promise.all([
          fetch('/api/appearance').catch(() => null),
          fetch('/api/projects').catch(() => null),
          fetch('/api/certificates').catch(() => null),
          fetch('/api/links').catch(() => null)
        ]);

        const appData = appRes?.ok ? await appRes.json() : {};
        const projData = projRes?.ok ? await projRes.json() : [];
        const certData = certRes?.ok ? await certRes.json() : [];
        const linkData = linkRes?.ok ? await linkRes.json() : [];

        // Terjemahkan ID Tema ke Nama Cantik
        let tName = "Neo Brutalism";
        if (appData?.themeTemplate === 'minimalist') tName = "Minimalist Clean";
        if (appData?.themeTemplate === 'elegant') tName = "Elegant Serif";

        setStats({
          projects: Array.isArray(projData) ? projData.length : 0,
          awards: Array.isArray(certData) ? certData.length : 0,
          links: Array.isArray(linkData) ? linkData.length : 0,
          themeName: tName
        });
      } catch (error) {
        console.error("Gagal memuat statistik", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchActivities();
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 font-sans selection:bg-slate-200 selection:text-slate-900 pb-32">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { 
            opacity: 0; 
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
      `}} />

      {/* HEADER OVERVIEW */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-enter">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            Overview.
          </h1>
          <p className="text-sm font-medium text-slate-500">Ringkasan performa dan data portofolio Anda saat ini.</p>
        </div>
        <Link href="/dashboard/projects" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-extrabold uppercase tracking-widest rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm w-max">
            <i className="fas fa-plus text-[10px]"></i> New Project
        </Link>
      </div>

      {/* 4 STAT CARDS (SEKARANG DINAMIS DARI DATABASE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-10">
        
        {/* CARD 1: Total Proyek */}
        <div className="bg-white p-6 md:p-7 flex flex-col justify-between min-h-[160px] rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group animate-enter" style={{animationDelay: '100ms'}}>
          <div className="absolute top-0 left-0 w-full h-[2px] bg-transparent group-hover:bg-[#ff9e00] transition-colors duration-500"></div>
          <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">Total Proyek</p>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100 transition-colors shrink-0">
                  <i className="fas fa-folder-open text-xs"></i>
              </div>
          </div>
          <div className="flex items-end justify-between mt-auto">
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
              {isLoadingStats ? '-' : stats.projects}
            </h3>
            <span className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-extrabold flex items-center gap-1 border border-slate-100">
                <i className="fas fa-database text-[8px] text-[#ff9e00]"></i> Tersimpan
            </span>
          </div>
        </div>

        {/* CARD 2: Penghargaan */}
        <div className="bg-white p-6 md:p-7 flex flex-col justify-between min-h-[160px] rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group animate-enter" style={{animationDelay: '150ms'}}>
          <div className="absolute top-0 left-0 w-full h-[2px] bg-transparent group-hover:bg-[#ff9e00] transition-colors duration-500"></div>
          <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">Penghargaan</p>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100 transition-colors shrink-0">
                  <i className="fas fa-award text-xs"></i>
              </div>
          </div>
          <div className="flex items-end justify-between mt-auto">
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
              {isLoadingStats ? '-' : stats.awards}
            </h3>
            <span className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-extrabold flex items-center gap-1 border border-slate-100">
                <i className="fas fa-check-circle text-[8px] text-emerald-500"></i> Diverifikasi
            </span>
          </div>
        </div>

        {/* CARD 3: Tautan Eksternal */}
        <div className="bg-white p-6 md:p-7 flex flex-col justify-between min-h-[160px] rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group animate-enter" style={{animationDelay: '200ms'}}>
          <div className="absolute top-0 left-0 w-full h-[2px] bg-transparent group-hover:bg-[#ff9e00] transition-colors duration-500"></div>
          <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">Tautan Publik</p>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100 transition-colors shrink-0">
                  <i className="fas fa-link text-xs"></i>
              </div>
          </div>
          <div className="flex items-end justify-between mt-auto">
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
              {isLoadingStats ? '-' : stats.links}
            </h3>
            <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                Aktif
            </span>
          </div>
        </div>

        {/* CARD 4: Active Theme */}
        <div className="bg-white p-6 md:p-7 flex flex-col justify-between min-h-[160px] rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group animate-enter" style={{animationDelay: '250ms'}}>
          <div className="absolute top-0 left-0 w-full h-[2px] bg-transparent group-hover:bg-[#ff9e00] transition-colors duration-500"></div>
          <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse relative before:absolute before:inset-0 before:bg-emerald-500 before:rounded-full before:animate-ping"></span>
                  Active Theme
              </p>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100 transition-colors shrink-0">
                  <i className="fas fa-swatchbook text-xs"></i>
              </div>
          </div>
          <div className="flex items-end justify-between mt-auto">
            <h3 className="text-[20px] md:text-xl font-black text-slate-900 tracking-tight leading-none truncate group-hover:text-[#ff9e00] transition-colors">
                {isLoadingStats ? 'Memuat...' : stats.themeName}
            </h3>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY (DINAMIS DARI DATABASE) */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] animate-enter" style={{animationDelay: '300ms'}}>
        
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Activity</h3>
          <Link href="/dashboard/history" className="text-xs font-extrabold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors group flex items-center gap-1">
            View All <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
        </Link>
        </div>
        
        <div className="space-y-3">
          {isLoadingActivities ? (
             [1,2,3].map(i => (
                <div key={i} className="flex gap-4 p-4">
                   <div className="w-12 h-12 rounded-2xl bg-slate-50 animate-pulse shrink-0"></div>
                   <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-slate-50 rounded animate-pulse w-1/4"></div>
                   </div>
                </div>
             ))
          ) : activities.length === 0 ? (
             <div className="text-center py-10">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <i className="fas fa-history text-xl"></i>
               </div>
               <p className="text-slate-500 font-medium text-sm">Belum ada aktivitas yang terekam.</p>
             </div>
          ) : (
            activities.map((activity, index) => (
              <div 
                key={activity.id} 
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group cursor-default border border-transparent hover:border-slate-100 animate-enter"
                style={{animationDelay: `${index * 80}ms`}}
              >
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-slate-900 transition-all shadow-sm group-hover:shadow">
                    <i className={`fas ${getActivityIcon(activity.actionType)} text-sm`}></i>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-slate-900 truncate">
                      {activity.details.split(/"|'/).map((part: string, i: number) => 
                         i % 2 === 0 ? part : <span key={i} className="text-[#ff9e00] font-black">"{part}"</span>
                      )}
                    </p>
                    <p className="text-xs font-medium text-slate-400 mt-1">{timeAgo(activity.createdAt)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}