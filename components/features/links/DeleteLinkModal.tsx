import React from 'react';

interface DeleteLinkModalProps {
  state: any;
  actions: any;
}

export function DeleteLinkModal({ state, actions }: DeleteLinkModalProps) {
  const { linkToDelete, isDeleting } = state;
  const { setLinkToDelete, confirmDelete } = actions;

  if (!linkToDelete) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={() => !isDeleting && setLinkToDelete(null)}
      ></div>
      
      <div className="relative bg-white rounded-[2rem] p-8 md:p-10 max-w-sm w-full shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 animate-enter z-10">
        <div className="w-16 h-16 bg-slate-100 border border-slate-200 shadow-inner text-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <i className="fas fa-trash-alt text-xl"></i>
        </div>
        
        <h3 className="text-2xl font-black text-center text-slate-900 mb-3 tracking-tight">
          Hapus Tautan?
        </h3>
        
        <p className="text-center text-slate-500 mb-8 text-sm font-medium leading-relaxed px-2">
          Tautan ini akan dihapus secara permanen dan tidak akan ditampilkan lagi di portofolio publik Anda.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button 
            onClick={() => setLinkToDelete(null)} 
            disabled={isDeleting}
            className="w-full sm:flex-1 px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-700 active:scale-95 transition-all text-sm disabled:opacity-50"
          >
            Batalkan
          </button>
          <button 
            onClick={confirmDelete} 
            disabled={isDeleting} 
            className="w-full sm:flex-1 px-6 py-3.5 bg-slate-900 hover:bg-rose-600 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isDeleting ? <div className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div> : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
