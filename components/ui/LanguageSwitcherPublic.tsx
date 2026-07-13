"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSwitcherPublic({ isMobile = false }: { isMobile?: boolean } = {}) {
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (nextLocale: string) => {
    setIsOpen(false);
    if (nextLocale === locale) return;
    
    const segments = pathname.split('/');
    if (segments[1] === 'en' || segments[1] === 'id') {
      segments[1] = nextLocale;
    } else {
      segments.splice(1, 0, nextLocale);
    }
    
    const newPath = segments.join('/') || '/';
    window.location.href = newPath;
  };

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'id', label: 'Indonesia', short: 'ID' }
  ];

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  return (
    <div className={`relative ${isMobile ? 'w-full' : ''}`} ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)} 
        className={`flex items-center justify-between gap-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all backdrop-blur-sm uppercase tracking-wider outline-none focus:ring-1 focus:ring-[#ff9e00] ${isMobile ? 'w-full py-4 rounded-none font-mono text-xs font-bold' : 'py-1.5 rounded-full text-[10px] font-mono font-bold'}`}
        aria-label="Select Language"
      >
        <div className="flex items-center gap-2">
          <Globe className={`text-white/70 ${isMobile ? 'w-4 h-4' : 'w-3.5 h-3.5'}`} />
          <span>{isMobile ? currentLang.label : currentLang.short}</span>
        </div>
        <ChevronDown className={`text-white/50 transition-transform ${isMobile ? 'w-4 h-4' : 'w-3.5 h-3.5'} ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute ${isMobile ? 'bottom-full left-0 mb-2 w-full' : 'right-0 mt-2 w-40'} bg-zinc-950 border border-white/15 rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-in fade-in ${isMobile ? 'slide-in-from-bottom-2' : 'slide-in-from-top-2'} duration-200`}>
          <div className="py-1.5 flex flex-col">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => changeLanguage(lang.code)}
                className={`w-full text-left px-4 py-3 uppercase tracking-wider font-mono font-bold transition-colors flex items-center justify-between
                  ${isMobile ? 'text-[11px]' : 'text-[10px]'}
                  ${locale === lang.code ? 'bg-[#ff9e00]/10 text-[#ff9e00]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
              >
                {lang.label}
                {locale === lang.code && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
