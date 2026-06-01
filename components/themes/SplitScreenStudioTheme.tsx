"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { EditableText } from '@/components/ui/EditableText';
import { GithubStats } from '@/components/themes/widgets/GithubStats';
import { PenpotShowcase } from '@/components/themes/widgets/PenpotShowcase';
import { CanvaShowcase } from '@/components/themes/widgets/CanvaShowcase';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

// Komponen Scramble Text
const ScrambleText = ({ text, isHovered }: { text: string, isHovered?: boolean }) => {
    const [displayText, setDisplayText] = useState(text);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    useEffect(() => {
        if (!isHovered) {
            setDisplayText(text);
            return;
        }
        
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplayText(prev => 
                prev.split("").map((letter, index) => {
                    if(index < iterations) return text[index];
                    return letters[Math.floor(Math.random() * 26)];
                }).join("")
            );
            
            if(iterations >= text.length) clearInterval(interval);
            iterations += 1 / 3;
        }, 30);

        return () => clearInterval(interval);
    }, [isHovered, text]);

    return <span>{displayText}</span>;
};

// Komponen Scroll Block untuk mendeteksi perubahan panel kiri
const ScrollBlock = ({ 
    children, bg, index, tag, title, desc, onInView, isProject = false, projectData = null 
}: any) => {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
    const { scrollYProgress: revealProgress } = useScroll({ target: ref, offset: ["start 75%", "start 25%"] });
    
    // Parallax effect for image
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
    const clipPath = useTransform(revealProgress, [0, 1], ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    onInView((prev: any) => {
                        if (prev?.index === index) return prev;
                        return { bg, index, tag, title, desc };
                    });
                }
            },
            { threshold: [0.5] }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [bg, index, tag, title, desc, onInView]);

    return (
        <article ref={ref} className={`w-full p-8 md:p-16 border-b border-white/10 ${isProject ? 'py-16' : 'py-24 md:py-32'}`}>
            {children({ y, clipPath })}
        </article>
    );
};


