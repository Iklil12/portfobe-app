"use client";
import React from 'react';
import MinimalistVideoShowcase from './themes/MinimalistVideoShowcase';
import CinematicVideoShowcase from './themes/CinematicVideoShowcase';
import BrutalistVideoShowcase from './themes/BrutalistVideoShowcase';
import BentogridVideoShowcase from './themes/BentogridVideoShowcase';
import SpatialVideoShowcase from './themes/SpatialVideoShowcase';
import AbsoluteNoirVideoShowcase from './themes/AbsoluteNoirVideoShowcase';
import EditorialVideoShowcase from './themes/EditorialVideoShowcase';
import AcidVideoShowcase from './themes/AcidVideoShowcase';
import SplitVideoShowcase from './themes/SplitVideoShowcase';
import MonolithVideoShowcase from './themes/MonolithVideoShowcase';
import LayeredMonolithVideoShowcase from './themes/LayeredMonolithVideoShowcase';
import ObsidianReelVideoShowcase from './themes/ObsidianReelVideoShowcase';
import MidnightEmulsionVideoShowcase from './themes/MidnightEmulsionVideoShowcase';
import CinematicGalleryVideoShowcase from './themes/CinematicGalleryVideoShowcase';
import ViewfinderVideoShowcase from './themes/ViewfinderVideoShowcase';
import AuraKineticVideoShowcase from './themes/AuraKineticVideoShowcase';
import HorizontalFlowVideoShowcase from './themes/HorizontalFlowVideoShowcase';
import KineticAvantGardeVideoShowcase from './themes/KineticAvantGardeVideoShowcase';
import NexusNoirVideoShowcase from './themes/NexusNoirVideoShowcase';

interface VideoShowcaseRendererProps {
  themeId: string;
  data: any;
  theme?: any;
  isEditor?: boolean;
  setSelectedMedia?: any;
}

export default function VideoShowcaseRenderer({ themeId, data, theme, isEditor, setSelectedMedia }: VideoShowcaseRendererProps) {
  // We map the 20 distinct themes to their 1:1 components
  switch (themeId) {
    case 'minimalist':
      return <MinimalistVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
    case 'layered-monolith':
      return <LayeredMonolithVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
    case 'editorial':
      return <EditorialVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
    case 'split-screen-studio':
    case 'split':
      return <SplitVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
    case 'cinematic':
      return <CinematicVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
    case 'obsidian-reel':
      return <ObsidianReelVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
    case 'midnight-emulsion':
      return <MidnightEmulsionVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
    case 'cinematic-gallery':
      return <CinematicGalleryVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
    case 'monolith':
      return <MonolithVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
    case 'bentogrid':
      return <BentogridVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
    case 'viewfinder':
      return <ViewfinderVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
    case 'spatial':
      return <SpatialVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
    case 'aura-kinetic':
      return <AuraKineticVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
    case 'horizontal-flow':
      return <HorizontalFlowVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
    case 'brutalism':
      return <BrutalistVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
    case 'acid-tech':
    case 'acid':
      return <AcidVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
    case 'kinetic-avant-garde':
      return <KineticAvantGardeVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
    case 'absolute-noir':
      return <AbsoluteNoirVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
    case 'nexus-noir':
      return <NexusNoirVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
      
    default: 
      return <MinimalistVideoShowcase data={data} theme={theme} isEditor={isEditor} />;
  }
}
