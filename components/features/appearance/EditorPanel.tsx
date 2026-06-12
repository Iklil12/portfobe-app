//components/features/appearance/EditorPanel.tsx
"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ThemeSelectionModal } from './ThemeSelectionModal';
import { ProUpgradeModal } from '@/components/ProUpgradeModal';
import { DraftManagerModal } from './DraftManagerModal';
import { SaveDraftModal } from './SaveDraftModal';
import { ProjectSelectionModal } from './ProjectSelectionModal';
import { THEMES_DATA } from '@/lib/themes';
import { 
  Layout, Film, Bolt, Grid, Star, Layers, Box, Move, 
  Columns, Newspaper, Moon, Waves, Square, Video, Image, Gem, 
  ArrowLeft, Save, Loader2, Rocket, FileText, ChevronLeft, ChevronRight, 
  Sparkles, RotateCcw, FolderOpen, AlertTriangle, Play, MoveVertical, Undo2, Redo2, 
  ExternalLink, Sliders, Monitor, Smartphone, X, Check
} from 'lucide-react';

import { ColorPicker, FontPicker, CardStylePicker, ButtonShapePicker } from '@/components/editor-controls/SharedControls';

const THEME_ICONS: Record<string, React.ComponentType<any>> = {
  'minimalist': Layout,
  'cinematic': Film,
  'acid': Bolt,
  'bentogrid': Grid,
  'spatial': Star,
  'monolith': Layers,
  'layered-monolith': Layers,
  'kinetic-avant-garde': Move,
  'split': Columns,
  'editorial': Newspaper,
  'midnight-emulsion': Moon,
  'aura-kinetic': Waves,
  'absolute-noir': Square,
  'obsidian-reel': Video,
  'split-screen-studio': Columns,
  'cinematic-gallery': Image,
  'horizontal-flow': Waves,
  'nexus-noir': Gem
};

