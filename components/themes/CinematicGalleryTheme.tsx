"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { EditableText } from '@/components/ui/EditableText';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { AnimatePresence, motion } from 'framer-motion';
import { PenpotShowcase } from '@/components/themes/widgets/PenpotShowcase';
import { CanvaShowcase } from '@/components/themes/widgets/CanvaShowcase';
import { GithubStats } from '@/components/themes/widgets/GithubStats';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';
import Lenis from 'lenis';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function CinematicGalleryTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const horizontalContainerRef = useRef<HTMLDivElement>(null);

    const fullName = data?.profile?.fullName || data?.fullName || "Ruang Studio";
    const profession = data?.profile?.profession || data?.profession || "Seni Berdiam";
    const bio = data?.profile?.bio || data?.bio || "Sebuah perjalanan visual melalui ruang, bentuk, dan waktu.";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "ruang";
    const userEmail = data?.email || data?.user?.email || `studio@${subdomain}.art`;
    
    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType?.toLowerCase() === '3d');
    const featuredProjects = allProjects.filter((p: any) => p.projectType?.toLowerCase() !== '3d').slice(0, 4);
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];
    const certificates = data?.certificates || data?.user?.certificates || [];
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const isSmoothScroll = theme?.customTexts?.smooth_scroll === 'true';

    // Lenis Smooth Scroll
    useEffect(() => {
        if (!isSmoothScroll || isCardPreview) return;
        
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000) });
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove((time) => { lenis.raf(time * 1000) });
        };
    }, [isCardPreview, isSmoothScroll]);

    // Animation Logic
    useGSAP(() => {
        if (isCardPreview) return; // Don't do horizontal scroll on small cards
        
        const wrapper = wrapperRef.current;
        const container = horizontalContainerRef.current;
        if (!wrapper || !container) return;

        const panels = gsap.utils.toArray('.panel') as HTMLElement[];
        if (panels.length === 0) return;

        // 1. Horizontal Scroll Tween
        const scrollTween = gsap.to(panels, {
            xPercent: -100 * (panels.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: wrapper,
                pin: true,
                scrub: 1,
                end: () => "+=" + container.offsetWidth,
            }
        });

        // 2. Parallax Images
        gsap.utils.toArray('.img-parallax').forEach((img: any) => {
            gsap.to(img, {
                xPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: img.closest('.panel'),
                    containerAnimation: scrollTween,
                    start: "left right",
                    end: "right left",
                    scrub: true
                }
            });
        });

        // 3. Simple Reveals
        gsap.utils.toArray('.reveal-on-scroll').forEach((el: any) => {
            gsap.from(el, {
                opacity: 0,
                y: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: el.closest('.panel'),
                    containerAnimation: scrollTween,
                    start: "left center",
                    toggleActions: "play none none reverse"
                }
            });
        });

        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);

        return () => clearTimeout(timer);
    }, { scope: containerRef, dependencies: [featuredProjects.length, isCardPreview] });

    // Custom Cursor Logic
    const cursorRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (isCardPreview) return;
        
        const cursor = cursorRef.current;
        if (!cursor) return;

        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        const onMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('mousemove', onMouseMove);

        const ticker = gsap.ticker.add(() => {
            cursorPos.x += (mouse.x - cursorPos.x) * 0.15;
            cursorPos.y += (mouse.y - cursorPos.y) * 0.15;
            gsap.set(cursor, { x: cursorPos.x, y: cursorPos.y });
        });

        const hoverElements = document.querySelectorAll('.hover-trigger');
        
        const handleMouseEnter = () => cursor.classList.add('active');
        const onMouseLeave = () => cursor.classList.remove('active');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
        });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            gsap.ticker.remove(ticker);
            hoverElements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', onMouseLeave);
            });
        };
    }, [isCardPreview]);

    // Line indicator animation
    useEffect(() => {
        const line = document.querySelector('.line-indicator');
        if (line) {
            gsap.to(line, { width: "48px", duration: 1, repeat: -1, yoyo: true, ease: "power1.inOut" });
        }
    }, []);

    // Initial load animation
    useEffect(() => {
        if (isCardPreview) return;
        
        const tl = gsap.timeline();
        tl.fromTo('.panel-text', { y: '100%' }, { y: '0%', duration: 1.5, stagger: 0.2, ease: 'power4.out', delay: 0.2 })
          .fromTo('.fade-text', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=1');
    }, [isCardPreview]);

    // Fonts
    const fontHeading = theme?.fontHeading || 'Playfair Display';
    const fontBody = theme?.fontBody || 'Manrope';

    const getFontFamily = (f: string) => {
        if (f?.toLowerCase().includes('space grotesk')) return "'Space Grotesk', sans-serif";
        if (f?.toLowerCase().includes('manrope')) return "'Manrope', sans-serif";
        if (f?.toLowerCase().includes('mono')) return "'Space Mono', monospace";
        if (f?.toLowerCase().includes('serif')) return "'Playfair Display', serif";
        if (f?.toLowerCase().includes('inter')) return "'Inter', sans-serif";
        if (f?.toLowerCase().includes('satoshi')) return "'Satoshi', sans-serif";
        if (f?.toLowerCase().includes('cabinet')) return "'Cabinet Grotesk', sans-serif";
        return "'Playfair Display', serif"; // Default heading fallback
    };
    
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);

    return (
        <main ref={containerRef} className="cinematic-gallery-root bg-[#050505] text-[#f5f5f0] min-h-screen relative overflow-x-hidden selection:bg-[#f5f5f0] selection:text-[#050505]">
            <style dangerouslySetInnerHTML={{
                __html: `
                .cinematic-gallery-root {
                    ${!isCardPreview ? 'cursor: none;' : ''}
                }
                .cinematic-gallery-root .font-serif, .cinematic-gallery-root .font-display { font-family: ${customHeadingFont} !important; }
                .cinematic-gallery-root .font-sans, .cinematic-gallery-root .font-body { font-family: ${customBodyFont} !important; }

                /* Custom Cursor */
                .cg-cursor {
                    position: fixed; top: 0; left: 0; width: 20px; height: 20px;
                    border-radius: 50%; background-color: #f5f5f0; mix-blend-mode: difference;
                    pointer-events: none; z-index: 10000; transform: translate(-50%, -50%);
                    transition: width 0.3s cubic-bezier(0.19, 1, 0.22, 1), height 0.3s cubic-bezier(0.19, 1, 0.22, 1);
                }
                .cg-cursor.active { width: 80px; height: 80px; }

                /* Hide Scrollbar */
                .cinematic-gallery-root::-webkit-scrollbar { display: none; }
                
                .reveal-mask { overflow: hidden; }

                .cg-text-huge {
                    font-size: clamp(4rem, 12vw, 15rem);
                    line-height: 0.85; letter-spacing: -0.02em;
                }
                .cg-outline-text {
                    color: transparent; -webkit-text-stroke: 1px rgba(245, 245, 240, 0.3);
                }
                
                /* Utilities */
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                /* Lenis Smooth Scroll CSS */
                html.lenis, html.lenis body { height: auto; }
                .lenis.lenis-smooth { scroll-behavior: auto !important; }
                .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
                .lenis.lenis-stopped { overflow: hidden; }
                .lenis.lenis-scrolling iframe { pointer-events: none; }
                
                /* Parallax & Layout */
                .cg-wrapper { ${!isCardPreview ? 'width: 100%; overflow: hidden;' : 'display: flex; flex-direction: column; width: 100%;'} }
                .cg-horizontal-container { 
                    ${!isCardPreview ? 'width: max-content; height: 100vh; display: flex; flex-wrap: nowrap;' : 'display: flex; flex-direction: column; width: 100%;'} 
                }
                .panel {
                    ${!isCardPreview ? 'width: 100vw; height: 100vh; display: flex; justify-content: center; position: relative; padding: 4rem; flex-shrink: 0;' : 'width: 100%; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; position: relative; padding: 2rem 1rem; flex-shrink: 0;'}
                }

                .img-container { overflow: hidden; position: relative; }
                .img-parallax {
                    ${!isCardPreview ? 'width: 130%; height: 100%; object-fit: cover; position: absolute; top: 0; left: -15%;' : 'width: 100%; height: 100%; object-fit: cover;'}
                }
                `
            }} />


            {!isCardPreview && (
                <div className="cg-cursor" ref={cursorRef}></div>
            )}
            {/* Fixed Header */}
            <header className="fixed top-6 left-6 md:top-8 md:left-8 z-50 mix-blend-difference pointer-events-none flex flex-col gap-1">
                <div className="font-serif italic text-xl md:text-2xl hover-trigger pointer-events-auto">
                    <EditableText value={theme?.customTexts?.cg_header_logo || `${fullName.split(' ')[0]}.`} field="cg_header_logo" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                </div>
            </header>

            <header className="fixed top-6 right-6 md:top-8 md:right-8 z-50 mix-blend-difference pointer-events-none flex flex-col items-end gap-1">
                <div className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase pointer-events-auto">
                    <EditableText value={theme?.customTexts?.cg_header_tagline || 'ESTETIKA / 2026'} field="cg_header_tagline" entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                </div>
            </header>

            {/* Fixed Footer Indicator */}
            {!isCardPreview && (
                <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-50 mix-blend-difference pointer-events-none">
                    <p className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#8b8b8b] flex items-center gap-4">
                        <span className="w-12 h-[1px] bg-[#8b8b8b] inline-block line-indicator"></span>
                        Scroll to Navigate
                    </p>
                </div>
            )}

            {/* Main Content */}
            <div className="w-full relative">
                <div className="cg-wrapper" ref={wrapperRef}>
                    <div className="cg-horizontal-container" ref={horizontalContainerRef}>
                    
                    {/* PANEL 1: HERO */}
                    <section className="panel flex-col items-center text-center">
                        <div className="reveal-mask pb-2">
                            <h1 className="font-serif cg-text-huge italic panel-text">
                                <EditableText value={theme?.customTexts?.cg_hero_1 || 'Seni'} field="cg_hero_1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} className="inline-block" />
                            </h1>
                        </div>
                        <div className="reveal-mask mt-2 md:mt-0 pb-2">
                            <h1 className="font-sans cg-text-huge font-bold uppercase panel-text">
                                <EditableText value={theme?.customTexts?.cg_hero_2 || 'Berdiam'} field="cg_hero_2" entity="appearance" isEditor={isEditor} as="span" maxLength={20} className="inline-block" />
                            </h1>
                        </div>
                        <p className="font-sans text-[10px] md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase mt-8 md:mt-12 text-[#8b8b8b] max-w-xs md:max-w-md mx-auto fade-text">
                            <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={50} />
                        </p>
                    </section>

                    {/* PANEL 2: ABOUT */}
                    <section className="panel flex-col">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full max-w-7xl mx-auto px-4">
                            <div className="col-span-1 md:col-span-4 font-sans text-xs tracking-[0.2em] uppercase text-[#8b8b8b] mb-4 md:mb-0 reveal-on-scroll">
                                [ 01 — <EditableText value={theme?.customTexts?.cg_about_label || 'Pendekatan'} field="cg_about_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> ]
                            </div>
                            <div className="col-span-1 md:col-span-8 reveal-on-scroll">
                                <h2 className="font-serif text-xl md:text-3xl lg:text-4xl leading-snug break-words">
                                    <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={200} />
                                </h2>
                                <div className="mt-8 md:mt-16 w-full h-[1px] bg-white/20"></div>
                                <div className="mt-8 flex flex-wrap gap-4 justify-between font-sans text-[10px] md:text-xs tracking-widest uppercase opacity-70">
                                    <EditableText value={theme?.customTexts?.cg_services || 'Direksi Kreatif / Fotografi / Eksplorasi Digital'} field="cg_services" entity="appearance" isEditor={isEditor} as="span" maxLength={100} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* PROJECT PANELS */}
                    {featuredProjects.map((p: any, i: number) => {
                        const isVideo = p.projectType === 'video';
                        const isEven = i % 2 !== 0;
                        const numberLabel = `0${i + 2} — ${p.projectType || 'Proyek'}`;
                        
                        return (
                            <section key={i} className={`panel flex-col ${!isMobileView ? (isEven ? 'md:flex-row-reverse' : 'md:flex-row') : ''} gap-8 md:gap-12 lg:gap-24 items-center justify-center`}>
                                <div className={`flex-shrink-0 w-[90vw] h-[50vh] ${!isMobileView ? 'md:w-[45vw] md:h-[65vh]' : ''} img-container bg-gray-900 overflow-hidden group`}>
                                    <img src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="img-parallax opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                                </div>
                                <div className={`flex-shrink-0 flex flex-col justify-center w-full md:w-auto ${isEven && !isMobileView ? 'text-right' : 'text-left'}`}>
                                    <span className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#8b8b8b] mb-2 md:mb-4">{numberLabel}</span>
                                    <h2 
                                        className={`font-display font-bold text-4xl md:text-5xl lg:text-7xl hover-trigger cursor-pointer uppercase break-words ${isEven ? 'cg-outline-text hover:text-[#f5f5f0] hover:[-webkit-text-stroke:0px] transition-colors' : 'italic'}`}
                                        onClick={() => {
                                            if (isVideo || p.projectType === 'photo') {
                                                setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                            } else if (p.mediaUrl) {
                                                window.open(p.mediaUrl, '_blank');
                                            }
                                        }}
                                    >
                                        {p.title}
                                    </h2>
                                    <p className={`font-sans mt-4 md:mt-8 max-w-xs md:max-w-sm text-xs md:text-sm text-gray-400 ${isEven && !isMobileView ? 'ml-auto' : ''}`}>
                                        {p.description || 'Proyek kreatif yang mengeksplorasi medium digital dan batasan visual.'}
                                    </p>
                                </div>
                            </section>
                        );
                    })}

                    {/* PANEL: 3D SHOWCASE */}
                    {items3D.length > 0 && (
                        <section className="panel flex-col items-center justify-center">
                            <h2 className="font-serif text-3xl md:text-5xl italic mb-8 reveal-on-scroll">Interactive Models</h2>
                            <div className="w-[90vw] h-[50vh] md:w-[60vw] md:h-[65vh] bg-[#0a0a0a] rounded-lg overflow-hidden relative reveal-on-scroll border border-white/10">
                                <Interactive3DViewer mediaUrl={items3D[0].mediaUrl} bgColor="#050505" />
                                <div className="absolute bottom-6 left-6 pointer-events-none">
                                    <h3 className="font-serif text-white text-2xl md:text-4xl">{items3D[0].title}</h3>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* PANEL: PENPOT SHOWCASE */}
                    {data?.id && (
                        <section className="panel flex-col items-center justify-center">
                            <div className="w-[100vw] h-full overflow-y-auto hide-scrollbar flex items-center justify-center px-2 md:px-0 pt-16 pb-8">
                                <PenpotShowcase userId={data.id} variant="cinematic" themeColor="#ffffff" />
                            </div>
                        </section>
                    )}

                    {/* PANEL: CANVA SHOWCASE */}
                    {data?.id && (
                        <section className="panel flex-col items-center justify-center">
                            <div className="w-[100vw] h-full overflow-y-auto hide-scrollbar flex items-center justify-center px-2 md:px-0 pt-16 pb-8">
                                <CanvaShowcase userId={data.id} variant="cinematic" themeColor="#ffffff" />
                            </div>
                        </section>
                    )}

                    {/* PANEL: GITHUB STATS */}
                    {data?.id && (
                        <section className="panel flex-col items-center justify-center">
                            <div className="w-[100vw] h-full overflow-y-auto hide-scrollbar flex items-center justify-center px-2 md:px-0 pt-16 pb-8">
                                <GithubStats userId={data.id} variant="cinematic" themeColor="#ffffff" />
                            </div>
                        </section>
                    )}

                    {/* PANEL: TESTIMONIALS */}
                    {testimonials.length > 0 && (
                        <section className="panel flex-col items-center justify-center">
                            <h2 className="font-serif text-3xl md:text-5xl italic mb-12 reveal-on-scroll">Client Voices</h2>
                            <div className="flex flex-col md:flex-row gap-6 items-center justify-center flex-wrap max-w-7xl px-4 w-[90vw] md:w-auto h-[60vh] md:h-auto overflow-y-auto hide-scrollbar">
                                {testimonials.map((t: any, i: number) => (
                                    <div key={i} className="w-full md:w-[350px] border border-[#f5f5f0]/20 p-8 rounded-lg reveal-on-scroll bg-[#0a0a0a] shrink-0">
                                        <p className="font-sans text-sm md:text-base text-gray-300 italic mb-6">"{t.content}"</p>
                                        <div className="flex items-center gap-4">
                                            {t.avatarUrl ? (
                                                <img src={t.avatarUrl} alt={t.clientName || 'Client'} className="w-12 h-12 rounded-full object-cover grayscale" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-[#f5f5f0]/10 flex items-center justify-center font-serif text-xl">{(t.clientName || t.name || 'U').charAt(0)}</div>
                                            )}
                                            <div>
                                                <h4 className="font-sans font-bold uppercase tracking-widest text-xs md:text-sm text-[#f5f5f0]">{t.clientName || t.name || 'Anonymous Client'}</h4>
                                                {t.company && <span className="font-sans text-[10px] uppercase text-[#8b8b8b]">{t.company}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* PANEL: AWARDS */}
                    {certificates.length > 0 && (
                        <section className="panel flex-col items-center justify-center">
                            <h2 className="font-serif text-3xl md:text-5xl italic mb-12 reveal-on-scroll">Honors</h2>
                            <div className="flex flex-col md:flex-row gap-6 items-center justify-center flex-wrap max-w-7xl px-4 w-[90vw] md:w-auto h-[60vh] md:h-auto overflow-y-auto hide-scrollbar">
                                {certificates.map((cert: any, i: number) => (
                                    <div key={i} className="w-full md:w-[350px] border border-[#f5f5f0]/20 p-8 rounded-lg reveal-on-scroll bg-[#0a0a0a] shrink-0 text-center">
                                        <p className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#8b8b8b] mb-4">{cert.year || new Date(cert.createdAt).getFullYear()}</p>
                                        <h3 className="font-sans font-bold uppercase tracking-widest text-sm md:text-base text-[#f5f5f0] mb-2">{cert.title}</h3>
                                        <p className="font-sans text-[10px] md:text-xs uppercase text-gray-400">{cert.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    
                    {/* CONTACT PANEL */}
                    <section className="panel flex-col items-center justify-center bg-[#f5f5f0] text-[#050505] relative">
                        <div className="text-center w-full relative z-10 px-4">
                            <p className="font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4 md:mb-8 font-bold text-[#8b8b8b]">
                                <EditableText value={theme?.customTexts?.cg_footer_cta_label || 'Mari Ciptakan Sesuatu'} field="cg_footer_cta_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                            </p>
                            <a href={`mailto:${userEmail}`} className="font-serif cg-text-huge italic hover-trigger block" style={{ lineHeight: 1 }}>
                                <EditableText value={theme?.customTexts?.cg_footer_cta || 'Sapa.'} field="cg_footer_cta" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                            </a>
                        </div>
                        <div className="absolute bottom-6 md:bottom-8 w-full px-6 md:px-12 flex flex-col md:flex-row justify-between items-center md:items-end font-sans text-[10px] md:text-xs tracking-widest uppercase font-bold gap-4 md:gap-0">
                            <p>© {new Date().getFullYear()} {fullName}</p>
                            <div className="flex gap-4 md:gap-8 flex-wrap justify-center">
                                {links.length > 0 ? (
                                    links.map((l: any, i: number) => (
                                        <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover-trigger hover:text-[#8b8b8b] transition-colors">
                                            {l.platform}
                                        </a>
                                    ))
                                ) : (
                                    <>
                                        <a href="#" className="hover-trigger hover:text-[#8b8b8b] transition-colors">Instagram</a>
                                        <a href="#" className="hover-trigger hover:text-[#8b8b8b] transition-colors">Behance</a>
                                        <a href="#" className="hover-trigger hover:text-[#8b8b8b] transition-colors">LinkedIn</a>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>

                </div>
            </div>
            </div>

            {/* Media Modal */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10001] flex items-center justify-center p-0 md:p-10"
                    >
                        <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md" onClick={() => setSelectedMedia(null)}></div>
                        <motion.div 
                            initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }}
                            className="relative w-full max-w-6xl bg-[#0a0a0a] flex flex-col overflow-hidden border border-white/10 rounded-lg shadow-2xl"
                        >
                            <div className="flex justify-between items-center px-4 py-3 md:px-6 border-b border-white/10">
                                <h3 className="font-serif italic text-xl md:text-2xl text-[#f5f5f0]">{selectedMedia.title}</h3>
                                <button onClick={() => setSelectedMedia(null)} className="w-8 h-8 flex items-center justify-center bg-white/10 text-white hover:bg-white hover:text-black transition-all rounded-full hover-trigger">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="w-full bg-black relative" style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}>
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full flex items-center justify-center p-4 md:p-12">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain shadow-2xl" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
