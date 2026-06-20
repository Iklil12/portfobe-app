'use client';

import React from 'react';
import useSWR from 'swr';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) return { projects: [] };
  return res.json();
}).catch(() => ({ projects: [] }));

interface CanvaShowcaseProps {
  userId: string;
  variant?: string;
  themeColor?: string;
}

export function CanvaShowcase({ userId, variant = 'monochrome', themeColor }: CanvaShowcaseProps) {
  const sectionRef = useScrollReveal<HTMLElement>();
  const { data, isLoading } = useSWR(`/api/canva/projects?userId=${userId}`, fetcher);

  const projects = data?.projects || [];

  if (!isLoading && projects.length === 0) return null;

  const isSingleProject = projects.length === 1;

  if (variant === 'brutalism') {
    const skeletonItems = isSingleProject ? [1] : [1, 2];
    return (
      <section ref={sectionRef} className="p-6 @sm:p-12 border-b-[3px] border-black bg-[#f4f4f0] flex flex-col w-full font-mono text-black">
        {/* Title Bar dengan Retro Controls & warna highlight editor */}
        <div className="p-6 border-[3px] border-black bg-[var(--hl)] flex justify-between items-center mb-8">
          <h2 className="custom-heading text-xl @xs:text-2xl @sm:text-4xl @md:text-5xl font-black uppercase tracking-tighter text-black flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-6 h-6 @sm:w-8 @sm:h-8 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            CANVA_SHOWCASE
          </h2>
          {/* Retro controls window */}
          <div className="flex items-center gap-1.5 hidden @sm:flex font-mono text-xs font-bold border-[3px] border-black bg-white p-1.5 shadow-[3px_3px_0px_0px_#000] select-none">
            <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-black hover:text-white cursor-pointer transition-colors duration-100">_</span>
            <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-black hover:text-white cursor-pointer transition-colors duration-100">⧠</span>
            <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-100">X</span>
          </div>
        </div>

        {/* Grid items */}
        <div className={`grid gap-8 ${isSingleProject ? 'grid-cols-1 max-w-5xl mx-auto w-full' : 'grid-cols-1 @lg:grid-cols-2'}`}>
          {isLoading ? (
            skeletonItems.map((i) => (
              <div key={i} className="animate-pulse bg-white border-[3px] border-black p-5 flex flex-col gap-4">
                <div className="h-4 bg-black opacity-20 rounded w-1/3 mb-2"></div>
                <div className="w-full aspect-video bg-black opacity-10"></div>
              </div>
            ))
          ) : (
            projects.map((project: any) => {
              let src = project.embedLink;
              if (src.includes('<iframe') || src.includes('<div')) {
                const match = src.match(/src="([^"]+)"/);
                if (match) src = match[1];
              }

              if (src.startsWith('https://') && !src.includes('embed')) {
                if (src.includes('?')) {
                  src += '&embed';
                } else {
                  src += '?embed';
                }
              }

              return (
                <div 
                  key={project.id} 
                  className="flex flex-col bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_#000] transition-all cursor-pointer group"
                >
                  {/* Card Header Bar - Highlight Color */}
                  <div className="flex justify-between items-center p-4 border-b-[3px] border-black font-mono text-xs font-black uppercase bg-[var(--hl)] text-black">
                    <span className="bg-black text-[var(--hl)] px-2 py-1 border border-black truncate max-w-[200px]">{project.title.toUpperCase()}</span>
                    <span className="tracking-widest flex items-center gap-1.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      EMBEDDED
                    </span>
                  </div>

                  {/* Iframe Area */}
                  <div className="w-full aspect-video border-b-[3px] border-black bg-neutral-200 overflow-hidden relative">
                    <iframe
                      src={src}
                      className="absolute inset-0 w-full h-full border-0"
                      allowFullScreen
                      allow="clipboard-write"
                      loading="lazy"
                    ></iframe>
                  </div>

                  {/* Details Area */}
                  <div className="p-6 flex flex-col justify-between flex-1 bg-white">
                    <h4 className="text-black font-black uppercase text-lg leading-tight group-hover:text-[var(--hl)] transition-colors">
                      {project.title}
                    </h4>
                    <div className="border-t border-dashed border-black/20 pt-4 mt-6 flex justify-between items-center font-mono text-[9px] text-slate-400">
                      <span>PLATFORM: CANVA_LIVE</span>
                      <span className="text-black font-bold">STATUS_OK</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    );
  }

  const styles = {
    monochrome: {
      section: 'p-8 @lg:p-12 border-t border-gray-100 text-slate-900',
      heading: 'text-2xl font-black uppercase tracking-tighter text-slate-900',
      label: 'text-[10px] font-mono text-gray-400 uppercase',
      border: 'border-gray-100',
      cardBg: 'bg-transparent border-gray-100',
      icon: 'text-slate-900',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-500',
      progressBg: 'bg-slate-100',
      progressFill: 'bg-slate-900',
      calendarColorScheme: 'light' as const
    },
    classic: {
      section: 'p-8 @lg:p-12 border-t border-slate-800 text-slate-300',
      heading: 'text-2xl font-bold tracking-tight text-slate-100',
      label: 'text-[10px] font-mono text-slate-500 uppercase',
      border: 'border-slate-800',
      cardBg: 'bg-transparent border-slate-800',
      icon: 'text-slate-100',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-400',
      progressBg: 'bg-slate-800',
      progressFill: 'bg-[#2ea043]',
      calendarColorScheme: 'dark' as const
    },
    acid: {
      section: 'p-8 @lg:p-12 border-t-2 border-[#1a1a1a] text-[#fafafa] acid-theme',
      heading: 'text-3xl font-extrabold uppercase tracking-tighter text-[#fafafa] acid-heading',
      label: 'text-[10px] font-bold text-[#a3e635] uppercase tracking-[0.2em] acid-body',
      border: 'border-[#1a1a1a]',
      cardBg: 'bg-transparent border-[#1a1a1a]',
      icon: 'text-[#a3e635]',
      textPrimary: 'text-[#fafafa]',
      textSecondary: 'text-zinc-500',
      progressBg: 'bg-zinc-800',
      progressFill: 'bg-[#a3e635]',
      calendarColorScheme: 'dark' as const
    },
    aura: {
      section: 'p-8 @lg:p-12 border-t border-white/10 bg-white/5 backdrop-blur-md text-white rounded-3xl mb-12',
      heading: 'text-2xl font-medium tracking-tight text-white',
      label: 'text-[10px] font-bold text-violet-300 uppercase tracking-widest',
      border: 'border-white/10',
      cardBg: 'bg-transparent border-white/10',
      icon: 'text-white',
      textPrimary: 'text-white',
      textSecondary: 'text-violet-200/60',
      progressBg: 'bg-white/10',
      progressFill: 'bg-violet-400',
      calendarColorScheme: 'dark' as const
    },
    noir: {
      section: 'p-8 @md:p-12 border-t border-white/10 bg-[#050505] text-white wire-border-b grayscale',
      heading: 'font-sans font-black text-3xl @md:text-5xl tracking-tighter uppercase',
      label: 'font-mono text-[10px] uppercase tracking-[0.2em] text-white/50',
      border: 'border-white/10',
      cardBg: 'bg-transparent',
      icon: 'text-white',
      textPrimary: 'text-white font-black',
      textSecondary: 'text-white/60 font-mono',
      progressBg: 'bg-white/10',
      progressFill: 'bg-white',
      calendarColorScheme: 'dark' as const
    },
    bento: {
      section: 'flex flex-col p-6 @lg:p-10 @lg:col-span-4 w-full h-full',
      heading: 'text-xl @md:text-2xl font-black text-white',
      label: 'text-[10px] text-slate-500 font-bold uppercase tracking-widest',
      border: 'border-white/5',
      cardBg: 'bg-transparent border-white/5',
      icon: 'text-white',
      textPrimary: 'text-white font-bold',
      textSecondary: 'text-slate-400 font-medium',
      progressBg: 'bg-white/5',
      progressFill: 'bg-white',
      calendarColorScheme: 'dark' as const
    },
    brutalism: {
      section: 'p-6 @sm:p-12 border-b-[3px] border-black flex flex-col w-full font-mono text-black',
      heading: 'text-4xl @sm:text-5xl font-black uppercase tracking-tighter mb-8 font-sans',
      label: 'text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1 w-max',
      border: 'border-[3px] border-black',
      cardBg: 'bg-transparent border-[3px] border-black shadow-[6px_6px_0px_0px_#000] rounded-none',
      icon: 'text-black',
      textPrimary: 'text-black font-black uppercase',
      textSecondary: 'text-black font-bold uppercase',
      progressBg: 'bg-white border-y-[3px] border-black h-4 mt-2',
      progressFill: 'bg-black border-r-[3px] border-black h-full',
      calendarColorScheme: 'light' as const
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
      calendarColorScheme: 'dark' as const
    },
    editorial: {
      section: 'w-full max-w-[1600px] mx-auto px-6 py-12 @md:px-12 @lg:px-20',
      heading: 'font-sans font-semibold tracking-tight text-[#111] text-4xl @md:text-5xl mb-8',
      label: 'font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-max mb-4',
      border: 'border-[rgba(0,0,0,0.08)]',
      cardBg: 'bg-transparent border-none shadow-none rounded-[2rem]',
      icon: 'text-[#111]',
      textPrimary: 'font-serif text-lg @md:text-xl text-[#111]',
      textSecondary: 'font-sans text-sm text-slate-500 font-medium',
      progressBg: 'bg-slate-100 rounded-full',
      progressFill: 'bg-[#111] rounded-full',
      calendarColorScheme: 'light' as const
    },
    midnight: {
      section: 'p-6 @md:p-12 @lg:p-20 flex flex-col border-t border-white/5 shrink-0 w-full',
      heading: 'font-serif text-3xl @md:text-5xl text-white mb-8',
      label: 'font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-2 block',
      border: 'border-white/10',
      cardBg: 'bg-transparent border border-white/10 shadow-2xl rounded-xl',
      icon: 'text-white',
      textPrimary: 'font-serif text-xl @md:text-2xl text-white',
      textSecondary: 'font-sans text-xs text-slate-400 font-medium uppercase tracking-widest',
      progressBg: 'bg-white/10',
      progressFill: 'bg-white',
      calendarColorScheme: 'dark' as const
    },
    monolith: {
      section: 'relative z-20 w-full px-6 @md:px-12 pb-20 @md:pb-32 flex flex-col',
      heading: 'font-serif leading-none text-white text-4xl @md:text-5xl @lg:text-[5cqi] mb-12',
      label: 'font-sans font-bold uppercase tracking-widest text-[var(--hl)] text-[10px] @md:text-xs mb-2 block',
      border: 'border-white/10',
      cardBg: 'bg-transparent border border-white/10 rounded-[24px] @md:rounded-[40px] shadow-2xl',
      icon: 'text-white',
      textPrimary: 'font-serif leading-none text-white text-3xl @md:text-5xl',
      textSecondary: 'font-sans font-medium text-slate-400 text-[10px] @md:text-sm',
      progressBg: 'bg-white/10',
      progressFill: 'bg-[var(--hl)]',
      calendarColorScheme: 'dark' as const
    },
    spatial: {
      section: 'flex flex-col w-full px-8 mt-24 @md:mt-32',
      heading: 'font-medium tracking-tight text-white text-4xl mb-8',
      label: 'inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel mb-4 text-xs font-medium text-slate-300 w-max',
      border: 'border-white/10',
      cardBg: 'glass-panel p-6 @md:p-8 rounded-[24px]',
      icon: 'text-white',
      textPrimary: 'font-medium tracking-tight text-white text-2xl @md:text-4xl',
      textSecondary: 'text-sm text-slate-400 mt-2',
      progressBg: 'bg-white/10 rounded-full',
      progressFill: 'bg-[var(--hl)] rounded-full',
      calendarColorScheme: 'dark' as const
    },
    split: {
      section: 'flex flex-col pt-16 @lg:pt-24 pb-16 border-b border-white/10 w-full',
      heading: 'font-serif font-extrabold text-4xl @lg:text-6xl text-white mb-10 px-6 @md:px-12',
      label: 'font-sans text-[10px] font-bold uppercase tracking-widest text-[var(--hl)] mb-2 block px-6 @md:px-12',
      border: 'border-white/10',
      cardBg: 'bg-transparent border border-white/10 rounded-xl mx-6 @md:mx-12 p-6 @md:p-8',
      icon: 'text-white',
      textPrimary: 'font-serif font-bold text-3xl @md:text-5xl text-white',
      textSecondary: 'font-sans font-medium text-slate-400 text-sm mt-2',
      progressBg: 'bg-white/10',
      progressFill: 'bg-[var(--hl)]',
      calendarColorScheme: 'dark' as const
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
      calendarColorScheme: 'dark' as const
    },
    minimalist: {
      section: 'border-t border-gray-200 bg-white w-full py-20 @md:py-28 px-8 @md:px-12 @lg:px-16 flex flex-col',
      heading: 'text-2xl font-black uppercase tracking-tighter text-black pb-2 min-heading',
      label: 'text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 block min-heading',
      border: 'border-gray-200',
      cardBg: 'bg-transparent border-none p-0',
      icon: 'text-black',
      textPrimary: 'text-2xl font-black tracking-tighter text-black',
      textSecondary: 'text-xs font-medium text-gray-500 mt-2',
      progressBg: 'bg-gray-200',
      progressFill: 'bg-black',
      iframeBorder: 'border-none',
      calendarColorScheme: 'light' as const
    },
    'split-screen-studio': {
      section: 'flex flex-col p-8 md:p-12 lg:p-16 border-t border-white/10 w-full',
      heading: 'font-display font-bold text-4xl @lg:text-5xl text-white mb-8 uppercase',
      label: 'font-sans text-[10px] tracking-widest text-white/50 uppercase border border-white/10 px-4 py-2 rounded-full w-max mb-6',
      border: 'border-white/10',
      cardBg: 'bg-transparent border-none',
      icon: 'text-white/50',
      textPrimary: 'font-display text-2xl font-bold uppercase tracking-wide text-white transition-colors',
      textSecondary: 'font-sans text-xs text-white/50 tracking-widest uppercase mt-2',
      progressBg: 'bg-white/10',
      progressFill: 'bg-white',
      calendarColorScheme: 'dark' as const
    },
    'layered-monolith': {
      section: 'py-16 px-6 md:px-12 bg-transparent text-white w-full border-t border-white/5 flex flex-col',
      heading: 'font-display font-black text-2xl md:text-3xl uppercase tracking-tighter text-white',
      label: 'font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--hl)] bg-[var(--hl)]/10 px-3 py-1 border border-[var(--hl)]/20',
      border: 'border-white/10',
      cardBg: 'bg-[#090909] border border-white/10 p-6 rounded-none shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]',
      icon: 'text-white',
      textPrimary: 'font-display text-sm font-bold uppercase tracking-tight text-white',
      textSecondary: 'font-mono text-[9px] text-white/50 uppercase tracking-widest mt-1',
      progressBg: 'bg-white/10',
      progressFill: 'bg-[var(--hl)]',
      iframeBorder: 'border border-white/10 rounded-none',
      calendarColorScheme: 'dark' as const
    }
  };

  const s = (styles as any)[variant] || styles.monochrome;
  const isDynamic = ['acid', 'aura', 'noir', 'bento', 'brutalism', 'cinematic', 'editorial', 'midnight', 'monolith', 'spatial', 'split', 'viewfinder', 'minimalist', 'split-screen-studio', 'horizontal-flow', 'kinetic-avant-garde', 'layered-monolith', 'nexus-noir'].includes(variant);
  const dynamicTextStyle = isDynamic && themeColor ? { color: themeColor } : {};

  const containerClass = isSingleProject
    ? "flex flex-col items-center justify-center w-full"
    : (variant === 'noir' || variant === 'spatial'
        ? "flex flex-wrap justify-center gap-10 w-full"
        : "grid grid-cols-1 @lg:grid-cols-2 gap-10");

  const cardWidthClass = isSingleProject
    ? "w-full max-w-4xl mx-auto"
    : (variant === 'noir' || variant === 'spatial'
        ? "w-full max-w-xl"
        : "w-full");

  const skeletonContainerClass = isSingleProject
    ? "flex flex-col items-center justify-center w-full"
    : (variant === 'noir' || variant === 'spatial' ? "flex flex-wrap justify-center gap-10 w-full" : "grid grid-cols-1 @lg:grid-cols-2 gap-10");

  const skeletonCardClass = isSingleProject
    ? "w-full max-w-4xl mx-auto"
    : (variant === 'noir' || variant === 'spatial' ? "w-full max-w-xl" : "w-full");

  return (
    <section ref={sectionRef} className={s.section}>
      <div className={variant === 'minimalist' ? 'max-w-4xl w-full mx-auto' : ''}>
        <div className={`flex ${variant === 'noir' || variant === 'spatial' ? 'flex-col items-center text-center gap-3' : 'justify-between items-baseline'} mb-6 md:mb-10 ${variant === 'editorial' ? 'pt-10 border-t' : 'pb-4 md:pb-6 border-b'} ${s.border}`}>
          <h2 className={s.heading}>Canva Showcase</h2>
          <div className={`flex items-center gap-2 ${s.label}`} style={dynamicTextStyle}>
            <span>Canva</span>
          </div>
        </div>

        <div className="w-full font-sans">
          {isLoading ? (
            <div className={skeletonContainerClass}>
              {[1, 2].map((i) => (
                <div key={i} className={`animate-pulse rounded-3xl p-6 ${s.cardBg} ${skeletonCardClass}`}>
                  <div className={`h-4 ${s.textPrimary} bg-current opacity-20 rounded w-1/3 mb-6`}></div>
                  <div className="w-full aspect-video bg-current opacity-10 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className={containerClass}>
              {projects.map((project: any) => {
                let src = project.embedLink;
                if (src.includes('<iframe') || src.includes('<div')) {
                  const match = src.match(/src="([^"]+)"/);
                  if (match) src = match[1];
                }

                if (src.startsWith('https://') && !src.includes('embed')) {
                  if (src.includes('?')) {
                    src += '&embed';
                  } else {
                    src += '?embed';
                  }
                }

                return (
                  <div key={project.id} className={`${s.cardBg} ${cardWidthClass}`}>
                    <h3 className={`${s.textPrimary} mb-6 flex items-center ${variant === 'noir' || variant === 'spatial' || isSingleProject ? 'justify-center' : ''} gap-3`}>
                      <span className="w-2 h-2 rounded-full bg-[var(--hl, #2563eb)]"></span>
                      {project.title}
                    </h3>

                    <div className={`relative w-full aspect-video overflow-hidden bg-slate-50/10 ${s.iframeBorder || 'border border-current'} opacity-90 shadow-inner rounded-xl`}>
                      <iframe
                        src={src}
                        className="absolute inset-0 w-full h-full border-0"
                        allowFullScreen
                        allow="clipboard-write"
                        loading="lazy"
                      ></iframe>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
