"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast'; 
import { CldUploadWidget } from 'next-cloudinary';
import { showToast } from '@/lib/customToast'; 

type ProjectType = 'video' | 'photo' | 'certificate' | null;

const getYouTubeThumbnail = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : url;
};

export default function ProjectsPage() {
  const [mounted, setMounted] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectType, setProjectType] = useState<ProjectType>(null);
  
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'photo' | 'certificate'>('all');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState(""); 
  
  const [certIssuer, setCertIssuer] = useState("");
  const [certYear, setCertYear] = useState("");
  const [certStatus, setCertStatus] = useState(""); 

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [itemToDelete, setItemToDelete] = useState<{id: string, title: string, type: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "paperions_preset";

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      
      const [projRes, certRes] = await Promise.all([
        fetch('/api/projects').catch(() => null),
        fetch('/api/certificates').catch(() => null) 
      ]);

      const projData = projRes?.ok ? await projRes.json() : [];
      const certData = certRes?.ok ? await certRes.json() : [];

      const formattedProj = Array.isArray(projData) ? projData.map(p => ({ ...p, itemType: 'project' })) : [];
      const formattedCert = Array.isArray(certData) ? certData.map(c => ({ ...c, itemType: 'certificate', projectType: 'certificate' })) : [];

      const combined = [...formattedProj, ...formattedCert].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setItems(combined);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    } finally {
      setTimeout(() => setIsLoading(false), 600);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAllData(); 
  }, []);

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingId(item.id);
      setProjectType(item.projectType as ProjectType);
      setProjectTitle(item.title);
      setProjectDescription(item.description || "");
      setMediaUrl(item.mediaUrl || "");
      
      if (item.itemType === 'certificate') {
        setCertIssuer(item.issuer || "");
        setCertYear(item.year || "");
        setCertStatus(item.status || ""); 
      } else {
        setCertIssuer("");
        setCertYear("");
        setCertStatus("");
      }
    } else {
      setEditingId(null);
      setProjectType(null);
      setProjectTitle("");
      setProjectDescription("");
      setMediaUrl("");
      setCertIssuer("");
      setCertYear("");
      setCertStatus("");
    }
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setProjectType(null);
    }, 300); 
    document.body.style.overflow = 'unset'; 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectTitle) {
      showToast({ message: 'Judul wajib diisi!', id: 'err-title', icon: 'fa-exclamation-circle' });
      return;
    }
    if (!mediaUrl) {
      showToast({ message: 'Aset visual wajib dilampirkan!', id: 'err-media', icon: 'fa-image' });
      return;
    }
    if (projectType === 'certificate' && (!certIssuer || !certYear || !certStatus)) {
      showToast({ message: 'Lembaga, Tahun, dan Pencapaian/Status wajib diisi untuk sertifikat!', id: 'err-cert', icon: 'fa-exclamation-triangle' });
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(editingId ? 'Menyimpan perubahan...' : 'Mempublikasikan data...');
    
    const endpoint = projectType === 'certificate' ? '/api/certificates' : '/api/projects';
    const method = editingId ? 'PATCH' : 'POST';

    const payload = projectType === 'certificate' 
      ? { id: editingId, title: projectTitle, description: projectDescription, mediaUrl, issuer: certIssuer, year: certYear, status: certStatus }
      : { id: editingId, title: projectTitle, description: projectDescription, mediaUrl, projectType };
    
    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingId ? 'Data diperbarui!' : 'Data berhasil dipublikasikan!', { id: toastId });
        handleCloseModal();
        fetchAllData(); 
        setActiveTab(projectType || 'all'); 
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Terjadi kesalahan sistem.', { id: toastId });
      }
    } catch (error) {
      toast.error("Gagal terhubung ke server.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id: string, title: string, type: string) => {
    setItemToDelete({ id, title, type });
    document.body.style.overflow = 'hidden'; 
  };

  const cancelDelete = () => {
    setItemToDelete(null);
    document.body.style.overflow = 'unset';
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    
    const endpoint = itemToDelete.type === 'certificate' 
      ? `/api/certificates?id=${itemToDelete.id}` 
      : `/api/projects?id=${itemToDelete.id}`;
    
    try {
      const response = await fetch(endpoint, { method: 'DELETE' });

      if (response.ok) {
        showToast({ message: 'Data berhasil dihapus.', id: 'del-success', icon: 'fa-trash-alt' });
        fetchAllData(); 
      } else {
        const errorData = await response.json();
        showToast({ message: errorData.error || 'Gagal menghapus data.', id: 'del-err', icon: 'fa-exclamation-triangle' });
      }
    } catch (error) {
      showToast({ message: 'Gagal terhubung ke server.', id: 'del-net-err', icon: 'fa-wifi' });
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
      document.body.style.overflow = 'unset';
    }
  };

  const filteredItems = items.filter(p => activeTab === 'all' || p.projectType === activeTab);

  const deleteModalContent = itemToDelete ? (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={!isDeleting ? cancelDelete : undefined}></div>
      <div className="bg-white rounded-[2rem] w-full max-w-sm relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-enter border border-slate-100 flex flex-col overflow-hidden text-center p-8">
        <div className="w-16 h-16 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <i className="fas fa-exclamation-triangle text-2xl"></i>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Hapus Data?</h3>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Apakah Anda yakin ingin menghapus <span className="font-bold text-slate-900">"{itemToDelete.title}"</span>? Data akan hilang permanen.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button onClick={cancelDelete} disabled={isDeleting} className="w-full sm:flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors text-sm disabled:opacity-50">Batal</button>
          <button onClick={executeDelete} disabled={isDeleting} className="w-full sm:flex-1 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-rose-600 shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
            {isDeleting ? <i className="fas fa-circle-notch fa-spin text-white"></i> : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  const modalContent = isModalOpen ? (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={handleCloseModal}></div>
      <div className="bg-white rounded-[2rem] sm:rounded-3xl w-full max-w-2xl relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.1)] animate-enter border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        <button onClick={handleCloseModal} className="absolute top-5 right-5 sm:top-6 sm:right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100/50 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all z-20">
          <i className="fas fa-times text-sm"></i>
        </button>

        <div className="overflow-y-auto custom-scrollbar w-full h-full">
          <div className="p-6 sm:p-8 md:p-10">
            <div className="mb-8 pr-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {editingId ? 'Edit Data' : (projectType ? `Detail ${projectType === 'certificate' ? 'Sertifikat' : 'Proyek'}` : 'Tipe Unggahan')}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1.5">
                {editingId ? 'Perbarui informasi data ini dengan cermat.' : (projectType ? 'Lengkapi formulir di bawah ini dengan detail yang sesuai.' : 'Pilih format data yang akan ditambahkan ke database.')}
              </p>
            </div>

            {!projectType ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { id: 'video', icon: 'fa-video', label: 'Video', desc: 'YouTube / Vimeo' },
                  { id: 'photo', icon: 'fa-image', label: 'Foto / Desain', desc: 'Portofolio Visual' },
                  { id: 'certificate', icon: 'fa-certificate', label: 'Sertifikat', desc: 'Lisensi & Pencapaian' }
                ].map((opt) => (
                  <button key={opt.id} onClick={() => setProjectType(opt.id as ProjectType)} className="group p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-900 hover:shadow-md transition-all text-center">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-900 transition-colors">
                      <i className={`fas ${opt.icon} text-lg text-slate-400 group-hover:text-white transition-colors`}></i>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">{opt.label}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-1.5 uppercase tracking-widest">{opt.desc}</p>
                  </button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 animate-enter">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div className={projectType === 'certificate' ? 'md:col-span-1' : 'md:col-span-2'}>
                    <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Judul {projectType === 'certificate' ? 'Sertifikat/Acara' : 'Proyek'} <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder={projectType === 'certificate' ? "Contoh: Lomba Film UI 2022..." : "Contoh: UI/UX Masterclass..."}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:font-medium placeholder:text-slate-400" 
                    />
                  </div>

                  {projectType === 'certificate' && (
                    <>
                      <div className="md:col-span-1">
                        <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Pencapaian / Status <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" value={certStatus} onChange={(e) => setCertStatus(e.target.value)} placeholder="Misal: Juara 1, Staff Kominfo..."
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:font-medium placeholder:text-slate-400" 
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Lembaga / Penyelenggara <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} placeholder="Misal: BEM KM, Coursera..."
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:font-medium placeholder:text-slate-400" 
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Tahun <span className="text-rose-500">*</span></label>
                        <input 
                          type="number" value={certYear} onChange={(e) => setCertYear(e.target.value)} placeholder="Misal: 2024"
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:font-medium placeholder:text-slate-400" 
                        />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                      {projectType === 'video' ? 'Tautan Video (YouTube)' : 'Unggah File Gambar'} <span className="text-rose-500">*</span>
                    </label>
                    {projectType === 'video' ? (
                      <input 
                        type="text" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://youtube.com/..."
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none text-sm font-semibold text-slate-900 transition-all" 
                      />
                    ) : (
                      <CldUploadWidget 
                        uploadPreset={cloudinaryPreset}
                        options={{ maxFiles: 1, resourceType: "image", sources: ["local", "url"] }}
                        onSuccess={(result) => {
                          if (typeof result.info === 'object' && 'secure_url' in result.info) {
                            setMediaUrl(result.info.secure_url); 
                            showToast({ message: "Aset berhasil dilampirkan", id: "upload-asset-success", icon: "fa-image" });
                          }
                        }}
                      >
                        {({ open }) => (
                          <div onClick={() => open()} className="cursor-pointer border border-dashed border-slate-300 hover:border-slate-900 hover:bg-slate-50 transition-all rounded-xl flex flex-col items-center justify-center overflow-hidden relative group/upload min-h-[140px] sm:min-h-[160px]">
                            {mediaUrl ? (
                              <div className="relative w-full h-40 sm:h-48 bg-slate-100">
                                <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover/upload:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm"><span className="text-white text-xs font-bold flex items-center gap-2"><i className="fas fa-camera"></i> Ganti Gambar</span></div>
                              </div>
                            ) : (
                              <div className="py-6 sm:py-8 flex flex-col items-center text-center px-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 mb-3 group-hover/upload:bg-slate-900 group-hover/upload:text-white transition-all"><i className="fas fa-upload text-sm"></i></div>
                                <span className="text-xs sm:text-sm font-bold text-slate-900">Klik untuk Unggah</span>
                                <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-1.5">Maksimal 5MB (JPG, PNG)</span>
                              </div>
                            )}
                          </div>
                        )}
                      </CldUploadWidget>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Deskripsi (Opsional)</label>
                    <textarea 
                      rows={3} value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Tambahkan penjelasan singkat..."
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none text-sm font-medium text-slate-900 resize-none transition-all placeholder:text-slate-400" 
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3 border-t border-slate-100 mt-6">
                  {!editingId && (
                    <button type="button" onClick={() => setProjectType(null)} className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm">Kembali</button>
                  )}
                  <button type="submit" disabled={isSubmitting} className="w-full sm:flex-1 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmitting && <i className="fas fa-circle-notch fa-spin text-white/70"></i>}
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans relative overflow-hidden selection:bg-slate-200 selection:text-slate-900 pb-20">
      
      {/* INJEKSI CSS ANIMASI, BACKGROUND & SKELETON */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .bg-grid { background-size: 40px 40px; background-image: linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px); }
        .animate-enter { opacity: 0; animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @keyframes slideUpFade { 
            0% { opacity: 0; transform: translateY(20px) scale(0.98); filter: blur(2px); } 
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } 
        }
        
        .animate-spin-slow { animation: spin 10s linear infinite; }
        
        /* Hilangkan Scrollbar di Mobile Tabs */
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        
        /* Premium Shimmer Loading */
        .shimmer { background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}} />

      {/* ELEMEN DEKORASI BACKGROUND MONOKROM */}
      <div className="absolute inset-0 bg-grid pointer-events-none z-0 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-slate-200/40 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">
        
        {mounted && createPortal(modalContent, document.body)}
        {mounted && createPortal(deleteModalContent, document.body)}

        {/* HEADER DENGAN LOOPING ICON MONOKROM & RESPONSIVE MOBILE FIX */}
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

        {/* FILTER TABS (Pill Style, Scrollable di Mobile) */}
        {(!isLoading || items.length > 0) && (
          <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 animate-enter pb-2 sm:pb-0" style={{animationDelay: '100ms'}}>
            {[
              { id: 'all', label: 'Semua Data', icon: 'fa-border-all' },
              { id: 'video', label: 'Video', icon: 'fa-play' },
              { id: 'photo', label: 'Foto', icon: 'fa-image' },
              { id: 'certificate', label: 'Sertifikat', icon: 'fa-award' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 border ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800 shadow-sm'
                }`}
              >
                <i className={`fas ${tab.icon} ${activeTab === tab.id ? 'opacity-100' : 'opacity-50'}`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* BLOK SKELETON LOADING (Gaya Baru Monokrom)                 */}
        {/* ========================================================= */}
        {isLoading ? (
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
        ) : filteredItems.length === 0 ? (
          /* BLOK JIKA DATA KOSONG */
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
        ) : (
          /* ========================================================= */
          /* BLOK RENDER DATA ASLI (CARD PREMIUM BENTO STYLE MONOKROM) */
          /* ========================================================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="group bg-white rounded-[1.5rem] sm:rounded-[2rem] p-2.5 border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col relative animate-enter"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                
                {/* IMAGE CONTAINER (INSET STYLE) */}
                <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100/50">
                  <img 
                    src={item.projectType === 'video' ? getYouTubeThumbnail(item.mediaUrl) : item.mediaUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Overlay Gradient Halus */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* BADGE TIPE KONTEN MONOKROM */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-sm text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-slate-700 flex items-center gap-1.5">
                    <i className={`fas ${item.itemType === 'certificate' ? 'fa-award text-slate-500' : item.projectType === 'video' ? 'fa-play text-slate-500' : 'fa-image text-slate-500'}`}></i>
                    {item.itemType === 'certificate' ? 'Sertifikat' : item.projectType}
                  </div>
                </div>
                
                {/* CONTENT AREA */}
                <div className="p-3 sm:p-4 pt-4 sm:pt-5 flex-1 flex flex-col">
                  
                  {/* Judul & Verified Badge */}
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
                  
                  {/* META STATS ROW */}
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
                  
                  {/* ACTION BUTTONS (Monokrom) */}
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
        )}
      </div>
    </main>
  );
}