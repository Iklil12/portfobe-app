import React from 'react';
import { Layers, Palette, ExternalLink } from 'lucide-react';

export function ThemeHeader({ state }: { state: any }) {
  const { subdomain } = state;

  return (
    <div className="mb-12 animate-enter flex flex-col md:flex-row md:justify-between md:items-end gap-6 mt-4">
      <div className="text-center md:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-zinc-900 border border-white/10 text-[9px] font-mono font-bold uppercase tracking-wider text-white/50 mb-6 shadow-sm">
          <Layers className="w-3.5 h-3.5 text-white/40" /> Desain Visual
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold uppercase tracking-wider text-white mb-4 flex items-center justify-center md:justify-start gap-3">
          Koleksi Tema
          <Palette className="w-5 h-5 text-white/30 animate-spin-slow" />
        </h1>
        <p className="text-white/40 font-mono text-xs max-w-xl leading-relaxed">
          Tentukan fondasi estetika portofoliomu. Klik salah satu tema untuk mulai merakit dan mendesain.
        </p>
      </div>
      
      {subdomain && (
        <div className="flex justify-center md:justify-end">
          <a 
            href={`/${subdomain}`} 
            target="_blank" 
            rel="noreferrer"
            className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-zinc-900 border border-white/10 text-white rounded-none text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-none active:scale-95"
          >
            <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
            Lihat Portofolio
          </a>
        </div>
      )}
    </div>
  );
}
