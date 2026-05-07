"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LazyImage } from '@/components/ui/LazyImage';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

const getYouTubeThumbnail = (url: string) => {
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
    return match ? `https://res.cloudinary.com/deobqjna7/image/youtube/${match[1]}.jpg` : url;
};

export default function MidnightEmulsionTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
    const [isCopied, setIsCopied] = useState(false);

  // --- ANIMASI STABILISASI ---
  // Kita gunakan animate="visible" untuk editor agar langsung tampil tanpa pemicu scroll (yang sering rusak di preview)
  // Tapi tetap gunakan whileInView untuk live site agar ada efek scroll reveal.
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";


    // Ekstraksi Data
    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
    const profession = data?.profile?.profession || data?.profession || "Art Director & Designer";
    const bio = data?.profile?.bio || data?.bio || "Creating clean, functional, and visually striking digital experiences with extreme attention to detail.";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
    const archiveItems = (data?.projects || data?.user?.projects || []).slice(0, 4);
    const awardItems = data?.certificates || data?.user?.certificates || [];
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    // Memecah nama untuk efek Typography (Depan solid, Belakang bergaris)
    const nameParts = fullName.trim().split(' ');
    const displayFirstName = nameParts[0];
    const displayLastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Creative'; // Fallback jika nama cuma 1 kata

    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
    const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

    const fontHeading = theme?.fontHeading || 'Newsreader';
    const fontBody = theme?.fontBody || 'Instrument Sans';
    const radiusClass = theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-xl';

    const rawHighlightColor = theme?.themeColor || '#4fd1c5';
    const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#4fd1c5';

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(userEmail);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const canvasEase = [0.22, 1, 0.36, 1] as any;
    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: canvasEase } }
    };

    return (
        <main className="relative min-h-screen bg-[#030508] text-[#e2e8f0] font-sans selection:bg-[var(--hl)] selection:text-[#030508] @container flex flex-col @lg:flex-row midnight-theme" style={{ '--hl': highlightColor } as React.CSSProperties}>

            <style dangerouslySetInnerHTML={{
                    __html: `
            .midnight-theme .font-serif { font-family: 'Cormorant Garamond', serif; }
            .midnight-theme .font-sans { font-family: 'Inter', sans-serif; }

            .film-grain {
                background-image: url('https://www.transparenttextures.com/patterns/stardust.png');
                opacity: 0.05;
            }
          `}} />
            {/* OVERLAY GLOBAL: GRAIN */}
            <div className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} inset-0 z-50 pointer-events-none film-grain mix-blend-overlay`}></div>

            {/* =========================================
                SEBELAH KIRI: STICKY HERO PANEL 
            ========================================= */}
            <div className="relative z-20 w-full @lg:w-5/12 @lg:h-screen @lg:sticky @lg:top-0 flex flex-col justify-between p-8 @md:p-12 @lg:p-16 border-b @lg:border-b-0 @lg:border-r border-white/5 overflow-hidden bg-[#030508]">
                
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-60">
                    <div className="absolute top-[-10%] left-[-20%] w-[400px] h-[400px] bg-[var(--hl)] opacity-10 rounded-full blur-[100px] animate-float-slow" />
                    <div className="absolute bottom-[-10%] right-[-20%] w-[300px] h-[300px] bg-blue-900/20 rounded-full blur-[120px] animate-float-slow" style={{ animationDelay: '-10s' }} />
                </div>

                <header className="relative z-10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                            <LazyImage src={displayAvatar} alt={displayFirstName} className="w-full h-full object-cover grayscale" />
                        </div>
                        <span className="font-sans font-bold tracking-tight text-white uppercase text-xs">
                            {displayFirstName}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-[var(--hl)]"></span>
                        <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-slate-400">System Online</span>
                    </div>
                </header>

                <div className="relative z-10 my-16 @lg:my-auto">
                    <motion.p initial="hidden" animate="visible" variants={fadeUp} className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--hl)] mb-6 flex items-center gap-4">
                        <span className="w-8 h-[1px] bg-[var(--hl)] opacity-50"></span>
                        {profession}
                    </motion.p>
                    
                    {/* TYPOGRAPHY NAMA DINAMIS */}
                    <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="font-serif text-5xl @md:text-6xl @lg:text-7xl leading-[0.9] mb-8 uppercase tracking-tighter break-words">
                        <span className="block text-white">{displayFirstName}</span>
                        <span className="block text-stroke text-stroke-hover transition-all duration-500 cursor-default">{displayLastName}</span>
                    </motion.h1>

                    <motion.p initial="hidden" animate="visible" variants={fadeUp} className="font-sans text-slate-400 font-medium leading-relaxed max-w-sm text-sm @md:text-base">
                        {bio}
                    </motion.p>

                    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mt-10 flex gap-4">
                        <button onClick={handleCopyEmail} className={`px-6 py-3 border border-white/10 hover:border-[var(--hl)] bg-white/5 hover:bg-[var(--hl)]/10 text-white font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-3 backdrop-blur-md ${radiusClass}`}>
                            {isCopied ? 'Access Granted' : 'Initiate Contact'}
                        </button>
                    </motion.div>
                </div>

                <footer className="relative z-10 flex gap-6 font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 flex-wrap">
                    {links.map((l: any, i: number) => (
                        <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:text-[var(--hl)] transition-colors">
                            {l.platform}
                        </a>
                    ))}
                </footer>
            </div>

            {/* =========================================
                SEBELAH KANAN: WIDESCREEN SCROLLING GALLERY
            ========================================= */}
            <div className="relative z-10 w-full @lg:w-7/12 bg-[#05070a] flex flex-col">
                
                <div className="hidden @lg:flex h-32 items-center justify-center border-b border-white/5 shrink-0">
                    <span className="font-serif italic text-slate-600 text-sm tracking-widest">Scroll to explore</span>
                </div>

                <div className="p-6 @md:p-12 @lg:p-20 flex flex-col gap-24 @lg:gap-40 shrink-0">
                    {/* DAFTAR PROYEK */}
                    {archiveItems.map((p: any, i: number) => {
                        const isVideo = p.projectType === 'video';
                        const sceneNumber = (i + 1).toString().padStart(2, '0');

                        return (
                            <motion.a
                                href={p.mediaUrl || '#'} target="_blank" rel="noreferrer" key={i}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                className="group flex flex-col w-full relative"
                            >
                                <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-4">
                                    <div className="flex flex-col">
                                        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-1">Scene {sceneNumber}</span>
                                        <h2 className="font-serif text-2xl @md:text-4xl text-white group-hover:text-[var(--hl)] transition-colors">{p.title}</h2>
                                    </div>
                                    <span className="font-sans text-xs font-medium text-slate-500 hidden @md:block">{p.projectType}</span>
                                </div>

                                <div className={`w-full aspect-video @md:aspect-[21/9] bg-[#0a0f1e] overflow-hidden relative shadow-2xl ${radiusClass}`}>
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.03)_50%,rgba(255,255,255,0))] bg-[length:100%_4px] z-10 pointer-events-none opacity-20"></div>
                                    <LazyImage src={isVideo ? getYouTubeThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover grayscale-[80%] opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-1000 ease-out" />
                                </div>

                                <div className="mt-6 ml-auto w-full @md:w-3/4 @lg:w-2/3">
                                    <p className="font-sans text-sm @md:text-base text-slate-400 leading-relaxed text-right">
                                        {p.description || 'Visual exploration and structural design implementation.'}
                                    </p>
                                </div>
                            </motion.a>
                        );
                    })}
                </div>

                {/* =========================================
                    SECTION SERTIFIKAT (CREDITS TITLE)
                ========================================= */}
                {awardItems.length > 0 && (
                    <div id="awards" className="p-6 @md:p-12 @lg:p-20 flex flex-col border-t border-white/5 bg-[#030508]/50 shrink-0">
                        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="mb-12">
                            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-2 block">Accolades</span>
                            <h2 className="font-serif text-3xl @md:text-5xl text-white">Recognitions</h2>
                        </motion.div>

                        <div className="flex flex-col border-t border-white/10">
                            {awardItems.map((award: any, i: number) => (
                                <motion.a
                                    href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" key={i}
                                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                    className="group flex flex-col @md:flex-row @md:items-center justify-between border-b border-white/10 py-6 @md:py-8 cursor-pointer relative overflow-hidden"
                                >
                                    {/* Hover Line Effect */}
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--hl)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-0"></div>

                                    <div className="relative z-10 flex flex-col @md:flex-row @md:items-center gap-2 @md:gap-8 w-full @md:w-3/4 mb-4 @md:mb-0">
                                        <span className="font-serif text-slate-500 italic text-lg @md:text-xl w-16">{award.year || new Date(award.createdAt).getFullYear()}</span>
                                        <div className="flex flex-col">
                                            <h3 className="font-sans font-medium text-lg @md:text-xl text-white group-hover:text-[var(--hl)] transition-colors">{award.title}</h3>
                                            <span className="font-sans text-xs font-medium text-slate-500 mt-1 uppercase tracking-widest">{award.issuer}</span>
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex justify-between items-center w-full @md:w-auto gap-8">
                                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[var(--hl)] px-3 py-1 rounded-full border border-[var(--hl)]/20 bg-[var(--hl)]/5">{award.status || 'Verified'}</span>
                                        <i className="fas fa-arrow-right -rotate-45 text-slate-500 group-hover:text-[var(--hl)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"></i>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tombol Archive di Akhir Scroll */}
                <div className="pt-20 border-t border-white/5 flex justify-center pb-32 bg-[#05070a] shrink-0">
                    <Link href={`/${subdomain}/gallery`} scroll={false} className="group relative overflow-hidden font-serif italic text-3xl @md:text-5xl text-slate-500 hover:text-white transition-colors duration-500 flex items-center gap-6">
                        <span>Open Full Archive</span>
                        <i className="fas fa-arrow-right text-[var(--hl)] -rotate-45 group-hover:rotate-0 transition-transform duration-500"></i>
                    </Link>
                </div>
                
            </div>

        </main>
    );
}