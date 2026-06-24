//components/features/appearance/SaveDraftModal.tsx
"use client";

import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-none shadow-none overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Save New Draft</h2>
            <p className="text-[10px] text-white/40 font-mono mt-1">
              Give it a name to find it easily later
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-none bg-zinc-950 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-2">
              Draft Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dark Minimalist Theme"
              maxLength={50}
              autoFocus
              className="w-full px-4 py-3 rounded-none border border-white/10 bg-zinc-950 text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff9e00] transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-2">
              Description <span className="text-white/20">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Dark colors for a moody vibe, elegant serif fonts..."
              maxLength={200}
              rows={3}
              className="w-full px-4 py-3 rounded-none border border-white/10 bg-zinc-950 text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff9e00] transition-all resize-none"
            />
            <p className="text-[9px] font-mono text-white/30 mt-1 text-right">{description.length}/200</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-none text-[10px] font-mono font-bold tracking-wider uppercase bg-zinc-950 border border-white/10 text-white/60 hover:bg-zinc-900 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || isSaving}
            className="flex-1 py-3 rounded-none text-[10px] font-mono font-bold tracking-wider uppercase bg-[#ff9e00] text-black hover:bg-[#ffaa22] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Draft</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
