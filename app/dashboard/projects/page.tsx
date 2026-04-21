"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import toast, { Toaster } from 'react-hot-toast';
import { CldUploadWidget } from 'next-cloudinary';

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
      // Delay buatan (600ms) agar skeleton tidak cuma kedip, memberi kesan "memproses" yang mahal
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
    if (!projectTitle) return toast.error('Judul wajib diisi!');
    if (!mediaUrl) return toast.error('Aset visual wajib dilampirkan!');
    if (projectType === 'certificate' && (!certIssuer || !certYear || !certStatus)) {
      return toast.error('Lembaga, Tahun, dan Pencapaian/Status wajib diisi untuk sertifikat!');
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
        toast.success('Data berhasil dihapus.');
        fetchAllData(); 
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Gagal menghapus data.');
      }
    } catch (error) {
      toast.error("Gagal terhubung ke server.");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
      document.body.style.overflow = 'unset';
    }
  };

  const filteredItems = items.filter(p => activeTab === 'all' || p.projectType === activeTab);

  const deleteModalContent = itemToDelete ? (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={!isDeleting ? cancelDelete : undefined}></div>
      <div className="bg-white rounded-[2rem] w-full max-w-sm relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-enter border border-slate-100 flex flex-col overflow-hidden text-center p-8">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <i className="fas fa-exclamation-triangle text-2xl"></i>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Data?</h3>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Apakah Anda yakin ingin menghapus <span className="font-bold text-slate-700">"{itemToDelete.title}"</span>? Data akan hilang permanen dari sistem.
        </p>
        <div className="flex gap-3 w-full">
          <button onClick={cancelDelete} disabled={isDeleting} className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors text-sm disabled:opacity-50">Batal</button>
          <button onClick={executeDelete} disabled={isDeleting} className="flex-1 py-3.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 shadow-md shadow-red-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
            {isDeleting ? <i className="fas fa-circle-notch fa-spin text-white"></i> : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  const modalContent = isModalOpen ? (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={handleCloseModal}></div>
      <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.1)] animate-enter border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        <button onClick={handleCloseModal} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all z-20">
          <i className="fas fa-times text-sm"></i>
        </button>

        <div className="overflow-y-auto custom-scrollbar w-full h-full">
          <div className="p-8 md:p-10">
            <div className="mb-8 pr-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {editingId ? 'Edit Data' : (projectType ? `Detail ${projectType === 'certificate' ? 'Sertifikat' : 'Proyek'}` : 'Tipe Unggahan')}
              </h2>
              <p className="text-sm font-medium text-slate-500 mt-1">
                {editingId ? 'Perbarui informasi data ini dengan cermat.' : (projectType ? 'Lengkapi formulir di bawah ini.' : 'Pilih format data yang akan ditambahkan ke database.')}
              </p>
            </div>

            {!projectType ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'video', icon: 'fa-video', label: 'Video', desc: 'YouTube / Vimeo' },
                  { id: 'photo', icon: 'fa-image', label: 'Foto / Desain', desc: 'Portofolio Visual' },
                  { id: 'certificate', icon: 'fa-certificate', label: 'Sertifikat', desc: 'Lisensi & Pencapaian' }
                ].map((opt) => (
                  <button key={opt.id} onClick={() => setProjectType(opt.id as ProjectType)} className="group p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-900 hover:shadow-md transition-all text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-900 transition-colors">
                      <i className={`fas ${opt.icon} text-lg text-slate-400 group-hover:text-white transition-colors`}></i>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">{opt.label}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest">{opt.desc}</p>
                  </button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 animate-enter">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={projectType === 'certificate' ? 'md:col-span-1' : 'md:col-span-2'}>
                    <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Judul {projectType === 'certificate' ? 'Sertifikat/Acara' : 'Proyek'} <span className="text-red-500">*</span></label>
                    <input 
                      type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder={projectType === 'certificate' ? "Contoh: Lomba Film UI 2022..." : "Contoh: UI/UX Masterclass..."}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:border-[#0f172a] focus:ring-4 focus:ring-slate-900/5 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:font-medium placeholder:text-slate-400" 
                    />
                  </div>

                  {projectType === 'certificate' && (
                    <>
                      <div className="md:col-span-1">
                        <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Pencapaian / Status <span className="text-red-500">*</span></label>
                        <input 
                          type="text" value={certStatus} onChange={(e) => setCertStatus(e.target.value)} placeholder="Misal: Juara 1, Staff Kominfo..."
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:border-[#0f172a] focus:ring-4 focus:ring-slate-900/5 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:font-medium placeholder:text-slate-400" 
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Lembaga / Penyelenggara <span className="text-red-500">*</span></label>
                        <input 
                          type="text" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} placeholder="Misal: BEM KM, Coursera..."
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:border-[#0f172a] focus:ring-4 focus:ring-slate-900/5 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:font-medium placeholder:text-slate-400" 
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Tahun <span className="text-red-500">*</span></label>
                        <input 
                          type="number" value={certYear} onChange={(e) => setCertYear(e.target.value)} placeholder="Misal: 2024"
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:border-[#0f172a] focus:ring-4 focus:ring-slate-900/5 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:font-medium placeholder:text-slate-400" 
                        />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                      {projectType === 'video' ? 'Tautan Video (YouTube)' : 'Unggah File Gambar'} <span className="text-red-500">*</span>
                    </label>
                    {projectType === 'video' ? (
                      <input 
                        type="text" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://youtube.com/..."
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:border-[#0f172a] focus:ring-4 focus:ring-slate-900/5 outline-none text-sm font-semibold text-slate-900 transition-all" 
                      />
                    ) : (
                      <CldUploadWidget 
                        uploadPreset={cloudinaryPreset}
                        options={{ maxFiles: 1, resourceType: "image", sources: ["local", "url"] }}
                        onSuccess={(result) => {
                          if (typeof result.info === 'object' && 'secure_url' in result.info) {
                            setMediaUrl(result.info.secure_url); toast.success("Aset berhasil dilampirkan");
                          }
                        }}
                      >
                        {({ open }) => (
                          <div onClick={() => open()} className="cursor-pointer border border-dashed border-slate-300 hover:border-slate-900 hover:bg-slate-50 transition-all rounded-xl flex flex-col items-center justify-center overflow-hidden relative group/upload min-h-[160px]">
                            {mediaUrl ? (
                              <div className="relative w-full h-48 bg-slate-100">
                                <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover/upload:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm"><span className="text-white text-xs font-bold flex items-center gap-2"><i className="fas fa-camera"></i> Ganti Gambar</span></div>
                              </div>
                            ) : (
                              <div className="py-8 flex flex-col items-center text-center px-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 mb-3 group-hover/upload:bg-slate-900 group-hover/upload:text-white transition-all"><i className="fas fa-upload text-sm"></i></div>
                                <span className="text-sm font-bold text-slate-900">Klik untuk Unggah</span>
                                <span className="text-[11px] font-medium text-slate-500 mt-1">Maksimal 5MB (JPG, PNG)</span>
                              </div>
                            )}
                          </div>
                        )}
                      </CldUploadWidget>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Deskripsi (Opsional)</label>
                    <textarea 
                      rows={3} value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Tambahkan penjelasan singkat..."
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:border-[#0f172a] focus:ring-4 focus:ring-slate-900/5 outline-none text-sm font-medium text-slate-900 resize-none transition-all placeholder:text-slate-400" 
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3 border-t border-slate-100 mt-6">
                  {!editingId && (
                    <button type="button" onClick={() => setProjectType(null)} className="px-6 py-3.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm border border-transparent">Kembali</button>
                  )}
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
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
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .bg-grid { background-size: 40px 40px; background-image: linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px); }
        .animate-enter { animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        
        /* CSS Animasi Kilauan Skeleton Loading */
        .shimmer { background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}} />

      <div className="absolute inset-0 bg-grid pointer-events-none z-0 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
      
      <div className="max-w-6xl mx-auto p-6 md:p-10 relative z-10">
        
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: { background: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '13px', fontWeight: '600', padding: '12px 16px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
          }} 
        />
        
        {mounted && createPortal(modalContent, document.body)}
        {mounted && createPortal(deleteModalContent, document.body)}

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 animate-enter">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              Karya & Sertifikat
            </h1>
            <p className="text-sm text-slate-500 font-medium">Kelola portofolio dan pencapaian profesional Anda.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()} 
            className="bg-white border border-slate-200 text-[#0f172a] px-6 py-3 rounded-full text-[13px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm hover:border-slate-300 hover:shadow-md transition-all active:scale-95"
          >
            <i className="fas fa-plus font-normal"></i> Tambah Data
          </button>
        </div>

        {/* FILTER TABS (Ditampilkan saat data sudah ada atau sedang dimuat sebagian) */}
        {(!isLoading || items.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-px animate-enter" style={{animationDelay: '100ms'}}>
            {[
              { id: 'all', label: 'Semua Data' },
              { id: 'video', label: 'Video' },
              { id: 'photo', label: 'Foto' },
              { id: 'certificate', label: 'Sertifikat' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 text-sm font-bold transition-all relative ${
                  activeTab === tab.id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-900 rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* BLOK SKELETON LOADING (MUNCUL SAAT MENGAMBIL DATA API)    */}
        {/* ========================================================= */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[320px]">
                <div className="aspect-[4/3] shimmer"></div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="h-5 shimmer rounded-md w-3/4 mb-3"></div>
                  <div className="h-3.5 shimmer rounded-md w-full mb-2"></div>
                  <div className="h-3.5 shimmer rounded-md w-4/5 mb-4"></div>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <div className="h-3 shimmer rounded-md w-16"></div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 shimmer rounded-lg"></div>
                      <div className="h-8 w-8 shimmer rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          /* BLOK JIKA DATA KOSONG */
          <div className="py-24 flex flex-col items-center justify-center text-center animate-enter" style={{animationDelay: '150ms'}}>
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
              <i className="fas fa-folder-open text-3xl text-slate-300"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {activeTab === 'all' ? 'Belum ada data' : `Tidak ada ${activeTab} ditemukan`}
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm">Perkaya profil Anda dengan menambahkan pencapaian terbaru.</p>
            {activeTab === 'all' && (
              <button onClick={() => handleOpenModal()} className="text-slate-900 bg-white border border-slate-200 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
                Unggah Data Pertama
              </button>
            )}
          </div>
        ) : (
          /* BLOK RENDER DATA ASLI */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 flex flex-col relative animate-enter"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img 
                    src={item.projectType === 'video' ? getYouTubeThumbnail(item.mediaUrl) : item.mediaUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300"></div>
                  
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm text-[10px] font-bold uppercase tracking-widest text-slate-700">
                    <i className={`fas ${item.itemType === 'certificate' ? 'fa-award text-amber-500' : item.projectType === 'video' ? 'fa-play text-red-500' : 'fa-image text-blue-500'}`}></i>
                    {item.itemType === 'certificate' ? 'Sertifikat' : item.projectType}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 text-base mb-1.5 line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{item.description || "Tidak ada deskripsi."}</p>
                  
                  {item.itemType === 'certificate' && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {item.status && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] px-2 py-1 rounded-md font-bold flex items-center gap-1.5 w-max">
                          <i className="fas fa-trophy"></i> {item.status}
                        </span>
                      )}
                      {item.issuer && (
                        <span className="bg-slate-50 text-slate-600 border border-slate-200 text-[10px] px-2 py-1 rounded-md font-bold flex items-center gap-1.5 w-max">
                          <i className="fas fa-building"></i> {item.issuer}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-auto pt-5 flex justify-between items-center">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {item.year ? item.year : new Date(item.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleOpenModal(item)} className="text-slate-400 hover:text-[#0f172a] hover:bg-slate-100 w-8 h-8 rounded-lg flex items-center justify-center transition-all" title="Edit">
                        <i className="fas fa-pen text-[13px]"></i>
                      </button>
                      <button onClick={() => confirmDelete(item.id, item.title, item.itemType)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 w-8 h-8 rounded-lg flex items-center justify-center transition-all" title="Hapus">
                        <i className="fas fa-trash-alt text-[13px]"></i>
                      </button>
                    </div>
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