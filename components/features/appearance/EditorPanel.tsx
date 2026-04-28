"use client";

import React from 'react';
import Link from 'next/link';

// --- IMPORT KOMPONEN KONTROL EDITOR ---
import BrutalismControls from '@/components/editor-controls/BrutalismControls';
import MinimalistControls from '@/components/editor-controls/MinimalistControls';
import CinematicControls from '@/components/editor-controls/CinematicControls';
import AcidControls from '@/components/editor-controls/AcidControls';

export function EditorPanel({ state, actions }: { state: any, actions: any }) {
  const { 
    isEditorCollapsed, 
    isSaving, 
    activeTheme, 
    themeColor, 
    fontHeading, 
    fontBody, 
    cardStyle, 
    buttonShape, 
    splashScreen 
  } = state;

  const { 
    setIsEditorCollapsed, 
    saveDesign, 
    setThemeColor, 
    setFontHeading, 
    setFontBody, 
    setCardStyle, 
    setButtonShape, 
    setSplashScreen 
  } = actions;

  return (
    <div className={`
      h-full flex flex-col bg-white/95 backdrop-blur-xl z-30 shadow-[5px_0_30px_rgba(0,0,0,0.04)] border-r border-slate-200/80
      transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 relative
      ${isEditorCollapsed ? 'w-0 opacity-0 pointer-events-none overflow-hidden border-none' : 'w-full lg:w-[420px] xl:w-[460px] opacity-100'}
    `}>

      {/* Header Panel Editor */}
      <div className="p-6 md:p-8 border-b border-slate-200/60 sticky top-0 z-20 shrink-0 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:shadow-sm transition-all active:scale-90" title="Kembali ke Dashboard">
                <i className="fas fa-arrow-left text-xs"></i>
              </Link>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 leading-none">
                  Desain Visual
                </h1>
                <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-widest">Penyesuaian Tampilan</p>
              </div>
            </div>

          </div>

          <div className="flex items-center gap-3 w-full">
            <button onClick={saveDesign} disabled={isSaving} className="relative overflow-hidden flex-1 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 shadow-[0_5px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.4)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-[right_center] text-white flex items-center justify-center gap-2 border border-indigo-500/50">
              <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center gap-2">
                {isSaving ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-check-double text-indigo-200"></i>}
                <span className="drop-shadow-md">{isSaving ? 'Memproses...' : 'Terapkan Desain'}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Tombol Collapse Panel Editor (Menyatu dengan edge kanan) */}
      <div className="absolute top-1/2 -right-[1px] translate-x-full -translate-y-1/2 z-[100] hidden lg:block">
        <button onClick={() => setIsEditorCollapsed(true)} className="w-7 h-20 bg-white border border-slate-200 border-l-0 rounded-r-2xl shadow-[5px_0_20px_rgba(0,0,0,0.05)] flex items-center justify-center text-slate-400 hover:text-slate-900 hover:w-9 transition-all active:scale-95 group" title="Sembunyikan Panel Editor">
          <i className="fas fa-chevron-left text-[11px] group-hover:-translate-x-0.5 transition-transform"></i>
        </button>
      </div>

      {/* Konten Menu Editor */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 pb-32 bg-slate-50/50">

        {/* SECTION: TEMA AKTIF */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600"><i className="fas fa-swatchbook text-[11px]"></i></div>
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-800">Basis Tema</h3>
            </div>
            <Link href="/dashboard/themes" className="group flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-colors">
              Ubah <i className="fas fa-arrow-right text-[9px] group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>
          
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center justify-between group hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <i className={`fas ${activeTheme === 'minimalist' ? 'fa-align-left' : activeTheme === 'cinematic' ? 'fa-film' : activeTheme === 'acid' ? 'fa-bolt' : 'fa-cube'} text-sm`}></i>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-slate-900 text-sm tracking-tight">
                  {activeTheme === 'minimalist' ? 'Minimalist Clean' :
                    activeTheme === 'cinematic' ? 'Cinematic Dark' :
                      activeTheme === 'acid' ? 'Acid Punk' :
                        'Neo Brutalism'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Tema Aktif Saat Ini</span>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <i className="fas fa-check text-[10px]"></i>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 mb-8 opacity-60">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pengaturan Kustom</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        {/* KONTROL DINAMIS (DIBUNGKUS DALAM KARTU PUTIH UNTUK TAMPILAN LEBIH BERSIH) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm mb-8">

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

        </div>

        {/* TOGGLE SPLASH SCREEN (GLOBAL UNTUK SEMUA TEMA) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mb-6 group hover:border-slate-300 hover:shadow-md transition-all cursor-pointer" onClick={() => setSplashScreen(!splashScreen)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100/50 text-indigo-500 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors"><i className="fas fa-play text-sm ml-1"></i></div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight mb-1 group-hover:text-indigo-600 transition-colors">Cinematic Intro</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Tampilkan animasi transisi memukau<br/>sebelum portofolio dimuat penuh.</p>
              </div>
            </div>
            <button className={`w-14 h-8 rounded-full relative transition-all duration-300 ease-in-out shrink-0 outline-none shadow-inner border ${splashScreen ? 'bg-indigo-600 border-indigo-700' : 'bg-slate-100 border-slate-200'}`}>
              <div className={`w-6 h-6 rounded-full bg-white absolute top-[3px] transition-all duration-300 shadow-md flex items-center justify-center ${splashScreen ? 'left-[26px]' : 'left-1'}`}>
                {splashScreen && <i className="fas fa-check text-[8px] text-indigo-600"></i>}
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
