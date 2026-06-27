"use client";

import React from 'react';
import { Play, MoveVertical, AlertTriangle, MousePointer2, ChevronDown, Check, Video } from 'lucide-react';
import { ColorPicker, FontPicker, CardStylePicker, ButtonShapePicker, GalleryLayoutPicker } from '@/components/editor-controls/SharedControls';
import type { ThemeEditorState, ThemeEditorActions } from '@/features/appearance';

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
      </div>

      <div className="w-full h-px bg-white/5 my-6"></div>

      {/* VIDEO SETTINGS SECTION (Conditional) */}
      {hasVideoShowcase && (
        <div className="mb-8">
          <div className="mb-3 px-0.5">
            <h3 className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Video Settings</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 relative z-20" ref={dropdownRef}>
              <label className="text-xs font-medium text-white/70 px-1">
                Selected Video
              </label>
              
              <div className="relative">
                <button
                  onClick={() => setIsVideoDropdownOpen(!isVideoDropdownOpen)}
                  className={`w-full bg-[#1b1b1f] border transition-all duration-300 text-left flex items-center justify-between p-2.5 rounded-md text-white/80 hover:bg-[#222226] hover:text-white
                    ${isVideoDropdownOpen ? 'border-white/20' : 'border-white/5'}`}
                >
                  <span className="text-xs font-medium truncate">
                    {livePreviewTheme?.customTexts?.showcase_video_id 
                      ? videoProjects.find((vp: any) => vp.id === livePreviewTheme.customTexts.showcase_video_id)?.title || 'Unknown Video'
                      : 'Choose a Video Project'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-300 ${isVideoDropdownOpen ? 'rotate-180 text-white' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isVideoDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-1.5 bg-[#1a1a1e] border border-white/10 rounded-md shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-1.5 duration-200">
                    <div className="max-h-56 overflow-y-auto custom-scrollbar">
                      <button
                        onClick={() => {
                          updateCustomText('showcase_video_id', '');
                          setIsVideoDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 text-xs transition-colors flex items-center justify-between group
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
                            className={`w-full text-left px-3 py-2.5 text-xs transition-colors flex items-center justify-between group border-t border-white/5
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
                <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1.5 bg-rose-500/10 p-2 rounded-md border border-rose-500/20">
                  <AlertTriangle className="w-3 h-3" /> No video projects found in your dashboard.
                </p>
              )}
            </div>

            <button 
              onClick={() => updateCustomText('showcase_autoplay', livePreviewTheme?.customTexts?.showcase_autoplay === 'true' ? 'false' : 'true')}
              className="w-full p-3 rounded-md border border-transparent hover:border-white/5 bg-transparent hover:bg-white/5 transition-all flex items-center justify-between group text-sm"
            >
              <span className="text-[13px] text-white/80 group-hover:text-white font-medium">Auto-Play Video</span>
              <div className={`w-8 h-4 shrink-0 rounded-full relative transition-colors duration-300 ${livePreviewTheme?.customTexts?.showcase_autoplay === 'true' ? 'bg-[#ff9e00]' : 'bg-white/10'}`}>
                <div className={`w-3 h-3 rounded-full absolute top-0.5 left-0.5 transition-transform duration-300 shadow-sm ${livePreviewTheme?.customTexts?.showcase_autoplay === 'true' ? 'bg-black translate-x-4' : 'bg-white/40 translate-x-0'}`}></div>
              </div>
            </button>
          </div>
          <div className="w-full h-px bg-white/5 my-6"></div>
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
              className="w-full p-3 rounded-md border border-transparent hover:border-white/5 bg-transparent hover:bg-white/5 transition-all flex items-center justify-between group text-sm"
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
              className="w-full p-3 rounded-md border border-transparent hover:border-white/5 bg-transparent hover:bg-white/5 transition-all flex items-center justify-between group text-sm"
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

            <button 
              onClick={() => updateCustomText('custom_cursor_enabled', livePreviewTheme?.customTexts?.custom_cursor_enabled === 'true' ? 'false' : 'true')}
              className="w-full p-3 rounded-md border border-transparent hover:border-white/5 bg-transparent hover:bg-white/5 transition-all flex items-center justify-between group text-sm"
            >
              <div className="flex items-center gap-2.5">
                <MousePointer2 className="w-4 h-4 text-white/40 group-hover:text-white/80" />
                <div className="flex flex-col items-start">
                  <span className="text-[13px] text-white/80 group-hover:text-white">Custom Cursor</span>
                  <span className="text-[10px] text-[#ff9e00]">Premium</span>
                </div>
              </div>
              <div className={`w-8 h-4 shrink-0 rounded-full relative transition-colors duration-300 ${livePreviewTheme?.customTexts?.custom_cursor_enabled === 'true' ? 'bg-[#ff9e00]' : 'bg-white/10'}`}>
                <div className={`w-3 h-3 rounded-full absolute top-0.5 left-0.5 transition-transform duration-300 ${livePreviewTheme?.customTexts?.custom_cursor_enabled === 'true' ? 'bg-black translate-x-4' : 'bg-white/40 translate-x-0'}`}></div>
              </div>
            </button>

            {livePreviewTheme?.customTexts?.custom_cursor_enabled === 'true' && (
              <div className="pl-9 pr-3 py-2 flex flex-col gap-2 bg-white/[0.02] rounded-lg mt-1 transition-all duration-300">
                <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Cursor Type</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateCustomText('custom_cursor_type', 'circle-dot')}
                    className={`py-2 px-2 border rounded text-[10.5px] font-mono flex items-center justify-center gap-1.5 transition-all ${
                      (livePreviewTheme?.customTexts?.custom_cursor_type || 'circle-dot') === 'circle-dot'
                        ? 'border-[#ff9e00] text-[#ff9e00] bg-[#ff9e00]/5'
                        : 'border-white/10 text-white/60 hover:border-white/20 hover:text-white bg-transparent'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full border border-current flex items-center justify-center">
                      <div className="w-0.5 h-0.5 rounded-full bg-current" />
                    </div>
                    Circle Dot
                  </button>
                  <button
                    onClick={() => updateCustomText('custom_cursor_type', 'solid-dot')}
                    className={`py-2 px-2 border rounded text-[10.5px] font-mono flex items-center justify-center gap-1.5 transition-all ${
                      livePreviewTheme?.customTexts?.custom_cursor_type === 'solid-dot'
                        ? 'border-[#ff9e00] text-[#ff9e00] bg-[#ff9e00]/5'
                        : 'border-white/10 text-white/60 hover:border-white/20 hover:text-white bg-transparent'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    Solid Dot
                  </button>
                  <button
                    onClick={() => updateCustomText('custom_cursor_type', 'neon-pointer')}
                    className={`py-2 px-2 border rounded text-[10.5px] font-mono flex items-center justify-center gap-1.5 transition-all ${
                      livePreviewTheme?.customTexts?.custom_cursor_type === 'neon-pointer'
                        ? 'border-[#ff0000] text-[#ff0000] bg-[#ff0000]/5 shadow-[0_0_8px_rgba(255,0,0,0.15)]'
                        : 'border-white/10 text-white/60 hover:border-white/20 hover:text-white bg-transparent'
                    }`}
                  >
                    <MousePointer2 className="w-2.5 h-2.5 text-current" />
                    Neon Red
                  </button>
                  <button
                    onClick={() => updateCustomText('custom_cursor_type', 'paper-plane')}
                    className={`py-2 px-2 border rounded text-[10.5px] font-mono flex items-center justify-center gap-1.5 transition-all ${
                      livePreviewTheme?.customTexts?.custom_cursor_type === 'paper-plane'
                        ? 'border-white text-white bg-white/10 shadow-[0_0_8px_rgba(255,255,255,0.1)]'
                        : 'border-white/10 text-white/60 hover:border-white/20 hover:text-white bg-transparent'
                    }`}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-current">
                      <path d="M2 2 L22 12 L12.5 13.5 L10 22 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      <path d="M2 2 L12.5 13.5" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Retro Plane
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
