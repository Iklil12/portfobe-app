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
    const toastId = toast.loading('Menyimpan perubahan...');
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
      toast.success("Perubahan tersimpan!", { id: toastId });
    } catch (error) {
      toast.error("Gagal menyimpan", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const addLink = async () => {
    const res = await fetch('/api/links', { method: 'POST' });
    if (res.ok) {
      const newLink = await res.json();
      const updated = [...links, newLink];
      setLinks(updated);
      setOriginalLinks(JSON.parse(JSON.stringify(updated)));
      toast.success("Link ditambahkan");
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
        toast.success("Link terhapus");
      }
    } finally {
      setIsDeleting(false);
      setLinkToDelete(null);
    }
  };

  const getIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return { icon: 'fab fa-instagram', bg: 'bg-pink-50', text: 'text-pink-500' };
    if (p.includes('behance')) return { icon: 'fab fa-behance', bg: 'bg-blue-50', text: 'text-blue-500' };
    if (p.includes('whatsapp')) return { icon: 'fab fa-whatsapp', bg: 'bg-green-50', text: 'text-green-500' };
    if (p.includes('github')) return { icon: 'fab fa-github', bg: 'bg-gray-100', text: 'text-gray-900' };
    return { icon: 'fas fa-link', bg: 'bg-gray-50', text: 'text-gray-400' };
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 min-h-screen pb-32">
      <Toaster position="top-center" />

      {/* --- MODAL HAPUS --- */}
      {linkToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-trash-alt text-xl"></i>
            </div>
            <h3 className="text-xl font-bold text-center mb-6 text-gray-900">Hapus link ini?</h3>
            <div className="flex gap-3">
              <button onClick={() => setLinkToDelete(null)} className="flex-1 py-3.5 bg-gray-100 rounded-2xl font-bold text-gray-500 active:scale-95 transition-all">Batal</button>
              <button onClick={confirmDelete} className="flex-1 py-3.5 bg-red-600 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all hover:bg-red-700">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <p className="text-sm text-gray-500">Kelola tautan sosial media dan kontak yang muncul di profilmu.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          {hasChanges && (
            <button onClick={saveAllChanges} disabled={isSaving} className="flex-1 md:flex-none bg-blue-600 text-white px-8 py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-100 active:scale-90 transition-all hover:bg-blue-700">
              <i className={isSaving ? "fas fa-spinner fa-spin" : "fas fa-check"}></i>
              {isSaving ? "Menyimpan" : "Simpan"}
            </button>
          )}
          <button onClick={addLink} className="flex-1 md:flex-none bg-[#111827] text-white px-8 py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 shadow-xl active:scale-90 transition-all hover:bg-black">
            <i className="fas fa-plus"></i>
            Tambah Link
          </button>
        </div>
      </div>

      {/* --- LIST LINKS --- */}
      <div className="space-y-4">
        {isLoading ? (
          [1, 2].map((i) => <div key={i} className="h-40 w-full bg-white rounded-[2.5rem] animate-pulse border border-gray-100"></div>)
        ) : links.map((link) => {
          const style = getIcon(link.platform);
          return (
            <div key={link.id} className="group bg-white p-5 sm:p-7 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-5 items-center transition-all hover:shadow-lg">
              
              <div className="flex w-full items-center gap-5">
                <div className="cursor-grab text-gray-200 hover:text-gray-400 hidden sm:block transition-colors">
                  <i className="fas fa-grip-vertical"></i>
                </div>

                <div className={`w-14 h-14 rounded-2xl ${style.bg} ${style.text} flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <i className={style.icon}></i>
                </div>

                <div className="flex-1 min-w-0">
                  <input 
                    type="text" 
                    value={link.platform} 
                    onChange={(e) => updateLocalLink(link.id, { platform: e.target.value })}
                    className="w-full bg-transparent font-black text-gray-900 focus:outline-none text-lg mb-0.5"
                    placeholder="Platform"
                  />
                  <input 
                    type="text" 
                    value={link.url} 
                    onChange={(e) => updateLocalLink(link.id, { url: e.target.value })}
                    className="w-full bg-transparent text-xs text-gray-400 font-medium focus:outline-none truncate"
                    placeholder="URL"
                  />
                </div>
              </div>

              {/* --- BAGIAN YANG DIUBAH: ACTION BAR --- */}
              <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-5 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                
                {/* Label Status ON/OFF */}
                <div className="flex items-center">
                   <span className={`text-xs font-black uppercase tracking-widest ${link.isActive ? 'text-green-600' : 'text-red-500'}`}>
                     {link.isActive ? 'ON' : 'OFF'}
                   </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Toggle Switch (Merah saat Off, Hijau saat On) */}
                  <button
                    onClick={() => updateLocalLink(link.id, { isActive: !link.isActive })}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-500 focus:outline-none shadow-inner ${
                      link.isActive ? 'bg-green-500 shadow-lg shadow-green-100' : 'bg-red-500 shadow-lg shadow-red-100'
                    }`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
                        link.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>

                  {/* Tombol Hapus */}
                  <button 
                    onClick={() => setLinkToDelete(link.id)}
                    className="w-11 h-11 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white active:scale-75 transition-all duration-300 shadow-sm"
                  >
                    <i className="fas fa-trash-alt text-sm"></i>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}