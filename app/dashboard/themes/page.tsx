"use client";

import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function ThemesPage() {
  
  const handleComingSoon = () => {
    toast('Kustomisasi tema akan segera hadir!', {
      icon: '🎨',
      style: { 
        borderRadius: '12px', 
        background: '#111827', 
        color: '#fff',
        fontWeight: 'bold'
      }
    });
  };

  const themes = [
    {
        id: 'gallery',
        name: 'The Gallery',
        desc: 'Split-screen, Fine Art, Whitespace.',
        preview: 'bg-gray-100',
        content: (
            <div className="absolute inset-0 flex scale-90 group-hover:scale-100 transition-transform duration-700">
                <div className="w-1/3 h-full bg-gray-200 border-r border-gray-300 p-2"><div className="w-full aspect-[4/5] bg-gray-400 mt-4 rounded-sm"></div></div>
                <div className="w-2/3 h-full bg-white p-2 flex flex-col gap-2"><div className="w-full h-1/2 bg-gray-100 rounded-sm"></div><div className="w-full h-1/2 bg-gray-100 rounded-sm"></div></div>
            </div>
        )
    },
    {
        id: 'director',
        name: 'The Director',
        desc: 'Dark mode, Cinematic, Massive Type.',
        preview: 'bg-gray-900',
        img: 'https://images.unsplash.com/photo-1580234797602-22c37b4a6230?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 'minimalist',
        name: 'The Minimalist',
        desc: 'Bento Grid, Startup Vibe, Clean.',
        preview: 'bg-gray-50',
        img: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=400&auto=format&fit=crop'
    }
  ];

  return (
    <main className="max-w-6xl mx-auto p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <Toaster position="top-center" />

      {/* HEADER */}
      <div className="mb-10">
        <h3 className="text-3xl font-black text-gray-900 tracking-tight">Koleksi Tema</h3>
        <p className="text-sm text-gray-500 mt-1">Pilih fondasi portofoliomu sebelum menyesuaikan desain.</p>
      </div>

      {/* THEME GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {themes.map((theme) => (
            <div key={theme.id} className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-gray-100 transition-all group flex flex-col">
                <div className={`aspect-[4/3] ${theme.preview} relative overflow-hidden`}>
                    {theme.img ? (
                        <img src={theme.img} className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700" alt={theme.name} />
                    ) : (
                        theme.content
                    )}
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                        <button 
                            onClick={handleComingSoon}
                            className="bg-white text-gray-900 px-7 py-3 rounded-full text-xs font-black shadow-xl hover:scale-105 active:scale-90 transition-all"
                        >
                            GUNAKAN & EDIT
                        </button>
                    </div>
                </div>
                <div className="p-7">
                    <h4 className="font-black text-gray-900 text-lg tracking-tight">{theme.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{theme.desc}</p>
                </div>
            </div>
        ))}

        {/* Placeholder untuk tema yang akan datang */}
        <div className="border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center p-8 bg-gray-50/30 opacity-60">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                <i className="fas fa-magic text-gray-300"></i>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">More Themes Soon</p>
        </div>
      </div>

      {/* VISUAL COMING SOON: THEME EDITOR PREVIEW */}
      <div 
        onClick={handleComingSoon}
        className="relative overflow-hidden bg-white p-10 rounded-[3rem] border border-dashed border-gray-200 cursor-pointer group hover:border-blue-200 transition-all"
      >
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
            <i className="fas fa-palette text-[15rem] -rotate-12"></i>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 rotate-3 group-hover:rotate-0 transition-transform">
                <i className="fas fa-swatchbook text-2xl"></i>
            </div>
            <h4 className="text-2xl font-black text-gray-900 mb-2">Live Theme Editor</h4>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Kami sedang menyiapkan fitur **Editor Visual** yang memungkinkan Anda mengubah tata letak, warna, tipografi, dan efek secara langsung dengan sistem <i>Real-time Preview</i>.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
                {['Custom Colors', 'Typography', 'Bento Layout', 'Dark Mode'].map((tag) => (
                    <span key={tag} className="px-4 py-1.5 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-full uppercase tracking-tighter border border-gray-100">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-xl shadow-gray-200 active:scale-95 transition-all">
                <i className="fas fa-lock text-[10px]"></i> Coming Soon
            </div>
        </div>
      </div>

    </main>
  );
}