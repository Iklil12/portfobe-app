"use client";
import React from 'react';

export default function SplitControls({
  themeColor, setThemeColor,
  fontHeading, setFontHeading,
  fontBody, setFontBody,
  buttonShape, setButtonShape
}: any) {
  
  const isFontDisplay = fontHeading?.toLowerCase().includes('cabinet') || fontHeading?.toLowerCase().includes('syne');
  const isFontSans = fontHeading?.toLowerCase().includes('inter') || fontHeading?.toLowerCase().includes('grotesk');
  const isFontSerif = fontHeading?.toLowerCase().includes('serif') || fontHeading?.toLowerCase().includes('playfair');

  const isBtnHard = buttonShape === 'hard' || buttonShape === 'square';
  const isBtnRounded = buttonShape === 'rounded';
  const isBtnPill = buttonShape === 'pill';

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* KONTROL WARNA AKSEN */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-palette text-[10px]"></i></div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Highlight Color</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {['#ffffff', '#f4f4f5', '#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'].map(color => (
            <button key={color} onClick={() => setThemeColor(color)} className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${themeColor.toLowerCase() === color ? 'border-white scale-110 shadow-[0_0_15px_rgba(0,0,0,0.15)] ring-[3px] ring-slate-900' : 'border-transparent shadow-sm'}`} style={{ backgroundColor: color }} />
          ))}
          <label className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 cursor-pointer hover:border-slate-500 hover:text-slate-600 hover:scale-105 transition-all duration-300 overflow-hidden group">
            <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="absolute inset-[-20px] w-20 h-20 opacity-0 cursor-pointer z-10" />
            <i className="fas fa-plus text-[10px] group-hover:scale-110 transition-transform"></i>
          </label>
        </div>
      </div>

      {/* KONTROL FONT */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-font text-[10px]"></i></div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Tipografi Font</h3>
        </div>
        <div className="flex p-1 bg-slate-100/50 rounded-2xl border border-slate-200/60">
          <button onClick={() => {setFontHeading('Cabinet Grotesk'); setFontBody('Inter')}} className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 font-sans tracking-tight ${isFontDisplay ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}>Display</button>
          <button onClick={() => {setFontHeading('Inter'); setFontBody('Inter')}} className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 font-sans ${isFontSans && !isFontDisplay ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}>Minimal Sans</button>
          <button onClick={() => {setFontHeading('Playfair Display'); setFontBody('Inter')}} className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 font-serif italic ${isFontSerif ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}>Elegant Serif</button>
        </div>
      </div>

      {/* KONTROL BENTUK ELEMEN */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-shapes text-[10px]"></i></div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Bentuk Tombol & Kartu</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => setButtonShape('square')} className={`group relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isBtnHard ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}>
            <div className={`w-8 h-4 transition-all duration-300 rounded-none ${isBtnHard ? 'bg-slate-500' : 'bg-slate-200 group-hover:bg-slate-400'}`}></div>
            <span className={`text-[9px] font-bold uppercase tracking-widest ${isBtnHard ? 'text-white' : 'text-slate-500'}`}>Kotak</span>
          </button>
          <button onClick={() => setButtonShape('rounded')} className={`group relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isBtnRounded ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}>
            <div className={`w-8 h-4 transition-all duration-300 rounded-xl ${isBtnRounded ? 'bg-slate-500' : 'bg-slate-200 group-hover:bg-slate-400'}`}></div>
            <span className={`text-[9px] font-bold uppercase tracking-widest ${isBtnRounded ? 'text-white' : 'text-slate-500'}`}>Lengkung</span>
          </button>
          <button onClick={() => setButtonShape('pill')} className={`group relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isBtnPill ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}>
            <div className={`w-8 h-4 transition-all duration-300 rounded-full ${isBtnPill ? 'bg-slate-500' : 'bg-slate-200 group-hover:bg-slate-400'}`}></div>
            <span className={`text-[9px] font-bold uppercase tracking-widest ${isBtnPill ? 'text-white' : 'text-slate-500'}`}>Kapsul</span>
          </button>
        </div>
      </div>

    </div>
  );
}
