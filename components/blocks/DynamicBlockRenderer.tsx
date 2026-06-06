"use client";

import React, { useState } from 'react';
import Script from 'next/script';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';

// Minimalist Blocks
import { MinimalistSkillsBlock } from './minimalist/MinimalistSkillsBlock';
import { MinimalistExperienceBlock } from './minimalist/MinimalistExperienceBlock';
import { MinimalistHeroBlock } from './minimalist/MinimalistHeroBlock';
import { MinimalistMarqueeBlock } from './minimalist/MinimalistMarqueeBlock';
import { MinimalistAboutBlock } from './minimalist/MinimalistAboutBlock';
import { MinimalistServicesBlock } from './minimalist/MinimalistServicesBlock';
import { MinimalistStatsBlock } from './minimalist/MinimalistStatsBlock';
import { MinimalistProjectsBlock } from './minimalist/MinimalistProjectsBlock';
import { Minimalist3DBlock } from './minimalist/Minimalist3DBlock';
import { MinimalistAwardsBlock } from './minimalist/MinimalistAwardsBlock';
import { MinimalistTestimonialsBlock } from './minimalist/MinimalistTestimonialsBlock';
import { MinimalistFooterBlock } from './minimalist/MinimalistFooterBlock';

// Spatial Theme Blocks
import { SpatialShell } from './spatial/SpatialShell';
import { SpatialSkillsBlock } from './spatial/SpatialSkillsBlock';
import { SpatialExperienceBlock } from './spatial/SpatialExperienceBlock';
import { SpatialHeroBlock } from './spatial/SpatialHeroBlock';
import { SpatialMarqueeBlock } from './spatial/SpatialMarqueeBlock';
import { SpatialAboutBlock } from './spatial/SpatialAboutBlock';
import { SpatialServicesBlock } from './spatial/SpatialServicesBlock';
import { SpatialProjectsBlock } from './spatial/SpatialProjectsBlock';
import { Spatial3DBlock } from './spatial/Spatial3DBlock';
import { SpatialStatsBlock } from './spatial/SpatialStatsBlock';
import { SpatialGithubBlock } from './spatial/SpatialGithubBlock';
import { SpatialTestimonialsBlock } from './spatial/SpatialTestimonialsBlock';
import { SpatialAwardsBlock } from './spatial/SpatialAwardsBlock';
import { SpatialFooterBlock } from './spatial/SpatialFooterBlock';

// Shared Widgets
import { PenpotShowcase } from '@/components/themes/widgets/PenpotShowcase';
import { CanvaShowcase } from '@/components/themes/widgets/CanvaShowcase';
import { GithubStats } from '@/components/themes/widgets/GithubStats';

// Obsidian Reel Theme Blocks
import { ObsidianShell } from './obsidian/ObsidianShell';
import { ObsidianSkillsBlock } from './obsidian-reel/ObsidianSkillsBlock';
import { ObsidianExperienceBlock } from './obsidian-reel/ObsidianExperienceBlock';
import { ObsidianHeroBlock } from './obsidian/ObsidianHeroBlock';
import { ObsidianMarqueeBlock } from './obsidian/ObsidianMarqueeBlock';
import { ObsidianAboutBlock } from './obsidian/ObsidianAboutBlock';
import { ObsidianServicesBlock } from './obsidian/ObsidianServicesBlock';
import { ObsidianProjectsBlock } from './obsidian/ObsidianProjectsBlock';
import { Obsidian3DBlock } from './obsidian/Obsidian3DBlock';
import { ObsidianStatsBlock } from './obsidian/ObsidianStatsBlock';
import { ObsidianAwardsBlock } from './obsidian/ObsidianAwardsBlock';
import { ObsidianTestimonialsBlock } from './obsidian/ObsidianTestimonialsBlock';
import { ObsidianFooterBlock } from './obsidian/ObsidianFooterBlock';
// Aura Kinetic Theme Blocks
import { AuraKineticShell } from './aura-kinetic/AuraKineticShell';
import { AuraKineticSkillsBlock } from './aura-kinetic/AuraKineticSkillsBlock';
import { AuraKineticExperienceBlock } from './aura-kinetic/AuraKineticExperienceBlock';
import { AuraKineticHeroBlock } from './aura-kinetic/AuraKineticHeroBlock';
import { AuraKineticMarqueeBlock } from './aura-kinetic/AuraKineticMarqueeBlock';
import { AuraKineticAboutBlock } from './aura-kinetic/AuraKineticAboutBlock';
import { AuraKineticServicesBlock } from './aura-kinetic/AuraKineticServicesBlock';
import { AuraKineticProjectsBlock } from './aura-kinetic/AuraKineticProjectsBlock';
import { AuraKineticStatsBlock } from './aura-kinetic/AuraKineticStatsBlock';
import { AuraKinetic3DBlock } from './aura-kinetic/AuraKinetic3DBlock';
import { AuraKineticAwardsBlock } from './aura-kinetic/AuraKineticAwardsBlock';
import { AuraKineticTestimonialsBlock } from './aura-kinetic/AuraKineticTestimonialsBlock';
import { AuraKineticFooterBlock } from './aura-kinetic/AuraKineticFooterBlock';

// Editorial Theme Blocks
import { EditorialShell } from './editorial/EditorialShell';
import { EditorialSkillsBlock } from './editorial/EditorialSkillsBlock';
import { EditorialExperienceBlock } from './editorial/EditorialExperienceBlock';
import { EditorialHeroBlock } from './editorial/EditorialHeroBlock';
import { EditorialMarqueeBlock } from './editorial/EditorialMarqueeBlock';
import { EditorialAboutBlock } from './editorial/EditorialAboutBlock';
import { EditorialServicesBlock } from './editorial/EditorialServicesBlock';
import { EditorialProjectsBlock } from './editorial/EditorialProjectsBlock';
import { EditorialStatsBlock } from './editorial/EditorialStatsBlock';
import { Editorial3DBlock } from './editorial/Editorial3DBlock';
import { EditorialAwardsBlock } from './editorial/EditorialAwardsBlock';
import { EditorialTestimonialsBlock } from './editorial/EditorialTestimonialsBlock';
import { EditorialFooterBlock } from './editorial/EditorialFooterBlock';
// Midnight Emulsion Theme Blocks
import { MidnightEmulsionShell } from './midnight-emulsion/MidnightEmulsionShell';
import { MidnightEmulsionSkillsBlock } from './midnight-emulsion/MidnightEmulsionSkillsBlock';
import { MidnightEmulsionExperienceBlock } from './midnight-emulsion/MidnightEmulsionExperienceBlock';
import { MidnightEmulsionHeroBlock } from './midnight-emulsion/MidnightEmulsionHeroBlock';
import { MidnightEmulsionMarqueeBlock } from './midnight-emulsion/MidnightEmulsionMarqueeBlock';
import { MidnightEmulsionAboutBlock } from './midnight-emulsion/MidnightEmulsionAboutBlock';
import { MidnightEmulsionServicesBlock } from './midnight-emulsion/MidnightEmulsionServicesBlock';
import { MidnightEmulsionProjectsBlock } from './midnight-emulsion/MidnightEmulsionProjectsBlock';
import { MidnightEmulsionStatsBlock } from './midnight-emulsion/MidnightEmulsionStatsBlock';
import { MidnightEmulsion3DBlock } from './midnight-emulsion/MidnightEmulsion3DBlock';
import { MidnightEmulsionAwardsBlock } from './midnight-emulsion/MidnightEmulsionAwardsBlock';
import { MidnightEmulsionTestimonialsBlock } from './midnight-emulsion/MidnightEmulsionTestimonialsBlock';
import { MidnightEmulsionFooterBlock } from './midnight-emulsion/MidnightEmulsionFooterBlock';

// Viewfinder Theme Blocks
import { ViewfinderShell } from './viewfinder/ViewfinderShell';
import { ViewfinderSkillsBlock } from './viewfinder/ViewfinderSkillsBlock';
import { ViewfinderExperienceBlock } from './viewfinder/ViewfinderExperienceBlock';
import { ViewfinderHeroBlock } from './viewfinder/ViewfinderHeroBlock';
import { ViewfinderMarqueeBlock } from './viewfinder/ViewfinderMarqueeBlock';
import { ViewfinderAboutBlock } from './viewfinder/ViewfinderAboutBlock';
import { ViewfinderServicesBlock } from './viewfinder/ViewfinderServicesBlock';
import { ViewfinderProjectsBlock } from './viewfinder/ViewfinderProjectsBlock';
import { ViewfinderStatsBlock } from './viewfinder/ViewfinderStatsBlock';
import { Viewfinder3DBlock } from './viewfinder/Viewfinder3DBlock';
import { ViewfinderAwardsBlock } from './viewfinder/ViewfinderAwardsBlock';
import { ViewfinderTestimonialsBlock } from './viewfinder/ViewfinderTestimonialsBlock';
import { ViewfinderFooterBlock } from './viewfinder/ViewfinderFooterBlock';

