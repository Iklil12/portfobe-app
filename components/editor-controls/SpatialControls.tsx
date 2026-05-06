"use client";

import React from 'react';

const PRESET_COLORS = [
  '#6366f1', // Indigo (Default)
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#10b981', // Emerald
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
];

export default function SpatialControls({ themeColor, setThemeColor }: any) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-black uppercase tracking-widest text-slate-800">Aura Color</label>
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
          Warna ini akan digunakan untuk efek aura pada background dan elemen highlight.
        </p>
      </div>
    </div>
  );
}
