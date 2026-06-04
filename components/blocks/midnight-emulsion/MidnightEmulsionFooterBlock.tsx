"use client";

import React from 'react';
import Link from 'next/link';
import { EditableText } from '@/components/ui/EditableText';

export function MidnightEmulsionFooterBlock({ data, theme, isEditor }: any) {
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

  return (
    <footer className="w-full bg-[#05070a] border-t border-white/5 flex flex-col items-center pt-24 pb-12 shrink-0">
      <Link href={`/${subdomain}/gallery`} scroll={false} className="group relative overflow-hidden font-serif italic text-4xl @md:text-6xl text-slate-500 hover:text-white transition-colors duration-700 flex items-center gap-8 mb-32">
        <EditableText value={theme?.customTexts?.midnight_archive || 'Open Full Archive'} field="midnight_archive" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
        <i className="fas fa-arrow-right text-[var(--hl)] -rotate-45 group-hover:rotate-0 transition-transform duration-700 text-3xl"></i>
      </Link>

      <div className="flex gap-8 @md:gap-12 font-sans text-xs font-bold uppercase tracking-[0.3em] text-slate-500 flex-wrap justify-center px-8">
        {links.map((l: any, i: number) => (
          <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:text-[var(--hl)] transition-colors duration-300">
            {l.platform}
          </a>
        ))}
        {links.length === 0 && (
          <span className="text-white/20">No external links</span>
        )}
      </div>
      
      <div className="mt-12 opacity-30">
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
      </div>
    </footer>
  );
}
