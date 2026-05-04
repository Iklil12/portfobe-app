"use client";

import React from 'react';

const PRESET_COLORS = [
  '#ff9e00', // Amber (Default)
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#8b5cf6', // Violet
  '#f43f5e', // Rose
  '#ec4899', // Pink
  '#14b8a6', // Teal
];

export default function BentoGridControls({ themeColor, setThemeColor }: any) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-black uppercase tracking-widest text-slate-800">Aksen Warna</label>
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
          Warna ini akan digunakan pada efek glow dan elemen highlight.
        </p>
      </div>
    </div>
  );
}
