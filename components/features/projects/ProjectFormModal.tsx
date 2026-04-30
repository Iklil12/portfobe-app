"use client";

import React from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '@/lib/customToast';
import { ProjectType } from '@/hooks/useProjects';

// --- VARIANTS ANIMASI ---
const modalSpring = { type: "spring", stiffness: 300, damping: 25 } as const;
const smoothEase = [0.22, 1, 0.36, 1] as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: smoothEase } }
};

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop (Dark & Blur) */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
        onClick={handleCloseModal} 
      />
      
      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={modalSpring}
        className="bg-white rounded-[24px] w-full max-w-2xl relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Tombol Tutup dengan interaksi putar */}
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCloseModal} 
          className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100/50 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors z-20"
        >
          <i className="fas fa-times text-sm"></i>
        </motion.button>

        <div className="overflow-y-auto custom-scrollbar w-full h-full">
          <div className="p-6 sm:p-8 md:p-10">
            
            {/* Modal Header */}
            <div className="mb-8 pr-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {editingId ? 'Edit Data' : (projectType ? `Detail ${projectType === 'certificate' ? 'Sertifikat' : 'Proyek'}` : 'Pilih Tipe Unggahan')}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1.5">
                {editingId ? 'Perbarui informasi data ini dengan cermat.' : (projectType ? 'Lengkapi formulir di bawah ini dengan detail yang sesuai.' : 'Pilih format data yang akan ditambahkan ke portofolio Anda.')}
              </p>
            </div>

            {/* ANIMATE PRESENCE: Transisi mulus antara Pilih Tipe & Isi Form */}
            <AnimatePresence mode="wait">
              {!projectType ? (
                // --- STEP 1: PEMILIHAN TIPE PROYEK ---
                <motion.div 
                  key="type-selection"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  {[
                    { id: 'video', icon: 'fa-video', label: 'Video', desc: 'YouTube / Vimeo' },
                    { id: 'photo', icon: 'fa-image', label: 'Foto / Desain', desc: 'Portofolio Visual' },
                    { id: 'certificate', icon: 'fa-certificate', label: 'Sertifikat', desc: 'Lisensi & Pencapaian' }
                  ].map((opt) => (
                    <motion.button 
                      key={opt.id} 
                      variants={cardItem}
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setProjectType(opt.id as ProjectType)} 
                      className="group relative p-6 rounded-[20px] border border-slate-200 bg-white hover:border-slate-900 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all text-center overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-900 transition-colors duration-300 relative z-10 shadow-sm">
                        <i className={`fas ${opt.icon} text-xl text-slate-400 group-hover:text-white transition-colors duration-300 group-hover:scale-110`}></i>
                      </div>
                      <p className="font-bold text-slate-900 text-sm relative z-10">{opt.label}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest relative z-10">{opt.desc}</p>
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                // --- STEP 2: FORM ISIAN ---
                <motion.form 
                  key="form-input"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, ease: smoothEase }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* INPUT JUDUL */}
                    <div className={projectType === 'certificate' ? 'md:col-span-1' : 'md:col-span-2'}>
                      <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 ml-1">Judul {projectType === 'certificate' ? 'Sertifikat/Acara' : 'Proyek'} <span className="text-rose-500">*</span></label>
                      <input 
                        type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder={projectType === 'certificate' ? "Contoh: Lomba Film UI 2022..." : "Contoh: UI/UX Masterclass..."}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 focus:shadow-md outline-none text-sm font-semibold text-slate-900 transition-all duration-300 placeholder:font-medium placeholder:text-slate-400 hover:border-slate-300" 
                      />
                    </div>

                    {/* KHUSUS SERTIFIKAT */}
                    {projectType === 'certificate' && (
                      <>
                        <div className="md:col-span-1">
                          <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 ml-1">Pencapaian / Status <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" value={certStatus} onChange={(e) => setCertStatus(e.target.value)} placeholder="Misal: Juara 1, Staff Kominfo..."
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 focus:shadow-md outline-none text-sm font-semibold text-slate-900 transition-all duration-300 placeholder:font-medium placeholder:text-slate-400 hover:border-slate-300" 
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 ml-1">Lembaga / Penyelenggara <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} placeholder="Misal: BEM KM, Coursera..."
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 focus:shadow-md outline-none text-sm font-semibold text-slate-900 transition-all duration-300 placeholder:font-medium placeholder:text-slate-400 hover:border-slate-300" 
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 ml-1">Tahun <span className="text-rose-500">*</span></label>
                          <input 
                            type="number" value={certYear} onChange={(e) => setCertYear(e.target.value)} placeholder="Misal: 2024"
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 focus:shadow-md outline-none text-sm font-semibold text-slate-900 transition-all duration-300 placeholder:font-medium placeholder:text-slate-400 hover:border-slate-300" 
                          />
                        </div>
                      </>
                    )}

                    {/* INPUT MEDIA */}
                    <div className="md:col-span-2">
                      <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                        {projectType === 'video' ? 'Tautan Video (YouTube)' : 'Unggah File Gambar'} <span className="text-rose-500">*</span>
                      </label>
                      {projectType === 'video' ? (
                        <input 
                          type="text" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://youtube.com/..."
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 focus:shadow-md outline-none text-sm font-semibold text-slate-900 transition-all duration-300 hover:border-slate-300" 
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
                            <motion.div 
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => open()} 
                              className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all duration-300 rounded-[20px] flex flex-col items-center justify-center overflow-hidden relative group/upload min-h-[160px]"
                            >
                              {mediaUrl ? (
                                <div className="relative w-full h-48 bg-slate-100">
                                  <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/upload:scale-105" />
                                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/upload:opacity-100 flex items-center justify-center transition-opacity duration-300 backdrop-blur-[2px]">
                                    <span className="bg-white/20 border border-white/40 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl">
                                      <i className="fas fa-camera"></i> Ganti Gambar
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="py-8 flex flex-col items-center text-center px-4">
                                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3 group-hover/upload:bg-slate-900 group-hover/upload:text-white transition-all duration-300 group-hover/upload:shadow-md group-hover/upload:-translate-y-1">
                                    <i className="fas fa-cloud-upload-alt text-lg"></i>
                                  </div>
                                  <span className="text-sm font-bold text-slate-900">Klik untuk Unggah Media</span>
                                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">Maksimal 5MB (JPG, PNG)</span>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </CldUploadWidget>
                      )}
                    </div>
                    {/* INPUT DESKRIPSI */}
                    <div className="md:col-span-2">
                      <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 ml-1">Deskripsi (Opsional)</label>
                      <textarea 
                        rows={3} value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Tambahkan penjelasan singkat..."
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 focus:shadow-md outline-none text-sm font-medium text-slate-900 resize-none transition-all duration-300 placeholder:text-slate-400 hover:border-slate-300 custom-scrollbar" 
                      />
                    </div>
                  </div>
                  {/* AKSI BUTTONS */}
                  <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3 border-t border-slate-100 mt-6">
                    {!editingId && (
                      <motion.button 
                        whileHover={{ backgroundColor: "#f1f5f9" }}
                        whileTap={{ scale: 0.96 }}
                        type="button" 
                        onClick={() => setProjectType(null)} 
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-50 border border-slate-200 transition-colors text-sm"
                      >
                        Kembali
                      </motion.button>
                    )}
                    <motion.button 
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                      whileTap={{ scale: 0.98 }}
                      type="submit" 
                      disabled={isSubmitting} 
                      className="w-full sm:flex-1 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting && <i className="fas fa-circle-notch fa-spin text-white/70"></i>}
                      {isSubmitting ? 'Memproses...' : 'Simpan ke Portofolio'}
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
            
          </div>
        </div>
      </motion.div>
    </div>
  );
}