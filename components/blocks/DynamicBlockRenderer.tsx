"use client";

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';
import { GlobalCursor } from '@/components/features/GlobalCursor';

// Minimalist Blocks
const MinimalistSkillsBlock = dynamic(() => import('./minimalist/MinimalistSkillsBlock').then(mod => mod.MinimalistSkillsBlock));
const MinimalistExperienceBlock = dynamic(() => import('./minimalist/MinimalistExperienceBlock').then(mod => mod.MinimalistExperienceBlock));
const MinimalistHeroBlock = dynamic(() => import('./minimalist/MinimalistHeroBlock').then(mod => mod.MinimalistHeroBlock));
const MinimalistMarqueeBlock = dynamic(() => import('./minimalist/MinimalistMarqueeBlock').then(mod => mod.MinimalistMarqueeBlock));
const MinimalistAboutBlock = dynamic(() => import('./minimalist/MinimalistAboutBlock').then(mod => mod.MinimalistAboutBlock));
const MinimalistServicesBlock = dynamic(() => import('./minimalist/MinimalistServicesBlock').then(mod => mod.MinimalistServicesBlock));
const MinimalistStatsBlock = dynamic(() => import('./minimalist/MinimalistStatsBlock').then(mod => mod.MinimalistStatsBlock));
const MinimalistProjectsBlock = dynamic(() => import('./minimalist/MinimalistProjectsBlock').then(mod => mod.MinimalistProjectsBlock));
const Minimalist3DBlock = dynamic(() => import('./minimalist/Minimalist3DBlock').then(mod => mod.Minimalist3DBlock));
const MinimalistAwardsBlock = dynamic(() => import('./minimalist/MinimalistAwardsBlock').then(mod => mod.MinimalistAwardsBlock));
const MinimalistTestimonialsBlock = dynamic(() => import('./minimalist/MinimalistTestimonialsBlock').then(mod => mod.MinimalistTestimonialsBlock));
const MinimalistFooterBlock = dynamic(() => import('./minimalist/MinimalistFooterBlock').then(mod => mod.MinimalistFooterBlock));

// Spatial Theme Blocks
const SpatialShell = dynamic(() => import('./spatial/SpatialShell').then(mod => mod.SpatialShell));
const SpatialSkillsBlock = dynamic(() => import('./spatial/SpatialSkillsBlock').then(mod => mod.SpatialSkillsBlock));
const SpatialExperienceBlock = dynamic(() => import('./spatial/SpatialExperienceBlock').then(mod => mod.SpatialExperienceBlock));
const SpatialHeroBlock = dynamic(() => import('./spatial/SpatialHeroBlock').then(mod => mod.SpatialHeroBlock));
const SpatialMarqueeBlock = dynamic(() => import('./spatial/SpatialMarqueeBlock').then(mod => mod.SpatialMarqueeBlock));
const SpatialAboutBlock = dynamic(() => import('./spatial/SpatialAboutBlock').then(mod => mod.SpatialAboutBlock));
const SpatialServicesBlock = dynamic(() => import('./spatial/SpatialServicesBlock').then(mod => mod.SpatialServicesBlock));
const SpatialProjectsBlock = dynamic(() => import('./spatial/SpatialProjectsBlock').then(mod => mod.SpatialProjectsBlock));
const Spatial3DBlock = dynamic(() => import('./spatial/Spatial3DBlock').then(mod => mod.Spatial3DBlock));
const SpatialStatsBlock = dynamic(() => import('./spatial/SpatialStatsBlock').then(mod => mod.SpatialStatsBlock));
const SpatialGithubBlock = dynamic(() => import('./spatial/SpatialGithubBlock').then(mod => mod.SpatialGithubBlock));
const SpatialTestimonialsBlock = dynamic(() => import('./spatial/SpatialTestimonialsBlock').then(mod => mod.SpatialTestimonialsBlock));
const SpatialAwardsBlock = dynamic(() => import('./spatial/SpatialAwardsBlock').then(mod => mod.SpatialAwardsBlock));
const SpatialFooterBlock = dynamic(() => import('./spatial/SpatialFooterBlock').then(mod => mod.SpatialFooterBlock));

// Shared Widgets
const PenpotShowcase = dynamic(() => import('@/components/themes/widgets/PenpotShowcase').then(mod => mod.PenpotShowcase));
const CanvaShowcase = dynamic(() => import('@/components/themes/widgets/CanvaShowcase').then(mod => mod.CanvaShowcase));
const GithubStats = dynamic(() => import('@/components/themes/widgets/GithubStats').then(mod => mod.GithubStats));

// Obsidian Reel Theme Blocks
const ObsidianShell = dynamic(() => import('./obsidian/ObsidianShell').then(mod => mod.ObsidianShell));
const ObsidianSkillsBlock = dynamic(() => import('./obsidian-reel/ObsidianSkillsBlock').then(mod => mod.ObsidianSkillsBlock));
const ObsidianExperienceBlock = dynamic(() => import('./obsidian-reel/ObsidianExperienceBlock').then(mod => mod.ObsidianExperienceBlock));
const ObsidianHeroBlock = dynamic(() => import('./obsidian/ObsidianHeroBlock').then(mod => mod.ObsidianHeroBlock));
const ObsidianMarqueeBlock = dynamic(() => import('./obsidian/ObsidianMarqueeBlock').then(mod => mod.ObsidianMarqueeBlock));
const ObsidianAboutBlock = dynamic(() => import('./obsidian/ObsidianAboutBlock').then(mod => mod.ObsidianAboutBlock));
const ObsidianServicesBlock = dynamic(() => import('./obsidian/ObsidianServicesBlock').then(mod => mod.ObsidianServicesBlock));
const ObsidianProjectsBlock = dynamic(() => import('./obsidian/ObsidianProjectsBlock').then(mod => mod.ObsidianProjectsBlock));
const Obsidian3DBlock = dynamic(() => import('./obsidian/Obsidian3DBlock').then(mod => mod.Obsidian3DBlock));
const ObsidianStatsBlock = dynamic(() => import('./obsidian/ObsidianStatsBlock').then(mod => mod.ObsidianStatsBlock));
const ObsidianAwardsBlock = dynamic(() => import('./obsidian/ObsidianAwardsBlock').then(mod => mod.ObsidianAwardsBlock));
const ObsidianTestimonialsBlock = dynamic(() => import('./obsidian/ObsidianTestimonialsBlock').then(mod => mod.ObsidianTestimonialsBlock));
const ObsidianFooterBlock = dynamic(() => import('./obsidian/ObsidianFooterBlock').then(mod => mod.ObsidianFooterBlock));
// Aura Kinetic Theme Blocks
const AuraKineticShell = dynamic(() => import('./aura-kinetic/AuraKineticShell').then(mod => mod.AuraKineticShell));
const AuraKineticSkillsBlock = dynamic(() => import('./aura-kinetic/AuraKineticSkillsBlock').then(mod => mod.AuraKineticSkillsBlock));
const AuraKineticExperienceBlock = dynamic(() => import('./aura-kinetic/AuraKineticExperienceBlock').then(mod => mod.AuraKineticExperienceBlock));

