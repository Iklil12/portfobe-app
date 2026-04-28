"use client";

interface StatsData {
  projects: number;
  awards: number;
  links: number;
  themeName: string;
}

interface StatCardsProps {
  stats: StatsData;
  isLoading: boolean;
}

export function StatCards({ stats, isLoading }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-10">
      {/* CARD 1: Projects */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 animate-enter" style={{animationDelay: '100ms'}}>
        <div className="flex justify-between items-start mb-6">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Proyek</p>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><i className="fas fa-folder-open text-xs"></i></div>
        </div>
        <div className="flex items-end justify-between">
          {isLoading ? (
             <div className="w-16 h-10 shimmer rounded-lg"></div>
          ) : (
             <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{stats.projects}</h3>
          )}
          <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-extrabold uppercase border border-slate-100">Live</span>
        </div>
      </div>

      {/* CARD 2: Awards */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 animate-enter" style={{animationDelay: '150ms'}}>
        <div className="flex justify-between items-start mb-6">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Penghargaan</p>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><i className="fas fa-award text-xs"></i></div>
        </div>
        <div className="flex items-end justify-between">
          {isLoading ? (
             <div className="w-16 h-10 shimmer rounded-lg"></div>
          ) : (
             <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{stats.awards}</h3>
          )}
          <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-extrabold uppercase border border-emerald-100">Verified</span>
        </div>
      </div>

      {/* CARD 3: Links */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 animate-enter" style={{animationDelay: '200ms'}}>
        <div className="flex justify-between items-start mb-6">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Tautan Publik</p>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><i className="fas fa-link text-xs"></i></div>
        </div>
        <div className="flex items-end justify-between">
          {isLoading ? (
             <div className="w-16 h-10 shimmer rounded-lg"></div>
          ) : (
             <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{stats.links}</h3>
          )}
          <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-extrabold uppercase shadow-sm">Aktif</span>
        </div>
      </div>

      {/* CARD 4: Active Theme */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 animate-enter" style={{animationDelay: '250ms'}}>
        <div className="flex justify-between items-start mb-6">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 relative flex">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              Active Theme
            </p>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><i className="fas fa-swatchbook text-xs"></i></div>
        </div>
        <div className="flex items-end justify-between">
          {isLoading ? (
             <div className="w-24 h-6 shimmer rounded-md mb-1"></div>
          ) : (
             <h3 className="text-[15px] md:text-base font-black text-slate-900 tracking-tight leading-none truncate pr-2 uppercase italic">{stats.themeName}</h3>
          )}
        </div>
      </div>
    </div>
  );
}
