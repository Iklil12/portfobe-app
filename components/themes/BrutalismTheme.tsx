//components/themes/BrutalismTheme.tsx
"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation'; 
import Link from 'next/link';
import { motion } from 'framer-motion';

const getYouTubeThumbnail = (url: string) => {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : url;
};

export default function BrutalismTheme({ data, theme, isMobileView = false }: { data: any, theme: any, isMobileView?: boolean }) {
  const [openAward, setOpenAward] = useState<string | null>(null);
  
  // --- STATE BARU: Untuk kontrol buka/tutup Dropdown Contact ---
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  const pathname = usePathname();
  const isEditor = pathname?.includes('/dashboard');

  const res = (desktopClasses: string) => isMobileView ? '' : desktopClasses;

  // --- MENGAMBIL DATA TEMA (Dari tabel SiteAppearance) ---
  const themeColor = theme?.themeColor || "#000000";
  const fontHeading = theme?.fontHeading || "Space Mono";
  const fontBody = theme?.fontBody || "Inter";
  const cardStyle = theme?.cardStyle || "hard-shadow";
  const buttonShape = theme?.buttonShape || "hard";

  // --- MENGAMBIL DATA IDENTITAS (Dari tabel Profile yang sudah dipisah) ---
  const fullName = data?.profile?.fullName || data?.fullName || "Nama Anda";
  const profession = data?.profile?.profession || data?.profession || "Visual Architect";
  const bio = data?.profile?.bio || data?.bio || "Telling stories through motion. Based in Indonesia, operating globally.";
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";

  // --- MENGAMBIL EMAIL USER (Langsung dari tabel User) ---
  const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.co`;

  // --- MENGAMBIL DATA RELASI (Project, Sertifikat, Link) ---
  const archiveItems = (data?.projects || data?.user?.projects || []).slice(0, 4);
  const awardItems = data?.certificates || data?.user?.certificates || [];
  const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

  const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.avatar || "";
  const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
  const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=000000&textColor=ffffff`;

  const isBrutal = cardStyle === 'hard-shadow';
  
  const getCardClass = () => {
    if (isBrutal) return `border-[2px] ${res('md:border-[3px]')} border-black preview-hard-shadow-sm bg-white`;
    if (cardStyle === 'flat') return 'border border-slate-200 bg-white overflow-hidden';
    return 'shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white border border-transparent overflow-hidden';
  };
  
  const getRadiusClass = (isLarge = false) => {
    if (buttonShape === 'hard') return 'rounded-none';
    if (buttonShape === 'rounded') return isLarge ? `rounded-2xl ${res('md:rounded-3xl')}` : 'rounded-lg';
    return isLarge ? `rounded-[2rem] ${res('md:rounded-[3rem]')}` : 'rounded-full';
  };

  const getFontFamily = (fontName: string) => {
    if (fontName === 'Space Mono') return "'Space Mono', monospace";
    if (fontName === 'serif' || fontName === 'Elegant Serif') return "'Playfair Display', serif";
    return "'Inter', sans-serif";
  };

  const customHeadingFont = getFontFamily(fontHeading);
  const customBodyFont = getFontFamily(fontBody);

  return (
    // FIX: Tambahkan text-slate-900 (Warna Default Hitam) pada kontainer paling luar agar menimpa css nyasar dari Editor
    <div className={`w-full max-w-5xl mx-auto bg-white text-slate-900 relative z-10 flex flex-col min-h-screen ${res('sm:min-h-0')} transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] animate-in fade-in slide-in-from-bottom-8 duration-1000
      ${isBrutal ? `border-x-0 border-y-0 border-black ${res('sm:border-x-[3px] sm:border-y-[3px] sm:preview-hard-shadow')}` : `border-x-0 border-slate-200 ${res(`sm:border-x ${cardStyle==='soft-shadow'?'sm:shadow-[0_20px_50px_rgba(0,0,0,0.1)]':''} sm:${getRadiusClass(true)}`)}`}
    `}>
      
      {isEditor && subdomain && (
        <a 
          href={`/${subdomain}`} 
          target="_blank" 
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-[99999] px-6 py-3.5 bg-[#ff9e00] text-black font-black uppercase text-[10px] tracking-widest rounded-full shadow-[0_10px_30px_rgba(255,158,0,0.4)] hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 border-[2px] border-black"
        >
          <i className="fas fa-external-link-alt"></i> Live Preview
        </a>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
        
        .custom-heading { font-family: ${customHeadingFont} !important; }
        .custom-body { font-family: ${customBodyFont} !important; }
        
        .preview-border { border-color: ${themeColor} !important; transition: border-color 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
        .preview-hard-shadow { box-shadow: 10px 10px 0px 0px ${themeColor}; transition: box-shadow 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
        .preview-hard-shadow-sm { box-shadow: 4px 4px 0px 0px ${themeColor}; transition: box-shadow 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
      `}} />

      {/* HEADER NAVBAR KINI RELATIF UNTUK DROPDOWN */}
      <header className={`relative flex text-[10px] ${res('md:text-xs')} uppercase font-bold sticky top-0 z-[100] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] bg-white/95 backdrop-blur-md
        ${isBrutal ? 'border-b-[3px] border-black divide-x-[3px] divide-black font-mono' : `border-b border-slate-100 shadow-sm ${res(`sm:${getRadiusClass(true)} sm:rounded-b-none`)}`}
      `}>
          <div className={`p-4 ${res('md:p-5')} flex-1 flex justify-between items-center transition-colors duration-700 ${isBrutal ? 'bg-black text-white' : 'text-slate-900'}`}>
              <span className={`transition-all duration-700 custom-heading`}>{fullName}( )</span>
              <span className="animate-pulse transition-colors duration-700" style={{ color: isBrutal ? '#fff' : themeColor }}>● REC</span>
          </div>
          <div className={`hidden ${res('sm:flex')} p-4 md:p-5 w-24 md:w-32 items-center justify-center text-center hover:bg-gray-100 transition-colors duration-300 custom-body text-slate-900`}>
              <a href="#archive">Archive</a>
          </div>

          {/* --- TOMBOL CONTACT (TOGGLE DROPDOWN) --- */}
          <button onClick={() => setIsContactOpen(!isContactOpen)} className={`p-4 ${res('md:p-5 w-28 md:w-40')} text-center cursor-pointer flex items-center justify-center gap-2 transition-all duration-700 ease-out custom-body outline-none ${isBrutal ? 'bg-gray-100 text-black hover:bg-black hover:text-white' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md'} ${buttonShape !== 'hard' && !isBrutal ? getRadiusClass(false) + res(' mx-3 my-2') : ''}`}>
              Contact <i className={`fas fa-chevron-down transition-transform duration-300 ${isContactOpen ? 'rotate-180' : ''}`}></i>
          </button>

          {/* --- DROPDOWN MENU CONTACT --- */}
          <div className={`absolute top-[100%] right-0 w-full sm:w-[320px] bg-white flex flex-col transition-all duration-300 origin-top shadow-2xl ${isContactOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'} ${isBrutal ? 'border-b-[3px] sm:border-l-[3px] border-black font-mono' : 'sm:rounded-bl-3xl border border-slate-100 font-sans'}`}>
              
              <div className={`p-6 ${res('md:p-8')} ${isBrutal ? 'border-b-[2px] border-black bg-gray-100' : 'border-b border-slate-100 bg-slate-50'}`}>
                  <p className="text-[9px] text-gray-500 mb-2 font-bold tracking-widest uppercase">Direct Email</p>
                  <a href={`mailto:${userEmail}`} className={`text-sm ${res('md:text-base')} font-black truncate block hover:text-[#ff9e00] transition-colors custom-heading ${isBrutal ? 'text-black' : 'text-slate-800'}`}>
                      {userEmail}
                  </a>
              </div>

              <div className={`p-6 ${res('md:p-8')} flex flex-col gap-4`}>
                  <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">Social & Links</p>
                  {links.length > 0 ? links.map((l: any, i: number) => (
                      <a key={i} href={l.url} target="_blank" rel="noreferrer" className={`group flex justify-between items-center text-xs ${res('md:text-sm')} font-bold uppercase tracking-wide transition-colors ${isBrutal ? 'text-slate-900 hover:text-[#ff9e00]' : 'text-slate-900 hover:text-blue-600'}`}>
                          <span>{l.platform}</span>
                          <i className="fas fa-arrow-right opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all -rotate-45"></i>
                      </a>
                  )) : (
                      <p className="text-xs text-gray-400 lowercase italic">No external links found.</p>
                  )}
              </div>

          </div>
      </header>

      {/* HERO SECTION */}
      <section className={`grid grid-cols-1 ${res('md:grid-cols-12')} transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${!isBrutal ? `mt-2 ${res('md:mt-8')}` : ''}`}>
          <div className={`col-span-1 ${res('md:col-span-8')} p-6 ${res('sm:p-8 md:p-12 lg:p-16')} flex flex-col justify-center relative overflow-hidden transition-all duration-700
            ${isBrutal ? `border-b-[3px] ${res('md:border-b-0 md:border-r-[3px]')} border-black bg-slate-50` : 'bg-white'}
          `}>
              {isBrutal && <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>}
              {isBrutal && (
                <div className={`inline-block text-slate-900 border-[2px] border-black px-3 py-1 mb-4 ${res('md:mb-8')} w-max font-mono text-[9px] ${res('md:text-[10px]')} font-bold uppercase bg-white preview-hard-shadow-sm relative z-10 transition-all duration-700 ${getRadiusClass(false)}`}>
                    ID: {subdomain?.toUpperCase() || 'USER'}-V1
                </div>
              )}
              
              <h1 className={`text-slate-900 text-4xl ${res('sm:text-5xl md:text-6xl lg:text-7xl')} font-black uppercase leading-[0.9] tracking-tighter mb-4 ${res('md:mb-6')} relative z-10 transition-all duration-700 custom-heading`}>
                  {profession ? profession.split(' ').map((w:any, i:any) => <React.Fragment key={i}>{w}<br/></React.Fragment>) : 'Visual Architect'}
              </h1>
              
              <p className={`text-[10px] ${res('md:text-[11px]')} max-w-[280px] ${res('sm:max-w-xs md:max-w-md')} opacity-80 relative z-10 leading-relaxed transition-all duration-700 custom-body ${isBrutal ? `uppercase font-bold border-l-[2px] ${res('md:border-l-[3px]')} border-black pl-3 ${res('md:pl-5')} bg-white/50 backdrop-blur-sm p-2 ${res('md:p-3')} text-slate-900` : 'text-slate-500'}`}>
                  {bio}
              </p>
          </div>
          <div className={`col-span-1 ${res('md:col-span-4')} p-8 ${res('md:p-12')} flex items-center justify-center relative transition-colors duration-700 ${isBrutal ? 'bg-gray-100 border-b-[3px] border-black md:border-b-0' : 'bg-white'}`}>
              {isBrutal && (
                <div className={`hidden ${res('md:block')} absolute inset-0 pointer-events-none`}>
                  <div className="absolute top-4 left-4 w-3 h-3 border-t-[2px] border-l-[2px] border-black"></div>
                  <div className="absolute top-4 right-4 w-3 h-3 border-t-[2px] border-r-[2px] border-black"></div>
                  <div className="absolute bottom-4 left-4 w-3 h-3 border-b-[2px] border-l-[2px] border-black"></div>
                  <div className="absolute bottom-4 right-4 w-3 h-3 border-b-[2px] border-r-[2px] border-black"></div>
                </div>
              )}
              
              <div className={`w-full max-w-[240px] ${res('sm:max-w-[280px] md:max-w-[320px]')} aspect-[3/4] overflow-hidden transition-all duration-700 mx-auto ${isBrutal ? `border-[2px] ${res('md:border-[3px]')} border-black preview-hard-shadow-sm p-1.5 ${res('md:p-2')} bg-white ${getRadiusClass(true)}` : getCardClass() + ' ' + getRadiusClass(true)}`}>
                  <img src={displayAvatar} className={`w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0 ${isBrutal ? getRadiusClass(false) : ''}`} alt="Profile" />
              </div>
          </div>
      </section>

      {/* --- BLOK STATISTIK BRUTALISM --- */}
      <section className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] border-b-[3px] border-black bg-black p-[3px] pb-0`}>
          <div className={`grid grid-cols-2 gap-[3px]`}>
              <div className={`p-4 ${res('md:p-5')} flex flex-col justify-center transition-colors duration-700 bg-black text-white`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1 custom-heading text-white opacity-80">Projects</p>
                  <p className={`text-2xl ${res('md:text-3xl')} font-black tracking-tighter custom-heading text-white`}>{archiveItems.length}</p>
              </div>
              <div className={`p-4 ${res('md:p-5')} flex flex-col justify-center transition-colors duration-700 bg-white`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1 custom-heading text-black opacity-80">Awards</p>
                  <p className={`text-2xl ${res('md:text-3xl')} font-black tracking-tighter custom-heading text-black`}>{awardItems.length}</p>
              </div>
          </div>
      </section>

      {/* ARCHIVE SECTION */}
      <section id="archive" className={!isBrutal ? `mb-8 ${res('md:mb-14')}` : ''}>
        <div className={`p-4 ${res('md:p-6')} font-bold uppercase flex justify-between transition-all duration-700 ${isBrutal ? `border-b-[3px] border-black bg-gray-100 text-slate-900 font-mono text-[10px] ${res('md:text-xs')}` : `bg-white custom-body text-xs ${res('md:text-sm')} text-slate-800 px-6 ${res('sm:px-8')} mt-4`}`}>
            <span>{isBrutal ? '[ Selected Archive ]' : 'Selected Archive'}</span>
            {isBrutal && <span>Vol. 1</span>}
        </div>
        <div className={`grid grid-cols-1 ${res('md:grid-cols-2')} transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isBrutal ? `border-b-[3px] border-black overflow-hidden` : `gap-4 ${res('sm:gap-6')} p-4 ${res('sm:p-8')} bg-slate-50 border-b border-slate-100`}`}>
            {archiveItems.length > 0 ? archiveItems.map((p: any, i: number) => {
              const linkTarget = p.projectUrl || p.url || p.mediaUrl || '#';
              const isVideo = p.projectType === 'video';

              return (
                <a href={linkTarget} target={linkTarget !== '#' ? "_blank" : "_self"} key={i} className={`group cursor-pointer overflow-hidden transition-all duration-700 block ${isBrutal ? `border-b-[3px] border-black last:border-b-0 ${res('md:border-b-0 md:border-r-[3px] md:[&:nth-child(even)]:border-r-0 md:[&:nth-last-child(-n+2)]:border-b-0')} ` : getCardClass() + ' ' + getRadiusClass(true)}`}>
                    <div className={`p-3 ${res('md:p-5')} flex justify-between font-bold transition-all duration-700 ${isBrutal ? `border-b-[2px] border-black bg-white group-hover:bg-black text-slate-900 group-hover:text-white font-mono text-[9px] ${res('md:text-[10px]')}` : `bg-slate-50 text-slate-500 custom-body text-[10px] ${res('md:text-xs')} border-b border-slate-100`}`}>
                      <span style={{ color: !isBrutal ? themeColor : '' }}>{p.projectType?.toUpperCase() || 'PROJECT'}</span>
                      <span>0{i+1}</span>
                    </div>
                    
                    <div className={`aspect-video bg-gray-200 relative overflow-hidden transition-all duration-700 ${isBrutal ? 'border-b-[2px] border-black' : ''}`}>
                      <img src={isVideo ? getYouTubeThumbnail(p.mediaUrl) : (p.mediaUrl || "https://via.placeholder.com/800x600?text=No+Image")} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" alt={p.title} />
                      
                      {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className={`w-12 h-12 flex items-center justify-center ${isBrutal ? 'bg-[#ff9e00] border-2 border-black rounded-none' : 'bg-white rounded-full shadow-lg'} text-black`}>
                              <i className="fas fa-play ml-1"></i>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className={`p-5 ${res('md:p-8')} bg-white transition-all duration-700`}>
                      <h3 className={`text-lg text-slate-900 ${res('md:text-2xl')} font-black tracking-tighter mb-1 truncate custom-heading group-hover:underline decoration-2 underline-offset-4`}>{p.title}</h3>
                      <p className={`transition-all duration-700 text-gray-500 truncate custom-body text-[10px] ${res('md:text-xs')} ${isBrutal && 'uppercase'}`}>{p.description || 'View Details'}</p>
                    </div>
                </a>
              );
            }) : <div className={`p-10 ${res('md:p-16')} text-center col-span-2 text-slate-900 opacity-30 font-mono text-[10px] ${res('md:text-[11px]')} uppercase`}>NO ARCHIVE DATA FOUND.</div>}
        </div>

        {/* Tombol Gallery Utama (Brutalist Style) */}
        <div className="w-full flex justify-center mt-12 mb-12">
          <Link href={`/${subdomain}/gallery`} className="block no-underline">
            <motion.button
              whileHover={{ x: -4, y: -4, boxShadow: `8px 8px 0px 0px ${isBrutal ? themeColor : '#000'}` }}
              whileTap={{ x: 0, y: 0, boxShadow: '0px 0px 0px 0px #000' }}
              className={`px-12 py-5 font-black uppercase tracking-widest text-sm transition-all duration-200 flex items-center gap-4 ${isBrutal ? 'border-[3px] border-black bg-white text-black' : 'bg-black text-white rounded-xl shadow-xl'}`}
              style={{ fontFamily: customHeadingFont }}
            >
              <i className="fas fa-images"></i> EXPLORE ALL_INDEX
            </motion.button>
          </Link>
        </div>
      </section>

      {/* AWARDS SECTION */}
      <div className={`p-4 ${res('md:p-6')} font-bold uppercase transition-all duration-700 ${isBrutal ? `border-b-[3px] border-black bg-black text-white font-mono text-[10px] ${res('md:text-xs')}` : `bg-white custom-body text-xs ${res('md:text-sm')} text-slate-800 px-6 ${res('sm:px-8')} mt-8 mb-4`}`}>
          {isBrutal ? '[ Honors_And_Awards.sys ]' : 'Honors & Awards'}
      </div>
      <div className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isBrutal ? 'bg-white' : `px-4 ${res('sm:px-8')} pb-8 bg-white`}`}>
        {awardItems.length > 0 ? awardItems.map((award: any) => (
          <div key={award.id} className={`flex flex-col transition-all duration-700 overflow-hidden ${isBrutal ? 'border-b-[3px] border-black text-slate-900' : `mb-3 ${res('sm:mb-4')} ` + getCardClass() + ' ' + getRadiusClass(true)}`}>
              <div className={`p-4 ${res('sm:p-5 md:p-6')} flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors duration-300 ${!isBrutal && openAward === award.id ? 'border-b border-slate-100' : ''}`} onClick={() => setOpenAward(openAward === award.id ? null : award.id)}>
                  <div className={`flex items-center gap-3 ${res('sm:gap-4 md:gap-6')} overflow-hidden`}>
                      <span className={`font-bold w-6 ${res('sm:w-8 md:w-12')} shrink-0 whitespace-nowrap text-center transition-all duration-700 custom-heading text-xs ${res('md:text-sm')} ${!isBrutal ? 'text-slate-400' : 'text-slate-900'}`}>
                        {openAward === award.id ? '[ - ]' : '[ + ]'}
                      </span>
                      <h3 className={`text-sm text-slate-900 ${res('sm:text-base md:text-xl lg:text-2xl')} font-black tracking-tighter truncate max-w-[150px] ${res('sm:max-w-[250px] md:max-w-[400px]')} transition-all duration-700 custom-heading ${isBrutal && 'uppercase'}`}>{award.title}</h3>
                  </div>
                  
                  <span className={`text-[8px] ${res('sm:text-[9px] md:text-[10px]')} font-bold uppercase text-right shrink-0 whitespace-nowrap ml-2 ${res('md:ml-4')} transition-all duration-700 custom-body ${!isBrutal ? 'text-slate-400' : 'text-slate-900'}`}>
                    {award.issuer || 'CERTIFICATE'} <br className={res('sm:hidden')} /> <span className={`hidden ${res('sm:inline')}`}>/</span> {award.year || new Date(award.createdAt).getFullYear()}
                  </span>
              </div>
              <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] bg-gray-50 ${openAward === award.id ? `max-h-[600px] ${res('md:max-h-[800px]')}` : 'max-h-0'}`}>
                  <div className={`p-4 ${res('sm:p-5 md:p-8')} flex flex-col ${res('sm:flex-row')} gap-4 ${res('sm:gap-6 md:gap-8')} transition-all duration-700 ${isBrutal ? 'border-t-[3px] border-black' : ''}`}>
                      
                      <div className={`w-full ${res('sm:w-48 md:w-64')} shrink-0 bg-white p-1.5 ${res('sm:p-2')} transition-all duration-700 ${isBrutal ? `border-[2px] border-black preview-hard-shadow-sm ${getRadiusClass(false)}` : `rounded-xl shadow-sm border border-slate-200 overflow-hidden ${getRadiusClass(false)}`}`}>
                          <img src={award.mediaUrl || "https://via.placeholder.com/400x300?text=Certificate"} className={`w-full h-auto object-contain grayscale transition-all duration-700 hover:grayscale-0 ${isBrutal ? getRadiusClass(false) : ''}`} alt="Certificate" />
                      </div>
                      
                      <div className={`flex flex-col justify-center text-[10px] ${res('md:text-xs')} mt-2 ${res('sm:mt-0')} transition-all duration-700 custom-body`}>
                          <p className={`font-bold uppercase mb-1.5 ${res('md:mb-2')} transition-colors duration-700 ${isBrutal ? 'text-black' : 'text-slate-500'}`}>&gt; STATUS: {award.status || 'VERIFIED'}</p>
                          <p className={`text-gray-600 leading-relaxed line-clamp-4 ${res('sm:line-clamp-3 md:line-clamp-none')} max-w-xl mb-4`}>{award.description || 'Sertifikasi dan pencapaian terverifikasi.'}</p>
                          
                          <a href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors w-max relative group/btn ${isBrutal ? 'text-white bg-black px-4 py-2 hover:bg-[#ff9e00] hover:text-black border-2 border-black' : 'text-black hover:text-gray-500'}`}>
                            Lihat Lampiran <i className="fas fa-arrow-right group-hover/btn:translate-x-1 transition-transform"></i>
                            {!isBrutal && <span className="absolute bottom-[-4px] left-0 w-0 h-px bg-black transition-all duration-300 group-hover/btn:w-full"></span>}
                          </a>
                      </div>

                  </div>
              </div>
          </div>
        )) : <div className={`p-8 ${res('md:p-12')} text-center font-bold text-gray-400 text-[10px] ${res('md:text-[11px]')} uppercase transition-all duration-700 ${isBrutal ? 'font-mono border-b-[3px] border-black text-slate-900' : 'font-sans'}`}>NO AWARDS RECORDED.</div>}
      </div>

      <footer className={`p-5 ${res('sm:p-6 md:p-8')} font-bold uppercase flex flex-col ${res('sm:flex-row')} justify-between items-center gap-3 ${res('sm:gap-4')} transition-all duration-700 custom-body ${isBrutal ? `bg-gray-100 text-slate-900 font-mono text-[9px] ${res('md:text-[10px]')}` : `bg-slate-900 text-white text-[9px] ${res('md:text-[10px]')} mt-4 ${res('sm:mt-6 sm:'+getRadiusClass(true)+' sm:rounded-t-none')}`}`}>
          <div className={`flex gap-3 ${res('sm:gap-4')} flex-wrap justify-center`}>
            {links.length > 0 ? links.map((l: any, i: number) => {
              const isDarkAccent = themeColor === '#000000' || themeColor === '#0f172a';
              const linkColor = isBrutal ? '' : (isDarkAccent ? '#ffffff' : themeColor);
              return (
                <React.Fragment key={i}>
                  <a href={l.url} target="_blank" rel="noreferrer" className="cursor-pointer hover:underline transition-colors duration-300" style={{ color: linkColor }}>{l.platform}</a>
                  {i !== links.length - 1 && <span className="opacity-50">/</span>}
                </React.Fragment>
              );
            }) : <span>NO LINKS ADDED</span>}
          </div>
          <span className="opacity-80">© 2026 {fullName}.SYS</span>
      </footer>
    </div>
  );
}