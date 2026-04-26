"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; 
import PortfolioView from '@/components/PortfolioView';
import Link from 'next/link';
import { showToast } from '@/lib/customToast'; 
import { mutate } from 'swr'; 

// --- IMPORT KOMPONEN KONTROL EDITOR ---
import BrutalismControls from '@/components/editor-controls/BrutalismControls';
import MinimalistControls from '@/components/editor-controls/MinimalistControls';
import CinematicControls from '@/components/editor-controls/CinematicControls';
import AcidControls from '@/components/editor-controls/AcidControls';

export default function AppearancePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  
  // --- STATE UNTUK DATA PROFIL ---
  const [fullName, setFullName] = useState("Nama Anda");
  const [profession, setProfession] = useState("Profesi / Bio Singkat");
  const [bio, setBio] = useState("");
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
            if (appData.profile) {
                if (appData.profile.fullName) setFullName(appData.profile.fullName);
                if (appData.profile.profession) setProfession(appData.profile.profession);
                if (appData.profile.bio) setBio(appData.profile.bio);
                if (appData.profile.avatarUrl) setAvatarUrl(appData.profile.avatarUrl);
                if (appData.profile.subdomain) setSubdomain(appData.profile.subdomain);
            }
            
            if (appData.isLive !== undefined) setIsLive(appData.isLive);

            if (appData.siteAppearance) {
                const sa = appData.siteAppearance;
                if (sa.themeTemplate) setActiveTheme(sa.themeTemplate);
                if (sa.themeColor) setThemeColor(sa.themeColor);
                if (sa.fontHeading) setFontHeading(sa.fontHeading);
                if (sa.fontBody) setFontBody(sa.fontBody);
                if (sa.buttonShape) setButtonShape(sa.buttonShape);
                if (sa.cardStyle) setCardStyle(sa.cardStyle);
                if (sa.splashScreen !== undefined && sa.splashScreen !== null) {
                    setSplashScreen(sa.splashScreen); 
                }
            }
          }
        }

        setDbData(appData);

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
        toast.dismiss(toastId); 

        if (!isLive) {
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

  // Persiapan data untuk Live Preview
  const livePreviewData = { 
      ...dbData, 
      profile: { fullName, profession, bio, avatarUrl, subdomain }
  };
  const livePreviewTheme = { themeTemplate: activeTheme, themeColor, fontHeading, fontBody, buttonShape, cardStyle, splashScreen };

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

      {/* MODAL OFFLINE */}
      {showOfflineModal && (
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-500" onClick={() => setShowOfflineModal(false)}></div>
          <div className="relative bg-white rounded-[2rem] p-8 md:p-10 max-w-sm w-full shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-100 animate-in zoom-in-95 fade-in duration-300 flex flex-col items-center text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="w-16 h-16 bg-rose-50 border border-rose-100 shadow-inner text-rose-500 rounded-full flex items-center justify-center mb-6 relative">
              <i className="fas fa-eye-slash text-xl"></i>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Desain Disimpan.</h3>
            <p className="text-slate-500 mb-8 text-[13px] font-medium leading-relaxed">
              Namun, web portofolio Anda saat ini sedang berstatus <span className="font-bold text-rose-500">Offline</span>.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <Link href="/dashboard/settings" className="w-full py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 transition-all text-xs uppercase tracking-widest shadow-[0_5px_15px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2">
                <i className="fas fa-globe"></i> Aktifkan Web Sekarang
              </Link>
              <button onClick={() => setShowOfflineModal(false)} className="w-full py-4 rounded-xl font-bold text-slate-400 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-700 active:scale-95 transition-all text-xs uppercase tracking-widest">
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
                <Link href="/dashboard" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all active:scale-90" title="Kembali ke Dashboard">
                  <i className="fas fa-arrow-left text-[11px]"></i>
                </Link>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  Editor <i className="fas fa-magic text-slate-300 text-sm"></i>
                </h1>
              </div>
              
              <div className="flex items-center gap-2">
                <button onClick={() => setIsEditorCollapsed(true)} className="hidden lg:flex w-8 h-8 rounded-full items-center justify-center bg-white border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-90 shadow-sm" title="Sembunyikan Panel Editor">
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
               <span className="font-bold text-slate-700 text-sm">
                 {activeTheme === 'minimalist' ? 'Minimalist Clean' : 
                  activeTheme === 'cinematic' ? 'Cinematic Dark' : 
                  activeTheme === 'acid' ? 'Acid Punk' : 
                  'Neo Brutalism'}
               </span>
               <i className="fas fa-check-circle text-emerald-500"></i>
            </div>
            <div className="w-full h-px bg-slate-100 mt-10"></div>
          </div>

          {/* ============================================================== */}
          {/* LOGIKA PEMANGGILAN KONTROL SECARA DINAMIS                        */}
          {/* ============================================================== */}
          {activeTheme === 'brutalism' && (
            <BrutalismControls 
              themeColor={themeColor} setThemeColor={setThemeColor}
              fontHeading={fontHeading} setFontHeading={setFontHeading}
              fontBody={fontBody} setFontBody={setFontBody}
              cardStyle={cardStyle} setCardStyle={setCardStyle}
              buttonShape={buttonShape} setButtonShape={setButtonShape}
            />
          )}

          {activeTheme === 'minimalist' && (
            <MinimalistControls 
              fontHeading={fontHeading} setFontHeading={setFontHeading}
              fontBody={fontBody} setFontBody={setFontBody}
            />
          )}
          {activeTheme === 'cinematic' && (
            <CinematicControls 
              themeColor={themeColor} setThemeColor={setThemeColor}
              fontHeading={fontHeading} setFontHeading={setFontHeading}
              fontBody={fontBody} setFontBody={setFontBody}
              cardStyle={cardStyle} setCardStyle={setCardStyle}
              buttonShape={buttonShape} setButtonShape={setButtonShape}
            />
          )}
          {activeTheme === 'acid' && (
            <AcidControls 
              themeColor={themeColor} setThemeColor={setThemeColor}
              fontHeading={fontHeading} setFontHeading={setFontHeading}
              fontBody={fontBody} setFontBody={setFontBody}
            />
          )}

          {/* TOGGLE SPLASH SCREEN (GLOBAL UNTUK SEMUA TEMA) */}
          <div className="mb-10 mt-10">
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
        
        {/* Tombol Re-open Panel Editor */}
        <div className={`absolute top-1/2 left-0 -translate-y-1/2 z-40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isEditorCollapsed ? 'translate-x-0' : '-translate-x-full'}`}>
          <button onClick={() => setIsEditorCollapsed(false)} className="w-7 h-20 bg-slate-900 border border-slate-800 border-l-0 rounded-r-2xl shadow-[5px_0_20px_rgba(0,0,0,0.15)] flex items-center justify-center text-slate-400 hover:text-white hover:w-9 transition-all active:scale-95" title="Tampilkan Panel Editor">
            <i className="fas fa-chevron-right text-[11px]"></i>
          </button>
        </div>

        <div className="absolute inset-0 bg-grid-slate pointer-events-none z-0"></div>

        {/* FLOATING ACTION BAR (Pusat Kendali Pratinjau) */}
        <div className="absolute top-6 z-40 flex items-center gap-3 transition-all duration-700">
          <div className="bg-white/80 backdrop-blur-xl p-1.5 rounded-full border border-slate-200 flex items-center gap-1 shadow-[0_5px_20px_rgba(0,0,0,0.05)]">
            <button onClick={() => setPreviewMode('desktop')} className={`px-4 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all flex items-center gap-2 ${previewMode === 'desktop' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}><i className="fas fa-desktop text-[13px]"></i> Desktop</button>
            <button onClick={() => setPreviewMode('mobile')} className={`px-4 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all flex items-center gap-2 ${previewMode === 'mobile' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}><i className="fas fa-mobile-alt text-[13px]"></i> Mobile</button>
          </div>

          {isEditorCollapsed && (
            <button onClick={saveDesign} disabled={isSaving} className="hidden lg:flex px-6 py-2.5 bg-black text-white rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
              {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} Simpan
            </button>
          )}

          {subdomain && isLive && isEditorCollapsed && (
              <a href={`/${subdomain}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm active:scale-90" title="Buka Portofolio di Tab Baru">
                <i className="fas fa-external-link-alt text-[11px]"></i>
              </a>
          )}
        </div>

        {/* CONTAINER MOCKUP DEVICE */}
        <div className={`relative z-10 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden shrink-0 mt-12 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-200/80
          ${previewMode === 'desktop' ? 'w-full max-w-6xl h-full max-h-[85vh] rounded-2xl sm:rounded-[2rem]' : 'w-[360px] h-[750px] max-h-[85vh] border-[12px] border-slate-900 rounded-[3rem]'}
        `}>
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
          
          <div className="flex-1 overflow-y-auto custom-scrollbar relative z-0 transition-all duration-700 bg-white">
            <PortfolioView data={livePreviewData} theme={livePreviewTheme} isMobileView={previewMode === 'mobile'} />
          </div>
        </div>
      </div>
    </main>
  );
}