// Global Smart Blocks
const FaqRenderer = dynamic(() => import('./faq/FaqRenderer'));
const AuraKineticHeroBlock = dynamic(() => import('./aura-kinetic/AuraKineticHeroBlock').then(mod => mod.AuraKineticHeroBlock));
const AuraKineticMarqueeBlock = dynamic(() => import('./aura-kinetic/AuraKineticMarqueeBlock').then(mod => mod.AuraKineticMarqueeBlock));
const AuraKineticAboutBlock = dynamic(() => import('./aura-kinetic/AuraKineticAboutBlock').then(mod => mod.AuraKineticAboutBlock));
const AuraKineticServicesBlock = dynamic(() => import('./aura-kinetic/AuraKineticServicesBlock').then(mod => mod.AuraKineticServicesBlock));
const AuraKineticProjectsBlock = dynamic(() => import('./aura-kinetic/AuraKineticProjectsBlock').then(mod => mod.AuraKineticProjectsBlock));
const AuraKineticStatsBlock = dynamic(() => import('./aura-kinetic/AuraKineticStatsBlock').then(mod => mod.AuraKineticStatsBlock));
const AuraKinetic3DBlock = dynamic(() => import('./aura-kinetic/AuraKinetic3DBlock').then(mod => mod.AuraKinetic3DBlock));
const AuraKineticAwardsBlock = dynamic(() => import('./aura-kinetic/AuraKineticAwardsBlock').then(mod => mod.AuraKineticAwardsBlock));
const AuraKineticTestimonialsBlock = dynamic(() => import('./aura-kinetic/AuraKineticTestimonialsBlock').then(mod => mod.AuraKineticTestimonialsBlock));
const AuraKineticFooterBlock = dynamic(() => import('./aura-kinetic/AuraKineticFooterBlock').then(mod => mod.AuraKineticFooterBlock));

// Editorial Theme Blocks
const EditorialShell = dynamic(() => import('./editorial/EditorialShell').then(mod => mod.EditorialShell));
const EditorialSkillsBlock = dynamic(() => import('./editorial/EditorialSkillsBlock').then(mod => mod.EditorialSkillsBlock));
const EditorialExperienceBlock = dynamic(() => import('./editorial/EditorialExperienceBlock').then(mod => mod.EditorialExperienceBlock));
const EditorialHeroBlock = dynamic(() => import('./editorial/EditorialHeroBlock').then(mod => mod.EditorialHeroBlock));
const EditorialMarqueeBlock = dynamic(() => import('./editorial/EditorialMarqueeBlock').then(mod => mod.EditorialMarqueeBlock));
const EditorialAboutBlock = dynamic(() => import('./editorial/EditorialAboutBlock').then(mod => mod.EditorialAboutBlock));
const EditorialServicesBlock = dynamic(() => import('./editorial/EditorialServicesBlock').then(mod => mod.EditorialServicesBlock));
const EditorialProjectsBlock = dynamic(() => import('./editorial/EditorialProjectsBlock').then(mod => mod.EditorialProjectsBlock));
const EditorialStatsBlock = dynamic(() => import('./editorial/EditorialStatsBlock').then(mod => mod.EditorialStatsBlock));
const Editorial3DBlock = dynamic(() => import('./editorial/Editorial3DBlock').then(mod => mod.Editorial3DBlock));
const EditorialAwardsBlock = dynamic(() => import('./editorial/EditorialAwardsBlock').then(mod => mod.EditorialAwardsBlock));
const EditorialTestimonialsBlock = dynamic(() => import('./editorial/EditorialTestimonialsBlock').then(mod => mod.EditorialTestimonialsBlock));
const EditorialFooterBlock = dynamic(() => import('./editorial/EditorialFooterBlock').then(mod => mod.EditorialFooterBlock));
// Midnight Emulsion Theme Blocks
const MidnightEmulsionShell = dynamic(() => import('./midnight-emulsion/MidnightEmulsionShell').then(mod => mod.MidnightEmulsionShell));
const MidnightEmulsionSkillsBlock = dynamic(() => import('./midnight-emulsion/MidnightEmulsionSkillsBlock').then(mod => mod.MidnightEmulsionSkillsBlock));
const MidnightEmulsionExperienceBlock = dynamic(() => import('./midnight-emulsion/MidnightEmulsionExperienceBlock').then(mod => mod.MidnightEmulsionExperienceBlock));
const MidnightEmulsionHeroBlock = dynamic(() => import('./midnight-emulsion/MidnightEmulsionHeroBlock').then(mod => mod.MidnightEmulsionHeroBlock));
const MidnightEmulsionMarqueeBlock = dynamic(() => import('./midnight-emulsion/MidnightEmulsionMarqueeBlock').then(mod => mod.MidnightEmulsionMarqueeBlock));
const MidnightEmulsionAboutBlock = dynamic(() => import('./midnight-emulsion/MidnightEmulsionAboutBlock').then(mod => mod.MidnightEmulsionAboutBlock));
const MidnightEmulsionServicesBlock = dynamic(() => import('./midnight-emulsion/MidnightEmulsionServicesBlock').then(mod => mod.MidnightEmulsionServicesBlock));
const MidnightEmulsionProjectsBlock = dynamic(() => import('./midnight-emulsion/MidnightEmulsionProjectsBlock').then(mod => mod.MidnightEmulsionProjectsBlock));
const MidnightEmulsionStatsBlock = dynamic(() => import('./midnight-emulsion/MidnightEmulsionStatsBlock').then(mod => mod.MidnightEmulsionStatsBlock));
const MidnightEmulsion3DBlock = dynamic(() => import('./midnight-emulsion/MidnightEmulsion3DBlock').then(mod => mod.MidnightEmulsion3DBlock));
const MidnightEmulsionAwardsBlock = dynamic(() => import('./midnight-emulsion/MidnightEmulsionAwardsBlock').then(mod => mod.MidnightEmulsionAwardsBlock));
const MidnightEmulsionTestimonialsBlock = dynamic(() => import('./midnight-emulsion/MidnightEmulsionTestimonialsBlock').then(mod => mod.MidnightEmulsionTestimonialsBlock));
const MidnightEmulsionFooterBlock = dynamic(() => import('./midnight-emulsion/MidnightEmulsionFooterBlock').then(mod => mod.MidnightEmulsionFooterBlock));

// Viewfinder Theme Blocks
const ViewfinderShell = dynamic(() => import('./viewfinder/ViewfinderShell').then(mod => mod.ViewfinderShell));
const ViewfinderSkillsBlock = dynamic(() => import('./viewfinder/ViewfinderSkillsBlock').then(mod => mod.ViewfinderSkillsBlock));
const ViewfinderExperienceBlock = dynamic(() => import('./viewfinder/ViewfinderExperienceBlock').then(mod => mod.ViewfinderExperienceBlock));
const ViewfinderHeroBlock = dynamic(() => import('./viewfinder/ViewfinderHeroBlock').then(mod => mod.ViewfinderHeroBlock));
const ViewfinderMarqueeBlock = dynamic(() => import('./viewfinder/ViewfinderMarqueeBlock').then(mod => mod.ViewfinderMarqueeBlock));
const ViewfinderAboutBlock = dynamic(() => import('./viewfinder/ViewfinderAboutBlock').then(mod => mod.ViewfinderAboutBlock));
const ViewfinderServicesBlock = dynamic(() => import('./viewfinder/ViewfinderServicesBlock').then(mod => mod.ViewfinderServicesBlock));
const ViewfinderProjectsBlock = dynamic(() => import('./viewfinder/ViewfinderProjectsBlock').then(mod => mod.ViewfinderProjectsBlock));
const ViewfinderStatsBlock = dynamic(() => import('./viewfinder/ViewfinderStatsBlock').then(mod => mod.ViewfinderStatsBlock));
const Viewfinder3DBlock = dynamic(() => import('./viewfinder/Viewfinder3DBlock').then(mod => mod.Viewfinder3DBlock));
const ViewfinderAwardsBlock = dynamic(() => import('./viewfinder/ViewfinderAwardsBlock').then(mod => mod.ViewfinderAwardsBlock));
const ViewfinderTestimonialsBlock = dynamic(() => import('./viewfinder/ViewfinderTestimonialsBlock').then(mod => mod.ViewfinderTestimonialsBlock));
const ViewfinderFooterBlock = dynamic(() => import('./viewfinder/ViewfinderFooterBlock').then(mod => mod.ViewfinderFooterBlock));