// Nexus Split Theme Blocks
import { NexusSplitShell } from './nexus-split/NexusSplitShell';
import { NexusSplitSkillsBlock } from './nexus-split/NexusSplitSkillsBlock';
import { NexusSplitExperienceBlock } from './nexus-split/NexusSplitExperienceBlock';
import { NexusSplitHeroBlock } from './nexus-split/NexusSplitHeroBlock';
import { NexusSplitMarqueeBlock } from './nexus-split/NexusSplitMarqueeBlock';
import { NexusSplitAboutBlock } from './nexus-split/NexusSplitAboutBlock';
import { NexusSplitServicesBlock } from './nexus-split/NexusSplitServicesBlock';
import { NexusSplitStatsBlock } from './nexus-split/NexusSplitStatsBlock';
import { NexusSplitProjectsBlock } from './nexus-split/NexusSplitProjectsBlock';
import { NexusSplit3DBlock } from './nexus-split/NexusSplit3DBlock';
import { NexusSplitTestimonialsBlock } from './nexus-split/NexusSplitTestimonialsBlock';
import { NexusSplitAwardsBlock } from './nexus-split/NexusSplitAwardsBlock';
import { NexusSplitFooterBlock } from './nexus-split/NexusSplitFooterBlock';

// Monolith Vanguard Theme Blocks
import { MonolithShell } from './monolith/MonolithShell';
import { MonolithSkillsBlock } from './monolith/MonolithSkillsBlock';
import { MonolithExperienceBlock } from './monolith/MonolithExperienceBlock';
import { MonolithHeroBlock } from './monolith/MonolithHeroBlock';
import { MonolithMarqueeBlock } from './monolith/MonolithMarqueeBlock';
import { MonolithAboutBlock } from './monolith/MonolithAboutBlock';
import { MonolithServicesBlock } from './monolith/MonolithServicesBlock';
import { MonolithStatsBlock } from './monolith/MonolithStatsBlock';
import { MonolithProjectsBlock } from './monolith/MonolithProjectsBlock';
import { Monolith3DBlock } from './monolith/Monolith3DBlock';
import { MonolithTestimonialsBlock } from './monolith/MonolithTestimonialsBlock';
import { MonolithAwardsBlock } from './monolith/MonolithAwardsBlock';
import { MonolithFooterBlock } from './monolith/MonolithFooterBlock';

// Absolute Noir Theme Blocks
import { AbsoluteNoirShell } from './absolute-noir/AbsoluteNoirShell';
import { AbsoluteNoirSkillsBlock } from './absolute-noir/AbsoluteNoirSkillsBlock';
import { AbsoluteNoirExperienceBlock } from './absolute-noir/AbsoluteNoirExperienceBlock';
import { AbsoluteNoirHeroBlock } from './absolute-noir/AbsoluteNoirHeroBlock';
import { AbsoluteNoirMarqueeBlock } from './absolute-noir/AbsoluteNoirMarqueeBlock';
import { AbsoluteNoirAboutBlock } from './absolute-noir/AbsoluteNoirAboutBlock';
import { AbsoluteNoirServicesBlock } from './absolute-noir/AbsoluteNoirServicesBlock';
import { AbsoluteNoirStatsBlock } from './absolute-noir/AbsoluteNoirStatsBlock';
import { AbsoluteNoirProjectsBlock } from './absolute-noir/AbsoluteNoirProjectsBlock';
import { AbsoluteNoir3DBlock } from './absolute-noir/AbsoluteNoir3DBlock';
import { AbsoluteNoirAwardsBlock } from './absolute-noir/AbsoluteNoirAwardsBlock';
import { AbsoluteNoirTestimonialsBlock } from './absolute-noir/AbsoluteNoirTestimonialsBlock';
import { AbsoluteNoirFooterBlock } from './absolute-noir/AbsoluteNoirFooterBlock';

// Layered Monolith Theme Blocks
import { LayeredMonolithShell } from './layered-monolith/LayeredMonolithShell';
import { LayeredMonolithSkillsBlock } from './layered-monolith/LayeredMonolithSkillsBlock';
import { LayeredMonolithExperienceBlock } from './layered-monolith/LayeredMonolithExperienceBlock';
import { LayeredMonolithHeroBlock } from './layered-monolith/LayeredMonolithHeroBlock';
import { LayeredMonolithMarqueeBlock } from './layered-monolith/LayeredMonolithMarqueeBlock';
import { LayeredMonolithEthosBlock } from './layered-monolith/LayeredMonolithEthosBlock';
import { LayeredMonolithWorksBlock } from './layered-monolith/LayeredMonolithWorksBlock';
import { LayeredMonolith3DBlock } from './layered-monolith/LayeredMonolith3DBlock';
import { LayeredMonolithExpertiseBlock } from './layered-monolith/LayeredMonolithExpertiseBlock';
import { LayeredMonolithWidgetsBlock } from './layered-monolith/LayeredMonolithWidgetsBlock';
import { LayeredMonolithAwardsBlock } from './layered-monolith/LayeredMonolithAwardsBlock';
import { LayeredMonolithTestimonialBlock } from './layered-monolith/LayeredMonolithTestimonialBlock';
import { LayeredMonolithFooterBlock } from './layered-monolith/LayeredMonolithFooterBlock';

// Cinematic Theme Blocks
import { CinematicShell } from './cinematic/CinematicShell';
import { CinematicSkillsBlock } from './cinematic/CinematicSkillsBlock';
import { CinematicExperienceBlock } from './cinematic/CinematicExperienceBlock';
import { CinematicHeroBlock } from './cinematic/CinematicHeroBlock';
import { CinematicMarqueeBlock } from './cinematic/CinematicMarqueeBlock';
import { CinematicAboutBlock } from './cinematic/CinematicAboutBlock';
import { CinematicServicesBlock } from './cinematic/CinematicServicesBlock';

// Cinematic Gallery Theme Blocks
import { CinematicGalleryShell } from './cinematic-gallery/CinematicGalleryShell';
import { CinematicGallerySkillsBlock } from './cinematic-gallery/CinematicGallerySkillsBlock';
import { CinematicGalleryExperienceBlock } from './cinematic-gallery/CinematicGalleryExperienceBlock';
import { CinematicGalleryHeroBlock } from './cinematic-gallery/CinematicGalleryHeroBlock';
import { CinematicGalleryAboutBlock } from './cinematic-gallery/CinematicGalleryAboutBlock';
import { CinematicGalleryServicesBlock } from './cinematic-gallery/CinematicGalleryServicesBlock';
import { CinematicGalleryProjectsBlock } from './cinematic-gallery/CinematicGalleryProjectsBlock';
import { CinematicGallery3DBlock } from './cinematic-gallery/CinematicGallery3DBlock';
import { CinematicGalleryTestimonialsBlock } from './cinematic-gallery/CinematicGalleryTestimonialsBlock';
import { CinematicGalleryAwardsBlock } from './cinematic-gallery/CinematicGalleryAwardsBlock';
import { CinematicGalleryFooterBlock } from './cinematic-gallery/CinematicGalleryFooterBlock';
import { CinematicStatsBlock } from './cinematic/CinematicStatsBlock';
import { CinematicProjectsBlock } from './cinematic/CinematicProjectsBlock';
import { Cinematic3DBlock } from './cinematic/Cinematic3DBlock';
import { CinematicAwardsBlock } from './cinematic/CinematicAwardsBlock';
import { CinematicTestimonialsBlock } from './cinematic/CinematicTestimonialsBlock';
import { CinematicFooterBlock } from './cinematic/CinematicFooterBlock';

