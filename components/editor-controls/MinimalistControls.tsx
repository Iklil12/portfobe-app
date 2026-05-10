"use client";
import React from 'react';
import { ThemeControlProps } from './BrutalismControls';

export default function MinimalistControls({
  fontHeading, setFontHeading,
  fontBody, setFontBody,
  themeColor, setThemeColor
}: Partial<ThemeControlProps>) { // Pakai Partial karena kita tidak butuh semua props
  
  const isFontMono = fontHeading?.toLowerCase().includes('space') || fontHeading?.toLowerCase().includes('mono');
  const isFontSerif = fontHeading?.toLowerCase().includes('serif') || fontHeading?.toLowerCase().includes('elegant') || fontHeading?.toLowerCase().includes('playfair');
  const isFontSans = !isFontMono && !isFontSerif;

  // Palet Warna Minimalis
  const colors = [
    { name: 'Noir', hex: '#000000' },
    { name: 'Slate', hex: '#64748b' },
    { name: 'Navy', hex: '#0f172a' },
    { name: 'Crimson', hex: '#991b1b' },
    { name: 'Forest', hex: '#166534' }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* KONTROL WARNA */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-palette text-[10px]"></i></div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Aksen Warna Utama</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setThemeColor?.(c.hex)}
              className={`group relative w-10 h-10 rounded-xl border-2 transition-all duration-300 ${themeColor === c.hex || (!themeColor && c.hex === '#000000') ? 'border-slate-900 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
            >
              <div className="absolute inset-0.5 rounded-lg" style={{ backgroundColor: c.hex }}></div>
              {(themeColor === c.hex || (!themeColor && c.hex === '#000000')) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fas fa-check text-white text-[10px] drop-shadow-md"></i>
                </div>
              )}
            </button>
          ))}
          <div className="relative group">
            <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center overflow-hidden transition-all duration-300 ${themeColor && !colors.find(c => c.hex === themeColor) ? 'border-slate-900 scale-110 shadow-md' : 'border-transparent hover:scale-105 bg-slate-100'}`}>
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
              <input
                type="color"
                value={themeColor || '#000000'}
                onChange={(e) => setThemeColor?.(e.target.value)}
                className="absolute inset-[-10px] w-16 h-16 cursor-pointer opacity-0"
              />
              <i className="fas fa-plus text-[10px] text-slate-400 group-hover:text-slate-700 transition-colors"></i>
            </div>
          </div>
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
          <button onClick={() => {setFontHeading?.('Space Mono'); setFontBody?.('Space Mono')}} className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 font-mono uppercase tracking-wide ${isFontMono ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}>Monospace</button>
          <button onClick={() => {setFontHeading?.('Inter'); setFontBody?.('Inter')}} className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 font-sans ${isFontSans ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}>Modern Sans</button>
          <button onClick={() => {setFontHeading?.('serif'); setFontBody?.('serif')}} className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 font-serif italic ${isFontSerif ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}>Elegant Serif</button>
        </div>
        <div className="w-full h-px bg-slate-100 mt-10"></div>
      </div>

    </div>
  );
}