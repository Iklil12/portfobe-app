import React from 'react';
import { LazyImage } from '@/components/ui/LazyImage';

export function ThemeGrid({ themes, state, actions }: { themes: any[], state: any, actions: any }) {
  const { currentTheme, favorites = [] } = state;
  const { handleUseTheme, toggleFavorite } = actions;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-24">
      {themes.map((theme, index) => {
          const isActive = currentTheme === theme.id;
          const isFavorite = favorites.includes(theme.id);

          return (
            <div 
              key={theme.id} 
              className={`animate-enter group relative rounded-[2.5rem] overflow-hidden transition-all duration-500 h-[450px] bg-slate-100
                ${isActive ? 'border-2 border-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.12)] scale-[1.02] ring-4 ring-slate-900/5 z-10' : 
                theme.isAvailable ? 'border border-slate-200/60 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2' : 
                'border border-slate-200/60 opacity-90'} 
              `}
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
                <div className="absolute inset-0 bg-slate-100">
                    {theme.img ? (
                        <LazyImage 
                          src={theme.img} 
                          className={`w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 ${!theme.isAvailable && 'blur-[2px] grayscale'}`} 
                          alt={theme.name} 
                        />
                    ) : (
                        theme.content
                    )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/90 opacity-70 group-hover:opacity-80 transition-opacity duration-500 z-10"></div>
                
                {/* FAVORITE BUTTON */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(theme.id); }}
                  className={`absolute top-4 right-4 z-30 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border
                    ${isFavorite
                      ? 'bg-rose-500 border-rose-400 text-white scale-110 shadow-lg shadow-rose-500/30'
                      : 'bg-black/60 border-white/10 text-white/50 hover:bg-rose-500/80 hover:border-rose-400 hover:text-white opacity-0 group-hover:opacity-100'
                    }`}
                  title={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                >
                  <i className={`${isFavorite ? 'fas' : 'far'} fa-heart text-[11px]`}></i>
                </button>
                
                <div className="absolute top-5 left-5 z-30 flex flex-col gap-2">
                  {isActive ? (
                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-900 bg-white px-3 py-1.5 rounded-xl shadow-lg border border-white/20">
                      <i className="fas fa-check-circle text-emerald-500"></i> Dipakai
                    </span>
                  ) : !theme.isAvailable && (
                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10">
                      <i className="fas fa-lock"></i> Segera
                    </span>
                  )}
                  
                  {theme.isPro && (
                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white bg-slate-900 px-3 py-1.5 rounded-xl shadow-xl border border-white/10">
                      <i className="fas fa-crown text-[#ff9e00]"></i> PRO
                    </span>
                  )}
                </div>

                <div className="absolute inset-x-3 bottom-3 bg-slate-900/80 border border-white/10 rounded-[2rem] p-5 sm:p-6 flex flex-col transform transition-all duration-500 z-20">
                    
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-extrabold text-xl sm:text-2xl tracking-tight text-white drop-shadow-sm`}>
                        {theme.name}
                      </h4>
                      {!isActive && theme.isAvailable && (
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0">
                          <i className="fas fa-arrow-right text-[10px] -rotate-45"></i>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-[11px] sm:text-xs font-medium text-slate-300 leading-relaxed mb-6">
                      {theme.desc}
                    </p>

                    <button 
                        onClick={() => handleUseTheme(theme.id, theme.name)}
                        disabled={!theme.isAvailable && !isActive}
                        className={`w-full py-3.5 rounded-xl text-[11px] font-extrabold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 border
                          ${isActive 
                            ? 'bg-white text-slate-900 border-white shadow-md hover:bg-slate-100' 
                            : theme.isAvailable 
                              ? 'bg-slate-800/80 text-white border-slate-700 hover:bg-white hover:text-slate-900' 
                              : 'bg-slate-800/50 text-slate-500 border-slate-700/50 cursor-not-allowed opacity-60'
                          }
                        `}
                    >
                        {theme.isAvailable ? (
                          isActive ? (
                            <> <i className="fas fa-cog"></i> Kustomisasi </>
                          ) : (
                            <> <i className="fas fa-magic"></i> Gunakan </>
                          )
                        ) : (
                          <> <i className="fas fa-clock"></i> Tahap Desain </>
                        )}
                    </button>
                </div>
            </div>
          );
      })}

      <div className="animate-enter border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-500 group cursor-default" style={{ animationDelay: '600ms' }}>
          <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 group-hover:bg-slate-900">
              <i className="fas fa-paint-brush text-slate-400 group-hover:text-white transition-colors"></i>
          </div>
          <h4 className="font-extrabold text-slate-700 text-lg mb-1 group-hover:text-slate-900 transition-colors">Tema Lainnya</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Sedang dirancang oleh desainer.</p>
      </div>
    </div>
  );
}
