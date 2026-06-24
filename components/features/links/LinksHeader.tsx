import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Crown, Sparkles, Check, Plus, Loader2 } from 'lucide-react';

interface LinksHeaderProps {
  state: {
    hasChanges: boolean;
    isSaving: boolean;
    isAdding: boolean;
    isLoading: boolean;
    userPlan: string;
    linkCount: number;
  };
  actions: {
    addLink: () => void;
    saveAllChanges: () => void;
  };
}

export function LinksHeader({ state, actions }: LinksHeaderProps) {
  const { hasChanges, isSaving, isAdding, isLoading, userPlan, linkCount } = state;
  const { addLink, saveAllChanges } = actions;

  const isFull = userPlan === 'FREE' && linkCount >= 1;

  return (
    <div className="mb-10 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-enter" style={{animationDelay: '100ms'}}>
      <div className="text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-3 mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-zinc-900 border border-white/10 text-[9px] font-mono font-bold uppercase tracking-wider text-white/50 shadow-sm">
            <Link2 className="w-3.5 h-3.5 text-white/40" /> Public Integration
          </div>
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="skeleton-badge"
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

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold uppercase tracking-wider text-white mb-2 flex items-center justify-center md:justify-start gap-3">
          Social Links
          <Sparkles className="w-5 h-5 text-white/30 animate-spin-slow" />
        </h1>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading-meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center md:justify-start gap-3 mt-4"
            >
              <div className="w-32 h-1.5 bg-white/5 rounded-none animate-pulse shimmer"></div>
              <div className="w-20 h-1.5 bg-white/5 rounded-none animate-pulse shimmer"></div>
            </motion.div>
          ) : userPlan === 'FREE' ? (
             <motion.div 
              key="free-quota"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center md:justify-start gap-3 mt-4"
             >
                <div className="w-32 h-1 bg-white/10 rounded-none overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((linkCount / 1) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${isFull ? 'bg-rose-500' : 'bg-[#ff9e00]'}`} 
                  ></motion.div>
                </div>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-[9px] font-mono font-bold uppercase tracking-wider ${isFull ? 'text-rose-500' : 'text-white/40'}`}
                >
                  {linkCount}/1 Links Used
                </motion.span>
             </motion.div>
          ) : (
            <motion.p 
              key="pro-status"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-mono text-white/50 max-w-lg mt-2"
            >
              Manage unlimited link directory as a {userPlan === 'SUPREME' ? 'Supreme' : 'Pro'} Creator.
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isLoading && isFull && (
            <motion.p 
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-[9px] font-mono font-bold text-rose-400 uppercase tracking-wider mt-3 flex items-center justify-center md:justify-start gap-1.5"
            >
              <Crown className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> Limit reached. Upgrade to PRO to add more links.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <AnimatePresence>
          {hasChanges && (
            <motion.button 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={saveAllChanges} 
              disabled={isSaving} 
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-black hover:bg-zinc-200 rounded-none text-[10px] font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Save
            </motion.button>
          )}
        </AnimatePresence>
        
        {isLoading ? (
          <div className="w-full sm:w-32 h-11 bg-white/5 border border-white/5 rounded-none animate-pulse shimmer"></div>
        ) : isFull ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Link 
              href="/pricing"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#ff9e00] hover:bg-[#ffaa22] text-black rounded-none text-[10px] font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Crown className="w-3.5 h-3.5" /> 
              Upgrade PRO
            </Link>
          </motion.div>
        ) : (
          <motion.button 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={addLink} 
            disabled={isAdding} 
            className="w-full sm:w-auto px-6 py-3.5 bg-[#ff9e00] hover:bg-[#ffaa22] text-black rounded-none text-[10px] font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-50"
          >
            {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />} 
            {isAdding ? 'Creating...' : 'Add New'}
          </motion.button>
        )}
      </div>
    </div>
  );
}
