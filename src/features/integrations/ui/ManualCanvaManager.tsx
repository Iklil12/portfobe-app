"use client";

import React, { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PenTool, 
  Trash2, 
  Plus, 
  X, 
  Check, 
  Loader2 
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function ManualCanvaManager() {
  const { data, mutate } = useSWR('/api/canva/projects', fetcher);
  const [projects, setProjects] = useState<{ title: string; embedLink: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (data?.projects && !hasInitialized.current) {
      setProjects(data.projects);
      hasInitialized.current = true;
    }
  }, [data?.projects]);

  const persistData = async (updatedProjects: { title: string; embedLink: string }[]) => {
    setIsSaving(true);
    const toastId = toast.loading('Saving Canva design...');
    try {
      const res = await fetch('/api/canva/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: updatedProjects, isBulk: true }),
      });
      if (res.ok) {
        await mutate();
        toast.success('Autosaved!', { id: toastId });
      } else {
        toast.error('Failed to autosave.', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (projects.length >= 10) {
      toast.error('Maximum 10 designs allowed.');
      return;
    }
    const newIndex = projects.length;
    setProjects(prev => [...prev, { title: '', embedLink: '' }]);
    setEditingIndex(newIndex);
    toast.success('New row added.');
  };

  const handleRemove = async (index: number, e?: React.MouseEvent) => {
    e?.preventDefault();
    const updated = [...projects];
    updated.splice(index, 1);
    setProjects(updated);
    setDeleteConfirm(null);
    if (editingIndex === index) setEditingIndex(null);
    
    await persistData(updated);
  };

  const handleChange = (index: number, field: 'title' | 'embedLink', value: string) => {
    setProjects(prev => {
      const updated = [...prev];
      (updated[index] as any)[field] = value;
      return updated;
    });
  };

  const handleDone = async () => {
    setEditingIndex(null);
    await persistData(projects);
  };

  return (
    <div className="bg-zinc-950 p-6 md:p-8 border border-white/10 rounded-md space-y-8 relative z-40">
      
      <div className="space-y-4">
        {projects.map((p, idx) => (
          <div key={idx} className="relative group">
            <AnimatePresence mode="wait">
              {editingIndex === idx ? (
                <motion.div 
                  key="edit"
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 5 }}
                  className="flex flex-col gap-4 p-6 rounded-md border border-white/10 bg-[#0a0a0a] relative z-50 animate-enter"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-sans font-medium text-white/40 uppercase tracking-wider mb-2 block">Project Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Social Media Kit" 
                        className="w-full bg-[#050505] border border-white/10 rounded-md px-4 py-3 text-xs font-sans font-medium text-white outline-none focus:border-[#ff9e00]/40 transition-colors"
                        value={p.title}
                        onChange={(e) => handleChange(idx, 'title', e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-sans font-medium text-white/40 uppercase tracking-wider mb-2 block">Embed Link</label>
                      <input 
                        type="text" 
                        placeholder="<iframe ... atau https://..." 
                        className="w-full bg-[#050505] border border-white/10 rounded-md px-4 py-3 text-[10px] font-sans font-medium text-white/70 outline-none focus:border-[#ff9e00]/40 transition-colors"
                        value={p.embedLink}
                        onChange={(e) => handleChange(idx, 'embedLink', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end items-center gap-4 pt-2 border-t border-white/5">
                     <button type="button" onClick={() => setEditingIndex(null)} className="text-[10px] font-sans font-medium text-white/45 hover:text-white uppercase tracking-wider">Cancel</button>
                     <button type="button" onClick={handleDone} disabled={isSaving} className="px-5 py-2.5 rounded-md bg-[#ff9e00] hover:bg-[#ffaa22] text-black text-[10px] font-sans font-medium uppercase tracking-widest flex items-center gap-1.5 active:scale-95 transition-all">
                       {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                       Save & Done
                     </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setActiveMenu(activeMenu === idx ? null : idx)}
                  className="flex items-center justify-between p-4 sm:p-5 rounded-md border border-white/5 bg-[#0a0a0a]/50 hover:bg-[#0a0a0a] hover:border-white/10 transition-all duration-300 group cursor-pointer sm:cursor-default"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 pr-2">
                    <div className="w-10 h-10 shrink-0 rounded-md bg-zinc-950 border border-white/10 flex items-center justify-center text-white/50 text-xs font-sans font-medium">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans font-medium text-white tracking-wide truncate">{p.title || 'Untitled Design'}</p>
                      <p className="text-[9px] font-sans text-white/30 truncate mt-1">{p.embedLink}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 transition-all ${activeMenu === idx ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0'}`}>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setEditingIndex(idx); }} className="w-8.5 h-8.5 shrink-0 rounded-md bg-zinc-950 border border-white/10 text-white/40 hover:text-white flex items-center justify-center transition-colors">
                      <PenTool className="w-3.5 h-3.5" />
                    </button>
                    {deleteConfirm === idx ? (
                      <div className="flex items-center gap-1.5">
                         <button type="button" onClick={(e) => { e.stopPropagation(); handleRemove(idx, e); }} className="px-3 py-1.5 rounded-md bg-rose-600 text-white text-[9px] font-sans font-medium uppercase tracking-widest hover:bg-rose-700 transition-colors">Yes, Delete</button>
                         <button type="button" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }} className="p-1.5 text-white/40 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <button type="button" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(idx); }} className="w-8.5 h-8.5 shrink-0 rounded-md bg-zinc-950 border border-white/10 text-white/40 hover:text-rose-400 hover:border-rose-900/30 flex items-center justify-center transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
        <button type="button" onClick={handleAdd} className="w-full py-3.5 px-6 rounded-md bg-zinc-900 border border-white/10 text-white text-[10px] font-sans font-medium uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-colors flex items-center justify-center gap-2 shadow-none active:scale-95">
          <Plus className="w-4 h-4 text-white/40" /> Add New Canva Project
        </button>
      </div>
    </div>
  );
}
