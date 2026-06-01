"use client";

import React, { useState } from 'react';

export function SaveDraftModal({
  isOpen,
  onClose,
  onSave,
  isSaving
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  isSaving: boolean;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim(), description.trim());
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Simpan Draft Baru</h2>
            <p className="text-[11px] text-neutral-500 font-medium mt-1">
              Beri nama agar mudah ditemukan nanti
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-2">
              Nama Draft <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="contoh: Tema Gelap Lebaran"
              maxLength={50}
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-2">
              Deskripsi <span className="text-neutral-300">(opsional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="contoh: Warna gelap untuk nuansa lebaran, font serif elegan..."
              maxLength={200}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all resize-none"
            />
            <p className="text-[10px] text-neutral-400 mt-1 text-right">{description.length}/200</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-[11px] font-bold tracking-wide bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={!name.trim() || isSaving}
            className="flex-1 py-3 rounded-xl text-[11px] font-bold tracking-wide bg-neutral-900 text-white hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <><i className="fas fa-spinner animate-spin"></i> Menyimpan...</>
            ) : (
              <><i className="fas fa-save"></i> Simpan Draft</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
