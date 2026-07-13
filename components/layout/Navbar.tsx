"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight, Zap, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcherPublic from '@/components/ui/LanguageSwitcherPublic';

export function Navbar({ isDarkBg = true }: { isDarkBg?: boolean } = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const t = useTranslations('Navbar');

  const navItems = [
    { label: t('features'), href: '/#features' },
    { label: t('templates'), href: '/templates' },
    { label: t('learn'), href: '#', hasMegaMenu: true },
    { label: t('pricing'), href: '/pricing' }
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock mobile scroll when menu is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#050505]/95 border-b border-white/10 backdrop-blur-md py-4' 
          : 'bg-transparent border-b border-white/0 py-6'
      }`}>
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center cursor-pointer group z-10 relative">
            <img src="/portfo.be.webp" alt="Portfo.be Logo" className="h-6 md:h-7 w-auto object-contain group-hover:scale-102 transition-transform duration-300 invert brightness-0" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2 z-10">
            {navItems.map((item) => {
              if (item.hasMegaMenu) {
                return (
                  <div key={item.label} className="group relative py-2">
                    <span className="cursor-pointer font-mono text-[11px] uppercase tracking-wider text-white/70 hover:text-[#ff9e00] transition-colors flex items-center gap-1">
                      {item.label}
                    </span>
                    
                    {/* Megamenu (Noir Style) */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="bg-[#0a0a0a] rounded-md border border-white/10 shadow-2xl flex flex-col w-[760px] cursor-default overflow-hidden">
                        
                        {/* Top Content Area */}
                        <div className="p-8 pb-6 flex gap-10">
                           {/* Left Column */}
                           <div className="flex-1 flex flex-col gap-6">
                              <Link href="/blog" className="group/item flex gap-4 items-start">
                                 <div className="w-10 h-10 bg-neutral-900 border border-white/10 rounded-md flex items-center justify-center text-white/40 group-hover/item:text-[#ff9e00] group-hover/item:bg-neutral-800 group-hover/item:border-[#ff9e00]/40 transition-all duration-300 shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                                 </div>
                                  <div className="flex flex-col">
                                    <h4 className="font-mono text-xs uppercase tracking-wider text-white group-hover/item:text-[#ff9e00] transition-colors mb-1 flex items-center gap-2">
                                      {t('mega_engBlog_title')} 
                                      <span className="bg-[#ff9e00] text-black text-[8px] px-1.5 py-0.5 rounded-md font-medium tracking-widest font-sans">NEW</span>
                                    </h4>
                                    <p className="text-[11px] text-white/50 leading-relaxed font-sans font-medium">{t('mega_engBlog_desc')}</p>
                                 </div>
                              </Link>

                              <Link href="#" className="group/item flex gap-4 items-start">
                                 <div className="w-10 h-10 bg-neutral-900 border border-white/10 rounded-md flex items-center justify-center text-white/40 group-hover/item:text-[#ff9e00] group-hover/item:bg-neutral-800 group-hover/item:border-[#ff9e00]/40 transition-all duration-300 shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                 </div>
                                 <div className="flex flex-col">
                                    <h4 className="font-mono text-xs uppercase tracking-wider text-white group-hover/item:text-[#ff9e00] transition-colors mb-1">{t('mega_creator_title')}</h4>
                                    <p className="text-[11px] text-white/50 leading-relaxed font-sans font-medium">{t('mega_creator_desc')}</p>
                                 </div>
                              </Link>
                           </div>
                           
                           {/* Divider */}
                           <div className="w-px bg-white/10"></div>

                           {/* Right Column */}
                           <div className="flex-1 flex flex-col gap-6">
                              <Link href="/learn/knowledge-base" className="group/item flex gap-4 items-start">
                                 <div className="w-10 h-10 bg-neutral-900 border border-white/10 rounded-md flex items-center justify-center text-white/40 group-hover/item:text-[#ff9e00] group-hover/item:bg-neutral-800 group-hover/item:border-[#ff9e00]/40 transition-all duration-300 shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                                 </div>
                                 <div className="flex flex-col">
                                    <h4 className="font-mono text-xs uppercase tracking-wider text-white group-hover/item:text-[#ff9e00] transition-colors mb-1">{t('mega_kb_title')}</h4>
                                    <p className="text-[11px] text-white/50 leading-relaxed font-sans font-medium">{t('mega_kb_desc')}</p>
                                 </div>
                              </Link>

                              <Link href="/learn/guide" className="group/item flex gap-4 items-start">
                                 <div className="w-10 h-10 bg-neutral-900 border border-white/10 rounded-md flex items-center justify-center text-white/40 group-hover/item:text-[#ff9e00] group-hover/item:bg-neutral-800 group-hover/item:border-[#ff9e00]/40 transition-all duration-300 shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                                 </div>
                                 <div className="flex flex-col">
                                    <h4 className="font-mono text-xs uppercase tracking-wider text-white group-hover/item:text-[#ff9e00] transition-colors mb-1">{t('mega_guide_title')}</h4>
                                    <p className="text-[11px] text-white/50 leading-relaxed font-sans font-medium">{t('mega_guide_desc')}</p>
                                 </div>
                              </Link>
                           </div>
                        </div>

                        {/* Mega Menu Footer Banner */}
                        <div className="bg-black px-8 py-6 flex items-center justify-between group/feat cursor-pointer relative overflow-hidden border-t border-white/10">
                           <div className="absolute right-0 top-0 w-2/3 h-full bg-gradient-to-l from-[#ff9e00]/5 to-transparent opacity-50 group-hover/feat:opacity-100 transition-opacity duration-700"></div>
                           
                           <div className="flex items-center gap-6 relative z-10">
                              <div className="w-16 h-16 rounded-md bg-neutral-900 border border-white/10 overflow-hidden shrink-0 shadow-lg">
                                 <img src="/minimalist_chair_3d.webp" className="w-full h-full object-cover opacity-60 group-hover/feat:opacity-100 group-hover/feat:scale-105 transition-all duration-700 grayscale"/>
                              </div>
                              <div className="flex flex-col py-1">
                                 <span className="text-[#ff9e00] font-mono text-[9px] uppercase tracking-widest mb-1">{t('mega_update_badge')}</span>
                                 <h4 className="font-medium text-white text-base mb-0.5 group-hover/feat:text-[#ff9e00] transition-colors">{t('mega_update_title')}</h4>
                                 <p className="text-[10px] text-white/40 max-w-[340px] leading-normal font-sans font-medium">{t('mega_update_desc')}</p>
                              </div>
                           </div>
                           
                           <Link href="#" className="relative z-10 bg-white/10 hover:bg-[#ff9e00] hover:text-black text-white text-xs font-sans uppercase tracking-wider px-5 py-3 rounded-md border border-white/10 transition-all duration-300 flex items-center gap-2 shadow-sm whitespace-nowrap">
                              {t('mega_update_btn')} <ArrowRight className="w-3.5 h-3.5 group-hover/feat:translate-x-1 transition-transform" />
                           </Link>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link key={item.label} href={item.href} className="font-mono text-[11px] uppercase tracking-wider text-white/70 hover:text-[#ff9e00] transition-colors">
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-4 z-10 relative">
            <LanguageSwitcherPublic />
            <Link href="/login" className="font-mono text-[11px] uppercase tracking-wider text-white/70 hover:text-white px-4 py-2 transition-colors">
              {t('login')}
            </Link>
            <Link href="/register" className="px-6 py-2.5 bg-white text-black hover:bg-[#ff9e00] hover:text-black font-mono text-[11px] uppercase tracking-wider font-bold transition-all flex items-center gap-2 group border border-white/10">
              {t('getStarted')}
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <button aria-label="Open Mobile Menu" onClick={() => setIsMobileMenuOpen(true)} className="md:hidden focus:outline-none w-10 h-10 border border-white/10 flex items-center justify-center text-white bg-white/5 hover:bg-white/10 transition-all">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU (SIDE DRAWER) */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}></div>

      <div className={`fixed top-0 right-0 w-[85%] max-w-sm h-[100dvh] bg-[#050505] border-l border-white/10 z-[70] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <span className="flex items-center">
            <img src="/portfo.be.webp" alt="Portfo.be Logo" className="h-6 w-auto object-contain invert brightness-0" />
          </span>
          <button aria-label="Close Mobile Menu" onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 active:scale-95 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 mt-4">
          {navItems.map((item, i) => {
            if (item.hasMegaMenu) {
              const isExpanded = expandedMobileMenu === item.label;
              return (
                <div key={item.label} className="flex flex-col gap-4" style={{ animationDelay: `${i * 100}ms` }}>
                  <button 
                    onClick={() => setExpandedMobileMenu(isExpanded ? null : item.label)} 
                    className="w-full text-white font-black text-2xl uppercase tracking-tight hover:text-[#ff9e00] transition-colors flex items-center justify-between group"
                  >
                    {item.label} 
                    <ChevronRight className={`w-5 h-5 text-white/30 group-hover:text-[#ff9e00] transition-transform duration-300 ${isExpanded ? 'rotate-90 text-[#ff9e00]' : ''}`} />
                  </button>
                  
                     <div className={`flex flex-col gap-4 pl-4 border-l border-white/10 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[400px] mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                     <Link href="/learn/knowledge-base" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/50 hover:text-white transition-colors">{t('mega_kb_title')}</Link>
                     <Link href="/learn/guide" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/50 hover:text-white transition-colors">{t('mega_guide_title')}</Link>
                     <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/50 hover:text-white flex items-center gap-3 transition-colors">{t('mega_engBlog_title')} <span className="text-[9px] bg-[#ff9e00] text-black px-1.5 py-0.5 font-medium tracking-widest font-sans">NEW</span></Link>
                     <Link href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/50 hover:text-white transition-colors">{t('mega_creator_title')}</Link>
                  </div>
                </div>
              );
            }

            return (
              <Link key={item.label} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="text-white font-black text-2xl uppercase tracking-tight hover:text-[#ff9e00] transition-colors flex items-center justify-between group" style={{ animationDelay: `${i * 100}ms` }}>
                {item.label} <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-[#ff9e00] group-hover:translate-x-2 transition-transform" />
              </Link>
            );
          })}
        </div>
        <div className="p-6 border-t border-white/10 flex flex-col gap-3">
          <LanguageSwitcherPublic isMobile={true} />
          <Link href="/login" className="block w-full text-white/80 font-mono text-xs uppercase tracking-wider py-4 text-center border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">{t('login')}</Link>
          <Link href="/register" className="block w-full py-4 bg-[#ff9e00] text-black text-center font-mono text-xs uppercase tracking-wider font-medium hover:bg-white transition-colors flex items-center justify-center gap-2">
            {t('getStartedFree')} <Zap className="w-4 h-4 fill-black text-black" />
          </Link>
        </div>
      </div>
    </>
  );
}
