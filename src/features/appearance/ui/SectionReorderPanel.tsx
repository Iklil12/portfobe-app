"use client";

import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Lock, User, Zap, Briefcase, Layers, LayoutGrid, Box, PenTool, Paintbrush, GitBranch, Trophy, MessageSquare, BarChart, PanelBottom, Crown, Type, LucideIcon } from 'lucide-react';
import type { PageBlock } from '@/features/appearance';

const BLOCK_ICONS: Record<string, LucideIcon> = {
  'HERO': Crown,
  'MARQUEE': Type,
  'ABOUT': User,
  'SKILLS': Zap,
  'EXPERIENCE': Briefcase,
  'SERVICES': Layers,
  'STATS': BarChart,
  'PROJECTS': LayoutGrid,
  '3D': Box,
  'PENPOT': PenTool,
  'CANVA': Paintbrush,
  'GITHUB': GitBranch,
  'AWARDS': Trophy,
  'TESTIMONIALS': MessageSquare,
  'FOOTER': PanelBottom,
};

function SortableBlockItem({ block, onToggleVisibility }: { block: PageBlock, onToggleVisibility: (id: string) => void }) {
  const isHero = block.blockType.includes('HERO');
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: block.id,
    disabled: isHero // Prevent dragging if it's HERO
  });
  
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1 };

  // Clean block name
  const displayType = block.blockType.split('_').pop() || block.blockType;
  const IconComponent = BLOCK_ICONS[displayType] || LayoutGrid;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`group flex items-center justify-between p-3 rounded-xl border shadow-sm transition-all duration-300 
        ${isHero ? 'border-[#ff9e00]/20 bg-gradient-to-r from-[#ff9e00]/10 to-transparent' : 
         (isDragging ? 'opacity-95 scale-[1.03] shadow-2xl border-sky-500/50 bg-white/[0.05] ring-2 ring-sky-500/20' : 
         'border-white/5 bg-white/[0.015] hover:bg-white/[0.04] hover:border-white/10')} 
        ${!block.isVisible && !isHero ? 'opacity-40 grayscale-[50%]' : ''}`}
    >
      <div className="flex items-center gap-3.5">
        {isHero ? (
          <div className="text-[#ff9e00]/50 px-1 cursor-not-allowed">
            <Lock className="w-4 h-4" />
          </div>
        ) : (
          <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-white/20 hover:text-sky-400 transition-colors outline-none">
            <GripVertical className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <IconComponent className={`w-3.5 h-3.5 ${isHero ? 'text-[#ff9e00]' : 'text-sky-400/80'}`} />
          <span className={`text-[11px] font-bold tracking-widest uppercase ${!block.isVisible && !isHero ? 'line-through text-white/50' : (isHero ? 'text-[#ff9e00]' : 'text-white/90')}`}>{displayType}</span>
        </div>
      </div>
      
      {!isHero && (
        <button onClick={() => onToggleVisibility(block.id)} className={`transition-all outline-none p-1.5 rounded-lg ${block.isVisible ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10'}`} title={block.isVisible ? "Sembunyikan seksi ini" : "Tampilkan seksi ini"}>
          {block.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

export function SectionReorderPanel({ blocks, setBlocks }: { blocks: PageBlock[], setBlocks: (blocks: PageBlock[]) => void }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      
      // Hero cannot be moved from top, and no one can move above Hero
      // Let's enforce that if we are moving Hero, it stays at 0.
      if (blocks[oldIndex].blockType.includes('HERO') || newIndex === 0 && blocks[0].blockType.includes('HERO')) {
        // Prevent sorting
        return;
      }

      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      const reindexed = newBlocks.map((b, i) => ({ ...b, orderIndex: i }));
      setBlocks(reindexed);
    }
  };

  const toggleVisibility = (id: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, isVisible: !b.isVisible } : b));
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <SortableBlockItem key={block.id} block={block} onToggleVisibility={toggleVisibility} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