// Nexus Split Theme Blocks
const NexusSplitShell = dynamic(() => import('./nexus-split/NexusSplitShell').then(mod => mod.NexusSplitShell));
const NexusSplitSkillsBlock = dynamic(() => import('./nexus-split/NexusSplitSkillsBlock').then(mod => mod.NexusSplitSkillsBlock));
const NexusSplitExperienceBlock = dynamic(() => import('./nexus-split/NexusSplitExperienceBlock').then(mod => mod.NexusSplitExperienceBlock));
const NexusSplitHeroBlock = dynamic(() => import('./nexus-split/NexusSplitHeroBlock').then(mod => mod.NexusSplitHeroBlock));
const NexusSplitMarqueeBlock = dynamic(() => import('./nexus-split/NexusSplitMarqueeBlock').then(mod => mod.NexusSplitMarqueeBlock));
const NexusSplitAboutBlock = dynamic(() => import('./nexus-split/NexusSplitAboutBlock').then(mod => mod.NexusSplitAboutBlock));
const NexusSplitServicesBlock = dynamic(() => import('./nexus-split/NexusSplitServicesBlock').then(mod => mod.NexusSplitServicesBlock));
const NexusSplitStatsBlock = dynamic(() => import('./nexus-split/NexusSplitStatsBlock').then(mod => mod.NexusSplitStatsBlock));
const NexusSplitProjectsBlock = dynamic(() => import('./nexus-split/NexusSplitProjectsBlock').then(mod => mod.NexusSplitProjectsBlock));
const NexusSplit3DBlock = dynamic(() => import('./nexus-split/NexusSplit3DBlock').then(mod => mod.NexusSplit3DBlock));
const NexusSplitTestimonialsBlock = dynamic(() => import('./nexus-split/NexusSplitTestimonialsBlock').then(mod => mod.NexusSplitTestimonialsBlock));
const NexusSplitAwardsBlock = dynamic(() => import('./nexus-split/NexusSplitAwardsBlock').then(mod => mod.NexusSplitAwardsBlock));
const NexusSplitFooterBlock = dynamic(() => import('./nexus-split/NexusSplitFooterBlock').then(mod => mod.NexusSplitFooterBlock));

// Monolith Vanguard Theme Blocks
const MonolithShell = dynamic(() => import('./monolith/MonolithShell').then(mod => mod.MonolithShell));
const MonolithSkillsBlock = dynamic(() => import('./monolith/MonolithSkillsBlock').then(mod => mod.MonolithSkillsBlock));
const MonolithExperienceBlock = dynamic(() => import('./monolith/MonolithExperienceBlock').then(mod => mod.MonolithExperienceBlock));
const MonolithHeroBlock = dynamic(() => import('./monolith/MonolithHeroBlock').then(mod => mod.MonolithHeroBlock));
const MonolithMarqueeBlock = dynamic(() => import('./monolith/MonolithMarqueeBlock').then(mod => mod.MonolithMarqueeBlock));
const MonolithAboutBlock = dynamic(() => import('./monolith/MonolithAboutBlock').then(mod => mod.MonolithAboutBlock));
const MonolithServicesBlock = dynamic(() => import('./monolith/MonolithServicesBlock').then(mod => mod.MonolithServicesBlock));
const MonolithStatsBlock = dynamic(() => import('./monolith/MonolithStatsBlock').then(mod => mod.MonolithStatsBlock));
const MonolithProjectsBlock = dynamic(() => import('./monolith/MonolithProjectsBlock').then(mod => mod.MonolithProjectsBlock));
const Monolith3DBlock = dynamic(() => import('./monolith/Monolith3DBlock').then(mod => mod.Monolith3DBlock));
const MonolithTestimonialsBlock = dynamic(() => import('./monolith/MonolithTestimonialsBlock').then(mod => mod.MonolithTestimonialsBlock));
const MonolithAwardsBlock = dynamic(() => import('./monolith/MonolithAwardsBlock').then(mod => mod.MonolithAwardsBlock));
const MonolithFooterBlock = dynamic(() => import('./monolith/MonolithFooterBlock').then(mod => mod.MonolithFooterBlock));

// Absolute Noir Theme Blocks
const AbsoluteNoirShell = dynamic(() => import('./absolute-noir/AbsoluteNoirShell').then(mod => mod.AbsoluteNoirShell));
const AbsoluteNoirSkillsBlock = dynamic(() => import('./absolute-noir/AbsoluteNoirSkillsBlock').then(mod => mod.AbsoluteNoirSkillsBlock));
const AbsoluteNoirExperienceBlock = dynamic(() => import('./absolute-noir/AbsoluteNoirExperienceBlock').then(mod => mod.AbsoluteNoirExperienceBlock));
const AbsoluteNoirHeroBlock = dynamic(() => import('./absolute-noir/AbsoluteNoirHeroBlock').then(mod => mod.AbsoluteNoirHeroBlock));
const AbsoluteNoirMarqueeBlock = dynamic(() => import('./absolute-noir/AbsoluteNoirMarqueeBlock').then(mod => mod.AbsoluteNoirMarqueeBlock));
const AbsoluteNoirAboutBlock = dynamic(() => import('./absolute-noir/AbsoluteNoirAboutBlock').then(mod => mod.AbsoluteNoirAboutBlock));
const AbsoluteNoirServicesBlock = dynamic(() => import('./absolute-noir/AbsoluteNoirServicesBlock').then(mod => mod.AbsoluteNoirServicesBlock));
const AbsoluteNoirStatsBlock = dynamic(() => import('./absolute-noir/AbsoluteNoirStatsBlock').then(mod => mod.AbsoluteNoirStatsBlock));
const AbsoluteNoirProjectsBlock = dynamic(() => import('./absolute-noir/AbsoluteNoirProjectsBlock').then(mod => mod.AbsoluteNoirProjectsBlock));
const AbsoluteNoir3DBlock = dynamic(() => import('./absolute-noir/AbsoluteNoir3DBlock').then(mod => mod.AbsoluteNoir3DBlock));
const AbsoluteNoirAwardsBlock = dynamic(() => import('./absolute-noir/AbsoluteNoirAwardsBlock').then(mod => mod.AbsoluteNoirAwardsBlock));
const AbsoluteNoirTestimonialsBlock = dynamic(() => import('./absolute-noir/AbsoluteNoirTestimonialsBlock').then(mod => mod.AbsoluteNoirTestimonialsBlock));
const AbsoluteNoirFooterBlock = dynamic(() => import('./absolute-noir/AbsoluteNoirFooterBlock').then(mod => mod.AbsoluteNoirFooterBlock));

