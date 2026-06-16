import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Film, ArrowUpRight } from 'lucide-react';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { GalleryLayoutProps } from './types';

export default function ClassicGallery({
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
    <div className="relative z-10 font-gallery-sans">
      {/* Classic Hero */}
      <section className="pt-48 pb-20 px-6 md:px-12 lg:px-24 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: premiumEase }}
          className="max-w-4xl w-full flex flex-col items-center"
        >
          <span className="text-[10px] md:text-xs font-gallery-mono text-[#ff9e00] uppercase tracking-[0.3em] mb-6 block">
            <EditableText 
              value={customTexts?.classicSubtitle || '[ 01 ] Selected Works'} 
              field="classicSubtitle" 
              entity="appearance" 
              isEditor={isEditor} 
              maxLength={50} 
              as="span"
            />
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-gallery-serif italic font-light tracking-tight leading-[1.2] mb-10 text-white max-w-3xl text-center">
            <EditableText 
              value={customTexts?.classicTitle || 'Curated Visual Narratives.'} 
              field="classicTitle" 
              entity="appearance" 
              isEditor={isEditor} 
              maxLength={100} 
              as="span"
            />
          </h1>
          
          <div className="flex items-center gap-10 text-left bg-white/[0.02] border border-white/5 p-4 rounded-md">
            <div>
              <p className="text-[9px] font-gallery-mono text-white/40 uppercase tracking-widest mb-1">
                <EditableText 
                  value={customTexts?.classicCreatorLabel || 'Creator'} 
                  field="classicCreatorLabel" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={30} 
                  as="span"
                />
              </p>
              <p className="text-xs md:text-sm font-medium">{subdomain}</p>
            </div>
            <div className="w-px h-6 bg-white/10"></div>
            <div>
              <p className="text-[9px] font-gallery-mono text-white/40 uppercase tracking-widest mb-1">
                <EditableText 
                  value={customTexts?.classicAssetsLabel || 'Total Assets'} 
                  field="classicAssetsLabel" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={30} 
                  as="span"
                />
              </p>
              <p className="text-xs md:text-sm font-medium">{projects.length} Masterpieces</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Classic Grid */}
      <section className="px-6 md:px-12 lg:px-24 pb-40">
        {projects.length === 0 ? (
          <div className="w-full py-40 flex flex-col items-center justify-center text-center border border-white/5 bg-white/[0.01]">
            <p className="font-gallery-mono uppercase tracking-[0.3em] text-xs text-white/30 animate-pulse">The exhibition is currently empty.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: premiumEase, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-min items-start"
          >
            {projects.map((project, index) => {
              const isVideo = project.projectType === 'video';
              const thumbnailUrl = isVideo ? getVideoThumbnail(project.mediaUrl) : project.mediaUrl;
              const { spanClass, aspectClass } = getLayoutParts(index);
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, ease: premiumEase, delay: (index % 3) * 0.08 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveProject(project);
                  }}
                  className={`group relative flex flex-col cursor-pointer ${spanClass}`}
                >
                  <div className="w-full h-full flex flex-col">
                    <div className={`w-full relative overflow-hidden bg-[#111] rounded transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${aspectClass}`}>
                      <LazyImage 
                        src={thumbnailUrl} 
                        alt={project.title}
                        className={`w-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${aspectClass.includes('aspect-auto') ? 'h-auto relative' : 'h-full absolute inset-0'}`}
                      />
                      
                      {/* Clean category badge on image */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="text-[8px] font-gallery-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-black/60 border border-white/10 text-white/80">
                          {isVideo ? 'PLAY FILM' : 'STILL'}
                        </span>
                      </div>

                      {/* Arrow overlay */}
                      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center shadow-lg">
                          {isVideo ? <Film className="w-4.5 h-4.5" /> : <ArrowUpRight className="w-4.5 h-4.5" />}
                        </div>
                      </div>
                    </div>

                    {/* Clean Gallery Description Below Image */}
                    <div className="mt-4 pb-2 flex items-start justify-between text-left">
                      <div className="flex flex-col gap-1 max-w-[80%]">
                        <h3 className="text-sm md:text-base font-gallery-serif italic font-bold text-white tracking-tight leading-tight group-hover:text-[#ff9e00] transition-colors">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-white/40 text-[11px] font-gallery-sans line-clamp-2 mt-0.5 leading-relaxed">
                            {project.description}
                          </p>
                        )}
                      </div>
                      <span className="text-[9px] font-gallery-mono text-white/30 pt-1">
                        NO. {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>
      {/* Classic Footer */}
      {(() => {
        const contactUrl = profile?.whatsapp ? `https://wa.me/${profile.whatsapp}` : (email ? `mailto:${email}` : '#');
        const displayLinks = links && links.length > 0 ? links : [
          { platform: 'GITHUB', url: '#' },
          { platform: 'WHATSAPP', url: '#' },
          { platform: 'LINKEDIN', url: '#' }
        ];

        return (
          <footer className="w-full border-t border-white/5 pt-28 pb-16 mt-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
              <span className="text-[10px] font-gallery-mono text-white/30 tracking-[0.25em] uppercase mb-6 block">
                <EditableText 
                  value={customTexts?.classicFooterSub || '[ INQUIRIES & COLLABORATIONS ]'} 
                  field="classicFooterSub" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={40} 
                  as="span"
                />
              </span>
              
              <a 
                href={contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-gallery-serif italic font-light text-5xl md:text-7xl lg:text-8xl tracking-widest text-white hover:text-[#ff9e00] transition-colors duration-500 uppercase mb-20 block group"
              >
                <EditableText 
                  value={customTexts?.classicFooterCta || "LET'S WORK"} 
                  field="classicFooterCta" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={30} 
                  as="span"
                />
                <span className="block h-[1px] w-0 group-hover:w-full bg-[#ff9e00] transition-all duration-700 mx-auto mt-2"></span>
              </a>

              <div className="w-full border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-gallery-mono text-white/35 tracking-widest uppercase">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center text-[8px] font-semibold text-white/60">
                    {subdomain[0].toUpperCase()}
                  </span>
                  <span>
                    © {new Date().getFullYear()} {subdomain} /{" "}
                    <EditableText 
                      value={customTexts?.classicFooterExtra || 'SELECTED WORKS'} 
                      field="classicFooterExtra" 
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
                      className="hover:text-white transition-colors"
                    >
                      // {link.platform.toUpperCase()}
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
