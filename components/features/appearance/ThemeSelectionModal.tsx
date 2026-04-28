import React from 'react';
import { THEMES_DATA } from '@/lib/themes';
import { ThemeGrid } from '../themes/ThemeGrid';

interface ThemeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: string;
  onSelectTheme: (themeId: string) => void;
}

export function ThemeSelectionModal({ isOpen, onClose, activeTheme, onSelectTheme }: ThemeSelectionModalProps) {
  if (!isOpen) return null;

  // Mock actions for ThemeGrid
  const actions = {
    handleUseTheme: (themeId: string, themeName: string) => {
      onSelectTheme(themeId);
      onClose();
    }
  };

  const state = {
    currentTheme: activeTheme
  };

  return (
    <div className="fixed inset-0 z-[1000001] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-[#FAFAFA] rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        
        {/* Header */}
        <div className="p-8 md:p-10 border-b border-slate-200/60 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-xl">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Pilih Tema Basis</h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Eksplorasi berbagai gaya visual untuk portofolio Anda.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all active:scale-90"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Grid Area */}
        <div className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar">
          <ThemeGrid themes={THEMES_DATA} state={state} actions={actions} />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200/60 bg-white/50 backdrop-blur-md text-center shrink-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Pilih salah satu untuk melihat perubahan secara instan di pratinjau</p>
        </div>
      </div>
    </div>
  );
}
