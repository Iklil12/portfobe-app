"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Crown, X, ArrowRight, Star, Unlock } from 'lucide-react';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  feature?: string;
}

export function ProUpgradeModal({ 
  isOpen, 
  onClose, 
  title = "Unlock Pro Access", 
  description = "Unlimited access to all premium themes, analytics, and full customization.",
  feature
}: ProUpgradeModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setMounted(false), 500);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !mounted) return null;

  return (
    <div className="fixed inset-0 z-[1000002] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* LUXURY OVERLAY */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>

      {/* MODAL CONTAINER - ULTRA COMPACT LANDSCAPE */}
      <div className={`relative w-full max-w-3xl transition-all duration-500 cubic-bezier(0.22, 1, 0.36, 1) ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'} flex flex-col md:flex-row bg-[#080808] rounded-none overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]`}>
        {/* Left Column grid decoration */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        {/* LEFT COLUMN: VISUAL (Compact) */}
        <div className="w-full md:w-[35%] shrink-0 h-32 md:h-auto relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-950 to-black md:border-r border-white/10 z-10">
            <div className="absolute w-24 h-24 bg-[#ff9e00]/5 blur-[40px] rounded-none"></div>
            
            <div className="relative z-10">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-none flex items-center justify-center shadow-2xl relative overflow-hidden group">
                    <Crown className="w-10 h-10 text-[#ff9e00] drop-shadow-[0_0_10px_rgba(255,158,0,0.4)]" />
                    <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] animate-[shine_3s_infinite_ease-in-out]"></div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes shine {
                    0% { transform: translateX(-200%) skewX(-20deg); }
                    20%, 100% { transform: translateX(200%) skewX(-20deg); }
                }
            `}} />
        </div>

        {/* RIGHT COLUMN: CONTENT (Direct & Compact) */}
        <div className="flex-1 p-8 md:p-10 lg:p-12 relative flex flex-col justify-center z-10 bg-[#080808]/90">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 rounded-none bg-zinc-900 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-[#ff9e00]/10 border border-[#ff9e00]/20 text-[9px] font-mono font-bold uppercase tracking-widest text-[#ff9e00] mb-5 w-fit">
              <Star className="w-3 h-3" /> Pro Feature
            </div>

            <h2 className="text-xl md:text-2xl font-mono font-bold text-white tracking-wider uppercase mb-3 leading-tight">
              {title}
            </h2>

            <p className="text-white/40 text-xs font-mono leading-relaxed mb-6 max-w-md">
              {description}
            </p>

            {feature && (
              <div className="mb-8 flex items-center gap-3 p-3.5 bg-zinc-900 rounded-none border border-white/10 w-fit pr-6">
                <div className="w-8 h-8 shrink-0 rounded-none bg-[#ff9e00]/10 border border-[#ff9e00]/20 flex items-center justify-center text-[#ff9e00]">
                  <Unlock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-white font-mono font-bold uppercase tracking-wider">{feature}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/pricing"
                className="px-8 py-4 bg-[#ff9e00] text-black rounded-none text-[11px] font-mono font-bold uppercase tracking-widest shadow-xl hover:bg-[#ffaa22] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Upgrade Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
              
              <button 
                onClick={onClose}
                className="px-6 py-4 text-white/40 text-[10px] font-mono font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                Nanti Saja
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
