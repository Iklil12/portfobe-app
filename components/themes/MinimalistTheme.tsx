"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const getYouTubeThumbnail = (url: string) => {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : url;
};

// --- VARIANTS ANIMASI LEVEL DEWA (Dengan Koreografi Delay) ---
const premiumEase = [0.16, 1, 0.3, 1] as const; 

// Menerima parameter 'custom' untuk mengatur urutan (delay) secara spesifik
const cinematicBlurUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  visible: (customDelay = 0) => ({ 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)", 
    transition: { duration: 1.4, ease: premiumEase, delay: customDelay } 
  })
};

const cinematicBlurRight = {
  hidden: { opacity: 0, x: -40, filter: "blur(12px)" },
  visible: (customDelay = 0) => ({ 
    opacity: 1, 
    x: 0, 
    filter: "blur(0px)", 
    transition: { duration: 1.4, ease: premiumEase, delay: customDelay } 
  })
};

const imageReveal = {
  hidden: { opacity: 0, scale: 1.1, filter: "blur(20px)" },
  visible: (customDelay = 0) => ({ 
    opacity: 1, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { duration: 1.6, ease: premiumEase, delay: customDelay } 
  })
};

// Container Staggering (Menyusun urutan elemen di DALAM blok)
const getStaggerContainer = (delayStart = 0, staggerGap = 0.15) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerGap, delayChildren: delayStart }
  }
});

