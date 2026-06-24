"use client";

import React, { useEffect } from 'react';
import { ThemeSelectionModal } from './ThemeSelectionModal';
import { ProUpgradeModal } from '@/components/ProUpgradeModal';
import { DraftManagerModal } from './DraftManagerModal';
import { SaveDraftModal } from './SaveDraftModal';
import { ProjectSelectionModal } from './ProjectSelectionModal';
import { THEMES_DATA } from '@/lib/themes';
import { 
  Layout, Film, Bolt, Grid, Star, Layers, Box, Move, 
  Columns, Newspaper, Moon, Waves, Square, Video, Image, Gem, 
  FileText, ChevronRight, RotateCcw, FolderOpen, Loader2, Save, Rocket, Monitor, Smartphone, Sliders,
  Play, MoveVertical, AlertTriangle, MousePointer2, LucideIcon, LogOut
} from 'lucide-react';

import { EditorControls } from './EditorControls';
import { GalleryLayoutPicker, GalleryDesignPicker } from '@/components/editor-controls/SharedControls';
import { SectionReorderPanel } from './SectionReorderPanel';
import type { ThemeEditorState, ThemeEditorActions } from '@/hooks/useThemeEditor';

const THEME_ICONS: Record<string, LucideIcon> = {
  'minimalist': Layout, 'cinematic': Film, 'acid': Bolt, 'bentogrid': Grid,
  'spatial': Star, 'monolith': Layers, 'layered-monolith': Layers,
  'kinetic-avant-garde': Move, 'split': Columns, 'editorial': Newspaper,
  'midnight-emulsion': Moon, 'aura-kinetic': Waves, 'absolute-noir': Square,
  'obsidian-reel': Video, 'split-screen-studio': Columns,
  'cinematic-gallery': Image, 'horizontal-flow': Waves, 'nexus-noir': Gem
};

