//components/features/appearance/DraftManagerModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { THEMES_DATA } from '@/lib/themes';
import { 
  X, Globe, FileText, CheckCircle, Clock, Trash2, 
  Loader2, Palette, AlertTriangle, FileInput, ArrowRight 
} from 'lucide-react';

export function DraftManagerModal({ 
  isOpen, 
  onClose, 
  drafts, 
  activeDraftId,
  publishedDraftId,
  onLoadDraft 
}: { 
  isOpen: boolean;
  onClose: () => void;
  drafts: any[];
  activeDraftId: string | null;
  publishedDraftId: string | null;
  onLoadDraft: (draft: any) => void;
}) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(activeDraftId);

  useEffect(() => {
    if (isOpen) {
      if (activeDraftId) {
        setSelectedDraftId(activeDraftId);
      } else {
        setSelectedDraftId('live');
      }
    }
  }, [isOpen, activeDraftId]);

  if (!isOpen) return null;

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/appearance/drafts?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Draft dihapus');
        if (selectedDraftId === id) setSelectedDraftId('live');
        onClose();
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error('Gagal menghapus draft');
      }
    } catch {
      toast.error('Error server');
    } finally {
      setIsDeleting(null);
    }
  };

  const selectedDraft = drafts.find(d => d.id === selectedDraftId);
  const isViewingLive = selectedDraftId === 'live';

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-8 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-white/10 w-full max-w-5xl h-[85vh] md:h-[75vh] min-h-[550px] rounded-none shadow-none overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        
        {/* === SIDEBAR (Master List) === */}
        <div className="w-full md:w-[320px] h-[45%] md:h-auto bg-zinc-950 border-b md:border-b-0 md:border-r border-white/5 flex flex-col shrink-0">
          
          <div className="px-6 py-4 md:py-5 flex items-center justify-between shrink-0 border-b border-white/5">
            <div>
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Manajemen Draft</h2>
              <p className="text-[10px] text-white/40 font-mono mt-0.5 uppercase tracking-widest">{drafts.length} Tersimpan</p>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-none bg-zinc-900 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="overflow-y-auto flex-1 p-3 space-y-1 custom-scrollbar">
            {/* Opsi Live */}
            <button
              onClick={() => setSelectedDraftId('live')}
              className={`w-full text-left px-4 py-3 rounded-none transition-all flex items-center gap-3 ${
                isViewingLive 
                  ? 'bg-zinc-900 border border-white/10 text-white' 
                  : 'hover:bg-zinc-900 text-white/40'
              }`}
            >
              <div className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 border border-white/5 bg-zinc-950 ${isViewingLive ? 'text-[#ff9e00]' : 'text-white/40'}`}>
                <Globe className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-mono font-bold text-xs uppercase truncate">Versi Publik (Live)</h4>
                <p className="text-[9px] font-mono text-white/30 truncate mt-0.5">Desain utama</p>
              </div>
              {activeDraftId === null && (
                <div className="w-1.5 h-1.5 rounded-none bg-emerald-400 shrink-0 animate-pulse"></div>
              )}
            </button>

            {/* Separator */}
            <div className="h-px bg-white/5 my-2 mx-2"></div>

            {/* List Draft */}
            {drafts.map((draft) => {
              const isSelected = selectedDraftId === draft.id;
              const isLive = publishedDraftId === draft.id;
              const isActive = activeDraftId === draft.id;
              
              return (
                <button
                  key={draft.id}
                  onClick={() => setSelectedDraftId(draft.id)}
                  className={`w-full text-left px-4 py-3 rounded-none transition-all flex items-center gap-3 ${
                    isSelected 
                      ? 'bg-zinc-900 border border-white/10 text-white' 
                      : 'hover:bg-zinc-900 text-white/40'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 border border-white/5 bg-zinc-950 ${isSelected ? 'text-[#ff9e00]' : 'text-white/40'}`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-mono font-bold text-xs uppercase truncate">{draft.name}</h4>
                      {isLive && (
                        <span className="shrink-0 text-[8px] font-mono font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 border border-emerald-500/20">LIVE</span>
                      )}
                    </div>
                    <p className="text-[9px] font-mono text-white/30 mt-0.5 truncate">
                      {new Date(draft.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  {isActive && !isLive && (
                    <div className="w-1.5 h-1.5 rounded-none bg-sky-400 shrink-0 animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* === MAIN CONTENT (Detail View) === */}
        <div className="flex-1 bg-zinc-900/40 flex flex-col relative overflow-hidden">
          
          <div className="flex-1 overflow-y-auto">
            {isViewingLive ? (
              
              <div className="p-8 md:p-12 max-w-2xl mx-auto h-full flex flex-col justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-none bg-zinc-950 border border-white/10 flex items-center justify-center mb-6 text-[#ff9e00]">
                  <Globe className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider mb-3">Versi Publik (Live)</h2>
                <p className="text-[11px] font-mono text-white/40 leading-relaxed mb-8 uppercase tracking-wide">
                  Ini adalah desain utama yang saat ini sedang aktif dan dapat dilihat oleh semua pengunjung portfolio Anda. 
                  Semua perubahan pada mode live akan langsung terlihat di website publik.
                </p>
                
                <div className="pt-8 border-t border-white/5">
                  <button 
                    onClick={() => window.location.reload()}
                    disabled={activeDraftId === null}
                    className={`px-6 py-3 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 w-max ${
                      activeDraftId === null 
                        ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 cursor-not-allowed' 
                        : 'bg-[#ff9e00] text-black hover:bg-[#ffaa22]'
                    }`}
                  >
                    {activeDraftId === null ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> <span>Sedang Terbuka di Editor</span>
                      </>
                    ) : (
                      'Muat Mode Live ke Editor'
                    )}
                  </button>
                </div>
              </div>

            ) : selectedDraft ? (

              <div className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col h-full w-full">
                {/* Header Information */}
                <div className="mb-8 md:mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2.5 py-1 bg-zinc-950 border border-white/10 text-white/40 rounded-none text-[8px] font-mono font-bold uppercase tracking-widest">
                      Draft Tersimpan
                    </span>
                    {publishedDraftId === selectedDraft.id && (
                      <span className="px-2.5 py-1 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded-none text-[8px] font-mono font-bold uppercase tracking-widest">
                        Tayang Live
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-mono font-bold text-white uppercase tracking-wider leading-tight mb-4">
                    {selectedDraft.name}
                  </h2>
                  <p className="text-[10px] text-white/40 font-mono flex items-center gap-2 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" /> Diperbarui pada {new Date(selectedDraft.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8 md:mb-10 pb-6 md:pb-8 border-b border-white/5">
                  <button 
                    onClick={() => onLoadDraft(selectedDraft)}
                    disabled={activeDraftId === selectedDraft.id}
                    className={`w-full sm:w-auto justify-center px-8 py-3 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                      activeDraftId === selectedDraft.id 
                        ? 'bg-zinc-950 border border-white/10 text-white/30 cursor-not-allowed' 
                        : 'bg-[#ff9e00] text-black hover:bg-[#ffaa22]'
                    }`}
                  >
                    {activeDraftId === selectedDraft.id ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> <span>Sedang Terbuka</span>
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4" /> <span>Muat ke Editor</span>
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => setDraftToDelete(selectedDraft.id)}
                    disabled={isDeleting === selectedDraft.id}
                    className="w-full sm:w-auto justify-center px-5 py-3 rounded-none text-[10px] font-mono font-bold text-rose-500 bg-rose-950/10 border border-rose-500/20 hover:bg-rose-950/20 hover:text-rose-400 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isDeleting === selectedDraft.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    <span>Hapus</span>
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pb-6">
                  <div className="p-5 bg-zinc-950 border border-white/5 rounded-none">
                    <h5 className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest mb-3">Warna Aksen</h5>
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-none border border-white/10 shrink-0" 
                        style={{ backgroundColor: selectedDraft.themeColor }}
                      ></div>
                      <div>
                        <p className="text-xs font-mono font-bold text-white uppercase">{selectedDraft.themeColor}</p>
                        <p className="text-[9px] font-mono text-white/30 mt-0.5 uppercase">Kode Hex</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-zinc-950 border border-white/5 rounded-none">
                    <h5 className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest mb-3">Basis Tema</h5>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-none bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0 text-white/50">
                        <Palette className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-mono font-bold text-white leading-tight uppercase">
                          {THEMES_DATA.find(t => t.id === selectedDraft.themeTemplate)?.name || selectedDraft.themeTemplate}
                        </p>
                        <p className="text-[9px] font-mono text-white/30 mt-0.5 uppercase">Template Visual</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Box */}
                <div className="pb-8">
                  <h5 className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest mb-3">Deskripsi / Catatan</h5>
                  {selectedDraft.description ? (
                    <p className="text-[11px] font-mono text-white/60 leading-relaxed max-w-2xl bg-zinc-950 p-4 rounded-none border border-white/5">
                      {selectedDraft.description}
                    </p>
                  ) : (
                    <p className="text-[11px] font-mono text-white/30 italic uppercase">Tidak ada catatan untuk draft ini.</p>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex-1 h-full flex items-center justify-center text-white/40 font-mono uppercase text-[10px] tracking-wider">
                <p>Pilih draft di sebelah kiri</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {draftToDelete && (
        <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
            onClick={() => isDeleting === null && setDraftToDelete(null)}
          ></div>
          
          <div className="relative z-10 w-full max-w-[360px] animate-enter mx-auto">
            <div className="relative bg-zinc-900 border border-white/10 rounded-none p-6 shadow-none flex flex-col text-center">
              
              <button 
                onClick={() => isDeleting === null && setDraftToDelete(null)} 
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-none text-white/40 hover:text-white bg-zinc-950 border border-white/10 transition-colors"
              >
                 <X className="w-4 h-4" />
              </button>

              <div className="relative flex items-center justify-center mx-auto mb-4 w-12 h-12">
                <div className="absolute inset-0 bg-rose-500/10 rounded-none animate-pulse"></div>
                <div className="relative w-8 h-8 bg-zinc-950 border border-white/10 text-rose-500 rounded-none flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2">Hapus Draft Ini?</h3>
              <p className="text-[10px] font-mono text-white/40 mb-6 leading-relaxed uppercase tracking-wide">
                Draft yang dihapus tidak dapat dikembalikan. Apakah Anda yakin ingin melanjutkan?
              </p>
              
              <div className="flex flex-row gap-3 w-full">
                <button 
                  onClick={() => {
                    handleDelete(draftToDelete);
                    setDraftToDelete(null); 
                  }}
                  disabled={isDeleting !== null} 
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 rounded-none font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Ya, Hapus
                </button>
                <button 
                  onClick={() => setDraftToDelete(null)} 
                  disabled={isDeleting !== null}
                  className="flex-1 py-3 bg-zinc-950 border border-white/10 hover:bg-zinc-900 rounded-none font-mono font-bold text-white/60 text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