export function EditorPanel({ state, actions }: { state: any, actions: any }) {
  const {
    isEditorCollapsed,
    isSavingDraft,
    isPublishing,
    activeTheme,
    themeColor,
    fontHeading,
    fontBody,
    cardStyle,
    buttonShape,
    splashScreen,
    isThemeModalOpen,
    showProModal,
    isDraftsModalOpen,
    isLoading,
    livePreviewData,
    favorites,
    drafts,
    activeDraftId,
    activeDraftName,
    publishedDraftId,
    isDirty,
    hasUnpublishedChanges,
    isSaveDraftModalOpen,
    pageBlocks,
    selectedProjects,
    subdomain: stateSubdomain
  } = state;

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = React.useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = React.useState(false);
  const [dragY, setDragY] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const touchStartY = React.useRef(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 100) {
      setIsMobileDrawerOpen(false);
    }
    setDragY(0);
  };

  const handleContentTouchStart = (e: React.TouchEvent) => {
    if (scrollContainerRef.current && scrollContainerRef.current.scrollTop <= 0) {
      touchStartY.current = e.touches[0].clientY;
      setIsDragging(true);
    }
  };

  const handleContentTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    
    // Tarik panel ke bawah hanya jika di ujung atas konten
    if (diff > 0 && scrollContainerRef.current && scrollContainerRef.current.scrollTop <= 0) {
      setDragY(diff);
    } else if (diff < 0) {
      setIsDragging(false);
      setDragY(0);
    }
  };

  const subdomain = stateSubdomain || livePreviewData?.subdomain;
  const userPlan = livePreviewData?.plan || 'FREE';

  const {
    setIsEditorCollapsed,
    setThemeColor,
    setFontHeading,
    setFontBody,
    setCardStyle,
    setButtonShape,
    setSplashScreen,
    setIsThemeModalOpen,
    setActiveTheme,
    setShowProModal,
    setIsDraftsModalOpen,
    setIsSaveDraftModalOpen,
    saveDraft,
    publishDesign,
    loadDraft,
    toggleFavorite,
    updateCustomText,
    setSelectedProjects
  } = actions;

  const isCurrentlyLive = activeDraftId ? activeDraftId === publishedDraftId : publishedDraftId === null;
  const canPublish = isDirty || !isCurrentlyLive || hasUnpublishedChanges;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const ActiveThemeIcon = THEME_ICONS[activeTheme] || Box;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .glass-noise {
           background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
        }
      `}} />
      <ProUpgradeModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        feature={
          state.livePreviewTheme?.customTexts?.smooth_scroll === 'true' && userPlan === 'FREE' && !splashScreen && activeTheme !== 'cinematic' && activeTheme !== 'bentogrid' && activeTheme !== 'spatial' && activeTheme !== 'monolith' && activeTheme !== 'acid' && activeTheme !== 'split' && activeTheme !== 'editorial' && activeTheme !== 'obsidian-reel' && activeTheme !== 'split-screen-studio' ? "Fitur Smooth Scroll" :
          splashScreen ? "Fitur Cinematic Intro" :
            activeTheme === 'brutalism' ? "Tema Neo Brutalism" :
              activeTheme === 'cinematic' ? "Tema Cinematic Dark" :
                activeTheme === 'bentogrid' ? "Tema Bento Grid" :
                  activeTheme === 'spatial' ? "Tema Aura Spatial" :
                    activeTheme === 'monolith' ? "Tema Monolith Vanguard" :
                      activeTheme === 'acid' ? "Tema Acid Tech" : 
                        activeTheme === 'split' ? "Tema Nexus Split" : 
                          activeTheme === 'editorial' ? "Tema Editorial Clean" : 
                            activeTheme === 'obsidian-reel' ? "Tema Obsidian Reel" :
                              activeTheme === 'layered-monolith' ? "Tema Layered Monolith" : 
                                activeTheme === 'kinetic-avant-garde' ? "Tema Dynamic Void" : 
                                      activeTheme === 'nexus-noir' ? "Tema Nexus Noir" : 
                                        activeTheme === 'split-screen-studio' ? "Tema Split Screen Studio" :
                                          activeTheme === 'cinematic-gallery' ? "Tema Ruang Cinematic" : undefined
        }
      />
      <ThemeSelectionModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        activeTheme={activeTheme}
        onSelectTheme={(themeId) => setActiveTheme(themeId)}
        favorites={favorites}
        userPlan={userPlan}
        onToggleFavorite={toggleFavorite}
      />
      <DraftManagerModal
        isOpen={isDraftsModalOpen}
        onClose={() => setIsDraftsModalOpen(false)}
        drafts={drafts}
        activeDraftId={activeDraftId}
        publishedDraftId={publishedDraftId}
        onLoadDraft={loadDraft}
      />
      <SaveDraftModal
        isOpen={isSaveDraftModalOpen}
        onClose={() => setIsSaveDraftModalOpen(false)}
        onSave={(name, desc) => saveDraft(name, desc)}
        isSaving={isSavingDraft}
      />
      <ProjectSelectionModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        allProjects={(state.rawProjects || []).filter((p: any) => p.projectType !== '3d')}
        selectedProjects={selectedProjects || []}
        onSaveSelection={(newSelected) => {
          setSelectedProjects(newSelected);
        }}
      />

      {/* MOBILE FLOATING DOCK (Live Canvas First) */}
      <div className={`
        glass-noise lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] 
        bg-zinc-900/95 backdrop-blur-md text-white rounded-none px-5 py-2 
        flex items-center gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10
        transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${isMobileDrawerOpen ? 'translate-y-32 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}
      `}>
        <button 
          onClick={() => {
            if (activeDraftId) saveDraft();
            else setIsSaveDraftModalOpen(true);
          }} 
          disabled={isSavingDraft || isPublishing || (activeDraftId ? !isDirty : false)}
          className={`flex flex-col items-center justify-center w-16 gap-1 transition-opacity ${activeDraftId && !isDirty ? 'opacity-30' : 'opacity-80 hover:opacity-100'}`}
        >
          {isSavingDraft ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span className="text-[7px] font-mono font-bold tracking-widest uppercase">Save</span>
        </button>

        <div className="flex flex-col items-center justify-center -mt-[3.75rem]">
          <div className="glass-noise bg-zinc-900/90 backdrop-blur-md p-1 rounded-none border border-white/10 flex items-center mb-2 shadow-xl relative z-10">
            <button
              onClick={() => actions.setPreviewMode('desktop')}
              className={`px-3 py-1.5 rounded-none text-[9px] font-mono font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${state.previewMode === 'desktop' ? 'bg-[#ff9e00] text-black shadow-sm' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
            >
              <Monitor className="w-3 h-3" />
            </button>
            <button
              onClick={() => actions.setPreviewMode('mobile')}
              className={`px-3 py-1.5 rounded-none text-[9px] font-mono font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${state.previewMode === 'mobile' ? 'bg-[#ff9e00] text-black shadow-sm' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
            >
              <Smartphone className="w-3 h-3" />
            </button>
          </div>
          <button 
            onClick={() => setIsMobileDrawerOpen(true)} 
            className="flex flex-col items-center justify-center w-12 h-12 bg-[#ff9e00] text-black rounded-none border-[4px] border-zinc-950 shadow-lg hover:scale-105 transition-transform z-20 relative"
          >
            <Sliders className="w-5 h-5" />
          </button>
        </div>

        <button 
          onClick={publishDesign} 
          disabled={!canPublish || isPublishing}
          className={`flex flex-col items-center justify-center w-16 gap-1 transition-opacity ${canPublish ? 'text-emerald-400 hover:text-emerald-300' : 'text-zinc-600'}`}
        >
          {isPublishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Rocket className="w-3.5 h-3.5" />}
          <span className="text-[7px] font-mono font-bold tracking-widest uppercase">Publish</span>
        </button>
      </div>

      {/* MOBILE BACKDROP */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/60 z-[95] transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isMobileDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileDrawerOpen(false)}
      />

      {/* KONTROL EDITOR UTAMA */}
      <div 
        className={`
          glass-noise flex flex-col z-[100] bg-zinc-950 text-white
          ${isDragging ? '' : 'transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]'}
          lg:relative lg:h-full lg:shrink-0 lg:border-r lg:border-white/10 lg:rounded-none lg:shadow-none lg:translate-y-0 lg:max-h-full
          fixed left-0 right-0 bottom-0 rounded-t-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.5)] max-h-[85vh] border-t border-white/10 lg:border-t-0
          ${isEditorCollapsed ? 'lg:w-0 lg:opacity-0 lg:pointer-events-none' : 'lg:w-[420px] xl:w-[460px] lg:opacity-100'}
          ${isMobileDrawerOpen && !dragY ? 'translate-y-0' : dragY ? '' : 'translate-y-full'}
        `}
        style={dragY > 0 ? { transform: `translateY(${dragY}px)` } : undefined}
      >
        {/* Mobile Drag Handle */}
        <div 
          className="lg:hidden w-full flex justify-center pt-4 pb-2 cursor-pointer active:bg-zinc-900 rounded-t-3xl transition-colors" 
          onClick={() => setIsMobileDrawerOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1.5 bg-zinc-800 rounded-full"></div>
        </div>


        {/* Indikator Draft Aktif */}
        {activeDraftName && (
          <div className="px-6 py-2.5 bg-amber-950/20 border-b border-[#ff9e00]/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#ff9e00]" />
              <span className="text-[10px] font-mono font-bold text-[#ff9e00] tracking-wider uppercase">
                Draft: {activeDraftName}
              </span>
              {publishedDraftId === activeDraftId && !hasUnpublishedChanges && (
                <span className="text-[8px] px-1.5 py-0.5 rounded-none bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest font-black">LIVE</span>
              )}
              {publishedDraftId === activeDraftId && hasUnpublishedChanges && (
                <span className="text-[8px] px-1.5 py-0.5 rounded-none bg-amber-950/20 text-[#ff9e00] border border-[#ff9e00]/20 uppercase tracking-widest font-black">PERLU PUBLISH</span>
              )}
            </div>
            <button
              onClick={actions.exitDraft}
              className="text-[10px] font-mono font-bold text-white/40 hover:text-white transition-colors uppercase"
            >
              Keluar Draft
            </button>
          </div>
        )}

        {/* Tombol Collapse Panel Editor */}
        <div className="absolute top-1/2 -right-[14px] -translate-y-1/2 z-[100] hidden lg:flex">
          <button 
            onClick={() => setIsEditorCollapsed(true)} 
            className="w-7 h-14 bg-zinc-950 border border-white/10 shadow-sm rounded-r-full flex items-center justify-center text-white/40 hover:text-white transition-all duration-200" 
            title="Sembunyikan Panel Editor"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Konten Menu Editor */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 pb-32 relative z-10"
          onTouchStart={handleContentTouchStart}
          onTouchMove={handleContentTouchMove}
          onTouchEnd={handleTouchEnd}
        >

          {/* SECTION: TEMA AKTIF */}
          <div className="mb-12 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">Basis Tema</h3>
                {isCurrentlyLive && !isDirty && !hasUnpublishedChanges && (
                   <span className="text-[9px] font-mono font-bold text-emerald-400 flex items-center gap-1 mt-1.5 uppercase tracking-widest">
                     <span className="w-1.5 h-1.5 bg-emerald-400 rounded-none animate-pulse"></span> Sedang Live
                   </span>
                )}
                {isCurrentlyLive && !isDirty && hasUnpublishedChanges && (
                   <span className="text-[9px] font-mono font-bold text-[#ff9e00] flex items-center gap-1 mt-1.5 uppercase tracking-widest">
                     <span className="w-1.5 h-1.5 bg-[#ff9e00] rounded-none animate-pulse"></span> Perubahan Belum Tayang
                   </span>
                )}
                {isDirty && (
                   <span className="text-[9px] font-mono font-bold text-sky-400 flex items-center gap-1 mt-1.5 uppercase tracking-widest">
                     <span className="w-1.5 h-1.5 bg-sky-400 rounded-none animate-pulse"></span> Terdapat Perubahan
                   </span>
                )}
              </div>
              {!isLoading && (
                <button
                  onClick={() => setIsThemeModalOpen(true)}
                  className="text-[10px] font-mono font-bold text-white/40 hover:text-[#ff9e00] transition-colors uppercase tracking-widest flex items-center gap-1"
                >
                  Ganti <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="p-5 rounded-none border border-white/5 bg-zinc-900/40 animate-pulse h-20"></div>
            ) : (
              <div 
                className="group cursor-pointer p-4 rounded-none border border-white/10 bg-zinc-900/40 hover:border-[#ff9e00] transition-all flex items-center justify-between"
                onClick={() => setIsThemeModalOpen(true)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-none bg-zinc-950 border border-white/10 flex items-center justify-center text-white transition-transform group-hover:scale-105">
                    <ActiveThemeIcon className="w-5 h-5 text-white/70" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono font-bold text-white text-xs uppercase">
                      {THEMES_DATA.find(t => t.id === activeTheme)?.name || 'Neo Brutalism'}
                    </span>
                    <span className="text-[9px] font-mono text-white/40 font-medium mt-0.5 uppercase tracking-wider">
                      Sedang Digunakan
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && (
              <div className="flex w-full gap-3 mt-3">
                <button
                  onClick={actions.resetToThemePreset}
                  className="flex-1 px-2 py-3 rounded-none border border-white/10 bg-zinc-950 hover:bg-zinc-900 text-white/60 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-none group"
                  title="Reset susunan blok ke setelan pabrik (segar)"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#ff9e00] group-hover:-rotate-90 transition-transform duration-300" />
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase">Reset Tema</span>
                </button>

                <button
                  onClick={() => setIsDraftsModalOpen(true)}
                  className="flex-1 px-2 py-3 rounded-none border border-dashed border-white/10 bg-zinc-950 hover:bg-zinc-900 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2 group shadow-none"
                  title="Buka panel manajemen draft"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono font-bold text-white/60 group-hover:text-white tracking-wider uppercase">
                    Drafts {drafts.length > 0 ? <span className="bg-zinc-900 border border-white/10 text-[#ff9e00] px-1.5 py-0.5 rounded-none ml-1">{drafts.length}</span> : ''}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* DIVIDER */}
          <div className="flex items-center justify-center mb-10 opacity-70 relative">
            <div className="w-full h-px bg-white/5"></div>
            <div className="absolute bg-zinc-950 px-3 text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest">Kustomisasi Lanjutan</div>
          </div>

          {/* KONTROL DINAMIS */}
          <div className="mb-10">
            {activeTheme === 'absolute-noir' && (
              <div className="p-4 mb-8 border border-white/10 bg-zinc-900/40 rounded-none flex items-start gap-3 animate-in fade-in duration-500">
                <AlertTriangle className="text-white/40 mt-0.5 w-5 h-5 shrink-0" />
                <div>
                  <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-white mb-1">Strict Mode Active</h4>
                  <p className="text-[11px] font-mono text-white/40 leading-relaxed">
                    Absolute Noir menerapkan desain grayscale brutalist murni. Palet warna, bayangan, dan bentuk elemen dikunci untuk mempertahankan estetika khasnya.
                  </p>
                </div>
              </div>
            )}

            {/* Warna */}
            {activeTheme !== 'absolute-noir' && (
              <ColorPicker themeColor={themeColor} setThemeColor={setThemeColor} />
            )}

            {/* Font */}
            <FontPicker fontHeading={fontHeading} setFontHeading={setFontHeading} setFontBody={setFontBody} />

            {/* Kartu & Tombol */}
            {activeTheme !== 'absolute-noir' && (
              <>
                <CardStylePicker cardStyle={cardStyle} setCardStyle={setCardStyle} />
                <ButtonShapePicker buttonShape={buttonShape} setButtonShape={setButtonShape} />
              </>
            )}
          </div>

          {/* KURASI PROJECT */}
          {!isLoading && (
            <div 
              className="cursor-pointer border border-white/10 rounded-none p-5 mb-6 transition-all duration-200 hover:border-white/20 bg-zinc-900/20 flex items-center justify-between"
              onClick={() => setIsProjectModalOpen(true)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-none flex items-center justify-center shrink-0 transition-colors ${selectedProjects?.length > 0 ? 'bg-[#ff9e00] text-black' : 'bg-zinc-950 border border-white/10 text-white/40'}`}>
                  <Image className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                    Kurasi Project
                  </h3>
                  <p className="text-[11px] font-mono text-white/40 mt-1">
                    {selectedProjects?.length > 0 
                      ? `${selectedProjects.length} project dipilih khusus untuk tema ini.` 
                      : `Semua project ditampilkan. (Default)`}
                  </p>
                </div>
              </div>
              
              <button className="w-8 h-8 flex items-center justify-center bg-zinc-950 border border-white/10 text-white/40 hover:text-white transition-colors rounded-none">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TOGGLE SPLASH SCREEN */}
          {isLoading ? (
            <div className="border border-white/5 rounded-none p-5 h-20 animate-pulse mb-6"></div>
          ) : (
            <div 
              className="cursor-pointer border border-white/10 rounded-none p-5 mb-6 transition-all duration-200 hover:border-white/20 bg-zinc-900/20 flex items-center justify-between"
              onClick={() => setSplashScreen(!splashScreen)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-none flex items-center justify-center shrink-0 transition-colors ${splashScreen ? 'bg-[#ff9e00] text-black' : 'bg-zinc-950 border border-white/10 text-white/40'}`}>
                  <Play className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                    Cinematic Intro
                    <span className="bg-zinc-900 border border-white/10 text-[#ff9e00] text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-none uppercase tracking-widest">
                      PRO
                    </span>
                  </h3>
                  <p className="text-[11px] font-mono text-white/40 mt-1">Animasi pembuka portofolio.</p>
                </div>
              </div>
              
              {/* Minimalist Switch */}
              <button className={`w-10 h-5 rounded-none relative transition-colors duration-300 shrink-0 outline-none ${splashScreen ? 'bg-[#ff9e00]' : 'bg-zinc-950 border border-white/10'}`}>
                <div className={`w-4 h-4 rounded-none absolute top-[2px] transition-transform duration-300 shadow-sm ${splashScreen ? 'bg-black translate-x-[22px]' : 'bg-white/20 translate-x-[2px]'}`}></div>
              </button>
            </div>
          )}

          {/* TOGGLE SMOOTH SCROLL */}
          {isLoading ? (
            <div className="border border-white/5 rounded-none p-5 h-20 animate-pulse mb-6"></div>
          ) : (
            <div 
              className="cursor-pointer border border-white/10 rounded-none p-5 mb-6 transition-all duration-200 hover:border-white/20 bg-zinc-900/20 flex items-center justify-between"
              onClick={() => updateCustomText('smooth_scroll', state.livePreviewTheme?.customTexts?.smooth_scroll === 'true' ? 'false' : 'true')}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-none flex items-center justify-center shrink-0 transition-colors ${state.livePreviewTheme?.customTexts?.smooth_scroll === 'true' ? 'bg-[#ff9e00] text-black' : 'bg-zinc-950 border border-white/10 text-white/40'}`}>
                  <MoveVertical className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                    Smooth Scroll
                    <span className="bg-zinc-900 border border-white/10 text-[#ff9e00] text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-none uppercase tracking-widest">
                      PRO
                    </span>
                  </h3>
                  <p className="text-[11px] font-mono text-white/40 mt-1">Efek gulir mulus seperti Webflow.</p>
                </div>
              </div>
              
              <button className={`w-10 h-5 rounded-none relative transition-colors duration-300 shrink-0 outline-none ${state.livePreviewTheme?.customTexts?.smooth_scroll === 'true' ? 'bg-[#ff9e00]' : 'bg-zinc-950 border border-white/10'}`}>
                <div className={`w-4 h-4 rounded-none absolute top-[2px] transition-transform duration-300 shadow-sm ${state.livePreviewTheme?.customTexts?.smooth_scroll === 'true' ? 'bg-black translate-x-[22px]' : 'bg-white/20 translate-x-[2px]'}`}></div>
              </button>
            </div>
          )}

        </div>
      </div>


    </>
  );
}
