const fs = require('fs');

const files = [
  'hooks/useThemeEditor.ts',
  'components/features/appearance/PreviewPanel.tsx',
  'components/blocks/DynamicBlockRenderer.tsx',
  'app/preview/page.tsx'
];

files.forEach(file => {
  const filePath = require('path').join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Simple way to inject the origin check if not already present
    if (!content.includes('if (event.origin !== window.location.origin) return;')) {
      content = content.replace(
        /(const handleMessage = \((?:e|event)(?:\s*:\s*MessageEvent)?\)\s*=>\s*\{)/,
        "$1\n    if (event.origin !== window.location.origin) return;"
      );
      // In case the event parameter is named `e`:
      if (!content.includes('window.location.origin) return;')) {
         content = content.replace(
          /(function handleMessage\((?:e|event)(?:\s*:\s*MessageEvent)?\)\s*\{)/,
          "$1\n    if (event.origin !== window.location.origin) return;"
        );
      }
      // specifically for event vs e
      content = content.replace(
        /(const handleMessage = \(e(?:\s*:\s*MessageEvent)?\)\s*=>\s*\{)/,
        "$1\n    if (e.origin !== window.location.origin) return;"
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Added origin check to:', file);
    }
  }
});
