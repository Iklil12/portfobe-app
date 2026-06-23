import React from 'react';
import { Target, Ghost, Lock, BarChart3, Share2, MessageSquare, Mail, Phone, Link2, FolderOpen } from 'lucide-react';
import { getSourceIcon, AnimatedCounter } from './AnalyticsShared';

export function TopSourcesWidget({ isLoading, isFree, handleLocked, displaySources, animReady }: any) {
  if (isLoading) return <div className="rounded-none shimmer-dark h-[340px]" />;

  return (
    <div onClick={isFree ? handleLocked : undefined}
      className={`bg-zinc-950 border border-white/10 rounded-none p-6 md:p-8 shadow-none animate-enter relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: '400ms' }}
    >
      {isFree && (
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center px-4">
          <div className="w-10 h-10 bg-zinc-900 border border-white/10 text-white rounded-none flex items-center justify-center mb-2">
            <Lock className="w-4 h-4 text-[#ff9e00]" />
          </div>
          <span className="text-[8px] font-mono font-bold text-[#ff9e00] tracking-widest uppercase">PRO ONLY</span>
          <p className="text-[10px] text-white/40 font-mono mt-1 text-center">Upgrade untuk melihat sumber trafik</p>
        </div>
      )}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Top Sources</h3>
          <p className="text-[9px] font-mono font-bold text-white/30 mt-1 uppercase tracking-widest">Dari mana trafik berasal</p>
        </div>
        <div className="w-9 h-9 rounded-none bg-zinc-900 border border-white/5 flex items-center justify-center text-white/40">
          <Target className="w-4 h-4 text-[#ff9e00]" />
        </div>
      </div>
      
      {displaySources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-white/20">
          <Ghost className="w-8 h-8 mb-3" />
          <p className="text-[9px] font-mono font-bold tracking-widest uppercase">Belum ada data sources</p>
        </div>
      ) : (
        <div className="space-y-5">
          {displaySources.map((src: any, i: number) => (
            <div key={i} className="group/src">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-none bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                    {getSourceIcon(src.name)}
                  </div>
                  <span className="text-[11px] font-mono text-white/80">{src.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono font-bold text-white">{src.percentage}%</p>
                  <p className="text-[8px] font-mono text-white/30 uppercase mt-0.5 tracking-wider">{src.count} hits</p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 border border-white/5 rounded-none overflow-hidden">
                <div className="h-full bg-white rounded-none group-hover/src:bg-[#ff9e00] transition-colors duration-300"
                  style={{ width: animReady ? `${src.percentage}%` : '0%', transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms, background-color 0.3s` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectPopularityWidget({ isLoading, isFree, handleLocked, displayProjects, animReady }: any) {
  if (isLoading) return <div className="rounded-none shimmer-dark h-[340px]" />;

  return (
    <div onClick={isFree ? handleLocked : undefined}
      className={`bg-zinc-950 border border-white/10 rounded-none p-6 md:p-8 shadow-none animate-enter relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: '480ms' }}
    >
      {isFree && (
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center px-4">
          <div className="w-10 h-10 bg-zinc-900 border border-white/10 text-white rounded-none flex items-center justify-center mb-2">
            <Lock className="w-4 h-4 text-[#ff9e00]" />
          </div>
          <span className="text-[8px] font-mono font-bold text-[#ff9e00] tracking-widest uppercase">PRO ONLY</span>
          <p className="text-[10px] text-white/40 font-mono mt-1 text-center">Upgrade untuk melacak interaksi dan klik proyek populer Anda</p>
        </div>
      )}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Popularitas Proyek</h3>
          <p className="text-[9px] font-mono font-bold text-white/30 mt-1 uppercase tracking-widest">Jumlah klik media & karya Anda</p>
        </div>
        <div className="w-9 h-9 rounded-none bg-zinc-900 border border-white/5 flex items-center justify-center text-white/40">
          <BarChart3 className="w-4 h-4 text-[#ff9e00]" />
        </div>
      </div>
      
      {displayProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-white/20">
          <Ghost className="w-8 h-8 mb-3" />
          <p className="text-[9px] font-mono font-bold tracking-widest uppercase">Belum ada data interaksi proyek</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayProjects.map((p: any, i: number) => (
            <div key={i} className="group/proj">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-white/40 group-hover/proj:text-[#ff9e00] transition-colors">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[11px] font-mono text-white/80 truncate max-w-[200px] sm:max-w-md">{p.title}</span>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-mono font-bold text-white">{p.percentage}%</p>
                  <p className="text-[8px] font-mono text-white/30 uppercase mt-0.5 tracking-wider">{p.count} klik</p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 border border-white/5 rounded-none overflow-hidden">
                <div className="h-full bg-white rounded-none group-hover/proj:bg-[#ff9e00] transition-colors duration-300"
                  style={{ width: animReady ? `${p.percentage}%` : '0%', transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms, background-color 0.3s` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SocialMediaWidget({ isLoading, isFree, handleLocked, displaySocialStats, animReady }: any) {
  if (isLoading) return <div className="rounded-none shimmer-dark h-[340px]" />;

  return (
    <div onClick={isFree ? handleLocked : undefined}
      className={`bg-zinc-950 border border-white/10 rounded-none p-6 md:p-8 shadow-none animate-enter relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: '500ms' }}
    >
      {isFree && (
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center px-4">
          <div className="w-10 h-10 bg-zinc-900 border border-white/10 text-white rounded-none flex items-center justify-center mb-2">
            <Lock className="w-4 h-4 text-[#ff9e00]" />
          </div>
          <span className="text-[8px] font-mono font-bold text-[#ff9e00] tracking-widest uppercase">PRO ONLY</span>
          <p className="text-[10px] text-white/40 font-mono mt-1 text-center">Upgrade untuk melacak klik link sosial media</p>
        </div>
      )}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Klik Sosial Media</h3>
          <p className="text-[9px] font-mono font-bold text-white/30 mt-1 uppercase tracking-widest">Klik pada link sosial media utama Anda</p>
        </div>
        <div className="w-9 h-9 rounded-none bg-zinc-900 border border-white/5 flex items-center justify-center text-white/40">
          <Share2 className="w-4 h-4 text-[#ff9e00]" />
        </div>
      </div>
      
      {displaySocialStats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-white/20">
          <Ghost className="w-8 h-8 mb-3" />
          <p className="text-[9px] font-mono font-bold tracking-widest uppercase">Belum ada klik sosmed</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displaySocialStats.map((src: any, i: number) => (
            <div key={i} className="group/social">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-none bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                    {getSourceIcon(src.name)}
                  </div>
                  <span className="text-[11px] font-mono text-white/80">{src.name}</span>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-mono font-bold text-white">{src.percentage}%</p>
                  <p className="text-[8px] font-mono text-white/30 uppercase mt-0.5 tracking-wider">{src.count} klik</p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 border border-white/5 rounded-none overflow-hidden">
                <div className="h-full bg-white rounded-none group-hover/social:bg-[#ff9e00] transition-colors duration-300"
                  style={{ width: animReady ? `${src.percentage}%` : '0%', transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms, background-color 0.3s` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ContactConversionsWidget({ isLoading, isFree, handleLocked, displayContactStats, animReady }: any) {
  if (isLoading) return <div className="rounded-none shimmer-dark h-[340px]" />;

  return (
    <div onClick={isFree ? handleLocked : undefined}
      className={`bg-zinc-950 border border-white/10 rounded-none p-6 md:p-8 shadow-none animate-enter relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: '540ms' }}
    >
      {isFree && (
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center px-4">
          <div className="w-10 h-10 bg-zinc-900 border border-white/10 text-white rounded-none flex items-center justify-center mb-2">
            <Lock className="w-4 h-4 text-[#ff9e00]" />
          </div>
          <span className="text-[8px] font-mono font-bold text-[#ff9e00] tracking-widest uppercase">PRO ONLY</span>
          <p className="text-[10px] text-white/40 font-mono mt-1 text-center">Upgrade untuk melacak konversi kontak</p>
        </div>
      )}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Konversi Kontak</h3>
          <p className="text-[9px] font-mono font-bold text-white/30 mt-1 uppercase tracking-widest">Interaksi klik email / telepon / WA</p>
        </div>
        <div className="w-9 h-9 rounded-none bg-zinc-900 border border-white/5 flex items-center justify-center text-white/40">
          <MessageSquare className="w-4 h-4 text-[#ff9e00]" />
        </div>
      </div>
      
      {displayContactStats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-white/20">
          <Ghost className="w-8 h-8 mb-3" />
          <p className="text-[9px] font-mono font-bold tracking-widest uppercase">Belum ada data konversi</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayContactStats.map((c: any, i: number) => {
            const getContactIcon = (name: string) => {
              if (name === 'WhatsApp') return <MessageSquare className="w-3.5 h-3.5 text-green-500" />;
              if (name === 'Email') return <Mail className="w-3.5 h-3.5 text-blue-400" />;
              if (name === 'Phone') return <Phone className="w-3.5 h-3.5 text-amber-500" />;
              return <Link2 className="w-3.5 h-3.5 text-white/50" />;
            };
            return (
              <div key={i} className="group/contact">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-none bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                      {getContactIcon(c.name)}
                    </div>
                    <span className="text-[11px] font-mono text-white/80">{c.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-mono font-bold text-white">{c.percentage}%</p>
                    <p className="text-[8px] font-mono text-white/30 uppercase mt-0.5 tracking-wider">{c.count} klik</p>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 border border-white/5 rounded-none overflow-hidden">
                  <div className="h-full bg-white rounded-none group-hover/contact:bg-[#ff9e00] transition-colors duration-300"
                    style={{ width: animReady ? `${c.percentage}%` : '0%', transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms, background-color 0.3s` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function GalleryActivityWidget({ isLoading, isFree, handleLocked, galleryClicks }: any) {
  if (isLoading) return <div className="rounded-none shimmer-dark h-[180px]" />;

  return (
    <div onClick={isFree ? handleLocked : undefined}
      className={`bg-zinc-950 border border-white/10 rounded-none p-6 md:p-8 shadow-none animate-enter relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: '560ms' }}
    >
      {isFree && (
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center px-4">
          <div className="w-10 h-10 bg-zinc-900 border border-white/10 text-white rounded-none flex items-center justify-center mb-2">
            <Lock className="w-4 h-4 text-[#ff9e00]" />
          </div>
          <span className="text-[8px] font-mono font-bold text-[#ff9e00] tracking-widest uppercase">PRO ONLY</span>
          <p className="text-[10px] text-white/40 font-mono mt-1 text-center">Upgrade untuk melacak klik tombol Galeri</p>
        </div>
      )}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Aktivitas Tombol Galeri</h3>
          <p className="text-[9px] font-mono font-bold text-white/30 mt-1 uppercase tracking-widest">Seberapa sering pengunjung mengklik tombol menuju halaman galeri/arsip</p>
        </div>
        <div className="w-9 h-9 rounded-none bg-zinc-900 border border-white/5 flex items-center justify-center text-white/40">
          <FolderOpen className="w-4 h-4 text-[#ff9e00]" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-widest mb-1">Total Klik Menuju Galeri</p>
          <h4 className="text-4xl md:text-5xl font-mono font-bold text-white tracking-tighter">
            <AnimatedCounter value={isFree ? 75 : (galleryClicks || 0)} />
            <span className="text-xs font-mono font-bold text-white/30 ml-2 uppercase tracking-normal">klik</span>
          </h4>
        </div>
        <div className="w-full md:max-w-md bg-zinc-900/40 border border-white/5 p-4 rounded-none flex items-center gap-4">
          <div className="w-10 h-10 bg-zinc-950 border border-white/5 flex items-center justify-center shrink-0">
            <FolderOpen className="w-5 h-5 text-white/40" />
          </div>
          <div>
            <h5 className="text-[11px] font-mono font-bold text-white/80 uppercase tracking-wide">Minat Pengunjung</h5>
            <p className="text-[9px] font-mono text-white/40 leading-relaxed mt-1">
              Klik tombol ini menandakan ketertarikan tinggi pengunjung untuk melihat seluruh koleksi karya Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
