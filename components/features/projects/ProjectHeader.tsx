import Link from 'next/link';

export function ProjectHeader({ state, actions }: { state: any; actions: any }) {
  const { handleOpenModal } = actions;
  const { userPlan, projectCount, certCount } = state;
  
  const isProjectFull = userPlan === 'FREE' && projectCount >= 5;
  const isCertFull = userPlan === 'FREE' && certCount >= 2;
  const isQuotaFull = isProjectFull && isCertFull;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-10 gap-6 animate-enter">
      <div>
        <div className="flex items-center gap-3 mb-1.5">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-2.5 sm:gap-3">
            Karya & Sertifikat
            <i className="fas fa-asterisk text-slate-300 text-[1rem] md:text-[1.3rem] animate-spin-slow"></i>
          </h1>
          {userPlan === 'PRO' ? (
             <span className="bg-slate-900 text-white text-[9px] font-black px-2.5 py-1 rounded-md tracking-widest uppercase flex items-center gap-1.5 shadow-sm">
                <i className="fas fa-crown text-[8px] text-[#ff9e00]"></i> PRO
             </span>
          ) : (
             <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2.5 py-1 rounded-md tracking-widest uppercase">FREE</span>
          )}
        </div>
        
        {userPlan === 'FREE' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-4 max-w-md">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">Kapasitas Proyek</span>
                <span className={`text-[10px] font-black ${isProjectFull ? 'text-rose-500' : 'text-slate-900'}`}>{projectCount}/5</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                <div 
                  className={`h-full transition-all duration-1000 ${isProjectFull ? 'bg-rose-500' : 'bg-slate-900'}`} 
                  style={{ width: `${Math.min((projectCount / 5) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">Kapasitas Sertifikat</span>
                <span className={`text-[10px] font-black ${isCertFull ? 'text-rose-500' : 'text-slate-900'}`}>{certCount}/2</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                <div 
                  className={`h-full transition-all duration-1000 ${isCertFull ? 'bg-rose-500' : 'bg-slate-900'}`} 
                  style={{ width: `${Math.min((certCount / 2) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2">Kelola portofolio tanpa batas sebagai Pro Creator.</p>
        )}
        {userPlan === 'FREE' && (isProjectFull || isCertFull) && (
          <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl mt-5 inline-flex items-center gap-2 animate-pulse">
            <i className="fas fa-crown text-[10px] text-rose-500"></i> 
            <p className="text-[9px] font-bold text-rose-600 leading-none">
              {isProjectFull && isCertFull 
                ? "Semua limit tercapai. Upgrade PRO untuk akses tak terbatas."
                : isProjectFull 
                  ? "Limit proyek tercapai. Upgrade PRO untuk menambah karya lagi."
                  : "Limit sertifikat tercapai. Upgrade PRO untuk menambah pencapaian."}
            </p>
          </div>
        )}
      </div>

      {isQuotaFull ? (
        <Link 
          href="/pricing"
          className="w-full md:w-auto bg-[#0a0a0a] text-white px-7 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:bg-slate-800 transition-all duration-300 active:scale-95 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <i className="fas fa-crown text-[#ff9e00]"></i> 
          Upgrade ke Pro
        </Link>
      ) : (
        <button 
          onClick={() => handleOpenModal()} 
          className="w-full md:w-auto bg-slate-900 text-white px-7 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-md hover:bg-slate-800 hover:shadow-lg transition-all duration-300 active:scale-95"
        >
          <i className="fas fa-plus text-[10px]"></i> Tambah Data
        </button>
      )}
    </div>
  );
}