// Layered Monolith Theme Blocks
const LayeredMonolithShell = dynamic(() => import('./layered-monolith/LayeredMonolithShell').then(mod => mod.LayeredMonolithShell));
const LayeredMonolithSkillsBlock = dynamic(() => import('./layered-monolith/LayeredMonolithSkillsBlock').then(mod => mod.LayeredMonolithSkillsBlock));
const LayeredMonolithExperienceBlock = dynamic(() => import('./layered-monolith/LayeredMonolithExperienceBlock').then(mod => mod.LayeredMonolithExperienceBlock));
const LayeredMonolithHeroBlock = dynamic(() => import('./layered-monolith/LayeredMonolithHeroBlock').then(mod => mod.LayeredMonolithHeroBlock));
const LayeredMonolithMarqueeBlock = dynamic(() => import('./layered-monolith/LayeredMonolithMarqueeBlock').then(mod => mod.LayeredMonolithMarqueeBlock));
const LayeredMonolithEthosBlock = dynamic(() => import('./layered-monolith/LayeredMonolithEthosBlock').then(mod => mod.LayeredMonolithEthosBlock));
const LayeredMonolithWorksBlock = dynamic(() => import('./layered-monolith/LayeredMonolithWorksBlock').then(mod => mod.LayeredMonolithWorksBlock));
const LayeredMonolith3DBlock = dynamic(() => import('./layered-monolith/LayeredMonolith3DBlock').then(mod => mod.LayeredMonolith3DBlock));
const LayeredMonolithExpertiseBlock = dynamic(() => import('./layered-monolith/LayeredMonolithExpertiseBlock').then(mod => mod.LayeredMonolithExpertiseBlock));
const LayeredMonolithWidgetsBlock = dynamic(() => import('./layered-monolith/LayeredMonolithWidgetsBlock').then(mod => mod.LayeredMonolithWidgetsBlock));
const LayeredMonolithAwardsBlock = dynamic(() => import('./layered-monolith/LayeredMonolithAwardsBlock').then(mod => mod.LayeredMonolithAwardsBlock));
const LayeredMonolithTestimonialBlock = dynamic(() => import('./layered-monolith/LayeredMonolithTestimonialBlock').then(mod => mod.LayeredMonolithTestimonialBlock));
const LayeredMonolithFooterBlock = dynamic(() => import('./layered-monolith/LayeredMonolithFooterBlock').then(mod => mod.LayeredMonolithFooterBlock));

// Cinematic Theme Blocks
const CinematicShell = dynamic(() => import('./cinematic/CinematicShell').then(mod => mod.CinematicShell));
const CinematicSkillsBlock = dynamic(() => import('./cinematic/CinematicSkillsBlock').then(mod => mod.CinematicSkillsBlock));
const CinematicExperienceBlock = dynamic(() => import('./cinematic/CinematicExperienceBlock').then(mod => mod.CinematicExperienceBlock));
const CinematicHeroBlock = dynamic(() => import('./cinematic/CinematicHeroBlock').then(mod => mod.CinematicHeroBlock));
const CinematicMarqueeBlock = dynamic(() => import('./cinematic/CinematicMarqueeBlock').then(mod => mod.CinematicMarqueeBlock));
const CinematicAboutBlock = dynamic(() => import('./cinematic/CinematicAboutBlock').then(mod => mod.CinematicAboutBlock));
const CinematicServicesBlock = dynamic(() => import('./cinematic/CinematicServicesBlock').then(mod => mod.CinematicServicesBlock));

// Cinematic Gallery Theme Blocks
const CinematicGalleryShell = dynamic(() => import('./cinematic-gallery/CinematicGalleryShell').then(mod => mod.CinematicGalleryShell));
const CinematicGallerySkillsBlock = dynamic(() => import('./cinematic-gallery/CinematicGallerySkillsBlock').then(mod => mod.CinematicGallerySkillsBlock));
const CinematicGalleryExperienceBlock = dynamic(() => import('./cinematic-gallery/CinematicGalleryExperienceBlock').then(mod => mod.CinematicGalleryExperienceBlock));
const CinematicGalleryHeroBlock = dynamic(() => import('./cinematic-gallery/CinematicGalleryHeroBlock').then(mod => mod.CinematicGalleryHeroBlock));
const CinematicGalleryAboutBlock = dynamic(() => import('./cinematic-gallery/CinematicGalleryAboutBlock').then(mod => mod.CinematicGalleryAboutBlock));
const CinematicGalleryServicesBlock = dynamic(() => import('./cinematic-gallery/CinematicGalleryServicesBlock').then(mod => mod.CinematicGalleryServicesBlock));
const CinematicGalleryProjectsBlock = dynamic(() => import('./cinematic-gallery/CinematicGalleryProjectsBlock').then(mod => mod.CinematicGalleryProjectsBlock));
const CinematicGallery3DBlock = dynamic(() => import('./cinematic-gallery/CinematicGallery3DBlock').then(mod => mod.CinematicGallery3DBlock));
const CinematicGalleryTestimonialsBlock = dynamic(() => import('./cinematic-gallery/CinematicGalleryTestimonialsBlock').then(mod => mod.CinematicGalleryTestimonialsBlock));
const CinematicGalleryAwardsBlock = dynamic(() => import('./cinematic-gallery/CinematicGalleryAwardsBlock').then(mod => mod.CinematicGalleryAwardsBlock));
const CinematicGalleryFooterBlock = dynamic(() => import('./cinematic-gallery/CinematicGalleryFooterBlock').then(mod => mod.CinematicGalleryFooterBlock));
const CinematicStatsBlock = dynamic(() => import('./cinematic/CinematicStatsBlock').then(mod => mod.CinematicStatsBlock));
const CinematicProjectsBlock = dynamic(() => import('./cinematic/CinematicProjectsBlock').then(mod => mod.CinematicProjectsBlock));
const Cinematic3DBlock = dynamic(() => import('./cinematic/Cinematic3DBlock').then(mod => mod.Cinematic3DBlock));
const CinematicAwardsBlock = dynamic(() => import('./cinematic/CinematicAwardsBlock').then(mod => mod.CinematicAwardsBlock));
const CinematicTestimonialsBlock = dynamic(() => import('./cinematic/CinematicTestimonialsBlock').then(mod => mod.CinematicTestimonialsBlock));
const CinematicFooterBlock = dynamic(() => import('./cinematic/CinematicFooterBlock').then(mod => mod.CinematicFooterBlock));

// Acid Tech Theme Blocks
const AcidTechShell = dynamic(() => import('./acid-tech/AcidTechShell').then(mod => mod.AcidTechShell));
const AcidTechSkillsBlock = dynamic(() => import('./acid-tech/AcidTechSkillsBlock').then(mod => mod.AcidTechSkillsBlock));
const AcidTechExperienceBlock = dynamic(() => import('./acid-tech/AcidTechExperienceBlock').then(mod => mod.AcidTechExperienceBlock));
const AcidTechHeroBlock = dynamic(() => import('./acid-tech/AcidTechHeroBlock').then(mod => mod.AcidTechHeroBlock));
const AcidTechMarqueeBlock = dynamic(() => import('./acid-tech/AcidTechMarqueeBlock').then(mod => mod.AcidTechMarqueeBlock));
const AcidTechAboutBlock = dynamic(() => import('./acid-tech/AcidTechAboutBlock').then(mod => mod.AcidTechAboutBlock));
const AcidTechServicesBlock = dynamic(() => import('./acid-tech/AcidTechServicesBlock').then(mod => mod.AcidTechServicesBlock));
const AcidTechProjectsBlock = dynamic(() => import('./acid-tech/AcidTechProjectsBlock').then(mod => mod.AcidTechProjectsBlock));
const AcidTech3DBlock = dynamic(() => import('./acid-tech/AcidTech3DBlock').then(mod => mod.AcidTech3DBlock));
const AcidTechStatsBlock = dynamic(() => import('./acid-tech/AcidTechStatsBlock').then(mod => mod.AcidTechStatsBlock));
const AcidTechAwardsBlock = dynamic(() => import('./acid-tech/AcidTechAwardsBlock').then(mod => mod.AcidTechAwardsBlock));
const AcidTechTestimonialsBlock = dynamic(() => import('./acid-tech/AcidTechTestimonialsBlock').then(mod => mod.AcidTechTestimonialsBlock));
const AcidTechFooterBlock = dynamic(() => import('./acid-tech/AcidTechFooterBlock').then(mod => mod.AcidTechFooterBlock));

