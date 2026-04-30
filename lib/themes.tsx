import React from 'react';

export const THEMES_DATA = [
  {
      id: 'minimalist',
      name: 'Minimalist Clean',
      desc: 'Bento Grid, Startup Vibe, Clean Space.',
      preview: 'bg-slate-100',
      isAvailable: true, 
      isPro: false,
      content: (
          <div className="absolute inset-0 flex items-center justify-center p-6 scale-90 w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
              <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-3">
                  <div className="col-span-2 row-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-end p-4 transition-all duration-500 delay-75 group-hover:-translate-y-1">
                      <div className="w-1/2 h-3 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="col-span-1 row-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center transition-all duration-500 delay-100 group-hover:-translate-y-1">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center"><i className="fas fa-bolt text-[8px]"></i></div>
                  </div>
                  <div className="col-span-1 row-span-2 bg-slate-800 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] border border-slate-700 transition-all duration-500 delay-150 group-hover:-translate-y-1"></div>
                  <div className="col-span-2 row-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center px-4 transition-all duration-500 delay-200 group-hover:-translate-y-1">
                      <div className="w-3/4 h-2 bg-slate-200 rounded-full"></div>
                  </div>
              </div>
          </div>
      )
  },
  {
      id: 'brutalism',
      name: 'Neo Brutalism',
      desc: 'Dark mode, Cinematic, Massive Type.',
      preview: 'bg-[#0a0a0a]',
      isAvailable: true, 
      isPro: false,
      img: 'https://images.unsplash.com/photo-1580234797602-22c37b4a6230?q=80&w=600&auto=format&fit=crop'
  },
  {
      id: 'cinematic',
      name: 'Cinematic Dark',
      desc: 'Editorial, High-end, Director Vibe.',
      preview: 'bg-[#0a0a0a]',
      isAvailable: true, 
      isPro: true,
      img: 'https://images.unsplash.com/photo-1580234797602-22c37b4a6230?q=80&w=600&auto=format&fit=crop'
  },
  {
      id: 'acid',
      name: 'Acid Tech',
      desc: 'Cyberpunk, Brutalism, Neon Vibes.',
      preview: 'bg-[#09090b]',
      isAvailable: true, 
      isPro: true,
      img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop'
  },
  {
      id: 'elegant',
      name: 'Elegant Serif',
      desc: 'Earth Tones, Fine Art, Elegant.',
      preview: 'bg-[#e5e5e5]',
      isAvailable: false, 
      img: 'https://images.unsplash.com/photo-1613521140785-e85e427f8002?q=80&w=600&auto=format&fit=crop'
  }
];
