"use client";
import React from 'react';
import { ThemeControlProps } from './BrutalismControls';

export default function AcidControls({
  themeColor, setThemeColor,
  fontHeading, setFontHeading,
  fontBody, setFontBody
}: Partial<ThemeControlProps>) {
  
  const isFontSyne = fontHeading === 'Syne';

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* KONTROL WARNA NEON */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-palette text-[10px]"></i></div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Warna Acid / Neon</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Pilihan warna khas Cyber / Acid Tech */}
          {['#DFFF00', '#00FFA3', '#FF0055', '#FF4D00', '#B026FF'].map(color => (
            <button key={color} onClick={() => setThemeColor?.(color)} className={`w-10 h-10 sm:w-11 sm:h-11 rounded-none border-2 transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${themeColor?.toUpperCase() === color ? 'border-white scale-110 shadow-[0_0_20px_rgba(0,0,0,0.2)] ring-[3px] ring-slate-900' : 'border-transparent shadow-sm border border-slate-200'}`} style={{ backgroundColor: color }} />
          ))}
          <label className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-none border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 cursor-pointer hover:border-slate-500 hover:text-slate-600 hover:scale-105 transition-all duration-300 overflow-hidden group">
            <input type="color" value={themeColor} onChange={(e) => setThemeColor?.(e.target.value)} className="absolute inset-[-20px] w-20 h-20 opacity-0 cursor-pointer z-10" />
            <i className="fas fa-plus text-[10px] group-hover:scale-110 transition-transform"></i>
          </label>
        </div>
        <div className="w-full h-px bg-slate-100 mt-10"></div>
      </div>

      {/* KONTROL FONT */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-font text-[10px]"></i></div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Gaya Tipografi</h3>
        </div>
        <div className="flex p-1 bg-slate-100/50 rounded-2xl border border-slate-200/60">
          <button onClick={() => {setFontHeading?.('Syne'); setFontBody?.('Space Grotesk')}} className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 uppercase tracking-wide ${isFontSyne ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}>Acid Display</button>
          <button onClick={() => {setFontHeading?.('Space Mono'); setFontBody?.('Inter')}} className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 uppercase tracking-wide ${!isFontSyne ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}>Tech Mono</button>
        </div>
      </div>

    </div>
  );
}