export default function SplitScreenStudioTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

    const pathname = usePathname();
    const isPreviewRoute = pathname?.includes('/preview/');

    const [currentTime, setCurrentTime] = useState("00:00:00");
    const [cursorHovered, setCursorHovered] = useState(false);
    
    // Performance Optimized Cursor
    const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
    const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
    const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
    const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });
    const ringX = useSpring(mouseX, { damping: 30, stiffness: 200 });
    const ringY = useSpring(mouseY, { damping: 30, stiffness: 200 });
    
    // Data Parsing
    const fullName = data?.profile?.fullName || data?.fullName || "Elevate Studio";
    const profession = data?.profile?.profession || data?.profession || "Independent Agency";
    const bio = data?.profile?.bio || data?.bio || "We believe that great design is not just how it looks, but how it feels and functions.";
    const location = data?.profile?.location || data?.location || "Indonesia";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType === '3d');
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);
    const awardItems = data?.certificates || data?.user?.certificates || [];
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const rawHighlightColor = theme?.themeColor || '#ffffff';
    const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#ffffff';
    const fontHeading = theme?.fontHeading || 'Cabinet Grotesk';
    const fontBody = theme?.fontBody || 'Satoshi';

    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    const getFontFamily = (f: string) => {
        if (f?.toLowerCase().includes('mono') || f?.toLowerCase().includes('space')) return "'Space Mono', monospace";
        if (f?.toLowerCase().includes('serif') || f?.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        return `'${f}', sans-serif`;
    };
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);

    const formatTitle = (title: string) => {
        const words = title.split(' ');
        if(words.length <= 1) return title;
        // Simple break logic
        return words.map((w, i) => <React.Fragment key={i}>{w}{i < words.length - 1 && <br/>}</React.Fragment>);
    };

    // State untuk Panel Kiri Dinamis
    const [activeSection, setActiveSection] = useState<any>({
        bg: '#050505',
        index: 'INT / 00',
        tag: <EditableText entity="appearance" field="sss_intro_tag" value={getCustomText('sss_intro_tag', 'OVERVIEW')} isEditor={isEditor} maxLength={30} />,
        title: <><EditableText entity="appearance" field="sss_intro_title1" value={getCustomText('sss_intro_title1', 'CRAFTING')} isEditor={isEditor} maxLength={20} /><br/><EditableText entity="appearance" field="sss_intro_title2" value={getCustomText('sss_intro_title2', 'DIGITAL')} isEditor={isEditor} maxLength={20} /><br/><EditableText entity="appearance" field="sss_intro_title3" value={getCustomText('sss_intro_title3', 'REALITIES.')} isEditor={isEditor} maxLength={20} /></>,
        desc: <EditableText entity="profile" field="bio" value={bio} isEditor={isEditor} maxLength={200} />
    });

    useEffect(() => {
        if (isCardPreview) return;
        
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        updateTime();
        
        let interval: NodeJS.Timeout | null = null;
        if (!isEditor) {
            interval = setInterval(updateTime, 1000);
        }
        
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        
        return () => {
            if (interval) clearInterval(interval);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isCardPreview, isEditor]);

    const content = (
        <main className="split-screen-theme w-full flex flex-col md:flex-row relative font-sans selection:bg-white selection:text-black min-h-screen transition-colors duration-1000" 
              style={{ 
                  backgroundColor: activeSection.bg,
                  '--hl': highlightColor 
              } as React.CSSProperties}>
            <style dangerouslySetInnerHTML={{
                __html: `
        .split-screen-theme {
            color: #f4f4f4;
            ${isMobileView || isCardPreview ? '' : 'cursor: none;'}
        }
        .split-screen-theme .font-display { font-family: ${customHeadingFont}; }
        .split-screen-theme .font-sans { font-family: ${customBodyFont}; }
        


        .split-screen-theme ::-webkit-scrollbar { width: 0px; display: none; }
        
        /* Smooth Scroll Config */
        html.lenis { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }
        
        .cursor-hover-target { cursor: none; }
      `}} />



            {/* Custom Cursor (Hidden on mobile/card preview) */}
            {(!isMobileView && !isCardPreview) && (
                <>
                    <motion.div 
                        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference"
                        style={{ x: smoothMouseX, y: smoothMouseY, translateX: "-50%", translateY: "-50%" }}
                    />
                    <motion.div 
                        className="fixed top-0 left-0 border border-white/40 rounded-full pointer-events-none z-[9999] flex items-center justify-center overflow-hidden"
                        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
                        animate={{ 
                            width: cursorHovered ? 100 : 40,
                            height: cursorHovered ? 100 : 40,
                            backgroundColor: cursorHovered ? 'white' : 'transparent',
                            borderColor: cursorHovered ? 'transparent' : 'rgba(255,255,255,0.4)',
                            mixBlendMode: cursorHovered ? 'normal' : 'normal'
                        }}
                        transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
                    >
                        <AnimatePresence>
                            {cursorHovered && (
                                <motion.span 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="font-sans text-[10px] font-bold tracking-[0.2em] text-black uppercase"
                                >
                                    EXPLORE
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </>
            )}

            {/* ================= LEFT PANEL ================= */}
            <section className="w-full md:w-[45%] lg:w-5/12 flex flex-col justify-between p-8 md:p-12 lg:p-16 border-r border-white/10 z-20 md:h-[100svh] md:sticky md:top-0">
                
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                    <div className="max-w-[50%] md:max-w-[60%] break-words">
                        <h2 className="font-display text-2xl font-bold uppercase tracking-wider leading-tight">
                            <EditableText entity="profile" field="fullName" value={fullName} isEditor={isEditor} maxLength={50} />
                        </h2>
                        <p className="font-sans text-xs text-white/50 mt-2 tracking-widest uppercase"><EditableText entity="profile" field="profession" value={profession} isEditor={isEditor} maxLength={50} /></p>
                    </div>
                    <div className="hidden md:flex gap-6 font-sans text-xs tracking-widest uppercase text-white/50 shrink-0">
                        <Link href="#works" className="hover:text-white transition-colors"><EditableText entity="appearance" field="sss_nav_works" value={getCustomText('sss_nav_works', 'Works')} isEditor={isEditor} maxLength={20} /></Link>
                        <Link href="#contact" className="hover:text-white transition-colors"><EditableText entity="appearance" field="sss_nav_contact" value={getCustomText('sss_nav_contact', 'Contact')} isEditor={isEditor} maxLength={20} /></Link>
                    </div>
                </div>

                {/* Dynamic Content (Desktop) */}
                <div className="hidden md:block my-24 md:my-0">
                    <div className="overflow-hidden mb-6 flex items-center gap-4">
                        <span className="font-sans text-[10px] tracking-[0.3em] text-white/50 border border-white/10 px-4 py-2 rounded-full transition-all">
                            {activeSection.index}
                        </span>
                        <span className="font-sans text-xs tracking-widest text-white/50 uppercase transition-all">
                            {activeSection.tag}
                        </span>
                    </div>
                    
                    <AnimatePresence mode="wait">
                        <motion.h1 
                            key={activeSection.index}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[0.9] tracking-tight mb-6 break-words break-all"
                        >
                            {activeSection.title}
                        </motion.h1>
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        <motion.p 
                            key={`desc-${activeSection.index}`}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                            className="font-sans text-white/50 max-w-sm leading-relaxed"
                        >
                            {activeSection.desc}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Mobile Header Override */}
                <div className="md:hidden mt-12 mb-20">
                    <h1 className="font-display text-5xl font-bold uppercase leading-tight mb-4" dangerouslySetInnerHTML={{ __html: 'CRAFTING<br>DIGITAL<br>REALITIES.' }} />
                    <p className="font-sans text-white/50 text-sm leading-relaxed">{bio}</p>
                </div>

                {/* Footer Info */}
                <div className="flex items-end justify-between border-t border-white/10 pt-8">
                    <div className="font-sans text-[10px] tracking-widest text-white/50 uppercase flex flex-col gap-1">
                        <span>LOCAL TIME / <span className="text-white font-mono ml-1">{currentTime}</span></span>
                        <span>{location}</span>
                    </div>
                    <a href={`mailto:${userEmail}`} 
                       className="cursor-hover-target font-display text-lg hover:italic transition-all uppercase tracking-wider hidden md:block"
                       onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)}
                    >
                        <ScrambleText text="LET'S TALK" isHovered={cursorHovered} /> <i className="ph ph-arrow-down-right inline-block ml-1"></i>
                    </a>
                </div>
            </section>

            {/* ================= RIGHT PANEL ================= */}
            <section className="w-full md:w-[55%] lg:w-7/12 relative z-10">
                
                {/* 00. Intro */}
                <ScrollBlock 
                    bg="#050505" index="INT / 00" 
                    tag={<EditableText entity="appearance" field="sss_intro_tag" value={getCustomText('sss_intro_tag', 'OVERVIEW')} isEditor={isEditor} maxLength={30} />} 
                    title={<><EditableText entity="appearance" field="sss_intro_title1" value={getCustomText('sss_intro_title1', 'CRAFTING')} isEditor={isEditor} maxLength={20} /><br/><EditableText entity="appearance" field="sss_intro_title2" value={getCustomText('sss_intro_title2', 'DIGITAL')} isEditor={isEditor} maxLength={20} /><br/><EditableText entity="appearance" field="sss_intro_title3" value={getCustomText('sss_intro_title3', 'REALITIES.')} isEditor={isEditor} maxLength={20} /></>} 
                    desc={<EditableText entity="profile" field="bio" value={bio} isEditor={isEditor} maxLength={200} />} 
                    onInView={setActiveSection}
                >
                    {({ y }: any) => (
                        <div className="h-[30vh] md:h-[50vh] flex items-center justify-center">
                            <p className="font-sans text-xl md:text-2xl font-light text-white/50 text-center max-w-md">
                                <EditableText entity="appearance" field="sss_intro_scroll_text" value={getCustomText('sss_intro_scroll_text', 'Scroll down to explore our selected archives, capabilities, and studio profile.')} isEditor={isEditor} maxLength={100} />
                            </p>
                        </div>
                    )}
                </ScrollBlock>

                {/* WORKS */}
                <div id="works">
                    {archiveItems.map((p: any, i: number) => {
                        const isVideo = p.projectType === 'video';
                        return (
                            <ScrollBlock 
                                key={i} isProject={true} projectData={p}
                                bg={i % 2 === 0 ? '#0A1118' : '#160c0c'} 
                                index={`PRJ / 0${i + 1}`} 
                                tag={<EditableText entity="appearance" field="sss_works_tag" value={getCustomText('sss_works_tag', 'SELECTED WORKS')} isEditor={isEditor} maxLength={30} />} 
                                title={formatTitle(p.title)} 
                                desc={p.description || `Project ${p.title} showcasing our capabilities in ${p.projectType}.`}
                                onInView={setActiveSection}
                            >
                                    {({ y, clipPath }: any) => (
                                        <div className="flex flex-col">
                                            <h2 className="md:hidden font-display text-2xl font-bold uppercase mb-6 text-white/50">PRJ 0{i+1}. {p.title}</h2>
                                            <motion.div 
                                                className="w-full aspect-[4/5] md:aspect-square overflow-hidden cursor-hover-target relative group"
                                                style={{ clipPath }}
                                                onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)}
                                            onClick={() => {
                                                if (isVideo || p.projectType === 'photo') {
                                                    setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                                } else if (p.mediaUrl) {
                                                    window.open(p.mediaUrl, '_blank');
                                                }
                                            }}
                                        >
                                            <motion.div style={{ y }} className="w-full h-[120%] origin-center">
                                                <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out" />
                                            </motion.div>
                                            {isVideo && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center text-white backdrop-blur-md">
                                                        <i className="fas fa-play ml-1"></i>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                        <div className="mt-8 flex justify-between items-start">
                                            <div>
                                                <h3 className="font-display text-3xl font-bold uppercase">{p.title}</h3>
                                                <p className="font-sans text-white/50 text-sm mt-2">{p.projectType}</p>
                                            </div>
                                            <span className="font-sans text-xs tracking-widest text-white/50 border border-white/20 px-3 py-1 rounded-full">2026</span>
                                        </div>
                                    </div>
                                )}
                            </ScrollBlock>
                        );
                    })}

                    {allProjects.filter((p: any) => p.projectType !== '3d').length > 4 && (
                        <div className="w-full flex justify-center py-24 bg-[#050505]">
                            {isEditor ? (
                                <button className="cursor-not-allowed flex items-center justify-center px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 transition-colors duration-300 font-display uppercase tracking-widest text-xs font-bold text-white/50" onClick={(e) => e.preventDefault()}>
                                    <ScrambleText text="EXPLORE FULL GALLERY" isHovered={false} />
                                </button>
                            ) : (
                                <Link href={isPreviewRoute ? `/preview/${subdomain}/gallery` : `/${subdomain}/gallery`}
                                      className="cursor-hover-target flex items-center justify-center px-8 py-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors duration-300 font-display uppercase tracking-widest text-xs font-bold"
                                      onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)}>
                                    <ScrambleText text="EXPLORE FULL GALLERY" isHovered={cursorHovered} />
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* 3D EXPERTISE */}
                {items3D.length > 0 && (
                    <ScrollBlock 
                        bg="#0a0a0a" index="EXP / 03" 
                        tag={<EditableText entity="appearance" field="sss_3d_tag" value={getCustomText('sss_3d_tag', 'CAPABILITIES')} isEditor={isEditor} maxLength={30} />} 
                        title={<><EditableText entity="appearance" field="sss_3d_title1" value={getCustomText('sss_3d_title1', 'WE SOLVE')} isEditor={isEditor} maxLength={20} /><br/><EditableText entity="appearance" field="sss_3d_title2" value={getCustomText('sss_3d_title2', 'COMPLEX')} isEditor={isEditor} maxLength={20} /><br/><EditableText entity="appearance" field="sss_3d_title3" value={getCustomText('sss_3d_title3', 'PROBLEMS.')} isEditor={isEditor} maxLength={20} /></>} 
                        desc={<EditableText entity="appearance" field="sss_3d_desc" value={getCustomText('sss_3d_desc', 'A multi-disciplinary approach to digital design. We merge aesthetics with robust engineering to build scalable solutions.')} isEditor={isEditor} maxLength={200} />}
                        onInView={setActiveSection}
                    >
                        {({ y }: any) => (
                            <div className="flex flex-col cursor-hover-target" onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)}>
                                <h2 className="font-display text-4xl md:text-5xl font-bold uppercase mb-12 break-words"><EditableText entity="appearance" field="sss_3d_header" value={getCustomText('sss_3d_header', '3D & Spatial.')} isEditor={isEditor} maxLength={40} /></h2>
                                {items3D.map((p: any, i: number) => (
                                    <div key={i} className="flex flex-col mb-16">
                                        <div className="flex justify-between items-center py-6 text-white/50 border-b border-white/10 group hover:border-white hover:text-white transition-colors cursor-pointer">
                                            <h3 className="font-display text-2xl md:text-3xl uppercase tracking-wide group-hover:translate-x-4 transition-transform">0{i+1}. {p.title}</h3>
                                            <i className="fas fa-plus group-hover:rotate-45 transition-transform"></i>
                                        </div>
                                        <div className="w-full aspect-video mt-6 bg-[#050505] relative overflow-hidden border border-white/10 pointer-events-auto">
                                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#050505" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollBlock>
                )}

                {/* EXPERIENCE / AWARDS */}
                {(awardItems.length > 0 || testimonials.length > 0) && (
                    <ScrollBlock 
                        bg="#111111" index="ABT / 04" 
                        tag={<EditableText entity="appearance" field="sss_agency_tag" value={getCustomText('sss_agency_tag', 'AGENCY PROFILE')} isEditor={isEditor} maxLength={30} />} 
                        title={<><EditableText entity="appearance" field="sss_agency_title1" value={getCustomText('sss_agency_title1', 'DRIVEN BY')} isEditor={isEditor} maxLength={20} /><br/><EditableText entity="appearance" field="sss_agency_title2" value={getCustomText('sss_agency_title2', 'AESTHETICS')} isEditor={isEditor} maxLength={20} /><br/><EditableText entity="appearance" field="sss_agency_title3" value={getCustomText('sss_agency_title3', '& LOGIC.')} isEditor={isEditor} maxLength={20} /></>} 
                        desc={<EditableText entity="appearance" field="sss_agency_desc" value={getCustomText('sss_agency_desc', 'We believe that great design is not just how it looks, but how it feels and functions.')} isEditor={isEditor} maxLength={200} />}
                        onInView={setActiveSection}
                    >
                        {({ y }: any) => (
                            <div className="flex flex-col">
                                <h2 className="font-display text-2xl md:text-3xl font-bold uppercase mb-8 leading-snug">
                                    "<EditableText entity="appearance" field="sss_agency_quote" value={getCustomText('sss_agency_quote', 'We build digital flagship stores, immersive portfolios, and web applications that defy the ordinary.')} isEditor={isEditor} maxLength={200} />"
                                </h2>

                                {/* Awards Timeline */}
                                {awardItems.length > 0 && (
                                    <div className="border-t border-white/10 pt-8 mt-8">
                                        <h4 className="font-sans text-[10px] tracking-widest uppercase text-white/50 mb-8 break-words"><EditableText entity="appearance" field="sss_agency_rec" value={getCustomText('sss_agency_rec', 'Selected Recognition')} isEditor={isEditor} maxLength={40} /></h4>
                                        <div className="flex flex-col gap-6">
                                            {awardItems.map((a: any, i: number) => (
                                                <div key={i} className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                                                    <h5 className="font-display text-xl uppercase">{a.title}</h5>
                                                    <div className="flex items-center gap-4 text-white/50 font-sans text-sm">
                                                        <span>{a.issuer}</span>
                                                        <span className="w-12 h-[1px] bg-white/20"></span>
                                                        <span>{a.year || new Date(a.createdAt).getFullYear()}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Testimonials */}
                                {testimonials.length > 0 && (
                                    <div className="border-t border-white/10 pt-8 mt-16">
                                        <h4 className="font-sans text-[10px] tracking-widest uppercase text-white/50 mb-8 break-words"><EditableText entity="appearance" field="sss_agency_feedback" value={getCustomText('sss_agency_feedback', 'Client Feedback')} isEditor={isEditor} maxLength={40} /></h4>
                                        <div className="flex flex-col gap-12">
                                            {testimonials.map((t: any, i: number) => (
                                                <div key={i} className="flex flex-col">
                                                    <p className="font-display text-xl md:text-2xl italic leading-relaxed text-white/80">"{t.content}"</p>
                                                    <div className="flex items-center gap-4 mt-6">
                                                        <h5 className="font-sans text-sm font-bold uppercase tracking-widest">{t.clientName}</h5>
                                                        <span className="text-white/30">—</span>
                                                        <span className="font-sans text-xs text-white/50">{t.company}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </ScrollBlock>
                )}

                {/* WIDGETS INTEGRATION */}
                {data?.id && (
                    <div className="w-full bg-[#050505]">
                        <PenpotShowcase userId={data.id} variant="split-screen-studio" themeColor={highlightColor} />
                        <CanvaShowcase userId={data.id} variant="split-screen-studio" themeColor={highlightColor} />
                        <GithubStats userId={data.id} variant="split-screen-studio" themeColor={highlightColor} />
                    </div>
                )}

                {/* FOOTER / CONTACT */}
                <ScrollBlock 
                    bg="#020202" index="END / 05" 
                    tag={<EditableText entity="appearance" field="sss_contact_tag" value={getCustomText('sss_contact_tag', 'CONTACT')} isEditor={isEditor} maxLength={30} />} 
                    title={<><EditableText entity="appearance" field="sss_contact_title1" value={getCustomText('sss_contact_title1', 'LET\'S')} isEditor={isEditor} maxLength={20} /><br/><EditableText entity="appearance" field="sss_contact_title2" value={getCustomText('sss_contact_title2', 'COLLABORATE.')} isEditor={isEditor} maxLength={20} /></>} 
                    desc={<EditableText entity="appearance" field="sss_contact_desc" value={getCustomText('sss_contact_desc', 'We are currently taking on new projects. Reach out to discuss your next digital venture.')} isEditor={isEditor} maxLength={200} />}
                    onInView={setActiveSection}
                >
                    {({ y }: any) => (
                        <div id="contact" className="flex flex-col items-start justify-center min-h-[50vh]">
                            <p className="font-sans text-white/50 mb-4 tracking-widest text-[10px] uppercase break-words"><EditableText entity="appearance" field="sss_contact_pre_title" value={getCustomText('sss_contact_pre_title', 'Got an idea?')} isEditor={isEditor} maxLength={40} /></p>
                            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold uppercase mb-12 hover:italic transition-all cursor-hover-target" style={{ lineHeight: 0.85 }} onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)}>
                                <EditableText entity="appearance" field="sss_contact_main1" value={getCustomText('sss_contact_main1', 'START A')} isEditor={isEditor} maxLength={20} /><br/>
                                <EditableText entity="appearance" field="sss_contact_main2" value={getCustomText('sss_contact_main2', 'PROJECT.')} isEditor={isEditor} maxLength={20} />
                            </h2>
                            
                            <div className="flex flex-wrap gap-4 mt-8">
                                <a href={`mailto:${userEmail}`} 
                                   className="cursor-hover-target flex items-center justify-center px-8 py-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors duration-300 font-display uppercase tracking-widest text-xs font-bold"
                                   onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)}
                                >
                                    <ScrambleText text="EMAIL US" isHovered={cursorHovered} />
                                </a>
                                {links.map((l: any, i: number) => (
                                    <a key={i} href={l.url} target="_blank" rel="noreferrer" 
                                       className="cursor-hover-target flex items-center justify-center px-8 py-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors duration-300 font-display uppercase tracking-widest text-xs font-bold"
                                       onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)}
                                    >
                                        {l.platform}
                                    </a>
                                ))}
                            </div>

                            <div className="mt-32 w-full flex justify-between items-end border-t border-white/10 pt-8 font-sans text-[10px] text-white/30 uppercase tracking-widest">
                                <span>©{new Date().getFullYear()} {fullName.toUpperCase()}.</span>
                                <span className="break-words max-w-full"><EditableText entity="appearance" field="sss_contact_rights" value={getCustomText('sss_contact_rights', 'ALL RIGHTS RESERVED.')} isEditor={isEditor} maxLength={50} /></span>
                            </div>
                        </div>
                    )}
                </ScrollBlock>

            </section>

            {/* Media Modal */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100000] flex items-center justify-center p-4 md:p-12"
                        data-lenis-prevent="true"
                    >
                        <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md" onClick={() => setSelectedMedia(null)}></div>
                        
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                            className="relative w-full max-w-6xl bg-[#0a0a0a] border border-white/10 flex flex-col overflow-hidden"
                        >
                            <div className="flex justify-between items-center px-5 py-3 border-b border-white/10 bg-white/5">
                                <h3 className="font-display font-bold text-xl text-white uppercase tracking-tight">{selectedMedia.title}</h3>
                                <button onClick={() => setSelectedMedia(null)} className="w-10 h-10 flex items-center justify-center border border-white/10 text-white hover:bg-white hover:text-black transition-all">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="w-full bg-black relative overflow-hidden" style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}>
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full flex items-center justify-center p-4">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );

    const isSmoothScroll = (!isMobileView && !isCardPreview) && (theme?.customTexts?.smooth_scroll !== 'false');

    if (isSmoothScroll) {
        return (
            <ReactLenis root options={{ smoothWheel: true, duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) }}>
                {content}
            </ReactLenis>
        );
    }

    return content;
}
