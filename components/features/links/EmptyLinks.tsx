import React from 'react';
import { Link2, Plus } from 'lucide-react';

interface EmptyLinksProps {
  state: any;
  actions: any;
}

export function EmptyLinks({ state, actions }: EmptyLinksProps) {
  const { isAdding } = state;
  const { addLink } = actions;

  return (
    <div className="py-20 sm:py-24 flex flex-col items-center justify-center text-center bg-[#050505] rounded-none border border-dashed border-white/10 hover:border-white/20 transition-colors animate-enter" style={{animationDelay: '200ms'}}>
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-900 border border-white/10 rounded-none flex items-center justify-center mb-6 text-white/30 text-xl shadow-none">
        <Link2 className="w-6 h-6" />
      </div>
      <h3 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-wider mb-2">Belum ada tautan</h3>
      <p className="text-xs font-mono text-white/40 mb-8 max-w-xs leading-relaxed px-4">
        Tambahkan tautan portofolio, sosial media, atau email Anda di sini untuk memudahkan klien menghubungi Anda.
      </p>
      <button 
        onClick={addLink} 
        disabled={isAdding}
        className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest bg-[#ff9e00] hover:bg-[#ffaa22] text-black px-6 sm:px-8 py-3.5 rounded-none transition-colors shadow-md active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
      >
        <Plus className="w-3.5 h-3.5" /> Tambah Tautan Pertama
      </button>
    </div>
  );
}
