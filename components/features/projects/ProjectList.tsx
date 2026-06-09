//components/features/projects/ProjectList.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { FolderOpen, Trash2, Edit3, Check, Award, Box, Play, Image as ImageIcon } from 'lucide-react';

const ModelViewer = 'model-viewer' as any;

// Komponen card yang animasinya dipicu IntersectionObserver
function AnimatedCard({ children, delay }: { children: React.ReactNode, delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // animasi hanya sekali
        }
      },
      { threshold: 0.08 } // mulai saat 8% card terlihat
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? undefined : 0,
        animation: visible
          ? `projectCardEnter 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`
          : 'none',
      }}
    >
      {children}
    </div>
  );
}

// Komponen card 3D: static 1 frame → hover untuk auto-rotate (tanpa interaksi user)
function ModelViewerCard({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    const mv = containerRef.current?.querySelector('model-viewer') as any;
    if (mv) mv.setAttribute('auto-rotate', '');
  };

  const handleMouseLeave = () => {
    const mv = containerRef.current?.querySelector('model-viewer') as any;
    if (mv) mv.removeAttribute('auto-rotate');
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full relative"
    >
      <ModelViewer
        src={src}
        shadow-intensity="1"
        environment-image="neutral"
        exposure="1"
        loading="lazy"
        interaction-prompt="none"
        style={{ width: '100%', height: '100%', backgroundColor: '#09090b', pointerEvents: 'none', '--poster-color': 'transparent' } as any}
      >
        <div slot="poster" className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-white/30 gap-3">
          <Box className="w-6 h-6 animate-pulse" />
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Memuat 3D...</span>
        </div>
      </ModelViewer>
    </div>
  );
}

