//components/editor-controls/SharedControls.tsx
"use client";

import React from 'react';
import { Palette, Type, LayoutGrid, Shapes, Check, Plus } from 'lucide-react';

export interface ThemeControlProps {
  themeColor?: string;
  setThemeColor?: (color: string) => void;
  fontHeading?: string;
  setFontHeading?: (font: string) => void;
  fontBody?: string;
  setFontBody?: (font: string) => void;
  cardStyle?: string;
  setCardStyle?: (style: string) => void;
  buttonShape?: string;
  setButtonShape?: (shape: string) => void;
}

const DEFAULT_COLORS = [
  { name: 'Noir', hex: '#000000' },
  { name: 'Slate', hex: '#64748b' },
  { name: 'Navy', hex: '#0f172a' },
  { name: 'Crimson', hex: '#991b1b' },
  { name: 'Forest', hex: '#166534' },
  { name: 'Azure', hex: '#2563eb' },
  { name: 'Amber', hex: '#ff9e00' } // updated to our premium accent color
];

export function ColorPicker({ themeColor, setThemeColor }: { themeColor?: string, setThemeColor?: (c: string) => void }) {
  if (!setThemeColor) return null;
  return (
    <div className="mb-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-none flex items-center justify-center text-white/40 bg-zinc-900 border border-white/5">
          <Palette className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">Aksen Warna Utama</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {DEFAULT_COLORS.map((c) => (
          <button
            key={c.name}
            onClick={() => setThemeColor(c.hex)}
            className={`group relative w-10 h-10 rounded-none border-2 transition-all duration-300 ${
              themeColor?.toLowerCase() === c.hex.toLowerCase() || (!themeColor && c.hex === '#000000') 
                ? 'border-[#ff9e00] scale-110' 
                : 'border-white/10 hover:border-white hover:scale-105'
            }`}
          >
            <div className="absolute inset-[3px] rounded-none" style={{ backgroundColor: c.hex }}></div>
            {(themeColor?.toLowerCase() === c.hex.toLowerCase() || (!themeColor && c.hex === '#000000')) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />
              </div>
            )}
          </button>
        ))}
        <div className="relative group">
          <div className={`w-10 h-10 rounded-none border flex items-center justify-center overflow-hidden transition-all duration-300 ${
            themeColor && !DEFAULT_COLORS.find(c => c.hex.toLowerCase() === themeColor.toLowerCase()) 
              ? 'border-[#ff9e00] scale-105' 
              : 'border-white/10 hover:border-[#ff9e00] bg-zinc-950'
          }`}>
            <input
              type="color"
              value={themeColor || '#000000'}
              onChange={(e) => setThemeColor(e.target.value)}
              className="absolute inset-[-10px] w-16 h-16 cursor-pointer opacity-0"
            />
            <Plus className="w-3.5 h-3.5 text-white/40 group-hover:text-[#ff9e00] transition-colors" />
          </div>
        </div>
      </div>
      <div className="w-full h-px bg-white/5 mt-10"></div>
    </div>
  );
}

export function FontPicker({ fontHeading, setFontHeading, setFontBody }: { fontHeading?: string, setFontHeading?: (f: string) => void, setFontBody?: (f: string) => void }) {
  if (!setFontHeading) return null;
  const isFontMono = fontHeading?.toLowerCase().includes('space') || fontHeading?.toLowerCase().includes('mono');
  const isFontSerif = fontHeading?.toLowerCase().includes('serif') || fontHeading?.toLowerCase().includes('elegant') || fontHeading?.toLowerCase().includes('playfair');
  const isFontSans = !isFontMono && !isFontSerif;

  return (
    <div className="mb-10 animate-in fade-in slide-in-from-right-4 duration-500 delay-75">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-none flex items-center justify-center text-white/40 bg-zinc-900 border border-white/5">
          <Type className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">Tipografi Font</h3>
      </div>
      <div className="flex p-1 bg-zinc-950 rounded-none border border-white/10">
        <button 
          onClick={() => {setFontHeading('Space Mono'); setFontBody?.('Space Mono')}} 
          className={`flex-1 py-3 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
            isFontMono 
              ? 'bg-zinc-900 text-white border border-white/10 shadow-sm' 
              : 'text-white/40 hover:text-white hover:bg-zinc-900/30'
          }`}
        >
          Monospace
        </button>
        <button 
          onClick={() => {setFontHeading('Inter'); setFontBody?.('Inter')}} 
          className={`flex-1 py-3 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
            isFontSans 
              ? 'bg-zinc-900 text-white border border-white/10 shadow-sm' 
              : 'text-white/40 hover:text-white hover:bg-zinc-900/30'
          }`}
        >
          Modern Sans
        </button>
        <button 
          onClick={() => {setFontHeading('serif'); setFontBody?.('serif')}} 
          className={`flex-1 py-3 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 italic ${
            isFontSerif 
              ? 'bg-zinc-900 text-white border border-white/10 shadow-sm' 
              : 'text-white/40 hover:text-white hover:bg-zinc-900/30'
          }`}
        >
          Elegant Serif
        </button>
      </div>
      <div className="w-full h-px bg-white/5 mt-10"></div>
    </div>
  );
}