// Bento Grid Theme Blocks
const BentoGridShell = dynamic(() => import('./bentogrid/BentoGridShell').then(mod => mod.BentoGridShell));
const BentoGridSkillsBlock = dynamic(() => import('./bentogrid/BentoGridSkillsBlock').then(mod => mod.BentoGridSkillsBlock));
const BentoGridExperienceBlock = dynamic(() => import('./bentogrid/BentoGridExperienceBlock').then(mod => mod.BentoGridExperienceBlock));
const BentoGridHeroBlock = dynamic(() => import('./bentogrid/BentoGridHeroBlock').then(mod => mod.BentoGridHeroBlock));
const BentoGridMarqueeBlock = dynamic(() => import('./bentogrid/BentoGridMarqueeBlock').then(mod => mod.BentoGridMarqueeBlock));
const BentoGridProjectsBlock = dynamic(() => import('./bentogrid/BentoGridProjectsBlock').then(mod => mod.BentoGridProjectsBlock));
const BentoGrid3DBlock = dynamic(() => import('./bentogrid/BentoGrid3DBlock').then(mod => mod.BentoGrid3DBlock));
const BentoGridAwardsBlock = dynamic(() => import('./bentogrid/BentoGridAwardsBlock').then(mod => mod.BentoGridAwardsBlock));
const BentoGridTestimonialsBlock = dynamic(() => import('./bentogrid/BentoGridTestimonialsBlock').then(mod => mod.BentoGridTestimonialsBlock));
const BentoGridFooterBlock = dynamic(() => import('./bentogrid/BentoGridFooterBlock').then(mod => mod.BentoGridFooterBlock));
const BentoGridAboutBlock = dynamic(() => import('./bentogrid/BentoGridAboutBlock').then(mod => mod.BentoGridAboutBlock));
const BentoGridServicesBlock = dynamic(() => import('./bentogrid/BentoGridServicesBlock').then(mod => mod.BentoGridServicesBlock));
const BentoGridStatsBlock = dynamic(() => import('./bentogrid/BentoGridStatsBlock').then(mod => mod.BentoGridStatsBlock));

// Brutalism Theme Blocks
const BrutalismShell = dynamic(() => import('./brutalism/BrutalismShell').then(mod => mod.BrutalismShell));
const BrutalismSkillsBlock = dynamic(() => import('./brutalism/BrutalismSkillsBlock').then(mod => mod.BrutalismSkillsBlock));
const BrutalismExperienceBlock = dynamic(() => import('./brutalism/BrutalismExperienceBlock').then(mod => mod.BrutalismExperienceBlock));
const BrutalismHeroBlock = dynamic(() => import('./brutalism/BrutalismHeroBlock').then(mod => mod.BrutalismHeroBlock));
const BrutalismStatsBlock = dynamic(() => import('./brutalism/BrutalismStatsBlock').then(mod => mod.BrutalismStatsBlock));
const BrutalismProjectsBlock = dynamic(() => import('./brutalism/BrutalismProjectsBlock').then(mod => mod.BrutalismProjectsBlock));
const Brutalism3DBlock = dynamic(() => import('./brutalism/Brutalism3DBlock').then(mod => mod.Brutalism3DBlock));
const BrutalismAwardsBlock = dynamic(() => import('./brutalism/BrutalismAwardsBlock').then(mod => mod.BrutalismAwardsBlock));
const BrutalismTestimonialsBlock = dynamic(() => import('./brutalism/BrutalismTestimonialsBlock').then(mod => mod.BrutalismTestimonialsBlock));
const BrutalismFooterBlock = dynamic(() => import('./brutalism/BrutalismFooterBlock').then(mod => mod.BrutalismFooterBlock));
const BrutalismAboutBlock = dynamic(() => import('./brutalism/BrutalismAboutBlock').then(mod => mod.BrutalismAboutBlock));
const BrutalismServicesBlock = dynamic(() => import('./brutalism/BrutalismServicesBlock').then(mod => mod.BrutalismServicesBlock));
const BrutalismMarqueeBlock = dynamic(() => import('./brutalism/BrutalismMarqueeBlock').then(mod => mod.BrutalismMarqueeBlock));

// Kinetic Avant Garde Theme Blocks
const KineticAvantGardeShell = dynamic(() => import('./kinetic-avant-garde/KineticAvantGardeShell').then(mod => mod.KineticAvantGardeShell));
const KineticAvantGardeHeroBlock = dynamic(() => import('./kinetic-avant-garde/KineticAvantGardeHeroBlock').then(mod => mod.KineticAvantGardeHeroBlock));
const KineticAvantGardeMarqueeBlock = dynamic(() => import('./kinetic-avant-garde/KineticAvantGardeMarqueeBlock').then(mod => mod.KineticAvantGardeMarqueeBlock));
const KineticAvantGardeAboutBlock = dynamic(() => import('./kinetic-avant-garde/KineticAvantGardeAboutBlock').then(mod => mod.KineticAvantGardeAboutBlock));
const KineticAvantGardeServicesBlock = dynamic(() => import('./kinetic-avant-garde/KineticAvantGardeServicesBlock').then(mod => mod.KineticAvantGardeServicesBlock));
const KineticAvantGardeSkillsBlock = dynamic(() => import('./kinetic-avant-garde/KineticAvantGardeSkillsBlock').then(mod => mod.KineticAvantGardeSkillsBlock));
const KineticAvantGardeProjectsBlock = dynamic(() => import('./kinetic-avant-garde/KineticAvantGardeProjectsBlock').then(mod => mod.KineticAvantGardeProjectsBlock));
const KineticAvantGarde3DBlock = dynamic(() => import('./kinetic-avant-garde/KineticAvantGarde3DBlock').then(mod => mod.KineticAvantGarde3DBlock));
const KineticAvantGardeStatsBlock = dynamic(() => import('./kinetic-avant-garde/KineticAvantGardeStatsBlock').then(mod => mod.KineticAvantGardeStatsBlock));
const KineticAvantGardeExperienceBlock = dynamic(() => import('./kinetic-avant-garde/KineticAvantGardeExperienceBlock').then(mod => mod.KineticAvantGardeExperienceBlock));
const KineticAvantGardeAwardsBlock = dynamic(() => import('./kinetic-avant-garde/KineticAvantGardeAwardsBlock').then(mod => mod.KineticAvantGardeAwardsBlock));
const KineticAvantGardeTestimonialsBlock = dynamic(() => import('./kinetic-avant-garde/KineticAvantGardeTestimonialsBlock').then(mod => mod.KineticAvantGardeTestimonialsBlock));
const KineticAvantGardeFooterBlock = dynamic(() => import('./kinetic-avant-garde/KineticAvantGardeFooterBlock').then(mod => mod.KineticAvantGardeFooterBlock));

