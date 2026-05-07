"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LazyImage } from '@/components/ui/LazyImage';

const getYouTubeThumbnail = (url: string) => {
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
    return match ? `https://res.cloudinary.com/deobqjna7/image/youtube/${match[1]}.jpg` : url;
};

export default function AbsoluteNoirTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
    const [isCopied, setIsCopied] = useState(false);

  // --- ANIMASI STABILISASI ---
  // Kita gunakan animate="visible" untuk editor agar langsung tampil tanpa pemicu scroll (yang sering rusak di preview)
  // Tapi tetap gunakan whileInView untuk live site agar ada efek scroll reveal.
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";


    // Ekstraksi Data (Tetap Sama)
    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
    const profession = data?.profile?.profession || data?.profession || "Art Director & Designer";
    const bio = data?.profile?.bio || data?.bio || "Creating clean, functional, and visually striking digital experiences with extreme attention to detail.";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.slice(0, 4);
    const awardItems = data?.certificates || data?.user?.certificates || [];
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const totalProjects = allProjects.length;
    const totalAwards = awardItems.length;

    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
    const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(userEmail);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Pecah Nama untuk tipografi grid
    const nameParts = fullName.toUpperCase().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'SYSTEM';

    // Animasi Wireframe Diperhalus & Disiapkan untuk Re-trigger
    const smoothEase = [0.33, 1, 0.68, 1] as any;
    const wireframeReveal = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } }
    };

    const staggerGrid = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        // CONTAINER UTAMA: Tetap hitam putih pekat
        <main className="relative min-h-screen bg-[#050505] text-white font-sans selection:bg-white selection:text-black overflow-x-hidden @container grayscale-[100%] contrast-[1.2] tracking-tight noir-theme">

            <style dangerouslySetInnerHTML={{
                    __html: `
            .noir-theme .font-sans { font-family: 'Inter', sans-serif; }
            .noir-theme .font-mono { font-family: 'Space Mono', monospace; }
            
            @keyframes ticker {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
            .animate-ticker { animation: ticker 30s linear infinite; }

            .wire-border-b { border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
            .wire-border-r { border-right: 1px solid rgba(255, 255, 255, 0.1); }
          `}} />
            {/* ================= HEADER TICKER ================= */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={wireframeReveal} 
                className="w-full wire-border-b overflow-hidden bg-white text-black py-2 pt-8 @md:pt-2"
            >
                <div className="flex animate-ticker font-mono text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap w-max">
                    {/* Diulang 8 kali agar selalu penuh di layar raksasa sekalipun */}
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center gap-8 px-4 pr-8">
                            <span>PORTFO_BE V.2.0</span>
                            <span>[ STATUS: ACTIVE ]</span>
                            <span>{profession}</span>
                            <span>LOCATION: ID</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ================= HERO: GRID SPREADSHEET ================= */}
            <motion.section initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} className="w-full flex flex-col @lg:flex-row wire-border-b">
                
                {/* Kolom Kiri: Nama & Tipografi */}
                <div className="w-full @lg:w-8/12 flex flex-col">
                    <motion.div variants={wireframeReveal} className="p-6 @md:p-12 wire-border-b flex-1 flex flex-col justify-center overflow-hidden">
                        <h1 className="font-sans font-black text-[14cqw] @md:text-[12cqw] @lg:text-[8cqw] leading-[0.9] uppercase tracking-tighter break-words">
                            {firstName}
                        </h1>
                        <h1 className="font-sans font-black text-[14cqw] @md:text-[12cqw] @lg:text-[8cqw] leading-[0.9] uppercase tracking-tighter break-words text-transparent" style={{ WebkitTextStroke: '2px white' }}>
                            {lastName}
                        </h1>
                    </motion.div>
                    
                    {/* Sub-grid di bawah nama */}
                    <div className="grid grid-cols-1 @md:grid-cols-2">
                        <motion.div variants={wireframeReveal} className="p-6 wire-border-b @md:wire-border-b-0 @md:wire-border-r flex flex-col justify-between min-h-[200px]">
                            <span className="font-mono text-xs text-white/50 uppercase">[ OVERVIEW ]</span>
                            <p className="font-sans text-sm @md:text-base font-medium leading-relaxed mt-4">
                                {bio}
                            </p>
                        </motion.div>
                        <motion.div variants={wireframeReveal} className="p-0 flex flex-col justify-end">
                            <button onClick={handleCopyEmail} className="w-full h-full min-h-[100px] hover-invert wire-border-t @md:wire-border-t-0 p-6 flex flex-col justify-between items-start group">
                                <span className="font-mono text-xs uppercase">[ CONTACT ]</span>
                                <span className="font-sans text-2xl font-bold uppercase mt-4">
                                    {isCopied ? 'COPIED TO CLIPBOARD' : 'INITIATE COMM'}
                                </span>
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Kolom Kanan: Avatar dengan meta data */}
                <motion.div variants={wireframeReveal} className="w-full @lg:w-4/12 wire-border-t @lg:wire-border-t-0 @lg:wire-border-l flex flex-col bg-[#0a0a0a]">
                    <div className="p-4 wire-border-b flex justify-between font-mono text-[10px] uppercase text-white/50">
                        <span>IMG_REF_01</span>
                        <span>HQ_RESOLUTION</span>
                    </div>
                    <div className="w-full aspect-square @lg:aspect-auto @lg:flex-1 p-6 relative group overflow-hidden">
                        {/* Garis sasaran ala blueprint */}
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 z-10 pointer-events-none"></div>
                        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/20 z-10 pointer-events-none"></div>
                        
                        <LazyImage src={displayAvatar} alt={fullName} className="w-full h-full object-cover grayscale-[100%] contrast-[1.3] brightness-90 group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-4 wire-border-t font-mono text-xs text-center uppercase tracking-widest bg-white text-black font-bold">
                        {profession}
                    </div>
                </motion.div>
            </motion.section>

            {/* ================= SYSTEM METRICS ================= */}
            <motion.section initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} className="w-full flex flex-col @md:flex-row wire-border-b bg-[#050505]">
                <motion.div variants={wireframeReveal} className="flex-1 p-8 @md:p-12 wire-border-b @md:wire-border-b-0 @md:wire-border-r flex flex-col items-start justify-center group hover-invert">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4 text-white/50 group-hover:text-black/50">[ ARCHIVED_PROJECTS ]</span>
                    <h3 className="font-sans font-black text-6xl @md:text-8xl tracking-tighter leading-none">{totalProjects < 10 ? `0${totalProjects}` : totalProjects}</h3>
                </motion.div>
                <motion.div variants={wireframeReveal} className="flex-1 p-8 @md:p-12 wire-border-b @md:wire-border-b-0 @md:wire-border-r flex flex-col items-start justify-center group hover-invert">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4 text-white/50 group-hover:text-black/50">[ RECOGNITIONS ]</span>
                    <h3 className="font-sans font-black text-6xl @md:text-8xl tracking-tighter leading-none">{totalAwards < 10 ? `0${totalAwards}` : totalAwards}</h3>
                </motion.div>
                <motion.div variants={wireframeReveal} className="flex-1 p-8 @md:p-12 flex flex-col items-start justify-center group hover-invert">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4 text-white/50 group-hover:text-black/50">[ SYSTEM_UPTIME ]</span>
                    <h3 className="font-sans font-black text-6xl @md:text-8xl tracking-tighter leading-none">99<span className="text-2xl @md:text-4xl">%</span></h3>
                </motion.div>
            </motion.section>

            {/* ================= WORK / ARCHIVE (Asymmetric Wireframe) ================= */}
            <motion.section initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} id="work" className="w-full flex flex-col">
                <motion.div variants={wireframeReveal} className="w-full py-4 px-6 wire-border-b flex justify-between items-center bg-[#0a0a0a]">
                    <span className="font-mono text-sm uppercase tracking-widest">[ SYSTEM_ARCHIVE ]</span>
                    <span className="font-mono text-xs text-white/50">DISPLAYING: {archiveItems.length} ITEMS</span>
                </motion.div>

                {/* Layout Asimetris (Bento Box Noir) */}
                <div className="grid grid-cols-1 @md:grid-cols-12 auto-rows-min">
                    {archiveItems.map((p: any, i: number) => {
                        const isVideo = p.projectType === 'video';
                        
                        // Membuat ukuran box asimetris: 
                        // Jika genap, ambil 8 kolom. Jika ganjil, ambil 4 kolom. (Di HP semuanya 12 kolom)
                        const colSpan = i % 2 === 0 ? '@md:col-span-8' : '@md:col-span-4';
                        
                        // Menghapus border kanan pada elemen terakhir di baris
                        const borderRight = i % 2 === 0 ? '@md:wire-border-r' : '';

                        return (
                            <motion.a
                                href={p.mediaUrl || '#'} target="_blank" rel="noreferrer" key={i}
                                variants={wireframeReveal}
                                className={`group flex flex-col w-full wire-border-b ${colSpan} ${borderRight} hover-invert cursor-pointer bg-[#050505]`}
                            >
                                <div className="p-4 flex justify-between items-center wire-border-b group-hover:border-black transition-colors">
                                    <span className="font-mono text-[10px] uppercase">ID_0{i + 1}</span>
                                    <span className="font-mono text-[10px] uppercase border border-white/30 group-hover:border-black px-2 py-1">{p.projectType}</span>
                                </div>
                                
                                <div className="w-full aspect-[4/3] @md:aspect-video relative overflow-hidden bg-black p-4">
                                    <LazyImage src={isVideo ? getYouTubeThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover grayscale-[100%] contrast-[1.4] wire-border group-hover:border-black group-hover:opacity-80 transition-all duration-300" />
                                </div>

                                <div className="p-6 wire-border-t group-hover:border-black transition-colors flex flex-col justify-between h-full">
                                    <h3 className="font-sans text-2xl @lg:text-4xl font-black uppercase tracking-tight mb-4">{p.title}</h3>
                                    <p className="font-mono text-xs text-white/60 group-hover:text-black leading-relaxed">
                                        {p.description || 'Data rendering complete. Visual metrics optimized for viewing.'}
                                    </p>
                                </div>
                            </motion.a>
                        );
                    })}
                </div>

                <motion.div variants={wireframeReveal} className="w-full">
                    <Link href={`/${subdomain}/gallery`} scroll={false} className="w-full flex items-center justify-between p-8 @md:p-12 bg-white text-black hover:bg-black hover:text-white transition-colors duration-300 group border-b-2 border-transparent hover:border-white">
                        <div className="flex flex-col items-start">
                            <span className="font-mono text-[10px] @md:text-xs font-bold uppercase tracking-[0.3em] mb-2 opacity-50 group-hover:opacity-100 transition-opacity">[ DATA_OVERFLOW ]</span>
                            <span className="font-sans font-black text-3xl @md:text-6xl uppercase tracking-tighter group-hover:italic group-hover:pl-4 transition-all duration-300">
                                Explore Archive
                            </span>
                        </div>
                        <div className="w-16 h-16 @md:w-24 @md:h-24 flex items-center justify-center border-4 border-black group-hover:border-white rounded-full transition-colors duration-300 shrink-0 ml-4">
                            <i className="fas fa-arrow-right text-2xl @md:text-4xl -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
                        </div>
                    </Link>
                </motion.div>
            </motion.section>

            {/* ================= AWARDS: RAW DATA TABLE ================= */}
            {awardItems.length > 0 && (
                <motion.section initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} id="awards" className="w-full">
                    <motion.div variants={wireframeReveal} className="w-full py-4 px-6 wire-border-b flex items-center bg-[#0a0a0a]">
                        <span className="font-mono text-sm uppercase tracking-widest">[ CERTIFICATIONS_LOG ]</span>
                    </motion.div>

                    <motion.div variants={wireframeReveal} className="w-full overflow-x-auto">
                        {/* Perbaikan Mobile: whitespace-normal agar tidak overlap */}
                        <table className="w-full text-left font-mono text-xs @md:text-sm whitespace-normal break-words">
                            <thead className="bg-[#111]">
                                <tr>
                                    <th className="p-4 wire-border-b wire-border-r font-normal text-white/50 w-16 @md:w-24 align-top">YEAR</th>
                                    <th className="p-4 wire-border-b wire-border-r font-normal text-white/50 align-top">DESIGNATION</th>
                                    <th className="p-4 wire-border-b wire-border-r font-normal text-white/50 align-top">ISSUER</th>
                                    <th className="p-4 wire-border-b font-normal text-white/50 text-right align-top">STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {awardItems.map((award: any, i: number) => (
                                    <tr key={i} className="hover:bg-white hover:text-black transition-colors cursor-pointer group">
                                        <td className="p-4 wire-border-b group-hover:border-black/20 wire-border-r align-top">
                                            {award.year || new Date(award.createdAt).getFullYear()}
                                        </td>
                                        <td className="p-4 wire-border-b group-hover:border-black/20 wire-border-r font-bold font-sans text-sm @md:text-base uppercase align-top">
                                            {award.title}
                                        </td>
                                        <td className="p-4 wire-border-b group-hover:border-black/20 wire-border-r uppercase align-top">
                                            {award.issuer}
                                        </td>
                                        <td className="p-4 wire-border-b group-hover:border-black/20 text-right align-top">
                                            <span className="border border-white/30 group-hover:border-black px-2 py-1 inline-block mt-1">
                                                {award.status || 'VALID'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </motion.section>
            )}

            {/* ================= TERMINAL FOOTER ================= */}
            <motion.footer initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} className="w-full flex flex-col bg-[#050505]">
                <motion.div variants={wireframeReveal} onClick={handleCopyEmail} className="w-full p-12 @md:p-32 flex flex-col items-center justify-center text-center wire-border-b hover:bg-white hover:text-black transition-colors cursor-pointer group">
                    <span className="font-mono text-xs uppercase tracking-[0.3em] mb-6 text-white/50 group-hover:text-black/50">
                        [ SYSTEM ALIGNMENT READY ]
                    </span>
                    <h2 className="font-sans font-black text-[12cqw] @md:text-6xl @lg:text-[8cqw] leading-[1] uppercase tracking-tighter break-words">
                        {isCopied ? 'DATA COPIED' : 'CONNECT'}
                    </h2>
                </motion.div>

                <motion.div variants={wireframeReveal} className="w-full flex flex-col @md:flex-row justify-between items-center p-6 gap-6 font-mono text-[10px] uppercase text-white/50">
                    <span>END_OF_FILE © {new Date().getFullYear()}</span>
                    
                    <div className="flex gap-4">
                        {links.map((l: any, i: number) => (
                            <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                                // {l.platform}
                            </a>
                        ))}
                    </div>
                </motion.div>
            </motion.footer>

        </main>
    );
}