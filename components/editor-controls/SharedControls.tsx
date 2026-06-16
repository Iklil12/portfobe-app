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
    <div className="mb-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/70">Aksen Warna Utama</span>
        <div className="relative flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#1b1b1f] hover:bg-[#222226] border border-white/5 hover:border-white/10 transition-all cursor-pointer">
          <div 
            className="w-3.5 h-3.5 rounded border border-white/10 shrink-0" 
            style={{ backgroundColor: themeColor || '#000000' }}
          />
          <span className="text-xs font-mono font-medium text-white/80 select-all uppercase">
            {themeColor || '#000000'}
          </span>
          <input
            type="color"
            value={themeColor || '#000000'}
            onChange={(e) => setThemeColor(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>
      </div>
      <div className="w-full h-px bg-white/5 mt-6"></div>
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
      <div className="mb-3 px-0.5">
        <h3 className="text-xs font-medium text-white/70">Tipografi Font</h3>
      </div>
      <div className="flex p-1 bg-zinc-900/30 rounded-md border border-white/5 gap-1">
        <button 
          onClick={() => {setFontHeading('Space Mono'); setFontBody?.('Space Mono')}} 
          className={`flex-1 py-2 rounded text-[11px] transition-all duration-300 font-mono ${
            isFontMono 
              ? 'bg-zinc-800 text-white shadow-sm' 
              : 'text-white/40 hover:text-white hover:bg-zinc-800/50'
          }`}
        >
          Monospace
        </button>
        <button 
          onClick={() => {setFontHeading('Inter'); setFontBody?.('Inter')}} 
          className={`flex-1 py-2 rounded text-[11px] transition-all duration-300 font-sans ${
            isFontSans 
              ? 'bg-zinc-800 text-white shadow-sm' 
              : 'text-white/40 hover:text-white hover:bg-zinc-800/50'
          }`}
        >
          Modern
        </button>
        <button 
          onClick={() => {setFontHeading('serif'); setFontBody?.('serif')}} 
          className={`flex-1 py-2 rounded text-[11px] transition-all duration-300 italic font-serif ${
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
      <div className="mb-3 px-0.5">
        <h3 className="text-xs font-medium text-white/70">Gaya Kartu Proyek</h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={() => setCardStyle('hard-shadow')} 
          className={`group relative py-3 px-1 rounded-md border transition-all duration-300 flex flex-col items-center gap-2 active:scale-95 ${
            isCardHard 
              ? 'bg-zinc-800/50 border-white/20 text-white' 
              : 'bg-zinc-900/30 border-white/5 hover:border-white/20 text-white/50 hover:text-white hover:bg-zinc-800/30'
          }`}
        >
          <div className={`w-8 h-8 rounded transition-all duration-300 shrink-0 ${
            isCardHard 
              ? 'bg-zinc-700 border border-white/30 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)]' 
              : 'bg-zinc-800 border border-white/10 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)] group-hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)]'
          }`}></div>
          <span className="text-[10px] font-medium leading-tight text-center">Brutalism</span>
        </button>

        <button 
          onClick={() => setCardStyle('flat')} 
          className={`group relative py-3 px-1 rounded-md border transition-all duration-300 flex flex-col items-center gap-2 active:scale-95 ${
            isCardFlat 
              ? 'bg-zinc-800/50 border-white/20 text-white' 
              : 'bg-zinc-900/30 border-white/5 hover:border-white/20 text-white/50 hover:text-white hover:bg-zinc-800/30'
          }`}
        >
          <div className={`w-8 h-8 rounded transition-all duration-300 shrink-0 ${
            isCardFlat 
              ? 'bg-zinc-700 border border-white/30' 
              : 'bg-zinc-800 border border-white/10 group-hover:border-white/20'
          }`}></div>
          <span className="text-[10px] font-medium leading-tight text-center">Clean Flat</span>
        </button>

        <button 
          onClick={() => setCardStyle('soft-shadow')} 
          className={`group relative py-3 px-1 rounded-md border transition-all duration-300 flex flex-col items-center gap-2 active:scale-95 ${
            isCardSoft 
              ? 'bg-zinc-800/50 border-white/20 text-white' 
              : 'bg-zinc-900/30 border-white/5 hover:border-white/20 text-white/50 hover:text-white hover:bg-zinc-800/30'
          }`}
        >
          <div className={`w-8 h-8 rounded transition-all duration-300 shrink-0 ${
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
      <div className="mb-3 px-0.5">
        <h3 className="text-xs font-medium text-white/70">Bentuk Elemen</h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={() => setButtonShape('hard')} 
          className={`group relative py-3 px-1 rounded-md border transition-all duration-300 flex flex-col items-center gap-2 active:scale-95 ${
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
          className={`group relative py-3 px-1 rounded-md border transition-all duration-300 flex flex-col items-center gap-2 active:scale-95 ${
            isBtnRounded 
              ? 'bg-zinc-800/50 border-white/20 text-white' 
              : 'bg-zinc-900/30 border-white/5 hover:border-white/20 text-white/50 hover:text-white hover:bg-zinc-800/30'
          }`}
        >
          <div className={`w-8 h-4 transition-all duration-300 rounded ${isBtnRounded ? 'bg-white/80' : 'bg-white/20 group-hover:bg-white/40'}`}></div>
          <span className="text-[10px] font-medium leading-tight text-center">Melingkar</span>
        </button>
        <button 
          onClick={() => setButtonShape('pill')} 
          className={`group relative py-3 px-1 rounded-md border transition-all duration-300 flex flex-col items-center gap-2 active:scale-95 ${
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
      <div className="flex items-center mb-3 justify-between px-0.5">
        <h3 className="text-xs font-medium text-white/70">Gaya Navigasi</h3>
        <div className="px-2 py-0.5 rounded text-[9px] font-medium bg-white/5 text-white/40 border border-white/5">
          SOON
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 opacity-50 pointer-events-none">
        <div className="group relative py-3 px-1 rounded-md border flex flex-col items-center gap-2 bg-zinc-900/30 border-white/5 text-white/40">
          <div className="w-8 h-6 flex justify-center pt-1.5">
            <div className="w-5 h-1.5 rounded-full bg-white/20"></div>
          </div>
          <span className="text-[10px] font-medium leading-tight text-center">Floating</span>
        </div>
        <div className="group relative py-3 px-1 rounded-md border flex flex-col items-center gap-2 bg-zinc-900/30 border-white/5 text-white/40">
          <div className="w-8 h-6 flex justify-center">
            <div className="w-full h-1.5 rounded-none bg-white/20"></div>
          </div>
          <span className="text-[10px] font-medium leading-tight text-center">Sticky</span>
        </div>
        <div className="group relative py-3 px-1 rounded-md border flex flex-col items-center gap-2 bg-zinc-900/30 border-white/5 text-white/40">
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

export function GalleryLayoutPicker({ layoutStyle, setLayout }: { layoutStyle?: string, setLayout?: (s: string) => void }) {
  if (!setLayout) return null;
  const isEditorial = layoutStyle === 'editorial' || !layoutStyle;
  const isMasonry = layoutStyle === 'masonry';
  const isGrid = layoutStyle === 'grid';
  const isFluid = layoutStyle === 'fluid';

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-right-4 duration-500 delay-300">
      <div className="mb-3 px-0.5">
        <h3 className="text-xs font-medium text-white/70">Gallery Layout</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => setLayout('editorial')} 
          className={`group relative py-3 px-1 rounded-md border transition-all duration-300 flex flex-col items-center gap-2 active:scale-95 ${
            isEditorial 
              ? 'bg-zinc-800/50 border-white/20 text-white' 
              : 'bg-zinc-900/30 border-white/5 hover:border-white/20 text-white/50 hover:text-white hover:bg-zinc-800/30'
          }`}
        >
          <div className="w-8 h-6 flex gap-1">
            <div className={`w-3/5 h-full rounded-sm transition-all duration-300 ${isEditorial ? 'bg-white/80' : 'bg-white/20 group-hover:bg-white/40'}`}></div>
            <div className="flex flex-col gap-1 w-2/5 h-full">
               <div className={`w-full h-1/2 rounded-sm transition-all duration-300 ${isEditorial ? 'bg-white/60' : 'bg-white/10 group-hover:bg-white/30'}`}></div>
               <div className={`w-full h-1/2 rounded-sm transition-all duration-300 ${isEditorial ? 'bg-white/60' : 'bg-white/10 group-hover:bg-white/30'}`}></div>
            </div>
          </div>
          <span className="text-[10px] font-medium leading-tight text-center">Editorial</span>
        </button>

        <button 
          onClick={() => setLayout('masonry')} 
          className={`group relative py-3 px-1 rounded-md border transition-all duration-300 flex flex-col items-center gap-2 active:scale-95 ${
            isMasonry 
              ? 'bg-zinc-800/50 border-white/20 text-white' 
              : 'bg-zinc-900/30 border-white/5 hover:border-white/20 text-white/50 hover:text-white hover:bg-zinc-800/30'
          }`}
        >
          <div className="w-8 h-6 flex gap-1 items-start">
            <div className={`w-1/2 h-full rounded-sm transition-all duration-300 ${isMasonry ? 'bg-white/80' : 'bg-white/20 group-hover:bg-white/40'}`}></div>
            <div className={`w-1/2 h-3/4 rounded-sm transition-all duration-300 ${isMasonry ? 'bg-white/60' : 'bg-white/10 group-hover:bg-white/30'}`}></div>
          </div>
          <span className="text-[10px] font-medium leading-tight text-center">Masonry</span>
        </button>

        <button 
          onClick={() => setLayout('grid')} 
          className={`group relative py-3 px-1 rounded-md border transition-all duration-300 flex flex-col items-center gap-2 active:scale-95 ${
            isGrid 
              ? 'bg-zinc-800/50 border-white/20 text-white' 
              : 'bg-zinc-900/30 border-white/5 hover:border-white/20 text-white/50 hover:text-white hover:bg-zinc-800/30'
          }`}
        >
          <div className="w-8 h-6 grid grid-cols-2 grid-rows-2 gap-[2px]">
             <div className={`rounded-sm transition-all duration-300 ${isGrid ? 'bg-white/80' : 'bg-white/20 group-hover:bg-white/40'}`}></div>
             <div className={`rounded-sm transition-all duration-300 ${isGrid ? 'bg-white/80' : 'bg-white/20 group-hover:bg-white/40'}`}></div>
             <div className={`rounded-sm transition-all duration-300 ${isGrid ? 'bg-white/80' : 'bg-white/20 group-hover:bg-white/40'}`}></div>
             <div className={`rounded-sm transition-all duration-300 ${isGrid ? 'bg-white/80' : 'bg-white/20 group-hover:bg-white/40'}`}></div>
          </div>
          <span className="text-[10px] font-medium leading-tight text-center">Grid</span>
        </button>

        <button 
          onClick={() => setLayout('fluid')} 
          className={`group relative py-3 px-1 rounded-md border transition-all duration-300 flex flex-col items-center gap-2 active:scale-95 ${
            isFluid 
              ? 'bg-zinc-800/50 border-white/20 text-white' 
              : 'bg-zinc-900/30 border-white/5 hover:border-white/20 text-white/50 hover:text-white hover:bg-zinc-800/30'
          }`}
        >
          <div className="w-8 h-6 flex flex-col gap-[2px]">
             <div className="flex gap-[2px] h-[45%] w-full">
                <div className={`w-3/5 h-full rounded-sm transition-all duration-300 ${isFluid ? 'bg-white/80' : 'bg-white/20 group-hover:bg-white/40'}`}></div>
                <div className={`w-2/5 h-full rounded-sm transition-all duration-300 ${isFluid ? 'bg-white/50' : 'bg-white/10 group-hover:bg-white/30'}`}></div>
             </div>
             <div className="flex gap-[2px] h-[45%] w-full">
                <div className={`w-2/5 h-full rounded-sm transition-all duration-300 ${isFluid ? 'bg-white/50' : 'bg-white/10 group-hover:bg-white/30'}`}></div>
                <div className={`w-3/5 h-full rounded-sm transition-all duration-300 ${isFluid ? 'bg-white/80' : 'bg-white/20 group-hover:bg-white/40'}`}></div>
             </div>
          </div>
          <span className="text-[10px] font-medium leading-tight text-center">Fluid (Original)</span>
        </button>
      </div>
    </div>
  );
}

export function GalleryDesignPicker({ designStyle, setDesign }: { designStyle?: string, setDesign?: (s: string) => void }) {
  if (!setDesign) return null;
  const current = designStyle || 'classic';
  
  const options = [
    { id: 'classic', name: 'Minimal Museum', desc: 'Desain bersih dengan tipografi klasik.' },
    { id: 'editorial', name: 'Editorial Mag', desc: 'Gaya majalah eksklusif dengan aksen garis.' },
    { id: 'glass', name: 'Frosted Glass', desc: 'Tampilan blur modern dengan gradasi latar.' },
    { id: 'cyber', name: 'Cyber Tech', desc: 'Aesthetic futuristik, monospace, dan aksen warna.' },
    { id: 'brutalist', name: 'Neo-Brutalist', desc: 'Desain berani dengan border tebal berenergi.' }
  ];

  return (
    <div className="mb-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-3 px-0.5">
        <h3 className="text-xs font-semibold text-white/70">Gallery Template Desain</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const isActive = current === opt.id;
          const isFullWidth = opt.id === 'brutalist';
          return (
            <button
              key={opt.id}
              onClick={() => setDesign(opt.id)}
              className={`p-2.5 rounded border text-left transition-all duration-200 flex flex-col gap-0.5 active:scale-[0.98] ${
                isFullWidth ? 'col-span-2' : ''
              } ${
                isActive 
                  ? 'bg-zinc-800/80 border-[#ff9e00]/60 text-white shadow-[0_0_10px_rgba(255,158,0,0.1)]' 
                  : 'bg-zinc-900/40 border-white/5 hover:border-white/15 text-white/70 hover:text-white hover:bg-zinc-800/40'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] font-bold tracking-tight">{opt.name}</span>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#ff9e00]"></div>}
              </div>
              <span className="text-[9px] text-white/40 leading-snug truncate w-full">{opt.desc}</span>
            </button>
          );
        })}
      </div>
      <div className="w-full h-px bg-white/5 mt-6"></div>
    </div>
  );
}

