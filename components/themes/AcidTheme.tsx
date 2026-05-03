"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';

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
  const themeColor = theme?.themeColor || "#DFFF00";
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
    <div className={`w-full min-h-screen bg-[#09090b] text-[#fafafa] selection:text-black overflow-x-hidden relative ${isMobileView ? 'text-xs' : 'text-sm'}`}>
      
      <style dangerouslySetInnerHTML={{__html: `
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
      <nav className={`absolute top-0 left-0 w-full z-50 mix-blend-difference flex justify-between items-center ${isMobileView ? 'p-5' : 'p-6 md:px-12'}`}>
          <div className={`acid-heading font-extrabold tracking-tighter text-white uppercase ${isMobileView ? 'text-xl' : 'text-2xl md:text-3xl'}`}>
              {firstName}<span className="acid-text">.</span>{lastName || 'PORTFO'}
          </div>
          <div className={`hidden md:flex font-bold uppercase tracking-widest text-white acid-body ${isMobileView ? 'gap-3 text-[9px]' : 'gap-8 text-sm'}`}>
              <a href="#work" className="hover:text-[var(--theme-color)] transition" style={{ '--theme-color': themeColor } as any}>Index</a>
              <a href="#awards" className="hover:text-[var(--theme-color)] transition" style={{ '--theme-color': themeColor } as any}>Awards</a>
          </div>
      </nav>

      {/* HERO SECTION */}
      <header className={`relative min-h-[90vh] flex flex-col justify-center ${isMobileView ? 'pt-24 pb-16' : 'pt-32 pb-20'}`}>
          
          <div className={`px-6 md:px-12 relative z-10 flex flex-col items-start ${isMobileView ? 'mt-0' : 'mt-10'}`}>
              <div className="acid-bg text-[#09090b] px-4 py-1.5 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-8 inline-block transform -skew-x-12 acid-body">
                  Available for New Projects
              </div>
              
              <h1 className={`acid-heading font-extrabold uppercase tracking-tighter text-[#fafafa] mb-4 w-full leading-[0.85] break-words
                  ${isMobileView ? 'text-5xl' : 'text-[clamp(5rem,12vw,11rem)]'}
              `}>
                  {firstName} <br/>
                  <span className="text-transparent" style={{ WebkitTextStroke: '2px #fafafa' }}>{lastName || profession}</span>
              </h1>
              
              <div className={`flex w-full max-w-5xl border-t-2 border-zinc-800 pt-8 ${isMobileView ? 'flex-col gap-6 mt-6' : 'flex-col md:flex-row gap-8 md:gap-16 mt-8'}`}>
                  <p className={`text-zinc-400 font-medium leading-relaxed acid-body ${isMobileView ? 'text-sm' : 'text-lg md:text-xl max-w-md'}`}>
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
      <div className={`acid-bg text-[#09090b] py-3 overflow-hidden border-y-4 border-[#09090b] -rotate-2 scale-105 my-10 relative z-20 shadow-[0_0_50px_rgba(223,255,0,0.2)]`}>
          <div className="w-[200%] flex animate-marquee acid-heading font-bold text-2xl md:text-4xl uppercase tracking-tighter">
              <div className="flex items-center gap-8 px-4">
                  {[...Array(6)].map((_, i) => (<React.Fragment key={i}><span>{profession}</span><span>///</span></React.Fragment>))}
              </div>
              <div className="flex items-center gap-8 px-4">
                  {[...Array(6)].map((_, i) => (<React.Fragment key={i+10}><span>{profession}</span><span>///</span></React.Fragment>))}
              </div>
          </div>
      </div>

      {/* STATS SECTION */}
      <section className="px-6 md:px-12 py-16 md:py-20">
          <div className={`grid gap-4 md:gap-8 ${isMobileView ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
              <div className={`bg-zinc-900 flex flex-col justify-between aspect-square hover:bg-zinc-800 transition ${isMobileView ? 'p-5' : 'p-8'}`}>
                  <span className="acid-text font-bold text-[9px] md:text-xs uppercase tracking-widest acid-body">Projects</span>
                  <span className={`acid-heading font-extrabold ${isMobileView ? 'text-4xl' : 'text-5xl md:text-7xl'}`}>{archiveItems.length}</span>
              </div>
              <div className={`bg-zinc-900 flex flex-col justify-between aspect-square hover:bg-zinc-800 transition ${isMobileView ? 'p-5' : 'p-8'}`}>
                  <span className="acid-text font-bold text-[9px] md:text-xs uppercase tracking-widest acid-body">Awards</span>
                  <span className={`acid-heading font-extrabold ${isMobileView ? 'text-4xl' : 'text-5xl md:text-7xl'}`}>{awardItems.length}</span>
              </div>
              <div className={`bg-zinc-900 flex flex-col justify-between aspect-square hover:bg-zinc-800 transition ${isMobileView ? 'p-5' : 'p-8'}`}>
                  <span className="acid-text font-bold text-[9px] md:text-xs uppercase tracking-widest acid-body">Links</span>
                  <span className={`acid-heading font-extrabold ${isMobileView ? 'text-4xl' : 'text-5xl md:text-7xl'}`}>{links.length}</span>
              </div>
              <div className={`bg-zinc-900 flex flex-col justify-between aspect-square hover:bg-zinc-800 transition cursor-pointer ${isMobileView ? 'p-5' : 'p-8'}`} onClick={() => window.location.href = `mailto:${userEmail}`}>
                  <span className="acid-text font-bold text-[9px] md:text-xs uppercase tracking-widest acid-body">Hire Me</span>
                  <span className={`acid-heading font-extrabold flex items-center ${isMobileView ? 'text-4xl' : 'text-5xl md:text-7xl'}`}><i className="fas fa-envelope"></i></span>
              </div>
          </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="work" className="pt-10 pb-20 md:pb-32">
          <div className="px-6 md:px-12 mb-10 flex justify-between items-end border-b-2 border-zinc-800 pb-6">
              <h2 className={`acid-heading font-extrabold uppercase tracking-tighter ${isMobileView ? 'text-4xl' : 'text-[clamp(3rem,6vw,5rem)]'}`}>PROJECT<br/>INDEX</h2>
              {!isMobileView && <span className="acid-text font-bold text-xs md:text-sm uppercase tracking-widest acid-body">Hover to Reveal</span>}
          </div>

          <div className="flex flex-col relative w-full">
              {archiveItems.length > 0 ? archiveItems.map((p: any, i: number) => {
                const isVideo = p.projectType === 'video';
                return (
                  <a href={p.projectUrl || p.mediaUrl || '#'} target="_blank" rel="noreferrer" key={i} className={`project-item relative w-full flex justify-between cursor-pointer ${isMobileView ? 'flex-col py-6 px-6' : 'flex-col md:flex-row md:items-center py-8 md:py-12 px-6 md:px-12'}`}>
                      <div className="flex flex-col relative z-10 pointer-events-none">
                          <span className="font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2 opacity-70 acid-body">0{i+1} / {p.projectType}</span>
                          <h3 className={`acid-heading font-extrabold uppercase tracking-tighter line-clamp-1 ${isMobileView ? 'text-3xl' : 'text-[clamp(2rem,4vw,4rem)]'}`}>{p.title}</h3>
                      </div>
                      <div className={`font-bold uppercase tracking-widest opacity-70 acid-body relative z-10 pointer-events-none ${isMobileView ? 'mt-3 text-[10px]' : 'mt-4 md:mt-0 text-xs md:text-sm'}`}>
                          {p.description || 'View details'} • {new Date(p.createdAt).getFullYear()}
                      </div>
                      
                      {!isMobileView && (
                          <LazyImage src={isVideo ? getYouTubeThumbnail(p.mediaUrl) : (p.mediaUrl || "https://via.placeholder.com/800")} alt={p.title} className="hover-img hidden md:block grayscale object-cover" />
                      )}
                  </a>
                )
              }) : <div className="py-20 text-center text-zinc-600 font-bold text-xs uppercase tracking-widest acid-body">SYSTEM: NO_DATA_FOUND</div>}
          </div>
          
          {/* Tombol Gallery Utama (Acid Style) */}
          <div className="w-full flex justify-center mt-20 mb-20">
            <Link href={`/${subdomain}/gallery`} className="block no-underline">
              <motion.button
                whileHover={{ scale: 1.05, skewX: -12 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-12 py-4 font-black uppercase tracking-[0.3em] text-xs border-2 transition-all duration-300"
                style={{ 
                  borderColor: themeColor, 
                  color: themeColor,
                  boxShadow: `0 0 20px ${themeColor}44`
                }}
              >
                <motion.div 
                  className="absolute inset-0 z-0"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  style={{ backgroundColor: themeColor }}
                />
                <span className="relative z-10 flex items-center gap-3 mix-blend-difference">
                  <i className="fas fa-images"></i> Explore_Full_Archive
                </span>
              </motion.button>
            </Link>
          </div>
      </section>

      {/* AWARDS SECTION */}
      <section className="acid-bg text-[#09090b] py-20 md:py-24" id="awards">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
              <h2 className={`acid-heading font-extrabold uppercase tracking-tighter mb-12 ${isMobileView ? 'text-4xl' : 'text-[clamp(3rem,6vw,5rem)]'}`}>RECOGNITION</h2>
              
              <div className="border-t-4 border-[#09090b]">
                  {awardItems.length > 0 ? awardItems.map((award: any, i: number) => {
                    const isOpen = openAward === award.id;
                    return (
                      <div key={i} className="border-b-4 border-[#09090b] group">
                          <div className={`award-row flex justify-between items-center cursor-pointer hover:bg-[#09090b] hover:text-[var(--theme-color)] transition-colors px-2 md:px-4 ${isMobileView ? 'py-5' : 'py-6'}`} style={{ '--theme-color': themeColor } as any} onClick={() => setOpenAward(isOpen ? null : award.id)}>
                              <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                                  <span className={`font-bold acid-body shrink-0 ${isMobileView ? 'text-lg w-12' : 'text-xl md:text-2xl w-16'}`}>{award.year || new Date(award.createdAt).getFullYear()}</span>
                                  <h3 className={`acid-heading font-extrabold uppercase tracking-tighter line-clamp-1 ${isMobileView ? 'text-xl' : 'text-2xl md:text-4xl'}`}>{award.title}</h3>
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
              <span className={`block w-full break-words ${isMobileView ? 'text-5xl' : 'text-[clamp(5rem,15vw,10rem)]'}`}>CONTACT</span>
          </a>
          
          <div className={`flex justify-between items-center border-t border-zinc-800 pt-8 font-bold uppercase tracking-widest text-zinc-500 acid-body ${isMobileView ? 'flex-col gap-4 text-[9px]' : 'flex-col md:flex-row text-[10px] md:text-xs'}`}>
              <p>© 2026 {fullName}</p>
              <div className={`flex ${isMobileView ? 'gap-4 my-2' : 'gap-6 my-4 md:my-0'}`}>
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