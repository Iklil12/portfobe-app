"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { X, AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { LinksState, LinksActions } from '../model/useLinks';


interface DeleteLinkModalProps {
  state: LinksState;
  actions: LinksActions;
}

export function DeleteLinkModal({ state, actions }: DeleteLinkModalProps) {
  const t = useTranslations('DashboardLinks');
  const { linkToDelete, isDeleting } = state;
  const { setLinkToDelete, confirmDelete } = actions;

  if (!linkToDelete) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity" 
        onClick={() => !isDeleting && setLinkToDelete(null)}
      ></div>
      
      <div className="relative z-10 w-full max-w-[320px] md:max-w-[400px] mx-auto bg-zinc-950 border border-white/10 rounded-md shadow-[0_45px_100px_rgba(0,0,0,0.9)] p-6 md:p-8 flex flex-col text-center">
        
        <button 
          onClick={() => !isDeleting && setLinkToDelete(null)} 
          className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-md border border-transparent text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
           <X className="w-4 h-4" />
        </button>

        <div className="relative flex items-center justify-center mx-auto mb-4 w-10 h-10 md:w-12 md:h-12 bg-[#ff9e00]/10 border border-[#ff9e00]/20 rounded-md text-[#ff9e00]">
          <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
        </div>

        <h3 className="text-base md:text-lg font-sans font-medium uppercase tracking-wider text-white mb-2">{t('deleteModalTitle')}</h3>
        <p className="text-xs font-sans text-white/50 mb-6 leading-relaxed px-1">{t('deleteModalDesc')}</p>

        <div className="flex flex-row gap-2 md:gap-3 w-full">
          <button 
            onClick={confirmDelete} 
            disabled={isDeleting} 
            className="flex-1 py-2.5 md:py-3 bg-[#ff9e00] hover:bg-[#ffaa22] rounded-md font-sans font-medium text-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-1.5 text-[10px] md:text-xs disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </>
            )}
          </button>
          <button 
            onClick={() => setLinkToDelete(null)} 
            disabled={isDeleting} 
            className="flex-1 py-2.5 md:py-3 bg-zinc-900 border border-white/10 hover:bg-zinc-800 rounded-md font-sans font-medium text-white/70 uppercase tracking-widest active:scale-95 transition-all text-[10px] md:text-xs disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
