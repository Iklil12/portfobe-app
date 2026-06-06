const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components/blocks/DynamicBlockRenderer.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const THEMES = [
  { id: 'minimalist', prefix: 'Minimalist', folder: 'minimalist' },
  { id: 'spatial', prefix: 'Spatial', folder: 'spatial' },
  { id: 'obsidian-reel', prefix: 'Obsidian', folder: 'obsidian-reel' },
  { id: 'aura-kinetic', prefix: 'AuraKinetic', folder: 'aura-kinetic' },
  { id: 'editorial', prefix: 'Editorial', folder: 'editorial' },
  { id: 'midnight-emulsion', prefix: 'MidnightEmulsion', folder: 'midnight-emulsion' },
  { id: 'viewfinder', prefix: 'Viewfinder', folder: 'viewfinder' },
  { id: 'monolith', prefix: 'Monolith', folder: 'monolith' },
  { id: 'layered-monolith', prefix: 'LayeredMonolith', folder: 'layered-monolith' },
  { id: 'absolute-noir', prefix: 'AbsoluteNoir', folder: 'absolute-noir' },
  { id: 'cinematic', prefix: 'Cinematic', folder: 'cinematic' },
  { id: 'cinematic-gallery', prefix: 'CinematicGallery', folder: 'cinematic-gallery' },
  { id: 'acid-tech', prefix: 'AcidTech', folder: 'acid-tech' },
  { id: 'bentogrid', prefix: 'BentoGrid', folder: 'bentogrid' },
  { id: 'brutalism', prefix: 'Brutalism', folder: 'brutalism' },
  { id: 'nexus-split', prefix: 'NexusSplit', folder: 'nexus-split' } // actually 'split' theme in code
];

// Add imports
for (const theme of THEMES) {
  // Find where the theme's imports are, e.g. import { MinimalistHeroBlock
  const importRegex = new RegExp(`import \\{ ${theme.prefix}HeroBlock`);
  if (importRegex.test(content)) {
    const importStr = `import { ${theme.prefix}SkillsBlock } from './${theme.folder}/${theme.prefix}SkillsBlock';
import { ${theme.prefix}ExperienceBlock } from './${theme.folder}/${theme.prefix}ExperienceBlock';
import { ${theme.prefix}HeroBlock`;
    content = content.replace(importRegex, importStr);
  }
}

// Add switch cases
const switchCases = [
  { templateId: 'minimalist', prefix: 'Minimalist' },
  { templateId: 'spatial', prefix: 'Spatial' },
  { templateId: 'obsidian-reel', prefix: 'Obsidian' },
  { templateId: 'aura-kinetic', prefix: 'AuraKinetic' },
  { templateId: 'editorial', prefix: 'Editorial' },
  { templateId: 'midnight-emulsion', prefix: 'MidnightEmulsion' },
  { templateId: 'viewfinder', prefix: 'Viewfinder' },
  { templateId: 'monolith', prefix: 'Monolith' },
  { templateId: 'layered-monolith', prefix: 'LayeredMonolith' },
  { templateId: 'absolute-noir', prefix: 'AbsoluteNoir' },
  { templateId: 'cinematic', prefix: 'Cinematic' },
  { templateId: 'cinematic-gallery', prefix: 'CinematicGallery' },
  { templateId: 'bentogrid', prefix: 'BentoGrid' },
  { templateId: 'brutalism', prefix: 'Brutalism' },
  { templateId: 'split', prefix: 'NexusSplit' }
];

for (const sc of switchCases) {
  // Find the block for the theme
  const blockRegex = new RegExp(`else if \\(activeThemeTemplate === '${sc.templateId}'[^\\{]*\\{([\\s\\S]*?)\\}\\s*else if`);
  let match = blockRegex.exec(content);
  if (!match) {
    // try last else if
    const lastBlockRegex = new RegExp(`else if \\(activeThemeTemplate === '${sc.templateId}'[^\\{]*\\{([\\s\\S]*?)\\}\\s*\\}\\s*if \\(content === undefined\\)`);
    match = lastBlockRegex.exec(content);
  }
  
  // also check simple if statement for minimalist
  if (!match) {
      const firstBlockRegex = new RegExp(`if \\(activeThemeTemplate === '${sc.templateId}'[^\\{]*\\{([\\s\\S]*?)\\}\\s*else if`);
      match = firstBlockRegex.exec(content);
  }
  
  if (match) {
    const blockContent = match[1];
    if (!blockContent.includes(`case 'SKILLS'`)) {
      // Find the first case statement and insert before it
      const insertStr = `      case 'SKILLS': content = <${sc.prefix}SkillsBlock {...commonProps} />; break;\n      case 'EXPERIENCE': content = <${sc.prefix}ExperienceBlock {...commonProps} />; break;\n      case 'HERO':`;
      
      const newBlockContent = blockContent.replace(/case 'HERO':/, insertStr);
      content = content.replace(blockContent, newBlockContent);
    }
  }
}

// Special case for AcidTech
const acidTechRegex = /else if \(activeThemeTemplate === 'acid-tech' \|\| activeThemeTemplate === 'acid'\) \{([\s\S]*?)\}\s*else if/;
const acidMatch = acidTechRegex.exec(content);
if (acidMatch) {
  const blockContent = acidMatch[1];
  if (!blockContent.includes(`case 'SKILLS'`)) {
    const insertStr = `      case 'SKILLS': content = <AcidTechSkillsBlock {...commonProps} />; break;\n      case 'EXPERIENCE': content = <AcidTechExperienceBlock {...commonProps} />; break;\n      case 'HERO':`;
    const newBlockContent = blockContent.replace(/case 'HERO':/, insertStr);
    content = content.replace(blockContent, newBlockContent);
  }
}

fs.writeFileSync(filePath, content);
console.log('Patched DynamicBlockRenderer.tsx');
