"use client";

import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import PortfolioView from '@/components/PortfolioView';

export default function AppearancePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  // --- STATE UNTUK DATA PROFIL ---
  const [fullName, setFullName] = useState("Nama Anda");
  const [profession, setProfession] = useState("Profesi / Bio Singkat");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [subdomain, setSubdomain] = useState(""); 
  const [dbData, setDbData] = useState<any>(null);

  // --- STATE UNTUK TEMA & PENGATURAN ---
  const [activeTheme, setActiveTheme] = useState("brutalism");
  const [themeColor, setThemeColor] = useState("#000000");
  const [fontHeading, setFontHeading] = useState("Space Mono");
  const [fontBody, setFontBody] = useState("Inter");
  const [buttonShape, setButtonShape] = useState("hard");
  const [cardStyle, setCardStyle] = useState("hard-shadow");
  const [splashScreen, setSplashScreen] = useState(true); // STATE BARU UNTUK TOGGLE

  useEffect(() => {
    const fetchThemeAndProfile = async () => {
      try {
        const res = await fetch('/api/appearance');
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setDbData(data);
            if (data.fullName) setFullName(data.fullName);
            if (data.profession) setProfession(data.profession);
            if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
            if (data.subdomain) setSubdomain(data.subdomain);

            if (data.themeTemplate) setActiveTheme(data.themeTemplate);
            if (data.themeColor) setThemeColor(data.themeColor);
            if (data.fontHeading) setFontHeading(data.fontHeading);
            if (data.fontBody) setFontBody(data.fontBody);
            if (data.buttonShape) setButtonShape(data.buttonShape);
            if (data.cardStyle) setCardStyle(data.cardStyle);
            if (data.splashScreen !== undefined) setSplashScreen(data.splashScreen); // Ambil dari DB
          }
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchThemeAndProfile();
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
          splashScreen // SIMPAN KE DB
        })
      });
      if (res.ok) toast.success('Desain berhasil dipublikasikan!', { id: toastId });
      else throw new Error('Gagal menyimpan');
    } catch (error) {
      toast.error('Terjadi kesalahan server.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]"><i className="fas fa-circle-notch fa-spin text-3xl text-slate-300"></i></div>;

  const livePreviewData = {
    ...dbData,
    fullName,
    profession,
    avatarUrl,
    subdomain,
    splashScreen
  };

  const livePreviewTheme = {
    themeColor, fontHeading, fontBody, buttonShape, cardStyle
  };

  return (
    <main className="h-[calc(100vh-80px)] md:h-screen flex flex-col lg:flex-row bg-[#FAFAFA] font-sans overflow-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@700&display=swap');
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 10px; }
      `}} />

      <Toaster position="top-center" />

      {/* --- KIRI: PANEL EDITOR --- */}
      <div className="w-full lg:w-5/12 h-full bg-white border-r border-slate-200 flex flex-col z-10 shadow-[5px_0_30px_rgba(0,0,0,0.03)] lg:shadow-none relative">
        <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Desain <span className="font-light text-slate-400">& Tema</span></h1>
            <p className="text-xs font-medium text-slate-500 mt-1">Kustomisasi portofolio publik secara real-time.</p>
          </div>
          <button onClick={saveDesign} disabled={isSaving} className="px-6 py-3 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#ff9e00] hover:text-slate-900 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.1)] active:scale-95 disabled:opacity-50 flex items-center gap-2">
            {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
            {isSaving ? 'Menyimpan' : 'Simpan'}
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto pb-32">
          
          {/* Warna Aksen */}
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-palette text-[10px]"></i></div>
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Warna Aksen</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {['#000000', '#0f172a', '#3b82f6', '#ef4444', '#10b981', '#f59e0b'].map(color => (
                <button key={color} onClick={() => setThemeColor(color)} className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${themeColor === color ? 'border-slate-900 scale-110 shadow-[0_0_20px_rgba(0,0,0,0.15)] ring-4 ring-slate-100' : 'border-transparent shadow-sm'}`} style={{ backgroundColor: color }} />
              ))}
              <label className="relative w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 cursor-pointer hover:border-slate-500 hover:scale-105 transition-all duration-300 overflow-hidden group">
                <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="absolute inset-[-20px] w-20 h-20 opacity-0 cursor-pointer z-10" />
                <i className="fas fa-plus text-xs group-hover:scale-110 transition-transform"></i>
              </label>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 mb-10"></div>

          {/* Tipografi */}
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-font text-[10px]"></i></div>
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Tipografi Font</h3>
            </div>
            <div className="flex p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200">
              <button onClick={() => {setFontHeading('Space Mono'); setFontBody('Space Mono')}} className={`flex-1 py-3.5 rounded-xl text-xs font-bold transition-all duration-300 font-space uppercase ${fontHeading === 'Space Mono' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Monospace</button>
              <button onClick={() => {setFontHeading('Inter'); setFontBody('Inter')}} className={`flex-1 py-3.5 rounded-xl text-xs font-bold transition-all duration-300 font-sans ${fontHeading === 'Inter' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Modern Sans</button>
              <button onClick={() => {setFontHeading('serif'); setFontBody('serif')}} className={`flex-1 py-3.5 rounded-xl text-xs font-bold transition-all duration-300 font-serif italic ${fontHeading === 'serif' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Elegant Serif</button>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 mb-10"></div>

          {/* Gaya Kartu */}
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-layer-group text-[10px]"></i></div>
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Gaya Kartu Proyek</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => setCardStyle('hard-shadow')} className={`group relative px-4 py-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${cardStyle === 'hard-shadow' ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/20 -translate-y-1' : 'bg-white border-slate-200 hover:-translate-y-1 hover:shadow-md'}`}>
                <div className={`w-8 h-8 rounded-md transition-all duration-300 ${cardStyle === 'hard-shadow' ? 'bg-white border-2 border-black shadow-[3px_3px_0px_0px_#ff9e00]' : 'bg-slate-200 border border-slate-300 group-hover:shadow-[3px_3px_0px_0px_#cbd5e1]'}`}></div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${cardStyle === 'hard-shadow' ? 'text-white' : 'text-slate-600'}`}>Neo Brutalism</span>
              </button>
              <button onClick={() => setCardStyle('flat')} className={`group relative px-4 py-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${cardStyle === 'flat' ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/20 -translate-y-1' : 'bg-white border-slate-200 hover:-translate-y-1 hover:shadow-md'}`}>
                <div className={`w-8 h-8 rounded-md transition-all duration-300 ${cardStyle === 'flat' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200 group-hover:border-slate-400'}`}></div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${cardStyle === 'flat' ? 'text-white' : 'text-slate-600'}`}>Clean Flat</span>
              </button>
              <button onClick={() => setCardStyle('soft-shadow')} className={`group relative px-4 py-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${cardStyle === 'soft-shadow' ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/20 -translate-y-1' : 'bg-white border-slate-200 hover:-translate-y-1 hover:shadow-md'}`}>
                <div className={`w-8 h-8 rounded-xl transition-all duration-300 ${cardStyle === 'soft-shadow' ? 'bg-white shadow-[0_4px_10px_rgba(255,255,255,0.3)]' : 'bg-white shadow-sm border border-slate-100 group-hover:shadow-md'}`}></div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${cardStyle === 'soft-shadow' ? 'text-white' : 'text-slate-600'}`}>Soft Shadow</span>
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 mb-10"></div>

          {/* Bentuk Tombol */}
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-shapes text-[10px]"></i></div>
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Bentuk Elemen</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button onClick={() => setButtonShape('hard')} className={`group relative px-4 py-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${buttonShape === 'hard' ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/20 -translate-y-1' : 'bg-white border-slate-200 hover:-translate-y-1 hover:shadow-md'}`}>
                <div className={`w-8 h-4 transition-all duration-300 rounded-none ${buttonShape === 'hard' ? 'bg-[#ff9e00]' : 'bg-slate-300 group-hover:bg-slate-400'}`}></div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${buttonShape === 'hard' ? 'text-white' : 'text-slate-600'}`}>Kotak Tajam</span>
              </button>
              <button onClick={() => setButtonShape('rounded')} className={`group relative px-4 py-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${buttonShape === 'rounded' ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/20 -translate-y-1' : 'bg-white border-slate-200 hover:-translate-y-1 hover:shadow-md'}`}>
                <div className={`w-8 h-4 transition-all duration-300 rounded-md ${buttonShape === 'rounded' ? 'bg-[#ff9e00]' : 'bg-slate-300 group-hover:bg-slate-400'}`}></div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${buttonShape === 'rounded' ? 'text-white' : 'text-slate-600'}`}>Melingkar</span>
              </button>
              <button onClick={() => setButtonShape('pill')} className={`group relative px-4 py-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${buttonShape === 'pill' ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/20 -translate-y-1' : 'bg-white border-slate-200 hover:-translate-y-1 hover:shadow-md'}`}>
                <div className={`w-8 h-4 transition-all duration-300 rounded-full ${buttonShape === 'pill' ? 'bg-[#ff9e00]' : 'bg-slate-300 group-hover:bg-slate-400'}`}></div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${buttonShape === 'pill' ? 'text-white' : 'text-slate-600'}`}>Kapsul</span>
              </button>
            </div>
          </div>

          {/* TOGGLE SPLASH SCREEN PINTAR */}
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <div className="flex items-center justify-between border border-slate-200 p-5 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm"><i className="fas fa-film"></i></div>
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 mb-1">Cinematic Intro</h3>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-[200px]">Tampilkan animasi layar hitam (splash screen) sebelum portofolio terbuka.</p>
                </div>
              </div>
              <button 
                onClick={() => setSplashScreen(!splashScreen)} 
                className={`w-14 h-7 rounded-full relative transition-colors duration-300 ease-in-out shrink-0 outline-none ${splashScreen ? 'bg-slate-900' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all duration-300 ease-in-out shadow-sm ${splashScreen ? 'left-8' : 'left-1'}`}></div>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* --- KANAN: LIVE PREVIEW BINGKAI KOSONG --- */}
      <div className="hidden lg:flex lg:w-7/12 bg-[#F1F5F9] relative flex-col items-center justify-center p-6 sm:p-10 overflow-hidden gap-6">
        <div className="bg-white/90 backdrop-blur-md px-1.5 py-1.5 rounded-full border border-slate-200 flex items-center gap-1 z-30 shadow-[0_2px_15px_rgba(0,0,0,0.04)]">
          <button onClick={() => setPreviewMode('desktop')} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${previewMode === 'desktop' ? 'bg-slate-900 text-white shadow-md scale-105' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}><i className="fas fa-desktop"></i> Desktop</button>
          <button onClick={() => setPreviewMode('mobile')} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${previewMode === 'mobile' ? 'bg-slate-900 text-white shadow-md scale-105' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}><i className="fas fa-mobile-alt text-sm"></i> Mobile</button>
        </div>

        <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className={`relative z-10 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden shrink-0 bg-[#F1F5F9]
          ${previewMode === 'desktop' 
            ? `w-full max-w-5xl h-full max-h-[85vh] shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2rem] border border-slate-200/80` 
            : `w-[360px] h-[750px] max-h-[80vh] border-[12px] border-slate-900 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.2)]`
          }
        `}>
          <div className="shrink-0 transition-all duration-700 z-20">
            {previewMode === 'desktop' ? (
              <div className="h-12 flex items-center px-4 gap-3 transition-all duration-700 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-amber-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div>
                <div className="mx-auto px-6 py-1.5 bg-slate-100 text-[10px] font-mono text-slate-500 rounded-md flex items-center gap-2 font-bold uppercase shadow-sm border border-slate-200/50">
                  <i className="fas fa-lock"></i>portfo.be/{subdomain || 'username'}
                </div>
              </div>
            ) : (
              <div className="h-7 bg-white flex justify-center w-full relative transition-all duration-700"><div className="w-28 h-6 bg-slate-900 rounded-b-3xl"></div></div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar relative z-0 transition-all duration-700">
            <div className="p-0 sm:p-8 md:p-12 min-h-full">
               <PortfolioView data={livePreviewData} theme={livePreviewTheme} isMobileView={previewMode === 'mobile'} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}