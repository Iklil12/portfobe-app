"use client";
import React from 'react';
import MinimalistFaq from './themes/MinimalistFaq';
import CinematicFaq from './themes/CinematicFaq';
import BrutalismFaq from './themes/BrutalismFaq';
import BentogridFaq from './themes/BentogridFaq';
import SpatialFaq from './themes/SpatialFaq';
import KineticAvantGardeFaq from './themes/KineticAvantGardeFaq';
import AbsoluteNoirFaq from './themes/AbsoluteNoirFaq';
import ViewfinderFaq from './themes/ViewfinderFaq';
import EditorialFaq from './themes/EditorialFaq';
import AcidFaq from './themes/AcidFaq';
import ObsidianReelFaq from './themes/ObsidianReelFaq';
import MidnightEmulsionFaq from './themes/MidnightEmulsionFaq';
import NexusNoirFaq from './themes/NexusNoirFaq';
import AuraKineticFaq from './themes/AuraKineticFaq';
import SplitFaq from './themes/SplitFaq';
import MonolithFaq from './themes/MonolithFaq';
import LayeredMonolithFaq from './themes/LayeredMonolithFaq';
import CinematicGalleryFaq from './themes/CinematicGalleryFaq';
import HorizontalFlowFaq from './themes/HorizontalFlowFaq';

interface FaqRendererProps {
  themeId: string;
  data: any;
  theme?: any;
  isEditor?: boolean;
}

export default function FaqRenderer({ themeId, data, theme, isEditor }: FaqRendererProps) {
  // Absolute 1:1 Mapping for all 20 themes
  switch (themeId) {
    case 'minimalist': return <MinimalistFaq data={data} theme={theme} isEditor={isEditor} />;
    case 'cinematic': return <CinematicFaq data={data} theme={theme} isEditor={isEditor} />;
    case 'brutalism': return <BrutalismFaq data={data} theme={theme} isEditor={isEditor} />;
    case 'bentogrid': return <BentogridFaq data={data} theme={theme} isEditor={isEditor} />;
    case 'spatial': return <SpatialFaq data={data} theme={theme} isEditor={isEditor} />;
    case 'acid-tech': 
    case 'acid': return <AcidFaq data={data} theme={theme} isEditor={isEditor} />;
    case 'kinetic-avant-garde': return <KineticAvantGardeFaq data={data} theme={theme} isEditor={isEditor} />;
    case 'absolute-noir': return <AbsoluteNoirFaq data={data} theme={theme} isEditor={isEditor} />;
    case 'viewfinder': return <ViewfinderFaq data={data} theme={theme} isEditor={isEditor} />;
    case 'editorial': return <EditorialFaq data={data} theme={theme} isEditor={isEditor} />;
    case 'obsidian-reel': return <ObsidianReelFaq data={data} theme={theme} isEditor={isEditor} />;
    case 'midnight-emulsion': return <MidnightEmulsionFaq data={data} theme={theme} isEditor={isEditor} />;
    case 'nexus-noir': return <NexusNoirFaq data={data} theme={theme} isEditor={isEditor} />;
    case 'aura-kinetic': return <AuraKineticFaq data={data} theme={theme} isEditor={isEditor} />;
    case 'split': return <SplitFaq data={data} theme={theme} isEditor={isEditor} />;
    case 'monolith': return <MonolithFaq data={data} theme={theme} isEditor={isEditor} />;
    case 'layered-monolith': return <LayeredMonolithFaq data={data} theme={theme} isEditor={isEditor} />;
    case 'cinematic-gallery': return <CinematicGalleryFaq data={data} theme={theme} isEditor={isEditor} />;
    case 'horizontal-flow': return <HorizontalFlowFaq data={data} theme={theme} isEditor={isEditor} />;
    default: return <MinimalistFaq data={data} theme={theme} isEditor={isEditor} />;
  }
}
