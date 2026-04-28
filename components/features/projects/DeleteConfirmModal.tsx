"use client";

import React from 'react';

export function DeleteConfirmModal({ state, actions }: { state: any, actions: any }) {
  const { itemToDelete, isDeleting } = state;
  const { cancelDelete, executeDelete } = actions;

  if (!itemToDelete) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={!isDeleting ? cancelDelete : undefined}></div>
      <div className="bg-white rounded-[2rem] w-full max-w-sm relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-enter border border-slate-100 flex flex-col overflow-hidden text-center p-8">
        <div className="w-16 h-16 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <i className="fas fa-exclamation-triangle text-2xl"></i>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Hapus Data?</h3>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Apakah Anda yakin ingin menghapus <span className="font-bold text-slate-900">"{itemToDelete.title}"</span>? Data akan hilang permanen.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button onClick={cancelDelete} disabled={isDeleting} className="w-full sm:flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors text-sm disabled:opacity-50">Batal</button>
          <button onClick={executeDelete} disabled={isDeleting} className="w-full sm:flex-1 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-rose-600 shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
            {isDeleting ? <i className="fas fa-circle-notch fa-spin text-white"></i> : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
