//app/dashboard/admin/ideas/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Lock, Loader2, Lightbulb, Check, X, Edit2, Trash2 } from 'lucide-react';

interface AdminNote {
  id: string;
  type: string;
  content: string;
  isCompleted: boolean;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function IdeasPage() {
  const { userRole, isLoading: isLayoutLoading } = useDashboardLayout();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const { data: notes, error, mutate } = useSWR<AdminNote[]>('/api/admin/notes?type=IDEA', fetcher);
  const [newIdea, setNewIdea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (isLayoutLoading) return;
    if (userRole !== 'ADMIN') {
      setIsAuthorized(false);
      router.push('/dashboard');
    } else {
      setIsAuthorized(true);
    }
  }, [userRole, isLayoutLoading, router]);

  if (isAuthorized === null || !isAuthorized) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-950">
        <Loader2 className="w-8 h-8 text-[#ff9e00] animate-spin" />
      </div>
    );
  }

  const handleAddIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newIdea, type: 'IDEA' }),
      });
      setNewIdea("");
      mutate(); // Refresh data
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleComplete = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    mutate(notes?.map(n => n.id === id ? { ...n, isCompleted: !currentStatus } : n), false);
    
    await fetch(`/api/admin/notes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: !currentStatus }),
    });
    mutate();
  };

  const saveEdit = async (id: string) => {
    if (!editContent.trim()) return;
    
    // Optimistic update
    mutate(notes?.map(n => n.id === id ? { ...n, content: editContent } : n), false);
    
    await fetch(`/api/admin/notes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editContent }),
    });
    setEditingId(null);
    mutate();
  };

  const deleteNote = async (id: string) => {
    if (!confirm('Hapus catatan ini?')) return;
    
    // Optimistic update
    mutate(notes?.filter(n => n.id !== id), false);
    
    await fetch(`/api/admin/notes/${id}`, { method: 'DELETE' });
    mutate();
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-zinc-950 font-mono">
      {/* Header */}
      <div className="px-6 md:px-8 pt-6 md:pt-8 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-zinc-900 border border-white/10 text-white/50 text-[9px] font-mono font-bold px-2.5 py-1 rounded-none uppercase tracking-widest flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#ff9e00]" />
            <span>Admin Only</span>
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">Feature Backlog</h1>
        <p className="text-white/40 mt-1 text-xs">Daftar ide dan fitur yang akan dikembangkan selanjutnya.</p>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 pb-24">
        <div className="max-w-3xl mx-auto">
          
          <form onSubmit={handleAddIdea} className="bg-zinc-900/40 rounded-none border border-white/10 p-4 mb-8 flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              placeholder="Ketik ide brilian Anda di sini..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 font-mono text-xs px-2 outline-none w-full"
              disabled={isSubmitting}
            />
            <button 
              type="submit" 
              disabled={isSubmitting || !newIdea.trim()}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#ff9e00] disabled:opacity-50 hover:bg-[#ffaa22] text-black text-xs font-bold rounded-none transition-colors shrink-0 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Simpan Ide"}
            </button>
          </form>

          {(!notes && !error) ? (
            <div className="flex justify-center p-12">
               <Loader2 className="w-8 h-8 text-[#ff9e00] animate-spin" />
            </div>
          ) : !Array.isArray(notes) || notes.length === 0 ? (
            <div className="mt-4 p-16 border border-dashed border-white/10 rounded-none flex flex-col items-center justify-center bg-zinc-900/10 shadow-none">
              <div className="w-20 h-20 bg-zinc-950 rounded-none flex items-center justify-center mb-6 border border-white/5 shadow-none text-[#ff9e00]">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h3 className="text-xs font-mono font-bold text-white uppercase mb-2">Belum Ada Catatan Ide</h3>
              <p className="text-white/40 text-xs text-center max-w-sm leading-relaxed">
                Catat semua ide brilian Anda di sini agar tidak terlupa.
              </p>
            </div>
          ) : (
            <div className="bg-zinc-900/40 rounded-none border border-white/10 shadow-none overflow-hidden divide-y divide-white/5">
              {notes?.map(note => (
                <div key={note.id} className={`p-4 flex items-start gap-4 hover:bg-zinc-950/20 transition-colors group ${note.isCompleted ? 'opacity-60 bg-zinc-950/20' : ''}`}>
                  <button 
                    onClick={() => toggleComplete(note.id, note.isCompleted)}
                    className={`mt-1 w-6 h-6 rounded-none flex items-center justify-center shrink-0 border transition-all ${
                      note.isCompleted 
                        ? 'bg-emerald-500 border-emerald-500 text-black' 
                        : 'border-white/10 hover:border-[#ff9e00] text-transparent hover:text-[#ff9e00] bg-zinc-950'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1 min-w-0">
                    {editingId === note.id ? (
                      <div className="flex items-start gap-2 mt-1 mb-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full text-xs font-mono font-bold text-white bg-zinc-950 border border-[#ff9e00]/50 focus:ring-1 focus:ring-[#ff9e00]/50 rounded-none px-3 py-2 outline-none resize-none"
                          rows={2}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              saveEdit(note.id);
                            } else if (e.key === 'Escape') {
                              setEditingId(null);
                            }
                          }}
                        />
                        <div className="flex flex-col gap-1 shrink-0">
                          <button onClick={() => saveEdit(note.id)} className="w-8 h-8 rounded-none bg-[#ff9e00] text-black flex items-center justify-center hover:bg-[#ffaa22] transition-colors" title="Simpan (Enter)">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="w-8 h-8 rounded-none bg-zinc-900 border border-white/10 text-white/50 flex items-center justify-center hover:bg-zinc-800 transition-colors" title="Batal (Esc)">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className={`text-white font-mono text-xs ${note.isCompleted ? 'line-through text-white/30' : ''}`}>
                          {note.content}
                        </p>
                        <p className="text-[9px] font-mono font-bold text-white/30 mt-1.5 uppercase tracking-widest">
                          {new Date(note.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all shrink-0">
                    {!note.isCompleted && (
                      <button 
                        onClick={() => {
                          setEditingId(note.id);
                          setEditContent(note.content);
                        }}
                        className="w-8 h-8 rounded-none flex items-center justify-center text-white/30 hover:text-[#ff9e00] hover:bg-zinc-950 transition-colors"
                        title="Edit Catatan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNote(note.id)}
                      className="w-8 h-8 rounded-none flex items-center justify-center text-white/30 hover:text-rose-500 hover:bg-zinc-950 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
