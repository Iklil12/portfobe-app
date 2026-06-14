"use client";

import React, { useState, useEffect } from 'react';
import { X, Plus, GripVertical, Image as ImageIcon, Search, Minus, Video } from 'lucide-react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy, 
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getVideoThumbnail } from '@/lib/videoUtils';
interface Project {
  id: string;
  title: string;
  mediaUrl?: string | null;
  thumbnailUrl?: string | null;
  projectType: string;
}

function ProjectThumbnail({ project }: { project: Project }) {
  const [hasError, setHasError] = useState(false);
  
  let finalUrl = project.thumbnailUrl || project.mediaUrl;
  
  if (!finalUrl) {
    return project.projectType === 'video' ? <Video className="w-5 h-5 text-white/20" /> : <ImageIcon className="w-5 h-5 text-white/20" />;
  }

  // Gunakan utility bawaan sistem untuk mengurai URL YouTube, Vimeo, dan GUID BunnyCDN
  if (project.projectType === 'video') {
    finalUrl = project.thumbnailUrl || getVideoThumbnail(project.mediaUrl || '');
  }

  return (
    <div className="relative w-full h-full bg-zinc-900 flex items-center justify-center">
      {hasError ? (
        project.projectType === 'video' ? <Video className="w-5 h-5 text-white/20" /> : <ImageIcon className="w-5 h-5 text-white/20" />
      ) : (
        <img 
          src={finalUrl} 
          alt={project.title} 
          className="w-full h-full object-cover" 
          loading="lazy" 
          decoding="async"
          onError={() => setHasError(true)}
        />
      )}
      
      {project.projectType === 'video' && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="w-6 h-6 bg-black/80 rounded-full flex items-center justify-center border border-white/20 shadow-lg">
            <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-white ml-0.5" />
          </div>
        </div>
      )}
    </div>
  );
}

interface ProjectSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  allProjects: Project[];
  selectedProjects: string[]; // Array of project IDs
  onSaveSelection: (newSelectedIds: string[]) => void;
}

function SortableProjectItem({ 
  project, 
  onRemove 
}: { 
  project: Project, 
  onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={`group flex items-center gap-3 p-3 rounded-none border border-white/10 bg-zinc-900 shadow-sm transition-colors duration-200 ${isDragging ? 'opacity-90 scale-[1.02] shadow-2xl border-[#ff9e00]' : 'hover:border-white/20'}`}>
      <button {...attributes} {...listeners} className="w-6 h-6 flex items-center justify-center rounded-none hover:bg-white/10 transition-colors cursor-grab active:cursor-grabbing text-white/50 hover:text-white">
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="w-14 h-14 bg-zinc-950 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden">
        <ProjectThumbnail project={project} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-mono font-bold truncate text-white">{project.title}</h4>
        <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest mt-1">{project.projectType}</p>
      </div>
      <button onClick={() => onRemove(project.id)} className="w-6 h-6 rounded-none bg-zinc-950 hover:bg-red-950/50 border border-white/10 hover:border-red-500/50 hover:text-red-400 text-white/40 flex items-center justify-center transition-all">
        <Minus className="w-4 h-4" />
      </button>
    </div>
  );
}

