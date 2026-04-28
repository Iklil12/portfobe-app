import React from 'react';

interface ProfileFormProps {
  state: any;
  actions: any;
}

export function ProfileForm({ state, actions }: ProfileFormProps) {
  const { firstName, lastName, profession, bio, isSaving, isFormValid } = state;
  const { setFirstName, setLastName, setProfession, setBio, handleSave } = actions;

  return (
    <form className="space-y-5 sm:space-y-6" onSubmit={handleSave}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 animate-enter" style={{animationDelay: '300ms'}}>
        <div className="group">
          <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-slate-900 transition-colors">Nama Depan <span className="text-rose-500">*</span></label>
          <input type="text" maxLength={10} value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-[4px] focus:ring-slate-900/5 outline-none transition-all text-sm font-bold text-slate-900" />
        </div>
        <div className="group">
          <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-slate-900 transition-colors">Nama Belakang</label>
          <input type="text" maxLength={10} value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-[4px] focus:ring-slate-900/5 outline-none transition-all text-sm font-bold text-slate-900" />
        </div>
      </div>
      
      <div className="group animate-enter" style={{animationDelay: '400ms'}}>
        <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-slate-900 transition-colors flex justify-between items-end">
          <span>Profesi Utama <span className="text-rose-500">*</span></span>
          {!profession && <span className="text-[9px] text-slate-400 normal-case font-medium">Ditampilkan di bawah namamu</span>}
        </label>
        <input type="text" maxLength={20} value={profession} onChange={(e) => setProfession(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-[4px] focus:ring-slate-900/5 outline-none transition-all text-sm font-bold text-slate-900" />
      </div>
      
      <div className="group animate-enter" style={{animationDelay: '500ms'}}>
        <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-slate-900 transition-colors">Bio Ringkas</label>
        <textarea rows={5} maxLength={250} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-[4px] focus:ring-slate-900/5 outline-none transition-all text-sm font-medium leading-relaxed text-slate-900 resize-none" />
      </div>
      
      <div className="pt-8 mt-10 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3 animate-enter" style={{animationDelay: '600ms'}}>
        <button type="button" onClick={() => window.location.reload()} className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-full font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-[13px]">Batalkan</button>
        <button 
          type="submit" 
          disabled={isSaving || !isFormValid} 
          className={`relative px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-full text-[12px] sm:text-[13px] font-extrabold uppercase tracking-widest overflow-hidden transition-all duration-300 transform w-full sm:w-auto shadow-md
            ${isSaving || !isFormValid 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-transparent' 
              : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg active:scale-95 border border-slate-900'
            }`}
        >
          <div className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${isSaving ? 'opacity-0' : 'opacity-100'}`}>Simpan Perubahan <i className="fas fa-check ml-1 text-[10px]"></i></div>
          {isSaving && <div className="absolute inset-0 flex items-center justify-center"><div className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div></div>}
        </button>
      </div>
    </form>
  );
}
