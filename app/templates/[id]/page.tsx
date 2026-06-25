"use client";

import React, { use } from 'react';
import { THEMES_DATA } from '@/features/themes/config/themesData';
import PortfolioView from '@/components/PortfolioView';
import { notFound } from 'next/navigation';
import { SWRConfig } from 'swr';

const DUMMY_DATA = {
  id: 'demo',
  profile: {
    fullName: "Aura Spatial",
    profession: "Digital Designer & Creative Developer",
    bio: "I craft immersive digital experiences, pushing the boundaries of web design with kinetic typography, 3D interactions, and bold aesthetics.",
    location: "Jakarta, Indonesia",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300",
    subdomain: "demo"
  },
  links: [
    { id: '1', platform: 'Twitter', url: 'https://twitter.com', isActive: true },
    { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com', isActive: true },
    { id: '3', platform: 'Instagram', url: 'https://instagram.com', isActive: true }
  ],
  skills: [
    { id: '1', name: 'UI/UX Design', category: 'Design', proficiency: 95 },
    { id: '2', name: 'React & Next.js', category: 'Frontend', proficiency: 90 },
    { id: '3', name: 'Three.js / WebGL', category: 'Creative Dev', proficiency: 85 },
    { id: '4', name: 'Framer Motion', category: 'Frontend', proficiency: 90 }
  ],
  experiences: [
    {
      id: '1',
      title: 'Senior Creative Developer',
      company: 'Studio Form',
      startDate: '2021',
      endDate: 'Present',
      description: 'Leading a team of creative developers to build award-winning Awwwards sites.'
    },
    {
      id: '2',
      title: 'UI/UX Designer',
      company: 'Digital Agency',
      startDate: '2019',
      endDate: '2021',
      description: 'Designed modern web applications and mobile experiences.'
    }
  ],
  projects: [
    {
      id: '1',
      title: 'Neon Cyberspace',
      description: 'An immersive 3D experience exploring futuristic cyberpunk aesthetics.',
      mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
      projectType: 'photo',
      tags: ['WebGL', 'Three.js', 'React']
    },
    {
      id: '2',
      title: 'Minimalist E-Commerce',
      description: 'A clean, high-conversion e-commerce storefront.',
      mediaUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
      projectType: 'photo',
      tags: ['Next.js', 'Tailwind', 'Stripe']
    },
    {
      id: '3',
      title: 'Brand Identity: Vertex',
      description: 'Complete rebranding for a modern architectural firm.',
      mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop',
      projectType: 'photo',
      tags: ['Branding', 'Typography', 'Logo']
    }
  ],
  awards: [
    { id: '1', title: 'Site of the Day', issuer: 'Awwwards', date: '2023', description: 'For outstanding web design' }
  ],
  services: [
    { id: '1', name: 'Art Direction', description: 'Crafting visually stunning digital identities.' },
    { id: '2', name: 'Creative Coding', description: 'Bringing designs to life with advanced animations.' }
  ],
  stats: [
    { id: '1', label: 'Projects Completed', value: '45+', icon: 'fa-check' },
    { id: '2', label: 'Years Experience', value: '5+', icon: 'fa-calendar' },
    { id: '3', label: 'Awards Won', value: '12', icon: 'fa-trophy' }
  ],
  testimonials: [
    {
      id: '1',
      clientName: 'Jane Doe',
      clientRole: 'CEO, TechCorp',
      content: 'Absolutely brilliant work. The attention to detail is unmatched.',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150'
    }
  ],
  pageBlocks: [
    { id: 'b1', blockType: 'HERO', orderIndex: 0, isVisible: true },
    { id: 'b2', blockType: 'MARQUEE', orderIndex: 1, isVisible: true },
    { id: 'b3', blockType: 'ABOUT', orderIndex: 2, isVisible: true },
    { id: 'b4', blockType: 'SERVICES', orderIndex: 3, isVisible: true },
    { id: 'b5', blockType: 'STATS', orderIndex: 4, isVisible: true },
    { id: 'b6', blockType: 'SKILLS', orderIndex: 5, isVisible: true },
    { id: 'b7', blockType: 'EXPERIENCE', orderIndex: 6, isVisible: true },
    { id: 'b8', blockType: 'PROJECTS', orderIndex: 7, isVisible: true },
    { id: 'b9', blockType: 'GITHUB', orderIndex: 8, isVisible: true },
    { id: 'b10', blockType: 'AWARDS', orderIndex: 9, isVisible: true },
    { id: 'b11', blockType: 'TESTIMONIALS', orderIndex: 10, isVisible: true },
    { id: 'b12', blockType: 'FAQ', orderIndex: 11, isVisible: true },
    { id: 'b13', blockType: 'FOOTER', orderIndex: 12, isVisible: true }
  ]
};

export default function TemplatePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const themeId = resolvedParams.id;
  const themeData = THEMES_DATA.find(t => t.id === themeId);

  if (!themeData) {
    notFound();
  }

  // Determine best accent color based on theme
  let defaultThemeColor = '#ffffff';
  if (themeId === 'brutalism' || themeId === 'acid' || themeId === 'acid-tech') {
    defaultThemeColor = '#ff9e00'; // Bright accent for brutalism/acid
  } else if (themeId === 'editorial' || themeId === 'minimalist') {
    defaultThemeColor = '#000000'; // Black for clean white themes
  }

  // Format theme payload as expected by PortfolioView
  const themePayload = {
    themeTemplate: themeId,
    themeColor: defaultThemeColor,
    ...themeData
  };

  return (
    <>
      {/* Return to Templates Button */}
      <div className="fixed top-6 left-6 z-[999]">
        <a 
          href="/templates" 
          className="bg-black/50 hover:bg-black/80 backdrop-blur-md text-white border border-white/10 px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all hover:scale-105 flex items-center gap-2"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Gallery
        </a>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999]">
        <a 
          href={`/register?theme=${themeId}`} 
          className="bg-[#ff9e00] hover:bg-white text-black px-6 py-3 rounded-full text-xs font-mono font-bold tracking-widest uppercase transition-all hover:scale-105 shadow-2xl flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>
          </svg>
          Use This Template
        </a>
      </div>

      {/* Render the Portfolio View with dummy data and SWR Config for Github Block */}
      <SWRConfig value={{
        fallback: {
          '/api/github/stats?userId=demo': {
            username: 'shadcn',
            topRepos: [
              { name: 'open-source-ui', url: '#', description: 'A futuristic open source library for React.', stars: 12500, watchers: 340, forks: 1200, language: 'TypeScript', languageColor: '#3178c6' },
              { name: 'webgl-experiments', url: '#', description: 'Collection of WebGL shaders and 3D kinetic text.', stars: 8900, watchers: 210, forks: 450, language: 'GLSL', languageColor: '#563d7c' },
              { name: 'react-framer-components', url: '#', description: 'Highly accessible, animated UI components.', stars: 5400, watchers: 120, forks: 300, language: 'TypeScript', languageColor: '#3178c6' }
            ],
            languages: [
              { name: 'TypeScript', percent: 65, color: '#3178c6' },
              { name: 'GLSL', percent: 25, color: '#563d7c' },
              { name: 'JavaScript', percent: 10, color: '#f1e05a' }
            ]
          },
          '/api/github/events?userId=demo': [
            { id: '1', type: 'PushEvent', repo: { name: 'auraspatial/webgl-experiments' }, created_at: new Date().toISOString(), payload: { commits: [{ message: 'Add new warp shader' }] } },
            { id: '2', type: 'CreateEvent', repo: { name: 'auraspatial/open-source-ui' }, created_at: new Date(Date.now() - 86400000).toISOString(), payload: { ref_type: 'repository' } },
            { id: '3', type: 'WatchEvent', repo: { name: 'facebook/react' }, created_at: new Date(Date.now() - 172800000).toISOString() }
          ]
        },
        revalidateOnMount: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}>
        <PortfolioView 
          data={DUMMY_DATA} 
          theme={themePayload} 
          isEditor={false} 
          isCardPreview={false}
        />
      </SWRConfig>
    </>
  );
}