function AvailableProjectItem({ project, onAdd }: { project: Project, onAdd: (id: string) => void }) {
  return (
    <div className="group flex items-center gap-3 p-3 rounded-none border border-white/5 bg-zinc-950/50 hover:bg-zinc-900 transition-colors duration-200 opacity-70 hover:opacity-100">
      <div className="w-6 h-6 shrink-0" />
      <div className="w-14 h-14 bg-zinc-900 border border-white/5 shrink-0 flex items-center justify-center overflow-hidden">
        <ProjectThumbnail project={project} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-mono font-bold truncate text-white/70 group-hover:text-white transition-colors">{project.title}</h4>
        <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-1">{project.projectType}</p>
      </div>
      <button onClick={() => onAdd(project.id)} className="w-6 h-6 rounded-none bg-zinc-900 hover:bg-[#ff9e00]/20 border border-white/5 hover:border-[#ff9e00] hover:text-[#ff9e00] text-white/40 flex items-center justify-center transition-all">
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ProjectSelectionModal({ isOpen, onClose, allProjects = [], selectedProjects, onSaveSelection }: ProjectSelectionModalProps) {
  const [selectedList, setSelectedList] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(true);
  const hasLoadedOnce = React.useRef(false);

  // FIX: Skeleton HANYA jalan 1x di pembukaan pertama. Pembukaan berikutnya langsung instan.
  useEffect(() => {
    if (isOpen) {
      const selected = selectedProjects.map(id => allProjects.find(p => p.id === id)).filter(Boolean) as Project[];
      setSelectedList(selected);
      setSearchQuery('');
      
      if (!hasLoadedOnce.current) {
        const timer = setTimeout(() => {
          setIsSimulatingLoad(false);
          hasLoadedOnce.current = true;
        }, 600);
        return () => clearTimeout(timer);
      } else {
        setIsSimulatingLoad(false);
      }
    }
  }, [isOpen]); // <-- Hanya bergantung pada isOpen agar tidak ter-trigger ulang saat state parent (selectedProjects) berubah otomatis

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Helper: Simpan langsung ke parent (Live Preview Real-time)
  const syncToParent = (newList: Project[]) => {
    setSelectedList(newList);
    onSaveSelection(newList.map(p => p.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = selectedList.findIndex((item) => item.id === active.id);
      const newIndex = selectedList.findIndex((item) => item.id === over.id);
      const reordered = arrayMove(selectedList, oldIndex, newIndex);
      syncToParent(reordered);
    }
  };

  const handleAdd = (id: string) => {
    const proj = allProjects.find(p => p.id === id);
    if (proj && !selectedList.some(p => p.id === id)) {
      syncToParent([...selectedList, proj]);
    }
  };

  const handleRemove = (id: string) => {
    syncToParent(selectedList.filter(p => p.id !== id));
  };

  // Hapus handleSave, karena sekarang sudah real-time
  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  const unselectedProjects = allProjects.filter(p => !selectedList.some(sp => sp.id === p.id))
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[999999] bg-black/95 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-none shadow-2xl flex flex-col max-h-[95vh] h-[750px] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-start justify-between shrink-0 bg-zinc-900/20">
          <div>
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#ff9e00]" /> Kurasi Project
            </h2>
            <p className="text-[11px] font-mono text-white/40 mt-2 max-w-lg leading-relaxed">
              Tambahkan project dari daftar tersedia ke daftar terpilih. Geser (drag) ikon di daftar terpilih untuk mengatur urutan. Jika daftar terpilih kosong, semua project akan ditampilkan secara default.
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-none bg-zinc-900 hover:bg-zinc-800 text-white/40 hover:text-white transition-colors border border-white/5"><X className="w-4 h-4" /></button>
        </div>

        {/* Content Body */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          
          {/* TERPILIH */}
          <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-950/30 overflow-hidden">
            <div className="p-4 border-b border-white/5 shrink-0 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#ff9e00] uppercase tracking-widest">
                ● Project Terpilih ({selectedList.length})
              </span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 relative">
              {isSimulatingLoad ? (
                <div className="space-y-2 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={`skel-sel-${i}`} className="flex items-center gap-3 p-3 rounded-none border border-white/5 bg-zinc-900/50">
                      <div className="w-6 h-6 bg-white/5" />
                      <div className="w-14 h-14 bg-white/5" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 bg-white/5" />
                        <div className="h-2 w-1/4 bg-white/5" />
                      </div>
                      <div className="w-6 h-6 bg-white/5" />
                    </div>
                  ))}
                </div>
              ) : selectedList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 animate-in fade-in duration-300">
                  <p className="text-[10px] font-mono uppercase tracking-widest">Belum ada project yang dikurasi.</p>
                  <p className="text-[9px] font-mono mt-2 px-8">Klik (+) pada daftar di sebelah kanan untuk mulai mengurasi project untuk tema ini.</p>
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={selectedList.map(p => p.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {selectedList.map(project => (
                          <SortableProjectItem key={project.id} project={project} onRemove={handleRemove} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>
          </div>

          {/* TERSEDIA */}
          <div className="flex-1 flex flex-col bg-zinc-950/80 overflow-hidden">
            <div className="p-4 border-b border-white/5 shrink-0 flex flex-col gap-3">
              <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">
                ○ Daftar Tersedia
              </span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input 
                  type="text" 
                  placeholder="Cari project..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full bg-zinc-900 border border-white/10 rounded-none py-2 pl-9 pr-4 text-[11px] font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff9e00]/50" 
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 relative">
              {isSimulatingLoad ? (
                <div className="space-y-2 animate-pulse">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={`skel-av-${i}`} className="flex items-center gap-3 p-3 rounded-none border border-white/5 bg-zinc-900/30">
                      <div className="w-6 h-6" />
                      <div className="w-14 h-14 bg-white/5" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-1/2 bg-white/5" />
                        <div className="h-2 w-1/4 bg-white/5" />
                      </div>
                      <div className="w-6 h-6 bg-white/5" />
                    </div>
                  ))}
                </div>
              ) : unselectedProjects.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center opacity-30 animate-in fade-in duration-300">
                  <p className="text-[10px] font-mono uppercase tracking-widest">
                    {searchQuery ? 'Tidak ada hasil pencarian.' : 'Tidak ada project tersisa.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 animate-in fade-in duration-300">
                  {unselectedProjects.map(project => (
                    <AvailableProjectItem key={project.id} project={project} onAdd={handleAdd} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 shrink-0 flex items-center justify-end gap-3 bg-zinc-900/20">
          <button onClick={handleClose} className="px-6 py-2 bg-[#ff9e00] hover:bg-[#ffaa22] text-black text-[10px] font-mono font-bold uppercase tracking-wider transition-colors shadow-lg">
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
