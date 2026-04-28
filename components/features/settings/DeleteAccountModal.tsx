import React from 'react';

interface DeleteAccountModalProps {
  state: any;
  actions: any;
}

export function DeleteAccountModal({ state, actions }: DeleteAccountModalProps) {
  const { isDeleting, showDeleteModal } = state;
  const { setShowDeleteModal, confirmDeletion } = actions;

  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={() => !isDeleting && setShowDeleteModal(false)}
      ></div>
      <div className="relative bg-white rounded-[2rem] p-8 md:p-10 max-w-sm w-full shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 animate-enter z-10">
        <div className="w-16 h-16 bg-slate-100 border border-slate-200 shadow-inner text-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <i className="fas fa-exclamation-triangle text-xl"></i>
        </div>
        <h3 className="text-2xl font-black text-center text-slate-900 mb-3 tracking-tight">Hapus Permanen?</h3>
        <p className="text-center text-slate-500 mb-10 text-sm font-medium leading-relaxed px-2">
          Tindakan ini <span className="font-bold text-slate-900">tidak dapat dibatalkan</span>. Semua portofolio dan pengaturan URL akan dimusnahkan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button 
            onClick={() => setShowDeleteModal(false)} 
            disabled={isDeleting} 
            className="w-full sm:flex-1 py-3.5 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all text-sm disabled:opacity-50"
          >
            Batalkan
          </button>
          <button 
            onClick={confirmDeletion} 
            disabled={isDeleting} 
            className="w-full sm:flex-1 py-3.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-rose-600 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shadow-lg disabled:opacity-50"
          >
            {isDeleting ? <i className="fas fa-circle-notch fa-spin text-white"></i> : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
