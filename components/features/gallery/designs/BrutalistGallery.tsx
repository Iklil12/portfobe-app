import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Film, ArrowUpRight } from 'lucide-react';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { GalleryLayoutProps } from './types';

export default function BrutalistGallery({
  projects,
  subdomain,
  isEditor,
  customTexts,
  setActiveProject,
  getLayoutParts,
  premiumEase,
  profile,
  links,
  email
}: GalleryLayoutProps) {
  const router = useRouter();

  return (
    <div className="relative z-10 flex flex-col font-gallery-sans">
      {/* Marquee sliding ribbon header */}
      <div className="w-full bg-[#ff9e00] text-black border-y-[3px] border-white py-3.5 overflow-hidden flex whitespace-nowrap font-gallery-mono font-black uppercase tracking-widest text-xs z-30 shrink-0 mt-20">
        <div className={`animate-marquee flex gap-16 shrink-0 ${isEditor ? '[animation-play-state:paused]' : ''}`}>
          <span>
            <EditableText 
              value={customTexts?.brutalistMarquee || 'RAW VISUAL ARCHIVE'} 
              field="brutalistMarquee" 
              entity="appearance" 
              isEditor={isEditor} 
              maxLength={50} 
              as="span"
            />{' '}
            // {subdomain.toUpperCase()}
          </span>
          <span>{customTexts?.brutalistMarquee || 'RAW VISUAL ARCHIVE'} // {subdomain.toUpperCase()}</span>
          <span>{customTexts?.brutalistMarquee || 'RAW VISUAL ARCHIVE'} // {subdomain.toUpperCase()}</span>
        </div>
        <div className={`animate-marquee flex gap-16 shrink-0 ${isEditor ? '[animation-play-state:paused]' : ''}`} aria-hidden="true">
          <span>{customTexts?.brutalistMarquee || 'RAW VISUAL ARCHIVE'} // {subdomain.toUpperCase()}</span>
          <span>{customTexts?.brutalistMarquee || 'RAW VISUAL ARCHIVE'} // {subdomain.toUpperCase()}</span>
          <span>{customTexts?.brutalistMarquee || 'RAW VISUAL ARCHIVE'} // {subdomain.toUpperCase()}</span>
        </div>
      </div>

      {/* Brutalist Bold Banner */}
      <section className="pt-24 pb-16 px-6 md:px-12 lg:px-24 flex justify-start">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: premiumEase }}
          className="max-w-4xl w-full text-left relative"
        >
          <div className="inline-block bg-[#ff9e00] text-black text-[10px] font-gallery-mono font-black uppercase px-3.5 py-1.5 border-[3px] border-white mb-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <EditableText 
              value={customTexts?.brutalistSticker || 'KARYA PILIHAN // ARCHIVE'} 
              field="brutalistSticker" 
              entity="appearance" 
              isEditor={isEditor} 
              maxLength={40} 
              as="span"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-gallery-display font-black uppercase tracking-tighter leading-[0.85] text-white mb-8">
            <EditableText 
              value={customTexts?.brutalistTitleFirst || 'CREATIVE'} 
              field="brutalistTitleFirst" 
              entity="appearance" 
              isEditor={isEditor} 
              maxLength={20} 
              as="span"
            />
            <br/>
            <span className="bg-white text-black px-4 py-1.5 inline-block border-[5px] border-[#ff9e00] shadow-[6px_6px_0px_0px_#ffffff] mt-2">
              <EditableText 
                value={customTexts?.brutalistTitleSecond || 'MANIFESTO.'} 
                field="brutalistTitleSecond" 
                entity="appearance" 
                isEditor={isEditor} 
                maxLength={20} 
                as="span"
              />
            </span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-[3px] border-white max-w-md mt-12 shadow-[5px_5px_0px_0px_#ff9e00] font-gallery-mono">
            <div className="p-4 border-b-[3px] md:border-b-0 md:border-r-[3px] border-white bg-[#ff9e00] text-black flex flex-col justify-center">
              <span className="text-[9px] font-black uppercase tracking-widest text-black/50">
                <EditableText 
                  value={customTexts?.brutalistNodeLabel || 'CREATOR NODE'} 
                  field="brutalistNodeLabel" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={30} 
                  as="span"
                />
              </span>
              <span className="text-base font-black uppercase tracking-tight">{subdomain}</span>
            </div>
            <div className="p-4 bg-black text-white flex flex-col justify-center">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                <EditableText 
                  value={customTexts?.brutalistIndexLabel || 'TOTAL INDEX'} 
                  field="brutalistIndexLabel" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={30} 
                  as="span"
                />
              </span>
              <span className="text-base font-black uppercase tracking-tight">{projects.length} RECORDS</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Connected Grid */}
      <section className="px-6 md:px-12 lg:px-24 pb-40">
        {projects.length === 0 ? (
          <div className="w-full py-40 flex flex-col items-center justify-center text-center border-4 border-white bg-black">
            <p className="font-gallery-mono uppercase tracking-[0.3em] text-xs text-white/50 animate-pulse">NO ENTRIES IN MANIFEST.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {projects.map((project, index) => {
              const isVideo = project.projectType === 'video';
              const thumbnailUrl = isVideo ? getVideoThumbnail(project.mediaUrl) : project.mediaUrl;
              const { spanClass, aspectClass } = getLayoutParts(index);
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveProject(project);
                  }}
                  className={`group relative flex flex-col cursor-pointer ${spanClass}`}
                >
                  <div className="w-full h-full flex flex-col group text-left bg-black border-[3px] border-white shadow-[6px_6px_0px_0px_#ff9e00] hover:shadow-[10px_10px_0px_0px_#ffffff] hover:-translate-x-1 hover:-translate-y-1 hover:rotate-[0.5deg] transition-all duration-200">
                    {/* Image section wrapper that dynamically controls aspect ratio height */}
                    <div className={`relative w-full overflow-hidden border-b-[3px] border-white bg-zinc-950 shrink-0 ${aspectClass}`}>
                      <LazyImage 
                        src={thumbnailUrl} 
                        alt={project.title}
                        className={`w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${aspectClass.includes('aspect-auto') ? 'h-auto relative' : 'h-full absolute inset-0'}`}
                      />
                      
                      {/* Hard sticker tag */}
                      <div className="absolute top-3 left-3 bg-black border-2 border-white text-white text-[9px] font-gallery-mono font-black uppercase px-2 py-0.5 shadow-[2px_2px_0px_0px_#ff9e00] z-20">
                        {isVideo ? 'FILM' : 'STILL'}
                      </div>

                      {/* Floating label inside the image overlay (immune to aspect ratio overflow!) */}
                      <div className="absolute bottom-3 left-3 right-3 bg-white border-2 border-black p-2.5 text-black flex items-center justify-between shadow-[3px_3px_0px_0px_#000000] group-hover:bg-[#ff9e00] transition-all duration-300 z-20">
                        <div className="min-w-0 pr-2">
                          <span className="text-[8px] font-gallery-mono font-black uppercase text-[#ff9e00] tracking-wider block mb-0.5 leading-none">
                            {isVideo ? 'PLAY FILM' : 'IMAGE STILL'}
                          </span>
                          <h3 className="text-xs md:text-sm font-gallery-display font-black uppercase tracking-tight text-black truncate leading-tight">
                            {project.title}
                          </h3>
                        </div>
                        <div className="w-6 h-6 border-2 border-black flex items-center justify-center bg-black text-white shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
      {/* Brutalist Footer */}
      {(() => {
        const contactUrl = profile?.whatsapp ? `https://wa.me/${profile.whatsapp}` : (email ? `mailto:${email}` : '#');
        const displayLinks = links && links.length > 0 ? links : [
          { platform: 'GITHUB', url: '#' },
          { platform: 'WHATSAPP', url: '#' },
          { platform: 'LINKEDIN', url: '#' }
        ];

        return (
          <footer className="w-full bg-black border-t-[4px] border-white pt-24 pb-12 mt-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
              <span className="bg-[#ff9e00] text-black px-4 py-1.5 border-2 border-white font-gallery-mono font-black text-xs uppercase tracking-widest mb-8 inline-block shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <EditableText 
                  value={customTexts?.brutalistFooterSub || '[ STATUS: AVAILABLE ]'} 
                  field="brutalistFooterSub" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={30} 
                  as="span"
                />
              </span>
              
              <a 
                href={contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-gallery-display font-black text-5xl md:text-7xl lg:text-8xl text-black bg-white border-[4px] border-white px-8 py-5 uppercase tracking-tighter shadow-[8px_8px_0px_0px_rgba(255,158,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(255,158,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[4px_4px_0px_0px_rgba(255,158,0,1)] transition-all duration-150 mb-20 inline-block"
              >
                <EditableText 
                  value={customTexts?.brutalistFooterCta || 'TALK TO ME!'} 
                  field="brutalistFooterCta" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={30} 
                  as="span"
                />
              </a>

              <div className="w-full border-t-[2px] border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 font-gallery-mono font-bold text-white uppercase text-[11px] tracking-wider">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-white text-black border-2 border-[#ff9e00] flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                    {subdomain[0].toUpperCase()}
                  </span>
                  <span>
                    © {new Date().getFullYear()} {subdomain} //{" "}
                    <EditableText 
                      value={customTexts?.brutalistFooterExtra || 'ALL RIGHTS RESERVED'} 
                      field="brutalistFooterExtra" 
                      entity="appearance" 
                      isEditor={isEditor} 
                      maxLength={40} 
                      as="span"
                    />
                  </span>
                </div>
                
                <div className="flex items-center gap-6">
                  {displayLinks.map((link: any, idx: number) => (
                    <a 
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#ff9e00] transition-colors border-b-2 border-transparent hover:border-[#ff9e00] pb-0.5"
                    >
                      {link.platform.toUpperCase()}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        );
      })()}
    </div>
  );
}
