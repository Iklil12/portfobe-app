// File: components/PortfolioView.tsx
"use client";

import React, { useState } from 'react';

// TAMBAHAN: Kita menambahkan prop isMobileView
export default function PortfolioView({ data, theme, isMobileView = false }: { data: any, theme: any, isMobileView?: boolean }) {
  const [openAward, setOpenAward] = useState<string | null>(null);

  // FUNGSI PINTAR: Jika isMobileView aktif, buang semua kelas desktop (sm, md, lg)
  const res = (desktopClasses: string) => isMobileView ? '' : desktopClasses;

  const themeColor = theme?.themeColor || "#000000";
  const fontHeading = theme?.fontHeading || "Space Mono";
  const fontBody = theme?.fontBody || "Inter";
  const cardStyle = theme?.cardStyle || "hard-shadow";
  const buttonShape = theme?.buttonShape || "hard";

  const fullName = data?.fullName || "Nama Anda";
  const profession = data?.profession || "Visual Architect";
  const bio = data?.bio || "Telling stories through motion. Based in Indonesia, operating globally.";
  const subdomain = data?.subdomain || "username";

  const projects = data?.user?.projects || data?.projects || [];
  const links = data?.user?.links?.filter((l: any) => l.isActive) || data?.links?.filter((l: any) => l.isActive) || [];

  const awardKeywords = ['award', 'certificate', 'sertifikat', 'penghargaan', 'honor'];
  const isAward = (type: string) => type ? awardKeywords.some(k => type.toLowerCase().includes(k)) : false;

  const archiveItems = projects.filter((p: any) => !isAward(p.projectType));
  const awardItems = projects.filter((p: any) => isAward(p.projectType));

  const rawAvatar = data?.avatarUrl || data?.user?.avatar || "";
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

  return (
    <div className={`w-full max-w-5xl mx-auto bg-white relative z-10 flex flex-col min-h-screen ${res('sm:min-h-0')} transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
      ${isBrutal ? `border-x-0 border-y-0 border-black ${res('sm:border-x-[3px] sm:border-y-[3px] sm:preview-hard-shadow')}` : `border-x-0 border-slate-200 ${res(`sm:border-x ${cardStyle==='soft-shadow'?'sm:shadow-[0_20px_50px_rgba(0,0,0,0.1)]':''} sm:${getRadiusClass(true)}`)}`}
    `}>
      <style dangerouslySetInnerHTML={{__html: `
        .preview-border { border-color: ${themeColor} !important; transition: border-color 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
        .preview-hard-shadow { box-shadow: 10px 10px 0px 0px ${themeColor}; transition: box-shadow 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
        .preview-hard-shadow-sm { box-shadow: 4px 4px 0px 0px ${themeColor}; transition: box-shadow 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
      `}} />

      <header className={`flex text-[10px] ${res('md:text-xs')} uppercase font-bold sticky top-0 z-[100] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] bg-white/95 backdrop-blur-md
        ${isBrutal ? 'border-b-[3px] border-black divide-x-[3px] divide-black font-mono' : `border-b border-slate-100 font-sans shadow-sm ${res(`sm:${getRadiusClass(true)} sm:rounded-b-none`)}`}
      `}>
          <div className={`p-4 ${res('md:p-5')} flex-1 flex justify-between items-center transition-colors duration-700 ${isBrutal ? 'bg-black text-white' : 'text-slate-900'}`}>
              <span className={`transition-all duration-700 ${fontHeading === 'Space Mono' ? 'font-space' : 'font-sans'}`}>{fullName}( )</span>
              <span className="animate-pulse transition-colors duration-700" style={{ color: isBrutal ? '#fff' : themeColor }}>● REC</span>
          </div>
          <div className={`hidden ${res('sm:flex')} p-4 md:p-5 w-24 md:w-32 items-center justify-center text-center hover:bg-gray-100 transition-colors duration-300`}>
              <a href="#archive">Archive</a>
          </div>
          <a href={links.length > 0 ? links[0].url : "mailto:hello@example.com"} target="_blank" rel="noreferrer" className={`p-4 ${res('md:p-5 w-24 md:w-32')} text-center cursor-pointer flex items-center justify-center transition-all duration-700 ease-out ${isBrutal ? 'bg-gray-100 hover:bg-black hover:text-white' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md'} ${buttonShape !== 'hard' && !isBrutal ? getRadiusClass(false) + res(' mx-3 my-2') : ''}`}>
              Contact
          </a>
      </header>

      <section className={`grid grid-cols-1 ${res('md:grid-cols-12')} transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isBrutal ? 'border-b-[3px] border-black' : `mb-8 ${res('md:mb-14')} mt-2 ${res('md:mt-8')}`}`}>
          <div className={`col-span-1 ${res('md:col-span-8')} p-6 ${res('sm:p-8 md:p-12 lg:p-16')} flex flex-col justify-center relative overflow-hidden transition-all duration-700
            ${isBrutal ? `border-b-[3px] ${res('md:border-b-0 md:border-r-[3px]')} border-black bg-slate-50` : 'bg-white'}
          `}>
              {isBrutal && <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>}
              {isBrutal && (
                <div className={`inline-block border-[2px] border-black px-3 py-1 mb-4 ${res('md:mb-8')} w-max font-mono text-[9px] ${res('md:text-[10px]')} font-bold uppercase bg-white preview-hard-shadow-sm relative z-10 transition-all duration-700 ${getRadiusClass(false)}`}>
                    ID: {subdomain?.toUpperCase() || 'USER'}-V1
                </div>
              )}
              <h1 className={`text-4xl ${res('sm:text-5xl md:text-6xl lg:text-7xl')} font-black uppercase leading-[0.9] tracking-tighter mb-4 ${res('md:mb-6')} relative z-10 transition-all duration-700 ${fontHeading === 'Space Mono' ? 'font-space' : fontHeading === 'serif' ? 'font-serif' : 'font-sans'}`}>
                  {profession ? profession.split(' ').map((w:any, i:any) => <React.Fragment key={i}>{w}<br/></React.Fragment>) : 'Visual Architect'}
              </h1>
              <p className={`text-[10px] ${res('md:text-[11px]')} max-w-[280px] ${res('sm:max-w-xs md:max-w-md')} opacity-80 relative z-10 leading-relaxed transition-all duration-700 ${fontBody === 'Space Mono' ? 'font-space uppercase font-bold' : 'font-sans'} ${isBrutal ? `border-l-[2px] ${res('md:border-l-[3px]')} border-black pl-3 ${res('md:pl-5')} bg-white/50 backdrop-blur-sm p-2 ${res('md:p-3')}` : 'text-slate-500'}`}>
                  {bio}
              </p>
          </div>
          <div className={`col-span-1 ${res('md:col-span-4')} p-8 ${res('md:p-12')} flex items-center justify-center relative transition-colors duration-700 ${isBrutal ? 'bg-gray-100' : 'bg-white'}`}>
              {isBrutal && (
                <div className={`hidden ${res('md:block')} absolute inset-0 pointer-events-none`}>
                  <div className="absolute top-4 left-4 w-3 h-3 border-t-[2px] border-l-[2px] border-black"></div>
                  <div className="absolute top-4 right-4 w-3 h-3 border-t-[2px] border-r-[2px] border-black"></div>
                  <div className="absolute bottom-4 left-4 w-3 h-3 border-b-[2px] border-l-[2px] border-black"></div>
                  <div className="absolute bottom-4 right-4 w-3 h-3 border-b-[2px] border-r-[2px] border-black"></div>
                </div>
              )}
              <div className={`w-full max-w-[160px] ${res('sm:max-w-[200px] md:max-w-[240px]')} aspect-[3/4] overflow-hidden transition-all duration-700 mx-auto ${isBrutal ? `border-[2px] ${res('md:border-[3px]')} border-black preview-hard-shadow-sm p-1.5 ${res('md:p-2')} bg-white ${getRadiusClass(true)}` : getCardClass() + ' ' + getRadiusClass(true)}`}>
                  <img src={displayAvatar} className={`w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0 ${isBrutal ? getRadiusClass(false) : ''}`} alt="Profile" />
              </div>
          </div>
      </section>

      <section id="archive">
        <div className={`p-4 ${res('md:p-6')} font-bold uppercase flex justify-between transition-all duration-700 ${isBrutal ? `border-b-[3px] border-black bg-gray-100 font-mono text-[10px] ${res('md:text-xs')}` : `bg-white font-sans text-xs ${res('md:text-sm')} text-slate-800 px-6 ${res('sm:px-8')} mt-4`}`}>
            <span>{isBrutal ? '[ Selected Archive ]' : 'Selected Archive'}</span>
            {isBrutal && <span>Vol. 1</span>}
        </div>
        <div className={`grid grid-cols-1 ${res('md:grid-cols-2')} transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isBrutal ? `divide-y-[3px] ${res('md:divide-y-0 md:divide-x-[3px]')} divide-black border-b-[3px] border-black` : `gap-4 ${res('sm:gap-6')} p-4 ${res('sm:p-8')} bg-slate-50 border-b border-slate-100`}`}>
            {archiveItems.length > 0 ? archiveItems.map((p: any, i: number) => (
              <a href={p.url || '#'} target={p.url ? "_blank" : "_self"} key={i} className={`group cursor-pointer overflow-hidden transition-all duration-700 block ${isBrutal ? `border-b-[3px] ${res('md:border-b-0')} border-black last:border-b-0` : getCardClass() + ' ' + getRadiusClass(true)}`}>
                  <div className={`p-3 ${res('md:p-5')} flex justify-between font-bold transition-all duration-700 ${isBrutal ? `border-b-[2px] border-black bg-white group-hover:bg-black group-hover:text-white font-mono text-[9px] ${res('md:text-[10px]')}` : `bg-slate-50 text-slate-500 font-sans text-[10px] ${res('md:text-xs')} border-b border-slate-100`}`}>
                    <span style={{ color: !isBrutal ? themeColor : '' }}>{p.projectType?.toUpperCase() || 'PROJECT'}</span>
                    <span>0{i+1}</span>
                  </div>
                  <div className={`aspect-video bg-gray-200 overflow-hidden transition-all duration-700 ${isBrutal ? 'border-b-[2px] border-black' : ''}`}>
                    <img src={p.mediaUrl || "https://via.placeholder.com/800x600?text=No+Image"} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                  </div>
                  <div className={`p-5 ${res('md:p-8')} bg-white transition-all duration-700 ${fontHeading === 'Space Mono' ? 'font-space uppercase' : 'font-sans'}`}>
                    <h3 className={`text-lg ${res('md:text-2xl')} font-black tracking-tighter mb-1 truncate`}>{p.title}</h3>
                    <p className={`transition-all duration-700 text-gray-500 truncate ${fontBody === 'Space Mono' ? `font-space text-[9px] ${res('md:text-[10px]')}` : `font-sans text-[10px] ${res('md:text-xs')}`}`}>{p.description || 'View Details'}</p>
                  </div>
              </a>
            )) : <div className={`p-10 ${res('md:p-16')} text-center col-span-2 opacity-30 font-mono text-[10px] ${res('md:text-xs')} uppercase`}>NO ARCHIVE DATA FOUND.</div>}
        </div>
      </section>

      <div className={`p-4 ${res('md:p-6')} font-bold uppercase transition-all duration-700 ${isBrutal ? `border-b-[3px] border-black bg-black text-white font-mono text-[10px] ${res('md:text-xs')}` : `bg-white font-sans text-xs ${res('md:text-sm')} text-slate-800 px-6 ${res('sm:px-8')} mt-8 mb-4`}`}>
          {isBrutal ? '[ Honors_And_Awards.sys ]' : 'Honors & Awards'}
      </div>
      <div className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isBrutal ? 'bg-white' : `px-4 ${res('sm:px-8')} pb-8 bg-white`}`}>
        {awardItems.length > 0 ? awardItems.map((award: any) => (
          <div key={award.id} className={`flex flex-col transition-all duration-700 overflow-hidden ${isBrutal ? 'border-b-[3px] border-black' : `mb-3 ${res('sm:mb-4')} ` + getCardClass() + ' ' + getRadiusClass(true)}`}>
              <div className={`p-4 ${res('sm:p-5 md:p-6')} flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors duration-300 ${!isBrutal && openAward === award.id ? 'border-b border-slate-100' : ''}`} onClick={() => setOpenAward(openAward === award.id ? null : award.id)}>
                  <div className={`flex items-center gap-3 ${res('sm:gap-4 md:gap-6')} overflow-hidden`}>
                      <span className={`font-bold w-6 ${res('sm:w-8 md:w-12')} shrink-0 whitespace-nowrap text-center transition-all duration-700 ${fontHeading === 'Space Mono' ? `font-space text-xs ${res('md:text-sm')}` : `font-sans text-sm ${res('md:text-base')}`} ${!isBrutal && 'text-slate-400'}`}>
                        {openAward === award.id ? '[ - ]' : '[ + ]'}
                      </span>
                      <h3 className={`text-sm ${res('sm:text-base md:text-xl lg:text-2xl')} font-black tracking-tighter truncate max-w-[150px] ${res('sm:max-w-[250px] md:max-w-[400px]')} transition-all duration-700 ${fontHeading === 'Space Mono' ? 'font-space uppercase' : 'font-sans'}`}>{award.title}</h3>
                  </div>
                  <span className={`text-[8px] ${res('sm:text-[9px] md:text-[10px]')} font-bold uppercase text-right shrink-0 whitespace-nowrap ml-2 ${res('md:ml-4')} transition-all duration-700 ${fontBody === 'Space Mono' ? 'font-space' : 'font-sans text-slate-400'}`}>
                    {award.projectType || 'ACHIEVEMENT'} <br className={res('sm:hidden')} /> <span className={`hidden ${res('sm:inline')}`}>/</span> {new Date(award.createdAt).getFullYear()}
                  </span>
              </div>
              <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] bg-gray-50 ${openAward === award.id ? `max-h-[600px] ${res('md:max-h-[800px]')}` : 'max-h-0'}`}>
                  <div className={`p-4 ${res('sm:p-5 md:p-8')} flex flex-col ${res('sm:flex-row')} gap-4 ${res('sm:gap-6 md:gap-8')} transition-all duration-700 ${isBrutal ? 'border-t-[3px] border-black' : ''}`}>
                      <div className={`w-full ${res('sm:w-48 md:w-64')} shrink-0 aspect-video bg-white p-1.5 ${res('sm:p-2')} transition-all duration-700 ${isBrutal ? `border-[2px] border-black preview-hard-shadow-sm ${getRadiusClass(false)}` : `rounded-xl shadow-sm border border-slate-200 overflow-hidden ${getRadiusClass(false)}`}`}>
                          <img src={award.mediaUrl || "https://via.placeholder.com/400x300?text=Certificate"} className={`w-full h-full object-cover grayscale transition-all duration-700 ${isBrutal ? getRadiusClass(false) : ''}`} alt="Certificate" />
                      </div>
                      <div className={`flex flex-col justify-center text-[10px] ${res('md:text-xs')} mt-2 ${res('sm:mt-0')} transition-all duration-700 ${fontBody === 'Space Mono' ? 'font-space' : 'font-sans'}`}>
                          <p className={`font-bold uppercase mb-1.5 ${res('md:mb-2')} transition-colors duration-700 ${isBrutal ? 'text-black' : 'text-slate-500'}`}>&gt; STATUS: VERIFIED</p>
                          <p className={`text-gray-600 leading-relaxed line-clamp-4 ${res('sm:line-clamp-3 md:line-clamp-none')} max-w-xl`}>{award.description || 'Sertifikasi dan pencapaian terverifikasi.'}</p>
                      </div>
                  </div>
              </div>
          </div>
        )) : <div className={`p-8 ${res('md:p-12')} text-center font-bold text-gray-400 text-[10px] ${res('md:text-[11px]')} uppercase transition-all duration-700 ${isBrutal ? 'font-mono border-b-[3px] border-black' : 'font-sans'}`}>NO AWARDS RECORDED.</div>}
      </div>

      <footer className={`p-5 ${res('sm:p-6 md:p-8')} font-bold uppercase flex flex-col ${res('sm:flex-row')} justify-between items-center gap-3 ${res('sm:gap-4')} transition-all duration-700 ${isBrutal ? `bg-gray-100 font-mono text-[9px] ${res('md:text-[10px]')}` : `bg-slate-900 text-white font-sans text-[9px] ${res('md:text-[10px]')} mt-4 ${res('sm:mt-6 sm:'+getRadiusClass(true)+' sm:rounded-t-none')}`}`}>
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