import React, { useState } from 'react';
import { THEMES_DATA } from '@/lib/themes';
import { ThemeGrid } from '../themes/ThemeGrid';
import { AnimatePresence, motion } from 'framer-motion';

interface ThemeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: string;
  onSelectTheme: (themeId: string) => void;
}

export function ThemeSelectionModal({ isOpen, onClose, activeTheme, onSelectTheme }: ThemeSelectionModalProps) {
  const [isSwitching, setIsSwitching] = useState(false);
  const [targetTheme, setTargetTheme] = useState<string | null>(null);

  // Mock actions for ThemeGrid
  const actions = {
    handleUseTheme: (themeId: string, themeName: string) => {
      setTargetTheme(themeName);
      setIsSwitching(true);
      
      // Simulate smooth transition loading
      setTimeout(() => {
        onSelectTheme(themeId);
        setTimeout(() => {
          setIsSwitching(false);
          setTargetTheme(null);
          onClose();
        }, 600); // Wait for UI to update before closing
      }, 800); // 800ms "fake" loading for premium feel
    }
  };

  const state = {
    currentTheme: activeTheme
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000001] flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={!isSwitching ? onClose : undefined}
          ></motion.div>

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-6xl h-[90vh] bg-[#FAFAFA] rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col"
          >
            {/* Loading Overlay */}
            <AnimatePresence>
              {isSwitching && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center"
                >
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-16 h-16 relative flex items-center justify-center mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                      <i className="fas fa-magic text-indigo-600 text-xl animate-pulse"></i>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Menerapkan Tema...</h3>
                    <p className="text-sm font-medium text-slate-500">Menyesuaikan tata letak untuk {targetTheme}</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-200/60 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-xl relative z-40">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pilih Tema Basis</h2>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Eksplorasi berbagai gaya visual untuk portofolio Anda.</p>
              </div>
              <button 
                onClick={!isSwitching ? onClose : undefined}
                disabled={isSwitching}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all active:scale-90 disabled:opacity-50 disabled:hover:bg-slate-100 disabled:hover:text-slate-400"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Grid Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative z-30">
              <ThemeGrid themes={THEMES_DATA} state={state} actions={actions} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
