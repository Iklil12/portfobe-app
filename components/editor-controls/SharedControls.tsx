//components/editor-controls/SharedControls.tsx
"use client";

import React from 'react';
import { Palette, Type, LayoutGrid, Shapes, Check, Plus, Menu } from 'lucide-react';

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
    <div className="mb-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-6 h-6 rounded-md flex items-center justify-center text-white/50 bg-zinc-900/50 border border-white/5">
          <Palette className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-xs font-medium text-white/70">Aksen Warna Utama</h3>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {DEFAULT_COLORS.map((c) => (
          <button
            key={c.name}
            onClick={() => setThemeColor(c.hex)}
            className={`group relative w-10 h-10 rounded-full border-2 transition-all duration-300 ${
              themeColor?.toLowerCase() === c.hex.toLowerCase() || (!themeColor && c.hex === '#000000') 
                ? 'border-[#ff9e00] scale-110 shadow-[0_0_15px_rgba(255,158,0,0.2)]' 
                : 'border-white/5 hover:border-white/30 hover:scale-105'
            }`}
          >
            <div className="absolute inset-[2px] rounded-full" style={{ backgroundColor: c.hex }}></div>
            {(themeColor?.toLowerCase() === c.hex.toLowerCase() || (!themeColor && c.hex === '#000000')) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-4 h-4 text-white mix-blend-difference" />
              </div>
            )}
          </button>
        ))}
        <div className="relative group">
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all duration-300 ${
            themeColor && !DEFAULT_COLORS.find(c => c.hex.toLowerCase() === themeColor.toLowerCase()) 
              ? 'border-[#ff9e00] scale-110 shadow-[0_0_15px_rgba(255,158,0,0.2)]' 
              : 'border-white/5 hover:border-white/30 bg-zinc-900/50'
          }`}>
            <input
              type="color"
              value={themeColor || '#000000'}
              onChange={(e) => setThemeColor(e.target.value)}
              className="absolute inset-[-10px] w-16 h-16 cursor-pointer opacity-0"
            />
            <Plus className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
      <div className="w-full h-px bg-white/5 mt-8"></div>
    </div>
  );
}

export function FontPicker({ fontHeading, setFontHeading, setFontBody }: { fontHeading?: string, setFontHeading?: (f: string) => void, setFontBody?: (f: string) => void }) {
  if (!setFontHeading) return null;
  const isFontMono = fontHeading?.toLowerCase().includes('space') || fontHeading?.toLowerCase().includes('mono');
  const isFontSerif = fontHeading?.toLowerCase().includes('serif') || fontHeading?.toLowerCase().includes('elegant') || fontHeading?.toLowerCase().includes('playfair');
  const isFontSans = !isFontMono && !isFontSerif;

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-right-4 duration-500 delay-75">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-6 h-6 rounded-md flex items-center justify-center text-white/50 bg-zinc-900/50 border border-white/5">
          <Type className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-xs font-medium text-white/70">Tipografi Font</h3>
      </div>
      <div className="flex p-1 bg-zinc-900/30 rounded-lg border border-white/5 gap-1">
        <button 
          onClick={() => {setFontHeading('Space Mono'); setFontBody?.('Space Mono')}} 
          className={`flex-1 py-2 rounded-md text-[11px] transition-all duration-300 font-mono ${
            isFontMono 
              ? 'bg-zinc-800 text-white shadow-sm' 
              : 'text-white/40 hover:text-white hover:bg-zinc-800/50'
          }`}
        >
          Monospace
        </button>
        <button 
          onClick={() => {setFontHeading('Inter'); setFontBody?.('Inter')}} 
          className={`flex-1 py-2 rounded-md text-[11px] transition-all duration-300 font-sans ${
            isFontSans 
              ? 'bg-zinc-800 text-white shadow-sm' 
              : 'text-white/40 hover:text-white hover:bg-zinc-800/50'
          }`}
        >
          Modern
        </button>
        <button 
          onClick={() => {setFontHeading('serif'); setFontBody?.('serif')}} 
          className={`flex-1 py-2 rounded-md text-[11px] transition-all duration-300 italic font-serif ${
            isFontSerif 
              ? 'bg-zinc-800 text-white shadow-sm' 
              : 'text-white/40 hover:text-white hover:bg-zinc-800/50'
          }`}
        >
          Elegant
        </button>
      </div>
      <div className="w-full h-px bg-white/5 mt-8"></div>
    </div>
  );
}

export function CardStylePicker({ cardStyle, setCardStyle }: { cardStyle?: string, setCardStyle?: (s: string) => void }) {
  if (!setCardStyle) return null;
  const isCardHard = cardStyle === 'hard-shadow' || cardStyle === 'hard';
  const isCardFlat = cardStyle === 'flat';
  const isCardSoft = cardStyle === 'soft-shadow' || cardStyle === 'soft';

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-6 h-6 rounded-md flex items-center justify-center text-white/50 bg-zinc-900/50 border border-white/5">
          <LayoutGrid className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-xs font-medium text-white/70">Gaya Kartu Proyek</h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={() => setCardStyle('hard-shadow')} 
          className={`group relative py-3 px-1 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 active:scale-95 ${
            isCardHard 
              ? 'bg-zinc-800/50 border-white/20 text-white' 
              : 'bg-zinc-900/30 border-white/5 hover:border-white/20 text-white/50 hover:text-white hover:bg-zinc-800/30'
          }`}
        >
          <div className={`w-8 h-8 rounded-md transition-all duration-300 shrink-0 ${
            isCardHard 
              ? 'bg-zinc-700 border border-white/30 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)]' 
              : 'bg-zinc-800 border border-white/10 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)] group-hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)]'
          }`}></div>
          <span className="text-[10px] font-medium leading-tight text-center">Brutalism</span>
        </button>

        <button 
          onClick={() => setCardStyle('flat')} 
          className={`group relative py-3 px-1 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 active:scale-95 ${
            isCardFlat 
              ? 'bg-zinc-800/50 border-white/20 text-white' 
              : 'bg-zinc-900/30 border-white/5 hover:border-white/20 text-white/50 hover:text-white hover:bg-zinc-800/30'
          }`}
        >
          <div className={`w-8 h-8 rounded-md transition-all duration-300 shrink-0 ${
            isCardFlat 
              ? 'bg-zinc-700 border border-white/30' 
              : 'bg-zinc-800 border border-white/10 group-hover:border-white/20'
          }`}></div>
          <span className="text-[10px] font-medium leading-tight text-center">Clean Flat</span>
        </button>

        <button 
          onClick={() => setCardStyle('soft-shadow')} 
          className={`group relative py-3 px-1 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 active:scale-95 ${
            isCardSoft 
              ? 'bg-zinc-800/50 border-white/20 text-white' 
              : 'bg-zinc-900/30 border-white/5 hover:border-white/20 text-white/50 hover:text-white hover:bg-zinc-800/30'
          }`}
        >
          <div className={`w-8 h-8 rounded-md transition-all duration-300 shrink-0 ${
            isCardSoft 
              ? 'bg-zinc-700 shadow-[0_4px_15px_rgba(255,255,255,0.1)]' 
              : 'bg-zinc-800 border border-white/10 group-hover:border-white/20 group-hover:shadow-[0_4px_12px_rgba(255,255,255,0.05)]'
          }`}></div>
          <span className="text-[10px] font-medium leading-tight text-center">Soft Drop</span>
        </button>
      </div>
      <div className="w-full h-px bg-white/5 mt-8"></div>
    </div>
  );
}

export function ButtonShapePicker({ buttonShape, setButtonShape }: { buttonShape?: string, setButtonShape?: (s: string) => void }) {
  if (!setButtonShape) return null;
  const isBtnHard = buttonShape === 'hard' || buttonShape === 'square';
  const isBtnRounded = buttonShape === 'rounded';
  const isBtnPill = buttonShape === 'pill';

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-right-4 duration-500 delay-150">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-6 h-6 rounded-md flex items-center justify-center text-white/50 bg-zinc-900/50 border border-white/5">
          <Shapes className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-xs font-medium text-white/70">Bentuk Elemen</h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={() => setButtonShape('hard')} 
          className={`group relative py-3 px-1 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 active:scale-95 ${
            isBtnHard 
              ? 'bg-zinc-800/50 border-white/20 text-white' 
              : 'bg-zinc-900/30 border-white/5 hover:border-white/20 text-white/50 hover:text-white hover:bg-zinc-800/30'
          }`}
        >
          <div className={`w-8 h-4 transition-all duration-300 rounded-none ${isBtnHard ? 'bg-white/80' : 'bg-white/20 group-hover:bg-white/40'}`}></div>
          <span className="text-[10px] font-medium leading-tight text-center">Kotak</span>
        </button>
        <button 
          onClick={() => setButtonShape('rounded')} 
          className={`group relative py-3 px-1 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 active:scale-95 ${
            isBtnRounded 
              ? 'bg-zinc-800/50 border-white/20 text-white' 
              : 'bg-zinc-900/30 border-white/5 hover:border-white/20 text-white/50 hover:text-white hover:bg-zinc-800/30'
          }`}
        >
          <div className={`w-8 h-4 transition-all duration-300 rounded-md ${isBtnRounded ? 'bg-white/80' : 'bg-white/20 group-hover:bg-white/40'}`}></div>
          <span className="text-[10px] font-medium leading-tight text-center">Melingkar</span>
        </button>
        <button 
          onClick={() => setButtonShape('pill')} 
          className={`group relative py-3 px-1 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 active:scale-95 ${
            isBtnPill 
              ? 'bg-zinc-800/50 border-white/20 text-white' 
              : 'bg-zinc-900/30 border-white/5 hover:border-white/20 text-white/50 hover:text-white hover:bg-zinc-800/30'
          }`}
        >
          <div className={`w-8 h-4 transition-all duration-300 rounded-full ${isBtnPill ? 'bg-white/80' : 'bg-white/20 group-hover:bg-white/40'}`}></div>
          <span className="text-[10px] font-medium leading-tight text-center">Kapsul</span>
        </button>
      </div>
    </div>
  );
}

export function NavigationStylePicker({ navStyle, setNavStyle }: { navStyle?: string, setNavStyle?: (s: string) => void }) {
  if (!setNavStyle) return null;
  const isFloating = navStyle === 'floating';
  const isSticky = navStyle === 'sticky' || !navStyle; // default
  const isMinimalist = navStyle === 'minimalist';

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
      <div className="flex items-center gap-2.5 mb-4 justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-white/50 bg-zinc-900/50 border border-white/5">
            <Menu className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-medium text-white/70">Gaya Navigasi</h3>
        </div>
        <div className="px-2 py-0.5 rounded text-[9px] font-medium bg-white/5 text-white/40 border border-white/5">
          SOON
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 opacity-50 pointer-events-none">
        <div className="group relative py-3 px-1 rounded-xl border flex flex-col items-center gap-2 bg-zinc-900/30 border-white/5 text-white/40">
          <div className="w-8 h-6 flex justify-center pt-1.5">
            <div className="w-5 h-1.5 rounded-full bg-white/20"></div>
          </div>
          <span className="text-[10px] font-medium leading-tight text-center">Floating</span>
        </div>
        <div className="group relative py-3 px-1 rounded-xl border flex flex-col items-center gap-2 bg-zinc-900/30 border-white/5 text-white/40">
          <div className="w-8 h-6 flex justify-center">
            <div className="w-full h-1.5 rounded-none bg-white/20"></div>
          </div>
          <span className="text-[10px] font-medium leading-tight text-center">Sticky</span>
        </div>
        <div className="group relative py-3 px-1 rounded-xl border flex flex-col items-center gap-2 bg-zinc-900/30 border-white/5 text-white/40">
          <div className="w-8 h-6 flex justify-end pr-1.5 pt-1.5">
            <div className="flex flex-col gap-[2px]">
              <div className="w-3 h-[1.5px] rounded-full bg-white/30"></div>
              <div className="w-3 h-[1.5px] rounded-full bg-white/30"></div>
              <div className="w-3 h-[1.5px] rounded-full bg-white/30"></div>
            </div>
          </div>
          <span className="text-[10px] font-medium leading-tight text-center">Minimalist</span>
        </div>
      </div>
    </div>
  );
}

