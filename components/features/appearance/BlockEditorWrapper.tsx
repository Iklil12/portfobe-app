"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface BlockEditorWrapperProps {
  block: any;
  isEditor: boolean;
  children: React.ReactNode;
  isHero?: boolean;
  isHorizontalFlow?: boolean;
}

export function BlockEditorWrapper({ block, isEditor, children, isHero = false, isHorizontalFlow = false }: BlockEditorWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Jika bukan mode editor, render anak secara normal jika visible
  if (!isEditor) {
    return block.isVisible ? <>{children}</> : null;
  }

  // Jika blok disembunyikan tapi di mode editor, kita berikan class khusus di root, tapi efek visual utama (grayscale, opacity) dipindah ke konten agar toolbar tetap jelas warnanya.
  const hiddenRootClass = block.isVisible ? '' : '';

  const sendAction = (actionType: string) => {
    if (window.parent) {
      window.parent.postMessage({
        type: actionType,
        blockId: block.id,
        currentVisibility: block.isVisible,
        currentLockState: block.isLocked
      }, '*');
    }
  };

  const getBlockName = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <motion.div 
      layout={!isHero}
      transition={!isHero ? { type: "spring", stiffness: 300, damping: 30 } : { duration: 0.2 }}
      className={`relative group/block transition-opacity duration-500 ${hiddenRootClass} ${isHovered ? 'z-50' : 'z-10'} ${!isHero && isHovered ? 'scale-[1.005]' : ''} ${!isHero && !isHovered ? 'scale-100' : ''} ${isHorizontalFlow ? 'flex flex-row flex-nowrap shrink-0 h-full items-stretch' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Garis Border & Glow Hover */}
      <div className={`absolute inset-0 border-2 border-blue-500/40 rounded-xl pointer-events-none z-50 transition-all duration-700 ease-out shadow-[0_0_40px_rgba(59,130,246,0)] ${isHovered ? 'opacity-100 shadow-[0_0_40px_rgba(59,130,246,0.15)]' : 'opacity-0'}`} />

      {/* Floating Toolbar */}
      <div 
        className={`glass-noise absolute right-4 top-4 z-[100] flex items-center bg-black/60 backdrop-blur-xl text-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/10 transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}`}
      >
        <div className="px-3 py-1.5 border-r border-white/10 flex items-center bg-white/5">
          <span className="text-[10px] font-bold tracking-widest uppercase text-white/90 whitespace-nowrap">
            {getBlockName(block.blockType)}
          </span>
        </div>
        
        {!isHero ? (
          <>
            <button 
              onClick={() => !block.isLocked && sendAction('BLOCK_MOVE_UP')}
              disabled={block.isLocked}
              className={`px-2.5 py-1.5 transition-colors flex items-center justify-center text-[11px] ${block.isLocked ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20'}`}
              title={isHorizontalFlow ? "Geser ke Kiri" : "Pindah ke Atas"}
            >
              <i className={`fas ${isHorizontalFlow ? 'fa-arrow-left' : 'fa-arrow-up'}`}></i>
            </button>
            <button 
              onClick={() => !block.isLocked && sendAction('BLOCK_MOVE_DOWN')}
              disabled={block.isLocked}
              className={`px-2.5 py-1.5 transition-colors flex items-center justify-center text-[11px] border-r border-white/10 ${block.isLocked ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20'}`}
              title={isHorizontalFlow ? "Geser ke Kanan" : "Pindah ke Bawah"}
            >
              <i className={`fas ${isHorizontalFlow ? 'fa-arrow-right' : 'fa-arrow-down'}`}></i>
            </button>

            <button 
              onClick={() => sendAction('BLOCK_TOGGLE_LOCK')}
              className={`px-2.5 py-1.5 hover:bg-white/20 transition-colors flex items-center justify-center text-[11px] border-r border-white/10 ${block.isLocked ? 'text-[#ff9e00]' : 'text-white/80'}`}
              title={block.isLocked ? "Buka Kunci Blok" : "Kunci Blok"}
            >
              <i className={`fas ${block.isLocked ? 'fa-lock' : 'fa-unlock'}`}></i>
            </button>
            <button 
              onClick={() => !block.isLocked && sendAction('BLOCK_TOGGLE_VISIBILITY')}
              disabled={block.isLocked}
              className={`px-3 py-1.5 transition-colors flex items-center justify-center text-[11px] border-r border-white/10 ${block.isLocked ? 'opacity-30 cursor-not-allowed text-white' : (!block.isVisible ? 'text-red-400 hover:bg-white/20' : 'hover:bg-white/20')}`}
              title={block.isVisible ? "Sembunyikan Blok" : "Tampilkan Blok"}
            >
              <i className={`fas ${block.isVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
            </button>
            <button 
              onClick={() => {
                if (!block.isLocked) {
                  sendAction('BLOCK_DELETE');
                }
              }}
              disabled={block.isLocked}
              className={`px-3 py-1.5 transition-colors flex items-center justify-center text-[11px] border-r border-white/10 ${block.isLocked ? 'opacity-30 cursor-not-allowed text-white' : 'text-white/80 hover:text-white hover:bg-red-500/80'}`}
              title="Hapus Blok"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </>
        ) : (
          <div className="px-3 py-1.5 flex items-center justify-center text-[11px] text-white/40 bg-black/40 cursor-not-allowed" title="Blok Utama (Tidak bisa dipindah atau disembunyikan)">
            <i className="fas fa-lock"></i>
          </div>
        )}
      </div>

      {/* Jika blok disembunyikan, berikan overlay peringatan dan arsir */}
      {!block.isVisible && (
        <>
          {/* Arsir Biru Diagonal (berfungsi juga sebagai shield/penghalang klik) */}
          <div 
            className="absolute inset-0 z-30 rounded-xl cursor-not-allowed" 
            style={{ 
              background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(59, 130, 246, 0.15) 10px, rgba(59, 130, 246, 0.15) 20px)' 
            }} 
          />
          {/* Badge Peringatan */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-slate-900/90 text-blue-100 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest pointer-events-none flex items-center gap-2 backdrop-blur-md shadow-xl border border-blue-500/30">
            <i className="fas fa-eye-slash text-blue-400"></i> Blok Disembunyikan
          </div>
        </>
      )}

      {/* Jika blok dikunci, berikan overlay border kuning/orange putus-putus dan badge kecil */}
      {block.isLocked && block.isVisible && (
        <>
          <div className="absolute inset-0 z-30 rounded-xl border-2 border-dashed border-[#ff9e00]/40 pointer-events-none" />
          <div className="absolute top-4 left-4 z-40 bg-black/60 backdrop-blur-md text-[#ff9e00] px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest pointer-events-none flex items-center gap-1.5 shadow-lg border border-[#ff9e00]/20">
            <i className="fas fa-lock"></i> Terkunci
          </div>
        </>
      )}

      {/* Konten Asli */}
      <div className={`transition-all duration-300 ${!block.isVisible ? 'pointer-events-none select-none blur-[1px] opacity-40 grayscale group-hover/block:opacity-70' : ''} ${block.isLocked ? 'pointer-events-none select-none' : ''} ${isHorizontalFlow ? 'flex flex-row flex-nowrap shrink-0 h-full w-full items-stretch' : ''}`}
           {...(!block.isVisible || block.isLocked ? { inert: true } as any : {})}
      >
        {children}
      </div>

      {/* Tombol Tambah Bagian (Divider Line) - Muncul saat hover di antara blok */}
      {!isHorizontalFlow && isEditor && (
        <div className="absolute left-0 right-0 -bottom-3 h-6 flex items-center justify-center opacity-0 group-hover/block:opacity-100 transition-opacity z-[100]">
          <div className="absolute inset-0 flex items-center pointer-events-none">
            <div className="w-full border-t border-dashed border-[#ff9e00]/50"></div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.postMessage({ type: 'OPEN_LIBRARY', insertIndex: block.orderIndex + 1 }, '*');
            }}
            className="relative px-4 py-1.5 rounded-full bg-white border border-[#ff9e00] text-[#ff9e00] text-xs font-bold tracking-wide flex items-center gap-2 hover:bg-[#ff9e00] hover:text-white hover:scale-105 transition-all shadow-sm z-10 pointer-events-auto"
          >
            <i className="fas fa-plus text-sm"></i> Tambah Section
          </button>
        </div>
      )}

      {/* Tombol Tambah Bagian Horizontal - Muncul di kanan saat hover di antara blok */}
      {isHorizontalFlow && isEditor && (
        <div className="absolute top-0 bottom-0 -right-3 w-6 flex items-center justify-center opacity-0 group-hover/block:opacity-100 transition-opacity z-[100]">
          <div className="absolute inset-0 flex justify-center pointer-events-none">
            <div className="h-full border-l border-dashed border-[#ff9e00]/50"></div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.postMessage({ type: 'OPEN_LIBRARY', insertIndex: block.orderIndex + 1 }, '*');
            }}
            className="relative w-8 h-8 rounded-full bg-white border border-[#ff9e00] text-[#ff9e00] text-xs font-bold flex items-center justify-center hover:bg-[#ff9e00] hover:text-white hover:scale-110 transition-all shadow-md z-10 pointer-events-auto"
            title="Tambah Section di Sini"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      )}
    </motion.div>
  );
}