// Nexus Noir Theme Blocks
const NexusNoirShell = dynamic(() => import('./nexus-noir/NexusNoirShell').then(mod => mod.NexusNoirShell));
const NexusNoirHeroBlock = dynamic(() => import('./nexus-noir/NexusNoirHeroBlock').then(mod => mod.NexusNoirHeroBlock));
const NexusNoirMarqueeBlock = dynamic(() => import('./nexus-noir/NexusNoirMarqueeBlock').then(mod => mod.NexusNoirMarqueeBlock));
const NexusNoirAboutBlock = dynamic(() => import('./nexus-noir/NexusNoirAboutBlock').then(mod => mod.NexusNoirAboutBlock));
const NexusNoirSkillsBlock = dynamic(() => import('./nexus-noir/NexusNoirSkillsBlock').then(mod => mod.NexusNoirSkillsBlock));
const NexusNoirExperienceBlock = dynamic(() => import('./nexus-noir/NexusNoirExperienceBlock').then(mod => mod.NexusNoirExperienceBlock));
const NexusNoirServicesBlock = dynamic(() => import('./nexus-noir/NexusNoirServicesBlock').then(mod => mod.NexusNoirServicesBlock));
const NexusNoirStatsBlock = dynamic(() => import('./nexus-noir/NexusNoirStatsBlock').then(mod => mod.NexusNoirStatsBlock));
const NexusNoirProjectsBlock = dynamic(() => import('./nexus-noir/NexusNoirProjectsBlock').then(mod => mod.NexusNoirProjectsBlock));
const NexusNoir3DBlock = dynamic(() => import('./nexus-noir/NexusNoir3DBlock').then(mod => mod.NexusNoir3DBlock));
const NexusNoirAwardsBlock = dynamic(() => import('./nexus-noir/NexusNoirAwardsBlock').then(mod => mod.NexusNoirAwardsBlock));
const NexusNoirTestimonialsBlock = dynamic(() => import('./nexus-noir/NexusNoirTestimonialsBlock').then(mod => mod.NexusNoirTestimonialsBlock));
const NexusNoirFooterBlock = dynamic(() => import('./nexus-noir/NexusNoirFooterBlock').then(mod => mod.NexusNoirFooterBlock));

// ====================
// HORIZONTAL FLOW BLOCKS
// ====================
const HorizontalFlowShell = dynamic(() => import('./horizontal-flow/HorizontalFlowShell').then(mod => mod.HorizontalFlowShell));
const HorizontalFlowHeroBlock = dynamic(() => import('./horizontal-flow/HorizontalFlowHeroBlock').then(mod => mod.HorizontalFlowHeroBlock));
const HorizontalFlowMarqueeBlock = dynamic(() => import('./horizontal-flow/HorizontalFlowMarqueeBlock').then(mod => mod.HorizontalFlowMarqueeBlock));
const HorizontalFlowAboutBlock = dynamic(() => import('./horizontal-flow/HorizontalFlowAboutBlock').then(mod => mod.HorizontalFlowAboutBlock));
const HorizontalFlowStatsBlock = dynamic(() => import('./horizontal-flow/HorizontalFlowStatsBlock').then(mod => mod.HorizontalFlowStatsBlock));
const HorizontalFlowProjectsBlock = dynamic(() => import('./horizontal-flow/HorizontalFlowProjectsBlock').then(mod => mod.HorizontalFlowProjectsBlock));
const HorizontalFlow3DBlock = dynamic(() => import('./horizontal-flow/HorizontalFlow3DBlock').then(mod => mod.HorizontalFlow3DBlock));
const HorizontalFlowServicesBlock = dynamic(() => import('./horizontal-flow/HorizontalFlowServicesBlock').then(mod => mod.HorizontalFlowServicesBlock));
const HorizontalFlowSkillsBlock = dynamic(() => import('./horizontal-flow/HorizontalFlowSkillsBlock').then(mod => mod.HorizontalFlowSkillsBlock));
const HorizontalFlowExperienceBlock = dynamic(() => import('./horizontal-flow/HorizontalFlowExperienceBlock').then(mod => mod.HorizontalFlowExperienceBlock));
const HorizontalFlowTestimonialsBlock = dynamic(() => import('./horizontal-flow/HorizontalFlowTestimonialsBlock').then(mod => mod.HorizontalFlowTestimonialsBlock));
const HorizontalFlowAwardsBlock = dynamic(() => import('./horizontal-flow/HorizontalFlowAwardsBlock').then(mod => mod.HorizontalFlowAwardsBlock));
const HorizontalFlowFooterBlock = dynamic(() => import('./horizontal-flow/HorizontalFlowFooterBlock').then(mod => mod.HorizontalFlowFooterBlock));

// Split Screen Studio Theme Blocks
const SplitScreenStudioShell = dynamic(() => import('./split-screen-studio/SplitScreenStudioShell').then(mod => mod.SplitScreenStudioShell));
const SplitScreenStudioHeroBlock = dynamic(() => import('./split-screen-studio/SplitScreenStudioHeroBlock').then(mod => mod.SplitScreenStudioHeroBlock));
const SplitScreenStudioMarqueeBlock = dynamic(() => import('./split-screen-studio/SplitScreenStudioMarqueeBlock').then(mod => mod.SplitScreenStudioMarqueeBlock));
const SplitScreenStudioAboutBlock = dynamic(() => import('./split-screen-studio/SplitScreenStudioAboutBlock').then(mod => mod.SplitScreenStudioAboutBlock));
const SplitScreenStudioServicesBlock = dynamic(() => import('./split-screen-studio/SplitScreenStudioServicesBlock').then(mod => mod.SplitScreenStudioServicesBlock));
const SplitScreenStudioStatsBlock = dynamic(() => import('./split-screen-studio/SplitScreenStudioStatsBlock').then(mod => mod.SplitScreenStudioStatsBlock));
const SplitScreenStudioProjectsBlock = dynamic(() => import('./split-screen-studio/SplitScreenStudioProjectsBlock').then(mod => mod.SplitScreenStudioProjectsBlock));
const SplitScreenStudio3DBlock = dynamic(() => import('./split-screen-studio/SplitScreenStudio3DBlock').then(mod => mod.SplitScreenStudio3DBlock));
const SplitScreenStudioAwardsBlock = dynamic(() => import('./split-screen-studio/SplitScreenStudioAwardsBlock').then(mod => mod.SplitScreenStudioAwardsBlock));
const SplitScreenStudioTestimonialsBlock = dynamic(() => import('./split-screen-studio/SplitScreenStudioTestimonialsBlock').then(mod => mod.SplitScreenStudioTestimonialsBlock));
const SplitScreenStudioSkillsBlock = dynamic(() => import('./split-screen-studio/SplitScreenStudioSkillsBlock').then(mod => mod.SplitScreenStudioSkillsBlock));
const SplitScreenStudioExperienceBlock = dynamic(() => import('./split-screen-studio/SplitScreenStudioExperienceBlock').then(mod => mod.SplitScreenStudioExperienceBlock));
const SplitScreenStudioFooterBlock = dynamic(() => import('./split-screen-studio/SplitScreenStudioFooterBlock').then(mod => mod.SplitScreenStudioFooterBlock));

