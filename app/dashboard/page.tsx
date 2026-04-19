// app/dashboard/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';

export default function DashboardOverview() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 font-sans selection:bg-slate-200 selection:text-slate-900 pb-32">
      
      {/* INJEKSI CSS UNTUK ANIMASI STAGGERED & FONT */}
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
          <p className="text-sm font-medium text-slate-500">Ringkasan performa portofolio Anda selama 30 hari terakhir.</p>
        </div>
        <Link href="/dashboard/projects" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-extrabold uppercase tracking-widest rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm w-max">
            <i className="fas fa-plus text-[10px]"></i> New Project
        </Link>
      </div>

      {/* 4 STAT CARDS - BUG TERPOTONG DIPERBAIKI DENGAN MIN-HEIGHT & FLEX-COL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-10">
        
        {/* CARD 1: Total Views */}
        <div className="bg-white p-6 md:p-7 flex flex-col justify-between min-h-[160px] rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group animate-enter" style={{animationDelay: '100ms'}}>
          <div className="absolute top-0 left-0 w-full h-[2px] bg-transparent group-hover:bg-[#ff9e00] transition-colors duration-500"></div>
          
          <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">Total Views</p>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100 transition-colors shrink-0">
                  <i className="fas fa-eye text-xs"></i>
              </div>
          </div>
          
          <div className="flex items-end justify-between mt-auto">
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">1.2k</h3>
            <span className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-extrabold flex items-center gap-1 border border-slate-100">
                <i className="fas fa-arrow-up text-[8px]"></i> 12%
            </span>
          </div>
        </div>

        {/* CARD 2: Project Clicks */}
        <div className="bg-white p-6 md:p-7 flex flex-col justify-between min-h-[160px] rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group animate-enter" style={{animationDelay: '150ms'}}>
          <div className="absolute top-0 left-0 w-full h-[2px] bg-transparent group-hover:bg-[#ff9e00] transition-colors duration-500"></div>
          
          <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">Project Clicks</p>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100 transition-colors shrink-0">
                  <i className="fas fa-mouse-pointer text-xs"></i>
              </div>
          </div>
          
          <div className="flex items-end justify-between mt-auto">
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">482</h3>
            <span className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-extrabold flex items-center gap-1 border border-slate-100">
                <i className="fas fa-arrow-up text-[8px]"></i> 5%
            </span>
          </div>
        </div>

        {/* CARD 3: Contact Leads */}
        <div className="bg-white p-6 md:p-7 flex flex-col justify-between min-h-[160px] rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group animate-enter" style={{animationDelay: '200ms'}}>
          <div className="absolute top-0 left-0 w-full h-[2px] bg-transparent group-hover:bg-[#ff9e00] transition-colors duration-500"></div>
          
          <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">Contact Leads</p>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100 transition-colors shrink-0">
                  <i className="fas fa-envelope text-xs"></i>
              </div>
          </div>
          
          <div className="flex items-end justify-between mt-auto">
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">14</h3>
            <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                New
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
            <h3 className="text-[22px] md:text-2xl font-black text-slate-900 tracking-tight leading-none truncate group-hover:text-[#ff9e00] transition-colors">
                The Boutique
            </h3>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] animate-enter" style={{animationDelay: '300ms'}}>
        
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Activity</h3>
          <button className="text-xs font-extrabold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors group flex items-center gap-1">
              View All <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>
        
        <div className="space-y-3">
          {/* Row 1 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group cursor-default border border-transparent hover:border-slate-100">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-slate-900 transition-all shadow-sm group-hover:shadow">
                <i className="fas fa-cloud-upload-alt text-sm"></i>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-slate-900 truncate">Berhasil upload aset <span className="text-[#ff9e00] font-black">"Nike Commercial 2025"</span></p>
                <p className="text-xs font-medium text-slate-400 mt-1">2 jam yang lalu</p>
            </div>
          </div>
          
          {/* Row 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group cursor-default border border-transparent hover:border-slate-100">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-slate-900 transition-all shadow-sm group-hover:shadow">
                <i className="fas fa-palette text-sm"></i>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-slate-900 truncate">Mengganti tema portofolio ke <span className="text-[#ff9e00] font-black">"The Boutique"</span></p>
                <p className="text-xs font-medium text-slate-400 mt-1">Kemarin, 14:20</p>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group cursor-default border border-transparent hover:border-slate-100">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-slate-900 transition-all shadow-sm group-hover:shadow">
                <i className="fas fa-link text-sm"></i>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-slate-900 truncate">Menambahkan tautan <span className="text-[#ff9e00] font-black">Instagram</span> ke profil</p>
                <p className="text-xs font-medium text-slate-400 mt-1">3 hari yang lalu</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}