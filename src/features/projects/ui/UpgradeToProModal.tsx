"use client";

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Rocket } from 'lucide-react';

export function UpgradeToProModal({ 
  showUpgradeModal, 
  setShowUpgradeModal 
}: { 
  showUpgradeModal: boolean; 
  setShowUpgradeModal: (show: boolean) => void;
}) {
  return (
    <AnimatePresence>
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowUpgradeModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            className="bg-zinc-950 p-6 sm:p-8 max-w-sm w-full relative z-10 border border-white/10 rounded-md flex flex-col items-center text-center"
          >
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center bg-zinc-900 border border-white/10 text-white/50 hover:text-white rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="w-16 h-16 bg-[#ff9e00]/10 border border-[#ff9e00]/25 rounded-md flex items-center justify-center mb-6">
              <Rocket className="w-7 h-7 text-[#ff9e00]" />
            </div>
            
            <h3 className="text-base font-sans font-medium text-white mb-2 uppercase tracking-wider">Upgrade to PRO</h3>
            <p className="text-xs font-sans text-white/40 mb-8 leading-relaxed">
              Enjoy direct video upload to super fast servers (ad-free), up to 100MB size, and interactive 3D models.
            </p>
            
            <Link 
              href="/pricing"
              className="w-full py-4 rounded-md bg-[#ff9e00] hover:bg-[#ffaa22] text-black font-sans font-medium text-xs uppercase tracking-widest text-center shadow-lg transition-all"
            >
              View PRO Plans
            </Link>
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="w-full mt-4 py-2 text-[10px] font-sans font-medium text-white/30 hover:text-white uppercase tracking-widest transition-colors"
            >
              Maybe Later
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
