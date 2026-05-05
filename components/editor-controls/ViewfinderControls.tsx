"use client";
import React from 'react';

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

export default function ViewfinderControls({
  themeColor, setThemeColor,
}: ThemeControlProps) {
  
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* KONTROL WARNA AKSEN */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><i className="fas fa-palette text-[10px]"></i></div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Warna Lampu Indikator (REC)</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {['#FF0033', '#00ff00', '#00d4ff', '#ff9e00', '#f1c40f', '#9b59b6'].map(color => (
            <button key={color} onClick={() => setThemeColor(color)} className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${themeColor.toLowerCase() === color ? 'border-white scale-110 shadow-[0_0_15px_rgba(0,0,0,0.15)] ring-[3px] ring-slate-900' : 'border-transparent shadow-sm'}`} style={{ backgroundColor: color }} />
          ))}
          <label className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 cursor-pointer hover:border-slate-500 hover:text-slate-600 hover:scale-105 transition-all duration-300 overflow-hidden group">
            <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="absolute inset-[-20px] w-20 h-20 opacity-0 cursor-pointer z-10" />
            <i className="fas fa-plus text-[10px] group-hover:scale-110 transition-transform"></i>
          </label>
        </div>
        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
          Warna ini akan mengubah lampu indikator REC, garis seleksi teks, tombol *hover*, dan aksen utama pada tema Cinematic Viewfinder Anda.
        </p>
        <div className="w-full h-px bg-slate-100 mt-10"></div>
      </div>
      
    </div>
  );
}
