//components/features/profile/ProfileForm.tsx
import React from 'react';
import Link from 'next/link';
import { showToast } from '@/shared/lib/customToast';
import { Mail, CheckCircle2, Copy, Loader2, Plug, ArrowRight, XCircle, Check } from 'lucide-react';
import { useProfileState, useProfileActions } from '@/entities/user/model/useProfile';


interface ProfileFormProps {
  state: useProfileState;
  actions: useProfileActions;
}

export function ProfileForm({ state, actions }: ProfileFormProps) {
  const { firstName, lastName, profession, bio, isSaving, isFormValid, subdomain, subdomainStatus, session, isUsernameChangeBlocked, remainingDays } = state;
  const { setFirstName, setLastName, setProfession, setBio, handleSave, setSubdomain } = actions;
  
  const email = session?.user?.email || "user@example.com";
  const defaultUsername = session?.user?.email?.split('@')[0] || "user";

  // Deteksi login Google: Berdasarkan image provider Google atau ekstensi @gmail.com
  const isGoogleUser = (session?.user as any)?.provider === 'google' || session?.user?.image?.includes('googleusercontent.com') || session?.user?.email?.endsWith('@gmail.com');

  // Fungsi untuk membersihkan teks dari emoji dan karakter aneh (HTML tags, dll)
  const sanitizeText = (text: string) => {
    return text
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
      .replace(/[<>]/g, '');
  };

  const copyLink = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(`portfo.be/${subdomain}`);
    showToast({ message: "Link successfully copied!", id: "copy-link", icon: "fa-link" });
  };

  return (
    <form className="space-y-6 sm:space-y-8 animate-enter" style={{animationDelay: '300ms'}} onSubmit={handleSave}>
      
      {/* SECTION: NAME */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-white/5 pb-6 sm:pb-8 pt-4">
        <div className="w-full sm:w-1/3 shrink-0">
          <label className="block text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">Full Name</label>
          <p className="text-[10px] font-mono text-white/30">Name that will be displayed publicly.</p>
        </div>
        <div className="w-full flex gap-3">
          <input 
            type="text" 
            maxLength={10} 
            value={firstName} 
            onChange={(e) => setFirstName(sanitizeText(e.target.value))} 
            placeholder="Sienna"
            className="w-1/2 px-4 py-3 rounded-none border border-white/10 bg-zinc-950 focus:border-[#ff9e00]/50 outline-none transition-all text-xs font-mono text-white" 
          />
          <input 
            type="text" 
            maxLength={10} 
            value={lastName} 
            onChange={(e) => setLastName(sanitizeText(e.target.value))} 
            placeholder="Hewitt"
            className="w-1/2 px-4 py-3 rounded-none border border-white/10 bg-zinc-950 focus:border-[#ff9e00]/50 outline-none transition-all text-xs font-mono text-white" 
          />
        </div>
      </div>

      {/* SECTION: EMAIL ADDRESS */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-white/5 pb-6 sm:pb-8">
        <div className="w-full sm:w-1/3 shrink-0">
          <label className="block text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">Email Address</label>
          <p className="text-[10px] font-mono text-white/30">Email for login and contact.</p>
        </div>
        <div className="w-full">
          <div className="relative flex items-center">
            <Mail className="absolute left-4 text-white/20 w-4 h-4" />
            <input 
              type="email" 
              value={email} 
              disabled
              className="w-full pl-11 pr-4 py-3 rounded-none border border-white/5 bg-zinc-950/50 text-white/40 outline-none text-xs font-mono cursor-not-allowed opacity-80" 
            />
          </div>
          {/* Tag "Terverifikasi oleh Google" HANYA MUNCUL jika login menggunakan Google */}
          {isGoogleUser && (
            <p className="text-[10px] font-mono font-bold text-[#ff9e00] uppercase tracking-wider mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified by Google
            </p>
          )}
        </div>
      </div>

      {/* SECTION: USERNAME / SUBDOMAIN */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 border-b border-white/5 pb-6 sm:pb-8">
        <div className="w-full sm:w-1/3 shrink-0 pt-2">
          <label className="block text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">Username / Link</label>
          <p className="text-[10px] font-mono text-white/30">Your portfolio link.</p>
        </div>
        <div className="w-full flex flex-col">
          <div 
            onClick={() => {
              if (isUsernameChangeBlocked) {
                showToast({
                  message: `Subdomain change is locked (${remainingDays} days remaining)`,
                  id: "username-locked",
                  icon: "fa-lock"
                });
              }
            }}
            className={`relative flex items-center text-xs font-mono text-white/50 pl-4 pr-[70px] py-3 rounded-none border transition-all overflow-hidden w-full ${
              isUsernameChangeBlocked ? 'border-white/10 bg-zinc-950 cursor-pointer' :
              subdomainStatus === 'taken' ? 'border-rose-500/40 bg-rose-950/20' :
              subdomainStatus === 'available' ? 'border-emerald-500/40 bg-emerald-950/20' :
              'border-white/10 bg-zinc-950 focus-within:border-[#ff9e00]/50'
            }`}
          >
             <span className="opacity-90 text-white/90 select-none shrink-0 whitespace-nowrap">portfo.be/</span>
             <input
               type="text"
               maxLength={15}
               value={subdomain} 
               onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
               placeholder={defaultUsername}
               readOnly={isUsernameChangeBlocked}
               onClick={(e) => {
                 if (isUsernameChangeBlocked) {
                   e.preventDefault();
                 }
               }}
               className={`bg-transparent outline-none text-white w-full p-0 border-none focus:ring-0 truncate font-mono ${
                 isUsernameChangeBlocked ? 'cursor-pointer select-none' : ''
               }`}
             />
             
             {/* Tombol Copy Link (Di dalam kolom input) */}
             <button 
                type="button" 
                onClick={(e) => copyLink(e)} 
                className="absolute right-10 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 rounded-none transition-colors" 
                title="Copy Link"
             >
                <Copy className="w-3.5 h-3.5" />
             </button>

             {/* Ikon Loading/Status */}
             <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                {subdomainStatus === 'checking' && <Loader2 className="w-3.5 h-3.5 text-white/30 animate-spin" />}
                {subdomainStatus === 'available' && !isUsernameChangeBlocked && <Check className="w-4 h-4 text-emerald-400" />}
                {subdomainStatus === 'taken' && !isUsernameChangeBlocked && <XCircle className="w-4 h-4 text-rose-400" />}
             </div>
          </div>
          {subdomainStatus === 'taken' && !isUsernameChangeBlocked && (
            <span className="text-[10px] font-mono font-bold text-rose-400 mt-2">This username is already taken by someone else.</span>
          )}
        </div>
      </div>

      {/* SECTION: PROFESSION & BIO */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 border-b border-white/5 pb-6 sm:pb-8">
        <div className="w-full sm:w-1/3 shrink-0">
          <label className="block text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">Profession & Bio</label>
          <p className="text-[10px] font-mono text-white/30">Tell us a bit about your expertise.</p>
        </div>
        <div className="w-full flex flex-col gap-4">
          <input 
            type="text" 
            maxLength={20} 
            value={profession} 
            onChange={(e) => setProfession(sanitizeText(e.target.value))} 
            placeholder="e.g. UI/UX Designer"
            className="w-full px-4 py-3 rounded-none border border-white/10 bg-zinc-950 focus:border-[#ff9e00]/50 outline-none transition-all text-xs font-mono text-white" 
          />
          <textarea 
            rows={4} 
            maxLength={250} 
            value={bio} 
            onChange={(e) => setBio(sanitizeText(e.target.value))} 
            placeholder="Write your short bio here..."
            className="w-full px-4 py-3 rounded-none border border-white/10 bg-zinc-950 focus:border-[#ff9e00]/50 outline-none transition-all text-xs font-mono leading-relaxed text-white resize-none" 
          />
        </div>
      </div>

      {/* SECTION: CONNECTED WORKS REDIRECT */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-white/5 pb-6 sm:pb-8 pt-2">
        <div className="w-full sm:w-1/3 shrink-0">
          <label className="block text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">Connected Works</label>
          <p className="text-[10px] font-mono text-white/30">Showcase works from other platforms.</p>
        </div>
        <div className="w-full">
          <Link
            href="/dashboard/integrations"
            className="flex items-center gap-3 px-5 py-4 rounded-none border border-white/10 bg-zinc-900/30 hover:bg-[#ff9e00]/10 hover:border-[#ff9e00]/30 transition-all group w-full sm:w-max"
          >
            <div className="w-8 h-8 rounded-none bg-zinc-950 border border-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
              <Plug className="w-4 h-4 text-[#ff9e00]" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-xs font-mono font-bold text-white group-hover:text-[#ff9e00] transition-colors leading-tight">Manage Connected Works</span>
              <span className="text-[10px] font-mono text-white/40">GitHub, Penpot, and others</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#ff9e00] group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
      
      {/* ACTION BUTTONS */}
      <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-3">
        <button type="button" onClick={() => window.location.reload()} className="w-full sm:w-auto px-6 py-2.5 rounded-none font-mono font-bold uppercase tracking-wider text-white/50 bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-colors text-xs">
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSaving || !isFormValid} 
          className={`relative px-8 py-2.5 rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 w-full sm:w-auto
            ${isSaving || !isFormValid 
              ? 'bg-zinc-900 text-white/20 border border-white/5 cursor-not-allowed' 
              : 'bg-[#ff9e00] text-black hover:bg-[#ffaa22] active:scale-95 border border-transparent'
            }`}
        >
          <div className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${isSaving ? 'opacity-0' : 'opacity-100'}`}>
            Save changes
          </div>
          {isSaving && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-black animate-spin" />
            </div>
          )}
        </button>
      </div>

    </form>
  );
}