export function LeftPanel({ 
  state, 
  actions,
  activeTab = 'theme',
  setActiveTab,
  selectedPage = 'gallery',
  setSelectedPage
}: { 
  state: ThemeEditorState, 
  actions: ThemeEditorActions,
  activeTab?: 'theme' | 'pages',
  setActiveTab?: (tab: 'theme' | 'pages') => void,
  selectedPage?: 'home' | 'gallery',
  setSelectedPage?: (page: 'home' | 'gallery') => void
}) {
  const {
    isEditorCollapsed, isSavingDraft, isPublishing, activeTheme, splashScreen,
    isThemeModalOpen, showProModal, isDraftsModalOpen, isLoading, livePreviewData,
    favorites, drafts, activeDraftId, activeDraftName, publishedDraftId, isDirty,
    hasUnpublishedChanges, isSaveDraftModalOpen, selectedProjects, subdomain: stateSubdomain,
    previewMode, themeColor, fontHeading, fontBody, cardStyle, buttonShape, livePreviewTheme
  } = state;

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = React.useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = React.useState(false);
  const [dragY, setDragY] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const touchStartY = React.useRef(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const touchOrigin = React.useRef<'handle' | 'content'>('content');

  const subdomain = stateSubdomain || livePreviewData?.subdomain;
  const userPlan = livePreviewData?.plan || 'FREE';

  const {
    setIsThemeModalOpen, setActiveTheme, setShowProModal, setIsDraftsModalOpen,
    setIsSaveDraftModalOpen, saveDraft, publishDesign, loadDraft, toggleFavorite, setSelectedProjects,
    setThemeColor, setFontHeading, setFontBody, setCardStyle, setButtonShape, setSplashScreen, updateCustomText
  } = actions;

  const isCurrentlyLive = activeDraftId ? activeDraftId === publishedDraftId : publishedDraftId === null;
  const canPublish = isDirty || !isCurrentlyLive || hasUnpublishedChanges;

  const ActiveThemeIcon = THEME_ICONS[activeTheme] || Box;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
    
    if (scrollContainerRef.current && scrollContainerRef.current.contains(e.target as Node)) {
      touchOrigin.current = 'content';
    } else {
      touchOrigin.current = 'handle';
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    
    // Boleh drag panel JIKA ditekan di handle ATAU konten sedang di posisi puncak (scrollTop 0)
    const isAtTop = touchOrigin.current === 'handle' || !scrollContainerRef.current || scrollContainerRef.current.scrollTop <= 0;
    
    if (isAtTop) {
      const diff = currentY - touchStartY.current;
      if (diff > 0) {
        setDragY(diff);
      } else {
        // Bergerak ke atas saat di puncak (kembali normal scroll)
        setDragY(0);
        touchStartY.current = currentY; // Terus reset agar saat ditarik ke bawah lagi hitungannya akurat
      }
    } else {
      // Konten sedang di-scroll di tengah/bawah, panel tidak boleh ikut.
      setDragY(0);
      touchStartY.current = currentY; // Update terus koordinat awal agar siap transisi saat mentok ke atas
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY > 80) setIsMobileDrawerOpen(false);
    setDragY(0);
  };

  return (
    <>
      {/* Modals */}
      <ProUpgradeModal isOpen={showProModal} onClose={() => setShowProModal(false)} feature="Premium Features" />
      <ThemeSelectionModal
        isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)}
        activeTheme={activeTheme} onSelectTheme={(themeId) => setActiveTheme(themeId)}
        favorites={favorites} userPlan={userPlan} onToggleFavorite={toggleFavorite}
      />
      <DraftManagerModal
        isOpen={isDraftsModalOpen} onClose={() => setIsDraftsModalOpen(false)}
        drafts={drafts} activeDraftId={activeDraftId} publishedDraftId={publishedDraftId}
        onLoadDraft={loadDraft}
      />
      <SaveDraftModal
        isOpen={isSaveDraftModalOpen} onClose={() => setIsSaveDraftModalOpen(false)}
        onSave={(name, desc) => saveDraft(name, desc)} isSaving={isSavingDraft}
      />
      <ProjectSelectionModal
        isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)}
        allProjects={(state.rawProjects || []).filter((p: { projectType?: string }) => p.projectType !== '3d')}
        selectedProjects={selectedProjects || []} onSaveSelection={(newSelected) => setSelectedProjects(newSelected)}
      />

      {/* MOBILE FLOATING DOCK */}
      <div className={`
         lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] 
        bg-[#1a1a1a]/80 backdrop-blur-xl text-white rounded-full p-1.5
        flex items-center shadow-2xl border border-white/10
        transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${isMobileDrawerOpen ? 'translate-y-32 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}
      `}>
        <button 
          onClick={() => { if (activeDraftId) saveDraft(); else setIsSaveDraftModalOpen(true); }} 
          disabled={isSavingDraft || isPublishing || (activeDraftId ? !isDirty : false)}
          className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full transition-all ${activeDraftId && !isDirty ? 'text-white/30' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
        >
          {isSavingDraft ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span className="text-[11px] font-medium">Save</span>
        </button>

        <div className="w-px h-5 bg-white/10 mx-1"></div>

        <button 
          onClick={() => setIsMobileDrawerOpen(true)} 
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-all text-white/90 hover:text-white"
        >
          <Sliders className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1"></div>

        <button 
          onClick={publishDesign} 
          disabled={!canPublish || isPublishing}
          className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full transition-all ${canPublish ? 'bg-[#0099ff] text-white shadow-lg shadow-[#0099ff]/20' : 'bg-transparent text-white/30'}`}
        >
          {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
          <span className="text-[11px] font-medium">Publish</span>
        </button>
      </div>

      {/* MOBILE BACKDROP */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/60 z-[95] transition-opacity duration-500 ${isMobileDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileDrawerOpen(false)}
      />

      {/* LEFT SIDEBAR UTAMA */}
      <div 
        className={`
          flex flex-col z-[100] bg-[#111111] text-white border-r border-white/5 overscroll-none
          ${isEditorCollapsed ? 'lg:w-0 lg:opacity-0 lg:pointer-events-none lg:overflow-hidden' : 'lg:w-[280px] lg:opacity-100'}
          fixed left-0 right-0 bottom-0 h-[80vh] max-h-[80vh] lg:h-full lg:relative lg:max-h-full rounded-t-3xl lg:rounded-none
          transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isMobileDrawerOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
        `}
        style={{
          transform: isDragging ? `translateY(${dragY}px)` : undefined,
          transition: isDragging ? 'none' : undefined
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile Drag Handle */}
        <div 
          className="lg:hidden w-full flex justify-center pt-4 pb-2 cursor-pointer rounded-t-3xl touch-none" 
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          <div className="w-12 h-1.5 bg-zinc-800 rounded-full"></div>
        </div>

        {/* Indikator Draft Aktif */}
        {activeDraftName && (
          <div className="px-3.5 py-2.5 bg-[#111111] border-b border-white/5 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Draft Icon */}
              <FileText className="w-3.5 h-3.5 text-[#ff9e00] shrink-0" />
              
              {/* Draft Name */}
              <span className="text-[11px] font-semibold text-zinc-200 tracking-wide truncate max-w-[85px]" title={activeDraftName}>
                {activeDraftName}
              </span>

              {/* Styled Status Badge */}
              {publishedDraftId === activeDraftId && !hasUnpublishedChanges && (
                <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold shrink-0">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              )}
              {publishedDraftId === activeDraftId && hasUnpublishedChanges && (
                <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold shrink-0">
                  <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
                  CHANGES
                </span>
              )}
              {publishedDraftId !== activeDraftId && (
                <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/5 font-bold shrink-0">
                  <span className="w-1 h-1 rounded-full bg-zinc-500" />
                  DRAFT
                </span>
              )}
            </div>

            {/* Exit/Keluar Button */}
            <button
              onClick={actions.exitDraft}
              className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-2.5 py-1 rounded-md transition-all duration-200 border border-white/5 hover:border-red-500/20 shadow-sm"
            >
              <LogOut className="w-3 h-3" />
              <span>Exit</span>
            </button>
          </div>
        )}

        {/* Mobile Tab Switcher */}
        <div className="lg:hidden px-3.5 pb-2 pt-1 border-b border-white/5 flex gap-1 shrink-0 bg-[#111111]">
          <button
            onClick={() => setActiveTab?.('theme')}
            className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 border ${
              activeTab === 'theme'
                ? 'bg-[#2c2c35] border-white/10 text-white shadow-sm'
                : 'bg-transparent border-transparent text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Theme</span>
          </button>
          <button
            onClick={() => setActiveTab?.('pages')}
            className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 border ${
              activeTab === 'pages'
                ? 'bg-[#2c2c35] border-white/10 text-white shadow-sm'
                : 'bg-transparent border-transparent text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Pages</span>
          </button>
        </div>

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overscroll-none custom-scrollbar px-3.5 py-5 min-w-[280px]">
          {/* TAB TEMA */}
          <div className={activeTab === 'theme' ? 'block' : 'hidden'}>
            {/* SECTION: PAGES / THEMES (MIMICKING FRAMER) */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-[11px] font-semibold text-white/40 tracking-wider uppercase">Templates</h3>
                {!isLoading && (
                  <button onClick={() => setIsThemeModalOpen(true)} className="w-5 h-5 rounded hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                    <PlusIcon />
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="p-4 rounded-md border border-white/5 bg-zinc-900/40 animate-pulse h-16"></div>
              ) : (
                <div 
                  className="group cursor-pointer p-3.5 rounded-md border border-white/5 bg-[#16161a] hover:bg-[#1f1f24] hover:border-white/10 transition-all flex items-center justify-between shadow-sm"
                  onClick={() => setIsThemeModalOpen(true)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-white/5 border border-white/5 flex items-center justify-center text-white transition-all group-hover:bg-white/10 group-hover:border-white/10">
                      <ActiveThemeIcon className="w-4 h-4 text-white/70 group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-white text-[13px] leading-tight tracking-wide">
                        {THEMES_DATA.find(t => t.id === activeTheme)?.name || 'Theme'}
                      </span>
                      <span className="text-[10px] text-white/45 mt-1">Active Template</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all" />
                </div>
              )}
              
              {/* Status Perubahan / Live */}
              <div className="mt-3.5 px-1.5 flex items-center justify-between">
                {isCurrentlyLive && !isDirty && !hasUnpublishedChanges && (
                   <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-2 tracking-wide">
                     <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Currently Live
                   </span>
                )}
                {isCurrentlyLive && !isDirty && hasUnpublishedChanges && (
                   <span className="text-[10px] font-semibold text-[#ff9e00] flex items-center gap-2 tracking-wide">
                     <span className="w-1.5 h-1.5 bg-[#ff9e00] rounded-full animate-pulse"></span> Unpublished Changes
                   </span>
                )}
                {isDirty && (
                   <span className="text-[10px] font-semibold text-sky-400 flex items-center gap-2 tracking-wide">
                     <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></span> Unsaved Changes
                   </span>
                )}
              </div>

              {!isLoading && (
                <button
                  onClick={actions.resetToThemePreset}
                  className="mt-3.5 w-full px-3 py-2 border border-white/5 hover:border-white/10 bg-white/[0.02] hover:bg-white/5 rounded-md text-white/60 hover:text-white transition-all text-[11px] font-medium flex items-center justify-center gap-2 group shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-white/40 group-hover:text-white group-hover:rotate-[-45deg] transition-all duration-300" />
                  <span>Reset to Default</span>
                </button>
              )}
            </div>

            {/* Line Separator */}
            <div className="w-full h-px bg-white/5 my-6"></div>

            {/* SECTION: CONTENT (Projects & Drafts) */}
            <div className="mb-8">
              <h3 className="text-[11px] font-semibold text-white/40 tracking-wider uppercase mb-3 px-1">Content</h3>
              
              <div className="flex flex-col gap-1.5">
                <button 
                  onClick={() => setIsProjectModalOpen(true)}
                  className="w-full px-3 py-2 rounded-md border border-transparent hover:border-white/5 bg-transparent hover:bg-white/[0.02] text-white/60 hover:text-white transition-all flex items-center justify-between group text-sm"
                >
                  <span className="text-xs font-medium tracking-wide">Projects</span>
                  {selectedProjects?.length > 0 && (
                    <span className="bg-white/5 text-zinc-500 font-mono font-medium text-[10px] px-2 py-0.5 rounded-full min-w-[20px] text-center group-hover:bg-white/10 group-hover:text-zinc-200 transition-all">
                      {selectedProjects.length}
                    </span>
                  )}
                </button>

                <button 
                  onClick={() => setIsDraftsModalOpen(true)}
                  className="w-full px-3 py-2 rounded-md border border-transparent hover:border-white/5 bg-transparent hover:bg-white/[0.02] text-white/60 hover:text-white transition-all flex items-center justify-between group text-sm"
                >
                  <span className="text-xs font-medium tracking-wide">Saved</span>
                  {drafts?.length > 0 && (
                    <span className="bg-white/5 text-zinc-500 font-mono font-medium text-[10px] px-2 py-0.5 rounded-full min-w-[20px] text-center group-hover:bg-white/10 group-hover:text-zinc-200 transition-all">
                      {drafts.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Di mobile, kontrol style tema ditaruh di sini (di dalam tab theme) */}
            <div className="block lg:hidden mt-6">
              <EditorControls state={state} actions={actions} />
            </div>
          </div>

          {/* TAB PAGES */}
          <div className={activeTab === 'pages' ? 'block' : 'hidden'}>
            {/* SECTION: PAGES (MIMICKING FRAMER PAGES LIST) */}
            <div className="mb-8">
              <h3 className="text-[11px] font-semibold text-white/50 tracking-wider uppercase mb-4 px-1">Website Pages</h3>
              
              <div className="flex flex-col gap-2">
                {/* Home Page */}
                <button 
                  onClick={() => setSelectedPage?.('home')}
                  className={`w-full p-3 rounded-md transition-all flex items-center gap-3 border text-left ${
                    selectedPage === 'home' 
                      ? 'bg-[#2c2c35] border-white/10 text-white shadow-sm' 
                      : 'bg-transparent border-transparent text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="w-8 h-8 rounded bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                    <Layout className="w-4 h-4 text-white/70" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-[13px] leading-tight">Main Page</span>
                    <span className="text-[10px] opacity-50 mt-0.5">Landing & Sections</span>
                  </div>
                </button>

                {/* Gallery Page */}
                {(() => {
                  const userPlan = livePreviewData?.plan || livePreviewData?.user?.plan || 'FREE';
                  const allProjects = livePreviewData?.projects || [];
                  const galleryProjectsCount = allProjects.filter((p: any) => p.projectType === 'photo' || p.projectType === 'video').length;
                  
                  return (
                    <button 
                      onClick={() => {
                        if (userPlan === 'FREE') {
                          actions.setShowProModal(true);
                          return;
                        }
                        if (galleryProjectsCount <= 4) {
                          alert("Gallery feature requires at least 5 photo or video projects.");
                          return;
                        }
                        setSelectedPage?.('gallery');
                      }}
                      className={`w-full p-3 rounded-md transition-all flex items-center gap-3 border text-left relative ${
                        selectedPage === 'gallery' 
                          ? 'bg-[#2c2c35] border-white/10 text-white shadow-sm' 
                          : 'bg-transparent border-transparent text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="w-8 h-8 rounded bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                        <Grid className="w-4 h-4 text-[#ff9e00]" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[13px] leading-tight">Gallery Showcase</span>
                          {userPlan === 'FREE' && (
                            <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">PRO</span>
                          )}
                        </div>
                        <span className="text-[10px] opacity-50 mt-0.5">Curated Works Page</span>
                      </div>
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Di mobile, opsi halaman ditaruh di sini jika tab pages aktif */}
            <div className="block lg:hidden mt-8 border-t border-white/5 pt-6">
              {selectedPage === 'gallery' ? (
                <div>
                  <div className="flex items-center gap-2 mb-4 px-1">
                    <Grid className="w-4 h-4 text-[#ff9e00]" />
                    <h3 className="text-[11px] font-semibold text-white/50 tracking-wider uppercase">Gallery Options</h3>
                  </div>

                  <div className="flex flex-col gap-4">
                    <GalleryDesignPicker 
                      designStyle={livePreviewTheme?.customTexts?.galleryDesign} 
                      setDesign={(val: string) => actions.updateCustomText('galleryDesign', val)} 
                    />
                    <GalleryLayoutPicker 
                      layoutStyle={livePreviewTheme?.customTexts?.galleryTemplate} 
                      setLayout={(val: string) => actions.updateCustomText('galleryTemplate', val)} 
                    />
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
          </div>
        </div>
      </div>
    </>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
