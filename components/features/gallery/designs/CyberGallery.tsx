import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Film, ArrowUpRight, Cpu, Clock, Activity, AlertOctagon } from 'lucide-react';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { GalleryLayoutProps } from './types';

export default function CyberGallery({
  projects,
  subdomain,
  isEditor,
  customTexts,
  setActiveProject,
  getLayoutParts,
  premiumEase,
  systemTime,
  profile,
  links,
  email
}: GalleryLayoutProps) {
  const router = useRouter();

  return (
    <div className="relative z-10 flex flex-col min-h-screen font-gallery-mono">
      {/* Top Info HUD Bar */}
      <div className="w-full border-b border-[#ff9e00]/25 bg-[#07070d]/95 py-3 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-[10px] font-gallery-mono text-[#ff9e00]/70 gap-2 shrink-0 pt-24 md:pt-6 relative">
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff9e00]/40 to-transparent"></div>
        <div className="flex items-center gap-4">
          <span className="text-[#ff9e00] font-black tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff9e00] animate-ping"></span>
            <EditableText 
              value={customTexts?.cyberSystemActive || 'CORE_SYSTEM_ACTIVE'} 
              field="cyberSystemActive" 
              entity="appearance" 
              isEditor={isEditor} 
              maxLength={30} 
              as="span"
            />
          </span>
          <span className="text-white/30">|</span>
          <span className="text-white/60 tracking-wider">
            <EditableText 
              value={customTexts?.cyberIndexLabel || 'INDEX: //'} 
              field="cyberIndexLabel" 
              entity="appearance" 
              isEditor={isEditor} 
              maxLength={20} 
              as="span"
            />{' '}
            {subdomain.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#ff9e00]" /> {systemTime}</span>
          <span className="text-white/30">|</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase">
            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> 
            <EditableText 
              value={customTexts?.cyberNetworkLabel || 'NETWORK_OK'} 
              field="cyberNetworkLabel" 
              entity="appearance" 
              isEditor={isEditor} 
              maxLength={20} 
              as="span"
            />
          </span>
        </div>
      </div>

      {/* Full Width Diagnostics Dashboard Header */}
      <section className="pt-32 pb-8 px-6 md:px-12 lg:px-24">
        <div className="border border-[#ff9e00]/20 bg-[#07070d]/60 p-6 rounded relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="absolute top-0 right-0 w-24 h-24 bg-radial-gradient from-[#ff9e00]/5 to-transparent pointer-events-none"></div>
          
          <div className="flex-1 flex flex-col md:flex-row gap-8 items-start md:items-center w-full">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-black text-[#ff9e00] uppercase tracking-wider">
                <Cpu className="w-4 h-4" /> 
                <EditableText 
                  value={customTexts?.cyberCoreDiagLabel || 'CORE_DIAGNOSTICS'} 
                  field="cyberCoreDiagLabel" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={30} 
                  as="span"
                />
              </div>
              <div className="flex flex-col gap-1 text-[10px] text-white/50 leading-relaxed">
                <p>
                  &gt;{' '}
                  <EditableText 
                    value={customTexts?.cyberVerifiedLabel || 'VERIFIED'} 
                    field="cyberVerifiedLabel" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={15} 
                    as="span"
                  />{' '}
                  {projects.length}{' '}
                  <EditableText 
                    value={customTexts?.cyberNodesLabel || 'ACTIVE MEDIA NODES'} 
                    field="cyberNodesLabel" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={30} 
                    as="span"
                  />
                </p>
                <p>
                  &gt;{' '}
                  <EditableText 
                    value={customTexts?.cyberSysStreamLabel || 'SYS_STREAM: EMITTING DATA PORTAL FEED'} 
                    field="cyberSysStreamLabel" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={60} 
                    as="span"
                  />
                </p>
              </div>
            </div>
            
            <div className="hidden md:block w-[1px] h-12 bg-[#ff9e00]/20"></div>

            {/* Simulated connection metrics */}
            <div className="grid grid-cols-2 md:flex items-center gap-6 text-[10px] text-white/50">
              <div>
                <span className="block text-white/20 text-[8px] uppercase font-bold mb-0.5">
                  <EditableText 
                    value={customTexts?.cyberNodePingLabel || 'NODE_PING'} 
                    field="cyberNodePingLabel" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={20} 
                    as="span"
                  />
                </span>
                <span className="font-bold text-white/90">
                  <EditableText 
                    value={customTexts?.cyberNodePingVal || '14 ms [STABLE]'} 
                    field="cyberNodePingVal" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={25} 
                    as="span"
                  />
                </span>
              </div>
              <div>
                <span className="block text-white/20 text-[8px] uppercase font-bold mb-0.5">
                  <EditableText 
                    value={customTexts?.cyberEncryptionTitle || 'ENCRYPTION'} 
                    field="cyberEncryptionTitle" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={20} 
                    as="span"
                  />
                </span>
                <span className="font-bold text-white/90">
                  <EditableText 
                    value={customTexts?.cyberEncryptionLabel || 'AES-256-GCM'} 
                    field="cyberEncryptionLabel" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={25} 
                    as="span"
                  />
                </span>
              </div>
              <div>
                <span className="block text-white/20 text-[8px] uppercase font-bold mb-0.5">
                  <EditableText 
                    value={customTexts?.cyberClusterAddrTitle || 'CLUSTER_ADDR'} 
                    field="cyberClusterAddrTitle" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={20} 
                    as="span"
                  />
                </span>
                <span className="font-bold text-[#ff9e00]">
                  <EditableText 
                    value={customTexts?.cyberClusterAddrLabel || 'US-WEST-GRID-90X'} 
                    field="cyberClusterAddrLabel" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={25} 
                    as="span"
                  />
                </span>
              </div>
            </div>
          </div>

          {/* Animated status wave visualizer */}
          <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-1.5">
            <span className="text-[8px] text-white/30 uppercase tracking-widest block font-bold">
              <EditableText 
                value={customTexts?.cyberOscLabel || 'FEED_SIGNAL_OSC'} 
                field="cyberOscLabel" 
                entity="appearance" 
                isEditor={isEditor} 
                maxLength={25} 
                as="span"
              />
            </span>
            <div className="h-8 border border-[#ff9e00]/15 bg-black/50 rounded flex items-end justify-between px-3 py-1 gap-0.5 w-full">
              {Array.from({ length: 22 }).map((_, i) => (
                <span 
                  key={i}
                  className="w-1 bg-[#ff9e00]/60 rounded-t-sm"
                  style={{ 
                    height: `${10 + Math.sin(i * 0.8) * 8 + Math.random() * 6}%`,
                    animation: `pulse 1.${(i % 5) + 2}s infinite alternate`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN MANIFEST GRID AREA (FULL WIDTH) */}
      <section className="px-6 md:px-12 lg:px-24 pb-40">
        {projects.length === 0 ? (
          <div className="w-full py-40 flex flex-col items-center justify-center text-center border border-[#ff9e00]/20 bg-[#07070d]/30">
            <AlertOctagon className="w-8 h-8 text-[#ff9e00] mb-4 animate-bounce" />
            <p className="font-gallery-mono text-xs text-[#ff9e00] uppercase tracking-[0.2em]">&gt;&gt; LOG_ERR: MANIFEST EMPTY</p>
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
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveProject(project);
                  }}
                  className={`group relative flex flex-col cursor-pointer border border-[#ff9e00]/20 bg-[#07070f]/50 hover:bg-[#0e0e1a]/80 hover:border-[#ff9e00] hover:shadow-[0_0_20px_rgba(255,158,0,0.15)] transition-all duration-300 p-3 ${spanClass}`}
                >
                  {/* HUD corner indicator bracket overlays */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#ff9e00]"></div>
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#ff9e00]"></div>
                  <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#ff9e00]"></div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#ff9e00]"></div>

                  <div className="w-full h-full flex flex-col font-gallery-mono text-left relative">
                    
                    {/* Image box */}
                    <div className={`w-full relative overflow-hidden border border-[#ff9e00]/15 group-hover:border-[#ff9e00]/40 transition-colors duration-300 bg-[#0c0c14] shrink-0 ${aspectClass}`}>
                      <LazyImage 
                        src={thumbnailUrl} 
                        alt={project.title}
                        className={`w-full object-cover transition-transform duration-[1s] group-hover:scale-102 group-hover:opacity-85 ${aspectClass.includes('aspect-auto') ? 'h-auto relative' : 'h-full absolute inset-0'}`}
                      />
                      
                      {/* CRT screen lines overlay */}
                      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,158,0,0.04),rgba(0,255,0,0.01),rgba(0,0,255,0.04))] bg-[size:100%_4px,6px_100%]"></div>
                      
                      {/* HUD brackets on image frame */}
                      <div className="absolute top-1.5 left-1.5 text-[7px] text-[#ff9e00]/55 font-bold">[ NODE_ID: 0{index + 1} ]</div>
                      <div className="absolute top-1.5 right-1.5 text-[7px] text-[#ff9e00]/55 font-bold">[ {isVideo ? 'VIDEO_STREAM' : 'STATIC_NODE'} ]</div>
                      
                      {/* Animated Sci-Fi targeting crosshair overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-[#07070d]/30">
                        <div className="w-16 h-16 border border-dashed border-[#ff9e00] rounded-full animate-spin [animation-duration:8s] flex items-center justify-center relative">
                          <div className="w-8 h-8 border border-solid border-[#ff9e00] rounded-full flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-[#ff9e00] rounded-full"></span>
                          </div>
                        </div>
                        <span className="absolute bottom-4 bg-[#ff9e00] text-black text-[7px] font-black px-1.5 py-0.5 tracking-wider animate-pulse uppercase">
                          {isVideo ? 'PLAY FEED' : 'LOCK_ON'}
                        </span>
                      </div>
                    </div>

                    {/* Tech descriptions and details below image */}
                    <div className="mt-3.5 pt-2 border-t border-dashed border-[#ff9e00]/25 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-white group-hover:text-[#ff9e00] transition-colors uppercase tracking-wider truncate max-w-[70%]">
                          {project.title}
                        </h3>
                        <span className="text-[8px] text-[#ff9e00] bg-[#ff9e00]/10 px-1.5 py-0.5 border border-[#ff9e00]/20 rounded font-bold">
                          {isVideo ? 'MP4_STRM' : 'IMG_STILL'}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-white/40 text-[10px] line-clamp-1 leading-normal">
                          {project.description}
                        </p>
                      )}
                      
                      {/* Coordinates and physical address info */}
                      <div className="flex items-center justify-between text-[8px] text-white/30 font-mono mt-1 pt-1.5 border-t border-[#ff9e00]/5">
                        <span>SECTOR: 0{index + 1} // ADDR: 0x{index * 8}F</span>
                        <span className="group-hover:text-[#ff9e00] transition-colors">[ ACCESS_NODE ]</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
      {/* Cyber Footer */}
      {(() => {
        const contactUrl = profile?.whatsapp ? `https://wa.me/${profile.whatsapp}` : (email ? `mailto:${email}` : '#');
        const displayLinks = links && links.length > 0 ? links : [
          { platform: 'GITHUB', url: '#' },
          { platform: 'WHATSAPP', url: '#' },
          { platform: 'LINKEDIN', url: '#' }
        ];

        return (
          <footer className="w-full border-t border-[#ff9e00]/25 bg-[#07070d]/95 pt-20 pb-12 mt-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center font-mono">
              <span className="text-[10px] text-[#ff9e00]/60 tracking-[0.3em] uppercase mb-4 block">
                <EditableText 
                  value={customTexts?.cyberFooterSub || '[ CONNECT_SYS // TERMINAL_PROTOCOL_ACTIVE ]'} 
                  field="cyberFooterSub" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={50} 
                  as="span"
                />
              </span>
              
              <a 
                href={contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-bold text-4xl md:text-6xl lg:text-7xl tracking-widest text-[#ff9e00] hover:text-white transition-colors duration-300 uppercase mb-20 block group cursor-pointer"
              >
                <EditableText 
                  value={customTexts?.cyberFooterCta || 'CONNECT_SYS'} 
                  field="cyberFooterCta" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={30} 
                  as="span"
                />
                <span className="animate-pulse text-[#ff9e00]">_</span>
              </a>

              <div className="w-full border-t border-[#ff9e00]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] text-[#ff9e00]/50 tracking-[0.2em] uppercase">
                <div className="flex items-center gap-3">
                  <span className="px-1.5 py-0.5 border border-[#ff9e00]/30 text-[#ff9e00] text-[8px] font-bold">
                    SYS.V{subdomain[0].toUpperCase()}
                  </span>
                  <span>
                    <EditableText 
                      value={customTexts?.cyberFooterPrefix || 'SYS_LOG'} 
                      field="cyberFooterPrefix" 
                      entity="appearance" 
                      isEditor={isEditor} 
                      maxLength={20} 
                      as="span"
                    />{" "}
                    // © {new Date().getFullYear()} {subdomain.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  {displayLinks.map((link: any, idx: number) => (
                    <a 
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 border border-[#ff9e00]/15 hover:border-[#ff9e00] hover:text-white transition-all duration-300"
                    >
                      [ {link.platform.toUpperCase()} ]
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
