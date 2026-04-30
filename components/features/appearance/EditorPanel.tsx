"use client";

import React from 'react';
import Link from 'next/link';
import { ThemeSelectionModal } from './ThemeSelectionModal';
import { ProUpgradeModal } from '@/components/ProUpgradeModal';

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
    splashScreen,
    isThemeModalOpen,
    showProModal,
    isLoading
  } = state;

  const { 
    setIsEditorCollapsed, 
    saveDesign, 
    setThemeColor, 
    setFontHeading, 
    setFontBody, 
    setCardStyle, 
    setButtonShape, 
    setSplashScreen,
    setIsThemeModalOpen,
    setActiveTheme,
    setShowProModal
  } = actions;

  return (
    <>
      <ProUpgradeModal 
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        feature={
          splashScreen ? "Fitur Cinematic Intro" :
          activeTheme === 'brutalism' ? "Tema Neo Brutalism" :
          activeTheme === 'cinematic' ? "Tema Cinematic Dark" :
          activeTheme === 'acid' ? "Tema Acid Tech" : undefined
        }
      />
      <ThemeSelectionModal 
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        activeTheme={activeTheme}
        onSelectTheme={(themeId) => setActiveTheme(themeId)}
      />
      
      <div className={`
        h-full flex flex-col z-30 relative shrink-0
        bg-gradient-to-b from-white/95 to-slate-50/95 backdrop-blur-2xl 
        shadow-[20px_0_40px_-15px_rgba(0,0,0,0.05)] border-r border-white/60
        transition-all duration-300 ease-in-out
        ${isEditorCollapsed ? 'w-0 opacity-0 pointer-events-none overflow-hidden border-none' : 'w-full lg:w-[420px] xl:w-[460px] opacity-100'}
      `}>
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-orange-50/50 to-transparent pointer-events-none -z-10"></div>

        {/* Header Panel Editor */}
        <div className="p-5 md:p-6 border-b border-slate-200/40 sticky top-0 z-20 shrink-0 bg-white/50 backdrop-blur-xl">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 md:gap-4">
              <Link href="/dashboard" className="w-9 h-9 rounded-xl bg-white border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center text-slate-500 hover:text-orange-500 hover:border-orange-200 hover:shadow-md transition-all duration-300 active:scale-90 group shrink-0" title="Kembali ke Dashboard">
                <i className="fas fa-arrow-left text-xs group-hover:-translate-x-0.5 transition-transform"></i>
              </Link>
              <div className="flex flex-col">
                <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-none">
                  Desain Visual
                </h1>
                <p className="text-[9px] md:text-[10px] text-orange-500 font-bold mt-1 uppercase tracking-widest">
                  Editor Panel
                </p>
              </div>
            </div>

            {/* Tombol Save Inline */}
            <button 
              onClick={saveDesign} 
              disabled={isSaving} 
              className="relative overflow-hidden px-5 py-2.5 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300 shadow-[0_4px_12px_-2px_rgba(249,115,22,0.25)] hover:shadow-[0_8px_20px_-4px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed group bg-[#ff9e00] hover:bg-orange-500 text-white flex items-center gap-2 border border-orange-400/30 shrink-0"
            >
              {/* Efek kilap (shine) */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 z-0"></div>
              
              <div className="relative flex items-center gap-2 z-10 drop-shadow-sm">
                {isSaving ? <i className="fas fa-circle-notch fa-spin text-white/90"></i> : <i className="fas fa-save text-orange-100"></i>}
                <span>{isSaving ? 'Menyimpan...' : 'Save'}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tombol Collapse Panel Editor */}
        <div className="absolute top-1/2 -right-[15px] -translate-y-1/2 z-[100] hidden lg:flex">
          <button onClick={() => setIsEditorCollapsed(true)} className="w-8 h-16 bg-white/90 backdrop-blur-md border border-slate-200 shadow-[4px_4px_20px_rgba(0,0,0,0.06)] rounded-full flex items-center justify-center text-slate-400 hover:text-orange-500 hover:h-20 hover:border-orange-200 transition-all duration-300 active:scale-95 group" title="Sembunyikan Panel Editor">
            <i className="fas fa-chevron-left text-[11px] group-hover:-translate-x-0.5 transition-transform"></i>
          </button>
        </div>

        {/* Konten Menu Editor */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 pb-32 relative z-10">
          
          {/* SECTION: TEMA AKTIF */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100/50 shadow-inner flex items-center justify-center text-orange-500"><i className="fas fa-swatchbook text-xs"></i></div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Basis Tema</h3>
              </div>
              {!isLoading && (
                <button 
                  onClick={() => setIsThemeModalOpen(true)} 
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50/50 text-[10px] font-bold text-orange-600 hover:bg-orange-100 hover:text-orange-700 uppercase tracking-widest transition-all"
                >
                  Ganti <i className="fas fa-arrow-right text-[9px] group-hover:translate-x-0.5 transition-transform"></i>
                </button>
              )}
            </div>
            
            {isLoading ? (
              <div className="p-5 rounded-3xl border border-slate-100 bg-slate-50/50 animate-pulse h-24"></div>
            ) : (
              <div className="relative group cursor-pointer" onClick={() => setIsThemeModalOpen(true)}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-amber-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                <div className="relative p-5 rounded-3xl border border-white/60 bg-gradient-to-br from-white to-slate-50/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between transition-all duration-300 group-hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-inner flex items-center justify-center text-white transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <i className={`fas ${activeTheme === 'minimalist' ? 'fa-align-left' : activeTheme === 'cinematic' ? 'fa-film' : activeTheme === 'acid' ? 'fa-bolt' : 'fa-cube'} text-lg drop-shadow-md`}></i>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-base tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 transition-colors">
                        {activeTheme === 'minimalist' ? 'Minimalist Clean' :
                          activeTheme === 'cinematic' ? 'Cinematic Dark' :
                            activeTheme === 'acid' ? 'Acid Punk' :
                              'Neo Brutalism'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Aktif Digunakan
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DIVIDER */}
          <div className="flex items-center justify-center mb-10 opacity-70 relative">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            <div className="absolute bg-slate-50 px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-200/50 rounded-full py-1 shadow-sm">Kustomisasi Lanjutan</div>
          </div>

          {/* KONTROL DINAMIS */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] mb-10 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:bg-white/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2"></div>
            {activeTheme === 'brutalism' && (
              <BrutalismControls themeColor={themeColor} setThemeColor={setThemeColor} fontHeading={fontHeading} setFontHeading={setFontHeading} fontBody={fontBody} setFontBody={setFontBody} cardStyle={cardStyle} setCardStyle={setCardStyle} buttonShape={buttonShape} setButtonShape={setButtonShape} />
            )}
            {activeTheme === 'minimalist' && (
              <MinimalistControls fontHeading={fontHeading} setFontHeading={setFontHeading} fontBody={fontBody} setFontBody={setFontBody} />
            )}
            {activeTheme === 'cinematic' && (
              <CinematicControls themeColor={themeColor} setThemeColor={setThemeColor} fontHeading={fontHeading} setFontHeading={setFontHeading} fontBody={fontBody} setFontBody={setFontBody} cardStyle={cardStyle} setCardStyle={setCardStyle} buttonShape={buttonShape} setButtonShape={setButtonShape} />
            )}
            {activeTheme === 'acid' && (
              <AcidControls themeColor={themeColor} setThemeColor={setThemeColor} fontHeading={fontHeading} setFontHeading={setFontHeading} fontBody={fontBody} setFontBody={setFontBody} />
            )}
          </div>

          {/* TOGGLE SPLASH SCREEN */}
          {isLoading ? (
            <div className="bg-slate-100 border border-slate-200 rounded-3xl p-6 h-24 animate-pulse mb-6"></div>
          ) : (
            <div className="relative group cursor-pointer" onClick={() => setSplashScreen(!splashScreen)}>
              <div className={`absolute -inset-0.5 rounded-[2rem] blur opacity-0 transition duration-500 ${splashScreen ? 'bg-gradient-to-r from-orange-400 to-amber-500 opacity-20' : 'group-hover:opacity-10 bg-slate-300'}`}></div>
              <div className="relative bg-white/80 backdrop-blur-md border border-white/80 rounded-[2rem] p-6 shadow-sm mb-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none z-0"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-inner ${splashScreen ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white' : 'bg-slate-100 border border-slate-200 text-slate-400 group-hover:bg-slate-200'}`}>
                      <i className={`fas fa-play text-sm ml-1 ${splashScreen ? 'drop-shadow-md' : ''}`}></i>
                    </div>
                    <div>
                      <h3 className={`text-sm font-black tracking-tight mb-1 transition-colors flex items-center gap-2 ${splashScreen ? 'text-orange-500' : 'text-slate-700 group-hover:text-slate-900'}`}>
                        Cinematic Intro
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-md tracking-widest uppercase flex items-center gap-1 shadow-sm">
                            <i className="fas fa-crown text-[6px]"></i> PRO
                        </span>
                      </h3>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Animasi transisi memukau sebelum<br/>portofolio Anda terbuka penuh.</p>
                    </div>
                  </div>
                  <button className={`w-14 h-8 rounded-full relative transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shrink-0 outline-none shadow-inner border ${splashScreen ? 'bg-orange-500 border-orange-600' : 'bg-slate-200 border-slate-300'}`}>
                    <div className={`w-6 h-6 rounded-full bg-white absolute top-[3px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_2px_5px_rgba(0,0,0,0.2)] flex items-center justify-center ${splashScreen ? 'left-[26px] scale-110' : 'left-1'}`}>
                      {splashScreen && <i className="fas fa-check text-[8px] text-orange-500"></i>}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
