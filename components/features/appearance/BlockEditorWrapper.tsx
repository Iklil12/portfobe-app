"use client";

import React, { useState } from 'react';

interface BlockEditorWrapperProps {
  block: any;
  isEditor: boolean;
  children: React.ReactNode;
  isHero?: boolean;
}

export function BlockEditorWrapper({ block, isEditor, children, isHero = false }: BlockEditorWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Jika bukan mode editor, render anak secara normal jika visible
  if (!isEditor) {
    return block.isVisible ? <>{children}</> : null;
  }

  // Jika blok disembunyikan tapi di mode editor, kita tampilkan secara redup
  // atau bisa juga merender placeholder sederhana agar bisa di-unhide.
  const hiddenOpacity = block.isVisible ? '' : 'opacity-40 grayscale hover:opacity-70 transition-opacity';

  const sendAction = (actionType: string) => {
    if (window.parent) {
      window.parent.postMessage({
        type: actionType,
        blockId: block.id,
        currentVisibility: block.isVisible
      }, '*');
    }
  };

  const getBlockName = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div 
      className={`relative group/block transition-all duration-300 ${hiddenOpacity} ${isHovered ? 'z-50' : 'z-10'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Garis Border Hover */}
      {isHovered && (
        <div className="absolute inset-0 border-2 border-blue-500/50 pointer-events-none z-50 transition-all rounded-xl" />
      )}

      {/* Floating Toolbar */}
      <div 
        className={`absolute right-4 top-4 z-[100] flex items-center bg-[#111] text-white rounded-lg shadow-2xl transition-all duration-300 overflow-hidden border border-white/10 ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}`}
      >
        <div className="px-3 py-1.5 border-r border-white/10 flex items-center bg-black/40">
          <span className="text-[10px] font-bold tracking-widest uppercase text-white/80 whitespace-nowrap">
            {getBlockName(block.blockType)}
          </span>
        </div>
        
        {!isHero ? (
          <>
            <button 
              onClick={() => sendAction('BLOCK_MOVE_UP')}
              className="px-2.5 py-1.5 hover:bg-white/20 transition-colors flex items-center justify-center text-[11px]"
              title="Pindah ke Atas"
            >
              <i className="fas fa-arrow-up"></i>
            </button>
            <button 
              onClick={() => sendAction('BLOCK_MOVE_DOWN')}
              className="px-2.5 py-1.5 hover:bg-white/20 transition-colors flex items-center justify-center text-[11px] border-r border-white/10"
              title="Pindah ke Bawah"
            >
              <i className="fas fa-arrow-down"></i>
            </button>

            <button 
              onClick={() => sendAction('BLOCK_TOGGLE_VISIBILITY')}
              className={`px-3 py-1.5 hover:bg-white/20 transition-colors flex items-center justify-center text-[11px] ${!block.isVisible ? 'text-red-400' : ''}`}
              title={block.isVisible ? "Sembunyikan Blok" : "Tampilkan Blok"}
            >
              <i className={`fas ${block.isVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
            </button>
          </>
        ) : (
          <div className="px-3 py-1.5 flex items-center justify-center text-[11px] text-white/40 bg-black/40 cursor-not-allowed" title="Blok Utama (Tidak bisa dipindah atau disembunyikan)">
            <i className="fas fa-lock"></i>
          </div>
        )}
      </div>

      {/* Jika blok disembunyikan, berikan overlay peringatan */}
      {!block.isVisible && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-black/80 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest pointer-events-none flex items-center gap-2 backdrop-blur-sm shadow-xl border border-white/10">
          <i className="fas fa-eye-slash text-red-400"></i> Blok Disembunyikan
        </div>
      )}

      {/* Konten Asli */}
      <div className={`transition-all duration-300 ${!block.isVisible ? 'pointer-events-none blur-[1px]' : ''}`}>
        {children}
      </div>
    </div>
  );
}
