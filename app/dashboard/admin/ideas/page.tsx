"use client";

import React, { useEffect, useState } from 'react';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

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
      <div className="flex h-full w-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
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
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
      {/* Header */}
      <div className="px-6 md:px-8 pt-6 md:pt-8 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-violet-200">
            <i className="fas fa-lock mr-1"></i> Admin Only
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Feature Backlog</h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base">Daftar ide dan fitur yang akan dikembangkan selanjutnya.</p>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 pb-24">
        <div className="max-w-3xl mx-auto">
          
          <form onSubmit={handleAddIdea} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-8 flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              placeholder="Ketik ide brilian Anda di sini..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 font-medium px-2 outline-none w-full"
              disabled={isSubmitting}
            />
            <button 
              type="submit" 
              disabled={isSubmitting || !newIdea.trim()}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 disabled:opacity-50 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors shrink-0"
            >
              {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : "Simpan Ide"}
            </button>
          </form>

          {(!notes && !error) ? (
            <div className="flex justify-center p-12">
               <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
          ) : !Array.isArray(notes) || notes.length === 0 ? (
            <div className="mt-4 p-16 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center bg-white shadow-sm">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 border border-amber-100 shadow-sm">
                <i className="fas fa-lightbulb text-3xl text-amber-500"></i>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Belum Ada Catatan Ide</h3>
              <p className="text-slate-500 text-center max-w-sm leading-relaxed">
                Catat semua ide brilian Anda di sini agar tidak terlupa.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
              {notes?.map(note => (
                <div key={note.id} className={`p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors group ${note.isCompleted ? 'opacity-60 bg-slate-50/50' : ''}`}>
                  <button 
                    onClick={() => toggleComplete(note.id, note.isCompleted)}
                    className={`mt-1 w-6 h-6 rounded-md flex items-center justify-center shrink-0 border transition-all ${note.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-amber-400 text-transparent hover:text-amber-400 bg-white'}`}
                  >
                    <i className="fas fa-check text-xs"></i>
                  </button>
                  <div className="flex-1 min-w-0">
                    {editingId === note.id ? (
                      <div className="flex items-start gap-2 mt-1 mb-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full text-sm font-medium text-slate-800 bg-white border border-amber-300 focus:ring-2 focus:ring-amber-500 rounded-lg px-3 py-2 outline-none resize-none"
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
                          <button onClick={() => saveEdit(note.id)} className="w-8 h-8 rounded bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors" title="Simpan (Enter)">
                            <i className="fas fa-check text-xs"></i>
                          </button>
                          <button onClick={() => setEditingId(null)} className="w-8 h-8 rounded bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors" title="Batal (Esc)">
                            <i className="fas fa-times text-xs"></i>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className={`text-slate-800 font-medium ${note.isCompleted ? 'line-through text-slate-500' : ''}`}>
                          {note.content}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
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
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                        title="Edit Catatan"
                      >
                        <i className="fas fa-pen text-xs"></i>
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNote(note.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Hapus"
                    >
                      <i className="fas fa-trash-alt text-sm"></i>
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
