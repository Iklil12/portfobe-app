"use client";

import React from 'react';

const PRESET_COLORS = [
  '#e1ff00', // Neon Yellow (Default)
  '#ff3366', // Neon Pink
  '#00ffcc', // Neon Cyan
  '#ff9900', // Neon Orange
  '#ccff00', // Lime
  '#ffffff', // White
  '#ff0033', // Red
];

export default function MonolithControls({ themeColor, setThemeColor }: any) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-black uppercase tracking-widest text-slate-800">Highlight Color</label>
        </div>
        <div className="flex flex-wrap gap-3">
          {PRESET_COLORS.map(color => (
            <button
              key={color}
              onClick={() => setThemeColor(color)}
              className={`w-10 h-10 rounded-xl border-2 transition-all duration-300 ${
                themeColor === color ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <p className="text-[10px] text-slate-500 mt-3 font-medium">
          Warna ini akan digunakan untuk elemen highlight, hover state, dan aksen tipografi pada tema Monolith.
        </p>
      </div>
    </div>
  );
}
