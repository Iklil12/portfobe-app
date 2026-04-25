"use client";
import React from 'react';

// Mendefinisikan 'kabel' data dari komponen induk
export interface ThemeControlProps {
  themeColor: string;
  setThemeColor: (color: string) => void;
  fontHeading: string;
  setFontHeading: (font: string) => void;
  fontBody: string;
  setFontBody: (font: string) => void;
  cardStyle: string;
  setCardStyle: (style: string) => void;
  buttonShape: string;
  setButtonShape: (shape: string) => void;
}

export default function BrutalismControls({
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

      {/* KONTROL GAYA KARTU */}
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

      {/* KONTROL BENTUK ELEMEN */}
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

    </div>
  );
}