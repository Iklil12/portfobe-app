const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components', 'blocks', 'DynamicBlockRenderer.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Match paths with @ as well
const importRegex = /^import\s+\{\s*([a-zA-Z0-9_]+)\s*\}\s+from\s+['"]([@\.\/a-zA-Z0-9_\-]+)['"];/gm;
content = content.replace(importRegex, (match, component, importPath) => {
    // Only convert relative or specific component paths
    if (importPath.startsWith('.') || importPath.startsWith('@/components/')) {
        return `const ${component} = dynamic(() => import('${importPath}').then(mod => mod.${component}), { ssr: false });`;
    }
    return match;
});

const defaultImportRegex = /^import\s+([a-zA-Z0-9_]+)\s+from\s+['"]([@\.\/a-zA-Z0-9_\-]+)['"];/gm;
content = content.replace(defaultImportRegex, (match, component, importPath) => {
    if ((importPath.startsWith('.') || importPath.startsWith('@/components/')) && component !== 'React' && component !== 'Script' && component !== 'ReactLenis' && component !== 'FaqRenderer') {
        return `const ${component} = dynamic(() => import('${importPath}'), { ssr: false });`;
    }
    return match;
});

// Fix FaqRenderer specifically if it was missed
content = content.replace(/^import FaqRenderer from '\.\/faq\/FaqRenderer';/gm, "const FaqRenderer = dynamic(() => import('./faq/FaqRenderer'), { ssr: false });");

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully completed second pass!');
