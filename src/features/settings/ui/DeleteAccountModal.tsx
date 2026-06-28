//components/features/settings/DeleteAccountModal.tsx
import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { SettingsState, SettingsActions } from '../model/useSettings';


interface DeleteAccountModalProps {
  state: SettingsState;
  actions: SettingsActions;
}

export function DeleteAccountModal({ state, actions }: DeleteAccountModalProps) {
  const { isDeleting, showDeleteModal, session } = state;
  const { setShowDeleteModal, confirmDeletion } = actions;
  const [emailInput, setEmailInput] = useState('');

  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* 1. Full Screen Blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => !isDeleting && setShowDeleteModal(false)}
      ></div>
      
      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-[500px] animate-enter mx-auto bg-zinc-950 border border-white/10 rounded-md shadow-2xl flex flex-col text-left font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5">
          <h3 className="text-sm font-medium text-white tracking-widest uppercase">Delete Account</h3>
          <button onClick={() => !isDeleting && setShowDeleteModal(false)} className="text-white/40 hover:text-white hover:bg-white/5 p-1 transition-colors rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-xs text-white/50 leading-relaxed uppercase tracking-wide">
            The system will <strong className="text-white font-medium">permanently delete all your projects</strong>, along with images, settings, and other linked assets.
          </p>
          
          <div className="bg-rose-950/20 border-l-2 border-rose-600 p-4 rounded-md text-rose-500 text-[10px] uppercase tracking-widest font-medium flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
            This action cannot be undone.
          </div>
          
          <div className="space-y-3 pt-2">
            <label className="text-[10px] text-white/50 uppercase tracking-widest block">
              For verification, type your email <strong className="text-white">{session?.user?.email}</strong> below:
            </label>
            <input 
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-md px-4 py-3 text-xs text-white placeholder-white/20 outline-none focus:border-rose-500/50 transition-colors uppercase"
              spellCheck={false}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 bg-[#050505] border-t border-white/5">
          <button 
            onClick={() => setShowDeleteModal(false)} 
            disabled={isDeleting} 
            className="px-6 py-3 bg-zinc-900 border border-white/10 hover:bg-zinc-800 rounded-md font-medium uppercase tracking-wider text-white/50 transition-all text-[10px] disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={() => confirmDeletion(emailInput)} 
            disabled={isDeleting || !emailInput || emailInput.toLowerCase() !== session?.user?.email?.toLowerCase()} 
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-zinc-800 disabled:text-white/20 rounded-md font-medium uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 text-[10px] disabled:cursor-not-allowed"
          >
            {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : 'Confirm_Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
