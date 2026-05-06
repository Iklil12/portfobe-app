"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, animate } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';

export default function ViewfinderTheme({ data, theme, isMobileView }: any) {
    const profile = data?.profile || {};
    const projects = data?.projects || data?.user?.projects || [];
    const certificates = data?.certificates || [];
    const links = data?.links || [];

    const fullName = profile.fullName || "JAMAL ARIFIN";
    const profession = profile.profession || "Cinematographer & Editor";
    const bio = profile.bio || `"Weaving light, shadow, and sound to capture the human experience. Specializing in high-end commercial and narrative films."`;
    const location = profile.location || "JAKARTA, IDN";
    const email = data?.email || "hello@example.com";

    const getYouTubeThumbnail = (p: any) => {
        const urlToCheck = p.mediaUrl || p.url || p.projectUrl || "";
        const match = urlToCheck.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
        if (match) return `https://res.cloudinary.com/deobqjna7/image/youtube/${match[1]}.jpg`;
        return p.mediaUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop';
    };

    const totalProjects = projects.length > 0 ? projects.length : 120;
    const totalHonors = certificates.length > 0 ? certificates.length : 15;

    const primaryColor = theme?.themeColor || '#FF0033';

    const [timecode] = useState("00:04:26:15");
    const [selectedCert, setSelectedCert] = useState<any>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: -500, behavior: 'smooth' });
    };
    const scrollRight = () => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: 500, behavior: 'smooth' });
    };

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0]?.toUpperCase() || "VISUAL";
    const lastName = nameParts.slice(1).join(' ').toUpperCase() || "STORYTELLER";

    const subdomain = profile.subdomain || data?.subdomain || "username";

    // Konfigurasi animasi kustom untuk tampilan profesional
    const cinematicEase = [0.16, 1, 0.3, 1] as any;
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
    };

    return (
        <div
            style={{ '--primary': primaryColor } as React.CSSProperties}
            className="viewfinder-theme antialiased bg-[#050505] text-[#F3F3F1] relative w-full h-full overflow-hidden"
        >
            <style dangerouslySetInnerHTML={{
                __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

        .viewfinder-theme { font-family: 'Space Mono', monospace; }
        .viewfinder-theme ::selection { background-color: var(--primary); color: #fff; }
        .font-cinema { font-family: 'Bebas Neue', sans-serif; }

        .film-strip::-webkit-scrollbar { display: none; }
        .film-strip { -ms-overflow-style: none; scrollbar-width: none; scroll-snap-type: x mandatory; }
        .film-frame { scroll-snap-align: center; }

        .viewfinder-tl { border-top: 2px solid #F3F3F1; border-left: 2px solid #F3F3F1; }
        .viewfinder-tr { border-top: 2px solid #F3F3F1; border-right: 2px solid #F3F3F1; }
        .viewfinder-bl { border-bottom: 2px solid #F3F3F1; border-left: 2px solid #F3F3F1; }
        .viewfinder-br { border-bottom: 2px solid #F3F3F1; border-right: 2px solid #F3F3F1; }

        .cine-img { transition: transform 1.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .cine-img:hover { transform: scale(1.05); }

        .vf-crosshair::before, .vf-crosshair::after {
            content: ''; position: absolute; background: rgba(255,255,255,0.15);
            top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;
        }
        .vf-crosshair::before { width: 100%; height: 1px; }
        .vf-crosshair::after { width: 1px; height: 100%; }

        .vf-scroll::-webkit-scrollbar { width: 6px; }
        .vf-scroll::-webkit-scrollbar-track { background: #050505; }
        .vf-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        .vf-scroll::-webkit-scrollbar-thumb:hover { background: var(--primary); }

        .vf-scanline {
            width: 100%; height: 100px; z-index: 10; pointer-events: none;
            background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.03), transparent);
            position: absolute; left: 0; top: -100px;
            animation: scanline 8s linear infinite;
        }
        @keyframes scanline {
            0% { top: -100px; }
            100% { top: 100%; }
        }

        .hero-reveal { clip-path: inset(100% 0 0 0); animation: revealUp 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes revealUp { to { clip-path: inset(0 0 0 0); } }

        /* --- Refined Sizing to match reference --- */
        .vf-hud-text { font-size: 10px; }
        .vf-hero-title { font-size: clamp(48px, 18cqw, 72px); line-height: 1; }
        .vf-hero-sub { font-size: 12px; }
        .vf-section-title { font-size: 36px; }
        .vf-reel-card { width: 60cqw; }
        .vf-reel-title { font-size: 24px; }
        .vf-log-stat-label { font-size: 9px; }
        .vf-log-stat-value { font-size: 48px; }
        .vf-footer-title { font-size: 32px; }
        .vf-hud-padding { padding: 1rem; }
        .vf-hud-brackets { inset: 1.5rem; }
        .vf-cert-title { font-size: 18px; }
        .vf-cert-arrow { font-size: 14px; }

        /* Container-based responsive logic */
        .vf-hero-container { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%; max-width: 56rem; margin: 0 auto; }
        .vf-social-row { display: flex; justify-content: center; gap: 1.25rem; margin-top: 1.5rem; font-size: 1.125rem; color: #6b7280; }
        
        .vf-reel-header { display: flex; flex-direction: column; gap: 1.5rem; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; padding: 0 1rem; }
        .vf-button-group { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; align-items: flex-start; }
        .vf-nav-btns { display: flex; gap: 0.5rem; width: 100%; }
        .vf-nav-btn { flex: 1; text-align: center; }

        @container (min-width: 600px) {
            .vf-hud-text { font-size: 14px; }
            .vf-hero-title { font-size: clamp(80px, 16cqw, 192px); }
            .vf-hero-sub { font-size: 16px; }
            .vf-section-title { font-size: 72px; }
            .vf-reel-card { width: 45cqw; }
            .vf-reel-title { font-size: 50px; }
            .vf-log-stat-label { font-size: 12px; }
            .vf-log-stat-value { font-size: 72px; }
            .vf-footer-title { font-size: 96px; }
            .vf-hud-padding { padding: 3rem; }
            .vf-hud-brackets { inset: 10rem; }
            .vf-cert-title { font-size: 24px; }
            .vf-cert-arrow { font-size: 20px; }
            
            .vf-reel-header { flex-direction: row; align-items: flex-end; }
            .vf-button-group { width: auto; align-items: flex-end; }
            .vf-nav-btns { width: auto; }
            .vf-nav-btn { flex: none; }
        }
        `}} />




            {/* ===== STICKY HUD OVERLAY ===== */}
            <div className="fixed inset-0 z-50 pointer-events-none vf-hud-padding flex flex-col justify-between @container" style={{ mixBlendMode: 'difference' }}>
                {/* Top */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.5, ease: cinematicEase }}
                    className="flex justify-between items-start vf-hud-text font-bold tracking-widest text-white"
                >
                    <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--primary)', mixBlendMode: 'normal' }}></span>
                            REC
                        </span>
                        <span>TC {timecode}</span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                        <span className="border border-current px-1.5 py-0.5 rounded-sm text-[9px]">100% 🔋</span>
                        <span>ISO 800 | 24FPS</span>
                    </div>
                </motion.div>

                {/* Viewfinder brackets */}
                <motion.div
                    initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 0.2 }} transition={{ duration: 2, ease: cinematicEase }}
                    className="absolute vf-hud-brackets flex items-center justify-center pointer-events-none"
                >
                    <div className="w-full h-full relative">
                        <div className="absolute top-0 left-0 w-8 h-8 viewfinder-tl"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 viewfinder-tr"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 viewfinder-bl"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 viewfinder-br"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-6 h-px bg-white"></div>
                            <div className="w-px h-6 bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.5, ease: cinematicEase }}
                    className="flex justify-between items-end vf-hud-text font-bold tracking-widest text-white"
                >
                    <div className="leading-snug">
                        <span>DIR. {fullName.toUpperCase()}</span>
                        <br />{location.toUpperCase()}
                    </div>
                    <div className="text-right pointer-events-auto flex flex-col gap-0.5" style={{ mixBlendMode: 'normal' }}>
                        <a href="#reel" className="hover:opacity-70 transition">/ REEL</a>
                        <a href="#log" className="hover:opacity-70 transition">/ LOG</a>
                        <a href={`mailto:${email}`} className="hover:opacity-70 transition">/ CONTACT</a>
                    </div>
                </motion.div>
            </div>

            {/* MAIN SCROLLABLE AREA */}
            <div className="w-full h-full overflow-y-auto overflow-x-hidden vf-scroll">

                {/* ===== HERO SECTION ===== */}
                <section className="relative bg-[#050505] vf-crosshair overflow-hidden" style={{ minHeight: '100svh' }}>
                    <div className="vf-scanline"></div>

                    {/* Hero Content */}
                    <div className="relative z-10 flex items-center justify-center px-6 py-24 mix-blend-difference" style={{ minHeight: '100svh' }}>
                        <motion.div
                            // PERUBAHAN: Gunakan whileInView dan once: false agar berulang saat di-scroll naik/turun
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.3 }}
                            variants={{
                                hidden: { opacity: 0, scale: 0.95 },
                                visible: {
                                    opacity: 1,
                                    scale: 1,
                                    transition: { duration: 1.2, ease: cinematicEase, staggerChildren: 0.2 }
                                }
                            }}
                            className="vf-hero-container"
                        >
                            <motion.p
                                variants={{
                                    hidden: { opacity: 0, letterSpacing: '1em' },
                                    visible: { opacity: 1, letterSpacing: '0.4em', transition: { duration: 1.5, ease: cinematicEase } }
                                }}
                                className="text-gray-400 mb-3 uppercase vf-hero-sub"
                            >
                                {profession}
                            </motion.p>

                            <motion.h1
                                // PERUBAHAN: Mengganti class CSS dengan animasi clipPath murni dari Framer agar bisa di-reset
                                variants={{
                                    hidden: { opacity: 0, y: 30, clipPath: 'inset(100% 0 0 0)' },
                                    visible: { opacity: 1, y: 0, clipPath: 'inset(0 0 0 0)', transition: { duration: 1.2, ease: cinematicEase } }
                                }}
                                className="font-cinema leading-none tracking-wider text-[#F3F3F1] vf-hero-title"
                            >
                                {firstName}<br />{lastName}
                            </motion.h1>

                            <motion.p
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
                                }}
                                className="text-gray-400 max-w-md mx-auto leading-relaxed mt-5 bg-[#050505]/60 p-4 border border-white/5 vf-hero-sub"
                            >
                                "{bio}"
                            </motion.p>

                            <motion.div
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                                }}
                                className="vf-social-row"
                            >
                                {links.map((link: any, idx: number) => (
                                    <motion.a
                                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                                        whileHover={{ scale: 1.3, color: "#F3F3F1" }}
                                        whileTap={{ scale: 0.9 }}
                                        key={idx} href={link.url} target="_blank" rel="noreferrer"
                                        className="transition-colors duration-300"
                                    >
                                        <i className={`fab fa-${link.platform.toLowerCase()}`}></i>
                                    </motion.a>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* ===== REEL SECTION ===== */}
                <section id="reel" className="relative z-20 py-20 bg-[#050505] border-y border-white/10 overflow-hidden">
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}
                        variants={fadeUpVariants}
                        className="vf-reel-header pointer-events-auto"
                    >
                        <h2 className="font-cinema tracking-wide text-[#F3F3F1] vf-section-title">THE REEL <span style={{ color: 'var(--primary)' }}>.</span></h2>
                        <div className="vf-button-group">
                            <div className="vf-nav-btns">
                                <motion.button
                                    whileHover={{ x: -8, backgroundColor: "#F3F3F1", color: "#050505" }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={scrollLeft}
                                    className="vf-nav-btn text-[10px] sm:text-sm border border-white/20 px-4 sm:px-6 py-2 transition-colors uppercase tracking-[0.1em] sm:tracking-[0.2em] font-bold bg-transparent text-white"
                                >
                                    <i className="fas fa-chevron-left mr-2"></i> PREV
                                </motion.button>
                                <motion.button
                                    whileHover={{ x: 8, backgroundColor: "#F3F3F1", color: "#050505" }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={scrollRight}
                                    className="vf-nav-btn text-[10px] sm:text-sm border border-white/20 px-4 sm:px-6 py-2 transition-colors uppercase tracking-[0.1em] sm:tracking-[0.2em] font-bold bg-transparent text-white"
                                >
                                    NEXT <i className="fas fa-chevron-right ml-2"></i>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    <div ref={scrollRef} className="film-strip flex gap-4 overflow-x-auto px-4 pb-8 pt-2 pointer-events-auto">
                        {projects.length > 0 ? projects.map((p: any, idx: number) => (
                            <motion.a
                                // PERBAIKAN: Hapus x: 50, gunakan scale, dan set once: true
                                initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                viewport={{ once: false, amount: 0.15 }} // Akan animate lagi jika discroll up/down
                                transition={{ duration: 0.8, delay: (idx % 3) * 0.1, ease: cinematicEase }}
                                whileHover={{ y: -5 }}
                                href={p.url || p.mediaUrl || p.projectUrl || '#'}
                                key={p.id} target="_blank" rel="noreferrer"
                                className="film-frame flex-none block vf-reel-card group"
                            >
                                <div className="w-full aspect-video overflow-hidden bg-gray-900 border border-white/20 relative">
                                    <LazyImage src={getYouTubeThumbnail(p)} alt={p.title} className="w-full h-full object-cover opacity-80 cine-img group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" />
                                </div>
                                <div className="mt-4 overflow-hidden">
                                    <h3 className="font-cinema tracking-wide text-[#F3F3F1] vf-reel-title group-hover:text-[var(--primary)] transition-colors duration-500">
                                        {p.title}
                                    </h3>
                                    <p className="uppercase tracking-widest mt-1 vf-hud-text opacity-60" style={{ color: 'var(--primary)' }}>{p.projectType}</p>
                                </div>
                            </motion.a>
                        )) : (
                            <div className="film-frame flex-none vf-reel-card group">
                                <div className="w-full aspect-[21/9] overflow-hidden bg-gray-900 border border-white/20">
                                    <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" />
                                </div>
                                <div className="mt-3">
                                    <h3 className="font-cinema tracking-wide text-[#F3F3F1] vf-reel-title">NIKE - THE RUN</h3>
                                    <p className="uppercase tracking-widest mt-0.5 vf-hud-text" style={{ color: 'var(--primary)' }}>Commercial</p>
                                </div>
                            </div>
                        )}
                        <div className="flex-none w-4"></div>
                    </div>

                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.5 }}
                        variants={fadeUpVariants}
                        className="mt-12 flex justify-center"
                    >
                        <Link href={`/${subdomain}/gallery`} scroll={false}>
                            <motion.div
                                whileHover="hover"
                                initial="initial"
                                className="group flex items-center gap-3 px-8 py-3 border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-black transition-all duration-300 cursor-pointer uppercase font-black tracking-[0.3em] text-[10px] sm:text-xs"
                            >
                                <span>EXPLORE ALL</span>
                                <motion.i
                                    variants={{
                                        initial: { x: 0, y: 0 },
                                        hover: { x: 5, y: -5 }
                                    }}
                                    className="fas fa-arrow-right -rotate-45"
                                ></motion.i>
                            </motion.div>
                        </Link>
                    </motion.div>
                </section>

                {/* ===== PRODUCTION LOG ===== */}
                <section id="log" className="relative z-20 py-24 px-6 bg-[#F3F3F1] text-[#050505]">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}
                            variants={fadeUpVariants}
                            className="border-b-2 border-[#050505] pb-3 mb-6 flex justify-between items-end"
                        >
                            <h2 className="font-cinema tracking-wide vf-section-title">PRODUCTION LOG</h2>
                            <span className="font-bold uppercase tracking-widest vf-hud-text">FILE_NO: 0042</span>
                        </motion.div>

                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                            }}
                            className="grid grid-cols-2 gap-4 mb-10"
                        >
                            {[
                                { label: "ACTIVE YEARS", val: "08+" },
                                { label: "PROJECTS WRAPPED", val: totalProjects },
                                { label: "HONORS", val: totalHonors },
                                { label: "BASE OF OPS", val: location.split(',')[0].substring(0, 3).toUpperCase() }
                            ].map((stat, idx) => (
                                <motion.div key={idx} variants={fadeUpVariants}>
                                    <p className="font-bold uppercase tracking-widest mb-1 text-gray-500 vf-log-stat-label">{stat.label}</p>
                                    <p className="font-cinema vf-log-stat-value">{stat.val}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.h3
                            initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.5 }} variants={fadeUpVariants}
                            className="text-[10px] font-bold uppercase tracking-widest mb-3 bg-[#050505] text-[#F3F3F1] inline-block px-3 py-1"
                        >
                            FESTIVALS & RECOGNITION
                        </motion.h3>

                        <div className="border-y-2 border-[#050505]">
                            {certificates.length > 0 ? certificates.map((cert: any, idx: number) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ duration: 0.6, delay: idx * 0.05, ease: cinematicEase }}
                                    key={cert.id} className="border-b border-gray-300 overflow-hidden"
                                >
                                    <motion.div
                                        whileHover={{ backgroundColor: "rgba(0,0,0,0.05)", x: 10 }}
                                        onClick={() => setSelectedCert(selectedCert?.id === cert.id ? null : cert)}
                                        className="grid grid-cols-12 py-4 transition-all cursor-pointer items-center px-2"
                                    >
                                        <div className="col-span-2 text-[10px] font-bold text-gray-500">{cert.year || new Date(cert.createdAt).getFullYear()}</div>
                                        <div className="col-span-8 text-sm font-black uppercase" style={{ color: 'var(--primary)' }}>{cert.title}</div>
                                        <div className={`col-span-2 text-right transition-transform duration-500 ${selectedCert?.id === cert.id ? 'rotate-90' : ''}`}>
                                            <i className="fas fa-chevron-right text-xs opacity-30"></i>
                                        </div>
                                    </motion.div>

                                    <AnimatePresence>
                                        {selectedCert?.id === cert.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.5, ease: cinematicEase }}
                                                className="bg-white/50"
                                            >
                                                <div className="p-6 flex flex-col md:flex-row gap-8 items-start">
                                                    {cert.mediaUrl && (
                                                        <div className="w-full md:w-64 aspect-video overflow-hidden bg-gray-200 border border-gray-300 shrink-0">
                                                            <LazyImage src={cert.mediaUrl} alt={cert.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-widest">ISSUER: {cert.issuer}</div>
                                                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 border-l-2 pl-4 border-gray-300 italic">
                                                            {cert.description || "Verification details and festival recognition summary."}
                                                        </p>
                                                        {cert.url && (
                                                            <a href={cert.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-black/20 px-4 py-2 hover:bg-black hover:text-white transition-all">
                                                                Verify Award <i className="fas fa-external-link-alt text-[8px]"></i>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )) : (
                                <div className="grid grid-cols-12 py-3 border-b border-gray-300 items-start">
                                    <div className="col-span-2 text-[10px] font-bold text-gray-500">2018</div>
                                    <div className="col-span-7 text-xs font-bold uppercase" style={{ color: 'var(--primary)' }}>SITE OF THE DAY</div>
                                    <div className="col-span-3 text-[9px] text-gray-400 text-right">AWWWARDS</div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ===== FOOTER ===== */}
                <motion.footer
                    initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}
                    variants={fadeUpVariants}
                    className="relative z-20 py-24 bg-[#050505] text-center border-t border-white/5"
                >
                    <p className="vf-hud-text uppercase tracking-[0.3em] font-bold mb-4" style={{ color: 'var(--primary)' }}>Cut. That's a wrap.</p>
                    <motion.h2
                        whileHover={{ scale: 1.05 }}
                        className="font-cinema text-[#F3F3F1] hover:text-[var(--primary)] transition-colors cursor-pointer mb-10 vf-footer-title leading-tight inline-block"
                    >
                        <a href={`mailto:${email}`}>
                            DIRECT<br />DIRECTIVE ↗<br />
                        </a>
                    </motion.h2>
                    <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[10px] text-gray-600 uppercase tracking-widest">
                        <span>© {new Date().getFullYear()} {fullName.toUpperCase()}</span>
                        {links.length > 0 ? links.slice(0, 3).map((link: any, idx: number) => (
                            <motion.a whileHover={{ y: -2, color: "#F3F3F1" }} key={idx} href={link.url} target="_blank" rel="noreferrer" className="transition-colors">{link.platform}</motion.a>
                        )) : (
                            <>
                                <a href="#" className="hover:text-[#F3F3F1] transition">INSTAGRAM</a>
                                <a href="#" className="hover:text-[#F3F3F1] transition">VIMEO</a>
                            </>
                        )}
                        <motion.a whileHover={{ y: -2, color: "#F3F3F1" }} href={`https://portfo.be/${data?.profile?.subdomain || 'jamal'}`} className="text-[#F3F3F1]/50 transition-colors">
                            PORTFO.BE/{data?.profile?.subdomain?.toUpperCase() || 'JAMAL'}
                        </motion.a>
                    </div>
                </motion.footer>

            </div>
        </div>
    );
}