"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { LazyImage } from '@/shared/ui/LazyImage';
import { showToast } from '@/shared/lib/customToast';
import { 
  MessageSquare, 
  Plus, 
  X, 
  PenTool, 
  Camera, 
  Star, 
  Loader2, 
  Check, 
  Trash2, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown, 
  AlertTriangle,
  MessageSquareOff
} from 'lucide-react';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({ clientName: '', company: '', content: '', rating: 5, avatarUrl: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const isSubmittingRef = useRef(false);
  const isDeletingRef = useRef(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimeTypes.includes(file.type)) {
      showToast({ message: "Unsupported format. Please upload JPG, PNG, or WEBP.", id: "err-testimonial-img-type", icon: "fa-exclamation" });
      return;
    }

    const maxImageSize = 5 * 1024 * 1024;
    if (file.size > maxImageSize) {
      showToast({ message: "Maximum image size is 5MB", id: "err-testimonial-img-size", icon: "fa-exclamation" });
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
    if (!cloudName || !uploadPreset) {
      showToast({ message: "Cloudinary configuration not found", id: "up-fail", icon: "fa-times" });
      return;
    }

    setIsUploadingImage(true);
    const formDataObj = new FormData();
    formDataObj.append('file', file);
    formDataObj.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formDataObj
      });
      const data = await res.json();
      
      if (res.ok && data.secure_url) {
        setFormData(prev => ({ ...prev, avatarUrl: data.secure_url }));
        showToast({ message: "Photo uploaded quickly via Edge Node! ⚡", id: "up-ok", icon: "fa-bolt" });
      } else {
        showToast({ message: data.error?.message || "Failed to upload image", id: "up-fail", icon: "fa-times" });
      }
    } catch (err) {
      showToast({ message: "Edge network error occurred", id: "up-err", icon: "fa-wifi" });
    } finally {
      setIsUploadingImage(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsAdding(true);
    try {
      const url = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        resetForm();
        showToast({ message: `Testimoni berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}!`, id: "save-success", icon: "fa-check-circle" });
        fetchTestimonials();
      } else {
        const data = await res.json();
        showToast({ message: data.error || "Failed to save testimonial", id: "save-error", icon: "fa-exclamation-circle" });
      }
    } catch (error) {
      console.error(error);
      showToast({ message: "System error occurred", id: "save-error", icon: "fa-exclamation-triangle" });
    } finally {
      setIsAdding(false);
      isSubmittingRef.current = false;
    }
  };

  const resetForm = () => {
    setFormData({ clientName: '', company: '', content: '', rating: 5, avatarUrl: '' });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEditClick = (t: any) => {
    setFormData({
      clientName: t.clientName,
      company: t.company || '',
      content: t.content,
      rating: t.rating,
      avatarUrl: t.avatarUrl || ''
    });
    setEditingId(t.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id: string) => {
    setTestimonialToDelete(id);
  };

  const confirmDelete = async () => {
    if (!testimonialToDelete || isDeletingRef.current) return;
    isDeletingRef.current = true;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/testimonials/${testimonialToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTestimonials();
        showToast({ message: "Testimonial deleted", id: "del-success", icon: "fa-trash" });
      } else {
        const data = await res.json();
        showToast({ message: data.error || "Gagal menghapus testimoni", id: "del-error", icon: "fa-exclamation-triangle" });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
      isDeletingRef.current = false;
      setTestimonialToDelete(null);
    }
  };

  const handleToggleVisible = async (id: string, currentStatus: boolean) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !currentStatus })
      });
      if (res.ok) {
        fetchTestimonials();
      } else {
        const data = await res.json();
        showToast({ message: data.error || "Failed to change status", id: "toggle-error", icon: "fa-exclamation-triangle" });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === testimonials.length - 1)) return;

    const newTestimonials = [...testimonials];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newTestimonials[index], newTestimonials[targetIndex]] = [newTestimonials[targetIndex], newTestimonials[index]];
    setTestimonials(newTestimonials);

    try {
      const res = await fetch('/api/testimonials/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: newTestimonials.map((t: any) => t.id) })
      });
      if (!res.ok) {
        const data = await res.json();
        showToast({ message: data.error || "Too many requests, please wait", id: "reorder-error", icon: "fa-hand-paper" });
        fetchTestimonials();
      }
    } catch (error) {
      console.error(error);
      fetchTestimonials();
    }
  };

  return (
    <main className="min-h-screen font-sans relative overflow-hidden selection:bg-[#ff9e00]/30 selection:text-white pb-24">
      <style dangerouslySetInnerHTML={{__html: `
        .animate-enter { opacity: 0; animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(30px) scale(0.98); filter: blur(3px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
      `}} />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">
        
        {/* MODAL HAPUS */}
        {testimonialToDelete && createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity" 
              onClick={() => !isDeleting && setTestimonialToDelete(null)}
            ></div>
            
            <div className="relative z-10 w-full max-w-[320px] md:max-w-[400px] mx-auto bg-zinc-950 border border-white/10 rounded-md shadow-[0_45px_100px_rgba(0,0,0,0.9)] p-6 md:p-8 flex flex-col text-center">
              <button 
                onClick={() => !isDeleting && setTestimonialToDelete(null)} 
                className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-md border border-transparent text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                 <X className="w-4 h-4" />
              </button>

              <div className="relative flex items-center justify-center mx-auto mb-4 w-10 h-10 md:w-12 md:h-12 bg-[#ff9e00]/10 border border-[#ff9e00]/20 rounded-md text-[#ff9e00]">
                <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              
              <h3 className="text-base md:text-lg font-sans font-medium text-white mb-2">Delete Testimonial?</h3>
              <p className="text-xs font-sans text-white/50 mb-6 leading-relaxed px-1">
                Data ini akan dihapus permanen dari sistem dan tidak dapat dikembalikan lagi.
              </p>
              
              <div className="flex flex-row gap-2 md:gap-3 w-full">
                <button 
                  onClick={confirmDelete} 
                  disabled={isDeleting} 
                  className="flex-1 py-2.5 md:py-3 bg-[#ff9e00] hover:bg-[#ffaa22] rounded-md font-sans font-medium text-black active:scale-95 transition-all flex items-center justify-center gap-1.5 text-[10px] md:text-xs disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                <button 
                  onClick={() => setTestimonialToDelete(null)} 
                  disabled={isDeleting}
                  className="flex-1 py-2.5 md:py-3 bg-zinc-900 border border-white/10 hover:bg-zinc-800 rounded-md font-sans font-medium text-white/70 active:scale-95 transition-all text-[10px] md:text-xs disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {isLoading ? (
          <div className="space-y-4 animate-enter">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
              <div className="space-y-2.5">
                <div className="h-9 w-52 bg-white/5 border border-white/5 rounded-md animate-pulse shimmer"></div>
                <div className="h-4 w-72 bg-white/5 border border-white/5 rounded-md animate-pulse shimmer"></div>
              </div>
              <div className="h-10 w-44 bg-white/5 border border-white/5 rounded-md animate-pulse shimmer"></div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-950 p-5 sm:p-6 rounded-md border border-white/10 flex flex-col sm:flex-row gap-5">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-md bg-white/5 border border-white/5 animate-pulse shimmer"></div>
                </div>
                <div className="flex-1 space-y-3 py-1">
                  <div className="flex items-center gap-2">
                    <div className="h-5 bg-white/5 rounded-md w-36 animate-pulse shimmer"></div>
                    <div className="h-4 bg-white/5 rounded-md w-24 animate-pulse shimmer"></div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => <div key={j} className="w-3.5 h-3.5 bg-white/5 rounded-md animate-pulse shimmer"></div>)}
                  </div>
                  <div className="space-y-2 pt-1">
                    <div className="h-3.5 bg-white/5 rounded-md w-full animate-pulse shimmer"></div>
                    <div className="h-3.5 bg-white/5 rounded-md w-4/5 animate-pulse shimmer"></div>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col gap-2 border-l border-white/5 pl-5 w-[130px] shrink-0">
                  <div className="h-9 bg-white/5 rounded-md w-full animate-pulse shimmer"></div>
                  <div className="h-9 bg-white/5 rounded-md w-full animate-pulse shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 animate-enter">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-sans font-medium uppercase tracking-wider text-white flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-[#ff9e00]" />
                  Testimonials
                </h1>
                <p className="text-xs font-sans text-white/60 mt-2">Bangun kredibilitas portofoliomu dengan ulasan klien.</p>
              </div>
              <button
                onClick={() => { if (isFormOpen) resetForm(); else setIsFormOpen(true); }}
                className="flex items-center gap-1.5 px-5 py-3 rounded-md border border-transparent bg-[#ff9e00] hover:bg-[#ffaa22] text-black text-[10px] font-sans font-medium transition-all active:scale-95 shadow-md"
              >
                {isFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isFormOpen ? 'Batal' : 'Add Testimonial'}
              </button>
            </div>

            {/* FORM TAMBAH / EDIT */}
            {isFormOpen && (
              <div className="bg-zinc-950 p-6 sm:p-8 md:p-10 rounded-md border border-white/10 shadow-none mb-10 animate-enter">
                <h2 className="font-sans font-medium text-sm text-white mb-6 flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-[#ff9e00]" /> {editingId ? 'Edit Review' : 'Write Review'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="flex flex-col sm:flex-row gap-8">
                    {/* Bagian Upload Foto */}
                    <div className="flex flex-col items-center sm:items-start gap-3">
                      <label className="text-[9px] font-sans font-medium text-white/60">Photo (Optional)</label>
                      <input 
                        type="file" 
                        accept="image/png,image/jpeg,image/jpg,image/webp" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                      />
                      <div 
                        onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                        className="w-24 h-24 rounded-md border-2 border-dashed border-white/10 flex items-center justify-center bg-[#0a0a0a] cursor-pointer hover:bg-white/[0.01] hover:border-[#ff9e00]/40 transition-all group overflow-hidden relative"
                      >
                        {isUploadingImage ? (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30 animate-pulse">
                            <Loader2 className="w-5 h-5 animate-spin text-[#ff9e00]" />
                          </div>
                        ) : null}
                        {formData.avatarUrl ? (
                          <>
                            <LazyImage src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
                            <Camera className="w-6 h-6 absolute text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </>
                        ) : (
                          <div className="flex flex-col items-center text-white/60 group-hover:text-[#ff9e00] transition-colors">
                            <Camera className="w-5 h-5 mb-1" />
                            <span className="text-[8px] font-sans font-medium">Upload</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bagian Input Teks */}
                    <div className="flex-1 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[9px] font-sans font-medium text-white/60 mb-2 ml-1">Client Name *</label>
                          <input required type="text" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-4 py-3 text-xs font-sans font-medium text-white outline-none focus:bg-[#0c0c0e] focus:border-[#ff9e00]/40 transition-all placeholder:text-white/20" placeholder="Contoh: Budi Santoso" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-sans font-medium text-white/60 mb-2 ml-1">Position / Company</label>
                          <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-4 py-3 text-xs font-sans font-medium text-white outline-none focus:bg-[#0c0c0e] focus:border-[#ff9e00]/40 transition-all placeholder:text-white/20" placeholder="Contoh: CEO, TechCorp" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[9px] font-sans font-medium text-white/60 mb-2 ml-1">Testimonial Content *</label>
                        <textarea required rows={4} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-4 py-3 text-xs font-sans font-medium text-white outline-none focus:bg-[#0c0c0e] focus:border-[#ff9e00]/40 transition-all placeholder:text-white/20 resize-none" placeholder="Write client appreciation or review here..." />
                      </div>

                      <div>
                        <label className="block text-[9px] font-sans font-medium text-white/60 mb-2 ml-1">Star Rating</label>
                        <div className="flex gap-2">
                          {[1,2,3,4,5].map((star) => (
                            <button 
                              key={star} type="button" 
                              onClick={() => setFormData({...formData, rating: star})}
                              className="w-10 h-10 rounded-md bg-[#0a0a0a] border border-white/10 flex items-center justify-center hover:bg-white/[0.02] transition-colors focus:outline-none"
                            >
                              <Star className={`w-4 h-4 ${formData.rating >= star ? 'text-[#ff9e00] fill-[#ff9e00]' : 'text-white/10'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex justify-end">
                    <button disabled={isAdding} type="submit" className="bg-[#ff9e00] hover:bg-[#ffaa22] text-black px-8 py-3.5 rounded-md font-sans font-medium text-xs active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-md">
                      {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      {isAdding ? 'Saving...' : 'Save Testimonial'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* LIST TESTIMONI */}
            <div className="space-y-4">
              {testimonials.length === 0 ? (
                <div className="text-center py-16 bg-[#050505] rounded-md border border-white/10 border-dashed animate-enter">
                  <div className="w-14 h-14 bg-zinc-900 border border-white/10 rounded-md flex items-center justify-center mx-auto mb-4 text-white/50 text-xl shadow-none">
                    <MessageSquareOff className="w-6 h-6" />
                  </div>
                  <h3 className="font-sans font-medium text-white mb-1">Belum ada testimoni</h3>
                  <p className="text-white/60 text-xs font-sans max-w-xs mx-auto mb-6">Kamu belum memiliki ulasan dari klien. Tambahkan sekarang untuk meningkatkan kepercayaan.</p>
                  <button onClick={() => setIsFormOpen(true)} className="text-xs font-sans font-medium text-[#ff9e00] hover:text-[#ffaa22]">
                    + Tambah Testimoni Pertama
                  </button>
                </div>
              ) : (
                testimonials.map((t, index) => (
                  <div key={t.id} className={`bg-zinc-950 p-5 sm:p-6 rounded-md border transition-all duration-300 ${t.isVisible ? 'border-white/10 hover:border-white/20 hover:bg-white/[0.01]' : 'border-white/5 opacity-40 bg-zinc-900/50'} flex flex-col sm:flex-row gap-5 animate-enter`} style={{animationDelay: `${index * 100}ms`}}>
                    
                    <div className="flex-shrink-0 flex sm:flex-col items-center justify-between sm:justify-start gap-4 sm:gap-2">
                      <div className="flex flex-col gap-1 sm:hidden mr-2">
                        <button disabled={index === 0} onClick={() => handleMove(index, 'up')} className="text-white/50 hover:text-[#ff9e00] disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                        <button disabled={index === testimonials.length - 1} onClick={() => handleMove(index, 'down')} className="text-white/50 hover:text-[#ff9e00] disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                      </div>
                      {t.avatarUrl ? (
                        <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-14 h-14 rounded-md object-cover border border-white/10" />
                      ) : (
                        <div className="w-14 h-14 rounded-md bg-[#ff9e00]/10 text-[#ff9e00] border border-[#ff9e00]/25 flex items-center justify-center font-sans font-medium text-lg">
                          {t.clientName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex sm:hidden gap-2">
                        <button onClick={() => handleEditClick(t)} className="w-9 h-9 flex items-center justify-center bg-zinc-900 border border-white/10 text-white rounded-md hover:bg-white/5 transition-all"><PenTool className="w-3.5 h-3.5" /></button>
                        <button disabled={processingId === t.id} onClick={() => handleToggleVisible(t.id, t.isVisible)} className={`w-9 h-9 flex items-center justify-center rounded-md transition-all disabled:opacity-50 ${t.isVisible ? 'bg-zinc-900 border border-white/10 text-white/50 hover:bg-white/5' : 'bg-[#ff9e00] text-black'}`}>
                          {processingId === t.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (t.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />)}
                        </button>
                        <button onClick={() => handleDeleteClick(t.id)} className="w-9 h-9 flex items-center justify-center bg-zinc-900 border border-white/10 text-white rounded-md hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/30 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                        <h3 className="font-sans font-medium text-white text-base">{t.clientName}</h3>
                        {t.company && <span className="text-[9px] font-sans font-medium text-white/50 px-2 py-0.5 bg-white/5 border border-white/10 rounded-md">{t.company}</span>}
                      </div>
                      <div className="flex gap-0.5 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'text-[#ff9e00] fill-[#ff9e00]' : 'text-white/10'}`} />
                        ))}
                      </div>
                      <p className="text-xs font-sans text-white/60 leading-relaxed max-w-2xl italic">"{t.content}"</p>
                    </div>
                    
                    <div className="hidden sm:flex flex-col justify-between items-center px-2">
                      <button disabled={index === 0} onClick={() => handleMove(index, 'up')} className="p-1 text-white/50 hover:text-[#ff9e00] disabled:opacity-30 transition-colors"><ChevronUp className="w-4 h-4" /></button>
                      <button disabled={index === testimonials.length - 1} onClick={() => handleMove(index, 'down')} className="p-1 text-white/50 hover:text-[#ff9e00] disabled:opacity-30 transition-colors"><ChevronDown className="w-4 h-4" /></button>
                    </div>
                    
                    <div className="hidden sm:flex flex-col gap-2 justify-start border-l border-white/5 pl-5 w-[130px] shrink-0">
                      <button onClick={() => handleEditClick(t)} className="px-3 py-2 flex items-center justify-center gap-1.5 rounded-md transition-all text-[10px] font-sans font-medium w-full bg-zinc-900 border border-white/10 text-white/70 hover:bg-zinc-800"><PenTool className="w-3.5 h-3.5" /> Edit</button>
                      <button disabled={processingId === t.id} onClick={() => handleToggleVisible(t.id, t.isVisible)} className={`px-3 py-2 flex items-center justify-center gap-1.5 rounded-md transition-all text-[10px] font-sans font-medium w-full disabled:opacity-50 ${t.isVisible ? 'bg-zinc-900 border border-white/10 text-white/70 hover:bg-zinc-800' : 'bg-[#ff9e00] text-black hover:bg-[#ffaa22]'}`}>
                        {processingId === t.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (t.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />)} {t.isVisible ? 'Hide' : 'Show'}
                      </button>
                      <button onClick={() => handleDeleteClick(t.id)} className="px-3 py-2 flex items-center justify-center gap-1.5 rounded-md transition-all text-[10px] font-sans font-medium w-full bg-zinc-900 border border-white/10 text-white/50 hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/30"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

      </div>
    </main>
  );
}


