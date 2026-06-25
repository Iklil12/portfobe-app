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
import { getVideoThumbnail } from '@/shared/lib/videoUtils';
import { LazyImage } from '@/shared/ui/LazyImage';
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
        <LazyImage 
          src={finalUrl} 
          alt={project.title} 
          className="w-full h-full object-cover" 
          sizes="60px"
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
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={`group flex items-center gap-4 p-3 rounded-none border transition-all duration-200 ${isDragging ? 'bg-zinc-900 border-[#ff9e00] shadow-2xl shadow-[#ff9e00]/10 scale-[1.02] opacity-95' : 'bg-zinc-950 border-white/10 hover:border-white/30'}`}>
      <button {...attributes} {...listeners} className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-white/80 cursor-grab active:cursor-grabbing transition-colors">
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="w-16 h-12 bg-zinc-900 overflow-hidden shrink-0 border border-white/5 relative">
         <ProjectThumbnail project={project} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-mono font-bold truncate text-white tracking-wide">{project.title}</h4>
        <p className="text-[10px] font-mono text-[#ff9e00] uppercase tracking-widest mt-0.5">{project.projectType}</p>
      </div>
      <button onClick={() => onRemove(project.id)} className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/30 shrink-0">
        <Minus className="w-4 h-4" />
      </button>
    </div>
  );
}

function AvailableProjectItem({ project, onAdd }: { project: Project, onAdd: (id: string) => void }) {
  return (
    <div className="group flex items-center gap-4 p-3 rounded-none border border-transparent hover:border-white/10 bg-transparent hover:bg-white/[0.02] transition-all duration-200">
      <div className="w-8 h-8 shrink-0" />
      <div className="w-16 h-12 bg-zinc-900 overflow-hidden shrink-0 border border-white/5 opacity-60 group-hover:opacity-100 transition-opacity relative">
        <ProjectThumbnail project={project} />
      </div>
      <div className="flex-1 min-w-0 opacity-60 group-hover:opacity-100 transition-opacity">
        <h4 className="text-sm font-mono font-bold truncate text-white tracking-wide">{project.title}</h4>
        <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-0.5">{project.projectType}</p>
      </div>
      <button onClick={() => onAdd(project.id)} className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-[#ff9e00] hover:bg-[#ff9e00]/10 transition-colors border border-transparent hover:border-[#ff9e00]/30 shrink-0">
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl bg-[#09090b] border border-white/10 rounded-none shadow-2xl flex flex-col max-h-[90vh] h-[800px] animate-in zoom-in-95 duration-200 ring-1 ring-white/5">
        
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-white/5 flex items-start justify-between shrink-0 bg-zinc-950 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff9e00]/50 to-transparent opacity-50"></div>
          <div>
            <h2 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="p-2 bg-[#ff9e00]/10 border border-[#ff9e00]/30 text-[#ff9e00]">
                <ImageIcon className="w-4 h-4" />
              </div>
              Curate Projects
            </h2>
            <p className="text-xs font-mono text-white/40 mt-3 max-w-2xl leading-relaxed">
              Define the narrative of your portfolio. Select and reorder the projects that best represent your expertise. Unselected projects will remain in your archive.
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-none bg-zinc-900/50 hover:bg-zinc-800 text-white/50 hover:text-white transition-all border border-white/10 hover:border-white/30"><X className="w-5 h-5" /></button>
        </div>

        {/* Content Body */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-[#09090b]">
          
          {/* TERPILIH */}
          <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-950/50 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff9e00]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="p-5 sm:p-6 border-b border-white/5 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff9e00] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff9e00]"></span>
                 </span>
                 <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">
                   Live Selection <span className="text-white/30 ml-2">({selectedList.length})</span>
                 </span>
              </div>
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
                  <p className="text-[10px] font-mono uppercase tracking-widest">No projects curated yet.</p>
                  <p className="text-[9px] font-mono mt-2 px-8">Click (+) on the right list to start curating projects for this theme.</p>
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
          <div className="flex-1 flex flex-col bg-zinc-900/20 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-white/5 shrink-0 flex flex-col gap-4">
              <span className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span> Available Projects
              </span>
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#ff9e00] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search your archive..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full bg-zinc-950/50 border border-white/10 py-3 pl-10 pr-4 text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff9e00]/50 transition-all hover:border-white/20" 
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
                    {searchQuery ? 'No search results.' : 'No projects left.'}
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
        <div className="p-5 sm:p-6 border-t border-white/5 shrink-0 flex items-center justify-between bg-zinc-950">
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Changes are saved automatically.</p>
          <button onClick={handleClose} className="px-8 py-3 bg-[#ff9e00] hover:bg-[#ffaa22] text-black text-xs font-mono font-bold uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_20px_rgba(255,158,0,0.3)] active:scale-95">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
