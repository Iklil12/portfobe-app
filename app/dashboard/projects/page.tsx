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
  
  // State Modal Form Proyek
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectType, setProjectType] = useState<ProjectType>(null);
  
  // State Data
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'photo' | 'certificate'>('all');

  // State Form Input
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Modal Konfirmasi Hapus
  const [projectToDelete, setProjectToDelete] = useState<{id: string, title: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "paperions_preset";

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Gagal mengambil proyek", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchProjects(); 
  }, []);

  // --- LOGIKA FORM MODAL ---
  const handleOpenModal = (project: any = null) => {
    if (project) {
      setEditingProjectId(project.id);
      setProjectType(project.projectType as ProjectType);
      setProjectTitle(project.title);
      setProjectDescription(project.description || "");
      setMediaUrl(project.mediaUrl);
    } else {
      setEditingProjectId(null);
      setProjectType(null);
      setProjectTitle("");
      setProjectDescription("");
      setMediaUrl("");
    }
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProjectId(null);
    setProjectType(null);
    setProjectTitle("");
    setProjectDescription("");
    setMediaUrl("");
    document.body.style.overflow = 'unset'; 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle) return toast.error('Judul proyek wajib diisi!');
    if (!mediaUrl) return toast.error('Aset visual wajib dilampirkan!');

    setIsSubmitting(true);
    const toastId = toast.loading(editingProjectId ? 'Menyimpan perubahan...' : 'Mempublikasikan karya...');
    
    try {
      const method = editingProjectId ? 'PATCH' : 'POST';
      const response = await fetch('/api/projects', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProjectId, 
          title: projectTitle,
          description: projectDescription,
          mediaUrl: mediaUrl,
          projectType: projectType
        }),
      });

      if (response.ok) {
        toast.success(editingProjectId ? 'Karya diperbarui!' : 'Karya berhasil dipublikasikan!', { id: toastId });
        handleCloseModal();
        fetchProjects(); 
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

  // --- LOGIKA HAPUS MODAL (CUSTOM WARNING) ---
  const confirmDelete = (id: string, title: string) => {
    setProjectToDelete({ id, title });
    document.body.style.overflow = 'hidden'; 
  };

  const cancelDelete = () => {
    setProjectToDelete(null);
    document.body.style.overflow = 'unset';
  };

  const executeDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/projects?id=${projectToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Karya berhasil dihapus.');
        fetchProjects(); 
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Gagal menghapus karya.');
      }
    } catch (error) {
      toast.error("Gagal terhubung ke server.");
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
      document.body.style.overflow = 'unset';
    }
  };

  const filteredProjects = projects.filter(p => activeTab === 'all' || p.projectType === activeTab);

  // --- UI: MODAL PERINGATAN HAPUS ---
  const deleteModalContent = projectToDelete ? (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={!isDeleting ? cancelDelete : undefined}></div>
      <div className="bg-white rounded-[2rem] w-full max-w-sm relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-enter border border-slate-100 flex flex-col overflow-hidden text-center p-8">
        
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <i className="fas fa-exclamation-triangle text-2xl"></i>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Karya?</h3>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Apakah Anda yakin ingin menghapus <span className="font-bold text-slate-700">"{projectToDelete.title}"</span>? Tindakan ini menghapus data secara permanen.
        </p>
        
        <div className="flex gap-3 w-full">
          <button 
            onClick={cancelDelete} 
            disabled={isDeleting} 
            className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors text-sm disabled:opacity-50"
          >
            Batal
          </button>
          <button 
            onClick={executeDelete} 
            disabled={isDeleting} 
            className="flex-1 py-3.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 shadow-md shadow-red-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? <i className="fas fa-circle-notch fa-spin text-white"></i> : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  // --- UI: MODAL FORM PROYEK ---
  const modalContent = isModalOpen ? (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={handleCloseModal}></div>
      <div className="bg-white rounded-3xl w-full max-w-xl relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.1)] animate-enter border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        <button onClick={handleCloseModal} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all z-20">
          <i className="fas fa-times text-sm"></i>
        </button>

        <div className="overflow-y-auto custom-scrollbar w-full h-full">
          <div className="p-8 md:p-10">
            <div className="mb-8 pr-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {editingProjectId ? 'Edit Proyek' : (projectType ? 'Detail Proyek' : 'Tipe Proyek')}
              </h2>
              <p className="text-sm font-medium text-slate-500 mt-1">
                {editingProjectId ? 'Perbarui informasi karya Anda dengan cermat.' : (projectType ? `Lengkapi data untuk karya ${projectType} Anda.` : 'Pilih format karya yang akan diunggah.')}
              </p>
            </div>

            {!projectType ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'video', icon: 'fa-video', label: 'Video', desc: 'YouTube / Vimeo' },
                  { id: 'photo', icon: 'fa-image', label: 'Foto', desc: 'Gambar / UI' },
                  { id: 'certificate', icon: 'fa-certificate', label: 'Sertifikat', desc: 'Lisensi / Kursus' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setProjectType(opt.id as ProjectType)}
                    className="group p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-900 hover:shadow-md transition-all text-center"
                  >
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
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Judul Proyek <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Masukkan judul..."
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:font-medium placeholder:text-slate-400" 
                  />
                </div>
                
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                    {projectType === 'video' ? 'Tautan Video (YouTube/Vimeo)' : 'Aset Visual'} <span className="text-red-500">*</span>
                  </label>
                  
                  {projectType === 'video' ? (
                    <input 
                      type="text" 
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none text-sm font-semibold text-slate-900 transition-all" 
                    />
                  ) : (
                    <CldUploadWidget 
                      uploadPreset={cloudinaryPreset}
                      options={{ 
                        maxFiles: 1, 
                        resourceType: "image", 
                        sources: ["local", "url"], 
                        styles: { palette: { window: "#ffffff", windowBorder: "#e2e8f0", tabIcon: "#64748b", menuIcons: "#0f172a", textDark: "#0f172a", link: "#0f172a", action: "#0f172a", inProgress: "#0f172a", complete: "#10b981", sourceBg: "#f8fafc" } } 
                      }}
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
                              <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover/upload:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm"><span className="text-white text-xs font-bold flex items-center gap-2"><i className="fas fa-camera"></i> Ganti Aset</span></div>
                            </div>
                          ) : (
                            <div className="py-8 flex flex-col items-center text-center px-4">
                              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 mb-3 group-hover/upload:bg-slate-900 group-hover/upload:text-white transition-all">
                                <i className="fas fa-upload text-sm"></i>
                              </div>
                              <span className="text-sm font-bold text-slate-900">Unggah Gambar</span>
                              <span className="text-[11px] font-medium text-slate-500 mt-1">Maksimal 5MB (JPG, PNG)</span>
                            </div>
                          )}
                        </div>
                      )}
                    </CldUploadWidget>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Deskripsi (Opsional)</label>
                  <textarea 
                    rows={3}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Tambahkan detail proyek..."
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none text-sm font-medium text-slate-900 resize-none transition-all placeholder:text-slate-400" 
                  />
                </div>
                
                <div className="pt-4 flex gap-3">
                  {!editingProjectId && (
                    <button type="button" onClick={() => setProjectType(null)} className="px-6 py-3.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm border border-transparent hover:border-slate-200">Batal</button>
                  )}
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmitting && <i className="fas fa-circle-notch fa-spin text-white/70"></i>}
                    {isSubmitting ? 'Memproses...' : 'Simpan Proyek'}
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
        
        {/* Render Portal Hapus Modal */}
        {mounted && createPortal(deleteModalContent, document.body)}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 animate-enter">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              Karya & Proyek
            </h1>
            <p className="text-sm text-slate-500 font-medium">Susun portofolio profesional Anda untuk dilihat dunia.</p>
          </div>
          
          <button 
            onClick={() => handleOpenModal()} 
            className="bg-white border border-slate-200 text-[#0f172a] px-6 py-3 rounded-full text-[13px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm hover:border-slate-300 hover:shadow-md transition-all active:scale-95"
          >
            <i className="fas fa-plus font-normal"></i> New Project
          </button>
        </div>

        {!isLoading && projects.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-px animate-enter" style={{animationDelay: '100ms'}}>
            {[
              { id: 'all', label: 'Semua' },
              { id: 'video', label: 'Video' },
              { id: 'photo', label: 'Foto' },
              { id: 'certificate', label: 'Sertifikat' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 text-sm font-bold transition-all relative ${
                  activeTab === tab.id 
                    ? 'text-slate-900' 
                    : 'text-slate-400 hover:text-slate-700'
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

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="aspect-[4/3] bg-slate-100 animate-pulse"></div>
                <div className="p-5 flex-1">
                  <div className="h-5 bg-slate-100 rounded w-3/4 mb-3 animate-pulse"></div>
                  <div className="h-3.5 bg-slate-50 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-3.5 bg-slate-50 rounded w-1/2 mb-4 animate-pulse"></div>
                  <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between">
                    <div className="h-3 bg-slate-100 rounded w-1/4 animate-pulse"></div>
                    <div className="h-6 w-6 bg-slate-100 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          
          <div className="py-24 flex flex-col items-center justify-center text-center animate-enter" style={{animationDelay: '150ms'}}>
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
              <i className="fas fa-folder-open text-3xl text-slate-300"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {activeTab === 'all' ? 'Belum ada karya' : `Tidak ada ${activeTab} ditemukan`}
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm">Tampilkan keahlian Anda dengan menambahkan proyek pertama ke dalam daftar portofolio.</p>
            {activeTab === 'all' && (
              <button onClick={() => handleOpenModal()} className="text-slate-900 bg-white border border-slate-200 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
                Unggah Karya Pertama
              </button>
            )}
          </div>

        ) : (
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 flex flex-col relative animate-enter"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img 
                    src={project.projectType === 'video' ? getYouTubeThumbnail(project.mediaUrl) : project.mediaUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300"></div>
                  
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm text-[10px] font-bold uppercase tracking-widest text-slate-700">
                    <i className={`fas ${project.projectType === 'video' ? 'fa-play' : project.projectType === 'certificate' ? 'fa-award' : 'fa-image'}`}></i>
                    {project.projectType}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 text-base mb-1.5 line-clamp-1">{project.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{project.description || "Tidak ada deskripsi."}</p>
                  
                  <div className="mt-auto pt-4 flex justify-between items-center">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {new Date(project.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleOpenModal(project)} 
                        className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                        title="Edit Proyek"
                      >
                        <i className="fas fa-pen text-[13px]"></i>
                      </button>
                      
                      {/* TOMBOL HAPUS SEKARANG MEMANGGIL CUSTOM MODAL */}
                      <button 
                        onClick={() => confirmDelete(project.id, project.title)} 
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                        title="Hapus Proyek"
                      >
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