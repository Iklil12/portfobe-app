"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '@/lib/customToast';
import { ProjectType } from '@/hooks/useProjects';
import { LazyImage } from '@/components/ui/LazyImage';
import { X, UploadCloud, Box, Check, Film, Image as ImageIcon, Sparkles, Rocket, Award, Loader2, Crown } from 'lucide-react';
import { useProjectUpload } from './useProjectUpload';
import { UpgradeToProModal } from './UpgradeToProModal';
import { ProjectTypeSelection } from './ProjectTypeSelection';



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

  const {
    uploadProgress,
    isUploadingVideo,
    fileInputRef,
    file3d,
    setFile3d,
    file3dInputRef,
    isUploading3D,
    setIsUploading3D,
    upload3DProgress,
    setUpload3DProgress,
    isUploadingImage,
    setIsUploadingImage,
    fileImageInputRef,
    isDragActive,
    processImageUpload,
    processVideoUpload,
    process3DFile,
    handleDrag,
    handleDrop,
    handleVideoUpload
  } = useProjectUpload({ userPlan, projectTitle, projectType, setMediaUrl, setShowUpgradeModal });
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
                  {editingId ? 'Edit Data' : (projectType ? `${projectType === 'certificate' ? 'Certificate' : 'Project'} Detail` : 'Select Upload Type')}
                </h2>
                <p className="text-xs font-mono text-white/40 mt-1.5 leading-relaxed">
                  {editingId ? 'Update the data information carefully.' : (projectType ? 'Complete the form below with appropriate details.' : 'Choose the data format to add to your portfolio.')}
                </p>
              </div>

              {/* ANIMATE PRESENCE: Transisi mulus antara Pilih Tipe & Isi Form */}
              <AnimatePresence mode="wait">
                {!projectType ? (
                  // --- STEP 1: PEMILIHAN TIPE PROYEK ---
                  <ProjectTypeSelection userPlan={userPlan} setProjectType={setProjectType} setShowUpgradeModal={setShowUpgradeModal} />

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
                           showToast({ message: 'Title and 3D File are required!', id: 'err-3d-req', icon: "⚠️" });
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
                              showToast({ message: '3D Model uploaded successfully', id: 'succ-3d', icon: "✅" });
                              handleCloseModal();
                              window.location.reload();
                            } else {
                              try {
                                const err = JSON.parse(xhr.responseText);
                                showToast({ message: err.error || 'Failed to upload', id: 'err-3d-api', icon: "❌" });
                              } catch {
                                showToast({ message: 'Failed to upload 3D model', id: 'err-3d-api', icon: "❌" });
                              }
                              if (file3dInputRef.current) file3dInputRef.current.value = '';
                            }
                            setIsUploading3D(false);
                          };

                          xhr.onerror = () => {
                            showToast({ message: 'Failed to connect to server', id: 'err-net', icon: '⚠️' });
                            setIsUploading3D(false);
                            if (file3dInputRef.current) file3dInputRef.current.value = '';
                          };

                          xhr.send(formData);
                        } catch (err) {
                           showToast({ message: 'Failed to connect to server', id: 'err-net', icon: '⚠️' });
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
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">{projectType === 'certificate' ? 'Certificate/Event' : 'Project'} Title <span className="text-rose-500">*</span></label>
                        <input
                          type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder={projectType === 'certificate' ? "e.g. Graphic Design Award 2022..." : "e.g. UI/UX Masterclass..."}
                          className="w-full px-5 py-3.5 rounded-none border border-white/10 bg-zinc-900 focus:bg-zinc-950 focus:border-[#ff9e00] outline-none text-sm font-mono text-white transition-all duration-300 placeholder:text-white/30"
                          required
                        />
                      </div>

                      {/* KHUSUS SERTIFIKAT */}
                      {projectType === 'certificate' && (
                        <>
                          <div className="md:col-span-1">
                            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Achievement / Status <span className="text-rose-500">*</span></label>
                            <input
                              type="text" value={certStatus} onChange={(e) => setCertStatus(e.target.value)} placeholder="1st Place, Finalist, Staff..."
                              className="w-full px-5 py-3.5 rounded-none border border-white/10 bg-zinc-900 focus:bg-zinc-950 focus:border-[#ff9e00] outline-none text-sm font-mono text-white transition-all duration-300 placeholder:text-white/30"
                              required
                            />
                          </div>
                          <div className="md:col-span-1">
                            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Issuer / Organizer <span className="text-rose-500">*</span></label>
                            <input
                              type="text" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} placeholder="Coursera, Google..."
                              className="w-full px-5 py-3.5 rounded-none border border-white/10 bg-zinc-900 focus:bg-zinc-950 focus:border-[#ff9e00] outline-none text-sm font-mono text-white transition-all duration-300 placeholder:text-white/30"
                              required
                            />
                          </div>
                          <div className="md:col-span-1">
                            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Year <span className="text-rose-500">*</span></label>
                            <input
                              type="number" value={certYear} onChange={(e) => setCertYear(e.target.value)} placeholder="e.g. 2024"
                              className="w-full px-5 py-3.5 rounded-none border border-white/10 bg-zinc-900 focus:bg-zinc-950 focus:border-[#ff9e00] outline-none text-sm font-mono text-white transition-all duration-300 placeholder:text-white/30"
                              required
                            />
                          </div>
                        </>
                      )}

                      {/* INPUT MEDIA */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">
                          {projectType === 'video' ? 'Video Link (YouTube/Vimeo)' : projectType === '3d' ? 'Upload 3D File (.GLB)' : 'Upload Image File'} <span className="text-rose-500">*</span>
                        </label>
                        {projectType === '3d' ? (
                          <div className="w-full">
                            <input type="file" accept=".glb,.gltf" className="hidden" ref={file3dInputRef} onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const max3DSize = userPlan === 'SUPREME' ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
                                const max3DLabel = userPlan === 'SUPREME' ? '100MB' : '50MB';
                                if (f.size > max3DSize) {
                                   showToast({ message: `Max ${max3DLabel}`, id: "err-3d", icon: "⚠️" });
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
                                  <span className="text-[9px] font-mono font-bold text-white/30 mt-1.5 uppercase tracking-widest">Click to replace</span>
                                </div>
                              ) : editingId && mediaUrl ? (
                                <div className="py-8 flex flex-col items-center text-center px-4">
                                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-none flex items-center justify-center text-emerald-400 mb-3">
                                    <Check className="w-5 h-5" />
                                  </div>
                                  <span className="text-xs font-mono font-bold text-white">3D File Attached</span>
                                  <span className="text-[9px] font-mono font-bold text-white/30 mt-1.5 uppercase tracking-widest">Click to replace file</span>
                                </div>
                              ) : (
                                <div className="py-8 flex flex-col items-center text-center px-4">
                                  <div className="w-12 h-12 bg-zinc-950 border border-white/5 rounded-none flex items-center justify-center text-white/30 mb-3 group-hover/upload:bg-[#ff9e00]/10 group-hover/upload:text-[#ff9e00] group-hover/upload:border-[#ff9e00]/30 transition-all duration-300">
                                    <UploadCloud className="w-5 h-5" />
                                  </div>
                                  <span className="text-xs font-mono font-bold text-white flex items-center gap-2">Select 3D File (.GLB/.GLTF)</span>
                                  <span className="text-[9px] font-mono font-bold text-white/30 mt-1.5 uppercase tracking-widest">Max {userPlan === 'SUPREME' ? '100MB' : '50MB'}</span>
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
                                Upload <Crown className="w-3 h-3 text-[#ff9e00]" />
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
                                      <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Uploading... {uploadProgress}%</span>
                                    </div>
                                  ) : mediaUrl && !mediaUrl.includes('youtube') && !mediaUrl.includes('vimeo') && mediaUrl.length === 36 ? (
                                    <div className="py-8 flex flex-col items-center text-center px-4">
                                      <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-none flex items-center justify-center text-emerald-400 mb-3">
                                        <Check className="w-5 h-5" />
                                      </div>
                                      <span className="text-xs font-mono font-bold text-white">Video Successfully Uploaded</span>
                                      <span className="text-[9px] font-mono font-bold text-white/30 mt-1.5 uppercase tracking-widest">Click to replace</span>
                                    </div>
                                  ) : (
                                    <div className="py-8 flex flex-col items-center text-center px-4">
                                      <div className="w-12 h-12 bg-zinc-950 border border-white/5 rounded-none flex items-center justify-center text-white/30 mb-3 group-hover/upload:bg-[#ff9e00]/10 group-hover/upload:text-[#ff9e00] group-hover/upload:border-[#ff9e00]/30 transition-all duration-300">
                                        <UploadCloud className="w-5 h-5" />
                                      </div>
                                      <span className="text-xs font-mono font-bold text-white flex items-center gap-2">Upload Video Directly <Crown className="w-3.5 h-3.5 text-[#ff9e00]" /></span>
                                      <span className="text-[9px] font-mono font-bold text-white/30 mt-1.5 uppercase tracking-widest">Max {userPlan === 'SUPREME' ? '100MB' : '50MB'} (MP4, WEBM)</span>
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
                                  showToast({ message: `Max image size ${maxImageLabel}`, id: "err-img", icon: "⚠️" });
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
                                    showToast({ message: "Image successfully uploaded", id: "upload-asset-success", icon: "⚡" });
                                  } else {
                                    showToast({ message: data.error?.message || "Failed to upload image", id: "upload-asset-fail", icon: "❌" });
                                  }
                                } catch (err) {
                                  showToast({ message: "Network error occurred", id: "upload-asset-err", icon: "⚠️" });
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
                                  <span className="text-xs font-mono font-bold text-white">Uploading Image...</span>
                                </div>
                              ) : mediaUrl ? (
                                <div className="relative w-full h-48 bg-zinc-900">
                                  <LazyImage src={mediaUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/upload:scale-105" />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/upload:opacity-100 flex items-center justify-center transition-opacity duration-300 backdrop-blur-[2px]">
                                    <span className="bg-zinc-900 border border-white/10 text-white px-4 py-2 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl">
                                      Change Image
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="py-8 flex flex-col items-center text-center px-4">
                                  <div className="w-12 h-12 bg-zinc-950 border border-white/5 rounded-none flex items-center justify-center text-white/30 mb-3 group-hover/upload:bg-[#ff9e00]/10 group-hover/upload:text-[#ff9e00] group-hover/upload:border-[#ff9e00]/30 transition-all duration-300">
                                    <UploadCloud className="w-5 h-5" />
                                  </div>
                                  <span className="text-xs font-mono font-bold text-white">Click to Upload Image</span>
                                  <span className="text-[9px] font-mono font-bold text-white/30 mt-1.5 uppercase tracking-widest">Max {userPlan === 'SUPREME' ? '15MB' : userPlan === 'PRO' ? '10MB' : '5MB'}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* INPUT DESKRIPSI */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Description (Optional)</label>
                        <textarea
                          rows={3} value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Add a short explanation..."
                          className="w-full px-5 py-4 rounded-none border border-white/10 bg-zinc-900 focus:bg-zinc-950 focus:border-[#ff9e00] outline-none text-sm font-mono text-white resize-none transition-all duration-300 placeholder:text-white/30 custom-scrollbar"
                        />
                      </div>

                      {/* INPUT TAGS */}
                      {projectType !== 'certificate' && (
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">
                            Tags <span className="normal-case font-medium text-white/20">(Optional)</span>
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
                            placeholder={projectTags.length >= 5 ? 'Max 5 tags' : 'Type tag then press Enter or comma...'}
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
                          <p className="text-[9px] font-mono text-white/30 mt-2 ml-1">e.g. UI/UX, Branding, React — Max 5 tags</p>
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
                          Back
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmitting || isUploading3D}
                        className="w-full sm:flex-1 py-3.5 bg-[#ff9e00] hover:bg-[#ffaa22] text-black rounded-none font-mono font-bold text-xs uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {(isSubmitting || isUploading3D) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {isUploading3D ? `Uploading 3D... ${upload3DProgress}%` : isSubmitting ? 'Processing...' : 'Save to Portfolio'}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      </motion.div>

      <UpgradeToProModal showUpgradeModal={showUpgradeModal} setShowUpgradeModal={setShowUpgradeModal} />
      
    </div>
  );
}