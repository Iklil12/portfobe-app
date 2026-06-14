"use client";

import React from 'react';
import { EditorControls } from './EditorControls';
import type { ThemeEditorState, ThemeEditorActions } from '@/hooks/useThemeEditor';

export function RightPanel({ state, actions }: { state: ThemeEditorState, actions: ThemeEditorActions }) {
  const { isEditorCollapsed } = state;

  return (
    <div className={`
      hidden lg:flex flex-col z-50 bg-[#111111] text-white border-l border-white/5 relative shrink-0
      transition-all duration-300
      ${isEditorCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'w-[280px] opacity-100'}
    `}>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 min-w-[280px]">
        <EditorControls state={state} actions={actions} />

      </div>
    </div>
  );
}
