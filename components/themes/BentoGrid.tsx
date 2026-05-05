"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

const getYouTubeThumbnail = (url: string) => {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
  return match ? `https://res.cloudinary.com/deobqjna7/image/youtube/${match[1]}.jpg` : url;
};

export default function BentoTheme({ data, theme, isMobileView = false }: { data: any, theme: any, isMobileView?: boolean }) {
  // Parsing Data
  const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
  const profession = data?.profile?.profession || data?.profession || "Software Engineer & UI/UX Enthusiast";
  const bio = data?.profile?.bio || data?.bio || "Software Engineer & UI/UX Enthusiast yang mengubah ide rumit menjadi antarmuka elegan.";
  const location = data?.profile?.location || data?.location || "Indonesia";
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const archiveItems = (data?.projects || data?.user?.projects || []).slice(0, 4);
  const awardItems = data?.certificates || data?.user?.certificates || [];
  const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

  const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
  const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
  const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

  const githubLink = links.find((l: any) => l.platform.toLowerCase().includes('github'));
  const linkedinLink = links.find((l: any) => l.platform.toLowerCase().includes('linkedin'));

  // Theme settings
  const rawHighlightColor = theme?.themeColor || '#ff9e00';
  const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#ff9e00';

  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  // Class helper for Editor Preview
  const c = {
    grid: isMobileView ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4 lg:grid-cols-6",
    hero: isMobileView ? "col-span-2 row-span-2 p-6" : "col-span-2 md:col-span-4 lg:col-span-4 row-span-2 p-6 md:p-12",
    heroText: isMobileView ? "text-4xl" : "text-4xl md:text-6xl",
    profile: isMobileView ? "col-span-2 row-span-2" : "col-span-2 md:col-span-2 row-span-2",
    social: isMobileView ? "col-span-1 row-span-1" : "col-span-1 md:col-span-2 lg:col-span-1 row-span-1",
    metric: isMobileView ? "col-span-2 row-span-1 p-6" : "col-span-2 md:col-span-4 lg:col-span-2 row-span-1 p-6 md:p-8",
    ctaOuter: isMobileView ? "col-span-2 row-span-1" : "col-span-2 md:col-span-4 lg:col-span-2 row-span-1",
    ctaInner: isMobileView ? "p-6" : "p-6 md:p-8",
    tech: isMobileView ? "col-span-2 row-span-1 p-6 flex-col items-start" : "col-span-2 md:col-span-4 lg:col-span-6 row-span-1 p-6 md:p-8 flex-col md:flex-row md:items-center",
    project: (isLarge: boolean) => isMobileView ? "col-span-2 row-span-2 p-6" : (isLarge ? "col-span-2 md:col-span-4 lg:col-span-4 row-span-2 p-6 md:p-8" : "col-span-2 md:col-span-2 lg:col-span-2 row-span-2 p-6 md:p-8"),
    cert: isMobileView ? "col-span-2 p-6" : "col-span-2 md:col-span-4 lg:col-span-6 md:row-span-2 p-6 md:p-8",
    certGrid: isMobileView ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    mainPadding: isMobileView ? "p-4" : "p-4 sm:p-6 md:p-8",
    gridGap: isMobileView ? "gap-4" : "gap-4 sm:gap-6",
    watermarkText: isMobileView ? "text-[60px]" : "text-5xl sm:text-[100px] md:text-[140px]",
    bioText: isMobileView ? "text-sm" : "text-sm md:text-lg lg:text-xl",
    badgePadding: isMobileView ? "px-3 py-1.5" : "px-3 py-1.5 md:px-4 md:py-2",
    badgeDot: isMobileView ? "w-1.5 h-1.5" : "w-1.5 h-1.5 md:w-2 md:h-2",
    badgeText: isMobileView ? "text-[10px]" : "text-[10px] md:text-xs",
    heroMinH: isMobileView ? "min-h-[100px]" : "min-h-[100px] md:min-h-[120px]",
    orbSize: isMobileView ? "w-48 h-48 blur-[60px]" : "w-64 h-64 blur-[80px]",
  };

  // Variasi Animasi Framer Motion
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  const techStack = [
    { icon: 'fa-react', name: 'React', color: '#61dafb' },
    { icon: 'fa-js', name: 'JavaScript', color: '#f7df1e' },
    { icon: 'fa-node-js', name: 'Node.js', color: '#339933' },
    { icon: 'fa-figma', name: 'Figma', color: '#f24e1e' },
    { icon: 'fa-aws', name: 'AWS', color: '#ff9900' },
    { icon: 'fa-docker', name: 'Docker', color: '#2496ed' },
    { icon: 'fa-python', name: 'Python', color: '#3776ab' },
    { icon: 'fa-git-alt', name: 'Git', color: '#f34f29' },
  ];

  return (
    <main className={`min-h-screen bg-[#09090b] text-slate-200 font-sans selection:bg-[#ff9e00]/30 selection:text-[#ff9e00] ${c.mainPadding}`}>

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
        * { font-family: 'Outfit', sans-serif; }
        .bento-card {
          background: linear-gradient(145deg, rgba(24,24,27,0.8) 0%, rgba(24,24,27,0.4) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .bento-card:hover {
          border-color: ${highlightColor}4d;
          box-shadow: 0 10px 40px -10px ${highlightColor}1a;
          transform: translateY(-4px);
        }
        .scroller {
          max-width: 100%;
          overflow: hidden;
          -webkit-mask: linear-gradient(90deg, transparent, white 10%, white 90%, transparent);
          mask: linear-gradient(90deg, transparent, white 10%, white 90%, transparent);
        }
        .scroller__inner {
          display: flex;
          width: max-content;
          animation: scroll 40s linear infinite;
        }
        .scroller__inner:hover {
          animation-play-state: paused;
        }
        @keyframes scroll {
          to { transform: translateX(-50%); }
        }
      `}} />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={`w-full mx-auto grid auto-rows-[minmax(160px,auto)] ${c.gridGap} ${c.grid}`}
      >

        {/* HERO SECTION (Makan 4 Kolom, 2 Baris) */}
        <motion.div variants={item} className={`bento-card rounded-3xl flex flex-col justify-between relative overflow-hidden group ${c.hero}`}>
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.03] blur-[100px] rounded-full group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none" style={{ backgroundColor: highlightColor }}></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)] pointer-events-none"></div>

          {/* Top Bar */}
          <div className="flex justify-between items-start relative z-10 w-full mb-8">
            <div className="flex flex-col">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-[0.2em] mb-1">Introduction</span>
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest bg-white/5 border border-white/5 px-2 py-0.5 rounded-md w-fit">Portfolio</span>
            </div>

            <div className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 shadow-sm backdrop-blur-md transition-transform hover:scale-105 ${c.badgePadding}`}>
              <span className={`rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)] ${c.badgeDot}`} style={{ backgroundColor: highlightColor }}></span>
              <span className={`font-bold tracking-widest text-slate-300 uppercase ${c.badgeText}`}>Available</span>
            </div>
          </div>

          {/* Interactive Floating Center Piece */}
          <div className={`flex-1 w-full flex items-center justify-center relative pointer-events-none transition-opacity duration-700 my-8 ${c.heroMinH}`}>
            {/* Massive background text */}
            <h2 className={`absolute font-black text-white/5 select-none uppercase overflow-hidden whitespace-nowrap ${c.watermarkText}`} style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)' }}>
              {firstName}
            </h2>

            {/* Floating elements */}
            {!isMobileView && (
              <>
                <motion.div
                  animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="hidden md:flex absolute top-0 left-[20%] px-5 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-0"
                >
                  <i className="fas fa-magic text-white text-lg" style={{ color: highlightColor }}></i>
                  <span className="text-sm font-bold text-white tracking-widest uppercase">Creative Thinker</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 30, 0], rotate: [0, 15, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="hidden md:flex absolute bottom-0 right-[20%] px-6 py-6 rounded-full border border-white/20 backdrop-blur-xl items-center justify-center bg-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-0"
                >
                  <i className="fas fa-asterisk animate-[spin_10s_linear_infinite] text-white/80 text-3xl" style={{ color: highlightColor }}></i>
                </motion.div>
              </>
            )}

            {/* Glowing Orb */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none ${c.orbSize}`} style={{ backgroundColor: highlightColor }}
            ></motion.div>
          </div>

          {/* Bottom Content */}
          <div className="relative z-10">
            <h1 className={`font-extrabold text-white leading-[1.1] mb-4 md:mb-5 tracking-tight ${c.heroText}`}>
              I'm {firstName},<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${highlightColor}, #fcd34d)` }}>{profession}</span>.
            </h1>
            <p className={`text-slate-400 font-light max-w-2xl leading-relaxed ${c.bioText}`}>
              {bio}
            </p>
          </div>
        </motion.div>

        {/* PROFILE PICTURE CARD */}
        <motion.div variants={item} className={`bento-card rounded-3xl relative overflow-hidden group p-2 ${c.profile}`}>
          <img
            src={displayAvatar}
            alt={fullName}
            className="w-full h-full object-cover rounded-[1.25rem] grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
          />
          {/* Overlay Kaca di bawah foto */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-4 w-[85%]">
            <i className="fas fa-map-marker-alt" style={{ color: highlightColor }}></i>
            <span className="text-sm font-semibold tracking-widest truncate">{location}</span>
          </div>
        </motion.div>

        {/* SOCIAL LINKS - GITHUB */}
        {githubLink ? (
          <motion.a href={githubLink.url} target="_blank" rel="noreferrer" variants={item} className={`bento-card rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-white hover:text-black group cursor-pointer text-slate-400 ${c.social}`}>
            <i className="fab fa-github text-4xl group-hover:scale-110 transition-transform"></i>
            <span className="text-xs font-bold tracking-widest uppercase">Github</span>
          </motion.a>
        ) : (
          <motion.div variants={item} className={`bento-card rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-600 ${c.social}`}>
            <i className="fab fa-github text-4xl opacity-20"></i>
          </motion.div>
        )}

        {/* SOCIAL LINKS - LINKEDIN */}
        {linkedinLink ? (
          <motion.a href={linkedinLink.url} target="_blank" rel="noreferrer" variants={item} className={`bento-card rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-[#0a66c2] hover:text-white hover:border-[#0a66c2] group cursor-pointer text-slate-400 ${c.social}`}>
            <i className="fab fa-linkedin-in text-4xl group-hover:scale-110 transition-transform"></i>
            <span className="text-xs font-bold tracking-widest uppercase">LinkedIn</span>
          </motion.a>
        ) : (
          <motion.div variants={item} className={`bento-card rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-600 ${c.social}`}>
            <i className="fab fa-linkedin-in text-4xl opacity-20"></i>
          </motion.div>
        )}

        {/* EXPERIENCE / METRIC */}
        <motion.div variants={item} className={`bento-card rounded-3xl flex items-center justify-between ${c.metric}`}>
          <div>
            <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-1">Total Proyek</p>
            <h3 className="text-4xl font-extrabold text-white">{archiveItems.length} <span className="text-xl" style={{ color: highlightColor }}>Works</span></h3>
          </div>
          <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <i className="fas fa-briefcase text-xl text-slate-300"></i>
          </div>
        </motion.div>

        {/* SELECTED WORKS (CTA CARD) */}
        <Link href={`/${subdomain}/gallery`} scroll={false} passHref className={`block ${c.ctaOuter}`}>
          <motion.div variants={item} className={`h-full bento-card rounded-3xl bg-gradient-to-br from-[#18181b] to-[#0f0f12] flex flex-col justify-center group cursor-pointer overflow-hidden relative ${c.ctaInner}`}>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 group-hover:scale-150 group-hover:rotate-12 transition-all duration-700">
              <i className="fas fa-magic text-9xl" style={{ color: highlightColor }}></i>
            </div>
            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-2">Portfolio</p>
            <h3 className="text-2xl font-extrabold text-white flex items-center gap-3">
              Lihat Karya <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform" style={{ color: highlightColor }}></i>
            </h3>
          </motion.div>
        </Link>

        {/* TECH STACK SECTION - INFINITE MARQUEE */}
        <motion.div variants={item} className={`bento-card rounded-3xl flex justify-between gap-6 sm:gap-8 overflow-hidden relative ${c.tech}`}>
          <div className="shrink-0 relative z-10 bg-gradient-to-r from-[rgba(24,24,27,0.95)] via-[rgba(24,24,27,0.8)] to-transparent pr-8 lg:pr-12">
            <p className="text-slate-400 text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase mb-1 sm:mb-2">Tech Stack</p>
            <h4 className="text-lg sm:text-xl font-black text-white whitespace-nowrap">Senjata Andalan</h4>
          </div>

          <div className="scroller w-full mt-2 lg:mt-0 flex items-center absolute inset-y-0 right-0 left-0 pl-[160px] md:pl-[200px]">
            <div className="scroller__inner">
              {/* Track 1 */}
              <div className="flex gap-4 sm:gap-6 pr-4 sm:pr-6 scroller__track">
                {[...techStack, ...techStack, ...techStack, ...techStack].map((tech, i) => (
                  <motion.div
                    key={`t1-${i}`}
                    whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/5 transition-colors cursor-crosshair group shrink-0"
                  >
                    <i className={`fab ${tech.icon} text-2xl sm:text-3xl text-slate-500 transition-colors duration-300`} style={{ color: "currentColor" }} onMouseEnter={(e) => e.currentTarget.style.color = tech.color} onMouseLeave={(e) => e.currentTarget.style.color = ""}></i>
                  </motion.div>
                ))}
              </div>
              {/* Track 2 (Identik, untuk efek loop seamless) */}
              <div className="flex gap-4 sm:gap-6 pr-4 sm:pr-6 scroller__track">
                {[...techStack, ...techStack, ...techStack, ...techStack].map((tech, i) => (
                  <motion.div
                    key={`t2-${i}`}
                    whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/5 transition-colors cursor-crosshair group shrink-0"
                  >
                    <i className={`fab ${tech.icon} text-2xl sm:text-3xl text-slate-500 transition-colors duration-300`} style={{ color: "currentColor" }} onMouseEnter={(e) => e.currentTarget.style.color = tech.color} onMouseLeave={(e) => e.currentTarget.style.color = ""}></i>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* PROJECTS */}
        {archiveItems.map((p: any, i: number) => {
          const isLarge = i === 0 || i === 3;
          return (
            <motion.a
              href={p.mediaUrl || '#'} target="_blank" rel="noreferrer"
              key={i}
              variants={item}
              className={`bento-card rounded-3xl overflow-hidden group relative flex flex-col justify-end ${c.project(isLarge)}`}
            >
              <img src={p.projectType === 'video' ? getYouTubeThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>

              <div className="relative z-10 flex flex-col gap-2">
                <div className="flex justify-between items-center w-full">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">{p.projectType}</span>
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                    <i className="fas fa-arrow-right -rotate-45"></i>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-white mt-4">{p.title}</h3>
                </div>
              </div>
            </motion.a>
          );
        })}

        {/* CERTIFICATES / AWARDS */}
        {awardItems.length > 0 && (
          <motion.div variants={item} className={`bento-card rounded-3xl flex flex-col ${c.cert}`}>
            <h3 className="text-xl font-extrabold text-white mb-6 flex items-center gap-3">
              <i className="fas fa-award" style={{ color: highlightColor }}></i> Honors & Awards
            </h3>
            <div className={`grid gap-4 h-full ${c.certGrid}`}>
              {awardItems.slice(0, 4).map((award: any, i: number) => (
                <a href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" key={i} className="flex flex-col gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-0 group-hover:opacity-5 blur-2xl rounded-full transition-opacity duration-500"></div>
                  <div className="w-full aspect-video rounded-xl overflow-hidden bg-[#09090b] relative border border-white/10">
                    <img src={award.mediaUrl} alt={award.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">{award.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-semibold">{award.issuer}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}

      </motion.div>
    </main>
  );
}