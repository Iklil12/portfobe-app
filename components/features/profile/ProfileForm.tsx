import React from 'react';
import { signIn } from 'next-auth/react';
import { showToast } from '@/lib/customToast';

interface ProfileFormProps {
  state: any;
  actions: any;
}

export function ProfileForm({ state, actions }: ProfileFormProps) {
  const { firstName, lastName, profession, bio, isSaving, isFormValid, subdomain, subdomainStatus, session, githubUsername } = state;
  const { setFirstName, setLastName, setProfession, setBio, handleSave, setSubdomain, handleDisconnectGithub } = actions;
  
  const email = session?.user?.email || "user@example.com";
  const defaultUsername = session?.user?.email?.split('@')[0] || "user";

  // Deteksi login Google: Berdasarkan image provider Google atau ekstensi @gmail.com
  const isGoogleUser = session?.user?.provider === 'google' || session?.user?.image?.includes('googleusercontent.com') || session?.user?.email?.endsWith('@gmail.com');

  const copyLink = () => {
    navigator.clipboard.writeText(`portfo.be/${subdomain}`);
    showToast({ message: "Tautan berhasil disalin!", id: "copy-link", icon: "fa-link" });
  };

  return (
    <form className="space-y-6 sm:space-y-8 animate-enter" style={{animationDelay: '300ms'}} onSubmit={handleSave}>
      
      {/* SECTION: NAME */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-8 pt-4">
        <div className="w-full sm:w-1/3 shrink-0">
          <label className="block text-sm font-extrabold text-slate-900 mb-1">Nama Lengkap</label>
          <p className="text-[11px] font-medium text-slate-500">Nama yang akan tampil publik.</p>
        </div>
        <div className="w-full flex gap-3">
          <input 
            type="text" 
            maxLength={10} 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            placeholder="Sienna"
            className="w-1/2 px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-orange-500 focus:ring-[3px] focus:ring-orange-500/10 outline-none transition-all text-[13px] font-bold text-slate-900" 
          />
          <input 
            type="text" 
            maxLength={10} 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            placeholder="Hewitt"
            className="w-1/2 px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-orange-500 focus:ring-[3px] focus:ring-orange-500/10 outline-none transition-all text-[13px] font-bold text-slate-900" 
          />
        </div>
      </div>

      {/* SECTION: EMAIL ADDRESS */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-8">
        <div className="w-full sm:w-1/3 shrink-0">
          <label className="block text-sm font-extrabold text-slate-900 mb-1">Email Address</label>
          <p className="text-[11px] font-medium text-slate-500">Email untuk login dan kontak.</p>
        </div>
        <div className="w-full">
          <div className="relative flex items-center">
            <i className="far fa-envelope absolute left-4 text-slate-400"></i>
            <input 
              type="email" 
              value={email} 
              disabled
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/80 bg-slate-100/50 text-slate-500 outline-none text-[13px] font-medium cursor-not-allowed opacity-80" 
            />
          </div>
          {/* Tag "Terverifikasi oleh Google" HANYA MUNCUL jika login menggunakan Google */}
          {isGoogleUser && (
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-2 flex items-center gap-1.5">
              <i className="fas fa-check-circle"></i> Terverifikasi oleh Google
            </p>
          )}
        </div>
      </div>

      {/* SECTION: USERNAME / SUBDOMAIN */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-8">
        <div className="w-full sm:w-1/3 shrink-0 pt-2">
          <label className="block text-sm font-extrabold text-slate-900 mb-1">Username / Link</label>
          <p className="text-[11px] font-medium text-slate-500">Tautan portofolio Anda.</p>
        </div>
        <div className="w-full flex flex-col">
          <div className={`relative flex items-center text-[13px] font-bold text-slate-600 pl-4 pr-[70px] py-3 rounded-xl border transition-all overflow-hidden w-full ${
            subdomainStatus === 'taken' ? 'border-rose-400 bg-rose-50 ring-[3px] ring-rose-400/20' :
            subdomainStatus === 'available' ? 'border-emerald-400 bg-emerald-50 ring-[3px] ring-emerald-400/20' :
            'border-slate-200/80 bg-slate-50/50 focus-within:bg-white focus-within:border-orange-500 focus-within:ring-[3px] focus-within:ring-orange-500/10'
          }`}>
             <span className="opacity-50 select-none shrink-0 whitespace-nowrap">portfo.be/</span>
             <input
               type="text"
               maxLength={15}
               value={subdomain} 
               onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
               placeholder={defaultUsername}
               className="bg-transparent outline-none text-slate-900 w-full p-0 border-none focus:ring-0 truncate"
             />
             
             {/* Tombol Copy Link (Di dalam kolom input) */}
             <button 
                type="button" 
                onClick={copyLink} 
                className="absolute right-10 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors" 
                title="Salin Tautan"
             >
                <i className="far fa-copy text-[13px]"></i>
             </button>

             {/* Ikon Loading/Status */}
             <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
               {subdomainStatus === 'checking' && <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-orange-500 rounded-full animate-spin"></div>}
               {subdomainStatus === 'available' && <i className="fas fa-check-circle text-emerald-500 text-sm"></i>}
               {subdomainStatus === 'taken' && <i className="fas fa-times-circle text-rose-500 text-sm"></i>}
             </div>
          </div>
          {subdomainStatus === 'taken' && (
            <span className="text-[10px] font-bold text-rose-500 mt-2">Username ini sudah digunakan orang lain.</span>
          )}
        </div>
      </div>

      {/* SECTION: PROFESSION & BIO */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-8">
        <div className="w-full sm:w-1/3 shrink-0">
          <label className="block text-sm font-extrabold text-slate-900 mb-1">Profesi & Bio</label>
          <p className="text-[11px] font-medium text-slate-500">Ceritakan sedikit tentang keahlian Anda.</p>
        </div>
        <div className="w-full flex flex-col gap-4">
          <input 
            type="text" 
            maxLength={20} 
            value={profession} 
            onChange={(e) => setProfession(e.target.value)} 
            placeholder="Contoh: UI/UX Designer"
            className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-orange-500 focus:ring-[3px] focus:ring-orange-500/10 outline-none transition-all text-[13px] font-bold text-slate-900" 
          />
          <textarea 
            rows={4} 
            maxLength={250} 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            placeholder="Tuliskan bio singkat Anda di sini..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-orange-500 focus:ring-[3px] focus:ring-orange-500/10 outline-none transition-all text-[13px] font-medium leading-relaxed text-slate-900 resize-none" 
          />
        </div>
      </div>

      {/* SECTION: INTEGRATIONS */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-8 pt-2">
        <div className="w-full sm:w-1/3 shrink-0 pt-2">
          <label className="block text-sm font-extrabold text-slate-900 mb-1">Integrations</label>
          <p className="text-[11px] font-medium text-slate-500">Hubungkan profil Anda.</p>
        </div>
        <div className="w-full">
          <div className="flex flex-col gap-3">
            {githubUsername ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3 rounded-xl border border-emerald-200 bg-emerald-50 w-full sm:w-max shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-3 flex-1">
                  <i className="fab fa-github text-xl text-emerald-700"></i>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-emerald-800 leading-tight">Connected</span>
                    <span className="text-[11px] font-medium text-emerald-600">@{githubUsername}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:ml-8">
                  {state.isConfirmingDisconnect ? (
                    <>
                      <button 
                        type="button" 
                        onClick={() => actions.setIsConfirmingDisconnect(false)}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="button" 
                        onClick={handleDisconnectGithub}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm animate-pulse"
                      >
                        Yes, Disconnect
                      </button>
                    </>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => actions.setIsConfirmingDisconnect(true)}
                      className="w-full sm:w-auto px-3 py-1.5 rounded-lg text-[11px] font-bold text-rose-600 bg-rose-100 hover:bg-rose-200 transition-colors"
                    >
                      Disconnect
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button 
                type="button" 
                onClick={() => signIn('github', { callbackUrl: '/dashboard/profile' })}
                className="flex items-center justify-center sm:justify-start gap-3 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all group w-full sm:w-auto shadow-sm"
              >
                <i className="fab fa-github text-lg text-slate-700 group-hover:text-black transition-colors"></i>
                <span className="text-[13px] font-bold text-slate-700 group-hover:text-black transition-colors">Integrate with GitHub</span>
              </button>
            )}

            {/* PENPOT INTEGRATION (COMING SOON) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3 rounded-xl border border-slate-100 bg-slate-50/50 w-full sm:w-max opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="flex items-center gap-3 flex-1 sm:pr-8">
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-slate-700">
                    <path d="M22 0L44 11V33L22 44L0 33V11L22 0Z" fill="currentColor" fillOpacity="0.1" />
                    <path d="M22 4.5L37.5 12.25V31.75L22 39.5L6.5 31.75V12.25L22 4.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 39.5V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M37.5 12.25L22 22L6.5 12.25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 12V6M22 15V4M30 12V6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-700 leading-tight">Penpot</span>
                  <span className="text-[11px] font-medium text-slate-400">Coming soon</span>
                </div>
              </div>
              
              <button 
                type="button" 
                onClick={() => showToast({ message: "Integrasi Penpot akan segera hadir!", id: "penpot-soon", icon: "fa-palette", type: "info" })}
                className="w-full sm:w-auto px-4 py-1.5 rounded-lg text-[11px] font-black text-slate-400 bg-white border border-slate-200 cursor-not-allowed"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* ACTION BUTTONS */}
      <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-3">
        <button type="button" onClick={() => window.location.reload()} className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-[13px]">
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSaving || !isFormValid} 
          className={`relative px-8 py-2.5 rounded-xl text-[13px] font-extrabold transition-all duration-300 transform w-full sm:w-auto shadow-sm
            ${isSaving || !isFormValid 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent' 
              : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg active:scale-95 border border-slate-900'
            }`}
        >
          <div className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${isSaving ? 'opacity-0' : 'opacity-100'}`}>
            Save changes
          </div>
          {isSaving && <div className="absolute inset-0 flex items-center justify-center"><div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div></div>}
        </button>
      </div>
    </form>
  );
}
