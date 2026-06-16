"use client";

import React from 'react';
import { Play, MoveVertical, AlertTriangle, MousePointer2, ChevronDown, Check, Video } from 'lucide-react';
import { ColorPicker, FontPicker, CardStylePicker, ButtonShapePicker, NavigationStylePicker, GalleryLayoutPicker } from '@/components/editor-controls/SharedControls';
import type { ThemeEditorState, ThemeEditorActions } from '@/hooks/useThemeEditor';

export function EditorControls({ state, actions }: { state: ThemeEditorState, actions: ThemeEditorActions }) {
  const {
    activeTheme, themeColor, fontHeading, fontBody, cardStyle, buttonShape,
    splashScreen, isLoading, livePreviewTheme, pageBlocks, rawProjects
  } = state;

  const hasVideoShowcase = pageBlocks?.some((b: any) => b.blockType === 'VIDEO_SHOWCASE');
  const videoProjects = rawProjects?.filter((p: any) => p.projectType === 'video') || [];

  const [isVideoDropdownOpen, setIsVideoDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsVideoDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    setThemeColor, setFontHeading, setFontBody, setCardStyle, setButtonShape,
    setSplashScreen, updateCustomText
  } = actions;

  return (
    <>
      {/* STYLES SECTION */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[11px] font-semibold text-white/50 tracking-wider uppercase">Styles</h3>
        </div>

        {activeTheme === 'absolute-noir' && (
          <div className="p-3 mb-6 bg-white/5 rounded-lg flex items-start gap-2.5">
            <AlertTriangle className="text-white/40 mt-0.5 w-4 h-4 shrink-0" />
            <div>
              <h4 className="font-medium text-[11px] text-white mb-0.5">Strict Mode</h4>
              <p className="text-[10px] text-white/40 leading-relaxed">
                Design system is locked for Absolute Noir to maintain its aesthetic. Typography can still be customized.
              </p>
            </div>
          </div>
        )}

        {activeTheme !== 'absolute-noir' && (
          <ColorPicker themeColor={themeColor} setThemeColor={setThemeColor} />
        )}

        <FontPicker fontHeading={fontHeading} setFontHeading={setFontHeading} setFontBody={setFontBody} />

        {activeTheme !== 'absolute-noir' && (
          <>
            <CardStylePicker cardStyle={cardStyle} setCardStyle={setCardStyle} />
            <ButtonShapePicker buttonShape={buttonShape} setButtonShape={setButtonShape} />
          </>
        )}

        <NavigationStylePicker navStyle={livePreviewTheme?.customTexts?.nav_style} setNavStyle={(val: string) => updateCustomText('nav_style', val)} />
      </div>

      {/* VIDEO SETTINGS SECTION (Conditional) */}
      {hasVideoShowcase && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff9e00] shadow-[0_0_8px_rgba(255,158,0,0.8)] animate-pulse"></div>
              <h3 className="text-[11px] font-semibold text-[#ff9e00] tracking-wider uppercase">Video Settings</h3>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 p-3.5 bg-gradient-to-b from-white/[0.08] to-transparent rounded-xl border border-white/10 shadow-xl relative overflow-visible">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff9e00]/5 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="flex flex-col gap-2 relative z-20" ref={dropdownRef}>
              <label className="text-[10px] text-white/60 uppercase tracking-widest font-medium flex items-center gap-1.5">
                <Video className="w-3 h-3 text-[#ff9e00]/80" />
                Selected Video
              </label>
              
              <div className="relative">
                <button
                  onClick={() => setIsVideoDropdownOpen(!isVideoDropdownOpen)}
                  className={`w-full bg-black/50 border transition-all duration-300 text-left flex items-center justify-between p-3 rounded-lg backdrop-blur-md
                    ${isVideoDropdownOpen ? 'border-[#ff9e00] shadow-[0_0_15px_rgba(255,158,0,0.15)] text-white' : 'border-white/10 text-white/80 hover:border-white/30 hover:bg-black/80'}`}
                >
                  <span className="text-xs font-medium truncate">
                    {livePreviewTheme?.customTexts?.showcase_video_id 
                      ? videoProjects.find((vp: any) => vp.id === livePreviewTheme.customTexts.showcase_video_id)?.title || 'Unknown Video'
                      : 'Choose a Video Project'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-300 ${isVideoDropdownOpen ? 'rotate-180 text-[#ff9e00]' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isVideoDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-[#111111] border border-white/10 rounded-lg shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-56 overflow-y-auto custom-scrollbar">
                      <button
                        onClick={() => {
                          updateCustomText('showcase_video_id', '');
                          setIsVideoDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-3 text-xs transition-colors flex items-center justify-between group
                          ${!livePreviewTheme?.customTexts?.showcase_video_id ? 'bg-[#ff9e00]/10 text-[#ff9e00]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                      >
                        <span className="truncate italic">None (Hide Video)</span>
                        {!livePreviewTheme?.customTexts?.showcase_video_id && <Check className="w-3.5 h-3.5" />}
                      </button>
                      
                      {videoProjects.map((vp: any) => {
                        const isSelected = livePreviewTheme?.customTexts?.showcase_video_id === vp.id;
                        return (
                          <button
                            key={vp.id}
                            onClick={() => {
                              updateCustomText('showcase_video_id', vp.id);
                              setIsVideoDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-3 text-xs transition-colors flex items-center justify-between group border-t border-white/5
                              ${isSelected ? 'bg-[#ff9e00]/10 text-[#ff9e00]' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
                          >
                            <span className="truncate font-medium">{vp.title}</span>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {videoProjects.length === 0 && (
                <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1.5 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                  <AlertTriangle className="w-3 h-3" /> No video projects found in your dashboard.
                </p>
              )}
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-1"></div>

            <button 
              onClick={() => updateCustomText('showcase_autoplay', livePreviewTheme?.customTexts?.showcase_autoplay === 'true' ? 'false' : 'true')}
              className="w-full p-2.5 rounded-lg border border-white/5 bg-black/20 hover:border-white/10 hover:bg-black/40 transition-all flex items-center justify-between group text-sm relative z-10"
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md transition-colors ${livePreviewTheme?.customTexts?.showcase_autoplay === 'true' ? 'bg-[#ff9e00]/20 text-[#ff9e00]' : 'bg-white/5 text-white/40 group-hover:text-white/80'}`}>
                  <Play className={`w-3.5 h-3.5 ${livePreviewTheme?.customTexts?.showcase_autoplay === 'true' ? 'fill-current' : ''}`} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[12px] text-white/90 group-hover:text-white font-medium">Auto-Play Video</span>
                </div>
              </div>
              <div className={`w-8 h-4 shrink-0 rounded-full relative transition-colors duration-300 ${livePreviewTheme?.customTexts?.showcase_autoplay === 'true' ? 'bg-[#ff9e00]' : 'bg-white/10'}`}>
                <div className={`w-3 h-3 rounded-full absolute top-0.5 left-0.5 transition-transform duration-300 shadow-sm ${livePreviewTheme?.customTexts?.showcase_autoplay === 'true' ? 'bg-black translate-x-4' : 'bg-white/40 translate-x-0'}`}></div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* EFFECTS SECTION */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[11px] font-semibold text-white/50 tracking-wider uppercase">Effects</h3>
        </div>

        {!isLoading && (
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setSplashScreen(!splashScreen)}
              className="w-full p-3 rounded-lg border border-transparent hover:border-white/5 bg-transparent hover:bg-white/5 transition-all flex items-center justify-between group text-sm"
            >
              <div className="flex items-center gap-2.5">
                <Play className="w-4 h-4 text-white/40 group-hover:text-white/80" />
                <div className="flex flex-col items-start">
                  <span className="text-[13px] text-white/80 group-hover:text-white">Cinematic Intro</span>
                  <span className="text-[10px] text-[#ff9e00]">Premium</span>
                </div>
              </div>
              <div className={`w-8 h-4 shrink-0 rounded-full relative transition-colors duration-300 ${splashScreen ? 'bg-[#ff9e00]' : 'bg-white/10'}`}>
                <div className={`w-3 h-3 rounded-full absolute top-0.5 left-0.5 transition-transform duration-300 ${splashScreen ? 'bg-black translate-x-4' : 'bg-white/40 translate-x-0'}`}></div>
              </div>
            </button>

            <button 
              onClick={() => updateCustomText('smooth_scroll', livePreviewTheme?.customTexts?.smooth_scroll === 'true' ? 'false' : 'true')}
              className="w-full p-3 rounded-lg border border-transparent hover:border-white/5 bg-transparent hover:bg-white/5 transition-all flex items-center justify-between group text-sm"
            >
              <div className="flex items-center gap-2.5">
                <MoveVertical className="w-4 h-4 text-white/40 group-hover:text-white/80" />
                <div className="flex flex-col items-start">
                  <span className="text-[13px] text-white/80 group-hover:text-white">Smooth Scroll</span>
                  <span className="text-[10px] text-[#ff9e00]">Premium</span>
                </div>
              </div>
              <div className={`w-8 h-4 shrink-0 rounded-full relative transition-colors duration-300 ${livePreviewTheme?.customTexts?.smooth_scroll === 'true' ? 'bg-[#ff9e00]' : 'bg-white/10'}`}>
                <div className={`w-3 h-3 rounded-full absolute top-0.5 left-0.5 transition-transform duration-300 ${livePreviewTheme?.customTexts?.smooth_scroll === 'true' ? 'bg-black translate-x-4' : 'bg-white/40 translate-x-0'}`}></div>
              </div>
            </button>

            <div className="w-full p-3 rounded-lg border border-transparent bg-transparent flex items-center justify-between opacity-50 cursor-not-allowed text-sm">
              <div className="flex items-center gap-2.5">
                <MousePointer2 className="w-4 h-4 text-white/40" />
                <div className="flex flex-col items-start">
                  <span className="text-[13px] text-white/80">Custom Cursor</span>
                  <span className="text-[10px] text-white/40">Coming Soon</span>
                </div>
              </div>
              <div className="px-2 py-0.5 rounded text-[9px] font-medium bg-white/5 text-white/40 border border-white/5">
                SOON
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
