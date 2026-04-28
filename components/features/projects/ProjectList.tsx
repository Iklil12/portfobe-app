"use client";

import React from 'react';

const getYouTubeThumbnail = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : url;
};

export function ProjectList({ state, actions }: { state: any, actions: any }) {
  const { isLoading, filteredItems, activeTab } = state;
  const { handleOpenModal, confirmDelete } = actions;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-2.5 border border-slate-100 shadow-sm flex flex-col h-[380px] sm:h-[400px]">
            <div className="aspect-[4/3] rounded-2xl sm:rounded-3xl shimmer shrink-0"></div>
            <div className="p-3 sm:p-4 pt-4 sm:pt-5 flex-1 flex flex-col">
              <div className="h-4 sm:h-5 shimmer rounded-md w-3/4 mb-3"></div>
              <div className="h-2.5 sm:h-3 shimmer rounded-md w-full mb-2"></div>
              <div className="h-2.5 sm:h-3 shimmer rounded-md w-4/5 mb-5 sm:mb-6"></div>
              
              <div className="mt-auto flex gap-2">
                <div className="h-10 shimmer rounded-xl flex-1"></div>
                <div className="h-10 w-11 sm:w-12 shimmer rounded-xl shrink-0"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="py-20 sm:py-24 flex flex-col items-center justify-center text-center animate-enter" style={{animationDelay: '150ms'}}>
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center mb-5 sm:mb-6 shadow-sm border border-slate-100">
          <i className="fas fa-folder-open text-2xl sm:text-3xl text-slate-300"></i>
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2 tracking-tight">
          {activeTab === 'all' ? 'Belum ada data' : `Tidak ada ${activeTab} ditemukan`}
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm mb-6 sm:mb-8 font-medium px-4">Perkaya profil Anda dengan menambahkan pencapaian terbaru.</p>
        {activeTab === 'all' && (
          <button onClick={() => handleOpenModal()} className="text-slate-900 bg-white border border-slate-200 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-xs font-extrabold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            Unggah Data Pertama
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {filteredItems.map((item: any, index: number) => (
        <div 
          key={item.id} 
          className="group bg-white rounded-[1.5rem] sm:rounded-[2rem] p-2.5 border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col relative animate-enter"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100/50">
            <img 
              src={item.projectType === 'video' ? getYouTubeThumbnail(item.mediaUrl) : item.mediaUrl} 
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-sm text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-slate-700 flex items-center gap-1.5">
              <i className={`fas ${item.itemType === 'certificate' ? 'fa-award text-slate-500' : item.projectType === 'video' ? 'fa-play text-slate-500' : 'fa-image text-slate-500'}`}></i>
              {item.itemType === 'certificate' ? 'Sertifikat' : item.projectType}
            </div>
          </div>
          
          <div className="p-3 sm:p-4 pt-4 sm:pt-5 flex-1 flex flex-col">
            <div className="flex justify-between items-start gap-2 mb-1.5 sm:mb-2">
              <h3 className="font-black text-base sm:text-[17px] text-slate-900 line-clamp-1 tracking-tight">{item.title}</h3>
              {item.itemType === 'certificate' && (
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 text-[7px] sm:text-[8px] shadow-sm" title="Verified Credential">
                  <i className="fas fa-check"></i>
                </div>
              )}
            </div>
            
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
              {item.description || "Tidak ada rincian deskripsi tambahan untuk karya ini."}
            </p>
            
            <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[8px] sm:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Tahun</p>
                <p className="text-xs sm:text-sm font-black text-slate-900">{item.year || new Date(item.createdAt).getFullYear()}</p>
              </div>
              
              {item.itemType === 'certificate' && item.status ? (
                <div className="text-right">
                  <p className="text-[8px] sm:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Pencapaian</p>
                  <p className="text-xs sm:text-sm font-black text-slate-800 truncate max-w-[100px] sm:max-w-[120px]">{item.status}</p>
                </div>
              ) : item.itemType === 'certificate' && item.issuer ? (
                <div className="text-right">
                  <p className="text-[8px] sm:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Penerbit</p>
                  <p className="text-xs sm:text-sm font-black text-slate-800 truncate max-w-[100px] sm:max-w-[120px]">{item.issuer}</p>
                </div>
              ) : null}
            </div>
            
            <div className="mt-4 sm:mt-5 flex items-center gap-2">
              <button 
                onClick={() => handleOpenModal(item)} 
                className="flex-1 bg-slate-900 text-white rounded-xl sm:rounded-[1rem] py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                <i className="far fa-edit text-[10px]"></i> Edit Karya
              </button>
              
              <button 
                onClick={() => confirmDelete(item.id, item.title, item.itemType)} 
                className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 bg-white border-2 border-slate-100 text-slate-400 rounded-xl sm:rounded-[1rem] flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm active:scale-95" 
                title="Hapus"
              >
                <i className="far fa-trash-alt text-[12px] sm:text-[13px]"></i>
              </button>
            </div>
            
          </div>
        </div>
      ))}
    </div>
  );
}
