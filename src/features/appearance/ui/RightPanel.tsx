"use client";

import React from 'react';
import { EditorControls } from './EditorControls';
import { GalleryLayoutPicker, GalleryDesignPicker } from '@/components/editor-controls/SharedControls';
import type { ThemeEditorState, ThemeEditorActions } from '@/features/appearance';
import { Grid, Layout, Info } from 'lucide-react';
import { SectionReorderPanel } from './SectionReorderPanel';

export function RightPanel({ 
  state, 
  actions,
  activeTab = 'theme',
  selectedPage = 'gallery'
}: { 
  state: ThemeEditorState, 
  actions: ThemeEditorActions,
  activeTab?: 'theme' | 'pages',
  selectedPage?: 'home' | 'gallery'
}) {
  const { isEditorCollapsed, livePreviewTheme } = state;

  return (
    <div 
      id="appearance-right-panel"
      className={`
      hidden lg:flex flex-col z-50 bg-[#111111] text-white border-l border-white/5 relative shrink-0
      transition-all duration-300
      ${isEditorCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'w-[280px] opacity-100'}
    `}>
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3.5 py-5 min-w-[280px]">
        {activeTab === 'theme' ? (
          <EditorControls state={state} actions={actions} />
        ) : (
          <div className="animate-in fade-in duration-300">
            {selectedPage === 'gallery' ? (
              <div>
                <div className="flex items-center gap-2 mb-4 px-1">
                  <Grid className="w-4 h-4 text-[#ff9e00]" />
                  <h3 className="text-[11px] font-semibold text-white/50 tracking-wider uppercase">Gallery Options</h3>
                </div>

                <div>
                  <GalleryDesignPicker 
                    designStyle={livePreviewTheme?.customTexts?.galleryDesign} 
                    setDesign={(val: string) => actions.updateCustomText('galleryDesign', val)} 
                  />
                  <GalleryLayoutPicker 
                    layoutStyle={livePreviewTheme?.customTexts?.galleryTemplate} 
                    setLayout={(val: string) => actions.updateCustomText('galleryTemplate', val)} 
                  />


                </div>

                {/* Helpful tips */}
                <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex items-start gap-2.5">
                  <Info className="w-3.5 h-3.5 text-[#ff9e00] mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-[10px] text-white/80">Layout Guides</span>
                    <p className="text-[10px] text-white/40 leading-relaxed">
                      <strong>Editorial</strong>: Dynamic grid size designed to feel like a high-fashion editorial magazine.
                      <br className="my-1" />
                      <strong>Masonry</strong>: Multi-column staggered layout best suited for images with different aspect ratios.
                      <br className="my-1" />
                      <strong>Grid</strong>: Standard 3x3 uniform grid matching a classic minimalist grid layout.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-4 px-1">
                  <Layout className="w-4 h-4 text-sky-400" />
                  <h3 className="text-[11px] font-semibold text-white/50 tracking-wider uppercase">Home Options</h3>
                </div>
                
                <SectionReorderPanel 
                  blocks={state.pageBlocks} 
                  setBlocks={actions.setPageBlocks} 
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
