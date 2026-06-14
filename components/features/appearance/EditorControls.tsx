"use client";

import React from 'react';
import { Play, MoveVertical, AlertTriangle, MousePointer2 } from 'lucide-react';
import { ColorPicker, FontPicker, CardStylePicker, ButtonShapePicker, NavigationStylePicker } from '@/components/editor-controls/SharedControls';
import type { ThemeEditorState, ThemeEditorActions } from '@/hooks/useThemeEditor';

export function EditorControls({ state, actions }: { state: ThemeEditorState, actions: ThemeEditorActions }) {
  const {
    activeTheme, themeColor, fontHeading, fontBody, cardStyle, buttonShape,
    splashScreen, isLoading, livePreviewTheme
  } = state;

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
              <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${splashScreen ? 'bg-[#ff9e00]' : 'bg-white/10'}`}>
                <div className={`w-3 h-3 rounded-full absolute top-[2px] transition-transform duration-300 ${splashScreen ? 'bg-black translate-x-[18px]' : 'bg-white/40 translate-x-[2px]'}`}></div>
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
              <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${livePreviewTheme?.customTexts?.smooth_scroll === 'true' ? 'bg-[#ff9e00]' : 'bg-white/10'}`}>
                <div className={`w-3 h-3 rounded-full absolute top-[2px] transition-transform duration-300 ${livePreviewTheme?.customTexts?.smooth_scroll === 'true' ? 'bg-black translate-x-[18px]' : 'bg-white/40 translate-x-[2px]'}`}></div>
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
