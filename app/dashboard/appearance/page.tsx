"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; 
import PortfolioView from '@/components/PortfolioView';
import Link from 'next/link';
import { showToast } from '@/lib/customToast'; 
import { mutate } from 'swr'; 

// =======================================================================
// FASE 3: SKEMA KONFIGURASI TEMA (THEME CONFIGS)
// =======================================================================
const THEME_CONFIGS: Record<string, any> = {
  brutalism: {
    showColors: true,
    showFonts: true,
    showCardStyle: true,
    showButtonShape: true,
  },
  minimalist: {
    showColors: false, 
    showFonts: true,
    showCardStyle: false, 
    showButtonShape: false, 
  }
};

export default function AppearancePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  // Fitur menyembunyikan panel editor
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);
  
  // --- STATE BARU: Untuk Pop-Up Konfirmasi Web Offline ---
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  
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
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    fetchData();
  }, []);

  const saveDesign = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Menyimpan desain...', {
        style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });
    
    try {
      const res = await fetch('/api/appearance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          themeTemplate: activeTheme, themeColor, fontHeading, fontBody, buttonShape, cardStyle, splashScreen 
        })
      });
      
      if (res.ok) {
        mutate('/api/layout-sync'); 
        toast.dismiss(toastId); // Hapus loading spinner

        if (!isLive) {
          // --- MUNCULKAN MODAL PREMIUM ALIH-ALIH TOAST KECIL ---
          setShowOfflineModal(true);
        } else {
          showToast({ message: 'Desain berhasil dipublikasikan!', id: toastId, icon: 'fa-check-circle' });
        }
      } else {
        throw new Error('Gagal menyimpan');
      }
    } catch (error) {
      showToast({ message: 'Terjadi kesalahan server.', id: toastId, icon: 'fa-exclamation-triangle' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#FAFAFA] animate-in fade-in duration-500 m-0 p-0 absolute inset-0 z-[999999]">
        <style dangerouslySetInnerHTML={{__html: `@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');`}} />
        <div className="w-10 h-10 border-[3px] border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest animate-pulse">Memuat Editor Canvas...</p>
      </div>
    );
  }

  const currentConfig = THEME_CONFIGS[activeTheme] || THEME_CONFIGS.brutalism;
  const livePreviewData = { ...dbData, fullName, profession, avatarUrl, subdomain, splashScreen };
  const livePreviewTheme = { themeTemplate: activeTheme, themeColor, fontHeading, fontBody, buttonShape, cardStyle };

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
    <main className="h-screen w-screen m-0 p-0 flex flex-col lg:flex-row bg-[#F8FAFC] font-sans overflow-hidden fixed inset-0 z-[99999]">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@700&display=swap');
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(15, 23, 42, 0.15); border-radius: 10px; }
        
        .bg-grid-slate {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
        }

        :global(body > aside),
        :global(body > header),
        :global(main.layout-content-wrapper > header) { display: none !important; }
        :global(main.layout-content-wrapper) { padding: 0 !important; margin: 0 !important; max-width: 100vw !important; }
      `}} />

      {/* ========================================================= */}
      {/* MODAL POP-UP WEB OFFLINE KELAS DUNIA                        */}
      {/* ========================================================= */}
      {showOfflineModal && (
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-500"
            onClick={() => setShowOfflineModal(false)}
          ></div>
          
          <div className="relative bg-white rounded-[2rem] p-8 md:p-10 max-w-sm w-full shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-100 animate-in zoom-in-95 fade-in duration-300 flex flex-col items-center text-center overflow-hidden">
            
            {/* Dekorasi Cahaya Belakang */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Ikon Warning */}
            <div className="w-16 h-16 bg-rose-50 border border-rose-100 shadow-inner text-rose-500 rounded-full flex items-center justify-center mb-6 relative">
              <i className="fas fa-eye-slash text-xl"></i>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
              Desain Disimpan.
            </h3>
            
            <p className="text-slate-500 mb-8 text-[13px] font-medium leading-relaxed">
              Namun, web portofolio Anda saat ini sedang berstatus <span className="font-bold text-rose-500">Offline</span>. Pengunjung publik belum bisa melihat perubahan terbaru Anda.
            </p>
            
            <div className="flex flex-col gap-3 w-full">
              <Link
                href="/dashboard/settings"
                className="w-full py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 transition-all text-xs uppercase tracking-widest shadow-[0_5px_15px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2"
              >
                <i className="fas fa-globe"></i> Aktifkan Web Sekarang
              </Link>
              <button
                onClick={() => setShowOfflineModal(false)}
                className="w-full py-4 rounded-xl font-bold text-slate-400 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-700 active:scale-95 transition-all text-xs uppercase tracking-widest"
              >
                Nanti Saja
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PANEL KIRI: EDITOR TATA LETAK --- */}
      <div className={`
        h-full flex flex-col bg-white/95 backdrop-blur-xl z-30 shadow-[5px_0_30px_rgba(0,0,0,0.04)] border-r border-slate-200/80
        transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 relative
        ${isEditorCollapsed ? 'w-0 opacity-0 pointer-events-none overflow-hidden border-none' : 'w-full lg:w-[420px] xl:w-[460px] opacity-100'}
      `}>
        
        {/* Header Panel Editor */}
        <div className="p-6 md:p-8 border-b border-slate-100 sticky top-0 z-20 shrink-0 bg-white/80 backdrop-blur-md">
          <div className="flex flex-col gap-5 w-full">
            
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                {/* TOMBOL KEMBALI KE DASHBOARD */}
                <Link 
                  href="/dashboard" 
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all active:scale-90"
                  title="Kembali ke Dashboard"
                >
                  <i className="fas fa-arrow-left text-[11px]"></i>
                </Link>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  Editor <i className="fas fa-magic text-slate-300 text-sm"></i>
                </h1>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Tombol Collapse Panel Editor */}
                <button 
                  onClick={() => setIsEditorCollapsed(true)}
                  className="hidden lg:flex w-8 h-8 rounded-full items-center justify-center bg-white border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-90 shadow-sm"
                  title="Sembunyikan Panel Editor"
                >
                  <i className="fas fa-chevron-left text-[11px]"></i>
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full pt-1">
              <button onClick={saveDesign} disabled={isSaving} className="flex-1 px-4 py-3.5 bg-slate-900 text-white rounded-xl text-[11px] font-extrabold uppercase tracking-widest hover:bg-slate-800 transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>

          </div>
        </div>

        {/* Konten Menu Editor */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 pb-32">
          
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-layer-group text-[10px]"></i></div>
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Basis Tema</h3>
              </div>
              <Link href="/dashboard/themes" className="text-[9px] font-bold text-[#ff9e00] hover:underline uppercase tracking-widest">Ubah Tema</Link>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
               <span className="font-bold text-slate-700 text-sm">{activeTheme === 'minimalist' ? 'Minimalist Clean' : 'Neo Brutalism'}</span>
               <i className="fas fa-check-circle text-emerald-500"></i>
            </div>
            <div className="w-full h-px bg-slate-100 mt-10"></div>
          </div>

          {currentConfig.showColors && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-palette text-[10px]"></i></div>
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Warna Aksen</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {['#000000', '#0f172a', '#475569', '#1e293b', '#2563eb', '#ff9e00'].map(color => (
                  <button key={color} onClick={() => setThemeColor(color)} className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${themeColor.toLowerCase() === color ? 'border-white scale-110 shadow-[0_0_15px_rgba(0,0,0,0.15)] ring-[3px] ring-slate-900' : 'border-transparent shadow-sm'}`} style={{ backgroundColor: color }} />
                ))}
                <label className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 cursor-pointer hover:border-slate-500 hover:text-slate-600 hover:scale-105 transition-all duration-300 overflow-hidden group">
                  <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="absolute inset-[-20px] w-20 h-20 opacity-0 cursor-pointer z-10" />
                  <i className="fas fa-plus text-[10px] group-hover:scale-110 transition-transform"></i>
                </label>
              </div>
              <div className="w-full h-px bg-slate-100 mt-10"></div>
            </div>
          )}

          {currentConfig.showFonts && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-font text-[10px]"></i></div>
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Tipografi Font</h3>
              </div>
              <div className="flex p-1 bg-slate-100/50 rounded-2xl border border-slate-200/60">
                <button onClick={() => {setFontHeading('Space Mono'); setFontBody('Space Mono')}} className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 font-mono uppercase tracking-wide ${isFontMono ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}>Monospace</button>
                <button onClick={() => {setFontHeading('Inter'); setFontBody('Inter')}} className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 font-sans ${isFontSans ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}>Modern Sans</button>
                <button onClick={() => {setFontHeading('serif'); setFontBody('serif')}} className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 font-serif italic ${isFontSerif ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}>Elegant Serif</button>
              </div>
              <div className="w-full h-px bg-slate-100 mt-10"></div>
            </div>
          )}

          {currentConfig.showCardStyle && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-border-all text-[10px]"></i></div>
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Gaya Kartu Proyek</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setCardStyle('hard-shadow')} className={`group relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isCardHard ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}>
                  <div className={`w-8 h-8 rounded-md transition-all duration-300 shrink-0 ${isCardHard ? 'bg-white border-2 border-slate-400 shadow-[3px_3px_0px_0px_#cbd5e1]' : 'bg-slate-100 border border-slate-300 group-hover:shadow-[3px_3px_0px_0px_#94a3b8]'}`}></div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isCardHard ? 'text-white' : 'text-slate-500'}`}>Brutalism</span>
                </button>
                <button onClick={() => setCardStyle('flat')} className={`group relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isCardFlat ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}>
                  <div className={`w-8 h-8 rounded-md transition-all duration-300 shrink-0 ${isCardFlat ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200 group-hover:border-slate-400'}`}></div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isCardFlat ? 'text-white' : 'text-slate-500'}`}>Clean Flat</span>
                </button>
                <button onClick={() => setCardStyle('soft-shadow')} className={`group relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isCardSoft ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}>
                  <div className={`w-8 h-8 rounded-xl transition-all duration-300 shrink-0 ${isCardSoft ? 'bg-white shadow-[0_4px_15px_rgba(255,255,255,0.2)]' : 'bg-white border border-slate-100 group-hover:shadow-md group-hover:border-slate-200'}`}></div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isCardSoft ? 'text-white' : 'text-slate-500'}`}>Soft Drop</span>
                </button>
              </div>
              <div className="w-full h-px bg-slate-100 mt-10"></div>
            </div>
          )}

          {currentConfig.showButtonShape && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-shapes text-[10px]"></i></div>
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Bentuk Elemen</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setButtonShape('hard')} className={`group relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isBtnHard ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}>
                  <div className={`w-8 h-4 transition-all duration-300 rounded-none ${isBtnHard ? 'bg-slate-500' : 'bg-slate-200 group-hover:bg-slate-400'}`}></div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isBtnHard ? 'text-white' : 'text-slate-500'}`}>Kotak</span>
                </button>
                <button onClick={() => setButtonShape('rounded')} className={`group relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isBtnRounded ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}>
                  <div className={`w-8 h-4 transition-all duration-300 rounded-md ${isBtnRounded ? 'bg-slate-500' : 'bg-slate-200 group-hover:bg-slate-400'}`}></div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isBtnRounded ? 'text-white' : 'text-slate-500'}`}>Melingkar</span>
                </button>
                <button onClick={() => setButtonShape('pill')} className={`group relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isBtnPill ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}>
                  <div className={`w-8 h-4 transition-all duration-300 rounded-full ${isBtnPill ? 'bg-slate-500' : 'bg-slate-200 group-hover:bg-slate-400'}`}></div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isBtnPill ? 'text-white' : 'text-slate-500'}`}>Kapsul</span>
                </button>
              </div>
              <div className="w-full h-px bg-slate-100 mt-10"></div>
            </div>
          )}

          {/* TOGGLE SPLASH SCREEN */}
          <div className="mb-10">
            <div className="flex items-center justify-between border border-slate-200 p-4 rounded-2xl bg-white hover:bg-slate-50 transition-colors shadow-sm cursor-pointer group" onClick={() => setSplashScreen(!splashScreen)}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center shrink-0 group-hover:text-slate-800 transition-colors"><i className="fas fa-film text-sm"></i></div>
                <div>
                  <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-900 mb-0.5">Cinematic Intro</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Animasi transisi saat web dibuka.</p>
                </div>
              </div>
              <button className={`w-12 h-6 rounded-full relative transition-colors duration-300 ease-in-out shrink-0 outline-none ${splashScreen ? 'bg-slate-900' : 'bg-slate-200'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300 shadow-sm ${splashScreen ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* --- KANAN: LIVE PREVIEW AREA --- */}
      <div className="flex-1 h-full relative flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] z-10">
        
        {/* Tombol Re-open (Muncul jika Editor Panel di-collapse) */}
        <div className={`absolute top-1/2 left-0 -translate-y-1/2 z-40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isEditorCollapsed ? 'translate-x-0' : '-translate-x-full'}`}>
          <button
            onClick={() => setIsEditorCollapsed(false)}
            className="w-7 h-20 bg-slate-900 border border-slate-800 border-l-0 rounded-r-2xl shadow-[5px_0_20px_rgba(0,0,0,0.15)] flex items-center justify-center text-slate-400 hover:text-white hover:w-9 transition-all active:scale-95"
            title="Tampilkan Panel Editor"
          >
            <i className="fas fa-chevron-right text-[11px]"></i>
          </button>
        </div>

        {/* Dekorasi Background Area Kanan */}
        <div className="absolute inset-0 bg-grid-slate pointer-events-none z-0"></div>

        {/* FLOATING ACTION BAR (Pusat Kendali Pratinjau) */}
        <div className="absolute top-6 z-40 flex items-center gap-3 transition-all duration-700">

          {/* Toggle View Mode */}
          <div className="bg-white/80 backdrop-blur-xl p-1.5 rounded-full border border-slate-200 flex items-center gap-1 shadow-[0_5px_20px_rgba(0,0,0,0.05)]">
            <button onClick={() => setPreviewMode('desktop')} className={`px-4 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all flex items-center gap-2 ${previewMode === 'desktop' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}><i className="fas fa-desktop text-[13px]"></i> Desktop</button>
            <button onClick={() => setPreviewMode('mobile')} className={`px-4 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all flex items-center gap-2 ${previewMode === 'mobile' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}><i className="fas fa-mobile-alt text-[13px]"></i> Mobile</button>
          </div>

          {/* Tombol Simpan Melayang (Otomatis Muncul jika Panel Disembunyikan) */}
          {isEditorCollapsed && (
            <button onClick={saveDesign} disabled={isSaving} className="hidden lg:flex px-6 py-2.5 bg-black text-white rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
              {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
              Simpan
            </button>
          )}

          {subdomain && isLive && isEditorCollapsed && (
              <a 
                href={`/${subdomain}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm active:scale-90"
                title="Buka Portofolio di Tab Baru"
              >
                <i className="fas fa-external-link-alt text-[11px]"></i>
              </a>
          )}
        </div>

        {/* CONTAINER MOCKUP DEVICE */}
        <div className={`relative z-10 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden shrink-0 mt-12 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-200/80
          ${previewMode === 'desktop' 
            ? `w-full max-w-6xl h-full max-h-[85vh] rounded-2xl sm:rounded-[2rem]` 
            : `w-[360px] h-[750px] max-h-[85vh] border-[12px] border-slate-900 rounded-[3rem]`
          }
        `}>
          
          {/* Header Browser/Notch Simulasi (Tetap Putih) */}
          <div className="shrink-0 transition-all duration-700 z-20 border-b border-slate-100 bg-white">
            {previewMode === 'desktop' ? (
              <div className="h-12 flex items-center px-4 gap-3 bg-slate-50/80 backdrop-blur-sm">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-300"></div><div className="w-3 h-3 rounded-full bg-slate-300"></div><div className="w-3 h-3 rounded-full bg-slate-300"></div></div>
                <div className="mx-auto px-6 py-1.5 bg-white text-[10px] font-mono text-slate-400 rounded-md flex items-center gap-2 font-bold shadow-sm border border-slate-200/50 truncate max-w-[250px]">
                  <i className="fas fa-lock"></i>portfo.be/{subdomain || 'username'}
                </div>
              </div>
            ) : (
              <div className="h-7 bg-white flex justify-center w-full relative transition-all duration-700"><div className="w-28 h-6 bg-slate-900 rounded-b-3xl"></div></div>
            )}
          </div>
          
          {/* AREA RENDER KOMPONEN PORTFOLIOVIEW */}
          <div className="flex-1 overflow-y-auto custom-scrollbar relative z-0 transition-all duration-700 bg-white">
            <PortfolioView data={livePreviewData} theme={livePreviewTheme} isMobileView={previewMode === 'mobile'} />
          </div>
          
        </div>

      </div>
    </main>
  );
}