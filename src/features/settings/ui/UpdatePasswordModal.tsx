//components/features/settings/UpdatePasswordModal.tsx
import React, { useState } from 'react';
import { Mail, Lock, Unlock, Key, Loader2, Check } from 'lucide-react';
import { SettingsState, SettingsActions } from '../model/useSettings';


interface UpdatePasswordModalProps {
  state: SettingsState;
  actions: SettingsActions;
}

export function UpdatePasswordModal({ state, actions }: UpdatePasswordModalProps) {
  const { showPasswordModal, isUpdatingPassword, isStrictlyGoogle, isSuccessModal, successData } = state;
  const { setShowPasswordModal, setIsSuccessModal, handleUpdatePassword, handleInternalForgotPassword } = actions;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!showPasswordModal) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleUpdatePassword(currentPassword, newPassword, confirmPassword);
    if (success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => {
            if (!isUpdatingPassword) {
                setShowPasswordModal(false);
                setTimeout(() => setIsSuccessModal(false), 300); // Reset state saat tutup
            }
        }}
      ></div>
      <div className="relative w-full max-w-md bg-zinc-900/40 backdrop-blur-2xl p-2 rounded-none border border-white/10 shadow-2xl z-10">
        <div className="bg-zinc-950 rounded-none p-6 md:p-8 w-full shadow-none overflow-hidden border border-white/5">
        
        {isSuccessModal ? (
            /* --- TAMPILAN SUKSES ELEGAN --- */
            <div className="flex flex-col items-center justify-center py-4 text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-none flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 border border-emerald-500/20 rounded-none animate-ping opacity-50"></div>
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-2">
                {successData.title}
              </h3>
              <p className="text-white/40 text-xs font-mono leading-relaxed mb-8 px-4">
                {successData.desc}
              </p>
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setTimeout(() => setIsSuccessModal(false), 300);
                }} 
                className="w-full bg-[#ff9e00] text-black py-3 rounded-none text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#ffaa22] transition-all"
              >
                Done
              </button>
            </div>
        ) : (
            /* --- TAMPILAN FORM ASLI --- */
            <>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-2">{isStrictlyGoogle ? "Create Local Password" : "Update Password"}</h3>
                <p className="text-white/40 mb-8 text-xs font-mono leading-relaxed">
                  {isStrictlyGoogle ? "Create a password so you can log in using this email without going through Google." : "Make sure your new password is unique and secure."}
                </p>
                
                <form onSubmit={onSubmit} className="flex flex-col gap-5">
                  {!isStrictlyGoogle && (
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/40">Current Password</label>
                        <button 
                          type="button"
                          onClick={handleInternalForgotPassword}
                          className="text-[10px] text-[#ff9e00] font-mono font-bold hover:underline transition-all"
                        >
                          Forgot current password?
                        </button>
                      </div>
                      <div className="relative flex items-center">
                        <Unlock className="absolute left-4 text-white/20 w-4 h-4" />
                        <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full pl-11 pr-5 py-3 bg-zinc-950 border border-white/10 rounded-none text-xs font-mono text-white outline-none focus:border-[#ff9e00]/50 transition-all" placeholder="Your old password" />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/40 mb-2">New Password</label>
                    <div className="relative flex items-center">
                      <Key className="absolute left-4 text-white/20 w-4 h-4" />
                      <input type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full pl-11 pr-5 py-3 bg-zinc-950 border border-white/10 rounded-none text-xs font-mono text-white outline-none focus:border-[#ff9e00]/50 transition-all" placeholder="Minimum 6 characters" />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/40 mb-2">Confirm Password</label>
                    <div className="relative flex items-center">
                      <Check className="absolute left-4 text-white/20 w-4 h-4" />
                      <input type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-11 pr-5 py-3 bg-zinc-950 border border-white/10 rounded-none text-xs font-mono text-white outline-none focus:border-[#ff9e00]/50 transition-all" placeholder="Repeat new password" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowPasswordModal(false)} disabled={isUpdatingPassword} className="flex-1 py-2.5 rounded-none font-mono font-bold uppercase tracking-wider text-white/50 bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-all text-xs">Cancel</button>
                    <button type="submit" disabled={isUpdatingPassword} className="flex-1 py-2.5 rounded-none font-mono font-bold uppercase tracking-wider text-black bg-[#ff9e00] hover:bg-[#ffaa22] transition-all flex items-center justify-center gap-2 text-xs">
                      {isUpdatingPassword ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Save Password'}
                    </button>
                  </div>
                </form>
            </>
        )}
        </div>
      </div>
    </div>
  );
}
