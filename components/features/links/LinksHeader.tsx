import React from 'react';

interface LinksHeaderProps {
  state: any;
  actions: any;
}

export function LinksHeader({ state, actions }: LinksHeaderProps) {
  const { hasChanges, isSaving, isAdding } = state;
  const { addLink, saveAllChanges } = actions;

  return (
    <div className="mb-10 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-enter" style={{animationDelay: '100ms'}}>
      <div className="text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-5 sm:mb-6 shadow-sm">
          <i className="fas fa-link text-slate-400"></i> Integrasi Publik
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2 flex items-center justify-center md:justify-start gap-3">
          Social Links.
          <i className="fas fa-asterisk text-slate-300 text-[1.2rem] md:text-[1.8rem] animate-spin-slow"></i>
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-lg">Kelola direktori tautan sosial media dan kontak profesional Anda.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        {hasChanges && (
          <button 
            onClick={saveAllChanges} 
            disabled={isSaving} 
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 text-white rounded-xl sm:rounded-full text-[11px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(0,0,0,0.1)] active:scale-95 transition-all hover:bg-slate-800 hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] disabled:opacity-50"
          >
            {isSaving ? <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div> : <i className="fas fa-check text-[10px]"></i>}
            Simpan
          </button>
        )}
        <button 
          onClick={addLink} 
          disabled={isAdding} 
          className="w-full sm:w-auto px-6 py-3.5 bg-white text-slate-900 border border-slate-200 rounded-xl sm:rounded-full text-[11px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
        >
          {isAdding ? <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div> : <i className="fas fa-plus text-[10px]"></i>} 
          {isAdding ? 'Membuat...' : 'Tambah Baru'}
        </button>
      </div>
    </div>
  );
}
