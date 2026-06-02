const fs = require('fs');
const path = require('path');

const widgets = ['GithubStats.tsx', 'CanvaShowcase.tsx', 'PenpotShowcase.tsx'];
const dir = path.join(__dirname, 'components', 'themes', 'widgets');

widgets.forEach(widget => {
  const file = path.join(dir, widget);
  let content = fs.readFileSync(file, 'utf8');

  // Update StatsVariant
  content = content.replace(
    /export type StatsVariant = '[^']+';/g,
    match => {
      // It's a long union, let's just replace the exact line if we can't regex it properly.
      return match;
    }
  );
  content = content.replace(
    /export type StatsVariant = [^;]+;/,
    "export type StatsVariant = 'monochrome' | 'classic' | 'acid' | 'aura' | 'noir' | 'bento' | 'brutalism' | 'cinematic' | 'editorial' | 'midnight' | 'monolith' | 'spatial' | 'split' | 'viewfinder' | 'minimalist' | 'split-screen-studio' | 'horizontal-flow' | 'kinetic-avant-garde' | 'layered-monolith' | 'nexus-noir';"
  );
  
  // Update isDynamic string list
  content = content.replace(
    /const isDynamic = variant === 'acid'[^;]+;/,
    "const isDynamic = ['acid', 'aura', 'noir', 'bento', 'brutalism', 'cinematic', 'editorial', 'midnight', 'monolith', 'spatial', 'split', 'viewfinder', 'minimalist', 'split-screen-studio', 'horizontal-flow', 'kinetic-avant-garde', 'layered-monolith', 'nexus-noir'].includes(variant);"
  );

  // Auto-hide logic for GithubStats (Canva and Penpot already have it)
  if (widget === 'GithubStats.tsx') {
    if (!content.includes('if (hasNoPublicRepos) return null;')) {
      content = content.replace(
        /const hasNoPublicRepos = !isLoading && !data\?\.topRepo && \(\!data\?\.languages \|\| data\.languages\.length === 0\);/,
        "const hasNoPublicRepos = !isLoading && !data?.topRepo && (!data?.languages || data.languages.length === 0);\n  if (hasNoPublicRepos) return null;"
      );
      // Remove the empty state rendering block
      content = content.replace(
        /\) : hasNoPublicRepos \? \([\s\S]*?\) : \(/,
        ") : ("
      );
    }
  }

  // Add styles
  const newStyles = `
    'horizontal-flow': {
      section: 'flex-shrink-0 w-[85vw] @md:w-[60vw] @lg:w-[45vw] h-full p-8 @md:p-12 border-r border-black/10 bg-white snap-center',
      heading: 'text-3xl font-bold tracking-tight text-black mb-6',
      label: 'text-[10px] font-mono text-gray-500 uppercase',
      border: 'border-black/10',
      cardBg: 'bg-gray-50 border border-black/5',
      icon: 'text-black',
      textPrimary: 'text-black',
      textSecondary: 'text-gray-500',
      progressBg: 'bg-gray-200',
      progressFill: 'bg-black',
      calendarColorScheme: 'light' as const
    },
    'kinetic-avant-garde': {
      section: 'w-full p-8 @lg:p-16 border-b-4 border-black bg-[#E5E5E5]',
      heading: 'font-mono text-4xl @md:text-6xl font-black uppercase text-black tracking-tighter mb-8',
      label: 'font-mono text-xs font-bold bg-black text-white px-2 py-1 uppercase',
      border: 'border-black border-2',
      cardBg: 'bg-white border-4 border-black shadow-[8px_8px_0_0_#000]',
      icon: 'text-black',
      textPrimary: 'font-mono text-black font-bold',
      textSecondary: 'font-mono text-black/70',
      progressBg: 'bg-gray-300 border-2 border-black',
      progressFill: 'bg-black',
      calendarColorScheme: 'light' as const
    },
    'layered-monolith': {
      section: 'w-full px-6 @md:px-12 py-20 relative z-20',
      heading: 'font-serif text-3xl @md:text-5xl text-white mb-8',
      label: 'font-sans text-[10px] tracking-widest uppercase text-[var(--hl)] mb-4 block',
      border: 'border-white/10',
      cardBg: 'bg-[#111] border border-white/5 shadow-2xl backdrop-blur-md',
      icon: 'text-white/80',
      textPrimary: 'text-white font-serif',
      textSecondary: 'text-white/50 text-xs',
      progressBg: 'bg-white/10',
      progressFill: 'bg-[var(--hl)]',
      calendarColorScheme: 'dark' as const
    },
    'nexus-noir': {
      section: 'w-full px-6 @md:px-10 py-16 border-t border-[#333] bg-[#050505]',
      heading: 'font-serif text-2xl text-white tracking-wide uppercase',
      label: 'font-mono text-[10px] text-gray-500',
      border: 'border-[#333]',
      cardBg: 'bg-[#0a0a0a] border border-[#222]',
      icon: 'text-gray-400',
      textPrimary: 'text-gray-100',
      textSecondary: 'text-gray-500',
      progressBg: 'bg-[#222]',
      progressFill: 'bg-gray-300',
      calendarColorScheme: 'dark' as const
    }
  };`;

  if (!content.includes("'horizontal-flow': {")) {
    content = content.replace(/};\s*const s = styles\[variant\]/, match => newStyles.replace('};', '') + "\n  " + match);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated ' + widget);
});