// Acid Tech Theme Blocks
import { AcidTechShell } from './acid-tech/AcidTechShell';
import { AcidTechSkillsBlock } from './acid-tech/AcidTechSkillsBlock';
import { AcidTechExperienceBlock } from './acid-tech/AcidTechExperienceBlock';
import { AcidTechHeroBlock } from './acid-tech/AcidTechHeroBlock';
import { AcidTechMarqueeBlock } from './acid-tech/AcidTechMarqueeBlock';
import { AcidTechAboutBlock } from './acid-tech/AcidTechAboutBlock';
import { AcidTechServicesBlock } from './acid-tech/AcidTechServicesBlock';
import { AcidTechProjectsBlock } from './acid-tech/AcidTechProjectsBlock';
import { AcidTech3DBlock } from './acid-tech/AcidTech3DBlock';
import { AcidTechStatsBlock } from './acid-tech/AcidTechStatsBlock';
import { AcidTechAwardsBlock } from './acid-tech/AcidTechAwardsBlock';
import { AcidTechTestimonialsBlock } from './acid-tech/AcidTechTestimonialsBlock';
import { AcidTechFooterBlock } from './acid-tech/AcidTechFooterBlock';

// Bento Grid Theme Blocks
import { BentoGridShell } from './bentogrid/BentoGridShell';
import { BentoGridSkillsBlock } from './bentogrid/BentoGridSkillsBlock';
import { BentoGridExperienceBlock } from './bentogrid/BentoGridExperienceBlock';
import { BentoGridHeroBlock } from './bentogrid/BentoGridHeroBlock';
import { BentoGridMarqueeBlock } from './bentogrid/BentoGridMarqueeBlock';
import { BentoGridProjectsBlock } from './bentogrid/BentoGridProjectsBlock';
import { BentoGrid3DBlock } from './bentogrid/BentoGrid3DBlock';
import { BentoGridAwardsBlock } from './bentogrid/BentoGridAwardsBlock';
import { BentoGridTestimonialsBlock } from './bentogrid/BentoGridTestimonialsBlock';
import { BentoGridFooterBlock } from './bentogrid/BentoGridFooterBlock';
import { BentoGridAboutBlock } from './bentogrid/BentoGridAboutBlock';
import { BentoGridServicesBlock } from './bentogrid/BentoGridServicesBlock';
import { BentoGridStatsBlock } from './bentogrid/BentoGridStatsBlock';

// Brutalism Theme Blocks
import { BrutalismShell } from './brutalism/BrutalismShell';
import { BrutalismSkillsBlock } from './brutalism/BrutalismSkillsBlock';
import { BrutalismExperienceBlock } from './brutalism/BrutalismExperienceBlock';
import { BrutalismHeroBlock } from './brutalism/BrutalismHeroBlock';
import { BrutalismStatsBlock } from './brutalism/BrutalismStatsBlock';
import { BrutalismProjectsBlock } from './brutalism/BrutalismProjectsBlock';
import { Brutalism3DBlock } from './brutalism/Brutalism3DBlock';
import { BrutalismAwardsBlock } from './brutalism/BrutalismAwardsBlock';
import { BrutalismTestimonialsBlock } from './brutalism/BrutalismTestimonialsBlock';
import { BrutalismFooterBlock } from './brutalism/BrutalismFooterBlock';
import { BrutalismAboutBlock } from './brutalism/BrutalismAboutBlock';
import { BrutalismServicesBlock } from './brutalism/BrutalismServicesBlock';
import { BrutalismMarqueeBlock } from './brutalism/BrutalismMarqueeBlock';

// Kinetic Avant Garde Theme Blocks
import { KineticAvantGardeShell } from './kinetic-avant-garde/KineticAvantGardeShell';
import { KineticAvantGardeHeroBlock } from './kinetic-avant-garde/KineticAvantGardeHeroBlock';
import { KineticAvantGardeMarqueeBlock } from './kinetic-avant-garde/KineticAvantGardeMarqueeBlock';
import { KineticAvantGardeAboutBlock } from './kinetic-avant-garde/KineticAvantGardeAboutBlock';
import { KineticAvantGardeServicesBlock } from './kinetic-avant-garde/KineticAvantGardeServicesBlock';
import { KineticAvantGardeSkillsBlock } from './kinetic-avant-garde/KineticAvantGardeSkillsBlock';
import { KineticAvantGardeProjectsBlock } from './kinetic-avant-garde/KineticAvantGardeProjectsBlock';
import { KineticAvantGarde3DBlock } from './kinetic-avant-garde/KineticAvantGarde3DBlock';
import { KineticAvantGardeStatsBlock } from './kinetic-avant-garde/KineticAvantGardeStatsBlock';
import { KineticAvantGardeExperienceBlock } from './kinetic-avant-garde/KineticAvantGardeExperienceBlock';
import { KineticAvantGardeAwardsBlock } from './kinetic-avant-garde/KineticAvantGardeAwardsBlock';
import { KineticAvantGardeTestimonialsBlock } from './kinetic-avant-garde/KineticAvantGardeTestimonialsBlock';
import { KineticAvantGardeFooterBlock } from './kinetic-avant-garde/KineticAvantGardeFooterBlock';

// Nexus Noir Theme Blocks
import { NexusNoirShell } from './nexus-noir/NexusNoirShell';
import { NexusNoirHeroBlock } from './nexus-noir/NexusNoirHeroBlock';
import { NexusNoirMarqueeBlock } from './nexus-noir/NexusNoirMarqueeBlock';
import { NexusNoirAboutBlock } from './nexus-noir/NexusNoirAboutBlock';
import { NexusNoirSkillsBlock } from './nexus-noir/NexusNoirSkillsBlock';
import { NexusNoirExperienceBlock } from './nexus-noir/NexusNoirExperienceBlock';
import { NexusNoirServicesBlock } from './nexus-noir/NexusNoirServicesBlock';
import { NexusNoirStatsBlock } from './nexus-noir/NexusNoirStatsBlock';
import { NexusNoirProjectsBlock } from './nexus-noir/NexusNoirProjectsBlock';
import { NexusNoir3DBlock } from './nexus-noir/NexusNoir3DBlock';
import { NexusNoirAwardsBlock } from './nexus-noir/NexusNoirAwardsBlock';
import { NexusNoirTestimonialsBlock } from './nexus-noir/NexusNoirTestimonialsBlock';
import { NexusNoirFooterBlock } from './nexus-noir/NexusNoirFooterBlock';

// ====================
// HORIZONTAL FLOW BLOCKS
// ====================
import { HorizontalFlowShell } from './horizontal-flow/HorizontalFlowShell';
import { HorizontalFlowHeroBlock } from './horizontal-flow/HorizontalFlowHeroBlock';
import { HorizontalFlowMarqueeBlock } from './horizontal-flow/HorizontalFlowMarqueeBlock';
import { HorizontalFlowAboutBlock } from './horizontal-flow/HorizontalFlowAboutBlock';
import { HorizontalFlowStatsBlock } from './horizontal-flow/HorizontalFlowStatsBlock';
import { HorizontalFlowProjectsBlock } from './horizontal-flow/HorizontalFlowProjectsBlock';
import { HorizontalFlow3DBlock } from './horizontal-flow/HorizontalFlow3DBlock';
import { HorizontalFlowServicesBlock } from './horizontal-flow/HorizontalFlowServicesBlock';
import { HorizontalFlowSkillsBlock } from './horizontal-flow/HorizontalFlowSkillsBlock';
import { HorizontalFlowExperienceBlock } from './horizontal-flow/HorizontalFlowExperienceBlock';
import { HorizontalFlowTestimonialsBlock } from './horizontal-flow/HorizontalFlowTestimonialsBlock';
import { HorizontalFlowAwardsBlock } from './horizontal-flow/HorizontalFlowAwardsBlock';
import { HorizontalFlowFooterBlock } from './horizontal-flow/HorizontalFlowFooterBlock';

