"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ObsidianProvider, useObsidianMedia } from './ObsidianContext';
import { UniversalPlayer } from '@/shared/ui/UniversalPlayer';
import { EditableText } from '@/shared/ui/EditableText';
import { useEscapeKey } from '@/shared/hooks/useEscapeKey';

export function ObsidianShellContent({ data, theme, isMobileView, isCardPreview, isEditor, children }: any) {
  const { selectedMedia, setSelectedMedia } = useObsidianMedia();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

  useEffect(() => {
      const handleScroll = () => {
          if (window.scrollY > 50) {
              setIsScrolled(true);
          } else {
              setIsScrolled(false);
          }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fullName = data?.profile?.fullName || data?.fullName || "Lacete Studio";
  const firstName = fullName.split(' ')[0];

  // Font Config
  const fontHeading = theme?.fontHeading || 'Outfit';
  const fontBody = theme?.fontBody || 'Inter';

  const getFontFamily = (f: string) => {
      if (f?.toLowerCase().includes('outfit')) return "'Outfit', sans-serif";
      if (f?.toLowerCase().includes('mono') || f?.toLowerCase().includes('space')) return "'Space Mono', monospace";
      if (f?.toLowerCase().includes('serif') || f?.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
      return "'Inter', sans-serif";
  };
  
  const customHeadingFont = getFontFamily(fontHeading);
  const customBodyFont = getFontFamily(fontBody);

  // Editor Controls
  const accentColor = theme?.themeColor || '#ffffff';
  
  // Map button shape from editor to Tailwind classes
  const getBtnShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-md';
      return 'rounded-full'; // 'pill' or default
  };
  const btnShape = getBtnShapeClass(theme?.buttonShape);

  // Map card style from editor to Tailwind classes
  const getCardShapeClass = (style?: string) => {
      if (style === 'hard-shadow' || style === 'hard') {
          return 'rounded-none border-2 border-[rgba(255,255,255,0.2)] shadow-[6px_6px_0_0_rgba(255,255,255,0.1)] transition-all duration-300 hover:border-[var(--brand-accent)] hover:shadow-[6px_6px_0_0_var(--brand-accent)]';
      }
      if (style === 'flat') {
          return 'rounded-none border border-[rgba(255,255,255,0.1)] hover:border-[var(--brand-accent)] transition-colors duration-300';
      }
      if (style === 'soft-shadow' || style === 'soft') {
          return 'rounded-2xl border border-[rgba(255,255,255,0.05)] shadow-xl hover:shadow-[0_8px_30px_rgb(255,255,255,0.1)] transition-all duration-300';
      }
      return 'rounded-2xl'; // default
  };
  const cardShape = getCardShapeClass(theme?.cardStyle);
  
  // Determine text color on top of accent color for readability
  const accentText = (accentColor === '#000000' || accentColor === '#0f172a' || accentColor === '#166534') ? '#ffffff' : '#000000';

  return (
    <div className="relative obsidian-root bg-[#050505] text-[#f5f5f5] min-h-screen">
      <style dangerouslySetInnerHTML={{
          __html: `
          .obsidian-theme {
              --brand-bg: #050505;
              --brand-text: #f5f5f5;
              --brand-muted: #8a8a93;
              --brand-border: rgba(255, 255, 255, 0.1);
              --brand-accent: ${accentColor};
              --accent-text: ${accentText};
          }
          .obsidian-theme { font-family: ${customBodyFont} !important; }
          .obsidian-theme .font-heading { font-family: ${customHeadingFont} !important; }
          .obsidian-theme .font-body { font-family: ${customBodyFont} !important; }
          .obsidian-theme .font-sans { font-family: ${customBodyFont} !important; }
          .obsidian-theme .font-serif { font-family: ${customHeadingFont} !important; }
          .obsidian-theme ::selection { background: rgba(255,255,255,0.2); color: #fff; }
          .obsidian-img-container { overflow: hidden; }
          .obsidian-img-container img { transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1); }
          .obsidian-img-container:hover img { transform: scale(1.05); }
          
          .obsidian-btn-primary {
              background-color: var(--brand-accent);
              color: var(--accent-text);
          }
          .obsidian-btn-primary:hover {
              opacity: 0.9;
              transform: scale(1.02);
          }
          .obsidian-btn-outline:hover {
              background-color: var(--brand-accent) !important;
              color: var(--accent-text) !important;
          }
          .hover-accent:hover {
              color: var(--brand-accent) !important;
          }
          .group:hover .group-hover-accent {
              color: var(--brand-accent) !important;
          }
          .group:hover .group-hover-bg-accent {
              background-color: var(--brand-accent) !important;
              color: var(--accent-text) !important;
              border-color: var(--brand-accent) !important;
          }
      `}} />

      <div className="obsidian-theme font-body relative z-10 w-full flex flex-col">
          {/* Navbar */}
          <nav className={`fixed top-0 left-0 w-full z-50 px-6 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'mix-blend-difference py-6'}`}>
              <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                  <a href="#" className="font-heading text-xl font-semibold tracking-wide text-white flex items-center gap-2">
                      <div className={`w-4 h-4 bg-[var(--brand-accent)] ${btnShape}`}></div>
                      <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
                  </a>
                  
                  <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
                      <a href="#work" className="hover-accent transition-colors">
                          <EditableText value={theme?.customTexts?.obs_nav_work || 'Work'} field="obs_nav_work" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                      </a>
                      <a href="#about" className="hover-accent transition-colors">
                          <EditableText value={theme?.customTexts?.obs_nav_about || 'Studio'} field="obs_nav_about" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                      </a>
                      <a href="#services" className="hover-accent transition-colors">
                          <EditableText value={theme?.customTexts?.obs_nav_services || 'Services'} field="obs_nav_services" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                      </a>
                  </div>

                  <a href="#contact" className={`hidden md:flex items-center gap-2 border border-[rgba(255,255,255,0.1)] ${btnShape} px-5 py-2 text-sm transition-colors duration-300 text-white obsidian-btn-outline`}>
                      <EditableText value={theme?.customTexts?.obs_nav_cta || "Let's Talk"} field="obs_nav_cta" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                  </a>

                  <button className="md:hidden text-white text-2xl hover-accent" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                      <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                  </button>
              </div>
          </nav>
          
          {isMobileMenuOpen && (
              <div className="fixed inset-0 z-40 bg-[#050505] flex flex-col items-center justify-center gap-8 text-2xl font-heading">
                  <a href="#work" onClick={() => setIsMobileMenuOpen(false)} className="hover-accent">Work</a>
                  <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover-accent">Studio</a>
                  <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover-accent">Services</a>
                  <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className={`mt-4 border border-[rgba(255,255,255,0.1)] ${btnShape} px-8 py-3 transition-colors duration-300 obsidian-btn-outline`}>Let's Talk</a>
              </div>
          )}

          {/* BLOCK CHILDREN RENDERED HERE */}
          <div className="w-full flex flex-col pt-20 md:pt-24 flex-1 [&>*:last-child]:mt-auto">
            {children}
          </div>
      </div>

      {/* Modals for media preview */}
      <AnimatePresence>
          {selectedMedia && (
              <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-10"
              >
                  <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setSelectedMedia(null)}></div>
                  <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                      className={`relative w-full max-w-6xl bg-black flex flex-col overflow-hidden border border-white/10 shadow-2xl ${cardShape}`}
                  >
                      <div className="flex justify-between items-center px-4 py-3 md:px-6 border-b border-white/10 bg-[#0a0a0a]">
                          <div className="flex flex-col">
                              <h3 className="font-heading font-medium text-lg md:text-xl text-white">{selectedMedia.title}</h3>
                          </div>
                          <button onClick={() => setSelectedMedia(null)} className={`w-9 h-9 flex items-center justify-center bg-white text-black hover:bg-gray-200 transition-all ${btnShape} shrink-0`}>
                              <i className="fas fa-times"></i>
                          </button>
                      </div>

                      <div className="w-full bg-black relative" style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}>
                          {selectedMedia.type === 'video' ? (
                              <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                          ) : (
                              <div className="w-full flex items-center justify-center p-4 md:p-12">
                                  <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain rounded" />
                              </div>
                          )}
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}

export function ObsidianShell(props: any) {
  return (
    <ObsidianProvider>
      <ObsidianShellContent {...props} />
    </ObsidianProvider>
  );
}
