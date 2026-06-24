import React from 'react';
import { Crown, SwatchBook, Lock } from 'lucide-react';
import { ThemesState, ThemesActions } from '../model/useThemes';


export function ProBanner({ actions }: { actions: ThemesActions }) {
  const { handleProComingSoon } = actions;

  return (
    <div 
      onClick={handleProComingSoon}
      className="relative overflow-hidden bg-[#0a0a0a] p-10 md:p-16 rounded-none border border-white/10 cursor-pointer group hover:border-[#ff9e00]/40 transition-colors animate-enter"
      style={{animationDelay: '700ms'}}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-[0.03]"></div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[300px] bg-[#ff9e00]/5 blur-[100px] rounded-full group-hover:opacity-100 opacity-50 transition-opacity duration-700"></div>
 
      <div className="absolute -top-10 -right-10 p-10 opacity-[0.01] group-hover:scale-105 transition-transform duration-1000 pointer-events-none text-white">
        <SwatchBook className="w-80 h-80" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-white/10 bg-zinc-900 text-[9px] font-mono font-bold uppercase tracking-wider text-white/50 mb-8 backdrop-blur-sm">
            <Crown className="w-3 h-3 text-[#ff9e00]" /> Pro Feature
          </div>

          <h4 className="text-2xl md:text-3xl font-display font-bold text-white mb-5 uppercase tracking-wider">
            Live Theme <span className="text-[#ff9e00]">Editor</span>
          </h4>
          
          <p className="text-white/40 text-xs font-mono leading-relaxed mb-10 max-w-lg group-hover:text-white/60 transition-colors duration-500">
            Kendalikan setiap piksel portofoliomu. Ubah tata letak, warna, tipografi, dan efek secara instan dengan editor visual kelas studio profesional.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {['Color Palettes', 'Typography', 'Grid Control', 'Dark Mode Switch'].map((tag) => (
              <span key={tag} className="px-4 py-2 bg-zinc-900 text-white/50 text-[9px] font-mono font-bold rounded-none uppercase tracking-wider border border-white/10 hover:bg-zinc-800 hover:text-white transition-colors cursor-default backdrop-blur-md">
                {tag}
              </span>
            ))}
          </div>

          <div className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-900 border border-white/10 text-white/70 hover:bg-zinc-800 hover:text-white rounded-none text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-300 active:scale-95">
            <Lock className="w-3.5 h-3.5 text-white/40" /> Segera Hadir
          </div>
      </div>
    </div>
  );
}
