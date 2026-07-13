"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSwitcherPrivate() {
  const locale = useLocale();
  const router = useRouter();
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
    
    // Set cookie untuk rute privat (dashboard)
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Hard reload is generally safer to ensure all context, HTML tags, and dictionaries update cleanly
    window.location.reload();
  };

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'id', label: 'Indonesia', short: 'ID' }
  ];

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 px-3 h-[38px] bg-[#0a0a0a] hover:bg-zinc-900 border border-white/10 rounded-md text-[10px] font-mono font-bold text-white/70 hover:text-white hover:border-white/20 transition-all uppercase tracking-wider outline-none"
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-white/50" />
        <span>{currentLang.short}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-zinc-950 border border-white/15 rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-dropdown">
          <div className="py-1 flex flex-col">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => changeLanguage(lang.code)}
                className={`w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-wider font-mono font-bold transition-colors flex items-center justify-between
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
