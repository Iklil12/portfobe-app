"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

interface LinkData {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
}

export default function LinksPage() {
  const [mounted, setMounted] = useState(false);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [originalLinks, setOriginalLinks] = useState<LinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // STATE BARU: Untuk mendeteksi proses penambahan link
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
        setOriginalLinks(JSON.parse(JSON.stringify(data)));
      }
    } finally {
      // Delay tipis agar efek skeleton shimmer terlihat premium
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const hasChanges = JSON.stringify(links) !== JSON.stringify(originalLinks);

  const updateLocalLink = (id: string, data: Partial<LinkData>) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const saveAllChanges = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Menyimpan perubahan...', {
        style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });
    try {
      const changedLinks = links.filter((link, index) => {
        return JSON.stringify(link) !== JSON.stringify(originalLinks[index]);
      });

      await Promise.all(changedLinks.map(link => 
        fetch(`/api/links/${link.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(link)
        })
      ));

      setOriginalLinks(JSON.parse(JSON.stringify(links)));
      toast.success("Perubahan tersimpan!", { 
          id: toastId,
          iconTheme: { primary: '#22c55e', secondary: '#0a0a0a' },
          style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
      });
    } catch (error) {
      toast.error("Gagal menyimpan", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  // LOGIKA TAMBAH LINK DIPERBARUI DENGAN LOADING STATE
  const addLink = async () => {
    setIsAdding(true); 
    try {
      const res = await fetch('/api/links', { method: 'POST' });
      if (res.ok) {
        const newLink = await res.json();
        const updated = [...links, newLink];
        setLinks(updated);
        setOriginalLinks(JSON.parse(JSON.stringify(updated)));
        toast.success("Link ditambahkan", {
            icon: '🔗',
            style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
        });
      }
    } finally {
      setIsAdding(false); 
    }
  };

  const confirmDelete = async () => {
    if (!linkToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/links/${linkToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        const updated = links.filter(l => l.id !== linkToDelete);
        setLinks(updated);
        setOriginalLinks(JSON.parse(JSON.stringify(updated)));
        toast.success("Link terhapus", {
          style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' },
          iconTheme: { primary: '#ef4444', secondary: '#0a0a0a' }
        });
      }
    } finally {
      setIsDeleting(false);
      setLinkToDelete(null);
    }
  };

  const getIconClass = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return 'fab fa-instagram';
    if (p.includes('behance')) return 'fab fa-behance';
    if (p.includes('whatsapp')) return 'fab fa-whatsapp';
    if (p.includes('github')) return 'fab fa-github';
    if (p.includes('linkedin')) return 'fab fa-linkedin-in';
    if (p.includes('youtube')) return 'fab fa-youtube';
    if (p.includes('x') || p.includes('twitter')) return 'fab fa-x-twitter';
    if (p.includes('tiktok')) return 'fab fa-tiktok';
    if (p.includes('dribbble')) return 'fab fa-dribbble';
    return 'fas fa-link';
  };

  const deleteModalContent = linkToDelete ? (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={() => !isDeleting && setLinkToDelete(null)}
      ></div>
      
      <div className="relative bg-white rounded-[2rem] p-8 md:p-10 max-w-sm w-full shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 animate-enter z-10">
        <div className="w-16 h-16 bg-slate-100 border border-slate-200 shadow-inner text-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <i className="fas fa-trash-alt text-xl"></i>
        </div>
        
        <h3 className="text-2xl font-black text-center text-slate-900 mb-3 tracking-tight">
          Hapus Tautan?
        </h3>
        
        <p className="text-center text-slate-500 mb-8 text-sm font-medium leading-relaxed px-2">
          Tautan ini akan dihapus secara permanen dan tidak akan ditampilkan lagi di portofolio publik Anda.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button 
            onClick={() => setLinkToDelete(null)} 
            disabled={isDeleting}
            className="w-full sm:flex-1 px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-700 active:scale-95 transition-all text-sm disabled:opacity-50"
          >
            Batalkan
          </button>
          <button 
            onClick={confirmDelete} 
            disabled={isDeleting} 
            className="w-full sm:flex-1 px-6 py-3.5 bg-slate-900 hover:bg-rose-600 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isDeleting ? <div className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div> : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans relative overflow-hidden selection:bg-slate-200 selection:text-slate-900 pb-20">
      
      {/* Global Styles Injected for Animations & Fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { 
            opacity: 0; 
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(30px) scale(0.98); filter: blur(3px); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        .animate-spin-slow { animation: spin 10s linear infinite; }

        .bg-grid-slate {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px);
        }

        .shimmer { background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}} />

      {/* ELEMEN DEKORASI BACKGROUND MONOKROM */}
      <div className="absolute inset-0 bg-grid-slate pointer-events-none z-0 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-slate-200/50 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">

        {mounted && createPortal(deleteModalContent, document.body)}

        {/* --- HEADER SECTION --- */}
        <div className="mb-10 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-enter" style={{animationDelay: '100ms'}}>
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-5 sm:mb-6 shadow-sm">
              <i className="fas fa-link text-slate-400"></i> Integrasi Publik
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2 flex items-center justify-center md:justify-start gap-3">
              Social Links.
              <i className="fas fa-asterisk text-slate-300 text-[1.2rem] md:text-[1.8rem] animate-spin-slow"></i>
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-lg">Kelola direktori tautan sosial media dan kontak profesional Anda.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {hasChanges && (
              <button 
                onClick={saveAllChanges} 
                disabled={isSaving} 
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 text-white rounded-xl sm:rounded-full text-[11px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(0,0,0,0.1)] active:scale-95 transition-all hover:bg-slate-800 hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] disabled:opacity-50"
              >
                {isSaving ? <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div> : <i className="fas fa-check text-[10px]"></i>}
                Simpan
              </button>
            )}
            <button 
              onClick={addLink} 
              disabled={isAdding} 
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-slate-900 border border-slate-200 rounded-xl sm:rounded-full text-[11px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
            >
              {isAdding ? <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div> : <i className="fas fa-plus text-[10px]"></i>} 
              {isAdding ? 'Membuat...' : 'Tambah Baru'}
            </button>
          </div>
        </div>

        {/* --- LIST LINKS --- */}
        <div className="space-y-4 sm:space-y-5">
          {isLoading ? (
            // Skeleton Premium Loading
            [1, 2, 3].map((i, index) => (
              <div 
                  key={i} 
                  className="h-auto sm:h-28 w-full bg-slate-50/50 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center p-5 sm:p-6 gap-4 sm:gap-6 shadow-sm animate-enter"
                  style={{animationDelay: `${index * 80}ms`, opacity: 0}}
              >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-200 rounded-2xl shrink-0 shimmer border border-slate-100"></div>
                  <div className="flex-1 w-full space-y-3">
                      <div className="h-5 w-2/3 sm:w-1/3 bg-slate-200 rounded-md shimmer"></div>
                      <div className="h-3 w-full sm:w-1/2 bg-slate-200 rounded-md shimmer"></div>
                  </div>
                  <div className="w-full sm:w-24 h-10 bg-slate-200 rounded-xl shimmer mt-2 sm:mt-0"></div>
              </div>
            ))
          ) : links.length === 0 && !isAdding ? (
            // Empty State Monokrom
             <div className="py-20 sm:py-24 flex flex-col items-center justify-center text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 hover:border-slate-300 transition-colors animate-enter" style={{animationDelay: '200ms'}}>
               <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300 text-2xl shadow-sm">
                 <i className="fas fa-link"></i>
               </div>
               <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 tracking-tight">Belum ada tautan.</h3>
               <p className="text-xs sm:text-sm font-medium text-slate-500 mb-8 max-w-xs leading-relaxed px-4">
                 Tambahkan tautan portofolio, sosial media, atau email Anda di sini untuk memudahkan klien menghubungi Anda.
               </p>
               <button 
                  onClick={addLink} 
                  disabled={isAdding}
                  className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest bg-slate-900 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full hover:bg-slate-800 transition-colors shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-50"
               >
                  <i className="fas fa-plus"></i> Tambah Tautan Pertama
               </button>
             </div>
          ) : (
            // List Data Asli
            <>
              {links.map((link, index) => {
                const iconClass = getIconClass(link.platform);
                return (
                  <div 
                    key={link.id} 
                    className="group bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-slate-300 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start sm:items-center transition-all duration-500 animate-enter"
                    style={{animationDelay: `${index * 80}ms`, opacity: 0}}
                  >
                    <div className="flex w-full items-center gap-4 sm:gap-6">

                      {/* Icon Box Premium */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center text-2xl sm:text-3xl shrink-0 group-hover:scale-105 group-hover:rotate-3 group-hover:bg-slate-900 group-hover:text-white group-hover:shadow-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] relative overflow-hidden ml-1 sm:ml-2">
                        <i className={iconClass}></i>
                        <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[20px]"></div>
                      </div>

                      {/* Input Fields */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1.5 sm:gap-2 relative">
                        <input 
                          type="text" 
                          value={link.platform} 
                          onChange={(e) => updateLocalLink(link.id, { platform: e.target.value })}
                          className="w-full bg-transparent font-black text-slate-900 focus:outline-none focus:text-slate-700 text-lg sm:text-xl transition-colors placeholder:text-slate-300 tracking-tight relative z-10"
                          placeholder="Nama Platform (cth: Instagram)"
                        />
                        <div className="flex items-center gap-2 text-slate-300 focus-within:text-slate-900 transition-colors relative z-10">
                            <i className="fas fa-link text-[10px] sm:text-xs"></i>
                            <input 
                              type="url" 
                              value={link.url} 
                              onChange={(e) => updateLocalLink(link.id, { url: e.target.value })}
                              className="w-full bg-transparent text-[11px] sm:text-xs font-semibold text-slate-500 focus:outline-none focus:text-slate-900 truncate placeholder:text-slate-300 transition-colors"
                              placeholder="https://..."
                            />
                        </div>
                      </div>
                    </div>

                    {/* ACTION BAR (Responsive) */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      
                      {/* Switch Status */}
                      <div className="flex items-center gap-3">
                          <span className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest transition-colors ${link.isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                            {link.isActive ? 'Visible' : 'Hidden'}
                          </span>

                        {/* Toggle Button iOS Style */}
                        <button
                          onClick={() => updateLocalLink(link.id, { isActive: !link.isActive })}
                          className={`relative inline-flex h-6 w-11 sm:h-7 sm:w-12 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${
                            link.isActive ? 'bg-slate-900' : 'bg-slate-200 hover:bg-slate-300'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full transition-transform duration-300 shadow-sm ${
                              link.isActive ? 'translate-x-6 sm:translate-x-6 bg-white' : 'translate-x-1 bg-white'
                          }`} />
                        </button>
                      </div>

                      <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>

                      {/* Delete Button Monokrom */}
                      <button 
                        onClick={() => setLinkToDelete(link.id)}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 flex items-center justify-center active:scale-90 transition-all duration-300 shrink-0 shadow-sm"
                        title="Hapus tautan"
                      >
                        <i className="fas fa-trash-alt text-[11px] sm:text-xs"></i>
                      </button>
                      
                    </div>
                  </div>
                );
              })}

              {/* SKELETON EFEK MUNCUL SAAT "TAMBAH BARU" DIKLIK */}
              {isAdding && (
                <div className="h-auto sm:h-28 w-full bg-slate-50/50 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center p-5 sm:p-6 gap-4 sm:gap-6 shadow-sm animate-enter">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-200 rounded-2xl shrink-0 shimmer border border-slate-100"></div>
                    <div className="flex-1 w-full space-y-3">
                        <div className="h-5 w-2/3 sm:w-1/3 bg-slate-200 rounded-md shimmer"></div>
                        <div className="h-3 w-full sm:w-1/2 bg-slate-200 rounded-md shimmer"></div>
                    </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}