//components/features/settings/DeleteAccountModal.tsx
import React from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteAccountModalProps {
  state: any;
  actions: any;
}

export function DeleteAccountModal({ state, actions }: DeleteAccountModalProps) {
  const { isDeleting, showDeleteModal } = state;
  const { setShowDeleteModal, confirmDeletion } = actions;

  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* 1. Full Screen Blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => !isDeleting && setShowDeleteModal(false)}
      ></div>
      
      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-[320px] md:max-w-[400px] animate-enter mx-auto">
        {/* 2. Outer Blurred Box */}
        <div className="absolute inset-[-8px] md:inset-[-12px] bg-zinc-900/40 backdrop-blur-2xl rounded-none border border-white/10 shadow-2xl"></div>
        
        {/* 3. Main Inner Box */}
        <div className="relative bg-zinc-950 rounded-none border border-white/10 p-5 md:p-8 flex flex-col text-center">
          
          {/* Close Button */}
          <button onClick={() => !isDeleting && setShowDeleteModal(false)} className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-colors rounded-none">
             <X className="w-4 h-4" />
          </button>

          {/* Rippling Red Icon */}
          <div className="relative flex items-center justify-center mx-auto mb-4 w-10 h-10 md:w-12 md:h-12">
            <div className="absolute inset-0 bg-rose-500/20 rounded-none animate-ping opacity-70" style={{ animationDuration: '2s' }}></div>
            <div className="absolute inset-1.5 bg-rose-500/10 rounded-none"></div>
            <div className="relative w-7 h-7 bg-rose-600 text-white rounded-none flex items-center justify-center shadow-md">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-1.5 md:mb-2">Hapus Akun?</h3>
          <p className="text-xs font-mono text-white/40 mb-5 md:mb-6 leading-relaxed px-1">
            Data ini akan dihapus permanen dari sistem dan tidak dapat dikembalikan lagi.
          </p>
          
          <div className="flex flex-row gap-2 md:gap-3 w-full">
            <button 
              onClick={confirmDeletion} 
              disabled={isDeleting} 
              className="flex-1 py-2.5 md:py-3 bg-rose-600 hover:bg-rose-700 rounded-none font-mono font-bold uppercase tracking-wider text-white active:scale-95 transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Delete'}
            </button>
            <button 
              onClick={() => setShowDeleteModal(false)} 
              disabled={isDeleting} 
              className="flex-1 py-2.5 md:py-3 bg-zinc-900 border border-white/10 hover:bg-zinc-800 rounded-none font-mono font-bold uppercase tracking-wider text-white/50 active:scale-95 transition-all text-xs disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
