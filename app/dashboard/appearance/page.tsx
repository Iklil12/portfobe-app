"use client";

import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import PortfolioView from '@/components/PortfolioView';
import Link from 'next/link';

// =======================================================================
// FASE 3: SKEMA KONFIGURASI TEMA (THEME CONFIGS)
// Mengatur menu apa saja yang boleh muncul di Editor untuk tiap tema
// =======================================================================
const THEME_CONFIGS: Record<string, any> = {
  brutalism: {
    showColors: true,
    showFonts: true,
    showCardStyle: true,
    showButtonShape: true,
  },
  minimalist: {
    showColors: false, // Tema minimalis murni hitam putih (monochrome)
    showFonts: true,
    showCardStyle: false, // Tidak pakai kartu bergaya
    showButtonShape: false, // Tombol diganti dengan teks garis bawah
  }
};

export default function AppearancePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  // --- STATE UNTUK DATA PROFIL ---
  const [fullName, setFullName] = useState("Nama Anda");
  const [profession, setProfession] = useState("Profesi / Bio Singkat");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [subdomain, setSubdomain] = useState(""); 
  const [isLive, setIsLive] = useState(true); 
  const [dbData, setDbData] = useState<any>({}); 

  // --- STATE UNTUK TEMA & PENGATURAN ---
  const [activeTheme, setActiveTheme] = useState("brutalism");
  const [themeColor, setThemeColor] = useState("#000000");
  const [fontHeading, setFontHeading] = useState("Space Mono");
  const [fontBody, setFontBody] = useState("Inter");
  const [buttonShape, setButtonShape] = useState("hard");
  const [cardStyle, setCardStyle] = useState("hard-shadow");
  const [splashScreen, setSplashScreen] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resApp = await fetch('/api/appearance');
        let appData: any = {};
        
        if (resApp.ok) {
          appData = await resApp.json();
          if (appData) {
            if (appData.fullName) setFullName(appData.fullName);
            if (appData.profession) setProfession(appData.profession);
            if (appData.avatarUrl) setAvatarUrl(appData.avatarUrl);
            if (appData.subdomain) setSubdomain(appData.subdomain);
            
            if (appData.isLive !== undefined) setIsLive(appData.isLive);
            if (appData.user && appData.user.isLive !== undefined) setIsLive(appData.user.isLive);

            if (appData.themeTemplate) setActiveTheme(appData.themeTemplate);
            if (appData.themeColor) setThemeColor(appData.themeColor);
            if (appData.fontHeading) setFontHeading(appData.fontHeading);
            if (appData.fontBody) setFontBody(appData.fontBody);
            if (appData.buttonShape) setButtonShape(appData.buttonShape);
            if (appData.cardStyle) setCardStyle(appData.cardStyle);
            
            if (appData.splashScreen !== undefined && appData.splashScreen !== null) {
              setSplashScreen(appData.splashScreen); 
            }
          }
        }

        const [projRes, certRes, linkRes] = await Promise.all([
          fetch('/api/projects').catch(() => null),
          fetch('/api/certificates').catch(() => null),
          fetch('/api/links').catch(() => null)
        ]);

        const projects = projRes?.ok ? await projRes.json() : [];
        const certificates = certRes?.ok ? await certRes.json() : [];
        const links = linkRes?.ok ? await linkRes.json() : [];

        setDbData({
          ...appData,
          projects: Array.isArray(projects) ? projects : [],
          certificates: Array.isArray(certificates) ? certificates : [],
          links: Array.isArray(links) ? links : []
        });

      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const saveDesign = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Menyimpan desain...');
    try {
      const res = await fetch('/api/appearance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          themeTemplate: activeTheme, 
          themeColor, 
          fontHeading, 
          fontBody, 
          buttonShape, 
          cardStyle,
          splashScreen 
        })
      });
      if (res.ok) {
        // --- OPSI PERINGATAN CERDAS JIKA WEB OFFLINE SAAT DISIMPAN ---
        if (!isLive) {
          toast.custom((t) => (
            <div className={`${t.visible ? 'animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300' : 'animate-out fade-out zoom-out-95 slide-out-to-top-4 duration-200'} max-w-sm w-full bg-[#0a0a0a] shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-white/10 rounded-[1.25rem] pointer-events-auto flex overflow-hidden font-sans ring-1 ring-white/5 backdrop-blur-xl`}>
              <div className="flex-1 p-5 relative overflow-hidden">
                
                {/* Efek Glow Halus di belakang toast */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>

                <div className="flex items-start gap-4 relative z-10">
                  {/* Ikon Premium */}
                  <div className="shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      <i className="fas fa-check text-emerald-400 text-[11px]"></i>
                    </div>
                  </div>
                  
                  {/* Teks & Tombol */}
                  <div className="flex-1">
                    <h3 className="text-[13px] font-bold text-white tracking-wide">
                      Desain Tersimpan.
                    </h3>
                    <p className="mt-1 text-[11px] text-slate-400 font-medium leading-relaxed">
                      Web Anda saat ini berstatus <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold mx-0.5"><i className="fas fa-lock text-[8px]"></i> Offline</span>. Pengunjung belum bisa melihat pembaruan ini.
                    </p>
                    
                    {/* Tombol Aksi Minimalis & Tajam */}
                    <div className="mt-4 flex gap-2">
                      <Link 
                        href="/dashboard/settings" 
                        onClick={() => toast.dismiss(t.id)} 
                        className="px-4 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-all active:scale-95 shadow-sm"
                      >
                        Aktifkan Web
                      </Link>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toast.remove(t.id);
                        }} 
                        className="px-4 py-2.5 bg-transparent border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-white/5 hover:text-white transition-all active:scale-95"
                      >
                        Nanti Saja
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ), { id: toastId, duration: 6000 });
        } else {
          // Toast sukses normal jika web sudah Live
          toast.success('Desain berhasil dipublikasikan!', { id: toastId });
        }
      } else {
        throw new Error('Gagal menyimpan');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan server.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  // LAYAR LOADING
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] animate-in fade-in duration-500">
        <style dangerouslySetInnerHTML={{__html: `@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');`}} />
        <div className="w-12 h-12 border-[3px] border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">Memuat Editor...</p>
      </div>
    );
  }

  const currentConfig = THEME_CONFIGS[activeTheme] || THEME_CONFIGS.brutalism;

  const livePreviewData = {
    ...dbData,
    fullName,
    profession,
    avatarUrl,
    subdomain,
    splashScreen
  };

  const livePreviewTheme = {
    themeTemplate: activeTheme, 
    themeColor, fontHeading, fontBody, buttonShape, cardStyle
  };

  const isFontMono = fontHeading?.toLowerCase().includes('space') || fontHeading?.toLowerCase().includes('mono');
  const isFontSerif = fontHeading?.toLowerCase().includes('serif') || fontHeading?.toLowerCase().includes('elegant') || fontHeading?.toLowerCase().includes('playfair');
  const isFontSans = !isFontMono && !isFontSerif;

  const isCardHard = cardStyle === 'hard-shadow' || cardStyle === 'hard';
  const isCardFlat = cardStyle === 'flat';
  const isCardSoft = cardStyle === 'soft-shadow' || cardStyle === 'soft';

  const isBtnHard = buttonShape === 'hard' || buttonShape === 'square';
  const isBtnRounded = buttonShape === 'rounded';
  const isBtnPill = buttonShape === 'pill';

  return (
    <main className="h-screen flex flex-col lg:flex-row bg-[#FAFAFA] font-sans lg:overflow-hidden animate-in fade-in duration-1000">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@700&display=swap');
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 10px; }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .7; transform: scale(0.95); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}} />

      <Toaster position="top-center" />

      {/* --- KIRI: PANEL EDITOR --- */}
      {/* Diperbaiki: Tinggi penuh di mobile, scroll mandiri, tidak ada batasan ketinggian */}
      <div className="w-full lg:w-5/12 h-full flex flex-col bg-white border-r border-slate-200 z-20 shadow-[0_10px_30px_rgba(0,0,0,0.05)] lg:shadow-none">
        
        <div className="p-5 md:p-8 border-b border-slate-100 bg-white sticky top-0 z-20 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 w-full">
            
            {/* BAGIAN KIRI HEADER */}
            <div className="flex flex-col items-start gap-2.5 animate-in fade-in slide-in-from-left-4 duration-500 w-full sm:w-auto">
              <div className="flex flex-wrap items-center justify-between sm:justify-start w-full gap-3">
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Desain <span className="font-light text-slate-400">& Tema</span></h1>
                
                {isLive ? (
                  // Jika Live: Hanya div biasa (Statis)
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 shrink-0 cursor-default">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap hidden sm:inline-block">Active</span>
                  </div>
                ) : (
                  // Jika Offline: Menjadi Link ke Pengaturan
                  <Link 
                    href="/dashboard/settings" 
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors shrink-0 group" 
                    title="Buka Pengaturan Web"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap flex items-center gap-1">
                      Aktifkan Web 
                      <i className="fas fa-chevron-right text-[7px] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"></i>
                    </span>
                  </Link>
                )}
              </div>
              
              {/* TOMBOL PILIH TEMA MINIMALIS */}
              <Link 
                href="/dashboard/themes" 
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm active:scale-95 group"
              >
                <i className="fas fa-paint-roller text-slate-800"></i> 
                {activeTheme === 'minimalist' ? 'Minimalist Clean' : 'Neo Brutalism'}
                <i className="fas fa-chevron-right text-[8px] text-slate-400 group-hover:translate-x-0.5 transition-transform"></i>
              </Link>
            </div>
            
            {/* BAGIAN KANAN HEADER (Tombol Aksi) */}
            <div className="flex gap-2 w-full sm:w-auto animate-in fade-in slide-in-from-right-4 duration-500 shrink-0">
              {subdomain && isLive && (
                 <a 
                   href={`/${subdomain}`} 
                   target="_blank" 
                   rel="noreferrer"
                   className="hidden sm:flex px-4 py-3 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors shadow-sm active:scale-95 items-center justify-center"
                   title="Buka Portofolio di Tab Baru"
                 >
                   <i className="fas fa-external-link-alt"></i>
                 </a>
              )}
              
              <button onClick={saveDesign} disabled={isSaving} className="w-full sm:w-auto px-6 py-3 sm:py-3 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.1)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                {isSaving ? 'Menyimpan' : 'Simpan'}
              </button>
            </div>

          </div>
        </div>

        {/* Diperbaiki: Memastikan flex-1 dan memunculkan padding bawah agar tombol akhir tidak terpotong */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-8 pb-32">
          
          {/* MENU 1: WARNA AKSEN */}
          {currentConfig.showColors && (
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-palette text-[10px]"></i></div>
                <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Warna Aksen</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {['#000000', '#0f172a', '#3b82f6', '#ef4444', '#10b981', '#f59e0b'].map(color => (
                  <button key={color} onClick={() => setThemeColor(color)} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${themeColor.toLowerCase() === color ? 'border-slate-900 scale-110 shadow-[0_0_20px_rgba(0,0,0,0.15)] ring-4 ring-slate-100' : 'border-transparent shadow-sm'}`} style={{ backgroundColor: color }} />
                ))}
                <label className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 cursor-pointer hover:border-slate-500 hover:scale-105 transition-all duration-300 overflow-hidden group">
                  <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="absolute inset-[-20px] w-20 h-20 opacity-0 cursor-pointer z-10" />
                  <i className="fas fa-plus text-xs group-hover:scale-110 transition-transform"></i>
                </label>
              </div>
              <div className="w-full h-px bg-slate-100 mt-10"></div>
            </div>
          )}

          {/* MENU 2: TIPOGRAFI FONT */}
          {currentConfig.showFonts && (
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-font text-[10px]"></i></div>
                <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Tipografi Font</h3>
              </div>
              <div className="flex p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200">
                <button onClick={() => {setFontHeading('Space Mono'); setFontBody('Space Mono')}} className={`flex-1 py-3 sm:py-3.5 rounded-xl text-xs font-bold transition-all duration-300 font-mono uppercase ${isFontMono ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}>Monospace</button>
                <button onClick={() => {setFontHeading('Inter'); setFontBody('Inter')}} className={`flex-1 py-3 sm:py-3.5 rounded-xl text-xs font-bold transition-all duration-300 font-sans ${isFontSans ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}>Modern Sans</button>
                <button onClick={() => {setFontHeading('serif'); setFontBody('serif')}} className={`flex-1 py-3 sm:py-3.5 rounded-xl text-xs font-bold transition-all duration-300 font-serif italic ${isFontSerif ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}>Elegant Serif</button>
              </div>
              <div className="w-full h-px bg-slate-100 mt-10"></div>
            </div>
          )}

          {/* MENU 3: GAYA KARTU PROYEK */}
          {currentConfig.showCardStyle && (
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-layer-group text-[10px]"></i></div>
                <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Gaya Kartu Proyek</h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4">
                <button onClick={() => setCardStyle('hard-shadow')} className={`group relative px-2 sm:px-4 py-4 sm:py-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isCardHard ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/20 sm:-translate-y-1' : 'bg-white border-slate-200 sm:hover:-translate-y-1 hover:shadow-md'}`}>
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md transition-all duration-300 shrink-0 ${isCardHard ? 'bg-white border-2 border-black shadow-[3px_3px_0px_0px_#1e293b]' : 'bg-slate-200 border border-slate-300 group-hover:shadow-[3px_3px_0px_0px_#cbd5e1]'}`}></div>
                  <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${isCardHard ? 'text-white' : 'text-slate-600'}`}>Neo Brutalism</span>
                </button>
                <button onClick={() => setCardStyle('flat')} className={`group relative px-2 sm:px-4 py-4 sm:py-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isCardFlat ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/20 sm:-translate-y-1' : 'bg-white border-slate-200 sm:hover:-translate-y-1 hover:shadow-md'}`}>
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md transition-all duration-300 shrink-0 ${isCardFlat ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200 group-hover:border-slate-400'}`}></div>
                  <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${isCardFlat ? 'text-white' : 'text-slate-600'}`}>Clean Flat</span>
                </button>
                <button onClick={() => setCardStyle('soft-shadow')} className={`group relative px-2 sm:px-4 py-4 sm:py-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isCardSoft ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/20 sm:-translate-y-1' : 'bg-white border-slate-200 sm:hover:-translate-y-1 hover:shadow-md'}`}>
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-xl transition-all duration-300 shrink-0 ${isCardSoft ? 'bg-white shadow-[0_4px_10px_rgba(255,255,255,0.3)]' : 'bg-white shadow-sm border border-slate-100 group-hover:shadow-md'}`}></div>
                  <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${isCardSoft ? 'text-white' : 'text-slate-600'}`}>Soft Shadow</span>
                </button>
              </div>
              <div className="w-full h-px bg-slate-100 mt-10"></div>
            </div>
          )}

          {/* MENU 4: BENTUK TOMBOL */}
          {currentConfig.showButtonShape && (
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[250ms]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-shapes text-[10px]"></i></div>
                <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Bentuk Elemen</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <button onClick={() => setButtonShape('hard')} className={`group relative px-2 py-4 sm:py-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isBtnHard ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/20 sm:-translate-y-1' : 'bg-white border-slate-200 hover:-translate-y-1 hover:shadow-md'}`}>
                  <div className={`w-8 h-4 transition-all duration-300 rounded-none ${isBtnHard ? 'bg-slate-500' : 'bg-slate-300 group-hover:bg-slate-400'}`}></div>
                  <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${isBtnHard ? 'text-white' : 'text-slate-600'}`}>Kotak Tajam</span>
                </button>
                <button onClick={() => setButtonShape('rounded')} className={`group relative px-2 py-4 sm:py-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isBtnRounded ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/20 sm:-translate-y-1' : 'bg-white border-slate-200 hover:-translate-y-1 hover:shadow-md'}`}>
                  <div className={`w-8 h-4 transition-all duration-300 rounded-md ${isBtnRounded ? 'bg-slate-500' : 'bg-slate-300 group-hover:bg-slate-400'}`}></div>
                  <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${isBtnRounded ? 'text-white' : 'text-slate-600'}`}>Melingkar</span>
                </button>
                <button onClick={() => setButtonShape('pill')} className={`group relative px-2 py-4 sm:py-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isBtnPill ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/20 sm:-translate-y-1' : 'bg-white border-slate-200 hover:-translate-y-1 hover:shadow-md'}`}>
                  <div className={`w-8 h-4 transition-all duration-300 rounded-full ${isBtnPill ? 'bg-slate-500' : 'bg-slate-300 group-hover:bg-slate-400'}`}></div>
                  <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${isBtnPill ? 'text-white' : 'text-slate-600'}`}>Kapsul</span>
                </button>
              </div>
              <div className="w-full h-px bg-slate-100 mt-10"></div>
            </div>
          )}

          {/* TOGGLE SPLASH SCREEN */}
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <div className="flex items-center justify-between border border-slate-200 p-4 sm:p-5 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer" onClick={() => setSplashScreen(!splashScreen)}>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm shrink-0"><i className="fas fa-film"></i></div>
                <div>
                  <h3 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-900 mb-0.5 sm:mb-1">Cinematic Intro</h3>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium leading-relaxed max-w-[200px]">Tampilkan animasi layar hitam sebelum portofolio terbuka.</p>
                </div>
              </div>
              <button 
                className={`w-12 sm:w-14 h-6 sm:h-7 rounded-full relative transition-colors duration-300 ease-in-out shrink-0 outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${splashScreen ? 'bg-slate-900' : 'bg-slate-300'}`}
                aria-pressed={splashScreen}
              >
                <div className={`w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-white absolute top-1 transition-all duration-300 ease-in-out shadow-sm ${splashScreen ? 'left-7 sm:left-8' : 'left-1'}`}></div>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* --- KANAN: LIVE PREVIEW --- */}
      <div className="hidden lg:flex w-full lg:w-7/12 h-full bg-[#F1F5F9] relative flex-col items-center justify-center p-4 sm:p-10 overflow-hidden gap-4 sm:gap-6 animate-in fade-in zoom-in-95 duration-700 z-10">
        
        {/* Toggle View Mode */}
        <div className="bg-white/90 backdrop-blur-md px-1.5 py-1.5 rounded-full border border-slate-200 flex items-center gap-1 z-30 shadow-[0_2px_15px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-top-4 duration-500 scale-90 sm:scale-100">
          <button onClick={() => setPreviewMode('desktop')} className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold transition-all flex items-center gap-2 ${previewMode === 'desktop' ? 'bg-slate-900 text-white shadow-md sm:scale-105' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}><i className="fas fa-desktop"></i> Desktop</button>
          <button onClick={() => setPreviewMode('mobile')} className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold transition-all flex items-center gap-2 ${previewMode === 'mobile' ? 'bg-slate-900 text-white shadow-md sm:scale-105' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}><i className="fas fa-mobile-alt text-sm"></i> Mobile</button>
        </div>

        <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className={`relative z-10 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden shrink-0 bg-[#F1F5F9]
          ${previewMode === 'desktop' 
            ? `w-full max-w-5xl h-full max-h-[90%] sm:max-h-[85vh] shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-2xl sm:rounded-[2rem] border border-slate-200/80` 
            : `w-[280px] sm:w-[360px] h-[550px] sm:h-[750px] max-h-[95%] sm:max-h-[80vh] border-[10px] sm:border-[12px] border-slate-900 rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.2)]`
          }
        `}>
          <div className="shrink-0 transition-all duration-700 z-20">
            {previewMode === 'desktop' ? (
              <div className="h-10 sm:h-12 flex items-center px-3 sm:px-4 gap-2 sm:gap-3 transition-all duration-700 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400"></div><div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400"></div><div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400"></div></div>
                <div className="mx-auto px-4 sm:px-6 py-1.5 bg-slate-100 text-[9px] sm:text-[10px] font-mono text-slate-500 rounded-md flex items-center gap-2 font-bold uppercase shadow-sm border border-slate-200/50 truncate max-w-[200px] sm:max-w-none">
                  <i className="fas fa-lock"></i>portfo.be/{subdomain || 'username'}
                </div>
              </div>
            ) : (
              <div className="h-6 sm:h-7 bg-white flex justify-center w-full relative transition-all duration-700"><div className="w-20 sm:w-28 h-5 sm:h-6 bg-slate-900 rounded-b-2xl sm:rounded-b-3xl"></div></div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar relative z-0 transition-all duration-700">
            <PortfolioView data={livePreviewData} theme={livePreviewTheme} isMobileView={previewMode === 'mobile'} />
          </div>
        </div>
      </div>
    </main>
  );
}