// Split Screen Studio Theme Blocks
import { SplitScreenStudioShell } from './split-screen-studio/SplitScreenStudioShell';
import { SplitScreenStudioHeroBlock } from './split-screen-studio/SplitScreenStudioHeroBlock';
import { SplitScreenStudioMarqueeBlock } from './split-screen-studio/SplitScreenStudioMarqueeBlock';
import { SplitScreenStudioAboutBlock } from './split-screen-studio/SplitScreenStudioAboutBlock';
import { SplitScreenStudioServicesBlock } from './split-screen-studio/SplitScreenStudioServicesBlock';
import { SplitScreenStudioStatsBlock } from './split-screen-studio/SplitScreenStudioStatsBlock';
import { SplitScreenStudioProjectsBlock } from './split-screen-studio/SplitScreenStudioProjectsBlock';
import { SplitScreenStudio3DBlock } from './split-screen-studio/SplitScreenStudio3DBlock';
import { SplitScreenStudioAwardsBlock } from './split-screen-studio/SplitScreenStudioAwardsBlock';
import { SplitScreenStudioTestimonialsBlock } from './split-screen-studio/SplitScreenStudioTestimonialsBlock';
import { SplitScreenStudioSkillsBlock } from './split-screen-studio/SplitScreenStudioSkillsBlock';
import { SplitScreenStudioExperienceBlock } from './split-screen-studio/SplitScreenStudioExperienceBlock';
import { SplitScreenStudioFooterBlock } from './split-screen-studio/SplitScreenStudioFooterBlock';

import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { BlockEditorWrapper } from '@/components/features/appearance/BlockEditorWrapper';

