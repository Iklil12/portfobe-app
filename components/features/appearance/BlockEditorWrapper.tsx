//components/features/appearance/BlockEditorWrapper.tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Lock, 
  Unlock, Eye, EyeOff, Trash2, Plus 
} from 'lucide-react';

interface BlockEditorWrapperProps {
  block: any;
  isEditor: boolean;
  children: React.ReactNode;
  isHero?: boolean;
  isHorizontalFlow?: boolean;
  style?: React.CSSProperties;
}

export function BlockEditorWrapper({ block, isEditor, children, isHero = false, isHorizontalFlow = false, style }: BlockEditorWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Jika bukan mode editor, render anak secara normal jika visible
  if (!isEditor) {
    return block.isVisible ? <>{children}</> : null;
  }

  const sendAction = (actionType: string) => {
    if (window.parent) {
      window.parent.postMessage({
        type: actionType,
        blockId: block.id,
        currentVisibility: block.isVisible,
        currentLockState: block.isLocked
      }, window.location.origin);
    }
  };

  const getBlockName = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <motion.div
      layout={!isHero}
      transition={!isHero ? { type: "spring", stiffness: 300, damping: 30 } : { duration: 0.2 }}
      className={`relative group/block transition-opacity duration-500 ${isHovered ? 'z-50' : 'z-10'} ${!isHero && isHovered ? 'scale-[1.005]' : ''} ${!isHero && !isHovered ? 'scale-100' : ''} ${isHorizontalFlow ? 'flex flex-row flex-nowrap shrink-0 h-full items-stretch' : ''} ${isHero ? (isHorizontalFlow ? 'h-full' : 'w-full h-full') : ''}`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(true)}
    >
      {/* Garis Border & Glow Hover */}
      <div className={`absolute inset-0 border-2 border-[#ff9e00]/30 rounded-none pointer-events-none z-[210] transition-all duration-700 ease-out shadow-[0_0_40px_rgba(255,158,0,0)] ${isHovered ? 'opacity-100 shadow-[0_0_40px_rgba(255,158,0,0.1)]' : 'opacity-0'}`} />

      {/* Floating Toolbar */}
      <div
        className={`absolute right-4 ${isHorizontalFlow ? 'top-[9vh]' : 'top-4'} z-[300] flex items-center bg-black/60 backdrop-blur-md text-white rounded-lg border border-white/10 shadow-lg transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}`}
      >
        <div className="px-4 py-2 border-r border-white/10 flex items-center bg-white/5">
          <span className="text-[11px] font-medium text-white/90 whitespace-nowrap capitalize">
            {getBlockName(block.blockType)}
          </span>
        </div>

        {!isHero ? (
          <>
            <button
              onClick={() => !block.isLocked && sendAction('BLOCK_MOVE_UP')}
              disabled={block.isLocked}
              className={`px-3 py-2 transition-colors flex items-center justify-center text-[11px] ${block.isLocked ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 text-white/70 hover:text-white'}`}
              title={isHorizontalFlow ? "Geser ke Kiri" : "Pindah ke Atas"}
            >
              {isHorizontalFlow ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => !block.isLocked && sendAction('BLOCK_MOVE_DOWN')}
              disabled={block.isLocked}
              className={`px-3 py-2 transition-colors flex items-center justify-center text-[11px] border-r border-white/10 ${block.isLocked ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 text-white/70 hover:text-white'}`}
              title={isHorizontalFlow ? "Geser ke Kanan" : "Pindah ke Bawah"}
            >
              {isHorizontalFlow ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => sendAction('BLOCK_TOGGLE_LOCK')}
              className={`px-3 py-2 transition-colors flex items-center justify-center text-[11px] border-r border-white/10 ${block.isLocked ? 'bg-[#ff9e00]/10 text-[#ff9e00]' : 'hover:bg-white/10 text-white/70 hover:text-white'}`}
              title={block.isLocked ? "Buka Kunci Blok" : "Kunci Blok"}
            >
              {block.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => !block.isLocked && sendAction('BLOCK_TOGGLE_VISIBILITY')}
              disabled={block.isLocked}
              className={`px-3 py-2 transition-colors flex items-center justify-center text-[11px] border-r border-white/10 ${block.isLocked ? 'opacity-30 cursor-not-allowed text-white' : (!block.isVisible ? 'bg-rose-500/10 text-rose-400' : 'hover:bg-white/10 text-white/70 hover:text-white')}`}
              title={block.isVisible ? "Sembunyikan Blok" : "Tampilkan Blok"}
            >
              {block.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                if (!block.isLocked) {
                  sendAction('BLOCK_DELETE');
                }
              }}
              disabled={block.isLocked}
              className={`px-3 py-2 transition-colors flex items-center justify-center text-[11px] ${block.isLocked ? 'opacity-30 cursor-not-allowed text-white' : 'text-white/70 hover:text-white hover:bg-rose-500'}`}
              title="Hapus Blok"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <div className="px-4 py-2 flex items-center justify-center text-[11px] text-white/30 bg-black/20 cursor-not-allowed" title="Blok Utama (Tidak bisa dipindah atau disembunyikan)">
            <Lock className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Jika blok disembunyikan, berikan overlay peringatan dan arsir */}
      {!block.isVisible && (
        <>
          {/* Arsir Biru Diagonal */}
          <div
            className="absolute inset-0 z-[180] rounded-none cursor-not-allowed"
            style={{
              background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 255, 255, 0.03) 10px, rgba(255, 255, 255, 0.03) 20px)'
            }}
          />
          {/* Badge Peringatan */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[185] bg-zinc-950/90 text-white/80 px-4 py-2 rounded-none text-[9px] font-mono font-bold uppercase tracking-widest pointer-events-none flex items-center gap-2 backdrop-blur-md border border-white/10">
            <EyeOff className="w-3.5 h-3.5 text-rose-500" />
            <span>Blok Disembunyikan</span>
          </div>
        </>
      )}

      {/* Jika blok dikunci, berikan overlay border kuning/orange putus-putus dan badge kecil */}
      {block.isLocked && block.isVisible && (
        <>
          <div className="absolute inset-0 z-[190] rounded-none border-2 border-dashed border-[#ff9e00]/20 pointer-events-none" />
          <div className="absolute top-4 left-4 z-[200] bg-zinc-950/90 backdrop-blur-md text-[#ff9e00] px-3 py-1.5 rounded-none text-[8px] font-mono font-bold uppercase tracking-widest pointer-events-none flex items-center gap-1.5 border border-[#ff9e00]/20">
            <Lock className="w-3 h-3" />
            <span>Terkunci</span>
          </div>
        </>
      )}

      {/* Konten Asli */}
      <div className={`transition-all duration-300 ${!block.isVisible ? 'pointer-events-none select-none blur-[1px] opacity-40 grayscale group-hover/block:opacity-70' : ''} ${block.isLocked ? 'pointer-events-none select-none' : ''} ${isHorizontalFlow ? 'flex flex-row flex-nowrap shrink-0 h-full w-full items-stretch' : ''} ${isHero ? (isHorizontalFlow ? 'h-full w-full' : 'w-full h-full') : ''}`}
        {...(!block.isVisible || block.isLocked ? { inert: true } as any : {})}
      >
        {children}
      </div>

      {/* Tombol Tambah Bagian (Divider Line) */}
      {!isHorizontalFlow && isEditor && (
        <div className={`absolute left-0 right-0 -bottom-3 h-6 flex items-center justify-center transition-opacity z-[220] ${isHovered ? 'opacity-100' : 'opacity-0 group-hover/block:opacity-100'}`}>
          <div className="absolute inset-0 flex items-center pointer-events-none">
            <div className="w-full border-t border-dashed border-[#0099ff]/30"></div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.postMessage({ type: 'OPEN_LIBRARY', insertIndex: block.orderIndex + 1 }, window.location.origin);
            }}
            className="relative px-5 py-2 rounded-full bg-[#0099ff] text-white text-[11px] font-semibold tracking-wide flex items-center gap-2 hover:bg-[#0077cc] hover:scale-105 transition-all shadow-md shadow-[#0099ff]/20 z-10 pointer-events-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Section</span>
          </button>
        </div>
      )}

      {/* Tombol Tambah Bagian Horizontal */}
      {isHorizontalFlow && isEditor && (
        <div className={`absolute top-0 bottom-0 -right-3 w-6 flex items-center justify-center transition-opacity z-[220] ${isHovered ? 'opacity-100' : 'opacity-0 group-hover/block:opacity-100'}`}>
          <div className="absolute inset-0 flex justify-center pointer-events-none">
            <div className="h-full border-l border-dashed border-[#0099ff]/30"></div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.postMessage({ type: 'OPEN_LIBRARY', insertIndex: block.orderIndex + 1 }, window.location.origin);
            }}
            className="relative w-8 h-8 rounded-full bg-[#0099ff] text-white flex items-center justify-center hover:bg-[#0077cc] hover:scale-110 transition-all shadow-md shadow-[#0099ff]/20 z-10 pointer-events-auto"
            title="Tambah Section di Sini"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