export function CardStylePicker({ cardStyle, setCardStyle }: { cardStyle?: string, setCardStyle?: (s: string) => void }) {
  if (!setCardStyle) return null;
  const isCardHard = cardStyle === 'hard-shadow' || cardStyle === 'hard';
  const isCardFlat = cardStyle === 'flat';
  const isCardSoft = cardStyle === 'soft-shadow' || cardStyle === 'soft';

  return (
    <div className="mb-10 animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-none flex items-center justify-center text-white/40 bg-zinc-900 border border-white/5">
          <LayoutGrid className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">Gaya Kartu Proyek</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={() => setCardStyle('hard-shadow')} 
          className={`group relative py-4 rounded-none border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${
            isCardHard 
              ? 'bg-[#ff9e00] border-[#ff9e00] text-black' 
              : 'bg-zinc-950 border-white/10 hover:border-[#ff9e00] text-white/40 hover:text-white'
          }`}
        >
          <div className={`w-8 h-8 rounded-none transition-all duration-300 shrink-0 ${
            isCardHard 
              ? 'bg-black border border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)]' 
              : 'bg-zinc-900 border border-white/20 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] group-hover:border-white group-hover:shadow-[3px_3px_0px_0px_#ff9e00]'
          }`}></div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Brutalism</span>
        </button>

        <button 
          onClick={() => setCardStyle('flat')} 
          className={`group relative py-4 rounded-none border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${
            isCardFlat 
              ? 'bg-[#ff9e00] border-[#ff9e00] text-black' 
              : 'bg-zinc-950 border-white/10 hover:border-[#ff9e00] text-white/40 hover:text-white'
          }`}
        >
          <div className={`w-8 h-8 rounded-none transition-all duration-300 shrink-0 ${
            isCardFlat 
              ? 'bg-black border border-white/30' 
              : 'bg-zinc-900 border border-white/10 group-hover:border-white'
          }`}></div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Clean Flat</span>
        </button>

        <button 
          onClick={() => setCardStyle('soft-shadow')} 
          className={`group relative py-4 rounded-none border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${
            isCardSoft 
              ? 'bg-[#ff9e00] border-[#ff9e00] text-black' 
              : 'bg-zinc-950 border-white/10 hover:border-[#ff9e00] text-white/40 hover:text-white'
          }`}
        >
          <div className={`w-8 h-8 rounded-none transition-all duration-300 shrink-0 ${
            isCardSoft 
              ? 'bg-black shadow-[0_4px_15px_rgba(255,255,255,0.1)]' 
              : 'bg-zinc-900 border border-white/10 group-hover:border-white group-hover:shadow-[0_4px_15px_rgba(255,158,0,0.15)]'
          }`}></div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Soft Drop</span>
        </button>
      </div>
      <div className="w-full h-px bg-white/5 mt-10"></div>
    </div>
  );
}

export function ButtonShapePicker({ buttonShape, setButtonShape }: { buttonShape?: string, setButtonShape?: (s: string) => void }) {
  if (!setButtonShape) return null;
  const isBtnHard = buttonShape === 'hard' || buttonShape === 'square';
  const isBtnRounded = buttonShape === 'rounded';
  const isBtnPill = buttonShape === 'pill';

  return (
    <div className="mb-10 animate-in fade-in slide-in-from-right-4 duration-500 delay-150">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-none flex items-center justify-center text-white/40 bg-zinc-900 border border-white/5">
          <Shapes className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">Bentuk Elemen</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={() => setButtonShape('hard')} 
          className={`group relative py-4 rounded-none border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${
            isBtnHard 
              ? 'bg-[#ff9e00] border-[#ff9e00] text-black' 
              : 'bg-zinc-950 border-white/10 hover:border-[#ff9e00] text-white/40 hover:text-white'
          }`}
        >
          <div className={`w-8 h-4 transition-all duration-300 rounded-none ${isBtnHard ? 'bg-black' : 'bg-white/10 group-hover:bg-white/30'}`}></div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Kotak</span>
        </button>
        <button 
          onClick={() => setButtonShape('rounded')} 
          className={`group relative py-4 rounded-none border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${
            isBtnRounded 
              ? 'bg-[#ff9e00] border-[#ff9e00] text-black' 
              : 'bg-zinc-950 border-white/10 hover:border-[#ff9e00] text-white/40 hover:text-white'
          }`}
        >
          <div className={`w-8 h-4 transition-all duration-300 rounded-md ${isBtnRounded ? 'bg-black' : 'bg-white/10 group-hover:bg-white/30'}`}></div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Melingkar</span>
        </button>
        <button 
          onClick={() => setButtonShape('pill')} 
          className={`group relative py-4 rounded-none border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${
            isBtnPill 
              ? 'bg-[#ff9e00] border-[#ff9e00] text-black' 
              : 'bg-zinc-950 border-white/10 hover:border-[#ff9e00] text-white/40 hover:text-white'
          }`}
        >
          <div className={`w-8 h-4 transition-all duration-300 rounded-full ${isBtnPill ? 'bg-black' : 'bg-white/10 group-hover:bg-white/30'}`}></div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Kapsul</span>
        </button>
      </div>
    </div>
  );
}
