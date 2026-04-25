"use client";
import React from 'react';
import { ThemeControlProps } from './BrutalismControls';

export default function MinimalistControls({
  fontHeading, setFontHeading,
  fontBody, setFontBody
}: Partial<ThemeControlProps>) { // Pakai Partial karena kita tidak butuh semua props
  
  const isFontMono = fontHeading?.toLowerCase().includes('space') || fontHeading?.toLowerCase().includes('mono');
  const isFontSerif = fontHeading?.toLowerCase().includes('serif') || fontHeading?.toLowerCase().includes('elegant') || fontHeading?.toLowerCase().includes('playfair');
  const isFontSans = !isFontMono && !isFontSerif;

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* KONTROL FONT */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-font text-[10px]"></i></div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Tipografi Font</h3>
        </div>
        <div className="flex p-1 bg-slate-100/50 rounded-2xl border border-slate-200/60">
          <button onClick={() => {setFontHeading?.('Space Mono'); setFontBody?.('Space Mono')}} className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 font-mono uppercase tracking-wide ${isFontMono ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}>Monospace</button>
          <button onClick={() => {setFontHeading?.('Inter'); setFontBody?.('Inter')}} className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 font-sans ${isFontSans ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}>Modern Sans</button>
          <button onClick={() => {setFontHeading?.('serif'); setFontBody?.('serif')}} className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 font-serif italic ${isFontSerif ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}>Elegant Serif</button>
        </div>
        <div className="w-full h-px bg-slate-100 mt-10"></div>
      </div>

    </div>
  );
}