export function ProjectList({ state, actions }: { state: any, actions: any }) {
  const { isLoading, filteredItems, activeTab } = state;
  const { handleOpenModal, confirmDelete } = actions;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-zinc-950 border border-white/10 p-3 shadow-none flex flex-col h-[380px] sm:h-[400px] rounded-none">
            <div className="aspect-[4/3] rounded-none bg-white/5 border border-white/5 shimmer shrink-0"></div>
            <div className="p-3 sm:p-4 pt-4 sm:pt-5 flex-1 flex flex-col space-y-3">
              <div className="h-4 bg-white/5 border border-white/5 rounded-none w-3/4 shimmer"></div>
              <div className="h-3 bg-white/5 border border-white/5 rounded-none w-full shimmer"></div>
              <div className="h-3 bg-white/5 border border-white/5 rounded-none w-4/5 shimmer"></div>
              <div className="mt-auto flex gap-2 pt-4">
                <div className="h-10 bg-white/5 border border-white/5 rounded-none flex-1 shimmer"></div>
                <div className="h-10 w-11 bg-white/5 border border-white/5 rounded-none shrink-0 shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="py-20 sm:py-24 flex flex-col items-center justify-center text-center animate-enter" style={{ animationDelay: '150ms' }}>
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-900 rounded-none flex items-center justify-center mb-5 sm:mb-6 border border-white/10 text-white/30">
          <FolderOpen className="w-8 h-8" />
        </div>
        <h3 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-wider mb-2">
          {activeTab === 'all' ? 'Belum ada data' : `Tidak ada ${activeTab} ditemukan`}
        </h3>
        <p className="text-white/40 font-mono text-xs mb-6 sm:mb-8 max-w-xs px-4">Perkaya profil Anda dengan menambahkan pencapaian terbaru.</p>
        {activeTab === 'all' && (
          <button 
            onClick={() => handleOpenModal()} 
            className="text-black bg-[#ff9e00] hover:bg-[#ffaa22] px-6 py-3.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-widest transition-all active:scale-95"
          >
            Unggah Data Pertama
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" />
      <style>{`
        @keyframes projectCardEnter {
          0%   { opacity: 0; transform: translateY(20px) scale(0.98); filter: blur(2px); }
          100% { opacity: 1; transform: translateY(0)    scale(1);    filter: blur(0);   }
        }
      `}</style>
      <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" />

      {/* key={activeTab} → remount saat tab ganti agar observer reset */}
      <div key={activeTab} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredItems.map((item: any, index: number) => (
          <AnimatedCard key={item.id} delay={index * 60}>
            <div className="group bg-zinc-950 rounded-none p-3 border border-white/10 hover:border-[#ff9e00]/40 transition-all duration-300 flex flex-col relative h-full">
              <div className="relative aspect-[4/3] rounded-none overflow-hidden bg-zinc-900 shrink-0 border border-white/5">
                {item.projectType === '3d' ? (
                  <ModelViewerCard src={item.mediaUrl} />
                ) : (
                  <LazyImage
                    src={item.projectType === 'video' ? getVideoThumbnail(item.mediaUrl) : item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-3 left-3 bg-black/85 border border-white/10 px-2.5 py-1.5 rounded-none text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5 pointer-events-none">
                  {item.itemType === 'certificate' ? (
                    <Award className="w-3 h-3 text-[#ff9e00]" />
                  ) : item.projectType === '3d' ? (
                    <Box className="w-3 h-3 text-[#ff9e00]" />
                  ) : item.projectType === 'video' ? (
                    <Play className="w-3 h-3 text-[#ff9e00]" />
                  ) : (
                    <ImageIcon className="w-3 h-3 text-[#ff9e00]" />
                  )}
                  {item.itemType === 'certificate' ? 'Sertifikat' : item.projectType}
                </div>
              </div>

              <div className="p-3 sm:p-4 pt-4 sm:pt-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-2 mb-1.5 sm:mb-2">
                  <h3 className="font-mono font-bold text-sm text-white line-clamp-1 uppercase tracking-wider">{item.title}</h3>
                  {item.itemType === 'certificate' && (
                    <div className="w-4 h-4 rounded-full bg-[#ff9e00] text-black flex items-center justify-center shrink-0 text-[8px] font-bold shadow-sm" title="Verified Credential">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-white/40 font-mono line-clamp-2 leading-relaxed">
                  {item.description || "Tidak ada rincian deskripsi tambahan untuk karya ini."}
                </p>

                {/* Tag chips */}
                {item.itemType !== 'certificate' && (() => {
                  let tags: string[] = [];
                  try { tags = Array.isArray(item.tags) ? item.tags : JSON.parse(item.tags || '[]'); } catch { }
                  return tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {tags.map((tag: string) => (
                        <span key={tag} className="inline-flex items-center px-2 py-0.5 bg-zinc-900 text-[#ff9e00] text-[9px] font-mono font-bold uppercase tracking-wider rounded-none border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null;
                })()}
                <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-[8px] font-mono font-bold text-white/30 uppercase tracking-widest mb-0.5">Tahun</p>
                    <p className="text-xs font-mono font-bold text-white">{item.year || new Date(item.createdAt).getFullYear()}</p>
                  </div>
                  {item.itemType === 'certificate' && item.status ? (
                    <div className="text-right">
                      <p className="text-[8px] font-mono font-bold text-white/30 uppercase tracking-widest mb-0.5">Pencapaian</p>
                      <p className="text-xs font-mono font-bold text-white truncate max-w-[100px] sm:max-w-[120px]">{item.status}</p>
                    </div>
                  ) : item.itemType === 'certificate' && item.issuer ? (
                    <div className="text-right">
                      <p className="text-[8px] font-mono font-bold text-white/30 uppercase tracking-widest mb-0.5">Penerbit</p>
                      <p className="text-xs font-mono font-bold text-white truncate max-w-[100px] sm:max-w-[120px]">{item.issuer}</p>
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="flex-1 bg-zinc-900 text-white border border-white/10 rounded-none py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Edit3 className="w-3 h-3" /> Edit Karya
                  </button>
                  <button
                    onClick={() => confirmDelete(item.id, item.title, item.itemType)}
                    className="w-10 h-10 shrink-0 bg-zinc-900 border border-white/10 text-white/40 rounded-none flex items-center justify-center hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/30 transition-all active:scale-95"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </>
  );
}
