import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { THEMES_DATA } from '@/lib/themes';

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
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-8 bg-neutral-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[85vh] md:h-[75vh] min-h-[550px] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        
        {/* === SIDEBAR (Master List) === */}
        <div className="w-full md:w-[320px] h-[45%] md:h-auto bg-[#f9fafb] border-b md:border-b-0 md:border-r border-neutral-200 flex flex-col shrink-0">
          
          <div className="px-6 py-4 md:py-5 flex items-center justify-between shrink-0 border-b border-neutral-200">
            <div>
              <h2 className="text-[15px] font-semibold text-neutral-900 tracking-tight">Manajemen Draft</h2>
              <p className="text-[11px] text-neutral-500 mt-0.5">{drafts.length} Tersimpan</p>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 transition-colors bg-neutral-100/50"
            >
              <i className="fas fa-times text-sm"></i>
            </button>
          </div>
          
          <div className="overflow-y-auto flex-1 p-3 space-y-1 custom-scrollbar">
            {/* Opsi Live */}
            <button
              onClick={() => setSelectedDraftId('live')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${isViewingLive ? 'bg-white shadow-sm ring-1 ring-neutral-200 text-neutral-900' : 'hover:bg-neutral-100 text-neutral-600'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isViewingLive ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                <i className="fas fa-globe text-xs"></i>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-[13px] truncate">Versi Publik (Live)</h4>
                <p className={`text-[11px] truncate ${isViewingLive ? 'text-neutral-500' : 'text-neutral-400'}`}>Desain utama</p>
              </div>
              {activeDraftId === null && (
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
              )}
            </button>

            {/* Separator */}
            <div className="h-px bg-neutral-200 my-2 mx-2"></div>

            {/* List Draft */}
            {drafts.map((draft) => {
              const isSelected = selectedDraftId === draft.id;
              const isLive = publishedDraftId === draft.id;
              const isActive = activeDraftId === draft.id;
              
              return (
                <button
                  key={draft.id}
                  onClick={() => setSelectedDraftId(draft.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${isSelected ? 'bg-white shadow-sm ring-1 ring-neutral-200 text-neutral-900' : 'hover:bg-neutral-100 text-neutral-600'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${isSelected ? 'bg-neutral-50 border-neutral-200 text-neutral-700' : 'bg-transparent border-neutral-200 text-neutral-400'}`}>
                    <i className="fas fa-file-alt text-xs"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-[13px] truncate">{draft.name}</h4>
                      {isLive && (
                        <span className="shrink-0 text-[8px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">LIVE</span>
                      )}
                    </div>
                    <p className={`text-[11px] mt-0.5 truncate ${isSelected ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      {new Date(draft.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  {isActive && !isLive && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* === MAIN CONTENT (Detail View) === */}
        <div className="flex-1 bg-white flex flex-col relative overflow-hidden">
          
          <div className="flex-1 overflow-y-auto">
            {isViewingLive ? (
              
              <div className="p-8 md:p-12 max-w-2xl mx-auto h-full flex flex-col justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center mb-6">
                  <i className="fas fa-globe text-2xl md:text-3xl text-neutral-400"></i>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight mb-3">Versi Publik (Live)</h2>
                <p className="text-[14px] md:text-[15px] text-neutral-500 leading-relaxed mb-8">
                  Ini adalah desain utama yang saat ini sedang aktif dan dapat dilihat oleh semua pengunjung portfolio Anda. 
                  Semua perubahan pada mode live akan langsung terlihat di website publik.
                </p>
                
                <div className="pt-8 border-t border-neutral-100">
                  <button 
                    onClick={() => window.location.reload()}
                    disabled={activeDraftId === null}
                    className={`px-6 py-3 rounded-xl text-[13px] font-semibold transition-all flex items-center gap-2 w-max ${activeDraftId === null ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-not-allowed' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
                  >
                    {activeDraftId === null ? (
                      <>
                        <i className="fas fa-check-circle"></i> Sedang Terbuka di Editor
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
                    <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded text-[10px] font-bold uppercase tracking-widest">
                      Draft Tersimpan
                    </span>
                    {publishedDraftId === selectedDraft.id && (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase tracking-widest">
                        Tayang Live
                      </span>
                    )}
                  </div>
                  <h2 className="text-4xl font-bold text-neutral-900 tracking-tight leading-tight mb-4">
                    {selectedDraft.name}
                  </h2>
                  <p className="text-[13px] text-neutral-400 flex items-center gap-2">
                    <i className="far fa-clock"></i> Diperbarui pada {new Date(selectedDraft.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8 md:mb-10 pb-6 md:pb-8 border-b border-neutral-100">
                  <button 
                    onClick={() => onLoadDraft(selectedDraft)}
                    disabled={activeDraftId === selectedDraft.id}
                    className={`w-full sm:w-auto justify-center px-8 py-3 rounded-xl text-[13px] font-semibold transition-all flex items-center gap-2 ${activeDraftId === selectedDraft.id ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-900/10'}`}
                  >
                    {activeDraftId === selectedDraft.id ? (
                      <>
                        <i className="fas fa-check-circle"></i> Sedang Terbuka
                      </>
                    ) : (
                      <>
                        <i className="fas fa-file-import"></i> Muat ke Editor
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => setDraftToDelete(selectedDraft.id)}
                    disabled={isDeleting === selectedDraft.id}
                    className="w-full sm:w-auto justify-center px-5 py-3 rounded-xl text-[13px] font-semibold text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isDeleting === selectedDraft.id ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-trash-alt"></i>}
                    Hapus
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pb-6">
                  <div className="p-5 bg-neutral-50/50 border border-neutral-100 rounded-2xl">
                    <h5 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Warna Aksen</h5>
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-full border border-neutral-200/50 shadow-sm shrink-0" 
                        style={{ backgroundColor: selectedDraft.themeColor }}
                      ></div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900 uppercase">{selectedDraft.themeColor}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">Kode Hex</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-neutral-50/50 border border-neutral-100 rounded-2xl">
                    <h5 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Basis Tema</h5>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                        <i className="fas fa-palette text-neutral-400"></i>
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-neutral-900 leading-tight">
                          {THEMES_DATA.find(t => t.id === selectedDraft.themeTemplate)?.name || selectedDraft.themeTemplate}
                        </p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">Template Visual</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Box */}
                <div className="pb-8">
                  <h5 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Deskripsi / Catatan</h5>
                  {selectedDraft.description ? (
                    <p className="text-[14px] text-neutral-700 leading-relaxed max-w-2xl bg-neutral-50/50 p-4 rounded-xl border border-neutral-100">
                      {selectedDraft.description}
                    </p>
                  ) : (
                    <p className="text-[14px] text-neutral-400 italic">Tidak ada catatan untuk draft ini.</p>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex-1 h-full flex items-center justify-center text-neutral-400">
                <p>Pilih draft di sebelah kiri</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal (Universal Style) */}
      {draftToDelete && (
        <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-4">
          {/* 1. Full Screen Blur */}
          <div 
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
            onClick={() => isDeleting === null && setDraftToDelete(null)}
          ></div>
          
          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-[310px] md:max-w-[400px] animate-enter mx-auto">
            {/* 2. Outer Blurred Box */}
            <div className="absolute inset-[-12px] md:inset-[-20px] bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white/50 shadow-2xl"></div>
            
            {/* 3. Main Inner White Box */}
            <div className="relative bg-white rounded-[1.5rem] p-5 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex flex-col text-center">
              
              {/* Close Button */}
              <button 
                onClick={() => isDeleting === null && setDraftToDelete(null)} 
                className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              >
                 <i className="fas fa-times text-xs md:text-sm"></i>
              </button>

              {/* Rippling Orange Icon */}
              <div className="relative flex items-center justify-center mx-auto mb-4 w-10 h-10 md:w-12 md:h-12">
                <div className="absolute inset-0 bg-[#ff9e00]/20 rounded-full animate-ping opacity-70" style={{ animationDuration: '2s' }}></div>
                <div className="absolute inset-1.5 bg-[#ff9e00]/10 rounded-full"></div>
                <div className="relative w-5 h-5 md:w-6 md:h-6 bg-[#ff9e00] text-white rounded-full flex items-center justify-center shadow-md">
                  <i className="fas fa-exclamation text-[8px] md:text-[10px]"></i>
                </div>
              </div>
              
              <h3 className="text-lg md:text-xl font-black text-slate-900 mb-1.5 md:mb-2 tracking-tight">Hapus Draft Ini?</h3>
              <p className="text-xs md:text-sm font-medium text-slate-500 mb-5 md:mb-6 leading-relaxed px-1">
                Draft yang dihapus tidak dapat dikembalikan. Apakah Anda yakin ingin melanjutkan?
              </p>
              
              <div className="flex flex-row gap-2 md:gap-3 w-full">
                <button 
                  onClick={() => {
                    handleDelete(draftToDelete);
                    setDraftToDelete(null); 
                  }}
                  disabled={isDeleting !== null} 
                  className="flex-1 py-2.5 md:py-3 bg-[#ff9e00] hover:bg-[#e68e00] rounded-xl font-bold text-white shadow-lg shadow-[#ff9e00]/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs md:text-sm disabled:opacity-50"
                >
                  <i className="fas fa-trash-alt text-[10px]"></i> Ya, Hapus
                </button>
                <button 
                  onClick={() => setDraftToDelete(null)} 
                  disabled={isDeleting !== null}
                  className="flex-1 py-2.5 md:py-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-700 active:scale-95 transition-all text-xs md:text-sm disabled:opacity-50"
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
