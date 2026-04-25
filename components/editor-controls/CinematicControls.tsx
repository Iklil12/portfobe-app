"use client";
import React from 'react';
import { ThemeControlProps } from './BrutalismControls';

export default function CinematicControls({
  themeColor, setThemeColor,
  fontHeading, setFontHeading,
  fontBody, setFontBody,
  cardStyle, setCardStyle,
  buttonShape, setButtonShape
}: ThemeControlProps) {
  
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
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* KONTROL WARNA AKSEN */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-palette text-[10px]"></i></div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Warna Aksen Hover</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {['#ffffff', '#e5e5e5', '#ff9e00', '#ef4444', '#3b82f6'].map(color => (
            <button key={color} onClick={() => setThemeColor(color)} className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${themeColor.toLowerCase() === color ? 'border-slate-400 scale-110 shadow-[0_0_15px_rgba(0,0,0,0.15)] ring-[3px] ring-slate-900' : 'border-transparent shadow-sm border border-slate-200'}`} style={{ backgroundColor: color }} />
          ))}
          <label className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 cursor-pointer hover:border-slate-500 hover:text-slate-600 hover:scale-105 transition-all duration-300 overflow-hidden group">
            <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="absolute inset-[-20px] w-20 h-20 opacity-0 cursor-pointer z-10" />
            <i className="fas fa-plus text-[10px] group-hover:scale-110 transition-transform"></i>
          </label>
        </div>
        <div className="w-full h-px bg-slate-100 mt-10"></div>
      </div>

      {/* KONTROL FONT */}
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

      {/* KONTROL GAYA GAMBAR & TOMBOL (DIGABUNG) */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-border-all text-[10px]"></i></div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Bentuk Elemen</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => {setCardStyle('hard'); setButtonShape('hard');}} className={`group relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isCardHard ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}>
            <div className={`w-8 h-6 transition-all duration-300 rounded-none shrink-0 ${isCardHard ? 'bg-white border-2 border-slate-400' : 'bg-slate-100 border border-slate-300 group-hover:bg-slate-200'}`}></div>
            <span className={`text-[9px] font-bold uppercase tracking-widest ${isCardHard ? 'text-white' : 'text-slate-500'}`}>Tajam / Kotak</span>
          </button>
          <button onClick={() => {setCardStyle('soft'); setButtonShape('rounded');}} className={`group relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isCardSoft ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}>
            <div className={`w-8 h-6 transition-all duration-300 rounded-xl shrink-0 ${isCardSoft ? 'bg-white border-2 border-slate-400' : 'bg-slate-100 border border-slate-300 group-hover:bg-slate-200'}`}></div>
            <span className={`text-[9px] font-bold uppercase tracking-widest ${isCardSoft ? 'text-white' : 'text-slate-500'}`}>Halus / Rounded</span>
          </button>
        </div>
      </div>
    </div>
  );
}