export const BlockMapper = ({ block, data, theme, isEditor, setSelectedMedia }: any) => {
  const commonProps = { data, theme, isEditor, blockConfig: block, setSelectedMedia };
  const userId = data?.userId || data?.user?.id || data?.id || "";
  const themeColor = theme?.themeColor;

  if (!block.isVisible && !isEditor) return null;

  let content: React.ReactNode | undefined = undefined;
  const activeThemeTemplate = theme?.themeTemplate || theme?.id || 'minimalist';

  // Ambil tipe dasar blok, contoh: 'SPATIAL_HERO' -> 'HERO'
  const baseParts = block.blockType.split('_');
  const baseBlockType = baseParts.length > 1 ? baseParts.slice(1).join('_') : block.blockType;

  // HARD IGNORE LEGACY BLOCKS
  if (baseBlockType === 'INTEGRATIONS') {
    return null;
  }

  // 1. SMART MAPPING: Render blok sesuai dengan tema yang sedang aktif
  if (activeThemeTemplate === 'minimalist') {
    switch (baseBlockType) {
            case 'SKILLS': content = <MinimalistSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <MinimalistExperienceBlock {...commonProps} />; break;
      case 'HERO': content = <MinimalistHeroBlock {...commonProps} />; break;
      case 'MARQUEE': content = <MinimalistMarqueeBlock {...commonProps} />; break;
      case 'ABOUT': content = <MinimalistAboutBlock {...commonProps} />; break;
      case 'SERVICES': content = <MinimalistServicesBlock {...commonProps} />; break;
      case 'STATS': content = <MinimalistStatsBlock {...commonProps} />; break;
      case 'PROJECTS': content = <MinimalistProjectsBlock {...commonProps} />; break;
      case '3D': content = <Minimalist3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <MinimalistAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <MinimalistTestimonialsBlock {...commonProps} />; break;
      case 'FOOTER': content = <MinimalistFooterBlock {...commonProps} />; break;
      case 'PENPOT': content = <PenpotShowcase userId={userId} variant="minimalist" themeColor={themeColor} />; break;
      case 'CANVA': content = <CanvaShowcase userId={userId} variant="minimalist" themeColor={themeColor} />; break;
      case 'GITHUB': content = <GithubStats userId={userId} variant="minimalist" themeColor={themeColor} />; break;
    }
  } else if (activeThemeTemplate === 'spatial') {
    switch (baseBlockType) {
            case 'SKILLS': content = <SpatialSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <SpatialExperienceBlock {...commonProps} />; break;
      case 'HERO': content = <SpatialHeroBlock {...commonProps} />; break;
      case 'MARQUEE': content = <SpatialMarqueeBlock {...commonProps} />; break;
      case 'ABOUT': content = <SpatialAboutBlock {...commonProps} />; break;
      case 'SERVICES': content = <SpatialServicesBlock {...commonProps} />; break;
      case 'STATS': content = <SpatialStatsBlock {...commonProps} />; break;
      case 'PROJECTS': content = <SpatialProjectsBlock {...commonProps} />; break;
      case '3D': content = <Spatial3DBlock {...commonProps} />; break;
      case 'PENPOT': content = <PenpotShowcase userId={userId} variant="spatial" />; break;
      case 'CANVA': content = <CanvaShowcase userId={userId} variant="spatial" />; break;
      case 'GITHUB': content = <SpatialGithubBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <SpatialTestimonialsBlock {...commonProps} />; break;
      case 'AWARDS': content = <SpatialAwardsBlock {...commonProps} />; break;
      case 'FOOTER': content = <SpatialFooterBlock {...commonProps} />; break;
    }
  } else if (activeThemeTemplate === 'obsidian-reel') {
    switch (baseBlockType) {
            case 'SKILLS': content = <ObsidianSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <ObsidianExperienceBlock {...commonProps} />; break;
      case 'HERO': content = <ObsidianHeroBlock {...commonProps} />; break;
      case 'MARQUEE': content = <ObsidianMarqueeBlock {...commonProps} />; break;
      case 'ABOUT': content = <ObsidianAboutBlock {...commonProps} />; break;
      case 'SERVICES': content = <ObsidianServicesBlock {...commonProps} />; break;
      case 'PROJECTS': content = <ObsidianProjectsBlock {...commonProps} />; break;
      case 'STATS': content = <ObsidianStatsBlock {...commonProps} />; break;
      case '3D': content = <Obsidian3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <ObsidianAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <ObsidianTestimonialsBlock {...commonProps} />; break;
      case 'FOOTER': content = <ObsidianFooterBlock {...commonProps} />; break;
      case 'PENPOT': content = data?.id || data?.userId ? <PenpotShowcase userId={userId} variant="cinematic" themeColor={themeColor} /> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <CanvaShowcase userId={userId} variant="cinematic" themeColor={themeColor} /> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <GithubStats userId={userId} variant="cinematic" themeColor={themeColor} /> : null; break;
    }
  } else if (activeThemeTemplate === 'aura-kinetic') {
    switch (baseBlockType) {
            case 'SKILLS': content = <AuraKineticSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <AuraKineticExperienceBlock {...commonProps} />; break;
      case 'HERO': content = <AuraKineticHeroBlock {...commonProps} />; break;
      case 'MARQUEE': content = <AuraKineticMarqueeBlock {...commonProps} />; break;
      case 'ABOUT': content = <AuraKineticAboutBlock {...commonProps} />; break;
      case 'SERVICES': content = <AuraKineticServicesBlock {...commonProps} />; break;
      case 'PROJECTS': content = <AuraKineticProjectsBlock {...commonProps} />; break;
      case 'STATS': content = <AuraKineticStatsBlock {...commonProps} />; break;
      case '3D': content = <AuraKinetic3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <AuraKineticAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <AuraKineticTestimonialsBlock {...commonProps} />; break;
      case 'FOOTER': content = <AuraKineticFooterBlock {...commonProps} />; break;
      case 'PENPOT': content = data?.id || data?.userId ? <PenpotShowcase userId={userId} variant="aura" themeColor={themeColor} /> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <CanvaShowcase userId={userId} variant="aura" themeColor={themeColor} /> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <GithubStats userId={userId} variant="aura" themeColor={themeColor} /> : null; break;
    }
  } else if (activeThemeTemplate === 'editorial') {
    switch (baseBlockType) {
            case 'SKILLS': content = <EditorialSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <EditorialExperienceBlock {...commonProps} />; break;
      case 'HERO': content = <EditorialHeroBlock {...commonProps} />; break;
      case 'MARQUEE': content = <EditorialMarqueeBlock {...commonProps} />; break;
      case 'ABOUT': content = <EditorialAboutBlock {...commonProps} />; break;
      case 'SERVICES': content = <EditorialServicesBlock {...commonProps} />; break;
      case 'PROJECTS': content = <EditorialProjectsBlock {...commonProps} />; break;
      case 'STATS': content = <EditorialStatsBlock {...commonProps} />; break;
      case '3D': content = <Editorial3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <EditorialAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <EditorialTestimonialsBlock {...commonProps} />; break;
      case 'FOOTER': content = <EditorialFooterBlock {...commonProps} />; break;
      case 'PENPOT': content = data?.id || data?.userId ? <PenpotShowcase userId={userId} variant="editorial" themeColor={themeColor} /> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <CanvaShowcase userId={userId} variant="editorial" themeColor={themeColor} /> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <GithubStats userId={userId} variant="editorial" themeColor={themeColor} /> : null; break;
    }
  } else if (activeThemeTemplate === 'nexus-noir') {
    switch (baseBlockType) {
      case 'HERO': content = <NexusNoirHeroBlock {...commonProps} />; break;
      case 'MARQUEE': content = <NexusNoirMarqueeBlock />; break;
      case 'ABOUT': content = <NexusNoirAboutBlock {...commonProps} />; break;
      case 'SKILLS': content = <NexusNoirSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <NexusNoirExperienceBlock {...commonProps} />; break;
      case 'SERVICES': content = <NexusNoirServicesBlock {...commonProps} />; break;
      case 'STATS': content = <NexusNoirStatsBlock {...commonProps} />; break;
      case 'PROJECTS': content = <NexusNoirProjectsBlock {...commonProps} />; break;
      case '3D': content = <NexusNoir3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <NexusNoirAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <NexusNoirTestimonialsBlock {...commonProps} />; break;
      case 'FOOTER': content = <NexusNoirFooterBlock {...commonProps} />; break;
    }
  } else if (activeThemeTemplate === 'horizontal-flow') {
    switch (baseBlockType) {
      case 'HERO': content = <HorizontalFlowHeroBlock {...commonProps} />; break;
      case 'MARQUEE': content = <HorizontalFlowMarqueeBlock {...commonProps} />; break;
      case 'ABOUT': content = <HorizontalFlowAboutBlock {...commonProps} />; break;
      case 'STATS': content = <HorizontalFlowStatsBlock {...commonProps} />; break;
      case 'PROJECTS': content = <HorizontalFlowProjectsBlock {...commonProps} />; break;
      case '3D': content = <HorizontalFlow3DBlock {...commonProps} />; break;
      case 'SERVICES': content = <HorizontalFlowServicesBlock {...commonProps} />; break;
      case 'SKILLS': content = <HorizontalFlowSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <HorizontalFlowExperienceBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <HorizontalFlowTestimonialsBlock {...commonProps} />; break;
      case 'AWARDS': content = <HorizontalFlowAwardsBlock {...commonProps} />; break;
      case 'FOOTER': content = <HorizontalFlowFooterBlock {...commonProps} />; break;
      case 'PENPOT': content = data?.id || data?.userId ? <div className="border-t border-white/10 py-10 px-6"><PenpotShowcase userId={userId} variant="horizontal-flow" /></div> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <div className="border-t border-white/10 py-10 px-6"><CanvaShowcase userId={userId} variant="horizontal-flow" /></div> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <div className="border-t border-white/10 py-10 px-6"><GithubStats userId={userId} variant="horizontal-flow" /></div> : null; break;
    }
  } else if (activeThemeTemplate === 'midnight-emulsion') {
    switch (baseBlockType) {
            case 'SKILLS': content = <MidnightEmulsionSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <MidnightEmulsionExperienceBlock {...commonProps} />; break;
      case 'HERO': content = <MidnightEmulsionHeroBlock {...commonProps} />; break;
      case 'MARQUEE': content = <MidnightEmulsionMarqueeBlock {...commonProps} />; break;
      case 'ABOUT': content = <MidnightEmulsionAboutBlock {...commonProps} />; break;
      case 'SERVICES': content = <MidnightEmulsionServicesBlock {...commonProps} />; break;
      case 'PROJECTS': content = <MidnightEmulsionProjectsBlock {...commonProps} />; break;
      case 'STATS': content = <MidnightEmulsionStatsBlock {...commonProps} />; break;
      case '3D': content = <MidnightEmulsion3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <MidnightEmulsionAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <MidnightEmulsionTestimonialsBlock {...commonProps} />; break;
      case 'FOOTER': content = <MidnightEmulsionFooterBlock {...commonProps} />; break;
      case 'PENPOT': content = data?.id || data?.userId ? <PenpotShowcase userId={userId} variant="midnight" themeColor={themeColor} /> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <CanvaShowcase userId={userId} variant="midnight" themeColor={themeColor} /> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <GithubStats userId={userId} variant="midnight" themeColor={themeColor} /> : null; break;
    }
  } else if (activeThemeTemplate === 'viewfinder') {
    switch (baseBlockType) {
            case 'SKILLS': content = <ViewfinderSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <ViewfinderExperienceBlock {...commonProps} />; break;
      case 'HERO': content = <ViewfinderHeroBlock {...commonProps} />; break;
      case 'MARQUEE': content = <ViewfinderMarqueeBlock {...commonProps} />; break;
      case 'ABOUT': content = <ViewfinderAboutBlock {...commonProps} />; break;
      case 'SERVICES': content = <ViewfinderServicesBlock {...commonProps} />; break;
      case 'PROJECTS': content = <ViewfinderProjectsBlock {...commonProps} />; break;
      case 'STATS': content = <ViewfinderStatsBlock {...commonProps} />; break;
      case '3D': content = <Viewfinder3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <ViewfinderAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <ViewfinderTestimonialsBlock {...commonProps} />; break;
      case 'FOOTER': content = <ViewfinderFooterBlock {...commonProps} />; break;
      case 'PENPOT': content = data?.id || data?.userId ? <PenpotShowcase userId={userId} variant="viewfinder" themeColor={themeColor} /> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <CanvaShowcase userId={userId} variant="viewfinder" themeColor={themeColor} /> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <GithubStats userId={userId} variant="viewfinder" themeColor={themeColor} /> : null; break;
    }
  } else if (activeThemeTemplate === 'split-screen-studio') {
    switch (baseBlockType) {
      case 'HERO': content = <SplitScreenStudioHeroBlock {...commonProps} />; break;
      case 'MARQUEE': content = <SplitScreenStudioMarqueeBlock {...commonProps} />; break;
      case 'ABOUT': content = <SplitScreenStudioAboutBlock {...commonProps} />; break;
      case 'SERVICES': content = <SplitScreenStudioServicesBlock {...commonProps} />; break;
      case 'STATS': content = <SplitScreenStudioStatsBlock {...commonProps} />; break;
      case 'PROJECTS': content = <SplitScreenStudioProjectsBlock {...commonProps} />; break;
      case '3D': content = <SplitScreenStudio3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <SplitScreenStudioAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <SplitScreenStudioTestimonialsBlock {...commonProps} />; break;
      case 'SKILLS': content = <SplitScreenStudioSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <SplitScreenStudioExperienceBlock {...commonProps} />; break;
      case 'FOOTER': content = <SplitScreenStudioFooterBlock {...commonProps} />; break;
      case 'PENPOT': content = data?.id || data?.userId ? <div className="w-full bg-[#050505] p-8 md:p-12"><PenpotShowcase userId={userId} variant="split-screen-studio" themeColor={themeColor} /></div> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <div className="w-full bg-[#050505] p-8 md:p-12"><CanvaShowcase userId={userId} variant="split-screen-studio" themeColor={themeColor} /></div> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <div className="w-full bg-[#050505] p-8 md:p-12"><GithubStats userId={userId} variant="split-screen-studio" themeColor={themeColor} /></div> : null; break;
    }
  } else if (activeThemeTemplate === 'split') {
    switch (baseBlockType) {
            case 'SKILLS': content = <NexusSplitSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <NexusSplitExperienceBlock {...commonProps} />; break;
      case 'HERO': content = <NexusSplitHeroBlock {...commonProps} />; break;
      case 'MARQUEE': content = <NexusSplitMarqueeBlock {...commonProps} />; break;
      case 'ABOUT': content = <NexusSplitAboutBlock {...commonProps} />; break;
      case 'SERVICES': content = <NexusSplitServicesBlock {...commonProps} />; break;
      case 'STATS': content = <NexusSplitStatsBlock {...commonProps} />; break;
      case 'PROJECTS': content = <NexusSplitProjectsBlock {...commonProps} />; break;
      case '3D': content = <NexusSplit3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <NexusSplitAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <NexusSplitTestimonialsBlock {...commonProps} />; break;
      case 'FOOTER': content = <NexusSplitFooterBlock {...commonProps} />; break;
      case 'PENPOT': content = data?.id || data?.userId ? <PenpotShowcase userId={userId} variant="split" themeColor={themeColor} /> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <CanvaShowcase userId={userId} variant="split" themeColor={themeColor} /> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <GithubStats userId={userId} variant="split" themeColor={themeColor} /> : null; break;
    }
  } else if (activeThemeTemplate === 'monolith') {
    switch (baseBlockType) {
            case 'SKILLS': content = <MonolithSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <MonolithExperienceBlock {...commonProps} />; break;
      case 'HERO': content = <MonolithHeroBlock {...commonProps} />; break;
      case 'MARQUEE': content = <MonolithMarqueeBlock {...commonProps} />; break;
      case 'ABOUT': content = <MonolithAboutBlock {...commonProps} />; break;
      case 'SERVICES': content = <MonolithServicesBlock {...commonProps} />; break;
      case 'STATS': content = <MonolithStatsBlock {...commonProps} />; break;
      case 'PROJECTS': content = <MonolithProjectsBlock {...commonProps} />; break;
      case '3D': content = <Monolith3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <MonolithAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <MonolithTestimonialsBlock {...commonProps} />; break;
      case 'FOOTER': content = <MonolithFooterBlock {...commonProps} />; break;
      case 'PENPOT': content = data?.id || data?.userId ? <PenpotShowcase userId={userId} variant="split" themeColor={themeColor} /> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <CanvaShowcase userId={userId} variant="split" themeColor={themeColor} /> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <GithubStats userId={userId} variant="split" themeColor={themeColor} /> : null; break;
    }
  } else if (activeThemeTemplate === 'layered-monolith') {
    switch (baseBlockType) {
            case 'SKILLS': content = <LayeredMonolithSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <LayeredMonolithExperienceBlock {...commonProps} />; break;
      case 'HERO': content = <LayeredMonolithHeroBlock {...commonProps} />; break;
      case 'ABOUT': content = <LayeredMonolithEthosBlock {...commonProps} />; break;
      case 'PROJECTS': content = <LayeredMonolithWorksBlock {...commonProps} />; break;
      case '3D': content = <LayeredMonolith3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <LayeredMonolithAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <LayeredMonolithTestimonialBlock {...commonProps} />; break;
      case 'FOOTER': content = <LayeredMonolithFooterBlock {...commonProps} />; break;
      case 'MARQUEE': content = <LayeredMonolithMarqueeBlock {...commonProps} />; break;
      case 'SERVICES': content = <LayeredMonolithExpertiseBlock {...commonProps} />; break;
      case 'STATS': content = null; break; // Layered Monolith does not have a dedicated stats block, only widgets
      case 'PENPOT': content = data?.id || data?.userId ? <section className="stack-card bg-[#111] text-white p-8 md:p-16 flex flex-col min-h-[100vh] justify-center overflow-y-auto relative"><div className="noise mix-blend-overlay opacity-10"></div><div className="w-full max-w-6xl mx-auto relative z-10 pb-24"><PenpotShowcase userId={userId} variant="layered-monolith" themeColor={themeColor} /></div></section> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <section className="stack-card bg-[#111] text-white p-8 md:p-16 flex flex-col min-h-[100vh] justify-center overflow-y-auto relative"><div className="noise mix-blend-overlay opacity-10"></div><div className="w-full max-w-6xl mx-auto relative z-10 pb-24"><CanvaShowcase userId={userId} variant="layered-monolith" themeColor={themeColor} /></div></section> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <section className="stack-card bg-[#111] text-white p-8 md:p-16 flex flex-col min-h-[100vh] justify-center overflow-y-auto relative"><div className="noise mix-blend-overlay opacity-10"></div><div className="w-full max-w-6xl mx-auto relative z-10 pb-32"><GithubStats userId={userId} variant="layered-monolith" themeColor={themeColor} /></div></section> : null; break;
    }
  } else if (activeThemeTemplate === 'absolute-noir') {
    switch (baseBlockType) {
            case 'SKILLS': content = <AbsoluteNoirSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <AbsoluteNoirExperienceBlock {...commonProps} />; break;
      case 'HERO': content = <AbsoluteNoirHeroBlock {...commonProps} />; break;
      case 'MARQUEE': content = null; break; // Locked to Hero in this theme
      case 'ABOUT': content = <AbsoluteNoirAboutBlock {...commonProps} />; break;
      case 'SERVICES': content = <AbsoluteNoirServicesBlock {...commonProps} />; break;
      case 'STATS': content = <AbsoluteNoirStatsBlock {...commonProps} />; break;
      case 'PROJECTS': content = <AbsoluteNoirProjectsBlock {...commonProps} />; break;
      case '3D': content = <AbsoluteNoir3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <AbsoluteNoirAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <AbsoluteNoirTestimonialsBlock {...commonProps} />; break;
      case 'FOOTER': content = <AbsoluteNoirFooterBlock {...commonProps} />; break;
      case 'PENPOT': content = data?.id || data?.userId ? <PenpotShowcase userId={userId} variant="noir" /> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <CanvaShowcase userId={userId} variant="noir" /> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <GithubStats userId={userId} variant="noir" /> : null; break;
    }
  } else if (activeThemeTemplate === 'cinematic') {
    switch (baseBlockType) {
            case 'SKILLS': content = <CinematicSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <CinematicExperienceBlock {...commonProps} />; break;
      case 'HERO': content = <CinematicHeroBlock {...commonProps} />; break;
      case 'MARQUEE': content = <CinematicMarqueeBlock {...commonProps} />; break;
      case 'ABOUT': content = <CinematicAboutBlock {...commonProps} />; break;
      case 'SERVICES': content = <CinematicServicesBlock {...commonProps} />; break;
      case 'STATS': content = <CinematicStatsBlock {...commonProps} />; break;
      case 'PROJECTS': content = <CinematicProjectsBlock {...commonProps} />; break;
      case '3D': content = <Cinematic3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <CinematicAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <CinematicTestimonialsBlock {...commonProps} />; break;
      case 'FOOTER': content = <CinematicFooterBlock {...commonProps} />; break;
      case 'PENPOT': content = data?.id || data?.userId ? <PenpotShowcase userId={userId} variant="cinematic" themeColor={themeColor} /> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <CanvaShowcase userId={userId} variant="cinematic" themeColor={themeColor} /> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <GithubStats userId={userId} variant="cinematic" themeColor={themeColor} /> : null; break;
    }
  } else if (activeThemeTemplate === 'cinematic-gallery') {
    switch (baseBlockType) {
            case 'SKILLS': content = <CinematicGallerySkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <CinematicGalleryExperienceBlock {...commonProps} />; break;
      case 'HERO': content = <CinematicGalleryHeroBlock {...commonProps} />; break;
      case 'ABOUT': content = <CinematicGalleryAboutBlock {...commonProps} />; break;
      case 'PROJECTS': content = <CinematicGalleryProjectsBlock {...commonProps} />; break;
      case '3D': content = <CinematicGallery3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <CinematicGalleryAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <CinematicGalleryTestimonialsBlock {...commonProps} />; break;
      case 'FOOTER': content = <CinematicGalleryFooterBlock {...commonProps} />; break;
      case 'MARQUEE': content = null; break; // Locked to Hero
      case 'STATS': content = null; break; // Locked to About
      case 'SERVICES': content = <CinematicGalleryServicesBlock {...commonProps} />; break;
      case 'PENPOT': content = data?.id || data?.userId ? <section className="panel flex-col items-center justify-center"><div className="w-[100vw] h-full overflow-y-auto hide-scrollbar flex items-center justify-center px-2 md:px-0 pt-16 pb-8 pointer-events-auto"><PenpotShowcase userId={userId} variant="cinematic" themeColor="#ffffff" /></div></section> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <section className="panel flex-col items-center justify-center"><div className="w-[100vw] h-full overflow-y-auto hide-scrollbar flex items-center justify-center px-2 md:px-0 pt-16 pb-8 pointer-events-auto"><CanvaShowcase userId={userId} variant="cinematic" themeColor="#ffffff" /></div></section> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <section className="panel flex-col items-center justify-center"><div className="w-[100vw] h-full overflow-y-auto hide-scrollbar flex items-center justify-center px-2 md:px-0 pt-16 pb-8 pointer-events-auto"><GithubStats userId={userId} variant="cinematic" themeColor="#ffffff" /></div></section> : null; break;
    }
  } else if (activeThemeTemplate === 'acid-tech' || activeThemeTemplate === 'acid') {
    switch (baseBlockType) {
            case 'SKILLS': content = <AcidTechSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <AcidTechExperienceBlock {...commonProps} />; break;
      case 'HERO': content = <AcidTechHeroBlock {...commonProps} />; break;
      case 'MARQUEE': content = <AcidTechMarqueeBlock {...commonProps} />; break;
      case 'ABOUT': content = <AcidTechAboutBlock {...commonProps} />; break;
      case 'SERVICES': content = <AcidTechServicesBlock {...commonProps} />; break;
      case 'STATS': content = <AcidTechStatsBlock {...commonProps} />; break;
      case 'PROJECTS': content = <AcidTechProjectsBlock {...commonProps} />; break;
      case '3D': content = <AcidTech3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <AcidTechAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <AcidTechTestimonialsBlock {...commonProps} />; break;
      case 'FOOTER': content = <AcidTechFooterBlock {...commonProps} />; break;
      case 'PENPOT': content = data?.id || data?.userId ? <PenpotShowcase userId={userId} variant="acid" themeColor={themeColor} /> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <CanvaShowcase userId={userId} variant="acid" themeColor={themeColor} /> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <GithubStats userId={userId} variant="acid" themeColor={themeColor} /> : null; break;
    }
  } else if (activeThemeTemplate === 'bentogrid') {
    switch (baseBlockType) {
            case 'SKILLS': content = <BentoGridSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <BentoGridExperienceBlock {...commonProps} />; break;
      case 'HERO': content = <BentoGridHeroBlock {...commonProps} />; break;
      case 'MARQUEE': content = <BentoGridMarqueeBlock {...commonProps} />; break;
      case 'ABOUT': content = <BentoGridAboutBlock {...commonProps} />; break;
      case 'SERVICES': content = <BentoGridServicesBlock {...commonProps} />; break;
      case 'STATS': content = <BentoGridStatsBlock {...commonProps} />; break;
      case 'PROJECTS': content = <BentoGridProjectsBlock {...commonProps} />; break;
      case '3D': content = <BentoGrid3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <BentoGridAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <BentoGridTestimonialsBlock {...commonProps} />; break;
      case 'FOOTER': content = <BentoGridFooterBlock {...commonProps} />; break;
      case 'PENPOT': content = data?.id || data?.userId ? <div className="bento-card p-0 mb-6"><PenpotShowcase userId={userId} variant="bento" themeColor={themeColor} /></div> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <div className="bento-card p-0 mb-6"><CanvaShowcase userId={userId} variant="bento" themeColor={themeColor} /></div> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <div className="bento-card p-0"><GithubStats userId={userId} variant="bento" themeColor={themeColor} /></div> : null; break;
    }
  } else if (activeThemeTemplate === 'brutalism') {
    switch (baseBlockType) {
            case 'SKILLS': content = <BrutalismSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <BrutalismExperienceBlock {...commonProps} />; break;
      case 'HERO': content = <BrutalismHeroBlock {...commonProps} />; break;
      case 'STATS': content = <BrutalismStatsBlock {...commonProps} />; break;
      case 'PROJECTS': content = <BrutalismProjectsBlock {...commonProps} />; break;
      case '3D': content = <Brutalism3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <BrutalismAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <BrutalismTestimonialsBlock {...commonProps} />; break;
      case 'FOOTER': content = <BrutalismFooterBlock {...commonProps} />; break;
      case 'ABOUT': content = <BrutalismAboutBlock {...commonProps} />; break;
      case 'SERVICES': content = <BrutalismServicesBlock {...commonProps} />; break;
      case 'MARQUEE': content = null; break; // Locked to Hero in this theme
      case 'PENPOT': content = data?.id || data?.userId ? <section className="w-full bg-white border-b-[3px] border-black"><PenpotShowcase userId={userId} variant="brutalism" themeColor={themeColor} /></section> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <section className="w-full bg-white border-b-[3px] border-black"><CanvaShowcase userId={userId} variant="brutalism" themeColor={themeColor} /></section> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <section className="w-full bg-white border-b-[3px] border-black"><GithubStats userId={userId} variant="brutalism" themeColor={themeColor} /></section> : null; break;
    }
  } else if (activeThemeTemplate === 'kinetic-avant-garde') {
    switch (baseBlockType) {
      case 'HERO': content = <KineticAvantGardeHeroBlock {...commonProps} />; break;
      case 'MARQUEE': content = <KineticAvantGardeMarqueeBlock {...commonProps} />; break;
      case 'ABOUT': content = <KineticAvantGardeAboutBlock {...commonProps} />; break;
      case 'SERVICES': content = <KineticAvantGardeServicesBlock {...commonProps} />; break;
      case 'SKILLS': content = <KineticAvantGardeSkillsBlock {...commonProps} />; break;
      case 'STATS': content = <KineticAvantGardeStatsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <KineticAvantGardeExperienceBlock {...commonProps} />; break;
      case 'PROJECTS': content = <KineticAvantGardeProjectsBlock {...commonProps} />; break;
      case '3D': content = <KineticAvantGarde3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <KineticAvantGardeAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <KineticAvantGardeTestimonialsBlock {...commonProps} />; break;
      case 'FOOTER': content = <KineticAvantGardeFooterBlock {...commonProps} />; break;
      case 'PENPOT': content = data?.id || data?.userId ? <div className="kag-bg-void kag-text-bone w-full border-t-8 border-black"><PenpotShowcase userId={userId} variant="kinetic-avant-garde" /></div> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <div className="kag-bg-void kag-text-bone w-full border-t-8 border-black"><CanvaShowcase userId={userId} variant="kinetic-avant-garde" /></div> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <div className="kag-bg-void kag-text-bone w-full border-t-8 border-black"><GithubStats userId={userId} variant="kinetic-avant-garde" /></div> : null; break;
    }
  } else if (activeThemeTemplate === 'nexus-noir') {
    switch (baseBlockType) {
      case 'HERO': content = <NexusNoirHeroBlock {...commonProps} />; break;
      case 'MARQUEE': content = <NexusNoirMarqueeBlock />; break;
      case 'ABOUT': content = <NexusNoirAboutBlock {...commonProps} />; break;
      case 'SKILLS': content = <NexusNoirSkillsBlock {...commonProps} />; break;
      case 'EXPERIENCE': content = <NexusNoirExperienceBlock {...commonProps} />; break;
      case 'SERVICES': content = <NexusNoirServicesBlock {...commonProps} />; break;
      case 'STATS': content = <NexusNoirStatsBlock {...commonProps} />; break;
      case 'PROJECTS': content = <NexusNoirProjectsBlock {...commonProps} setSelectedMedia={setSelectedMedia} />; break;
      case '3D': content = <NexusNoir3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <NexusNoirAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <NexusNoirTestimonialsBlock {...commonProps} />; break;
      case 'FOOTER': content = <NexusNoirFooterBlock {...commonProps} />; break;
      case 'PENPOT': content = data?.id || data?.userId ? <div className="w-full bg-[#030303] text-white"><PenpotShowcase userId={userId} variant="nexus-noir" /></div> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <div className="w-full bg-[#030303] text-white"><CanvaShowcase userId={userId} variant="nexus-noir" /></div> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <div className="w-full bg-[#030303] text-white"><GithubStats userId={userId} variant="nexus-noir" /></div> : null; break;
    }
  }

  if (content === undefined) {
    if (isEditor) {
      return (
        <div className="w-full h-32 bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-500 font-bold">
          [DEBUG] Content is NULL for blockType: {block.blockType} / baseBlockType: {baseBlockType}
        </div>
      );
    }
    return null;
  }

  const isHero = block.blockType.includes('HERO');

  const isHorizontalFlow = activeThemeTemplate === 'cinematic-gallery';

  return (
    <BlockEditorWrapper key={block.id} block={block} isEditor={isEditor} isHero={isHero} isHorizontalFlow={isHorizontalFlow}>
      {content}
    </BlockEditorWrapper>
  );
};

