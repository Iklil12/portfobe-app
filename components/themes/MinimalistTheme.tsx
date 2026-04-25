"use client";

import React, { useState } from 'react';

const getYouTubeThumbnail = (url: string) => {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : url;
};

export default function MinimalistTheme({ data, theme, isMobileView = false }: { data: any, theme: any, isMobileView?: boolean }) {
  const [openAward, setOpenAward] = useState<string | null>(null);

  // --- MENGAMBIL DATA IDENTITAS (Dari tabel Profile yang sudah dipisah) ---
  const fullName = data?.profile?.fullName || data?.fullName || "Jamal Arifin";
  const profession = data?.profile?.profession || data?.profession || "Director & Editor";
  const bio = data?.profile?.bio || data?.bio || "A visual storyteller based in Jakarta. I craft meticulous, high-end visual narratives for commercial brands and independent films.";
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  
  // --- MENGAMBIL EMAIL USER (Langsung dari tabel User) ---
  const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.co`;

  // --- MENGAMBIL DATA RELASI (Project, Sertifikat, Link) ---
  const archiveItems = data?.projects || data?.user?.projects || [];
  const awardItems = data?.certificates || data?.user?.certificates || [];
  const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

  const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
  const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
  const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop`;

  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  const getFontFamily = (fontName: string) => {
    if (!fontName) return "'Inter', sans-serif";
    if (fontName.toLowerCase().includes('space') || fontName.toLowerCase().includes('mono')) return "'Space Mono', monospace";
    if (fontName.toLowerCase().includes('serif') || fontName.toLowerCase().includes('elegant')) return "'Playfair Display', serif";
    return "'Inter', sans-serif"; 
  };
  
  // --- MENGAMBIL DATA TEMA (Dari tabel SiteAppearance) ---
  const headingFont = getFontFamily(theme?.fontHeading);
  const bodyFont = getFontFamily(theme?.fontBody);

  return (
    <div className={`flex w-full min-h-screen bg-white text-black relative min-body ${isMobileView ? 'flex-col' : 'flex-col lg:flex-row'}`}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap');
        
        .min-heading { font-family: ${headingFont} !important; }
        .min-body { font-family: ${bodyFont} !important; }
        
        /* Scrollbar Minimalis & Profesional */
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
        * { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }

        ::selection { background: #000000; color: #ffffff; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* --- KIRI: SIDEBAR --- */}
      <aside className={`bg-gray-50 border-gray-200 p-8 flex flex-col justify-between z-10 overflow-y-auto hide-scrollbar ${isMobileView ? 'w-full relative h-auto border-b' : 'w-full lg:w-[35%] lg:sticky lg:top-0 lg:h-screen lg:border-r lg:p-12'}`}>
        <div>
          <div className="flex justify-between items-start mb-10">
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none min-heading">
              {firstName}<br/>{lastName || '.'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Available</span>
            </div>
          </div>
          
          <div className="w-full aspect-[4/5] overflow-hidden mb-8 border border-gray-200">
            <img src={displayAvatar} alt={fullName} className="w-full h-full object-cover grayscale" />
          </div>

          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3 min-heading">{profession}</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6 min-body">{bio}</p>
          
          <ul className="text-xs font-mono text-gray-500 space-y-1 mb-8 opacity-80">
            <li>→ Minimalist Layout</li>
            <li>→ Clean Typography</li>
            <li>→ High-end Visuals</li>
          </ul>
        </div>

        <div className={`pt-8 border-t border-gray-200 ${isMobileView ? 'mt-4' : 'mt-8'}`}>
          <a href={`mailto:${userEmail}`} className="block text-xl font-bold tracking-tight hover:text-gray-500 transition mb-6 truncate min-heading">
            {userEmail}
          </a>
          <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest">
            {links.map((l: any, i: number) => (
              <a key={i} href={l.url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-black transition relative inline-block group">
                {l.platform}
                <span className="absolute bottom-[-2px] left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
        </div>
      </aside>

      {/* --- KANAN: MAIN CONTENT --- */}
      <main className={`bg-white ${isMobileView ? 'w-full' : 'w-full lg:w-[65%]'}`}>
        
        <section className="border-b border-gray-200">
          <div className="grid grid-cols-2 border-b border-gray-200">
            <div className="p-8 border-r border-gray-200 flex flex-col justify-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Projects</p>
              <p className={`text-3xl ${isMobileView ? '' : 'md:text-4xl'} font-black tracking-tighter min-heading`}>{archiveItems.length} Total</p>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Recognition</p>
              <p className={`text-3xl ${isMobileView ? '' : 'md:text-4xl'} font-black tracking-tighter min-heading`}>{awardItems.length} Awards</p>
            </div>
          </div>
        </section>

        <section className={`p-8 ${isMobileView ? '' : 'lg:p-12'}`}>
          <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter min-heading">Selected Index</h2>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Archive</span>
          </div>

          <div className={`grid grid-cols-1 gap-8 ${isMobileView ? '' : 'md:grid-cols-2'}`}>
            {archiveItems.map((p: any, i: number) => (
              <a href={p.mediaUrl || '#'} target="_blank" rel="noreferrer" key={i} className="group cursor-pointer block">
                <div className="w-full aspect-[4/3] bg-gray-100 mb-4 border border-gray-200 overflow-hidden relative">
                  <img src={p.projectType === 'video' ? getYouTubeThumbnail(p.mediaUrl) : p.mediaUrl} className="w-full h-full object-cover transition-all duration-700 ease-out grayscale group-hover:grayscale-0 group-hover:scale-105" />
                  
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white flex items-center justify-center rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                      <i className={`fas ${p.projectType === 'video' ? 'fa-play ml-1' : 'fa-arrow-right -rotate-45'} text-black`}></i>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-start mt-4">
                  <div>
                    <h3 className="text-base font-bold tracking-tight mb-1 min-heading">{p.title}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{p.projectType}</p>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 pt-1">0{i+1}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="border-t border-gray-200 bg-gray-50/30">
          <div className={`p-8 ${isMobileView ? '' : 'lg:p-12'} pb-6`}>
            <h2 className="text-2xl font-black uppercase tracking-tighter min-heading">Honors & Awards</h2>
          </div>
          
          <div className="border-t border-gray-200">
            {awardItems.length > 0 ? awardItems.map((award: any, i: number) => {
              const isOpen = openAward === award.id;
              return (
                <div key={i} className="border-b border-gray-200 group">
                  <div 
                    className={`px-8 ${isMobileView ? '' : 'lg:px-12'} py-6 flex justify-between items-center cursor-pointer transition-colors duration-300 group-hover:bg-gray-50 ${isOpen ? 'bg-gray-50' : 'bg-white'}`}
                    onClick={() => setOpenAward(isOpen ? null : award.id)}
                  >
                    <div className="flex items-center gap-4 md:gap-8 w-2/3">
                      <span className={`font-mono text-[10px] text-gray-400 ${isMobileView ? 'hidden' : 'md:block'}`}>
                        {award.year || new Date(award.createdAt).getFullYear()}
                      </span>
                      <h3 className="text-sm md:text-lg font-bold tracking-tight min-heading">{award.title}</h3>
                    </div>
                    <div className="flex items-center justify-end gap-6 w-1/3">
                      <span className={`text-[10px] font-bold uppercase tracking-widest text-gray-500 ${isMobileView ? 'hidden' : 'md:block'} text-right truncate`}>{award.issuer}</span>
                      <i className={`fas fa-chevron-down text-[10px] text-gray-400 transition-transform duration-500 ${isOpen ? 'rotate-180 text-black' : ''}`}></i>
                    </div>
                  </div>
                  
                  <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] bg-gray-50 ${isOpen ? 'max-h-[800px] border-t border-gray-200' : 'max-h-0'}`}>
                    <div className={`px-8 ${isMobileView ? '' : 'lg:px-12'} py-8 flex gap-8 ${isMobileView ? 'flex-col' : 'flex-col md:flex-row'}`}>
                      {/* --- PERBAIKAN UTAMA: Menggunakan object-contain dan membebaskan h-auto pada mobile agar tidak terpotong --- */}
                      <div className={`bg-white border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center ${isMobileView ? 'w-full' : 'w-full md:w-64'}`}>
                        <img 
                          src={award.mediaUrl} 
                          className={`w-full h-auto object-contain grayscale hover:grayscale-0 transition-all duration-500`} 
                          alt="Certificate"
                        />
                      </div>
                      
                      <div className="flex flex-col justify-center flex-1">
                        <p className="font-bold mb-2 min-heading text-sm uppercase tracking-wider">{award.status || 'Verified Achievement'}</p>
                        <p className="text-xs text-gray-600 max-w-md leading-relaxed mb-6 opacity-90 min-body">{award.description || 'Awarded for exceptional performance and dedication in the respective field.'}</p>
                        
                        <a href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:text-gray-500 transition-colors w-max relative group/btn">
                          Lihat Lampiran <i className="fas fa-arrow-right group-hover/btn:translate-x-1 transition-transform"></i>
                          <span className="absolute bottom-[-4px] left-0 w-0 h-px bg-black transition-all duration-300 group-hover/btn:w-full"></span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }) : <div className="px-8 py-10 text-gray-400 text-sm font-mono border-b border-gray-200 text-center">No awards recorded.</div>}
          </div>
        </section>

        <footer className={`p-8 text-center flex gap-4 bg-gray-100 border-t border-gray-200 min-body ${isMobileView ? 'flex-col' : 'flex-col md:flex-row md:text-left justify-between lg:p-12'}`}>
          <p className="text-[10px] font-mono text-gray-500">© 2026 {fullName}. All Rights Reserved.</p>
          <span className="text-[10px] font-bold uppercase tracking-widest text-black min-heading">portfo.be/{subdomain}</span>
        </footer>

      </main>
    </div>
  );
}