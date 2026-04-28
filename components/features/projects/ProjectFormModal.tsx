"use client";

import React from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { showToast } from '@/lib/customToast';
import { ProjectType } from '@/hooks/useProjects';

export function ProjectFormModal({ state, actions }: { state: any, actions: any }) {
  const { 
    isModalOpen, 
    editingId, 
    projectType, 
    projectTitle, 
    projectDescription, 
    mediaUrl, 
    certIssuer, 
    certYear, 
    certStatus, 
    isSubmitting 
  } = state;

  const {
    handleCloseModal,
    setProjectType,
    setProjectTitle,
    setProjectDescription,
    setMediaUrl,
    setCertIssuer,
    setCertYear,
    setCertStatus,
    handleSubmit
  } = actions;

  const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "paperions_preset";

  if (!isModalOpen) return null;

  return (
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
                        onSuccess={(result: any) => {
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
  );
}
