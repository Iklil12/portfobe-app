import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown, Plus } from 'lucide-react';

export function ProjectHeader({ state, actions }: { state: any; actions: any }) {
  const { handleOpenModal } = actions;
  const { userPlan, projectCount, certCount, isLoading } = state;
  
  const isProjectFull = userPlan === 'FREE' && projectCount >= 5;
  const isCertFull = userPlan === 'FREE' && certCount >= 2;
  const isQuotaFull = isProjectFull && isCertFull;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-10 gap-6 animate-enter">
      <div>
        <div className="flex items-center gap-3 mb-1.5">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold uppercase tracking-wider text-white flex items-center gap-2.5 sm:gap-3">
            Karya & Sertifikat
            <Sparkles className="w-5 h-5 text-white/30 animate-spin-slow" />
          </h1>
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading-badge"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-14 h-5 bg-white/5 border border-white/5 rounded-none animate-pulse shimmer"
              ></motion.div>
            ) : userPlan !== 'FREE' ? (
               <motion.span 
                key="pro-badge"
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                className="bg-[#ff9e00] text-black text-[9px] font-mono font-bold px-2.5 py-1 rounded-none tracking-widest uppercase flex items-center gap-1.5 shadow-sm"
               >
                  <Crown className="w-2.5 h-2.5" /> {userPlan}
               </motion.span>
            ) : (
               <motion.span 
                key="free-badge"
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                className="bg-zinc-900 text-white/50 text-[9px] font-mono font-bold px-2.5 py-1 rounded-none tracking-widest uppercase border border-white/10"
               >
                 FREE
               </motion.span>
            )}
          </AnimatePresence>
        </div>
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-4 max-w-md"
            >
              <div className="space-y-2">
                <div className="w-24 h-2 bg-white/5 rounded-none animate-pulse shimmer"></div>
                <div className="w-full h-1 bg-white/5 rounded-none animate-pulse shimmer"></div>
              </div>
              <div className="space-y-2">
                <div className="w-24 h-2 bg-white/5 rounded-none animate-pulse shimmer"></div>
                <div className="w-full h-1 bg-white/5 rounded-none animate-pulse shimmer"></div>
              </div>
            </motion.div>
          ) : userPlan === 'FREE' ? (
            <motion.div 
              key="free-stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-4 max-w-md"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-[0.1em]">Kapasitas Proyek</span>
                  <span className={`text-[10px] font-mono font-bold ${isProjectFull ? 'text-rose-500' : 'text-white'}`}>{projectCount}/5</span>
                </div>
                <div className="w-full h-1 bg-zinc-900 border border-white/10 rounded-none overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((projectCount / 5) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${isProjectFull ? 'bg-rose-500' : 'bg-[#ff9e00]'}`} 
                  ></motion.div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-[0.1em]">Kapasitas Sertifikat</span>
                  <span className={`text-[10px] font-mono font-bold ${isCertFull ? 'text-rose-500' : 'text-white'}`}>{certCount}/2</span>
                </div>
                <div className="w-full h-1 bg-zinc-900 border border-white/10 rounded-none overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((certCount / 2) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className={`h-full ${isCertFull ? 'bg-rose-500' : 'bg-[#ff9e00]'}`} 
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.p 
              key="pro-desc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-white/40 font-mono mt-2"
            >
              Kelola portofolio tanpa batas sebagai {userPlan === 'SUPREME' ? 'Supreme' : 'Pro'} Creator.
            </motion.p>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {!isLoading && userPlan === 'FREE' && (isProjectFull || isCertFull) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-rose-950/20 border border-rose-900/30 p-3 rounded-none mt-5 inline-flex items-center gap-2"
            >
              <Crown className="w-3.5 h-3.5 text-rose-400" /> 
              <p className="text-[9px] font-mono font-bold text-rose-400 uppercase tracking-wide leading-none">
                {isProjectFull && isCertFull 
                  ? "Semua limit tercapai. Upgrade PRO untuk akses tak terbatas."
                  : isProjectFull 
                    ? "Limit proyek tercapai. Upgrade PRO untuk menambah karya lagi."
                    : "Limit sertifikat tercapai. Upgrade PRO untuk menambah pencapaian."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full md:w-auto">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full md:w-40 h-12 bg-white/5 border border-white/5 rounded-none animate-pulse shimmer"
            ></motion.div>
          ) : isQuotaFull ? (
            <motion.div
              key="upgrade-btn"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Link 
                href="/pricing"
                className="w-full md:w-auto bg-zinc-900 text-white border border-white/10 px-7 py-4 rounded-none text-[10px] font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all duration-300 active:scale-95 group relative overflow-hidden"
              >
                <Crown className="w-3.5 h-3.5 text-[#ff9e00]" /> 
                Upgrade ke Pro
              </Link>
            </motion.div>
          ) : (
            <motion.button
              key="add-btn"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => handleOpenModal()}
              className="group w-full md:w-auto relative overflow-hidden flex items-center justify-center gap-2 rounded-none bg-[#ff9e00] hover:bg-[#ffaa22] transition-all duration-300 active:scale-95 hover:-translate-y-0.5 px-6 py-3.5 text-black font-mono font-bold uppercase tracking-widest text-[10px]"
            >
              <Plus className="w-3.5 h-3.5 text-black" />
              Tambah Data
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
