"use client";

import React from 'react';

export function ProjectHeader({ actions }: { actions: any }) {
  const { handleOpenModal } = actions;
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-5 sm:gap-6 animate-enter">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-1.5 flex items-center gap-2.5 sm:gap-3">
          Karya & Sertifikat
          <i className="fas fa-asterisk text-slate-300 text-[1rem] md:text-[1.3rem] animate-spin-slow"></i>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">Kelola portofolio dan pencapaian profesional Anda.</p>
      </div>
      <button 
        onClick={() => handleOpenModal()} 
        className="w-full sm:w-auto bg-slate-900 text-white px-5 sm:px-6 py-3.5 rounded-xl sm:rounded-full text-[11px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md hover:bg-slate-800 hover:shadow-lg transition-all duration-300 active:scale-95"
      >
        <i className="fas fa-plus font-normal"></i> Tambah Data
      </button>
    </div>
  );
}
