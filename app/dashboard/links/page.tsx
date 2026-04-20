"use client";

import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface LinkData {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
}

export default function LinksPage() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [originalLinks, setOriginalLinks] = useState<LinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // STATE BARU: Untuk mendeteksi proses penambahan link
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
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
      setIsLoading(false);
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
    setIsAdding(true); // Nyalakan loading
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
      setIsAdding(false); // Matikan loading
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

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-10 font-sans selection:bg-slate-200 selection:text-slate-900 pb-32">
      
      {/* Global Styles Injected for Animations & Fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { 
            opacity: 0; 
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        .animate-pulse-monochrome {
            animation: pulseMono 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulseMono {
            0%, 100% { opacity: 1; }
            50% { opacity: .4; }
        }

        .animate-enter-modal { 
            animation: modalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes modalEnter {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}} />

      <Toaster position="top-center" />

      {/* --- MODAL HAPUS --- */}
      {linkToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
            onClick={() => !isDeleting && setLinkToDelete(null)}
          ></div>
          
          <div className="relative bg-white rounded-[2rem] p-8 md:p-10 max-w-sm w-full shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-slate-100 animate-enter-modal z-10">
            <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm text-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 relative group">
              <i className="fas fa-trash-alt text-xl group-hover:text-red-500 transition-colors"></i>
            </div>
            
            <h3 className="text-2xl font-extrabold text-center text-slate-900 mb-3 tracking-tight">
              Hapus Tautan?
            </h3>
            
            <p className="text-center text-slate-500 mb-10 text-sm font-medium leading-relaxed px-2">
              Tautan ini akan dihapus secara permanen dan tidak akan ditampilkan lagi di portofolio publik Anda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setLinkToDelete(null)} 
                disabled={isDeleting}
                className="w-full sm:w-1/2 px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl font-bold text-slate-700 active:scale-95 transition-all text-sm disabled:opacity-50"
              >
                Batalkan
              </button>
              <button 
                onClick={confirmDelete} 
                disabled={isDeleting} 
                className="w-full sm:w-1/2 px-6 py-3.5 bg-slate-900 hover:bg-red-600 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all group flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isDeleting ? <div className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div> : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-enter" style={{animationDelay: '100ms'}}>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            Social <span className="font-light text-slate-400">Links.</span>
          </h1>
          <p className="text-sm font-medium text-slate-500">Kelola direktori tautan sosial media dan kontak profesional Anda.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          {hasChanges && (
            <button 
              onClick={saveAllChanges} 
              disabled={isSaving} 
              className="flex-1 md:flex-none px-6 py-3.5 bg-slate-900 text-white rounded-full text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(0,0,0,0.1)] active:scale-95 transition-all hover:bg-[#ff9e00] hover:text-slate-900 hover:shadow-[0_10px_20px_rgba(255,158,0,0.2)] disabled:opacity-50"
            >
              {isSaving ? <div className="w-3.5 h-3.5 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div> : <i className="fas fa-check text-[10px]"></i>}
              Simpan
            </button>
          )}
          <button 
            onClick={addLink} 
            disabled={isAdding} // Nonaktifkan tombol saat loading
            className="flex-1 md:flex-none px-6 py-3.5 bg-white text-slate-900 border border-slate-200 rounded-full text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
          >
            {isAdding ? <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div> : <i className="fas fa-plus text-[10px]"></i>} 
            {isAdding ? 'Membuat...' : 'Tambah Baru'}
          </button>
        </div>
      </div>

      {/* --- LIST LINKS --- */}
      <div className="space-y-4">
        {isLoading ? (
          // Skeleton Loading Awal
          [1, 2, 3].map((i, index) => (
            <div 
                key={i} 
                className="h-28 w-full bg-white rounded-[2rem] border border-slate-100 flex items-center p-6 gap-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)] animate-enter"
                style={{animationDelay: `${index * 80}ms`, opacity: 0}}
            >
                <div className="w-14 h-14 bg-slate-100 rounded-2xl shrink-0 animate-pulse-monochrome"></div>
                <div className="flex-1 space-y-3">
                    <div className="h-5 w-1/3 bg-slate-100 rounded-lg animate-pulse-monochrome"></div>
                    <div className="h-3 w-1/2 bg-slate-50 rounded-full animate-pulse-monochrome"></div>
                </div>
            </div>
          ))
        ) : links.length === 0 && !isAdding ? (
          // Empty State
           <div className="py-24 flex flex-col items-center justify-center text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 hover:border-slate-300 transition-colors animate-enter" style={{animationDelay: '200ms'}}>
             <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300 text-2xl shadow-sm">
               <i className="fas fa-link"></i>
             </div>
             <h3 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">Belum ada tautan.</h3>
             <p className="text-sm font-medium text-slate-500 mb-8 max-w-xs leading-relaxed">
               Tambahkan tautan portofolio, sosial media, atau email Anda di sini untuk memudahkan klien menghubungi Anda.
             </p>
             <button 
                onClick={addLink} 
                disabled={isAdding}
                className="text-xs font-extrabold uppercase tracking-widest bg-slate-900 text-white px-8 py-3.5 rounded-full hover:bg-slate-800 transition-colors shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-50"
             >
                <i className="fas fa-plus"></i> Tambah Tautan Pertama
             </button>
           </div>
        ) : (
          // List Data (Menggunakan Fragment agar Skeleton Tambahan bisa masuk di bawah)
          <>
            {links.map((link, index) => {
              const iconClass = getIconClass(link.platform);
              return (
                <div 
                  key={link.id} 
                  className="group bg-white p-5 sm:p-6 rounded-[2rem] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-slate-200 flex flex-col sm:flex-row gap-5 items-center transition-all duration-300 animate-enter"
                  style={{animationDelay: `${index * 80}ms`, opacity: 0}}
                >
                  <div className="flex w-full items-center gap-4 sm:gap-6">

                    {/* Icon Box */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center text-2xl sm:text-3xl shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-slate-900 group-hover:text-white group-hover:shadow-md transition-all duration-500 ease-out relative overflow-hidden ml-1 sm:ml-2">
                      <i className={iconClass}></i>
                      <div className="absolute inset-0 bg-[#ff9e00]/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[20px]"></div>
                    </div>

                    {/* Input Fields */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2 relative">
                      <input 
                        type="text" 
                        value={link.platform} 
                        onChange={(e) => updateLocalLink(link.id, { platform: e.target.value })}
                        className="w-full bg-transparent font-extrabold text-slate-900 focus:outline-none focus:text-[#ff9e00] text-lg sm:text-xl transition-colors placeholder:text-slate-300 tracking-tight relative z-10"
                        placeholder="Nama Platform (cth: Instagram)"
                      />
                      <div className="flex items-center gap-2 text-slate-400 focus-within:text-slate-900 transition-colors relative z-10">
                          <i className="fas fa-link text-[10px]"></i>
                          <input 
                            type="url" 
                            value={link.url} 
                            onChange={(e) => updateLocalLink(link.id, { url: e.target.value })}
                            className="w-full bg-transparent text-xs font-medium text-slate-500 focus:outline-none focus:text-slate-900 truncate placeholder:text-slate-300 transition-colors"
                            placeholder="https://..."
                          />
                      </div>
                    </div>
                  </div>

                  {/* ACTION BAR */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    
                    {/* Switch Status */}
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-extrabold uppercase tracking-widest transition-colors ${link.isActive ? 'text-slate-900' : 'text-slate-300'}`}>
                          {link.isActive ? 'Visible' : 'Hidden'}
                        </span>

                      {/* Toggle Button */}
                      <button
                        onClick={() => updateLocalLink(link.id, { isActive: !link.isActive })}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none ${
                          link.isActive ? 'bg-slate-900' : 'bg-slate-200 hover:bg-slate-300'
                        }`}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full transition-transform duration-300 shadow-sm ${
                            link.isActive ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'
                        }`} />
                      </button>
                    </div>

                    <div className="w-[1px] h-8 bg-slate-100 hidden sm:block"></div>

                    {/* Delete Button */}
                    <button 
                      onClick={() => setLinkToDelete(link.id)}
                      className="w-10 h-10 rounded-full bg-transparent text-slate-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center active:scale-90 transition-all duration-200 shrink-0"
                      title="Hapus tautan"
                    >
                      <i className="fas fa-trash-alt text-sm"></i>
                    </button>
                    
                  </div>
                </div>
              );
            })}

            {/* SKELETON EFEK MUNCUL SAAT "TAMBAH BARU" DIKLIK (SEBELUM DATA MASUK) */}
            {isAdding && (
              <div className="h-28 w-full bg-white rounded-[2rem] border border-slate-100 flex items-center p-6 gap-6 shadow-sm animate-enter">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 rounded-2xl shrink-0 animate-pulse-monochrome border border-slate-100"></div>
                  <div className="flex-1 space-y-3">
                      <div className="h-6 w-1/3 bg-slate-50 rounded-lg animate-pulse-monochrome"></div>
                      <div className="h-4 w-1/2 bg-slate-50 rounded-full animate-pulse-monochrome"></div>
                  </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}