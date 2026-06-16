import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Film, ArrowUpRight } from 'lucide-react';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { GalleryLayoutProps } from './types';

export default function EditorialGallery({
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
    <div className="relative z-10 font-gallery-serif">
      {/* Editorial Magazine Title & Editorial Column Header */}
      <section className="pt-48 pb-16 px-6 md:px-12 lg:px-24 border-b border-white/10 bg-[#09090b]">
        <div className="w-full flex flex-col md:flex-row justify-between items-start gap-8 md:gap-16 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: premiumEase }}
            className="flex-1"
          >
            <div className="flex items-center gap-4 text-[10px] font-gallery-mono tracking-widest text-[#ff9e00] mb-4">
              <EditableText 
                value={customTexts?.editorialVol || 'EST. 2026 // VOL III'} 
                field="editorialVol" 
                entity="appearance" 
                isEditor={isEditor} 
                maxLength={35} 
                as="span"
              />
              <span>•</span>
              <EditableText 
                value={customTexts?.editorialVolTag || 'MANIFESTO'} 
                field="editorialVolTag" 
                entity="appearance" 
                isEditor={isEditor} 
                maxLength={20} 
                as="span"
              />
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-gallery-display font-black tracking-tighter leading-[0.85] text-white uppercase max-w-2xl break-words">
              <EditableText 
                value={customTexts?.editorialTitle || 'THE GALLERY.'} 
                field="editorialTitle" 
                entity="appearance" 
                isEditor={isEditor} 
                maxLength={50} 
                as="span"
              />
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
            className="w-full md:w-[350px] shrink-0 pt-4"
          >
            <p className="text-sm text-white/60 font-gallery-serif italic leading-relaxed mb-6">
              <EditableText 
                value={customTexts?.editorialDesc || 'Sebuah arsip digital visual yang memadukan estetika editorial cetak dengan interaktivitas modern.'} 
                field="editorialDesc" 
                entity="appearance" 
                isEditor={isEditor} 
                maxLength={250} 
                as="span"
              />
            </p>
            <div className="w-12 h-[1px] bg-[#ff9e00]"></div>
          </motion.div>
        </div>

        {/* Bottom metadata row inside header */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap justify-between items-center text-[10px] font-gallery-mono text-white/40 tracking-wider gap-4">
          <div className="flex gap-8">
            <div>
              <span className="text-white/20 mr-1.5">
                <EditableText 
                  value={customTexts?.editorialCreativeNodeLabel || 'CREATIVE NODE:'} 
                  field="editorialCreativeNodeLabel" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={20} 
                  as="span"
                />
              </span>
              <span className="text-white/80 font-bold uppercase">{subdomain}</span>
            </div>
            <div>
              <span className="text-white/20 mr-1.5">
                <EditableText 
                  value={customTexts?.editorialTotalIndexLabel || 'TOTAL INDEX:'} 
                  field="editorialTotalIndexLabel" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={20} 
                  as="span"
                />
              </span>
              <span className="text-white/80 font-bold">
                {projects.length}{' '}
                <EditableText 
                  value={customTexts?.editorialTotalIndexSuffix || 'ITEMS'} 
                  field="editorialTotalIndexSuffix" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={15} 
                  as="span"
                />
              </span>
            </div>
          </div>
          <div>
            <span className="text-white/20 mr-1.5">
              <EditableText 
                value={customTexts?.editorialSystemAccessLabel || 'SYSTEM ACCESS:'} 
                field="editorialSystemAccessLabel" 
                entity="appearance" 
                isEditor={isEditor} 
                maxLength={25} 
                as="span"
              />
            </span>
            <span className="text-[#ff9e00] font-bold">
              <EditableText 
                value={customTexts?.editorialSystemAccessVal || 'PUBLIC'} 
                field="editorialSystemAccessVal" 
                entity="appearance" 
                isEditor={isEditor} 
                maxLength={20} 
                as="span"
              />
            </span>
          </div>
        </div>
      </section>

      {/* Full Width Grid Column */}
      <section className="px-6 md:px-12 lg:px-24 pt-20 pb-40">
        {projects.length === 0 ? (
          <div className="w-full py-40 flex flex-col items-center justify-center text-center border border-white/5 bg-white/[0.01]">
            <p className="font-gallery-mono uppercase tracking-[0.3em] text-xs text-white/30">The exhibition is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            {projects.map((project, index) => {
              const isVideo = project.projectType === 'video';
              const thumbnailUrl = isVideo ? getVideoThumbnail(project.mediaUrl) : project.mediaUrl;
              const { spanClass, aspectClass } = getLayoutParts(index);
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: premiumEase }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveProject(project);
                  }}
                  className={`group relative flex flex-col cursor-pointer ${spanClass}`}
                >
                  <div className="w-full h-full flex flex-col group text-left">
                    <div className={`w-full relative overflow-hidden bg-[#16161a] border border-white/5 transition-all duration-500 ${aspectClass}`}>
                      <LazyImage 
                        src={thumbnailUrl} 
                        alt={project.title}
                        className={`w-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${aspectClass.includes('aspect-auto') ? 'h-auto relative' : 'h-full absolute inset-0'}`}
                      />
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center">
                          {isVideo ? <Film className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                    
                    {/* Editorial Metadata Below Image */}
                    <div className="mt-3.5 pb-2 border-b border-white/10 flex items-start justify-between">
                      <div className="flex flex-col gap-1 max-w-[80%]">
                        <span className="text-[10px] font-gallery-mono text-[#ff9e00] uppercase tracking-wider">
                          NO. {String(index + 1).padStart(2, '0')} // {isVideo ? 'VIDEO' : 'STILL'}
                        </span>
                        <h3 className="text-lg md:text-xl font-gallery-serif font-bold text-white tracking-tight leading-tight group-hover:text-[#ff9e00] transition-colors">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-white/50 text-[11px] font-gallery-serif italic line-clamp-1 mt-0.5">
                            {project.description}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] font-gallery-mono text-white/30 pt-1">
                        {isVideo ? '[MP4]' : '[JPG]'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
      {/* Editorial Footer */}
      {(() => {
        const contactUrl = profile?.whatsapp ? `https://wa.me/${profile.whatsapp}` : (email ? `mailto:${email}` : '#');
        const displayLinks = links && links.length > 0 ? links : [
          { platform: 'GITHUB', url: '#' },
          { platform: 'WHATSAPP', url: '#' },
          { platform: 'LINKEDIN', url: '#' }
        ];

        return (
          <footer className="w-full border-t border-white/10 bg-[#09090b] pt-24 pb-12 mt-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
              <span className="text-[10px] font-gallery-mono text-[#ff9e00] tracking-[0.25em] uppercase mb-4 block animate-pulse">
                <EditableText 
                  value={customTexts?.editorialFooterSub || '[ SYSTEM ALIGNMENT READY ]'} 
                  field="editorialFooterSub" 
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
                className="font-gallery-display font-black text-6xl md:text-8xl lg:text-9xl tracking-tighter text-white hover:text-[#ff9e00] transition-colors duration-300 uppercase mb-20 block hover:scale-[1.02] transform"
              >
                <EditableText 
                  value={customTexts?.editorialFooterCta || 'CONNECT'} 
                  field="editorialFooterCta" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={30} 
                  as="span"
                />
              </a>

              <div className="w-full border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-gallery-mono text-white/40 tracking-widest uppercase">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-bold text-white/70">
                    {subdomain[0].toUpperCase()}
                  </span>
                  <span>
                    <EditableText 
                      value={customTexts?.editorialFooterPrefix || '_FILE'} 
                      field="editorialFooterPrefix" 
                      entity="appearance" 
                      isEditor={isEditor} 
                      maxLength={20} 
                      as="span"
                    />{" "}
                    © {new Date().getFullYear()} {subdomain.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center gap-6">
                  {displayLinks.map((link: any, idx: number) => (
                    <a 
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors duration-200"
                    >
                      // {link.platform.toUpperCase()}
                    </a>
                  ))}
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="hover:text-[#ff9e00] transition-colors uppercase tracking-widest font-bold bg-transparent border-none p-0 cursor-pointer ml-4"
                  >
                    [ ↑ ]
                  </button>
                </div>
              </div>
            </div>
          </footer>
        );
      })()}
    </div>
  );
}
