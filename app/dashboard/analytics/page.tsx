"use client";

import React, { useState, useEffect } from 'react';
import { showToast } from '@/lib/customToast'; // Import fungsi popup sakti kita

export default function AnalyticsPage() {
  // State untuk memicu animasi progress bar saat halaman selesai dimuat
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Memberikan jeda sedikit sebelum animasi berjalan agar transisinya terlihat mulus
    const timer = setTimeout(() => setIsMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // --- MENGGUNAKAN UTILITY showToast ---
  const handleComingSoon = () => {
    showToast({
      message: "Analitik mendalam sedang dalam tahap akhir pengembangan!",
      id: "analytics-coming-soon-toast", // ID unik Anti-Spam
      icon: "fa-chart-line" // Menggunakan icon grafik fontawesome
    });
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-10 font-sans selection:bg-slate-200 selection:text-slate-900 pb-32">
      
      {/* INJEKSI CSS UNTUK ANIMASI & FONT */}
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

      {/* HEADER SECTION (Sesuai Referensi Gambar) */}
      <div className="mb-14 animate-enter text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
          Audience <span className="font-light text-slate-400">Metrics.</span>
        </h1>
        <p className="text-sm font-medium text-slate-500">Pantau performa, jangkauan, dan interaksi portofolio Anda secara real-time.</p>
      </div>

      {/* STATS OVERVIEW (4 Cards - Persis seperti Referensi Gambar) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        {[
            { label: 'Total Views', val: '1.2k', up: '+ 12%', icon: 'fa-eye' },
            { label: 'Unique Visitors', val: '842', up: '+ 5%', icon: 'fa-user' },
            { label: 'Avg. Time', val: '2m 14s', up: '+ 18%', icon: 'fa-clock' },
            { label: 'Bounce Rate', val: '42%', up: '↓ 2%', icon: 'fa-sign-out-alt', isNegative: true },
        ].map((stat, i) => (
            <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300 animate-enter flex flex-col justify-between min-h-[140px] group" style={{animationDelay: `${i * 100}ms`}}>
                
                <div className="flex justify-between items-start mb-6">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                    {/* Ikon Bulat Abu-abu di Pojok Kanan Atas */}
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-100 group-hover:text-slate-600 transition-colors shrink-0">
                        <i className={`fas ${stat.icon} text-[10px]`}></i>
                    </div>
                </div>
                
                <div className="flex items-end justify-between mt-auto">
                    <h3 className="text-3xl md:text-[2.5rem] font-black text-slate-900 tracking-tighter leading-none">{stat.val}</h3>
                    {/* Badge Persentase */}
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 border ${stat.isNegative ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                        {stat.isNegative ? '' : <i className="fas fa-arrow-up text-[8px]"></i>} {stat.up}
                    </span>
                </div>
            </div>
        ))}
      </div>

      {/* CHARTS GRID (Data Visualization Monochrome) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-16">
        
        {/* TRAFFIC CHART (Interactive Bar Chart) */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.03)] transition-all animate-enter flex flex-col" style={{animationDelay: '400ms'}}>
          <div className="flex justify-between items-start mb-10">
            <div>
              <h4 className="font-extrabold text-lg text-slate-900 tracking-tight mb-1">Traffic Overview</h4>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">7 Hari Terakhir</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
              <i className="fas fa-chart-line text-sm"></i>
            </div>
          </div>
          
          <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 mt-auto pt-6">
            {[
              { day: 'SEN', h: '40%', v: '120' },
              { day: 'SEL', h: '60%', v: '180' },
              { day: 'RAB', h: '50%', v: '150' },
              { day: 'KAM', h: '90%', v: '300', active: true },
              { day: 'JUM', h: '70%', v: '210' },
              { day: 'SAB', h: '55%', v: '165' },
              { day: 'MIN', h: '65%', v: '195' },
            ].map((bar, i) => (
              <div key={i} className="flex flex-col items-center justify-end h-full w-full relative group cursor-crosshair">
                
                {/* Tooltip Hover */}
                <span className="absolute -top-10 bg-slate-900 text-white text-[11px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 font-bold z-10 pointer-events-none shadow-lg">
                  {bar.v}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                </span>
                
                {/* Bar Graph (Tinggi diset via inline style berdasarkan prop, dianimasikan jika isMounted) */}
                <div 
                  className={`w-full max-w-[48px] rounded-t-xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${bar.active ? 'bg-[#0f172a] shadow-md' : 'bg-slate-100 group-hover:bg-[#ff9e00] group-hover:shadow-[0_10px_20px_rgba(255,158,0,0.2)]'}`}
                  style={{ 
                    height: isMounted ? bar.h : '0%',
                    transitionDelay: `${i * 50}ms`
                  }}
                ></div>
                
                {/* Axis Label */}
                <span className={`text-[9px] font-extrabold uppercase tracking-widest mt-4 transition-colors ${bar.active ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-900'}`}>
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SOURCES CHART (Progress Bars) - BUG DIPERBAIKI */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.03)] transition-all animate-enter flex flex-col" style={{animationDelay: '500ms'}}>
          <div className="flex justify-between items-start mb-10">
            <div>
              <h4 className="font-extrabold text-lg text-slate-900 tracking-tight mb-1">Top Sources</h4>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Darimana klien berasal</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
              <i className="fas fa-bullseye text-sm"></i>
            </div>
          </div>
          
          <div className="space-y-8 mt-auto">
            {[
              { name: 'Instagram', icon: 'fab fa-instagram', val: '58%' },
              { name: 'Direct Link', icon: 'fas fa-link', val: '24%' },
              { name: 'Google Search', icon: 'fab fa-google', val: '18%' },
            ].map((src, i) => (
              <div key={i} className="group/src cursor-default">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold flex items-center gap-3 text-slate-700 group-hover/src:text-slate-900 transition-colors">
                    {/* Monochrome Icons */}
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover/src:bg-white group-hover/src:border-slate-200 group-hover/src:text-slate-900 transition-all shrink-0">
                        <i className={`${src.icon} text-xs`}></i>
                    </div>
                    {src.name}
                  </span>
                  <span className="text-sm font-black text-slate-900">{src.val}</span>
                </div>
                
                {/* Progress Bar Track */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  {/* Progress Bar Fill - Menggunakan isMounted agar animasi berjalan mulus */}
                  <div 
                    className="bg-slate-900 h-full rounded-full transition-all ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/src:bg-[#ff9e00]" 
                    style={{ 
                      width: isMounted ? src.val : '0%',
                      transitionDuration: '1.5s',
                      transitionDelay: `${i * 150}ms`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION COMING SOON - PRO CREATOR DARK THEME */}
      <div 
        onClick={handleComingSoon}
        className="relative overflow-hidden bg-[#050505] p-10 md:p-16 rounded-[2.5rem] border border-slate-800 cursor-pointer group shadow-2xl animate-enter hover:border-slate-700 transition-all duration-500"
        style={{animationDelay: '600ms'}}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[200px] bg-[#ff9e00]/5 blur-[100px] rounded-full group-hover:bg-[#ff9e00]/10 transition-colors duration-700 pointer-events-none"></div>

        <div className="absolute top-0 right-10 p-8 opacity-[0.02] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
            <i className="fas fa-chart-pie text-[15rem]"></i>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 group-hover:text-white transition-colors">
              <i className="fas fa-crown text-[#ff9e00]"></i> Pro Feature
            </div>

            <h4 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Advanced <span className="font-light text-slate-500">Insights.</span></h4>
            
            <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed mb-10">
                Pahami audiens Anda lebih dalam. Dapatkan data geografis, peta panas (Heatmaps) dari pengunjung, dan pelacakan interaksi secara real-time.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-10">
                {['Real-time Tracking', 'Visitor Demographics', 'Click Heatmaps', 'Conversion Funnel'].map((tag, i) => (
                    <span key={tag} className="px-5 py-2 bg-[#111] text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-default" style={{animationDelay: `${i*100}ms`}}>
                        {tag}
                    </span>
                ))}
            </div>

            <div className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-lg group-hover:bg-slate-200 transition-all duration-300 active:scale-95">
                <i className="fas fa-lock text-slate-500"></i> Tersedia Segera
            </div>
        </div>
      </div>

    </main>
  );
}