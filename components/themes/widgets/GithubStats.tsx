'use client';

import React, { useRef, useState, useEffect } from 'react';
import useSWR from 'swr';
import { GithubCalendarWidget, CalendarThemeVariant } from './GithubCalendarWidget';
import { GithubActivityFeed } from './GithubActivityFeed';
import { useScrollReveal } from '@/shared/hooks/useScrollReveal';

export type StatsVariant = 'monochrome' | 'classic' | 'acid' | 'aura' | 'noir' | 'bento' | 'brutalism' | 'cinematic' | 'editorial' | 'midnight' | 'monolith' | 'spatial' | 'split' | 'viewfinder' | 'minimalist' | 'split-screen-studio' | 'horizontal-flow' | 'kinetic-avant-garde' | 'layered-monolith' | 'nexus-noir';

interface GithubStatsProps {
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

export function GithubStats({ userId, variant = 'monochrome', themeColor }: GithubStatsProps) {
  const sectionRef = useScrollReveal<HTMLElement>(0);
  const barRef = useRef<HTMLDivElement>(null);
  const [barAnimated, setBarAnimated] = useState(false);

  const { data, error, isLoading } = useSWR(`/api/github/stats?userId=${userId}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateIfStale: true,
    dedupingInterval: 10000,
  });

  useEffect(() => {
    setBarAnimated(false);
    const el = barRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setBarAnimated(true), 150);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [data]);

  if (error || data?.hasError) return null;

  const hasNoPublicRepos = !isLoading && !data?.topRepo && (!data?.languages || data.languages.length === 0);
  if (hasNoPublicRepos) return null;

  if (variant === 'brutalism') {
    return (
      <section ref={sectionRef} className="p-6 @sm:p-12 border-b-[3px] border-black bg-[#f4f4f0] flex flex-col w-full font-mono text-black">
        {/* Title Bar dengan Retro Controls & warna highlight editor */}
        <div className="p-6 border-[3px] border-black bg-[var(--hl)] flex justify-between items-center mb-8">
          <h2 className="custom-heading text-xl @xs:text-2xl @sm:text-4xl @md:text-5xl font-black uppercase tracking-tighter text-black flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-6 h-6 @sm:w-8 @sm:h-8 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.47 2 2 6.47 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
            </svg>
            GITHUB_ACTIVITY
          </h2>
          {/* Retro controls window */}
          <div className="flex items-center gap-1.5 hidden @sm:flex font-mono text-xs font-bold border-[3px] border-black bg-white p-1.5 shadow-[3px_3px_0px_0px_#000] select-none">
            <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-black hover:text-white cursor-pointer transition-colors duration-100">_</span>
            <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-black hover:text-white cursor-pointer transition-colors duration-100">⧠</span>
            <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-100">X</span>
          </div>
        </div>

        {/* Sub-bar / Info Toolbar */}
        <div className="w-full bg-white border-[3px] border-black px-6 py-3 flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-neutral-50 mb-8">
          <div className="flex items-center gap-4">
            <span>USER: <span className="text-black">{data?.username || 'UNKNOWN'}</span></span>
            <span className="hidden @md:inline">|</span>
            <span>API_STATUS: <span className="text-green-600">CONNECTED</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--hl)] animate-pulse border border-black"></span>
            <span className="text-black">LIVE_SYNC</span>
          </div>
        </div>

        {isLoading ? (
          <div className="animate-pulse bg-white border-[3px] border-black p-6 flex flex-col gap-6">
            <div className="h-4 bg-black opacity-20 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-black opacity-10 rounded w-full mb-1"></div>
            <div className="h-3 bg-black opacity-10 rounded w-4/5"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 @md:grid-cols-2 gap-8">
              {/* Repositories List */}
              {(data.topRepos || data.topRepo) && (
                <div className="flex flex-col bg-white border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_#000]">
                  <div className="font-mono text-xs font-black uppercase bg-black text-[var(--hl)] px-2 py-1 w-max mb-6 border border-black">
                    TOP_REPOSITORIES
                  </div>
                  <div className="flex flex-col gap-6">
                    {(data.topRepos || [data.topRepo]).map((repo: any, index: number) => (
                      <a
                        key={repo.name || index}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group border-b border-dashed border-black/10 last:border-b-0 pb-4 last:pb-0"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <i className="fab fa-github text-sm group-hover:text-[var(--hl)] transition-colors"></i>
                          <h4 className="text-sm font-black uppercase group-hover:text-[var(--hl)] transition-colors">
                            {repo.name}
                          </h4>
                        </div>
                        {repo.description && (
                          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                            {repo.description}
                          </p>
                        )}
                        <div className="flex items-center flex-wrap gap-4 text-[10px] font-bold text-slate-500">
                          <span className="flex items-center gap-1"><i className="fas fa-star"></i> {repo.stars}</span>
                          <span className="flex items-center gap-1"><i className="fas fa-eye"></i> {repo.watchers}</span>
                          <span className="flex items-center gap-1"><i className="fas fa-code-branch"></i> {repo.forks}</span>
                          {repo.language && (
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-none border border-black" style={{ backgroundColor: repo.languageColor }}></span>
                              {repo.language.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Languages */}
              {data.languages && data.languages.length > 0 && (
                <div className="flex flex-col bg-white border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_#000]">
                  <div className="font-mono text-xs font-black uppercase bg-black text-[var(--hl)] px-2 py-1 w-max mb-6 border border-black">
                    LANGUAGES_DECODED
                  </div>
                  <div className="flex flex-col">
                    {/* Multi-segment Progress Bar */}
                    <div ref={barRef} className="w-full h-6 flex border-[3px] border-black overflow-hidden mb-6 bg-white">
                      {data.languages.map((lang: any, idx: number) => (
                        <div
                          key={`bar-${lang.name}`}
                          style={{
                            width: barAnimated ? `${lang.percent}%` : '0%',
                            backgroundColor: lang.color,
                            transitionDelay: barAnimated ? `${idx * 80}ms` : '0ms'
                          }}
                          className="h-full border-r-[2px] last:border-r-0 border-black transition-[width] duration-[1200ms]"
                          title={`${lang.name}: ${lang.percent}%`}
                        />
                      ))}
                    </div>

                    {/* Language Legend */}
                    <div className="grid grid-cols-2 gap-4">
                      {data.languages.map((lang: any) => (
                        <div key={lang.name} className="flex items-center gap-2 text-xs font-bold">
                          <span className="w-3 h-3 border border-black shrink-0" style={{ backgroundColor: lang.color }}></span>
                          <span className="text-black uppercase">
                            {lang.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 ml-auto">
                            {lang.percent}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contribution Calendar */}
            {!isLoading && !hasNoPublicRepos && data?.username && (
              <div className="mt-4 flex flex-col gap-6">
                <div className="border-[3px] border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000]">
                  <div className="font-mono text-xs font-black uppercase bg-black text-[var(--hl)] px-2 py-1 w-max mb-6 border border-black">
                    CONTRIBUTION_GRAPH
                  </div>
                  <div className="overflow-x-auto w-full pb-2">
                    <GithubCalendarWidget
                      username={data.username}
                      variant="brutalism"
                      colorScheme="light"
                      themeColor={themeColor}
                    />
                  </div>
                </div>

                <div className="border-[3px] border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000]">
                  <div className="font-mono text-xs font-black uppercase bg-black text-[var(--hl)] px-2 py-1 w-max mb-6 border border-black">
                    ACTIVITY_FEED
                  </div>
                  <GithubActivityFeed
                    userId={userId}
                    themeColor={themeColor}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    );
  }

  const styles = {
    monochrome: {
      section: 'p-8 @lg:p-12 border-t border-gray-100 bg-white text-slate-900',
      heading: 'text-2xl font-black uppercase tracking-tighter text-slate-900',
      label: 'text-[10px] font-mono text-gray-400 uppercase',
      border: 'border-gray-100',
      cardBg: 'bg-gray-50 border-gray-100',
      icon: 'text-slate-900',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-500',
      progressBg: 'bg-slate-100',
      progressFill: 'bg-slate-900',
      calendarColorScheme: 'light' as const
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
      calendarColorScheme: 'dark' as const
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
      calendarColorScheme: 'dark' as const
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
      calendarColorScheme: 'dark' as const
    },
    noir: {
      section: 'p-8 @md:p-12 border-t border-white/10 bg-[#050505] text-white wire-border-b grayscale',
      heading: 'font-sans font-black text-3xl @md:text-5xl tracking-tighter uppercase',
      label: 'font-mono text-[10px] uppercase tracking-[0.2em] text-white/50',
      border: 'border-white/10',
      cardBg: 'bg-[#0a0a0a] border-white/10',
      icon: 'text-white',
      textPrimary: 'text-white font-black',
      textSecondary: 'text-white/60 font-mono',
      progressBg: 'bg-white/10',
      progressFill: 'bg-white',
      calendarColorScheme: 'dark' as const
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
      calendarColorScheme: 'dark' as const
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
      cardBg: 'bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem]',
      icon: 'text-[#111]',
      textPrimary: 'font-serif text-3xl @md:text-4xl text-[#111]',
      textSecondary: 'font-sans text-sm text-slate-500 font-medium',
      progressBg: 'bg-slate-100 rounded-full',
      progressFill: 'bg-[#111] rounded-full',
      calendarColorScheme: 'light' as const
    },
    midnight: {
      section: 'p-6 @md:p-12 @lg:p-20 flex flex-col border-t border-white/5 bg-[#030508]/50 shrink-0 w-full',
      heading: 'font-serif text-3xl @md:text-5xl text-white mb-8',
      label: 'font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-2 block',
      border: 'border-white/10',
      cardBg: 'bg-[#05070a] border border-white/10 shadow-2xl rounded-xl',
      icon: 'text-white',
      textPrimary: 'font-serif text-xl @md:text-2xl text-white',
      textSecondary: 'font-sans text-xs text-slate-400 font-medium uppercase tracking-widest',
      progressBg: 'bg-white/10',
      progressFill: 'bg-white',
      calendarColorScheme: 'dark' as const
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
      section: 'border-t border-gray-200 bg-gray-50/30 overflow-hidden w-full pb-8 px-8 @lg:px-12',
      heading: 'text-2xl font-black uppercase tracking-tighter text-black pt-8 pb-2 min-heading',
      label: 'text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 block min-heading',
      border: 'border-gray-200',
      cardBg: 'bg-white border border-gray-200 p-6 rounded-2xl',
      icon: 'text-black',
      textPrimary: 'text-2xl font-black tracking-tighter text-black',
      textSecondary: 'text-xs font-medium text-gray-500 mt-2',
      progressBg: 'bg-gray-200',
      progressFill: 'bg-black',
      calendarColorScheme: 'light' as const
    },
    'split-screen-studio': {
      section: 'flex flex-col p-8 md:p-12 lg:p-16 border-t border-white/10 w-full',
      heading: 'font-display font-bold text-4xl @lg:text-5xl text-white mb-8 uppercase',
      label: 'font-sans text-[10px] tracking-widest text-white/50 uppercase border border-white/10 px-4 py-2 rounded-full w-max mb-6',
      border: 'border-white/10',
      cardBg: 'bg-[#0a0a0a] border border-white/10 group-hover:border-white transition-colors p-6',
      icon: 'text-white/50 group-hover:text-white',
      textPrimary: 'font-display text-2xl font-bold uppercase tracking-wide text-white transition-colors',
      textSecondary: 'font-sans text-xs text-white/50 tracking-widest uppercase mt-2',
      progressBg: 'bg-white/10',
      progressFill: 'bg-white',
      calendarColorScheme: 'dark' as const
    },
    'horizontal-flow': {
      section: 'py-24 w-full max-w-[1600px] mx-auto px-6 md:px-12 relative z-20 bg-[#050505] border-y border-white/10',
      heading: 'font-display font-medium text-5xl md:text-7xl uppercase tracking-tighter text-white leading-none',
      label: 'font-mono text-[10px] text-accent uppercase tracking-[0.3em] mb-4',
      border: 'border-white/10',
      cardBg: 'bg-[#0a0a0a] border border-white/5 hover:border-accent transition-colors duration-500 p-6 md:p-8',
      icon: 'text-white/50 group-hover:text-accent transition-colors',
      textPrimary: 'text-white/80 group-hover:text-white font-display text-2xl md:text-3xl uppercase tracking-wide transition-colors',
      textSecondary: 'text-white/40 group-hover:text-white/60 font-mono text-[10px] uppercase tracking-widest',
      progressBg: 'bg-white/5',
      progressFill: 'bg-accent',
      calendarColorScheme: 'dark' as const
    },
    'kinetic-avant-garde': {
      section: 'py-32 px-6 md:px-20 kag-bg-void text-white border-t border-white/20 w-full relative z-10',
      heading: 'font-kag-brutal text-4xl md:text-6xl uppercase tracking-tighter text-[#e6e4dc] mix-blend-difference',
      label: 'font-kag-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 border border-[var(--accent)]/20 mix-blend-difference',
      border: 'border-white/10',
      cardBg: 'bg-[#111] border border-white/10 hover:border-[var(--accent)] transition-colors duration-500 rounded-2xl shadow-2xl',
      icon: 'text-[var(--accent)]',
      textPrimary: 'font-kag-brutal text-xl font-bold uppercase tracking-tight text-[#e6e4dc] group-hover:text-[var(--accent)] transition-colors',
      textSecondary: 'font-kag-mono text-[10px] text-white/50 uppercase tracking-widest mt-1',
      progressBg: 'bg-white/10',
      progressFill: 'bg-[var(--accent)]',
      calendarColorScheme: 'dark' as const
    },
    'layered-monolith': {
      section: 'w-full px-6 @md:px-12 py-20 relative z-20',
      heading: 'font-serif text-3xl @md:text-5xl text-white mb-8',
      label: 'font-sans text-[10px] tracking-widest uppercase text-[var(--hl)] mb-4 block',
      border: 'border-white/10',
      cardBg: 'bg-[#111] border border-white/5 shadow-2xl backdrop-blur-md',
      icon: 'text-white/80',
      textPrimary: 'text-white font-serif',
      textSecondary: 'text-white/50 text-xs',
      progressBg: 'bg-white/10',
      progressFill: 'bg-[var(--hl)]',
      calendarColorScheme: 'dark' as const
    },
    'nexus-noir': {
      section: 'w-full px-6 @md:px-10 py-16 border-t border-[#333] bg-[#050505]',
      heading: 'font-serif text-2xl text-white tracking-wide uppercase',
      label: 'font-mono text-[10px] text-gray-500',
      border: 'border-[#333]',
      cardBg: 'bg-[#0a0a0a] border border-[#222]',
      icon: 'text-gray-400',
      textPrimary: 'text-gray-100',
      textSecondary: 'text-gray-500',
      progressBg: 'bg-[#222]',
      progressFill: 'bg-gray-300',
      calendarColorScheme: 'dark' as const
    }
  };

  const s = styles[variant] || styles.monochrome;
  const isDynamic = true;
  const dynamicTextStyle = isDynamic && themeColor ? { color: themeColor } : {};

  return (
    <section ref={sectionRef} className={s.section}>
      <div className={`flex ${variant === 'noir' || variant === 'spatial' ? 'flex-col items-center text-center gap-3' : 'justify-between items-baseline'} mb-6 md:mb-10 ${variant === 'editorial' ? 'pt-10 border-t' : 'pb-4 md:pb-6 border-b'} ${s.border}`}>
        <h2 className={s.heading}>Open Source</h2>
        <span className={s.label} style={dynamicTextStyle}>GitHub</span>
      </div>

      <div className="w-full font-sans">
        {isLoading ? (
          <div className="animate-pulse flex flex-col gap-6">
            <div>
              <div className={`h-4 ${s.progressBg} rounded w-1/3 mb-2`}></div>
              <div className={`h-3 ${s.progressBg} rounded w-full mb-1`}></div>
              <div className={`h-3 ${s.progressBg} rounded w-4/5`}></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 @md:grid-cols-2 gap-8 md:gap-12">

            {/* Repositories List */}
            {(data.topRepos || data.topRepo) && (
              <div className="flex flex-col gap-6">
                <span className={`${s.label} mb-1`} style={dynamicTextStyle}>
                  Top Repositories
                </span>
                <div className="flex flex-col gap-8">
                  {(data.topRepos || [data.topRepo]).map((repo: any, index: number) => (
                    <div key={repo.name || index} className="flex flex-col">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <i className={`fab fa-github text-sm group-hover:opacity-70 transition-opacity ${s.icon}`} style={dynamicTextStyle}></i>
                          <h4 className={`text-base font-bold transition-all ${s.textPrimary}`}>
                            {repo.name}
                          </h4>
                        </div>
                        {repo.description && (
                          <p className={`text-xs leading-relaxed line-clamp-2 mb-3 ${s.textSecondary}`}>
                            {repo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold ${s.textSecondary}`}>
                            <i className="fas fa-star text-[9px]"></i>
                            {repo.stars}
                          </div>
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold ${s.textSecondary}`}>
                            <i className="fas fa-eye text-[9px]"></i>
                            {repo.watchers}
                          </div>
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold ${s.textSecondary}`}>
                            <i className="fas fa-code-branch text-[9px]"></i>
                            {repo.forks}
                          </div>
                          {repo.language && (
                            <div className={`flex items-center gap-1.5 text-[10px] font-bold ${s.textSecondary}`}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: repo.languageColor }}></span>
                              {repo.language}
                            </div>
                          )}
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Languages */}
            {data.languages && data.languages.length > 0 && (
              <div className="flex flex-col">
                <span className={`${s.label} mb-4`} style={dynamicTextStyle}>
                  Top Languages
                </span>
                <div className="flex flex-col">
                  {/* Multi-segment Progress Bar */}
                  <div ref={barRef} className={`w-full h-2.5 flex rounded-full overflow-hidden mb-6 ${s.progressBg}`}>
                    {data.languages.map((lang: any, idx: number) => (
                      <div
                        key={`bar-${lang.name}`}
                        style={{
                          width: barAnimated ? `${lang.percent}%` : '0%',
                          backgroundColor: lang.color,
                          transitionDelay: barAnimated ? `${idx * 80}ms` : '0ms'
                        }}
                        className="h-full transition-[width] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                        title={`${lang.name}: ${lang.percent}%`}
                      />
                    ))}
                  </div>

                  {/* Language Legend */}
                  <div className={`grid gap-y-3 gap-x-4 ${variant === 'midnight' ? 'grid-cols-1 @xl:grid-cols-2' : 'grid-cols-2'}`}>
                    {data.languages.map((lang: any) => (
                      <div key={lang.name} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: lang.color }}></span>
                        <span className={`text-xs font-bold ${s.textPrimary}`}>
                          {lang.name}
                        </span>
                        <span className={`text-[10px] font-mono ml-auto ${s.textSecondary}`}>
                          {lang.percent}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Contribution Calendar */}
        {!isLoading && !hasNoPublicRepos && data?.username && (
          <div className={`mt-12 pt-8 border-t ${s.border}`}>
            <GithubCalendarWidget
              username={data.username}
              variant={variant as CalendarThemeVariant}
              colorScheme={s.calendarColorScheme}
              themeColor={themeColor}
            />
            <GithubActivityFeed
              userId={userId}
              themeColor={themeColor}
            />
          </div>
        )}
      </div>
    </section>
  );
}