const UniversalPlayer = dynamic(() => import('@/components/ui/UniversalPlayer').then(mod => mod.UniversalPlayer));
const BlockEditorWrapper = dynamic(() => import('@/components/features/appearance/BlockEditorWrapper').then(mod => mod.BlockEditorWrapper));
const VideoShowcaseRenderer = dynamic(() => import('./video-showcase/VideoShowcaseRenderer'));

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

  // GLOBAL SMART BLOCKS
  if (baseBlockType === 'FAQ' || block.blockType === 'FAQ') {
    content = <FaqRenderer themeId={activeThemeTemplate} data={data} theme={theme} isEditor={isEditor} />;
  } else if (baseBlockType === 'SHOWCASE' || block.blockType === 'VIDEO_SHOWCASE') {
    content = <VideoShowcaseRenderer themeId={activeThemeTemplate} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />;
  }

  // 1. SMART MAPPING: Render blok sesuai dengan tema yang sedang aktif
  if (!content) {
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
      case 'PENPOT': content = data?.id || data?.userId ? <div className="w-full px-6 md:px-12"><div className="max-w-[1400px] mx-auto"><PenpotShowcase userId={userId} variant="aura" themeColor={themeColor} /></div></div> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <div className="w-full px-6 md:px-12"><div className="max-w-[1400px] mx-auto"><CanvaShowcase userId={userId} variant="aura" themeColor={themeColor} /></div></div> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <div className="w-full px-6 md:px-12"><div className="max-w-[1400px] mx-auto"><GithubStats userId={userId} variant="aura" themeColor={themeColor} /></div></div> : null; break;
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
      case 'PROJECTS': content = <NexusNoirProjectsBlock {...commonProps} setSelectedMedia={setSelectedMedia} />; break;
      case '3D': content = <NexusNoir3DBlock {...commonProps} />; break;
      case 'AWARDS': content = <NexusNoirAwardsBlock {...commonProps} />; break;
      case 'TESTIMONIALS': content = <NexusNoirTestimonialsBlock {...commonProps} />; break;
      case 'FOOTER': content = <NexusNoirFooterBlock {...commonProps} />; break;
      case 'PENPOT': content = data?.id || data?.userId ? <div className="w-full bg-[#030303] text-white"><PenpotShowcase userId={userId} variant="nexus-noir" /></div> : null; break;
      case 'CANVA': content = data?.id || data?.userId ? <div className="w-full bg-[#030303] text-white"><CanvaShowcase userId={userId} variant="nexus-noir" /></div> : null; break;
      case 'GITHUB': content = data?.id || data?.userId ? <div className="w-full bg-[#030303] text-white"><GithubStats userId={userId} variant="nexus-noir" /></div> : null; break;
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
  }
} // End of if (!content)
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
  const [selectedMedia, setSelectedMediaState] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);

  const setSelectedMedia = (media: any) => {
    setSelectedMediaState(media);
    if (media && !isEditor) {
      const allProjects = data?.projects || data?.user?.projects || [];
      const matchedProject = allProjects.find((p: any) => p.mediaUrl === media.url || p.title === media.title);
      if (matchedProject && matchedProject.id) {
        const subdomain = data?.profile?.subdomain || data?.subdomain || "";
        if (subdomain) {
          import('@/lib/analyticsClient').then(({ trackProjectClick }) => {
            trackProjectClick(subdomain, matchedProject.id, matchedProject.title);
          }).catch(err => console.error('Failed to track project click:', err));
        }
      }
    }
  };

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // SECURITY: Cegah injeksi dari domain asing
      if (event.origin !== window.location.origin && !event.origin.includes('localhost') && !event.origin.includes('127.0.0.1')) return;

      if (event.data?.type === 'OPEN_LIBRARY') {
        setInsertIndex(event.data.insertIndex);
        setIsLibraryOpen(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (isEditor) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      console.log("[Analytics Debug] Click target:", target);

      const subdomain = data?.profile?.subdomain || data?.subdomain || "";
      if (!subdomain) {
        console.log("[Analytics Debug] Subdomain not found, skipping event tracking.");
        return;
      }

      // ── 1. DETEKSI KLIK LINK SOSIAL MEDIA, KONTAK, DAN TOMBOL GALERI ──────────
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href') || '';
        
        // a. Klik Tombol Galeri
        if (href.includes('/gallery')) {
          console.log("[Analytics Debug] Gallery button link clicked:", href);
          import('@/lib/analyticsClient').then(({ trackCustomEvent }) => {
            trackCustomEvent(subdomain, 'GALLERY_CLICK', undefined, { url: href });
          }).catch(err => console.error('[Analytics Debug] Failed to track gallery click:', err));
          return; // Stop di sini agar tidak memicu deteksi proyek
        }
        
        // b. Klik Kontak (Email, Telepon, WhatsApp)
        if (href.startsWith('mailto:')) {
          console.log("[Analytics Debug] Contact Email clicked:", href);
          import('@/lib/analyticsClient').then(({ trackCustomEvent }) => {
            trackCustomEvent(subdomain, 'CONTACT_CLICK', undefined, { platform: 'Email', value: href });
          }).catch(err => console.error('[Analytics Debug] Failed to track contact email click:', err));
          return;
        }
        
        if (href.startsWith('tel:')) {
          console.log("[Analytics Debug] Contact Phone clicked:", href);
          import('@/lib/analyticsClient').then(({ trackCustomEvent }) => {
            trackCustomEvent(subdomain, 'CONTACT_CLICK', undefined, { platform: 'Phone', value: href });
          }).catch(err => console.error('[Analytics Debug] Failed to track contact phone click:', err));
          return;
        }
        
        if (href.includes('wa.me') || href.includes('api.whatsapp.com') || href.includes('whatsapp:')) {
          console.log("[Analytics Debug] Contact WhatsApp clicked:", href);
          import('@/lib/analyticsClient').then(({ trackCustomEvent }) => {
            trackCustomEvent(subdomain, 'CONTACT_CLICK', undefined, { platform: 'WhatsApp', value: href });
          }).catch(err => console.error('[Analytics Debug] Failed to track contact whatsapp click:', err));
          return;
        }
        
        // c. Klik Outbound Link Sosmed
        if (href.startsWith('http') && !href.includes(window.location.host)) {
          const getSocialPlatform = (url: string): string => {
            const lowercaseUrl = url.toLowerCase();
            if (lowercaseUrl.includes('instagram.com')) return 'Instagram';
            if (lowercaseUrl.includes('linkedin.com')) return 'LinkedIn';
            if (lowercaseUrl.includes('github.com')) return 'GitHub';
            if (lowercaseUrl.includes('twitter.com') || lowercaseUrl.includes('x.com')) return 'Twitter / X';
            if (lowercaseUrl.includes('tiktok.com')) return 'TikTok';
            if (lowercaseUrl.includes('facebook.com')) return 'Facebook';
            if (lowercaseUrl.includes('youtube.com') || lowercaseUrl.includes('youtu.be')) return 'YouTube';
            if (lowercaseUrl.includes('dribbble.com')) return 'Dribbble';
            if (lowercaseUrl.includes('behance.net')) return 'Behance';
            return 'External Link';
          };
          const platform = getSocialPlatform(href);
          console.log(`[Analytics Debug] Social Outbound Link (${platform}) clicked:`, href);
          import('@/lib/analyticsClient').then(({ trackCustomEvent }) => {
            trackCustomEvent(subdomain, 'SOCIAL_CLICK', undefined, { platform, url: href });
          }).catch(err => console.error('[Analytics Debug] Failed to track social click:', err));
          return;
        }
      }

      // ── 2. DETEKSI KLIK KARTU PROYEK (KARYA) ──────────────────────────────────
      const card = target.closest('.cursor-pointer, [class*="cursor-pointer"], .group, button, a');
      if (!card) {
        console.log("[Analytics Debug] No clickable card parent found.");
        return;
      }
      console.log("[Analytics Debug] Found card:", card);

      const isProjectArea = card.closest('[id*="project" i], [id*="work" i], [class*="project" i], [class*="work" i], [class*="gallery" i], [id*="gallery" i]');
      if (!isProjectArea) {
        console.log("[Analytics Debug] Click is outside project area.");
        return;
      }
      console.log("[Analytics Debug] Click is inside project area:", isProjectArea);

      let projectTitle = '';

      const imgEl = card.querySelector('img');
      if (imgEl) {
        projectTitle = imgEl.getAttribute('alt') || '';
        console.log("[Analytics Debug] Extracted title from image alt:", projectTitle);
      }

      if (!projectTitle) {
        const headingEl = card.querySelector('h2, h3, h4');
        if (headingEl) {
          projectTitle = headingEl.textContent?.trim() || '';
          console.log("[Analytics Debug] Extracted title from heading:", projectTitle);
        }
      }

      if (!projectTitle && target.tagName === 'IMG') {
        projectTitle = target.getAttribute('alt') || '';
        console.log("[Analytics Debug] Extracted title from direct img target:", projectTitle);
      }

      if (projectTitle) {
        projectTitle = projectTitle.replace(/^(PRJ\s+)?\d+\.\s*/i, '').trim();
      }

      console.log("[Analytics Debug] Final processed title:", projectTitle);

      if (projectTitle) {
        const allProjects = data?.projects || data?.user?.projects || [];
        console.log("[Analytics Debug] Total database projects available:", allProjects.length);

        const matchedProject = allProjects.find((p: any) => {
          const dbTitle = p.title.trim().toLowerCase();
          const clickTitle = projectTitle.toLowerCase();
          return dbTitle === clickTitle || clickTitle.includes(dbTitle) || dbTitle.includes(clickTitle);
        });

        if (matchedProject && matchedProject.id) {
          console.log("[Analytics Debug] Match found in DB:", matchedProject);
          import('@/lib/analyticsClient').then(({ trackProjectClick }) => {
            console.log("[Analytics Debug] Triggering tracking client for project:", subdomain, matchedProject.id);
            trackProjectClick(subdomain, matchedProject.id, matchedProject.title);
          }).catch(err => console.error('[Analytics Debug] Failed to track project click globally:', err));
        } else {
          console.log("[Analytics Debug] No matching project found in database.");
        }
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => document.removeEventListener('click', handleGlobalClick, { capture: true });
  }, [data, isEditor]);

  // Filter available blocks that are not currently in the layout
  const allAvailableBlocks = [
    { type: 'HERO', name: 'Hero / Utama', icon: 'fa-star' },
    { type: 'MARQUEE', name: 'Teks Berjalan', icon: 'fa-exchange-alt' },
    { type: 'ABOUT', name: 'Tentang Saya', icon: 'fa-user' },
    { type: 'SERVICES', name: 'Layanan', icon: 'fa-briefcase' },
    { type: 'STATS', name: 'Statistik', icon: 'fa-chart-bar' },
    { type: 'SKILLS', name: 'Keahlian', icon: 'fa-tools' },
    { type: 'EXPERIENCE', name: 'Pengalaman', icon: 'fa-history' },
    { type: 'PROJECTS', name: 'Portofolio', icon: 'fa-images' },
    { type: 'AWARDS', name: 'Penghargaan', icon: 'fa-trophy' },
    { type: 'TESTIMONIALS', name: 'Testimoni', icon: 'fa-comment-alt' },
    { type: '3D', name: 'Showcase 3D', icon: 'fa-cube' },
    { type: 'FAQ', name: 'Tanya Jawab', icon: 'fa-question-circle' },
    { type: 'VIDEO_SHOWCASE', name: 'Video Showcase', icon: 'fa-play-circle' },
    { type: 'FOOTER', name: 'Footer', icon: 'fa-shoe-prints' },
  ];

  const existingBlockTypes = new Set(blocks.map((b: any) => {
    if (b.blockType === 'VIDEO_SHOWCASE') return 'VIDEO_SHOWCASE';
    const parts = b.blockType.split('_');
    return parts.length > 1 ? parts.slice(1).join('_') : b.blockType;
  }));

  const addableBlocks = allAvailableBlocks.filter(b => !existingBlockTypes.has(b.type));

  const handleAddBlock = (blockType: string) => {
    window.parent.postMessage({ type: 'BLOCK_ADD', blockType, insertIndex }, window.location.origin);
    setIsLibraryOpen(false);
    setInsertIndex(null);
  };

  const LibraryUI = isEditor && isLibraryOpen ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pointer-events-auto">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-none shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 lg:p-6 border-b border-white/10 flex justify-between items-center bg-black">
              <h3 className="text-white font-mono font-bold text-xs uppercase tracking-widest">Library Seksi</h3>
              <button onClick={() => setIsLibraryOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-none border border-white/10 bg-zinc-900 text-white/50 hover:text-[#ff9e00] hover:border-[#ff9e00]/50 transition-colors">
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>
            <div className="p-4 lg:p-6 overflow-y-auto flex-1 grid grid-cols-2 gap-4 custom-scrollbar bg-zinc-950">
              {addableBlocks.length > 0 ? addableBlocks.map(b => (
                <button 
                  key={b.type}
                  onClick={() => handleAddBlock(b.type)}
                  className="flex flex-col items-center justify-center p-6 rounded-none border border-white/10 bg-zinc-900/30 hover:bg-[#ff9e00]/5 hover:border-[#ff9e00]/50 transition-all text-white/70 hover:text-[#ff9e00] gap-3 group"
                >
                  <i className={`fas ${b.icon} text-2xl mb-1 text-white/30 group-hover:text-[#ff9e00] transition-colors`}></i>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-center leading-relaxed">{b.name}</span>
                </button>
              )) : (
                <div className="col-span-2 py-16 flex flex-col items-center justify-center text-white/20 border border-dashed border-white/10">
                  <i className="fas fa-check-circle text-4xl mb-4"></i>
                  <p className="text-xs font-mono uppercase tracking-widest font-bold">Semua Seksi Telah Digunakan</p>
                </div>
              )}
            </div>
          </div>
        </div>
  ) : null;

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
            .min-theme .font-sans { font-family: ${bodyFont} !important; }
            .min-theme .font-serif { font-family: ${headingFont} !important; }
            .min-theme .font-heading { font-family: ${headingFont} !important; }
            .min-theme .font-body { font-family: ${bodyFont} !important; }
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

  const finalContent = isEditor ? (
    <div className="flex flex-col w-full min-h-screen">
      {content}
      {LibraryUI}
      <GlobalCursor enabled={theme?.customTexts?.custom_cursor_enabled === 'true'} type={theme?.customTexts?.custom_cursor_type || 'circle-dot'} />
    </div>
  ) : (
    <>
      {content}
      <GlobalCursor enabled={theme?.customTexts?.custom_cursor_enabled === 'true'} type={theme?.customTexts?.custom_cursor_type || 'circle-dot'} />
    </>
  );

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
          {finalContent}
        </ReactLenis>
      </>
    );
  }

  return finalContent;
};