export const DynamicBlockRenderer = ({ blocks, data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: any) => {
  const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);

  const getFontFamily = (fontName: string) => {
    if (!fontName) return "'Inter', sans-serif";
    if (fontName.toLowerCase().includes('space') || fontName.toLowerCase().includes('mono')) return "'Space Mono', monospace";
    if (fontName.toLowerCase().includes('serif') || fontName.toLowerCase().includes('elegant')) return "'Playfair Display', serif";
    return "'Inter', sans-serif";
  };

  const headingFont = getFontFamily(theme?.fontHeading);
  const bodyFont = getFontFamily(theme?.fontBody);
  const buttonShape = theme?.buttonShape || 'rounded';
  const radiusClass = buttonShape === 'hard' || buttonShape === 'square' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-lg';

  // Urutkan blok berdasarkan orderIndex dan filter yang tersembunyi
  let sortedBlocks = [...(blocks || [])].sort((a, b) => a.orderIndex - b.orderIndex);

  if (!isEditor) {
    sortedBlocks = sortedBlocks.filter(b => b.isVisible !== false);

    // Fallback: Jika pengguna belum pernah menyimpan blok (database kosong),
    // berikan blok standar agar halaman tidak kosong melompong.
    if (sortedBlocks.length === 0) {
      const DEFAULT_ORDER = ['HERO', 'MARQUEE', 'ABOUT', 'SKILLS', 'EXPERIENCE', 'SERVICES', 'STATS', 'PROJECTS', '3D', 'AWARDS', 'TESTIMONIALS', 'FOOTER'];
      sortedBlocks = DEFAULT_ORDER.map((type, i) => ({
        id: `fallback-${i}`,
        blockType: type,
        orderIndex: i,
        isVisible: true
      }));
    }
  }

  const isSmoothScroll = (!isMobileView && !isCardPreview) && (theme?.customTexts?.smooth_scroll === 'true');
  const activeThemeTemplate = theme?.themeTemplate || 'minimalist';

  const renderBlock = (b: any) => (
    <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
  );

  const renderLayout = () => {
    // Jika tema minimalist, kita gunakan Layout Shell khusus
    if (theme?.themeTemplate === 'minimalist') {
      const heroBlockData = sortedBlocks.find(b => b.blockType.includes('HERO'));
      const otherBlocks = sortedBlocks.filter(b => b.id !== heroBlockData?.id);

      return (
        <div className={`flex w-full min-h-screen bg-white text-black relative min-body flex-col @lg:flex-row min-theme`}>
          <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" />
          <style dangerouslySetInnerHTML={{
            __html: `
            .min-heading { font-family: ${headingFont} !important; }
            .min-body { font-family: ${bodyFont} !important; }
            .min-theme ::-webkit-scrollbar { width: 5px; height: 5px; }
            .min-theme ::-webkit-scrollbar-track { background: transparent; }
            .min-theme ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
            .min-theme ::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
            .min-theme * { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
            .min-theme ::selection { background: #000000; color: #ffffff; }
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}} />

          {/* Layout Shell: Sidebar Kiri (Hero) */}
          {heroBlockData && (
            <BlockEditorWrapper key={heroBlockData.id} block={heroBlockData} isEditor={isEditor} isHero={true}>
              <MinimalistHeroBlock data={data} theme={theme} isEditor={isEditor} blockConfig={heroBlockData} />
            </BlockEditorWrapper>
          )}

          {/* Layout Shell: Konten Kanan (Semua blok lain yang bisa diurutkan bebas) */}
          <main className={`bg-white w-full @lg:w-[65%] ${!heroBlockData ? '@lg:w-full' : ''} ${heroBlockData ? '@lg:ml-[35%]' : ''}`}>
            {otherBlocks.map(b => (
              <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
            ))}
          </main>

          {/* MEDIA PLAYER MODAL */}
          <AnimatePresence>
            {selectedMedia && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-xl flex items-center justify-center p-4 @md:p-10"
              >
                <div className="max-w-5xl w-full flex flex-col gap-6">
                  <div className="flex justify-between items-center px-2">
                    <div>
                      <h3 className="text-xl font-black tracking-tighter uppercase min-heading">{selectedMedia.title}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                        {selectedMedia.type === 'video' ? 'Cinematic Presentation' : 'Visual Showcase'}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedMedia(null)}
                      className={`w-12 h-12 bg-black text-white flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-lg ${radiusClass}`}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                    className={`w-full ${selectedMedia.type === 'video' ? 'aspect-video bg-black' : 'max-h-[70vh] overflow-hidden bg-gray-50'} shadow-2xl relative flex items-center justify-center border border-gray-100 ${radiusClass}`}
                  >
                    {selectedMedia.type === 'video' ? (
                      <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[65vh] object-contain shadow-sm" />
                      </div>
                    )}
                  </motion.div>

                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setSelectedMedia(null)}
                      className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors"
                    >
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (activeThemeTemplate === 'spatial') {
      return (
        <SpatialShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map(b => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </SpatialShell>
      );
    }

    if (activeThemeTemplate === 'obsidian-reel') {
      return (
        <ObsidianShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map(b => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </ObsidianShell>
      );
    }

    if (activeThemeTemplate === 'aura-kinetic') {
      return (
        <AuraKineticShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map(b => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </AuraKineticShell>
      );
    }

    if (activeThemeTemplate === 'editorial') {
      return (
        <EditorialShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map(b => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </EditorialShell>
      );
    }

    if (activeThemeTemplate === 'midnight-emulsion') {
      return (
        <MidnightEmulsionShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map(b => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </MidnightEmulsionShell>
      );
    }

    if (activeThemeTemplate === 'viewfinder') {
      return (
        <ViewfinderShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map(b => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </ViewfinderShell>
      );
    }

    if (activeThemeTemplate === 'cinematic-gallery') {
      return (
        <CinematicGalleryShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map((b: any) => (
            <React.Fragment key={b.id}>
              {renderBlock(b)}
            </React.Fragment>
          ))}
        </CinematicGalleryShell>
      );
    }

    if (activeThemeTemplate === 'split') {
      const heroBlockData = sortedBlocks.find((b: any) => b.blockType.includes('HERO'));
      const otherBlocks = sortedBlocks.filter((b: any) => b.id !== heroBlockData?.id);

      return (
        <NexusSplitShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor} heroBlock={heroBlockData}>
          {otherBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </NexusSplitShell>
      );
    }

    if (activeThemeTemplate === 'monolith') {
      return (
        <MonolithShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor} selectedMedia={selectedMedia} setSelectedMedia={setSelectedMedia}>
          {sortedBlocks.map(b => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </MonolithShell>
      );
    }

    if (activeThemeTemplate === 'layered-monolith') {
      return (
        <LayeredMonolithShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor} selectedMedia={selectedMedia} setSelectedMedia={setSelectedMedia}>
          {sortedBlocks.map(b => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </LayeredMonolithShell>
      );
    }

    if (activeThemeTemplate === 'absolute-noir') {
      return (
        <AbsoluteNoirShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </AbsoluteNoirShell>
      );
    }

    if (activeThemeTemplate === 'cinematic') {
      return (
        <CinematicShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </CinematicShell>
      );
    }

    if (activeThemeTemplate === 'acid-tech' || activeThemeTemplate === 'acid') {
      return (
        <AcidTechShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </AcidTechShell>
      );
    }

    if (activeThemeTemplate === 'bentogrid') {
      return (
        <BentoGridShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </BentoGridShell>
      );
    }

    if (activeThemeTemplate === 'brutalism') {
      return (
        <BrutalismShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </BrutalismShell>
      );
    }

    if (activeThemeTemplate === 'kinetic-avant-garde') {
      return (
        <KineticAvantGardeShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </KineticAvantGardeShell>
      );
    }

    if (activeThemeTemplate === 'nexus-noir') {
      return (
        <NexusNoirShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </NexusNoirShell>
      );
    }

    if (activeThemeTemplate === 'horizontal-flow') {
      return (
        <HorizontalFlowShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </HorizontalFlowShell>
      );
    }

    if (activeThemeTemplate === 'split-screen-studio') {
      const heroBlockData = sortedBlocks.find((b: any) => b.blockType.includes('HERO'));
      const otherBlocks = sortedBlocks.filter((b: any) => b.id !== heroBlockData?.id);

      return (
        <SplitScreenStudioShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor} heroBlock={heroBlockData}>
          {otherBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </SplitScreenStudioShell>
      );
    }

    // Default Minimalist
    return (
      <div className="flex flex-col w-full min-h-screen">
        {sortedBlocks.map(b => (
          <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
        ))}
      </div>
    );
  };

  const content = renderLayout();

  if (isSmoothScroll) {
    return (
      <>
        <style dangerouslySetInnerHTML={{
          __html: `
            html.lenis, html.lenis body { height: auto; }
            .lenis.lenis-smooth { scroll-behavior: auto !important; }
            .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
            .lenis.lenis-stopped { overflow: hidden; }
          `
        }} />
        <ReactLenis root options={{ smoothWheel: true, duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) }}>
          {content}
        </ReactLenis>
      </>
    );
  }

  return content;
};
