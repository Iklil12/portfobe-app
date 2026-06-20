'use client';

import React from 'react';
import useSWR from 'swr';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export type StatsVariant = 'monochrome' | 'classic' | 'acid' | 'aura' | 'noir' | 'bento' | 'brutalism' | 'cinematic' | 'editorial' | 'midnight' | 'monolith' | 'spatial' | 'split' | 'viewfinder' | 'minimalist' | 'split-screen-studio' | 'horizontal-flow' | 'kinetic-avant-garde' | 'layered-monolith' | 'nexus-noir';

interface PenpotShowcaseProps {
  userId: string;
  variant?: StatsVariant;
  themeColor?: string;
}

const fetcher = (url: string) => fetch(url).then(async (res) => {
  if (res.status === 401 || res.status === 403 || res.status === 404) {
    return { hasError: true, status: res.status };
  }
  if (!res.ok) {
    return { hasError: true, status: res.status };
  }
  return res.json();
}).catch((err) => {
  return { hasError: true, error: err.message };
});

export function PenpotShowcase({ userId, variant = 'monochrome', themeColor }: PenpotShowcaseProps) {
  const sectionRef = useScrollReveal<HTMLElement>();
  const { data, error, isLoading } = useSWR(`/api/penpot/manual?userId=${userId}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  if (!isLoading && (!data?.projects || data.projects.length === 0 || data.hasError)) return null;

  const PenpotIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M22 4.5L37.5 12.25V31.75L22 39.5L6.5 31.75V12.25L22 4.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 39.5V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M37.5 12.25L22 22L6.5 12.25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 12V6M22 15V4M30 12V6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  if (variant === 'brutalism') {
    return (
      <section ref={sectionRef} className="p-6 @sm:p-12 border-b-[3px] border-black bg-[#f4f4f0] flex flex-col w-full font-mono text-black">
        {/* Title Bar dengan Retro Controls & warna highlight editor */}
        <div className="p-6 border-[3px] border-black bg-[var(--hl)] flex justify-between items-center mb-8">
          <h2 className="custom-heading text-xl @xs:text-2xl @sm:text-4xl @md:text-5xl font-black uppercase tracking-tighter text-black flex items-center gap-2">
            <PenpotIcon className="w-6 h-6 @sm:w-8 @sm:h-8 shrink-0" />
            PENPOT_SHOWCASE
          </h2>
          {/* Retro controls window */}
          <div className="flex items-center gap-1.5 hidden @sm:flex font-mono text-xs font-bold border-[3px] border-black bg-white p-1.5 shadow-[3px_3px_0px_0px_#000] select-none">
            <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-black hover:text-white cursor-pointer transition-colors duration-100">_</span>
            <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-black hover:text-white cursor-pointer transition-colors duration-100">⧠</span>
            <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-100">X</span>
          </div>
        </div>

        {/* Grid items */}
        <div className="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 gap-6">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white border-[3px] border-black p-5 flex items-center gap-4">
                <div className="w-12 h-12 shrink-0 bg-black opacity-10"></div>
                <div className="flex flex-col flex-1 gap-2">
                  <div className="h-4 bg-black opacity-20 rounded w-3/4"></div>
                  <div className="h-3 bg-black opacity-10 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : (
            data.projects.map((project: any, index: number) => (
              <a
                key={index}
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-4 p-5 bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_#000] transition-all cursor-pointer group rounded-none"
              >
                <div className="w-10 h-10 shrink-0 border-2 border-black flex items-center justify-center bg-black text-[var(--hl)] transition-all group-hover:bg-[var(--hl)] group-hover:text-black">
                  <PenpotIcon className="w-5 h-5" />
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                  <h4 className="text-black font-black uppercase text-sm mb-1 truncate tracking-tight group-hover:text-[var(--hl)] transition-colors">
                    {(project.title || 'Untitled Design').replace(/pnepot/gi, 'Penpot')}
                  </h4>
                  <span className="text-black font-bold uppercase text-[9px] flex items-center gap-1">
                    <span>&gt; VIEW_DESIGN</span>
                  </span>
                </div>

                <div className="w-8 h-8 border-[2px] border-black rounded-none flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <i className="fas fa-arrow-right -rotate-45 text-[10px]"></i>
                </div>
              </a>
            ))
          )}
        </div>
      </section>
    );
  }

  const styles = {
    monochrome: {
      section: 'p-8 @lg:py-10 @lg:px-12 border-t border-gray-100 bg-white text-slate-900',
      heading: 'text-xl font-black uppercase tracking-tighter text-slate-900',
      label: 'text-[10px] font-mono text-gray-400 uppercase',
      border: 'border-gray-100',
      cardBg: 'bg-gray-50 border-gray-100',
      icon: 'text-slate-900',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-500',
      progressBg: 'bg-slate-100',
      progressFill: 'bg-slate-900',
      calendarColorScheme: 'light' as const,
      iconContainer: 'bg-slate-100 text-slate-900 border-none group-hover:bg-slate-900 group-hover:text-white'
    },
    classic: {
      section: 'p-8 @lg:p-12 border-t border-slate-800 bg-[#0d1117] text-slate-300',
      heading: 'text-2xl font-bold tracking-tight text-slate-100',
      label: 'text-[10px] font-mono text-slate-500 uppercase',
      border: 'border-slate-800',
      cardBg: 'bg-[#161b22] border-slate-800',
      icon: 'text-slate-100',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-400',
      progressBg: 'bg-slate-800',
      progressFill: 'bg-[#2ea043]',
      calendarColorScheme: 'dark' as const,
      iconContainer: 'bg-slate-800/50 text-slate-300 border border-slate-700/50 group-hover:bg-slate-200 group-hover:text-slate-900'
    },
    acid: {
      section: 'p-8 @lg:p-12 border-t-2 border-[#1a1a1a] bg-[#09090b] text-[#fafafa] acid-theme',
      heading: 'text-3xl font-extrabold uppercase tracking-tighter text-[#fafafa] acid-heading',
      label: 'text-[10px] font-bold text-[#a3e635] uppercase tracking-[0.2em] acid-body',
      border: 'border-[#1a1a1a]',
      cardBg: 'bg-[#09090b] border-[#1a1a1a]',
      icon: 'text-[#a3e635]',
      textPrimary: 'text-[#fafafa]',
      textSecondary: 'text-zinc-500',
      progressBg: 'bg-zinc-800',
      progressFill: 'bg-[#a3e635]',
      calendarColorScheme: 'dark' as const,
      iconContainer: 'bg-[#a3e635]/10 text-[#a3e635] border border-[#a3e635]/20 group-hover:bg-[#a3e635] group-hover:text-[#09090b]'
    },
    aura: {
      section: 'p-8 @lg:p-12 border-t border-white/10 bg-white/5 backdrop-blur-md text-white rounded-3xl mb-12',
      heading: 'text-2xl font-medium tracking-tight text-white',
      label: 'text-[10px] font-bold text-violet-300 uppercase tracking-widest',
      border: 'border-white/10',
      cardBg: 'bg-white/5 border-white/10',
      icon: 'text-white',
      textPrimary: 'text-white',
      textSecondary: 'text-violet-200/60',
      progressBg: 'bg-white/10',
      progressFill: 'bg-violet-400',
      calendarColorScheme: 'dark' as const,
      iconContainer: 'bg-violet-400/10 text-violet-300 border border-violet-400/20 group-hover:bg-violet-400 group-hover:text-[#0f0a1c]'
    },
    noir: {
      section: 'p-8 @md:p-12 border-t border-white/10 bg-[#050505] text-white wire-border-b grayscale',
      heading: 'font-sans font-black text-3xl @md:text-5xl tracking-tighter uppercase',
      label: 'font-mono text-[10px] uppercase tracking-[0.2em] text-white/50',
      border: 'border-white/10',
      cardBg: 'bg-[#0a0a0a] border border-white/20 transition-all duration-500 hover:-translate-y-2 hover:border-white/50 hover:bg-[#111]',
      icon: 'text-white',
      textPrimary: 'text-white font-black',
      textSecondary: 'text-white/60 font-mono',
      progressBg: 'bg-white/10',
      progressFill: 'bg-white',
      calendarColorScheme: 'dark' as const,
      iconContainer: 'bg-white/5 text-white border border-white/20 group-hover:bg-white group-hover:text-black'
    },
    bento: {
      section: 'bento-card flex flex-col p-6 @lg:p-10 @lg:col-span-4 w-full h-full',
      heading: 'text-xl @md:text-2xl font-black text-white',
      label: 'text-[10px] text-slate-500 font-bold uppercase tracking-widest',
      border: 'border-white/5',
      cardBg: 'bg-[#1a1a1d] border-white/5',
      icon: 'text-white',
      textPrimary: 'text-white font-bold',
      textSecondary: 'text-slate-400 font-medium',
      progressBg: 'bg-white/5',
      progressFill: 'bg-white',
      calendarColorScheme: 'dark' as const,
      iconContainer: 'bg-white/5 text-white border border-white/10 group-hover:bg-white group-hover:text-black'
    },
    brutalism: {
      section: 'p-6 @sm:p-12 border-b-[3px] border-black bg-[#f4f4f0] flex flex-col w-full font-mono text-black',
      heading: 'text-4xl @sm:text-5xl font-black uppercase tracking-tighter mb-8 font-sans',
      label: 'text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1 w-max',
      border: 'border-[3px] border-black',
      cardBg: 'bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] rounded-none',
      icon: 'text-black',
      textPrimary: 'text-black font-black uppercase',
      textSecondary: 'text-black font-bold uppercase',
      progressBg: 'bg-white border-y-[3px] border-black h-4 mt-2',
      progressFill: 'bg-black border-r-[3px] border-black h-full',
      calendarColorScheme: 'light' as const,
      iconContainer: 'bg-white border-2 border-black text-black group-hover:bg-black group-hover:text-white'
    },
    cinematic: {
      section: 'py-16 md:py-24 px-6 @md:px-12 border-t border-[#1f1f1f]',
      heading: 'font-black uppercase tracking-tighter text-white text-4xl @md:text-6xl',
      label: 'text-[10px] @md:text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 inline-block',
      border: 'border-[#1f1f1f]',
      cardBg: 'bg-transparent border-y border-[#1f1f1f] py-8 rounded-none',
      icon: 'text-gray-400',
      textPrimary: 'text-white font-black uppercase tracking-tighter',
      textSecondary: 'text-gray-500 text-xs @md:text-sm',
      progressBg: 'bg-[#1f1f1f] h-[1px]',
      progressFill: 'bg-white h-[1px]',
      calendarColorScheme: 'dark' as const,
      iconContainer: 'bg-white/5 text-white border border-white/10 group-hover:bg-white group-hover:text-black'
    },
    editorial: {
      section: 'w-full max-w-[1600px] mx-auto px-6 py-12 @md:px-12 @lg:px-20',
      heading: 'font-sans font-semibold tracking-tight text-[#111] text-4xl @md:text-5xl mb-8',
      label: 'font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-max mb-4',
      border: 'border-[rgba(0,0,0,0.08)]',
      cardBg: 'bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem] transition-all duration-500 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.12)] hover:-translate-y-2 hover:border-[var(--hl)]/20',
      icon: 'text-[#111]',
      textPrimary: 'font-serif text-lg @md:text-xl text-[#111]',
      textSecondary: 'font-sans text-sm text-slate-500 font-medium',
      progressBg: 'bg-slate-100 rounded-full',
      progressFill: 'bg-[#111] rounded-full',
      calendarColorScheme: 'light' as const,
      iconContainer: 'bg-slate-100 text-[#111] group-hover:bg-[#111] group-hover:text-white'
    },
    midnight: {
      section: 'p-8 @md:p-12 @lg:p-20 flex flex-col border-b border-white/5 bg-[#030508] shrink-0 w-full relative overflow-hidden',
      heading: 'font-serif text-3xl @md:text-5xl text-white mb-8',
      label: 'font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-2 block',
      border: 'border-white/10',
      cardBg: 'bg-[#06080c] border border-white/5 hover:border-[var(--hl)]/30 hover:bg-[#080b11] transition-all duration-500 shadow-2xl rounded-xl',
      icon: 'text-[var(--hl)]',
      textPrimary: 'font-serif text-lg @md:text-xl text-white',
      textSecondary: 'font-sans text-[10px] text-slate-400 font-bold uppercase tracking-[0.25em]',
      progressBg: 'bg-white/10',
      progressFill: 'bg-white',
      calendarColorScheme: 'dark' as const,
      iconContainer: 'bg-[var(--hl)]/10 text-[var(--hl)] border border-[var(--hl)]/20 group-hover:bg-[var(--hl)] group-hover:text-[#030508]'
    },
    monolith: {
      section: 'relative z-20 w-full bg-[#050505] px-6 @md:px-12 pb-20 @md:pb-32 flex flex-col',
      heading: 'font-serif leading-none text-white text-4xl @md:text-5xl @lg:text-[5cqi] mb-12',
      label: 'font-sans font-bold uppercase tracking-widest text-[var(--hl)] text-[10px] @md:text-xs mb-2 block',
      border: 'border-white/10',
      cardBg: 'bg-black border border-white/10 rounded-[24px] @md:rounded-[40px] shadow-2xl',
      icon: 'text-white',
      textPrimary: 'font-serif leading-none text-white text-3xl @md:text-5xl',
      textSecondary: 'font-sans font-medium text-slate-400 text-[10px] @md:text-sm',
      progressBg: 'bg-white/10',
      progressFill: 'bg-[var(--hl)]',
      calendarColorScheme: 'dark' as const,
      iconContainer: 'bg-[var(--hl)]/10 text-[var(--hl)] border border-[var(--hl)]/20 group-hover:bg-[var(--hl)] group-hover:text-[#050505]'
    },
    spatial: {
      section: 'flex flex-col w-full px-8 mt-24 @md:mt-32',
      heading: 'font-medium tracking-tight text-white text-4xl mb-8',
      label: 'inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel mb-4 text-xs font-medium text-slate-300 w-max',
      border: 'border-white/10',
      cardBg: 'glass-panel p-5 @md:p-6 rounded-[24px]',
      icon: 'text-white',
      textPrimary: 'font-medium tracking-tight text-white text-lg @md:text-xl',
      textSecondary: 'text-[10px] text-slate-400 mt-1',
      progressBg: 'bg-white/10 rounded-full',
      progressFill: 'bg-[var(--hl)] rounded-full',
      calendarColorScheme: 'dark' as const,
      iconContainer: 'bg-[var(--hl)]/10 text-[var(--hl)] border border-[var(--hl)]/20 group-hover:bg-[var(--hl)] group-hover:text-[#050508]'
    },
    split: {
      section: 'flex flex-col pt-16 @lg:pt-24 pb-16 border-b border-white/5 w-full px-6 @md:px-12',
      heading: 'font-display font-black text-3xl @lg:text-5xl text-white mb-10',
      label: 'font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-2 block',
      border: 'border-white/5',
      cardBg: 'bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-xl p-5 transition-all duration-300',
      icon: 'text-white',
      textPrimary: 'font-sans text-sm @md:text-base font-bold text-white',
      textSecondary: 'font-sans text-[10px] text-neutral-400 mt-1',
      progressBg: 'bg-white/10',
      progressFill: 'bg-[var(--hl)]',
      calendarColorScheme: 'dark' as const,
      iconContainer: 'bg-[var(--hl)]/10 text-[var(--hl)] border border-[var(--hl)]/20 group-hover:bg-[var(--hl)] group-hover:text-black'
    },
    viewfinder: {
      section: 'border-y border-white/10 py-16 mb-10 w-full px-6 @md:px-12 @lg:px-20 bg-[#050505]',
      heading: 'font-cinema tracking-wide text-5xl text-[#F3F3F1] mb-6',
      label: 'font-bold uppercase tracking-widest text-[10px] text-[#F3F3F1] mb-2 block',
      border: 'border-white/10',
      cardBg: 'bg-transparent border border-white/10 p-6',
      icon: 'text-[#F3F3F1]',
      textPrimary: 'font-cinema text-4xl text-[#F3F3F1]',
      textSecondary: 'font-bold uppercase tracking-widest text-[10px] text-gray-500 mt-2',
      progressBg: 'bg-gray-800',
      progressFill: 'bg-[var(--primary)]',
      calendarColorScheme: 'dark' as const,
      iconContainer: 'bg-[#F3F3F1]/10 text-[#F3F3F1] border border-[#F3F3F1]/20 group-hover:bg-[#F3F3F1] group-hover:text-[#050505]'
    },
    minimalist: {
      section: 'border-t border-gray-200 bg-white w-full py-16 px-8 @lg:px-12 flex flex-col',
      heading: 'text-2xl font-black uppercase tracking-tighter text-black pb-2 min-heading',
      label: 'text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 block min-heading',
      border: 'border-gray-200',
      cardBg: 'bg-white border border-gray-200 hover:border-black transition-colors duration-300',
      icon: 'text-black',
      textPrimary: 'text-2xl font-black tracking-tighter text-black',
      textSecondary: 'text-xs font-medium text-gray-500 mt-2',
      progressBg: 'bg-gray-200',
      progressFill: 'bg-black',
      calendarColorScheme: 'light' as const,
      iconContainer: 'bg-slate-100 text-black group-hover:bg-black group-hover:text-white'
    },
    'split-screen-studio': {
      section: 'flex flex-col p-8 md:p-12 lg:p-16 border-t border-white/10 w-full',
      heading: 'font-display font-bold text-4xl @lg:text-5xl text-white mb-8 uppercase',
      label: 'font-sans text-[10px] tracking-widest text-white/50 uppercase border border-white/10 px-4 py-2 rounded-full w-max mb-6',
      border: 'border-white/10',
      cardBg: 'bg-white/5 border border-white/10 group-hover:border-white transition-colors p-6 cursor-pointer',
      icon: 'text-white/50 group-hover:text-white',
      textPrimary: 'font-display text-2xl font-bold uppercase tracking-wide text-white transition-colors',
      textSecondary: 'font-sans text-xs text-white/50 tracking-widest uppercase mt-2',
      progressBg: 'bg-white/10',
      progressFill: 'bg-white',
      calendarColorScheme: 'dark' as const,
      iconContainer: 'bg-white/5 text-white border border-white/10 group-hover:bg-white group-hover:text-black'
    },
    'layered-monolith': {
      section: 'py-16 px-6 md:px-12 bg-transparent text-white w-full border-t border-white/5 flex flex-col',
      heading: 'font-display font-black text-2xl md:text-3xl uppercase tracking-tighter text-white',
      label: 'font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--hl)] bg-[var(--hl)]/10 px-3 py-1 border border-[var(--hl)]/20',
      border: 'border-white/10',
      cardBg: 'bg-[#090909] border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-[#0f0f0f] rounded-none shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] hover:shadow-[4px_4px_0px_0px_var(--hl)]',
      icon: 'text-white',
      textPrimary: 'font-display text-sm font-bold uppercase tracking-tight text-white group-hover:text-white',
      textSecondary: 'font-mono text-[9px] text-white/50 uppercase tracking-widest mt-1',
      progressBg: 'bg-white/10',
      progressFill: 'bg-[var(--hl)]',
      calendarColorScheme: 'dark' as const,
      iconContainer: 'bg-[var(--hl)]/10 text-[var(--hl)] border border-[var(--hl)]/20 group-hover:bg-[var(--hl)] group-hover:text-black'
    }
  };

  const s = (styles as any)[variant] || styles.monochrome;
  const isDynamic = true;
  const dynamicTextStyle = isDynamic && themeColor ? { color: themeColor } : {};

  const gridCols = variant === 'minimalist' 
    ? 'grid-cols-1' 
    : variant === 'midnight' 
      ? '@xl:grid-cols-2' 
      : '@md:grid-cols-2 @xl:grid-cols-3';

  const cardPadding = variant === 'minimalist' ? 'p-6 @md:p-8' : variant === 'midnight' ? 'p-5 @md:p-6' : 'p-4';

  return (
    <section ref={sectionRef} className={s.section}>
      <div className={variant === 'minimalist' ? 'max-w-4xl w-full mx-auto' : ''}>
        <div className={`flex ${variant === 'noir' || variant === 'spatial' ? 'flex-col items-center text-center gap-3' : 'justify-between items-baseline'} mb-6 md:mb-10 ${variant === 'editorial' ? 'pt-10 border-t' : 'pb-4 md:pb-6 border-b'} ${s.border}`}>
          <h2 className={s.heading}>Design Index</h2>
          <div className={`flex items-center gap-2 ${s.label}`} style={dynamicTextStyle}>
            <PenpotIcon className="w-4 h-4" />
            <span>Penpot</span>
          </div>
        </div>

        <div className="w-full font-sans">
          {isLoading ? (
            <div className={variant === 'noir' || variant === 'spatial' ? "flex flex-wrap justify-center gap-6 w-full" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={`animate-pulse flex items-center gap-4 p-5 rounded-2xl ${s.cardBg} ${variant === 'noir' || variant === 'spatial' ? 'w-full max-w-md' : ''}`}>
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-current opacity-10"></div>
                  <div className="flex flex-col flex-1 gap-2">
                    <div className={`h-4 ${s.textPrimary} bg-current opacity-20 rounded w-3/4`}></div>
                    <div className={`h-3 ${s.textSecondary} bg-current opacity-10 rounded w-1/2`}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={variant === 'noir' || variant === 'spatial' ? "flex flex-wrap justify-center gap-6 w-full" : `grid grid-cols-1 gap-6 ${gridCols}`}>
              {data.projects.map((project: any, index: number) => (
                <a
                  key={index}
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center ${variant === 'midnight' ? 'gap-4' : 'gap-3'} ${cardPadding} rounded-xl cursor-pointer group ${s.cardBg} ${variant === 'noir' || variant === 'spatial' ? 'w-full max-w-md' : ''}`}
                >
                  <div className={`${variant === 'midnight' ? 'w-10 h-10' : 'w-10 h-10'} shrink-0 rounded-lg flex items-center justify-center transition-colors duration-300 shadow-sm relative overflow-hidden ${s.iconContainer || 'bg-emerald-50/10 border border-emerald-500/20 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white'}`}>
                    <PenpotIcon className={variant === 'midnight' ? 'w-5 h-5' : 'w-5 h-5'} />
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <h4 className={`${s.textPrimary} mb-0.5 uppercase tracking-tight`}>{(project.title || 'Untitled Design').replace(/pnepot/gi, 'Penpot')}</h4>
                    <span className={`${s.textSecondary} flex items-center gap-2 text-[10px]`}>
                      <i className="fas fa-external-link-alt text-[9px]"></i>
                      {variant === 'midnight' ? 'View Details' : 'View on Penpot'}
                    </span>
                  </div>

                  <div className={`${variant === 'midnight' ? 'w-8 h-8 text-[var(--hl)] border-white/10 group-hover:border-[var(--hl)]/40' : 'w-8 h-8 border-current'} rounded-full border flex items-center justify-center opacity-50 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0`}>
                    <i className="fas fa-arrow-right -rotate-45 text-[10px]"></i>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
