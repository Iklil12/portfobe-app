const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components', 'blocks', 'DynamicBlockRenderer.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove duplicate lines in the import section (lines starting with import)
const lines = content.split('\n');
const uniqueLines = [];
const seenImports = new Set();
let hasDynamicImport = false;

for (let line of lines) {
    if (line.includes("import dynamic from 'next/dynamic'")) {
        hasDynamicImport = true;
    }
    
    // Normalize and remove duplicates
    const trimmed = line.trim();
    if (trimmed.startsWith('import {') || (trimmed.startsWith('import ') && trimmed.includes(' from '))) {
        if (!seenImports.has(trimmed)) {
            seenImports.add(trimmed);
            uniqueLines.push(line);
        }
    } else {
        uniqueLines.push(line);
    }
}
content = uniqueLines.join('\n');

if (!hasDynamicImport) {
    content = content.replace("import React", "import dynamic from 'next/dynamic';\nimport React");
}

// 2. Transform the unique static imports into dynamic imports
const importRegex = /^import\s+\{\s*([a-zA-Z0-9_]+)\s*\}\s+from\s+['"]([\.\/a-zA-Z0-9_\-]+)['"];/gm;
content = content.replace(importRegex, (match, component, importPath) => {
    // Only convert relative or specific component paths
    if (importPath.startsWith('.') || importPath.startsWith('@/components/')) {
        return `const ${component} = dynamic(() => import('${importPath}').then(mod => mod.${component}), { ssr: false });`;
    }
    return match;
});

// For default imports like FaqRenderer
const defaultImportRegex = /^import\s+([a-zA-Z0-9_]+)\s+from\s+['"]([\.\/a-zA-Z0-9_\-]+)['"];/gm;
content = content.replace(defaultImportRegex, (match, component, importPath) => {
    if ((importPath.startsWith('.') || importPath.startsWith('@/components/')) && component !== 'React' && component !== 'Script' && component !== 'ReactLenis') {
        return `const ${component} = dynamic(() => import('${importPath}'), { ssr: false });`;
    }
    return match;
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully converted all imports to dynamic in DynamicBlockRenderer.tsx');
