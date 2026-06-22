"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '@/lib/customToast';
import { ProjectType } from '@/hooks/useProjects';
import { LazyImage } from '@/components/ui/LazyImage';
import { X, UploadCloud, Box, Check, Film, Image as ImageIcon, Sparkles, Rocket, Award, Loader2, Crown } from 'lucide-react';
import * as tus from 'tus-js-client';

// --- VARIANTS ANIMASI ---
const modalSpring = { type: "spring", stiffness: 300, damping: 25 } as const;
const smoothEase = [0.22, 1, 0.36, 1] as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardItem = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: smoothEase } }
};

export function ProjectFormModal({ state, actions }: { state: any, actions: any }) {
  const [videoMethod, setVideoMethod] = useState<'link' | 'upload'>('link');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Saat edit video yang sudah diupload (GUID Bunny), otomatis pindah ke tab 'upload'
  const isBunnyGuid = (url: string) => url && !url.includes('youtube') && !url.includes('vimeo') && !url.includes('http') && url.length === 36 && url.includes('-');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file3d, setFile3d] = useState<File | null>(null);
  const file3dInputRef = useRef<HTMLInputElement>(null);
  const [isUploading3D, setIsUploading3D] = useState(false);
  const [upload3DProgress, setUpload3DProgress] = useState(0);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileImageInputRef = useRef<HTMLInputElement>(null);

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
    projectTags,
    isSubmitting,
    userPlan
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
    setProjectTags,
    handleSubmit
  } = actions;

  const [isDragActive, setIsDragActive] = useState(false);

  const processImageUpload = async (f: File) => {
    const maxImageSize = userPlan === 'SUPREME' ? 15 * 1024 * 1024 : userPlan === 'PRO' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    const maxImageLabel = userPlan === 'SUPREME' ? '15MB' : userPlan === 'PRO' ? '10MB' : '5MB';
    
    if (f.size > maxImageSize) {
      showToast({ message: `Maksimal ukuran gambar ${maxImageLabel}`, id: "err-img", icon: "⚠️" });
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
    
    if (!cloudName || !uploadPreset) {
      showToast({ message: "Konfigurasi Cloudinary tidak ditemukan", id: "upload-asset-fail", icon: "❌" });
      return;
    }

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('file', f);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (res.ok && data.secure_url) {
        setMediaUrl(data.secure_url);
        showToast({ message: "Gambar berhasil diunggah dengan cepat", id: "upload-asset-success", icon: "⚡" });
      } else {
        showToast({ message: data.error?.message || "Gagal mengunggah gambar", id: "upload-asset-fail", icon: "❌" });
      }
    } catch (err) {
      showToast({ message: "Terjadi kesalahan jaringan saat mengunggah", id: "upload-asset-err", icon: "⚠️" });
    } finally {
      setIsUploadingImage(false);
      if (fileImageInputRef.current) fileImageInputRef.current.value = '';
    }
  };

  const processVideoUpload = async (f: File) => {
    if (userPlan === 'FREE') {
      setShowUpgradeModal(true);
      return;
    }

    const maxVideoSize = userPlan === 'SUPREME' ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
    const maxVideoSizeLabel = userPlan === 'SUPREME' ? '100MB' : '50MB';

    if (f.size > maxVideoSize) {
      showToast({ message: `Ukuran video maksimal ${maxVideoSizeLabel}`, id: "err-video-size", icon: "⚠️" });
      return;
    }

    setIsUploadingVideo(true);
    setUploadProgress(0);

    try {
      // 1. Minta tiket presigned signature dari server kita
      const ticketRes = await fetch('/api/projects/upload-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: projectTitle || f.name })
      });

      const ticketData = await ticketRes.json();

      if (!ticketRes.ok || !ticketData.guid) {
        throw new Error(ticketData.error || "Gagal mendapatkan tiket upload");
      }

      const { guid, libraryId, signature, expirationTime } = ticketData;

      // 2. Upload file menggunakan TUS langsung ke Edge CDN Bunny
      const upload = new tus.Upload(f, {
        endpoint: 'https://video.bunnycdn.com/tusupload',
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          AuthorizationSignature: signature,
          AuthorizationExpire: expirationTime.toString(),
          VideoId: guid,
          LibraryId: libraryId.toString(),
        },
        metadata: {
          filename: f.name,
          filetype: f.type,
        },
        onError: function (error) {
          console.error("Failed because: " + error);
          showToast({ message: "Gagal mengunggah video.", id: "upload-edge-fail", icon: "❌" });
          setIsUploadingVideo(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
          setUploadProgress(percentage);
        },
        onSuccess: function () {
          setMediaUrl(guid);
          showToast({ message: "Video 100% berhasil diunggah", id: "upload-edge-success", icon: "✅" });
          setIsUploadingVideo(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
      });

      // Mulai proses upload TUS
      upload.start();

    } catch (error: any) {
      console.error(error);
      showToast({ message: error.message || "Gagal memproses video", id: "upload-exception", icon: "⚠️" });
      setIsUploadingVideo(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const process3DFile = (f: File) => {
    const max3DSize = userPlan === 'SUPREME' ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
    const max3DLabel = userPlan === 'SUPREME' ? '100MB' : '50MB';
    if (f.size > max3DSize) {
       showToast({ message: `Maksimal ${max3DLabel}`, id: "err-3d", icon: "⚠️" });
       return;
    }
    setFile3d(f);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (projectType === 'photo') {
      const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validMimeTypes.includes(file.type)) {
        showToast({ message: "Format tidak didukung. Harap unggah JPG, PNG, WEBP, atau GIF.", id: "err-img-type", icon: "⚠️" });
        return;
      }
      await processImageUpload(file);
    } else if (projectType === 'video') {
      if (!file.type.startsWith('video/')) {
        showToast({ message: "Harap unggah file video yang valid.", id: "err-video-type", icon: "⚠️" });
        return;
      }
      await processVideoUpload(file);
    } else if (projectType === '3d') {
      const isGlb = file.name.endsWith('.glb') || file.name.endsWith('.gltf');
      if (!isGlb) {
        showToast({ message: "Harap unggah file 3D berformat .GLB atau .GLTF.", id: "err-3d-type", icon: "⚠️" });
        return;
      }
      process3DFile(file);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processVideoUpload(file);
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden selection:bg-[#ff9e00]/30 selection:text-white">
      {/* Backdrop (Dark & Blur) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={handleCloseModal}
      />

      {/* Outer Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 15 }}
        transition={modalSpring}
        className="relative w-full max-w-2xl bg-zinc-950 p-1 rounded-none border border-white/10 z-10 flex flex-col max-h-[92vh]"
      >
        {/* Inner Content Container */}
        <div className="bg-zinc-950 w-full border border-white/5 flex flex-col overflow-hidden h-full relative">
          
          {/* Tombol Tutup */}
          <button
            onClick={handleCloseModal}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-none border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors z-20 focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="overflow-y-auto custom-scrollbar w-full h-full relative z-10">
            <div className="p-6 sm:p-8 md:p-10">

              {/* Modal Header */}
              <div className="mb-8 pr-8">
                <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider">
                  {editingId ? 'Edit Data' : (projectType ? `Detail ${projectType === 'certificate' ? 'Sertifikat' : 'Proyek'}` : 'Pilih Tipe Unggahan')}
                </h2>
                <p className="text-xs font-mono text-white/40 mt-1.5 leading-relaxed">
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
                    exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    {[
                      { id: 'video', icon: Film, label: 'Video', desc: 'Youtube / Vimeo' },
                      { id: 'photo', icon: ImageIcon, label: 'Foto / Desain', desc: 'Format Visual' },
                      { id: 'certificate', icon: Award, label: 'Sertifikat', desc: 'Lisensi & Lomba' },
                      { id: '3d', icon: Box, label: '3D Model', desc: 'Format .GLB', isPro: true }
                    ].map((opt) => {
                      const IconComponent = opt.icon;
                      return (
                        <motion.button
                          key={opt.id}
                          variants={cardItem}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (opt.isPro && userPlan === 'FREE') {
                               setShowUpgradeModal(true);
                               return;
                            }
                            setProjectType(opt.id as ProjectType)
                          }}
                          className="group relative p-5 rounded-none border border-white/10 bg-zinc-900/40 hover:border-[#ff9e00] hover:bg-zinc-900 transition-all text-center overflow-hidden flex flex-col justify-between min-h-[140px]"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          {opt.isPro && (
                             <span className="absolute top-2.5 right-2.5 bg-[#ff9e00] text-black text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-none shadow-sm z-20">PRO</span>
                          )}
                          <div className="w-12 h-12 bg-zinc-950 border border-white/5 rounded-none flex items-center justify-center mx-auto mb-3 group-hover:bg-[#ff9e00]/10 group-hover:border-[#ff9e00]/30 transition-colors duration-300 relative z-10">
                            <IconComponent className="w-5 h-5 text-white/30 group-hover:text-[#ff9e00] transition-colors duration-300" />
                          </div>
                          <div>
                            <p className="font-mono font-bold text-white text-[11px] uppercase tracking-wider relative z-10">{opt.label}</p>
                            <p className="text-[8px] font-mono text-white/30 mt-1 uppercase tracking-widest relative z-10 leading-none">{opt.desc}</p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                ) : (
                  // --- STEP 2: FORM ISIAN ---
                  <motion.form
                    key="form-input"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3, ease: smoothEase }}
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (projectType === '3d') {
                        if (editingId && !file3d) {
                          handleSubmit(e);
                          return;
                        }
                        if (!projectTitle || !file3d) {
                           showToast({ message: 'Judul dan File 3D wajib diisi!', id: 'err-3d-req', icon: "⚠️" });
                           return;
                        }
                        setIsUploading3D(true);
                        setUpload3DProgress(0);
                        
                        try {
                          const formData = new FormData();
                          formData.append('title', projectTitle);
                          formData.append('file', file3d);
                          if (projectDescription) formData.append('description', projectDescription);

                          const xhr = new XMLHttpRequest();
                          xhr.open('POST', '/api/projects/upload-3d', true);

                          xhr.upload.onprogress = (event) => {
                            if (event.lengthComputable) {
                              const pct = Math.round((event.loaded / event.total) * 100);
                              setUpload3DProgress(pct);
                            }
                          };

                          xhr.onload = () => {
                            if (xhr.status >= 200 && xhr.status < 300) {
                              showToast({ message: '3D Model berhasil diunggah', id: 'succ-3d', icon: "✅" });
                              handleCloseModal();
                              window.location.reload();
                            } else {
                              try {
                                const err = JSON.parse(xhr.responseText);
                                showToast({ message: err.error || 'Gagal mengunggah', id: 'err-3d-api', icon: "❌" });
                              } catch {
                                showToast({ message: 'Gagal mengunggah 3D model', id: 'err-3d-api', icon: "❌" });
                              }
                              if (file3dInputRef.current) file3dInputRef.current.value = '';
                            }
                            setIsUploading3D(false);
                          };

                          xhr.onerror = () => {
                            showToast({ message: 'Gagal terhubung ke server', id: 'err-net', icon: '⚠️' });
                            setIsUploading3D(false);
                            if (file3dInputRef.current) file3dInputRef.current.value = '';
                          };

                          xhr.send(formData);
                        } catch (err) {
                           showToast({ message: 'Gagal terhubung server', id: 'err-net', icon: '⚠️' });
                           setIsUploading3D(false);
                           if (file3dInputRef.current) file3dInputRef.current.value = '';
                        }
                      } else {
                        handleSubmit(e);
                      }
                    }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* INPUT JUDUL */}
                      <div className={projectType === 'certificate' ? 'md:col-span-1' : 'md:col-span-2'}>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Judul {projectType === 'certificate' ? 'Sertifikat/Acara' : 'Proyek'} <span className="text-rose-500">*</span></label>
                        <input
                          type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder={projectType === 'certificate' ? "Contoh: Lomba Film UI 2022..." : "Contoh: UI/UX Masterclass..."}
                          className="w-full px-5 py-3.5 rounded-none border border-white/10 bg-zinc-900 focus:bg-zinc-950 focus:border-[#ff9e00] outline-none text-sm font-mono text-white transition-all duration-300 placeholder:text-white/30"
                          required
                        />
                      </div>

                      {/* KHUSUS SERTIFIKAT */}
                      {projectType === 'certificate' && (
                        <>
                          <div className="md:col-span-1">
                            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Pencapaian / Status <span className="text-rose-500">*</span></label>
                            <input
                              type="text" value={certStatus} onChange={(e) => setCertStatus(e.target.value)} placeholder="Juara 1, Finalis, Staff..."
                              className="w-full px-5 py-3.5 rounded-none border border-white/10 bg-zinc-900 focus:bg-zinc-950 focus:border-[#ff9e00] outline-none text-sm font-mono text-white transition-all duration-300 placeholder:text-white/30"
                              required
                            />
                          </div>
                          <div className="md:col-span-1">
                            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Lembaga / Penyelenggara <span className="text-rose-500">*</span></label>
                            <input
                              type="text" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} placeholder="BEM KM, Coursera, Google..."
                              className="w-full px-5 py-3.5 rounded-none border border-white/10 bg-zinc-900 focus:bg-zinc-950 focus:border-[#ff9e00] outline-none text-sm font-mono text-white transition-all duration-300 placeholder:text-white/30"
                              required
                            />
                          </div>
                          <div className="md:col-span-1">
                            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Tahun <span className="text-rose-500">*</span></label>
                            <input
                              type="number" value={certYear} onChange={(e) => setCertYear(e.target.value)} placeholder="Misal: 2024"
                              className="w-full px-5 py-3.5 rounded-none border border-white/10 bg-zinc-900 focus:bg-zinc-950 focus:border-[#ff9e00] outline-none text-sm font-mono text-white transition-all duration-300 placeholder:text-white/30"
                              required
                            />
                          </div>
                        </>
                      )}

                      {/* INPUT MEDIA */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">
                          {projectType === 'video' ? 'Tautan Video (YouTube/Vimeo)' : projectType === '3d' ? 'Unggah File 3D (.GLB)' : 'Unggah File Gambar'} <span className="text-rose-500">*</span>
                        </label>
                        {projectType === '3d' ? (
                          <div className="w-full">
                            <input type="file" accept=".glb,.gltf" className="hidden" ref={file3dInputRef} onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const max3DSize = userPlan === 'SUPREME' ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
                                const max3DLabel = userPlan === 'SUPREME' ? '100MB' : '50MB';
                                if (f.size > max3DSize) {
                                   showToast({ message: `Maksimal ${max3DLabel}`, id: "err-3d", icon: "⚠️" });
                                   return;
                                }
                                setFile3d(f);
                              }
                            }} />
                            <div 
                              onClick={() => file3dInputRef.current?.click()}
                              onDragEnter={handleDrag}
                              onDragOver={handleDrag}
                              onDragLeave={handleDrag}
                              onDrop={handleDrop}
                              className={`cursor-pointer border border-dashed transition-all duration-300 rounded-none flex flex-col items-center justify-center overflow-hidden relative min-h-[160px] w-full group/upload ${isDragActive ? 'border-[#ff9e00] bg-[#ff9e00]/10 shadow-[0_0_15px_rgba(255,158,0,0.15)]' : 'border-white/10 hover:border-[#ff9e00]/60 bg-zinc-900/30 hover:bg-zinc-900/60'}`}
                            >
                              {file3d ? (
                                <div className="py-8 flex flex-col items-center text-center px-4">
                                  <div className="w-12 h-12 bg-[#ff9e00]/10 border border-[#ff9e00]/20 rounded-none flex items-center justify-center text-[#ff9e00] mb-3">
                                    <Box className="w-5 h-5" />
                                  </div>
                                  <span className="text-xs font-mono font-bold text-white">{file3d.name}</span>
                                  <span className="text-[9px] font-mono font-bold text-white/30 mt-1.5 uppercase tracking-widest">Klik untuk mengganti</span>
                                </div>
                              ) : editingId && mediaUrl ? (
                                <div className="py-8 flex flex-col items-center text-center px-4">
                                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-none flex items-center justify-center text-emerald-400 mb-3">
                                    <Check className="w-5 h-5" />
                                  </div>
                                  <span className="text-xs font-mono font-bold text-white">File 3D Sudah Terlampir</span>
                                  <span className="text-[9px] font-mono font-bold text-white/30 mt-1.5 uppercase tracking-widest">Klik untuk mengganti file</span>
                                </div>
                              ) : (
                                <div className="py-8 flex flex-col items-center text-center px-4">
                                  <div className="w-12 h-12 bg-zinc-950 border border-white/5 rounded-none flex items-center justify-center text-white/30 mb-3 group-hover/upload:bg-[#ff9e00]/10 group-hover/upload:text-[#ff9e00] group-hover/upload:border-[#ff9e00]/30 transition-all duration-300">
                                    <UploadCloud className="w-5 h-5" />
                                  </div>
                                  <span className="text-xs font-mono font-bold text-white flex items-center gap-2">Pilih File 3D (.GLB/.GLTF)</span>
                                  <span className="text-[9px] font-mono font-bold text-white/30 mt-1.5 uppercase tracking-widest">Maksimal {userPlan === 'SUPREME' ? '100MB' : '50MB'}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : projectType === 'video' ? (
                          <div className="flex flex-col gap-4">
                            <div className="flex gap-1 p-1 bg-zinc-900 border border-white/10 rounded-none w-full sm:max-w-[280px]">
                              <button
                                type="button"
                                onClick={() => setVideoMethod('link')}
                                className={`flex-1 py-2 text-[10px] font-mono font-bold uppercase tracking-wider rounded-none transition-all ${(isBunnyGuid(mediaUrl) ? 'upload' : videoMethod) === 'link' ? 'bg-zinc-800 text-white border border-white/5 shadow-sm' : 'text-white/40 hover:text-white'}`}
                              >
                                Link
                              </button>
                              <button
                                type="button"
                                onClick={() => setVideoMethod('upload')}
                                className={`flex-1 py-2 text-[10px] font-mono font-bold uppercase tracking-wider rounded-none transition-all flex items-center justify-center gap-1.5 ${(isBunnyGuid(mediaUrl) ? 'upload' : videoMethod) === 'upload' ? 'bg-zinc-800 text-white border border-white/5 shadow-sm' : 'text-white/40 hover:text-white'}`}
                              >
                                Unggah <Crown className="w-3 h-3 text-[#ff9e00]" />
                              </button>
                            </div>

                            {(isBunnyGuid(mediaUrl) ? 'upload' : videoMethod) === 'link' ? (
                              <input
                                type="text" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://youtube.com/..."
                                className="w-full px-5 py-3.5 rounded-none border border-white/10 bg-zinc-900 focus:bg-zinc-950 focus:border-[#ff9e00] outline-none text-sm font-mono text-white transition-all duration-300 placeholder:text-white/30"
                              />
                            ) : (
                              <div className="w-full">
                                <input type="file" accept="video/mp4,video/x-m4v,video/*" className="hidden" ref={fileInputRef} onChange={handleVideoUpload} />
                                <div 
                                  onClick={() => {
                                    if(userPlan === 'FREE') setShowUpgradeModal(true); 
                                    else fileInputRef.current?.click();
                                  }}
                                  onDragEnter={handleDrag}
                                  onDragOver={handleDrag}
                                  onDragLeave={handleDrag}
                                  onDrop={handleDrop}
                                  className={`cursor-pointer border border-dashed transition-all duration-300 rounded-none flex flex-col items-center justify-center overflow-hidden relative min-h-[160px] w-full group/upload ${isDragActive ? 'border-[#ff9e00] bg-[#ff9e00]/10 shadow-[0_0_15px_rgba(255,158,0,0.15)]' : 'border-white/10 hover:border-[#ff9e00]/60 bg-zinc-900/30 hover:bg-zinc-900/60'}`}
                                >
                                  {isUploadingVideo ? (
                                    <div className="w-full px-8 flex flex-col items-center">
                                      <div className="w-full bg-zinc-900 border border-white/5 h-1.5 mb-3 overflow-hidden">
                                        <div className="bg-[#ff9e00] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                      </div>
                                      <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Mengunggah... {uploadProgress}%</span>
                                    </div>
                                  ) : mediaUrl && !mediaUrl.includes('youtube') && !mediaUrl.includes('vimeo') && mediaUrl.length === 36 ? (
                                    <div className="py-8 flex flex-col items-center text-center px-4">
                                      <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-none flex items-center justify-center text-emerald-400 mb-3">
                                        <Check className="w-5 h-5" />
                                      </div>
                                      <span className="text-xs font-mono font-bold text-white">Video Berhasil Diunggah</span>
                                      <span className="text-[9px] font-mono font-bold text-white/30 mt-1.5 uppercase tracking-widest">Klik untuk mengganti</span>
                                    </div>
                                  ) : (
                                    <div className="py-8 flex flex-col items-center text-center px-4">
                                      <div className="w-12 h-12 bg-zinc-950 border border-white/5 rounded-none flex items-center justify-center text-white/30 mb-3 group-hover/upload:bg-[#ff9e00]/10 group-hover/upload:text-[#ff9e00] group-hover/upload:border-[#ff9e00]/30 transition-all duration-300">
                                        <UploadCloud className="w-5 h-5" />
                                      </div>
                                      <span className="text-xs font-mono font-bold text-white flex items-center gap-2">Unggah Video Langsung <Crown className="w-3.5 h-3.5 text-[#ff9e00]" /></span>
                                      <span className="text-[9px] font-mono font-bold text-white/30 mt-1.5 uppercase tracking-widest">Maksimal {userPlan === 'SUPREME' ? '100MB' : '50MB'} (MP4, WEBM)</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full">
                            <input 
                              type="file" 
                              accept="image/png,image/jpeg,image/jpg,image/webp" 
                              className="hidden" 
                              ref={fileImageInputRef} 
                              onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                
                                const maxImageSize = userPlan === 'SUPREME' ? 15 * 1024 * 1024 : userPlan === 'PRO' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
                                const maxImageLabel = userPlan === 'SUPREME' ? '15MB' : userPlan === 'PRO' ? '10MB' : '5MB';
                                
                                if (f.size > maxImageSize) {
                                  showToast({ message: `Maksimal ukuran gambar ${maxImageLabel}`, id: "err-img", icon: "⚠️" });
                                  return;
                                }

                                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
                                const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
                                if (!cloudName || !uploadPreset) return;

                                setIsUploadingImage(true);
                                const formData = new FormData();
                                formData.append('file', f);
                                formData.append('upload_preset', uploadPreset);

                                try {
                                  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                                    method: 'POST',
                                    body: formData
                                  });
                                  const data = await res.json();
                                  
                                  if (res.ok && data.secure_url) {
                                    setMediaUrl(data.secure_url);
                                    showToast({ message: "Gambar berhasil diunggah dengan cepat", id: "upload-asset-success", icon: "⚡" });
                                  } else {
                                    showToast({ message: data.error?.message || "Gagal mengunggah gambar", id: "upload-asset-fail", icon: "❌" });
                                  }
                                } catch (err) {
                                  showToast({ message: "Terjadi kesalahan jaringan Edge", id: "upload-asset-err", icon: "⚠️" });
                                } finally {
                                  setIsUploadingImage(false);
                                  if (fileImageInputRef.current) fileImageInputRef.current.value = '';
                                }
                              }} 
                            />
                            <div
                              onClick={() => !isUploadingImage && fileImageInputRef.current?.click()}
                              onDragEnter={handleDrag}
                              onDragOver={handleDrag}
                              onDragLeave={handleDrag}
                              onDrop={handleDrop}
                              className={`cursor-pointer border border-dashed transition-all duration-300 rounded-none flex flex-col items-center justify-center overflow-hidden relative group/upload min-h-[160px] ${isDragActive ? 'border-[#ff9e00] bg-[#ff9e00]/10 shadow-[0_0_15px_rgba(255,158,0,0.15)]' : 'border-white/10 hover:border-[#ff9e00]/60 bg-zinc-900/30 hover:bg-zinc-900/60'}`}
                            >
                              {isUploadingImage ? (
                                <div className="py-8 flex flex-col items-center text-center px-4">
                                  <Loader2 className="w-6 h-6 animate-spin text-[#ff9e00] mb-3" />
                                  <span className="text-xs font-mono font-bold text-white">Mengunggah Gambar...</span>
                                </div>
                              ) : mediaUrl ? (
                                <div className="relative w-full h-48 bg-zinc-900">
                                  <LazyImage src={mediaUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/upload:scale-105" />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/upload:opacity-100 flex items-center justify-center transition-opacity duration-300 backdrop-blur-[2px]">
                                    <span className="bg-zinc-900 border border-white/10 text-white px-4 py-2 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl">
                                      Ganti Gambar
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="py-8 flex flex-col items-center text-center px-4">
                                  <div className="w-12 h-12 bg-zinc-950 border border-white/5 rounded-none flex items-center justify-center text-white/30 mb-3 group-hover/upload:bg-[#ff9e00]/10 group-hover/upload:text-[#ff9e00] group-hover/upload:border-[#ff9e00]/30 transition-all duration-300">
                                    <UploadCloud className="w-5 h-5" />
                                  </div>
                                  <span className="text-xs font-mono font-bold text-white">Klik untuk Unggah Gambar</span>
                                  <span className="text-[9px] font-mono font-bold text-white/30 mt-1.5 uppercase tracking-widest">Maksimal {userPlan === 'SUPREME' ? '15MB' : userPlan === 'PRO' ? '10MB' : '5MB'}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* INPUT DESKRIPSI */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Deskripsi (Opsional)</label>
                        <textarea
                          rows={3} value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Tambahkan penjelasan singkat..."
                          className="w-full px-5 py-4 rounded-none border border-white/10 bg-zinc-900 focus:bg-zinc-950 focus:border-[#ff9e00] outline-none text-sm font-mono text-white resize-none transition-all duration-300 placeholder:text-white/30 custom-scrollbar"
                        />
                      </div>

                      {/* INPUT TAGS */}
                      {projectType !== 'certificate' && (
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">
                            Tags <span className="normal-case font-medium text-white/20">(Opsional)</span>
                          </label>
                          {/* Chips */}
                          {projectTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {projectTags.map((tag: string) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 text-[#ff9e00] text-[10px] font-mono font-bold rounded-none border border-white/15"
                                >
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => setProjectTags(projectTags.filter((t: string) => t !== tag))}
                                    className="w-3.5 h-3.5 rounded-none bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors leading-none"
                                  >
                                    <X className="w-2.5 h-2.5 text-white" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                          <input
                            type="text"
                            placeholder={projectTags.length >= 5 ? 'Maksimal 5 tag' : 'Ketik tag lalu tekan Enter atau koma...'}
                            disabled={projectTags.length >= 5}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ',') {
                                e.preventDefault();
                                const val = (e.target as HTMLInputElement).value.trim().replace(/,/g, '');
                                if (val && !projectTags.includes(val) && projectTags.length < 5) {
                                  setProjectTags([...projectTags, val]);
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                            className="w-full px-5 py-3.5 rounded-none border border-white/10 bg-zinc-900 focus:bg-zinc-950 focus:border-[#ff9e00] outline-none text-sm font-mono text-white transition-all duration-300 placeholder:text-white/30 disabled:opacity-40 disabled:cursor-not-allowed"
                          />
                          <p className="text-[9px] font-mono text-white/30 mt-2 ml-1">Contoh: UI/UX, Branding, React — Maks. 5 tag</p>
                        </div>
                      )}
                    </div>

                    {/* AKSI BUTTONS */}
                    <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3 border-t border-white/5 mt-6">
                      {!editingId && (
                        <button
                          type="button"
                          onClick={() => setProjectType(null)}
                          className="w-full sm:w-auto px-8 py-3.5 rounded-none font-mono font-bold text-white/50 bg-zinc-900 border border-white/10 transition-colors hover:bg-zinc-850 hover:text-white text-xs uppercase tracking-wider"
                        >
                          Kembali
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmitting || isUploading3D}
                        className="w-full sm:flex-1 py-3.5 bg-[#ff9e00] hover:bg-[#ffaa22] text-black rounded-none font-mono font-bold text-xs uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {(isSubmitting || isUploading3D) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {isUploading3D ? `Mengunggah 3D... ${upload3DProgress}%` : isSubmitting ? 'Memproses...' : 'Simpan ke Portofolio'}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      </motion.div>

      {/* MODAL UPGRADE PRO */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowUpgradeModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 15 }}
              className="bg-zinc-950 p-6 sm:p-8 max-w-sm w-full relative z-10 border border-white/10 rounded-none flex flex-col items-center text-center"
            >
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center bg-zinc-900 border border-white/10 text-white/50 hover:text-white rounded-none transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="w-16 h-16 bg-[#ff9e00]/10 border border-[#ff9e00]/25 rounded-none flex items-center justify-center mb-6">
                <Rocket className="w-7 h-7 text-[#ff9e00]" />
              </div>
              
              <h3 className="text-base font-mono font-bold text-white mb-2 uppercase tracking-wider">Upgrade ke PRO</h3>
              <p className="text-xs font-mono text-white/40 mb-8 leading-relaxed">
                Nikmati fitur unggah video langsung ke server super cepat (bebas iklan), ukuran hingga 100MB, dan model 3D interaktif.
              </p>
              
              <Link 
                href="/pricing"
                className="w-full py-4 rounded-none bg-[#ff9e00] hover:bg-[#ffaa22] text-black font-mono font-bold text-xs uppercase tracking-widest text-center shadow-lg transition-all"
              >
                Lihat Paket PRO
              </Link>
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="w-full mt-4 py-2 text-[10px] font-mono font-bold text-white/30 hover:text-white uppercase tracking-widest transition-colors"
              >
                Nanti Saja
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}