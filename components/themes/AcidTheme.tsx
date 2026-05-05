"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

const getYouTubeThumbnail = (url: string) => {
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
    return match ? `https://res.cloudinary.com/deobqjna7/image/youtube/${match[1]}.jpg` : url;
};

export default function AcidTheme({ data, theme, isMobileView = false }: { data: any, theme: any, isMobileView?: boolean }) {
    const [openAward, setOpenAward] = useState<string | null>(null);

    // --- IDENTITAS ---
    const fullName = data?.profile?.fullName || data?.fullName || "Jamal Arifin";
    const profession = data?.profile?.profession || data?.profession || "Creative Director";
    const bio = data?.profile?.bio || data?.bio || "Forging high-octane visual experiences. Editing raw footage into pure adrenaline.";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.co`;

    // --- RELASI ---
    const archiveItems = (data?.projects || data?.user?.projects || []).slice(0, 4);
    const awardItems = data?.certificates || data?.user?.certificates || [];
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const displayAvatar = (rawAvatar.replace(/"/g, '').trim() !== "" && rawAvatar !== "null") ? rawAvatar.replace(/"/g, '').trim() : `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop`;

    // --- PENGATURAN DESAIN ---
    const rawThemeColor = theme?.themeColor || "#DFFF00";
    const themeColor = isValidHexColor(rawThemeColor) ? rawThemeColor : "#ff9e00";
    const fontHeading = theme?.fontHeading || "Syne";
    const fontBody = theme?.fontBody || "Space Grotesk";

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    const getHeadingFont = (fontName: string) => {
        if (fontName?.toLowerCase().includes('space mono')) return "'Space Mono', monospace";
        return "'Syne', sans-serif";
    };
    const getBodyFont = (fontName: string) => {
        if (fontName?.toLowerCase().includes('inter')) return "'Inter', sans-serif";
        return "'Space Grotesk', sans-serif";
    };

    return (
        <div className={`w-full min-h-screen bg-[#09090b] text-[#fafafa] selection:text-black relative ${isMobileView ? 'text-xs' : 'text-sm'}`}>

            <style dangerouslySetInnerHTML={{
                __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700&family=Inter:wght@400;600&display=swap');
        
        .acid-heading { font-family: ${getHeadingFont(fontHeading)} !important; }
        .acid-body { font-family: ${getBodyFont(fontBody)} !important; }
        
        ::selection { background: ${themeColor}; color: #000000; }
        
        .acid-text { color: ${themeColor} !important; }
        .acid-bg { background-color: ${themeColor} !important; }
        .acid-border { border-color: ${themeColor} !important; }
        
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 10s linear infinite; }
        
        .project-item { transition: all 0.3s ease; border-bottom: 2px solid #27272a; }
        .project-item:hover { background-color: ${themeColor}; color: #09090b; padding-left: 2rem; border-color: ${themeColor}; }
        
        .hover-img { position: absolute; right: 10%; top: 50%; transform: translateY(-50%) scale(0.8) rotate(5deg); opacity: 0; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; z-index: 20; width: 300px; aspect-ratio: 16/9; object-fit: cover; border: 4px solid #000; box-shadow: 10px 10px 0px rgba(0,0,0,0.5); }
        .project-item:hover .hover-img { opacity: 1; transform: translateY(-50%) scale(1) rotate(-2deg); }

        .btn-acid { background-color: transparent; color: ${themeColor}; border: 2px solid ${themeColor}; transition: all 0.3s ease; position: relative; overflow: hidden; z-index: 1; }
        .btn-acid::before { content: ''; position: absolute; top: 0; left: 0; width: 0%; height: 100%; background-color: ${themeColor}; transition: all 0.3s ease; z-index: -1; }
        .btn-acid:hover { color: #000 !important; }
        .btn-acid:hover::before { width: 100%; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #09090b; }
        ::-webkit-scrollbar-thumb { background: #27272a; }
      `}} />

            {/* NAVBAR */}
            <div className="sticky top-0 left-0 right-0 z-[99] h-0">
                <nav className={`mix-blend-difference flex justify-between items-center ${isMobileView ? 'p-5' : 'p-6 md:px-12'}`}>
                    <div className={`acid-heading font-extrabold tracking-tighter text-white uppercase ${isMobileView ? 'text-xl' : 'text-2xl md:text-3xl'}`}>
                        {firstName}<span className="acid-text">.</span>{lastName || 'PORTFO'}
                    </div>
                    <div className={`flex font-bold uppercase tracking-widest text-white acid-body ${isMobileView ? 'gap-3 text-[9px]' : 'gap-3 text-[9px] md:gap-8 md:text-sm'}`}>
                        <a href="#work" className="hover:text-[var(--theme-color)] transition" style={{ '--theme-color': themeColor } as any}>Index</a>
                        <a href="#awards" className="hover:text-[var(--theme-color)] transition" style={{ '--theme-color': themeColor } as any}>Awards</a>
                    </div>
                </nav>
            </div>

            {/* HERO SECTION */}
            <header className={`relative min-h-[90vh] flex flex-col justify-center ${isMobileView ? 'pt-24 pb-16' : 'pt-32 pb-20'}`}>

                <div className={`px-6 md:px-12 relative z-10 flex flex-col items-start ${isMobileView ? 'mt-0' : 'mt-10'}`}>
                    <div className="acid-bg text-[#09090b] px-4 py-1.5 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-8 inline-block transform -skew-x-12 acid-body">
                        Available for New Projects
                    </div>

                    <h1 className={`acid-heading font-extrabold uppercase tracking-tighter text-[#fafafa] mb-4 w-full leading-[0.85] break-words
                  ${isMobileView ? 'text-5xl' : 'text-5xl md:text-[clamp(5rem,12vw,11rem)]'}
              `}>
                        {firstName} <br />
                        <span className="text-transparent" style={{ WebkitTextStroke: '2px #fafafa' }}>{lastName || profession}</span>
                    </h1>

                    {/* Mobile Avatar */}
                    <div className={`${isMobileView ? 'flex mt-8 mb-10' : 'flex lg:hidden mt-8 mb-10'} w-full justify-center relative z-30 group`}>
                        <div className="w-[85%] max-w-[280px] aspect-[4/5] relative">
                            <div className="absolute inset-0 acid-bg transform translate-x-3 translate-y-3 -z-10"></div>
                            <div className="w-full h-full overflow-hidden border-2 border-zinc-800 relative grayscale transition-all duration-700">
                                <LazyImage src={displayAvatar} alt="Hero" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    <div className={`flex w-full max-w-5xl border-t-2 border-zinc-800 pt-8 ${isMobileView ? 'flex-col gap-6 mt-2' : 'flex-col gap-6 mt-2 md:flex-row md:gap-8 lg:gap-16 md:mt-8'}`}>
                        <p className={`text-zinc-400 font-medium leading-relaxed acid-body ${isMobileView ? 'text-sm' : 'text-sm md:text-lg lg:text-xl max-w-md'}`}>
                            {bio}
                        </p>
                        <div className="flex flex-col gap-4 text-xs md:text-sm font-bold uppercase tracking-widest text-zinc-300 acid-body">
                            {links.map((l: any, i: number) => (
                                <a key={i} href={l.url} target="_blank" rel="noreferrer" className="transition w-max hover:text-white flex items-center gap-2" style={{ transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = themeColor} onMouseLeave={(e) => e.currentTarget.style.color = '#d4d4d8'}>
                                    <i className="fas fa-arrow-right -rotate-45"></i> {l.platform}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {!isMobileView && (
                    <div className="hidden lg:block absolute top-1/4 right-12 w-72 h-[450px] transition duration-700 z-30 group">
                        <div className="absolute inset-0 acid-bg transform translate-x-4 translate-y-4 -z-10"></div>
                        <div className="w-full h-full overflow-hidden border-2 border-zinc-800 relative grayscale hover:grayscale-0 transition-all duration-700">
                            <LazyImage src={displayAvatar} alt="Hero" className="w-full h-full object-cover" />
                        </div>
                        {/* Verified Badge */}
                        {(data?.plan === 'PRO' || data?.userPlan === 'PRO') && (
                            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-blue-500 rounded-full border-4 border-black flex items-center justify-center text-white text-[14px] shadow-[5px_5px_0px_rgba(0,0,0,1)] z-40">
                                <i className="fas fa-check"></i>
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* MARQUEE */}
            <div className="w-full overflow-hidden py-10 -my-10">
                <div className={`acid-bg text-[#09090b] py-3 overflow-hidden border-y-4 border-[#09090b] -rotate-2 scale-105 relative z-20 shadow-[0_0_50px_rgba(223,255,0,0.2)] my-10`}>
                    <div className="w-[200%] flex animate-marquee acid-heading font-bold text-2xl md:text-4xl uppercase tracking-tighter">
                        <div className="flex items-center gap-8 px-4">
                            {[...Array(6)].map((_, i) => (<React.Fragment key={i}><span>{profession}</span><span>///</span></React.Fragment>))}
                        </div>
                        <div className="flex items-center gap-8 px-4">
                            {[...Array(6)].map((_, i) => (<React.Fragment key={i + 10}><span>{profession}</span><span>///</span></React.Fragment>))}
                        </div>
                    </div>
                </div>
            </div>

            {/* STATS SECTION */}
            <section className="px-6 md:px-12 py-16 md:py-20">
                <div className={`grid gap-4 md:gap-8 ${isMobileView ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
                    <div className={`bg-zinc-900 flex flex-col justify-between aspect-square hover:bg-zinc-800 transition ${isMobileView ? 'p-5' : 'p-5 md:p-8'}`}>
                        <span className="acid-text font-bold text-[9px] md:text-xs uppercase tracking-widest acid-body">Projects</span>
                        <span className={`acid-heading font-extrabold ${isMobileView ? 'text-4xl' : 'text-4xl md:text-5xl lg:text-7xl'}`}>{archiveItems.length}</span>
                    </div>
                    <div className={`bg-zinc-900 flex flex-col justify-between aspect-square hover:bg-zinc-800 transition ${isMobileView ? 'p-5' : 'p-5 md:p-8'}`}>
                        <span className="acid-text font-bold text-[9px] md:text-xs uppercase tracking-widest acid-body">Awards</span>
                        <span className={`acid-heading font-extrabold ${isMobileView ? 'text-4xl' : 'text-4xl md:text-5xl lg:text-7xl'}`}>{awardItems.length}</span>
                    </div>
                    <div className={`bg-zinc-900 flex flex-col justify-between aspect-square hover:bg-zinc-800 transition ${isMobileView ? 'p-5' : 'p-5 md:p-8'}`}>
                        <span className="acid-text font-bold text-[9px] md:text-xs uppercase tracking-widest acid-body">Links</span>
                        <span className={`acid-heading font-extrabold ${isMobileView ? 'text-4xl' : 'text-4xl md:text-5xl lg:text-7xl'}`}>{links.length}</span>
                    </div>
                    <div className={`bg-zinc-900 flex flex-col justify-between aspect-square hover:bg-zinc-800 transition cursor-pointer ${isMobileView ? 'p-5' : 'p-5 md:p-8'}`} onClick={() => window.location.href = `mailto:${userEmail}`}>
                        <span className="acid-text font-bold text-[9px] md:text-xs uppercase tracking-widest acid-body">Hire Me</span>
                        <span className={`acid-heading font-extrabold flex items-center ${isMobileView ? 'text-4xl' : 'text-4xl md:text-5xl lg:text-7xl'}`}><i className="fas fa-envelope"></i></span>
                    </div>
                </div>
            </section>

            {/* PROJECTS SECTION */}
            <section id="work" className="pt-10 pb-20 md:pb-32">
                <div className="px-6 md:px-12 mb-10 flex justify-between items-end border-b-2 border-zinc-800 pb-6">
                    <h2 className={`acid-heading font-extrabold uppercase tracking-tighter ${isMobileView ? 'text-4xl' : 'text-4xl md:text-[clamp(3rem,6vw,5rem)]'}`}>PROJECT<br />INDEX</h2>
                    {!isMobileView && <span className="acid-text font-bold text-xs md:text-sm uppercase tracking-widest acid-body">Hover to Reveal</span>}
                </div>

                <div className="flex flex-col relative w-full">
                    {archiveItems.length > 0 ? archiveItems.map((p: any, i: number) => {
                        const isVideo = p.projectType === 'video';
                        return (
                            <a href={p.projectUrl || p.mediaUrl || '#'} target="_blank" rel="noreferrer" key={i} className={`project-item relative w-full flex justify-between cursor-pointer ${isMobileView ? 'flex-col py-6 px-6' : 'flex-col py-6 px-6 md:flex-row md:items-center md:py-12 md:px-12'}`}>
                                <div className="flex flex-col relative z-10 pointer-events-none">
                                    <span className="font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2 opacity-70 acid-body">0{i + 1} / {p.projectType}</span>
                                    <h3 className={`acid-heading font-extrabold uppercase tracking-tighter line-clamp-1 ${isMobileView ? 'text-3xl' : 'text-3xl md:text-[clamp(2rem,4vw,4rem)]'}`}>{p.title}</h3>
                                </div>
                                <div className={`font-bold uppercase tracking-widest opacity-70 acid-body relative z-10 pointer-events-none ${isMobileView ? 'mt-3 text-[10px]' : 'mt-3 text-[10px] md:mt-0 md:text-sm'}`}>
                                    {p.description || 'View details'} • {new Date(p.createdAt).getFullYear()}
                                </div>
                                {/* Mobile Inline Image */}
                                <div className={`${isMobileView ? 'block mt-6' : 'block md:hidden mt-6'} w-full aspect-[16/9] relative z-10 overflow-hidden border-2 border-zinc-800`}>
                                    <LazyImage src={isVideo ? getYouTubeThumbnail(p.mediaUrl) : (p.mediaUrl || "https://via.placeholder.com/800")} alt={p.title} className="w-full h-full object-cover grayscale" />
                                </div>

                                {/* Desktop Hover Image */}
                                <LazyImage src={isVideo ? getYouTubeThumbnail(p.mediaUrl) : (p.mediaUrl || "https://via.placeholder.com/800")} alt={p.title} className={`${isMobileView ? 'hidden' : 'hover-img hidden md:block'} grayscale object-cover`} />
                            </a>
                        )
                    }) : <div className="py-20 text-center text-zinc-600 font-bold text-xs uppercase tracking-widest acid-body">SYSTEM: NO_DATA_FOUND</div>}
                </div>

                {/* Tombol Gallery Utama (Acid Style Redesign) */}
                <div className={`w-full ${isMobileView ? 'mt-8 mb-12' : 'mt-8 mb-12 md:mt-20 md:mb-24'} border-y-2 border-zinc-800`}>
                    <Link href={`/${subdomain}/gallery`} scroll={false} className="group block w-full no-underline relative overflow-hidden bg-[#09090b] hover:bg-zinc-900 transition-colors duration-300">
                        <div className={`flex items-center justify-between px-6 ${isMobileView ? 'py-6' : 'py-6 md:px-12 md:py-12 lg:py-16'}`}>
                            <div className="flex flex-col relative z-10">
                                <span className="acid-text font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] acid-body mb-2 md:mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-none animate-pulse" style={{ backgroundColor: themeColor }}></span> System: Access_Granted
                                </span>
                                <h3 className={`acid-heading font-extrabold uppercase tracking-tighter text-[#fafafa] group-hover:text-[var(--theme-color)] transition-colors duration-300 leading-none ${isMobileView ? 'text-3xl' : 'text-3xl md:text-5xl lg:text-[5.5rem]'}`} style={{ '--theme-color': themeColor } as any}>
                                    VIEW_FULL<br />ARCHIVE
                                </h3>
                            </div>

                            <div className={`shrink-0 border-2 border-zinc-800 group-hover:border-[var(--theme-color)] transition-all duration-300 flex items-center justify-center bg-[#09090b] group-hover:bg-[var(--theme-color)] group-hover:rotate-12 ${isMobileView ? 'w-10 h-10' : 'w-10 h-10 md:w-24 md:h-24 lg:w-32 lg:h-32'}`} style={{ '--theme-color': themeColor } as any}>
                                <i className={`fas fa-arrow-right group-hover:-rotate-45 transition-transform duration-300 text-zinc-500 group-hover:text-[#09090b] ${isMobileView ? 'text-sm' : 'text-sm md:text-3xl lg:text-5xl'}`}></i>
                            </div>
                        </div>

                        {/* Acid abstract shapes on hover */}
                        <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" style={{ backgroundColor: themeColor }}></div>
                    </Link>
                </div>
            </section>

            {/* AWARDS SECTION */}
            <section className="acid-bg text-[#09090b] py-20 md:py-24" id="awards">
                <div className="max-w-6xl mx-auto px-6 md:px-12">
                    <h2 className={`acid-heading font-extrabold uppercase tracking-tighter mb-12 ${isMobileView ? 'text-4xl' : 'text-4xl md:text-[clamp(3rem,6vw,5rem)]'}`}>RECOGNITION</h2>

                    <div className="border-t-4 border-[#09090b]">
                        {awardItems.length > 0 ? awardItems.map((award: any, i: number) => {
                            const isOpen = openAward === award.id;
                            return (
                                <div key={i} className="border-b-4 border-[#09090b] group">
                                    <div className={`award-row flex justify-between items-center cursor-pointer hover:bg-[#09090b] hover:text-[var(--theme-color)] transition-colors px-2 md:px-4 ${isMobileView ? 'py-5' : 'py-5 md:py-6'}`} style={{ '--theme-color': themeColor } as any} onClick={() => setOpenAward(isOpen ? null : award.id)}>
                                        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                                            <span className={`font-bold acid-body shrink-0 ${isMobileView ? 'text-lg w-12' : 'text-lg w-12 md:text-2xl md:w-16'}`}>{award.year || new Date(award.createdAt).getFullYear()}</span>
                                            <h3 className={`acid-heading font-extrabold uppercase tracking-tighter line-clamp-1 ${isMobileView ? 'text-xl' : 'text-xl md:text-2xl lg:text-4xl'}`}>{award.title}</h3>
                                        </div>
                                        <i className={`fas fa-plus text-xl md:text-2xl transition-transform duration-300 shrink-0 ml-4 ${isOpen ? 'rotate-45 text-white' : ''}`}></i>
                                    </div>

                                    <div className={`overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
                                        <div className={`px-2 md:px-4 pb-8 pt-4 flex items-start gap-6 border-t border-[#09090b]/20 mt-2 md:mt-4 ${isMobileView ? 'flex-col' : 'flex-col md:flex-row'}`}>
                                            <div className={`shrink-0 bg-[#000] border-2 border-[#09090b] flex items-center justify-center p-1 ${isMobileView ? 'w-full aspect-video' : 'w-48 h-32'}`}>
                                                <LazyImage src={award.mediaUrl || "https://via.placeholder.com/600"} className="w-full h-full object-contain p-2 grayscale" alt="Certificate" />
                                            </div>
                                            <div className="acid-body">
                                                <h4 className={`font-bold uppercase tracking-widest mb-2 ${isMobileView ? 'text-[10px]' : 'text-xs'}`}>{award.issuer}</h4>
                                                <p className={`font-medium max-w-lg leading-relaxed text-[#09090b]/80 ${isMobileView ? 'text-[11px]' : 'text-sm'}`}>{award.description || 'Awarded for excellence and outstanding contribution in the respective creative category.'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : <div className="py-10 font-bold text-sm uppercase tracking-widest text-[#09090b]/50 acid-body">SYSTEM: NO_DATA_FOUND</div>}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="pt-24 md:pt-32 pb-12 px-6 md:px-12 text-center bg-[#09090b]">
                <p className="acid-text font-bold uppercase tracking-[0.3em] mb-6 acid-body text-[10px] md:text-xs">Drop a Line</p>
                <a href={`mailto:${userEmail}`} className={`block acid-heading font-extrabold uppercase tracking-tighter leading-[0.8] transition-colors duration-300 mb-16 md:mb-20 hover:text-[var(--theme-color)]`} style={{ '--theme-color': themeColor } as any}>
                    <span className={`block w-full break-words ${isMobileView ? 'text-5xl' : 'text-5xl md:text-[clamp(5rem,15vw,10rem)]'}`}>CONTACT</span>
                </a>

                <div className={`flex justify-between items-center border-t border-zinc-800 pt-8 font-bold uppercase tracking-widest text-zinc-500 acid-body ${isMobileView ? 'flex-col gap-4 text-[9px]' : 'flex-col gap-4 text-[9px] md:flex-row md:text-xs'}`}>
                    <p>© 2026 {fullName}</p>
                    <div className={`flex ${isMobileView ? 'gap-4 my-2' : 'gap-4 my-2 md:gap-6 md:my-0'}`}>
                        {links.map((l: any, i: number) => (
                            <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:text-white transition" style={{ transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = themeColor} onMouseLeave={(e) => e.currentTarget.style.color = '#71717a'}>{l.platform.substring(0, 2)}</a>
                        ))}
                    </div>
                    <a href={`/${subdomain}`} className="transition flex items-center gap-2" style={{ transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = themeColor} onMouseLeave={(e) => e.currentTarget.style.color = '#71717a'}>
                        PORTFO.BE/{subdomain?.toUpperCase()} <i className="fas fa-arrow-right -rotate-45"></i>
                    </a>
                </div>
            </footer>

        </div>
    );
}