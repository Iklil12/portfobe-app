"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const getYouTubeThumbnail = (url: string) => {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : url;
};

export default function CinematicTheme({ data, theme, isMobileView = false }: { data: any, theme: any, isMobileView?: boolean }) {
  const [openAward, setOpenAward] = useState<string | null>(null);

  // --- IDENTITAS ---
  const fullName = data?.profile?.fullName || data?.fullName || "Jamal Arifin";
  const profession = data?.profile?.profession || data?.profession || "Director & Editor";
  const bio = data?.profile?.bio || data?.bio || "Transforming raw vision into cinematic reality. Specializing in high-end commercials and visual storytelling.";
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.co`;

  // --- RELASI ---
  const archiveItems = (data?.projects || data?.user?.projects || []).slice(0, 4);
  const awardItems = data?.certificates || data?.user?.certificates || [];
  const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

  const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
  const displayAvatar = (rawAvatar.replace(/"/g, '').trim() !== "" && rawAvatar !== "null") ? rawAvatar.replace(/"/g, '').trim() : `https://images.unsplash.com/photo-1580234797602-22c37b4a6230?q=80&w=2067&auto=format&fit=crop`;

  // --- PENGATURAN DESAIN ---
  const themeColor = theme?.themeColor || "#ffffff";
  const fontHeading = theme?.fontHeading || "Inter";
  const fontBody = theme?.fontBody || "Inter";
  const cardStyle = theme?.cardStyle || "hard"; 

  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  const getFontFamily = (fontName: string) => {
    if (!fontName) return "'Inter', sans-serif";
    if (fontName.toLowerCase().includes('space') || fontName.toLowerCase().includes('mono')) return "'Space Mono', monospace";
    if (fontName.toLowerCase().includes('serif') || fontName.toLowerCase().includes('elegant')) return "'Playfair Display', serif";
    return "'Inter', sans-serif"; 
  };
  
  const customHeadingFont = getFontFamily(fontHeading);
  const customBodyFont = getFontFamily(fontBody);
  const radiusClass = cardStyle === 'soft' || cardStyle === 'soft-shadow' ? 'rounded-2xl' : 'rounded-none';

  return (
    <div className={`w-full min-h-screen bg-[#0a0a0a] text-white selection:bg-white selection:text-black relative ${isMobileView ? 'text-xs' : 'text-sm'}`}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap');
        .cine-heading { font-family: ${customHeadingFont} !important; }
        .cine-body { font-family: ${customBodyFont} !important; }
        .cine-accent { color: ${themeColor} !important; }
        .cine-border-accent:hover { border-color: ${themeColor} !important; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 15s linear infinite; }
        .project-row { transition: all 0.4s ease; border-bottom: 1px solid #1f1f1f; }
        .project-row:hover { background-color: #111; padding-left: 1rem; padding-right: 1rem; border-color: ${themeColor}; }
        .award-row { transition: all 0.3s ease; }
        .award-row:hover { color: ${themeColor}; border-color: ${themeColor}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #333; }
      `}} />

      {/* NAVBAR */}
      <nav className={`absolute top-0 left-0 w-full z-50 mix-blend-difference flex justify-between items-center cine-body ${isMobileView ? 'p-5' : 'p-6'}`}>
          <div className={`font-black tracking-tighter cine-heading ${isMobileView ? 'text-lg' : 'text-xl'}`}>{firstName[0]}{lastName ? lastName[0] : ''}.</div>
          <div className={`flex font-bold uppercase tracking-widest ${isMobileView ? 'gap-3 text-[9px]' : 'gap-4 md:gap-6 text-xs md:text-sm'}`}>
              <a href="#work" className="hover:cine-accent transition">Work</a>
              <a href="#about" className="hover:cine-accent transition">Info</a>
          </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative min-h-[90vh] flex flex-col justify-end pb-16 px-6 md:px-12 overflow-hidden pt-32">
          <div className="absolute inset-0 z-0">
              <img src={displayAvatar} alt="Hero Background" className="w-full h-full object-cover grayscale opacity-30 scale-105 animate-[pulse_10s_ease-in-out_infinite]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
          </div>

          {/* PERBAIKAN: Ubah md: menjadi lg: agar bio di tablet tetap di bawah nama */}
          <div className={`relative z-10 w-full flex justify-between gap-6 ${isMobileView ? 'flex-col items-start' : 'flex-col lg:flex-row lg:items-end lg:gap-10'}`}>
              <div className="flex-1 w-full min-w-0">
                  <p className={`text-gray-400 font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-3 cine-body ${isMobileView ? 'text-[9px]' : 'text-xs md:text-sm'}`}>
                      <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: themeColor }}></span>
                      <span className="truncate">{profession}</span>
                  </p>
                  
                  {/* PERBAIKAN: Penggunaan text-[clamp()] agar font membesar/mengecil bagai karet */}
                  <h1 className={`font-black leading-[0.85] tracking-tighter uppercase cine-heading break-words w-full
                      ${isMobileView ? 'text-[3.5rem] sm:text-[4rem]' : 'text-[clamp(4rem,10vw,10rem)]'}
                  `}>
                      {firstName}<br/>
                      <span className="text-transparent break-words w-full block" style={{ WebkitTextStroke: `2px ${themeColor === '#000000' ? '#ffffff' : themeColor}` }}>
                        {lastName || 'Portfolio'}
                      </span>
                  </h1>
              </div>
              
              {/* PERBAIKAN: Posisi bio diatur jadi rata kiri saat tablet, baru rata kanan saat layar sangat besar */}
              <div className={`cine-body ${isMobileView ? 'w-full text-left pb-2' : 'w-full lg:max-w-sm text-left lg:text-right pb-4 lg:pb-6 shrink-0'}`}>
                  <p className={`text-gray-400 leading-relaxed ${isMobileView ? 'text-xs mt-4' : 'text-sm md:text-base mt-6 lg:mt-0'}`}>
                      {bio}
                  </p>
                  <div className={`mt-6 flex flex-wrap gap-4 ${isMobileView ? 'justify-start' : 'justify-start lg:justify-end'}`}>
                      {links.map((l: any, i: number) => (
                        <a key={i} href={l.url} target="_blank" rel="noreferrer" className={`text-white hover:cine-accent transition font-bold uppercase tracking-widest ${isMobileView ? 'text-[10px]' : 'text-xs md:text-sm'}`}>{l.platform}</a>
                      ))}
                  </div>
              </div>
          </div>
      </header>

      {/* MARQUEE */}
      <div className={`w-full bg-white text-black py-3 overflow-hidden border-y border-white cine-heading`}>
          <div className={`flex whitespace-nowrap animate-marquee font-black uppercase tracking-tighter ${isMobileView ? 'text-lg' : 'text-xl md:text-3xl'}`}>
              <div className="flex items-center space-x-6 px-4">
                  {[...Array(6)].map((_, i) => (<React.Fragment key={i}><span>{profession}</span><span>•</span></React.Fragment>))}
              </div>
              <div className="flex items-center space-x-6 px-4">
                  {[...Array(6)].map((_, i) => (<React.Fragment key={i+10}><span>{profession}</span><span>•</span></React.Fragment>))}
              </div>
          </div>
      </div>

      {/* STATS SECTION */}
      <section className="border-b border-[#1f1f1f]" id="about">
          <div className={`grid divide-[#1f1f1f] ${isMobileView ? 'grid-cols-2 divide-x divide-y' : 'grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0'}`}>
              <div className={`flex flex-col items-center justify-center text-center hover:bg-white hover:text-black transition duration-300 ${isMobileView ? 'p-6' : 'p-8 md:p-16'}`}>
                  <span className={`font-black mb-1 tracking-tighter cine-heading ${isMobileView ? 'text-4xl' : 'text-4xl md:text-7xl'}`}>{archiveItems.length}</span>
                  <span className="text-[9px] md:text-xs uppercase tracking-widest font-bold cine-body">Projects</span>
              </div>
              <div className={`flex flex-col items-center justify-center text-center hover:bg-white hover:text-black transition duration-300 ${isMobileView ? 'p-6' : 'p-8 md:p-16'}`}>
                  <span className={`font-black mb-1 tracking-tighter cine-heading ${isMobileView ? 'text-4xl' : 'text-4xl md:text-7xl'}`}>{awardItems.length}</span>
                  <span className="text-[9px] md:text-xs uppercase tracking-widest font-bold cine-body">Awards</span>
              </div>
              <div className={`flex flex-col items-center justify-center text-center hover:bg-white hover:text-black transition duration-300 ${isMobileView ? 'p-6' : 'p-8 md:p-16'}`}>
                  <span className={`font-black mb-1 tracking-tighter cine-heading ${isMobileView ? 'text-4xl' : 'text-4xl md:text-7xl'}`}>{links.length}</span>
                  <span className="text-[9px] md:text-xs uppercase tracking-widest font-bold cine-body">Links</span>
              </div>
              <div className={`flex flex-col items-center justify-center text-center hover:bg-white hover:text-black transition duration-300 group cursor-pointer ${isMobileView ? 'p-6' : 'p-8 md:p-16'}`} onClick={() => window.location.href = `mailto:${userEmail}`}>
                  <span className={`font-black mb-2 tracking-tighter cine-heading ${isMobileView ? 'text-3xl mt-1' : 'text-4xl md:text-6xl'}`}><i className="fas fa-envelope group-hover:scale-110 transition-transform"></i></span>
                  <span className="text-[9px] md:text-xs uppercase tracking-widest font-bold cine-body mt-1">Hire Me</span>
              </div>
          </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className={`${isMobileView ? 'py-16 px-6' : 'py-20 md:py-24 px-6 md:px-12'}`} id="work">
          <div className="flex justify-between items-end mb-12">
              <h2 className={`font-black uppercase tracking-tighter cine-heading ${isMobileView ? 'text-4xl' : 'text-[clamp(2.5rem,8vw,5rem)]'}`}>Selected<br/>Works <span className="text-gray-600 text-xl md:text-2xl">({archiveItems.length})</span></h2>
          </div>

          <div className="flex flex-col border-t border-[#1f1f1f]">
              {archiveItems.length > 0 ? archiveItems.map((p: any, i: number) => {
                const isVideo = p.projectType === 'video';
                return (
                  <a href={p.projectUrl || p.mediaUrl || '#'} target="_blank" rel="noreferrer" key={i} className={`project-row relative group flex justify-between cursor-pointer cine-border-accent ${isMobileView ? 'flex-col py-6' : 'flex-col md:flex-row md:items-center py-8 md:py-14'}`}>
                      <div className={`flex relative z-10 pointer-events-none ${isMobileView ? 'flex-col gap-2' : 'flex-col md:flex-row md:items-center gap-4 md:gap-20'}`}>
                          {!isMobileView && <span className="text-gray-600 font-mono text-sm md:text-lg hidden md:block">0{i+1}</span>}
                          <h3 className={`font-black tracking-tighter uppercase group-hover:cine-accent text-gray-300 transition-colors cine-heading line-clamp-1 ${isMobileView ? 'text-2xl' : 'text-[clamp(1.5rem,5vw,4rem)]'}`}>{p.title}</h3>
                      </div>
                      <div className={`flex flex-col relative z-10 pointer-events-none cine-body ${isMobileView ? 'mt-3 text-left' : 'mt-4 md:mt-0 md:text-right'}`}>
                          <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-white">{p.projectType}</span>
                          <span className="text-gray-500 mt-1 text-[10px] md:text-sm truncate max-w-[200px]">{p.description || 'View Project'}</span>
                      </div>
                      
                      {!isMobileView && (
                        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vh] z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden hidden md:block ${radiusClass}`}>
                            <img src={isVideo ? getYouTubeThumbnail(p.mediaUrl) : (p.mediaUrl || "https://via.placeholder.com/800")} className="w-full h-full object-cover grayscale opacity-50" alt={p.title} />
                        </div>
                      )}
                  </a>
                )
              }) : <div className="py-20 text-center text-gray-600 font-mono text-xs uppercase tracking-widest">No projects available.</div>}
          </div>

          {/* Tombol Gallery Utama (Cinematic Venom Style) */}
          <div className="w-full flex justify-center mt-20 mb-16">
            <Link href={`/${subdomain}/gallery`} className="block no-underline">
              <motion.button
                initial="initial"
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className="relative flex flex-col items-center justify-center cursor-pointer overflow-visible rounded-full border border-white/10 w-[110px] h-[110px] bg-transparent"
              >
                <motion.div
                  variants={{
                    initial: { scale: 0, opacity: 0 },
                    hover: { scale: 1, opacity: 1 }
                  }}
                  transition={{ type: "spring", stiffness: 70, damping: 15 }}
                  style={{ background: 'linear-gradient(45deg, #C1A362, #785b1c)' }}
                  className="absolute inset-0 z-0 rounded-full blur-sm"
                />
                <motion.div
                  variants={{
                    initial: { scale: 1, opacity: 0 },
                    hover: { scale: 1.15, opacity: 0.6 }
                  }}
                  style={{ background: 'linear-gradient(45deg, #C1A362, #785b1c)', filter: 'blur(20px)' }}
                  className="absolute inset-0 w-full h-full rounded-full z-[-1]"
                />
                <div className="relative z-10 flex flex-col items-center justify-center gap-1 text-center text-white">
                  <i className="fas fa-images text-xl"></i>
                  <span className="font-black tracking-[0.2em] uppercase text-[10px]">EXPLORE</span>
                  <motion.i 
                    variants={{ initial: { opacity: 0, y: -5 }, hover: { opacity: 1, y: 2 } }}
                    className="fas fa-chevron-down text-[8px]"
                  ></motion.i>
                </div>
              </motion.button>
            </Link>
          </div>
      </section>

      {/* AWARDS SECTION */}
      <section className={`bg-[#050505] border-t border-[#1f1f1f] ${isMobileView ? 'py-16 px-6' : 'py-20 md:py-24 px-6 md:px-12'}`}>
          <div className={`grid gap-10 ${isMobileView ? 'grid-cols-1' : 'md:grid-cols-12 md:gap-12'}`}>
              <div className={`${isMobileView ? 'col-span-1' : 'md:col-span-4'}`}>
                  <div className="md:sticky md:top-24">
                      <h2 className={`font-black uppercase tracking-tighter mb-3 cine-heading ${isMobileView ? 'text-3xl' : 'text-3xl md:text-5xl'}`}>Recognition</h2>
                      <p className={`text-gray-500 max-w-xs cine-body ${isMobileView ? 'text-xs' : 'text-sm'}`}>Acknowledged by the industry for exceptional visual storytelling.</p>
                  </div>
              </div>

              <div className={`border-t border-[#1f1f1f] ${isMobileView ? 'col-span-1' : 'md:col-span-8'}`}>
                  {awardItems.length > 0 ? awardItems.map((award: any, i: number) => {
                    const isOpen = openAward === award.id;
                    return (
                      <div key={i} className="border-b border-[#1f1f1f]">
                          <div className={`award-row flex justify-between items-center cursor-pointer text-gray-400 ${isMobileView ? 'py-5 flex-wrap' : 'py-6 md:py-8 flex-wrap md:flex-nowrap'}`} onClick={() => setOpenAward(isOpen ? null : award.id)}>
                              
                              <div className={`flex justify-between items-center ${isMobileView ? 'w-full mb-2' : 'w-full md:w-auto mb-2 md:mb-0'}`}>
                                  <h3 className={`font-bold uppercase tracking-tighter cine-heading ${isOpen ? 'text-white' : ''} ${isMobileView ? 'text-lg' : 'text-xl md:text-2xl'}`}>{award.title}</h3>
                                  {isMobileView ? (
                                      <span className="font-mono text-[10px]">{award.year || new Date(award.createdAt).getFullYear()}</span>
                                  ) : (
                                      <span className="md:hidden font-mono text-[10px]">{award.year || new Date(award.createdAt).getFullYear()}</span>
                                  )}
                              </div>
                              
                              {!isMobileView && (
                                  <div className="hidden md:flex flex-1 justify-center">
                                      <span className="text-[10px] md:text-sm uppercase tracking-widest cine-body">{award.issuer}</span>
                                  </div>
                              )}

                              <div className={`flex items-center ${isMobileView ? 'gap-0 w-full justify-start mt-1' : 'gap-6'}`}>
                                  {!isMobileView && (
                                      <span className="hidden md:block font-mono text-sm">{award.year || new Date(award.createdAt).getFullYear()}</span>
                                  )}
                                  <i className={`fas fa-arrow-right transition-transform duration-300 text-sm ${isOpen ? '-rotate-45 text-white' : 'rotate-45'}`}></i>
                              </div>

                          </div>
                          
                          <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                              <div className={`pb-6 flex gap-5 ${isMobileView ? 'flex-col' : 'flex-col md:flex-row'}`}>
                                  <div className={`shrink-0 bg-[#111] flex items-center justify-center overflow-hidden ${radiusClass} ${isMobileView ? 'w-full aspect-video' : 'w-full md:w-48 h-32'}`}>
                                    <img src={award.mediaUrl || "https://via.placeholder.com/600"} className="w-full h-full object-contain p-2 grayscale hover:grayscale-0 transition-all duration-500" alt="Certificate" />
                                  </div>
                                  <div className="flex flex-col justify-center cine-body">
                                      <p className="text-white font-bold mb-1 text-[11px] uppercase tracking-wider">{award.status || 'Verified'}</p>
                                      <p className="text-gray-500 text-[11px] md:text-sm max-w-md leading-relaxed mb-4">{award.description || 'Awarded for excellence in the respective category.'}</p>
                                      <a href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-gray-400 transition flex items-center gap-2">View Certificate <i className="fas fa-external-link-alt text-[8px]"></i></a>
                                  </div>
                              </div>
                          </div>
                      </div>
                    )
                  }) : <div className="py-10 text-gray-600 font-mono text-xs uppercase tracking-widest">No recognitions yet.</div>}
              </div>
          </div>
      </section>

      {/* FOOTER CTA */}
      <footer className={`bg-white text-black text-center relative overflow-hidden group ${isMobileView ? 'py-20 px-6' : 'py-24 md:py-32 px-6 md:px-12'}`}>
          <a href={`mailto:${userEmail}`} className="relative z-10 block cursor-pointer">
              <p className={`font-bold uppercase tracking-[0.3em] text-gray-500 mb-4 group-hover:text-black transition cine-body ${isMobileView ? 'text-[10px]' : 'text-xs md:text-sm'}`}>Got a project?</p>
              <h2 className={`font-black uppercase tracking-tighter leading-none group-hover:-translate-y-2 transition-transform duration-500 cine-heading ${isMobileView ? 'text-5xl' : 'text-[clamp(3rem,10vw,8rem)]'}`}>
                  Let's Talk
              </h2>
          </a>
          
          <div className={`mt-16 flex justify-between items-center font-bold text-gray-500 uppercase tracking-widest cine-body ${isMobileView ? 'flex-col gap-3 text-[9px]' : 'flex-col md:flex-row mt-20 md:mt-24 text-xs md:text-sm'}`}>
              <p>© 2026 {fullName}</p>
              <p className="flex items-center gap-2">
                  <i className="fas fa-link"></i> portfo.be/{subdomain}
              </p>
          </div>
      </footer>

    </div>
  );
}