export default function MinimalistTheme({ data, theme, isMobileView = false }: { data: any, theme: any, isMobileView?: boolean }) {
  const [openAward, setOpenAward] = useState<string | null>(null);

  const fullName = data?.profile?.fullName || data?.fullName || "Jamal Arifin";
  const profession = data?.profile?.profession || data?.profession || "Director & Editor";
  const bio = data?.profile?.bio || data?.bio || "A visual storyteller based in Jakarta. I craft meticulous, high-end visual narratives for commercial brands and independent films.";
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.co`;
  const archiveItems = (data?.projects || data?.user?.projects || []).slice(0, 4);
  const awardItems = data?.certificates || data?.user?.certificates || [];
  const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

  const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
  const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
  const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop`;

  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  const getFontFamily = (fontName: string) => {
    if (!fontName) return "'Inter', sans-serif";
    if (fontName.toLowerCase().includes('space') || fontName.toLowerCase().includes('mono')) return "'Space Mono', monospace";
    if (fontName.toLowerCase().includes('serif') || fontName.toLowerCase().includes('elegant')) return "'Playfair Display', serif";
    return "'Inter', sans-serif"; 
  };
  
  const headingFont = getFontFamily(theme?.fontHeading);
  const bodyFont = getFontFamily(theme?.fontBody);

  return (
    <div className={`flex w-full min-h-screen bg-white text-black relative min-body ${isMobileView ? 'flex-col' : 'flex-col lg:flex-row'}`}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap');
        .min-heading { font-family: ${headingFont} !important; }
        .min-body { font-family: ${bodyFont} !important; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
        * { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
        ::selection { background: #000000; color: #ffffff; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* --- KIRI: SIDEBAR (Mulai Animasi di Detik 0.1) --- */}
      <motion.aside 
        initial="hidden" animate="visible" variants={getStaggerContainer(0.1, 0.15)}
        className={`bg-gray-50 border-gray-200 p-8 flex flex-col justify-between z-10 overflow-y-auto hide-scrollbar ${isMobileView ? 'w-full relative h-auto border-b' : 'w-full lg:w-[35%] lg:sticky lg:top-0 lg:h-screen lg:border-r lg:p-12'}`}
      >
        <div>
          <div className="flex justify-between items-start mb-10">
            <motion.h1 variants={cinematicBlurRight} className="text-2xl font-black tracking-tighter uppercase leading-none min-heading">
              {firstName}<br/>{lastName || '.'}
            </motion.h1>
            <motion.div variants={cinematicBlurRight} className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Available</span>
            </motion.div>
          </div>
          
          <motion.div variants={imageReveal} className="w-full aspect-[4/5] overflow-hidden mb-8 border border-gray-200 relative group">
            <img src={displayAvatar} alt={fullName} className="w-full h-full object-cover grayscale transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </motion.div>

          <motion.h2 variants={cinematicBlurUp} className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3 min-heading">
            {profession}
          </motion.h2>
          <motion.p variants={cinematicBlurUp} className="text-gray-600 text-sm leading-relaxed mb-6 min-body">
            {bio}
          </motion.p>
          
          <motion.ul variants={cinematicBlurUp} className="text-xs font-mono text-gray-500 space-y-2 mb-8 opacity-80">
            {['Minimalist Layout', 'Clean Typography', 'High-end Visuals'].map((item, idx) => (
              <motion.li key={idx} whileHover={{ x: 5, color: "#000" }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="cursor-default">
                → {item}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.div variants={cinematicBlurUp} className={`pt-8 border-t border-gray-200 ${isMobileView ? 'mt-4' : 'mt-8'}`}>
          <motion.a whileHover={{ scale: 1.02, originX: 0 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} href={`mailto:${userEmail}`} className="inline-block text-xl font-bold tracking-tight hover:text-gray-500 transition-colors mb-6 truncate min-heading">
            {userEmail}
          </motion.a>
          <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest">
            {links.map((l: any, i: number) => (
              <motion.a key={i} href={l.url} target="_blank" rel="noreferrer" whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }} className="text-gray-500 hover:text-black transition-colors relative inline-block group">
                {l.platform}
                <span className="absolute bottom-[-2px] left-0 w-0 h-px bg-black transition-all duration-300 ease-out group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.aside>

      {/* --- KANAN: MAIN CONTENT --- */}
      <main className={`bg-white ${isMobileView ? 'w-full' : 'w-full lg:w-[65%]'}`}>
        
        {/* STATS SECTION */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          variants={getStaggerContainer(0.8, 0.2)} className="border-b border-gray-200"
        >
          <div className="grid grid-cols-2 border-b border-gray-200">
            <motion.div variants={cinematicBlurUp} className="p-8 border-r border-gray-200 flex flex-col justify-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Projects</p>
              <motion.p className={`text-3xl ${isMobileView ? '' : 'md:text-4xl'} font-black tracking-tighter min-heading`}>{archiveItems.length} Total</motion.p>
            </motion.div>
            <motion.div variants={cinematicBlurUp} className="p-8 flex flex-col justify-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Recognition</p>
              <motion.p className={`text-3xl ${isMobileView ? '' : 'md:text-4xl'} font-black tracking-tighter min-heading`}>{awardItems.length} Awards</motion.p>
            </motion.div>
          </div>
        </motion.section>

        {/* PROJECTS SECTION */}
        <section className={`p-8 ${isMobileView ? '' : 'lg:p-12'}`}>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} 
            variants={cinematicBlurUp} custom={1.2}
            className="flex justify-between items-end mb-10 border-b border-gray-100 pb-6"
          >
            <h2 className="text-2xl font-black uppercase tracking-tighter min-heading">Selected Index</h2>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Archive</span>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} 
            variants={getStaggerContainer(1.4, 0.25)}
            className={`grid grid-cols-1 gap-8 ${isMobileView ? '' : 'md:grid-cols-2'}`}
          >
            {archiveItems.map((p: any, i: number) => (
              <motion.a 
                variants={cinematicBlurUp} whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}
                href={p.mediaUrl || '#'} target="_blank" rel="noreferrer" key={i} className="group cursor-pointer block"
              >
                <div className="w-full aspect-[4/3] bg-gray-100 mb-4 border border-gray-200 overflow-hidden relative">
                  <img src={p.projectType === 'video' ? getYouTubeThumbnail(p.mediaUrl) : p.mediaUrl} className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] grayscale group-hover:grayscale-0 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center">
                    <div className="w-14 h-14 bg-white flex items-center justify-center rounded-full shadow-2xl scale-50 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 delay-100 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                      <i className={`fas ${p.projectType === 'video' ? 'fa-play ml-1' : 'fa-arrow-right -rotate-45'} text-black`}></i>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-start mt-4">
                  <div>
                    <h3 className="text-base font-bold tracking-tight mb-1 min-heading group-hover:text-gray-600 transition-colors">{p.title}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{p.projectType}</p>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 pt-1 group-hover:text-black transition-colors">0{i+1}</span>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* --- TOMBOL VENOM MONOCHROME (SUDAH DIINJEKSI LANGSUNG) --- */}
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={cinematicBlurUp} 
            custom={0.3} 
            className="w-full flex justify-center mt-16 mb-12 relative z-10"
          >
            <Link href={`/${subdomain}/gallery`} className="block no-underline">
              <motion.button
                initial="initial"
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center gap-3 px-10 py-4 cursor-pointer overflow-hidden rounded-full border border-black/20 bg-transparent transition-colors duration-300"
              >
                {/* Lapisan Venom (Clip-path Reveal) */}
                <motion.div
                  variants={{
                    initial: { 
                      scale: 0, 
                      opacity: 0,
                      clipPath: "circle(0% at 50% 50%)" 
                    },
                    hover: { 
                      scale: 1, 
                      opacity: 1,
                      clipPath: "circle(150% at 50% 50%)" 
                    }
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 50,
                    damping: 15,
                    mass: 1,
                    opacity: { duration: 0.4 },
                    clipPath: { duration: 1.2, ease: premiumEase } 
                  }}
                  className="absolute inset-0 z-0 rounded-full blur-xl origin-center bg-black"
                />

                {/* Teks Content */}
                <motion.span
                  variants={{
                    initial: { color: "#262626" },
                    hover: { color: "#ffffff" }
                  }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 font-black tracking-[0.2em] uppercase text-xs"
                >
                  EXPLORE
                </motion.span>

                {/* Ikon Panah */}
                <motion.span
                  variants={{
                    initial: { color: "#262626", x: 0 },
                    hover: { color: "#ffffff", x: 5 }
                  }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                  className="relative z-10 flex items-center justify-center"
                >
                  <i className="fa-solid fa-arrow-right-long text-xs"></i>
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>
        </section>

        {/* AWARDS SECTION */}
        <section className="border-t border-gray-200 bg-gray-50/30 overflow-hidden">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cinematicBlurUp} custom={0.2} className={`p-8 ${isMobileView ? '' : 'lg:p-12'} pb-6`}>
            <h2 className="text-2xl font-black uppercase tracking-tighter min-heading">Honors & Awards</h2>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={getStaggerContainer(0.4, 0.2)} className="border-t border-gray-200">
            {awardItems.length > 0 ? awardItems.map((award: any, i: number) => {
              const isOpen = openAward === award.id;
              return (
                <motion.div variants={cinematicBlurUp} key={i} className="border-b border-gray-200 group">
                  <div className={`px-8 ${isMobileView ? '' : 'lg:px-12'} py-6 flex justify-between items-center cursor-pointer transition-colors duration-500 hover:bg-gray-100 ${isOpen ? 'bg-gray-100' : 'bg-transparent'}`} onClick={() => setOpenAward(isOpen ? null : award.id)}>
                    <div className="flex items-center gap-4 md:gap-8 w-2/3">
                      <span className={`font-mono text-[10px] text-gray-400 group-hover:text-black transition-colors ${isMobileView ? 'hidden' : 'md:block'}`}>{award.year || new Date(award.createdAt).getFullYear()}</span>
                      <h3 className="text-sm md:text-lg font-bold tracking-tight min-heading group-hover:translate-x-2 transition-transform duration-500 ease-out">{award.title}</h3>
                    </div>
                    <div className="flex items-center justify-end gap-6 w-1/3">
                      <span className={`text-[10px] font-bold uppercase tracking-widest text-gray-500 ${isMobileView ? 'hidden' : 'md:block'} text-right truncate`}>{award.issuer}</span>
                      <motion.i animate={{ rotate: isOpen ? 180 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="fas fa-chevron-down text-[10px] text-gray-400" />
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease: premiumEase }} className="overflow-hidden bg-white border-t border-gray-200">
                        <div className={`px-8 ${isMobileView ? '' : 'lg:px-12'} py-8 flex gap-8 ${isMobileView ? 'flex-col' : 'flex-col md:flex-row'}`}>
                          <motion.div initial={{ scale: 0.9, filter: "blur(5px)" }} animate={{ scale: 1, filter: "blur(0px)" }} transition={{ duration: 0.8, delay: 0.2, ease: premiumEase }} className={`bg-gray-50 border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center p-2 ${isMobileView ? 'w-full' : 'w-full md:w-64'}`}>
                            <img src={award.mediaUrl} className="w-full h-auto object-contain grayscale hover:grayscale-0 hover:scale-105 transition-all duration-700" alt="Certificate" />
                          </motion.div>
                          
                          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: premiumEase }} className="flex flex-col justify-center flex-1">
                            <p className="font-bold mb-2 min-heading text-sm uppercase tracking-wider">{award.status || 'Verified Achievement'}</p>
                            <p className="text-xs text-gray-600 max-w-md leading-relaxed mb-6 opacity-90 min-body">{award.description || 'Awarded for exceptional performance and dedication in the respective field.'}</p>
                            
                            <a href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:text-gray-500 transition-colors w-max relative group/btn">
                              Lihat Lampiran <i className="fas fa-arrow-right group-hover/btn:translate-x-1 transition-transform"></i>
                              <span className="absolute bottom-[-4px] left-0 w-0 h-px bg-black transition-all duration-300 group-hover/btn:w-full"></span>
                            </a>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            }) : <div className="px-8 py-10 text-gray-400 text-sm font-mono border-b border-gray-200 text-center">No awards recorded.</div>}
          </motion.div>
        </section>

        {/* FOOTER */}
        <motion.footer initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cinematicBlurUp} custom={0.2} className={`p-8 text-center flex gap-4 bg-gray-100 border-t border-gray-200 min-body ${isMobileView ? 'flex-col' : 'flex-col md:flex-row md:text-left justify-between lg:p-12'}`}>
          <p className="text-[10px] font-mono text-gray-500">© 2026 {fullName}. All Rights Reserved.</p>
          <span className="text-[10px] font-bold uppercase tracking-widest text-black min-heading">portfo.be/{subdomain}</span>
        </motion.footer>

      </main>
    </div>
  );
}