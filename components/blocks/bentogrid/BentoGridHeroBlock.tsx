"use client";

import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/shared/ui/LazyImage';
import { EditableText } from '@/shared/ui/EditableText';
import { BentoGridContext } from './BentoGridShell';

const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return 'fab fa-github';
    if (p.includes('linkedin')) return 'fab fa-linkedin';
    if (p.includes('twitter') || p.includes('x.com')) return 'fab fa-twitter';
    if (p.includes('instagram')) return 'fab fa-instagram';
    if (p.includes('youtube')) return 'fab fa-youtube';
    if (p.includes('facebook')) return 'fab fa-facebook';
    if (p.includes('dribbble')) return 'fab fa-dribbble';
    if (p.includes('behance')) return 'fab fa-behance';
    if (p.includes('wa') || p.includes('whatsapp')) return 'fab fa-whatsapp';
    return 'fas fa-link';
};

export function BentoGridHeroBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { highlightColor } = useContext(BentoGridContext);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const [isCopied, setIsCopied] = useState(false);
    const [currentTime, setCurrentTime] = useState("");

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Update Jam Real-Time
    useEffect(() => {
        if (isCardPreview || isEditor) return;
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [isCardPreview, isEditor]);

    // Interactive Canvas Particles Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;

        const particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
        }> = [];

        // Create particles
        const count = 40;
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 1.5 + 1
            });
        }

        let mouse = { x: -1000, y: -1000 };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);

        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
        };
        const rgbString = hexToRgb(highlightColor || '#ffffff');

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            
            // Draw mouse glow
            if (mouse.x > -1000) {
                const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 100);
                grad.addColorStop(0, `rgba(${rgbString}, 0.08)`);
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
                ctx.fill();
            }

            // Update & Draw particles
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx = -p.vx;
                if (p.y < 0 || p.y > height) p.vy = -p.vy;

                // Mouse attraction
                if (mouse.x > -1000) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        p.x += dx * 0.015;
                        p.y += dy * 0.015;
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgbString}, 0.25)`;
                ctx.fill();
            });

            // Draw lines
            ctx.strokeStyle = `rgba(${rgbString}, 0.12)`;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 80) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.lineWidth = (1 - dist / 80) * 0.7;
                        ctx.stroke();
                    }
                }
            }

            if (isVisible) {
                animationFrameId = requestAnimationFrame(draw);
            }
        };

        let isVisible = true;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                if (isVisible) draw();
            });
        }, { threshold: 0.05 });
        
        observer.observe(canvas);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('resize', handleResize);
        };
    }, [highlightColor, isCardPreview, isEditor]);

    // Data Parsing
    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
    const firstName = fullName.split(' ')[0];
    const profession = data?.profile?.profession || data?.profession || "Software Engineer & UI/UX Enthusiast";
    const bio = data?.profile?.bio || data?.bio || "Mengubah ide rumit menjadi antarmuka elegan dan pengalaman digital yang tak terlupakan.";
    const location = data?.profile?.location || data?.location || "Indonesia";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d');
    const links = data?.links?.filter((l: any) => l.isActive !== false) || data?.user?.links?.filter((l: any) => l.isActive !== false) || [];

    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
    const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

    // Theme Setup
    const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[24px]';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(userEmail);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const bentoAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 } as any }
    };

    return (
        <div className="grid gap-4 @lg:gap-6 grid-cols-1 @md:grid-cols-2 @lg:grid-cols-4 auto-rows-[minmax(150px,auto)] w-full">
            
            {/* Bento Card 1: TITLE & STATUS CARD (Col-Span 2, Row-Span 1) */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card p-8 relative overflow-hidden ${cardRadiusClass} flex flex-col justify-between min-h-[180px] @lg:col-span-2 @lg:row-span-1`}
            >
                {/* Background matrix pattern */}
                <div 
                    className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-screen"
                    style={{
                        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* Interactive particle network canvas */}
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto z-0" />
                
                {/* Glowing sphere */}
                <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] blur-[130px] rounded-full mix-blend-screen pointer-events-none opacity-20 z-0" style={{ backgroundColor: highlightColor }}></div>

                {/* Top Row: Meta Status Bar */}
                <div className="relative z-10 flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">System Active // Node.01</span>
                    </div>
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                        {currentTime || "12:00 PM"}
                    </div>
                </div>

                {/* Bottom: Large Typography */}
                <div className="relative z-10 mt-4">
                    <h1 className="font-sans font-black tracking-tight text-white uppercase text-4xl @md:text-5xl leading-none mb-2">
                        <EditableText value={fullName} field="fullName" entity="profile" isEditor={isEditor} />
                    </h1>
                    <h2 className="font-extrabold tracking-tight text-transparent bg-clip-text text-sm @md:text-base" style={{ backgroundImage: `linear-gradient(to right, ${highlightColor}, #ffffff)` }}>
                        <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} />
                    </h2>
                </div>
            </motion.div>

            {/* Bento Card 1b: BIO & CAPABILITIES CARD (Col-Span 2, Row-Span 1) */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card p-6 @lg:p-8 relative overflow-hidden ${cardRadiusClass} flex flex-col justify-between min-h-[220px] @lg:col-span-2 @lg:row-span-1`}
            >
                <div className="absolute right-4 top-4 opacity-[0.02] pointer-events-none select-none text-[5rem] font-black tracking-widest uppercase font-mono">
                    BIO
                </div>

                <div className="flex justify-between items-center z-10">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                        Profile Narrative & Stack // Node.01-B
                    </span>
                </div>

                {/* Grid split inside Card 1b */}
                <div className="grid grid-cols-1 @md:grid-cols-12 gap-6 items-start z-10 flex-1 mt-4">
                    {/* Left side: Narrative & Tags */}
                    <div className="@md:col-span-7 flex flex-col justify-between h-full space-y-4">
                        <p className="text-slate-400 font-medium leading-relaxed text-xs @lg:text-sm">
                            <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" />
                        </p>
                        
                        <div className="flex flex-wrap gap-2 pt-2 items-center">
                            {(() => {
                                const tagsText = theme?.customTexts?.bento_hero_tags || 'Web Platform, UI/UX Engineering, Product Strategy';
                                const tagsArray = tagsText.split(',').map((item: string) => item.trim()).filter((item: string) => item !== "");
                                
                                return (
                                    <>
                                        {tagsArray.map((tag: string, idx: number) => (
                                            <div 
                                                key={idx} 
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/5 text-slate-300 rounded-md group/tag"
                                            >
                                                {isEditor ? (
                                                    <EditableText
                                                        value={tag}
                                                        isEditor={isEditor}
                                                        as="span"
                                                        onChange={(newVal) => {
                                                            const newArray = [...tagsArray];
                                                            newArray[idx] = newVal;
                                                            window.parent.postMessage({
                                                                type: 'INLINE_EDIT',
                                                                entity: 'appearance',
                                                                field: 'bento_hero_tags',
                                                                value: newArray.join(', ')
                                                            }, window.location.origin);
                                                        }}
                                                        className="text-[9px] font-mono font-bold uppercase tracking-wider outline-none cursor-text hover:text-white"
                                                    />
                                                ) : (
                                                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider">
                                                        {tag}
                                                    </span>
                                                )}

                                                {isEditor && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const newArray = tagsArray.filter((_: string, i: number) => i !== idx);
                                                            window.parent.postMessage({
                                                                type: 'INLINE_EDIT',
                                                                entity: 'appearance',
                                                                field: 'bento_hero_tags',
                                                                value: newArray.join(', ')
                                                            }, window.location.origin);
                                                        }}
                                                        className="opacity-40 hover:opacity-100 text-red-400 hover:text-red-500 text-[10px] transition-opacity duration-200 shrink-0"
                                                        title="Delete"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {isEditor && (
                                            <button
                                                onClick={() => {
                                                    const newArray = [...tagsArray, 'NEW TAG'];
                                                    window.parent.postMessage({
                                                        type: 'INLINE_EDIT',
                                                        entity: 'appearance',
                                                        field: 'bento_hero_tags',
                                                        value: newArray.join(', ')
                                                    }, window.location.origin);
                                                }}
                                                className="inline-flex items-center justify-center px-2 py-0.5 bg-white/5 border border-dashed border-white/20 text-slate-400 hover:text-white transition-all rounded-md text-[9px] font-mono font-bold uppercase tracking-wider"
                                            >
                                                + Tambah
                                            </button>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Right side: Tech Stack Badges */}
                    <div className="@md:col-span-5 border-t @md:border-t-0 @md:border-l border-white/10 pt-4 @md:pt-0 @md:pl-6 flex flex-col justify-between h-full">
                        <span className="text-[9px] uppercase font-mono font-bold tracking-[0.2em] text-slate-500 block mb-3">
                            TECH_STACK
                        </span>
                        
                        <div className="grid grid-cols-2 gap-2 w-full">
                            {(() => {
                                const techStackText = theme?.customTexts?.bento_tech_stack || 'NextJS, Prisma, React, TS';
                                const techStackArray = techStackText.split(',').map((item: string) => item.trim()).filter((item: string) => item !== "");
                                
                                return (
                                    <>
                                        {techStackArray.map((tech: string, idx: number) => (
                                            <div 
                                                key={idx} 
                                                className={`flex items-center justify-between gap-1.5 px-3 py-2 bg-white/5 border border-white/5 text-slate-300 transition-all group/tag`}
                                                style={{ borderRadius: theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? '0' : '10px' }}
                                            >
                                                <div className="flex items-center gap-1.5 truncate w-full">
                                                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: highlightColor }} />
                                                    {isEditor ? (
                                                        <EditableText
                                                            value={tech}
                                                            isEditor={isEditor}
                                                            as="span"
                                                            onChange={(newVal) => {
                                                                const newArray = [...techStackArray];
                                                                newArray[idx] = newVal;
                                                                window.parent.postMessage({
                                                                    type: 'INLINE_EDIT',
                                                                    entity: 'appearance',
                                                                    field: 'bento_tech_stack',
                                                                    value: newArray.join(', ')
                                                                }, window.location.origin);
                                                            }}
                                                            className="text-[9px] font-mono font-bold uppercase tracking-wider truncate outline-none cursor-text hover:text-white block w-full"
                                                        />
                                                    ) : (
                                                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider truncate block w-full">
                                                            {tech}
                                                        </span>
                                                    )}
                                                </div>
                                                {isEditor && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const newArray = techStackArray.filter((_: string, i: number) => i !== idx);
                                                            window.parent.postMessage({
                                                                type: 'INLINE_EDIT',
                                                                entity: 'appearance',
                                                                field: 'bento_tech_stack',
                                                                value: newArray.join(', ')
                                                            }, window.location.origin);
                                                        }}
                                                        className="opacity-0 group-hover/tag:opacity-100 text-red-400 hover:text-red-500 text-[10px] transition-opacity duration-200 shrink-0 ml-1"
                                                        title="Delete"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {isEditor && (
                                            <button
                                                onClick={() => {
                                                    const newArray = [...techStackArray, 'NEW'];
                                                    window.parent.postMessage({
                                                        type: 'INLINE_EDIT',
                                                        entity: 'appearance',
                                                        field: 'bento_tech_stack',
                                                        value: newArray.join(', ')
                                                    }, window.location.origin);
                                                }}
                                                className={`flex items-center justify-center gap-1 px-2 py-1.5 bg-white/5 border border-dashed border-white/20 text-slate-400 hover:text-white transition-all text-[9px] font-mono font-bold uppercase tracking-wider col-span-2 mt-1`}
                                                style={{ borderRadius: theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? '0' : '10px' }}
                                            >
                                                + Tambah Tech
                                            </button>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Bento Card 2: PORTRAIT AVATAR (Col-Span 1, Row-Span 2) */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card p-2 relative group @lg:col-span-1 @lg:row-span-2 ${cardRadiusClass}`}
            >
                <div className="w-full h-full rounded-[20px] overflow-hidden relative bg-[#121214] min-h-[320px]">
                    <LazyImage src={displayAvatar} alt={fullName} className="w-full h-full object-cover grayscale opacity-75 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-1">
                        <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider font-mono">FEED // {firstName.toUpperCase()}_01</span>
                        <span className="text-[9px] text-emerald-400 font-bold tracking-widest uppercase">● VIDEO ONLINE</span>
                    </div>
                </div>
            </motion.div>

            {/* Bento Card 3: TIMEZONE / CLOCK (Col-Span 1, Row-Span 1) */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card p-6 flex flex-col justify-between relative overflow-hidden ${cardRadiusClass}`}
            >
                <i className="fas fa-globe-asia absolute text-white/5 pointer-events-none -right-4 -bottom-6 text-8xl"></i>
                <div>
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-40 text-white block mb-1">
                        LOCATION
                    </span>
                    <span className="text-white text-sm font-bold tracking-tight">
                        <EditableText value={location} field="location" entity="profile" isEditor={isEditor} as="span" />
                    </span>
                </div>
                <div className="mt-4">
                    <span className="text-[9px] text-slate-500 font-mono block">LOCAL_TIME</span>
                    <span className="font-extrabold text-white text-lg tracking-tight">{currentTime || "00:00"}</span>
                </div>
            </motion.div>

            {/* Bento Card 4: PROJECTS COMPLETED STATS (Col-Span 1, Row-Span 1) */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card p-6 flex flex-col justify-between relative ${cardRadiusClass}`}
            >
                <div>
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-40 text-white block mb-1">
                        STATISTICS
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono block">COMPLETED_WORKS</span>
                </div>
                <div className="flex items-baseline justify-between mt-2">
                    <h3 className="text-5xl font-black text-white leading-none tracking-tighter">
                        {archiveItems.length}
                    </h3>
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:text-black hover:bg-white transition-all cursor-pointer">
                        <i className="fas fa-arrow-right text-xs"></i>
                    </div>
                </div>
            </motion.div>

            {/* Bento Card 6: SOCIAL NODE CONNECTOR (Col-Span 1, Row-Span 2) */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card p-6 flex flex-col justify-between ${cardRadiusClass} @lg:col-span-1 @lg:row-span-2 min-h-[320px]`}
            >
                <div className="flex justify-between items-center w-full z-10">
                    <span className="text-[9px] uppercase font-mono font-bold tracking-[0.2em] text-slate-500 block">
                        NETWORKS
                    </span>
                    <span className="text-[8px] font-mono text-slate-600 uppercase">connected</span>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 w-full mt-4 flex-1 z-10">
                    {links.length > 0 ? (
                        links.map((l: any, idx: number) => (
                            <a 
                                key={idx} 
                                href={l.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className={`flex flex-col justify-between w-full h-[72px] lg:h-auto lg:flex-1 p-3.5 bg-white/5 hover:bg-white/10 hover:border-white/20 text-slate-300 hover:text-white border border-white/5 transition-all group/link relative`}
                                style={{ borderRadius: theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? '0' : '10px' }}
                                title={l.platform}
                            >
                                <div className="flex justify-between items-start w-full">
                                    <i className={`${getSocialIcon(l.platform)} text-xl text-[var(--hl)] shrink-0`} style={{ '--hl': highlightColor } as any}></i>
                                    <i className="fas fa-arrow-up-right text-[8px] opacity-30 group-hover/link:opacity-100 transition-opacity"></i>
                                </div>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider block leading-none">
                                    {l.platform}
                                </span>
                            </a>
                        ))
                    ) : (
                        <div className={`col-span-2 w-full flex items-center justify-center py-4 bg-white/2 border border-dashed border-white/10 text-white/20 text-[10px]`}
                            style={{ borderRadius: theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? '0' : '10px' }}
                        >
                            No Active Links
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Bento Card 5: EMAIL / SEND MESSAGE COPY WIDGET (Col-Span 2, Row-Span 1) */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card p-2 flex @lg:col-span-2 ${cardRadiusClass}`}
            >
                <div onClick={handleCopyEmail} className={`w-full bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 flex items-center gap-4 cursor-pointer transition-all duration-300 group shadow-md ${radiusClass} p-3 pr-6`}>
                    <div className={`${radiusClass} bg-black/40 flex shrink-0 items-center justify-center group-hover:bg-[var(--hl)] group-hover:text-black transition-all duration-300 w-12 h-12`} style={{ '--hl': highlightColor } as any}>
                        <i className={`fas ${isCopied ? 'fa-check text-green-400' : 'fa-paper-plane'} text-sm`}></i>
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden pointer-events-none">
                        <span className="text-slate-500 font-bold uppercase tracking-widest leading-none text-[9px] mb-1.5">
                            <EditableText value={theme?.customTexts?.bento_hero_send || 'Send a Message'} field="bento_hero_send" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                        </span>
                        <span className={`font-bold text-white truncate leading-none group-hover:text-[var(--hl)] transition-colors text-sm`} style={{ '--hl': highlightColor } as any}>
                            {isCopied ? 'Copied to clipboard!' : userEmail}
                        </span>
                    </div>
                </div>
            </motion.div>

        </div>
    );
}

