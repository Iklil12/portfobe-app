"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function MidnightEmulsionFooterBlock({ data, theme, isEditor }: any) {
  const [copied, setCopied] = useState(false);
  
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];
  const fullName = data?.profile?.fullName || data?.fullName || "Director Name";
  const emailAddress = data?.profile?.email || data?.user?.email || `${subdomain}@example.com`;

  const copyEmail = () => {
    if (!emailAddress) return;
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="w-full bg-[#030508] border-t border-white/5 flex flex-col items-center pt-24 pb-16 shrink-0 relative overflow-hidden @container">
      {/* Decorative background lights */}
      <div className="absolute inset-x-0 bottom-0 h-[250px] bg-gradient-to-t from-[var(--hl)]/5 to-transparent pointer-events-none blur-[100px] z-0" />
      
      <div className="max-w-5xl w-full px-8 @md:px-12 @lg:px-20 relative z-10 flex flex-col items-center">
        
        {/* Main CTA Section */}
        <div className="w-full flex flex-col items-center text-center mb-20">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-4">
            <EditableText value={theme?.customTexts?.midnight_footer_sub || 'Initiate Connection'} field="midnight_footer_sub" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
          </span>
          <h2 className="font-serif text-4xl @md:text-6xl text-white uppercase tracking-wide mb-10 max-w-2xl leading-tight">
            <EditableText value={theme?.customTexts?.midnight_footer_title || "Let's project something together."} field="midnight_footer_title" entity="appearance" isEditor={isEditor} as="span" maxLength={50} />
          </h2>

          {/* Technical Mail Indicator Card */}
          <div 
            onClick={copyEmail}
            className="group/mail cursor-pointer flex items-center justify-between gap-6 px-6 py-4 bg-[#06080c] border border-white/10 hover:border-[var(--hl)]/30 rounded-xl max-w-md w-full transition-all duration-500 shadow-2xl relative"
          >
            <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[var(--hl)] transform scale-x-0 group-hover/mail:scale-x-100 transition-transform duration-500 origin-left"></div>
            
            <div className="flex flex-col items-start min-w-0">
              <span className="font-sans text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Direct Channel</span>
              <span className="font-serif text-lg text-white group-hover/mail:text-[var(--hl)] transition-colors duration-300 truncate w-full">
                {emailAddress}
              </span>
            </div>
            
            <button className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 group-hover/mail:text-white group-hover/mail:border-white/20 transition-all duration-300 relative">
              {copied ? (
                <span className="font-sans text-[8px] font-bold text-[var(--hl)] uppercase tracking-wider">Copied</span>
              ) : (
                <i className="far fa-copy text-xs"></i>
              )}
            </button>
          </div>
        </div>

        {/* Bottom copyright & social channels */}
        <div className="w-full flex flex-col @md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5 font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <span>
            © {new Date().getFullYear()} {fullName}. Built for Cinema.
          </span>
          
          <div className="flex flex-wrap justify-center gap-6">
            {links.map((l: any, i: number) => (
              <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:text-[var(--hl)] transition-colors duration-300">
                {l.platform}
              </a>
            ))}
            {links.length === 0 && (
              <span className="text-white/20">Offline channels</span>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
