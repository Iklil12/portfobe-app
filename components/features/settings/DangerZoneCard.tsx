//components/features/settings/DangerZoneCard.tsx
import React from 'react';

interface DangerZoneCardProps {
  state: any;
  actions: any;
}

export function DangerZoneCard({ state, actions }: DangerZoneCardProps) {
  const { isDeleting } = state;
  const { setShowDeleteModal } = actions;

  return (
    <div className="bg-zinc-900/40 p-6 sm:p-8 md:p-10 rounded-none border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8 mt-10 relative overflow-hidden group shadow-none hover:border-rose-500/30 transition-colors animate-enter" style={{animationDelay: '450ms'}}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/0 rounded-none blur-3xl group-hover:bg-rose-500/5 transition-colors duration-500 pointer-events-none"></div>
      <div className="relative z-10">
        <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">Danger Zone</h4>
        <p className="text-xs font-mono text-white/40 max-w-sm leading-relaxed">This action will permanently delete the account and all works within it.</p>
      </div>
      <button 
        onClick={() => setShowDeleteModal(true)} 
        disabled={isDeleting} 
        className={`relative z-10 shrink-0 font-mono font-bold text-[11px] uppercase tracking-widest bg-zinc-950 text-rose-500 border border-rose-500/20 px-6 sm:px-8 py-3.5 sm:py-4 rounded-none hover:bg-rose-950/20 hover:border-rose-500/40 transition-all active:scale-95 w-full sm:w-auto ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isDeleting ? 'Deleting...' : 'Delete Account'}
      </button>
    </div>
  );
}
