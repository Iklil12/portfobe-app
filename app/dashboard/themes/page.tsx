"use client";

import React from 'react';

import { useThemes } from '@/hooks/useThemes';
import { ThemeSkeleton } from '@/components/features/themes/ThemeSkeleton';
import { ThemeHeader } from '@/components/features/themes/ThemeHeader';
import { ThemeGrid } from '@/components/features/themes/ThemeGrid';
import { ProBanner } from '@/components/features/themes/ProBanner';

export default function ThemesPage() {
  const { state, actions, themes } = useThemes();

  if (state.isLoading) return <ThemeSkeleton />;

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans relative overflow-hidden selection:bg-slate-200 selection:text-slate-900 pb-24">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { 
            opacity: 0;
            animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(40px) scale(0.98); filter: blur(4px); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        
        .animate-spin-slow { animation: spin 10s linear infinite; }

        .bg-grid-slate {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px);
        }
      `}} />



      <div className="absolute inset-0 bg-grid-slate pointer-events-none z-0 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-slate-200/50 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto p-6 md:p-10 relative z-10">
        <ThemeHeader state={state} />
        <ThemeGrid themes={themes} state={state} actions={actions} />
        <ProBanner actions={actions} />
      </div>
    </main>
  );
}