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
    
    // Loosen the origin check to allow localhost and 127.0.0.1 for local development
    content = content.replace(
      /if \(event\.origin !== window\.location\.origin\) return;/g,
      "if (event.origin !== window.location.origin && !event.origin.includes('localhost') && !event.origin.includes('127.0.0.1')) return;"
    );

    // Also replace for `e.origin` just in case
    content = content.replace(
      /if \(e\.origin !== window\.location\.origin\) return;/g,
      "if (e.origin !== window.location.origin && !e.origin.includes('localhost') && !e.origin.includes('127.0.0.1')) return;"
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Relaxed origin check for:', file);
  }
});
