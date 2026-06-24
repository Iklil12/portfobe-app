import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Film, ArrowUpRight, Sparkles } from 'lucide-react';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';
import { getVideoThumbnail } from '@/shared/lib/videoUtils';
import { GalleryLayoutProps } from './types';

export default function GlassGallery({
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
      {/* Ambient Background Blobs (Motion-drifting) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            x: [0, 90, -50, 0],
            y: [0, -70, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-[10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-violet-600/15 blur-[160px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -110, 70, 0],
            y: [0, 90, -60, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-[55%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-500/10 blur-[150px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.25, 0.85, 1],
            opacity: [0.3, 0.65, 0.4, 0.3]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[35%] left-[30%] w-[35vw] h-[35vw] rounded-full bg-indigo-500/10 blur-[180px]" 
        />
      </div>

      {/* Glass Hero card */}
      <section className="pt-48 pb-20 px-6 md:px-12 lg:px-24 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: premiumEase }}
          className="max-w-4xl w-full bg-white/[0.01] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-violet-600/5 via-transparent to-teal-500/5"></div>
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#ff9e00]" />
            <span className="text-[10px] font-gallery-sans font-bold uppercase tracking-wider text-white/80">
              <EditableText 
                value={customTexts?.glassPill || 'Glass Showcase'} 
                field="glassPill" 
                entity="appearance" 
                isEditor={isEditor} 
                maxLength={30} 
                as="span"
              />
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-gallery-display font-extrabold tracking-tight leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
            <EditableText 
              value={customTexts?.glassTitle || 'Visual Exhibition Space'} 
              field="glassTitle" 
              entity="appearance" 
              isEditor={isEditor} 
              maxLength={60} 
              as="span"
            />
          </h1>
          
          <p className="text-xs md:text-sm text-white/50 max-w-md mx-auto leading-relaxed mb-8">
            <EditableText 
              value={customTexts?.glassDesc || 'Jelajahi karya terbaik kami dalam wadah transparan modern dengan gradasi ambient yang hidup.'} 
              field="glassDesc" 
              entity="appearance" 
              isEditor={isEditor} 
              maxLength={200} 
              as="span"
            />
          </p>
          
          <div className="flex justify-center gap-8 text-center text-xs">
            <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-md">
              <span className="block text-white/40 text-[9px] uppercase font-gallery-mono">
                <EditableText 
                  value={customTexts?.glassCuratedByLabel || 'Curated By'} 
                  field="glassCuratedByLabel" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={20} 
                  as="span"
                />
              </span>
              <span className="font-semibold text-white/90 mt-0.5 block">{subdomain}</span>
            </div>
            <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-md">
              <span className="block text-white/40 text-[9px] uppercase font-gallery-mono">
                <EditableText 
                  value={customTexts?.glassElementsLabel || 'Elements'} 
                  field="glassElementsLabel" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={20} 
                  as="span"
                />
              </span>
              <span className="font-semibold text-white/90 mt-0.5 block">
                {projects.length}{' '}
                <EditableText 
                  value={customTexts?.glassElementsSuffix || 'Items'} 
                  field="glassElementsSuffix" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={15} 
                  as="span"
                />
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Glass floating Cards Grid */}
      <section className="px-6 md:px-12 lg:px-24 pb-40">
        {projects.length === 0 ? (
          <div className="w-full py-40 flex flex-col items-center justify-center text-center bg-white/[0.01] border border-white/10 rounded-2xl">
            <p className="font-gallery-mono uppercase tracking-[0.3em] text-xs text-white/30">The exhibition is empty.</p>
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
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-85px" }}
                  transition={{ duration: 0.8 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveProject(project);
                  }}
                  className={`group relative flex flex-col cursor-pointer ${spanClass}`}
                >
                  <div className="w-full h-full bg-white/[0.01] backdrop-blur-xl border border-white/10 p-3 rounded-[24px] hover:bg-white/[0.04] hover:border-white/25 hover:shadow-[0_20px_50px_rgba(31,38,135,0.2)] hover:scale-[1.02] transition-all duration-500 flex flex-col relative overflow-hidden group/card shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                    {/* Specular Shimmer gloss reflection overlay */}
                    <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover/card:animate-[shimmer_1.8s_infinite] pointer-events-none z-10"></div>
                    
                    {/* Image container inside the card */}
                    <div className={`w-full relative overflow-hidden rounded-[18px] bg-zinc-950/80 shrink-0 ${aspectClass}`}>
                      <LazyImage 
                        src={thumbnailUrl} 
                        alt={project.title}
                        className={`w-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-108 ${aspectClass.includes('aspect-auto') ? 'h-auto relative' : 'h-full absolute inset-0'}`}
                      />
                      
                      {/* Top category Pill floating */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="text-[8px] font-gallery-mono uppercase tracking-[0.25em] px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-white/90 backdrop-blur-md">
                          {isVideo ? 'PLAY FILM' : 'STILL'}
                        </span>
                      </div>
                    </div>

                    {/* Text block below image, inside the glass capsule */}
                    <div className="mt-4 px-2 pb-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base md:text-lg font-gallery-display font-extrabold text-white tracking-tight leading-snug group-hover/card:text-[#ff9e00] transition-colors duration-300">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-white/40 text-[11px] font-gallery-sans line-clamp-2 mt-1 leading-relaxed">
                            {project.description}
                          </p>
                        )}
                      </div>

                      {/* Micro interactive indicator */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-[9px] font-gallery-mono text-white/30 uppercase tracking-widest">
                        <span>NO. {String(index + 1).padStart(2, '0')}</span>
                        <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm group-hover/card:bg-white group-hover/card:text-black transition-all duration-300">
                          <ArrowUpRight className="w-3.5 h-3.5 text-white group-hover/card:text-black transition-colors" />
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
      {/* Glass Footer */}
      {(() => {
        const contactUrl = profile?.whatsapp ? `https://wa.me/${profile.whatsapp}` : (email ? `mailto:${email}` : '#');
        const displayLinks = links && links.length > 0 ? links : [
          { platform: 'GITHUB', url: '#' },
          { platform: 'WHATSAPP', url: '#' },
          { platform: 'LINKEDIN', url: '#' }
        ];

        return (
          <footer className="px-6 md:px-12 lg:px-24 pb-16 mt-20">
            <div className="max-w-7xl mx-auto py-16 px-8 rounded-3xl bg-white/[0.01] backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>
              <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-teal-500/10 blur-[120px] pointer-events-none"></div>
              
              <div className="flex items-center gap-2 mb-6 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[9px] font-gallery-mono text-white/50 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span>
                  <EditableText 
                    value={customTexts?.glassFooterSub || '[ CURRENT STATUS: READY TO WORK ]'} 
                    field="glassFooterSub" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={40} 
                    as="span"
                  />
                </span>
              </div>
              
              <a 
                href={contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-gallery-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-white to-teal-300 hover:scale-[1.03] transition-transform duration-300 uppercase mb-16 block text-center"
              >
                <EditableText 
                  value={customTexts?.glassFooterCta || 'SAY HELLO'} 
                  field="glassFooterCta" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={30} 
                  as="span"
                />
              </a>

              <div className="w-full border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-gallery-mono text-white/45 tracking-widest uppercase z-10">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500/20 to-teal-500/20 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                    {subdomain[0].toUpperCase()}
                  </div>
                  <span>
                    © {new Date().getFullYear()} {subdomain} •{" "}
                    <EditableText 
                      value={customTexts?.glassFooterExtra || 'CONNECTED'} 
                      field="glassFooterExtra" 
                      entity="appearance" 
                      isEditor={isEditor} 
                      maxLength={30} 
                      as="span"
                    />
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  {displayLinks.map((link: any, idx: number) => (
                    <a 
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-full bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all text-[9px]"
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
