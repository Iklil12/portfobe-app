const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components', 'blocks', 'DynamicBlockRenderer.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

const lines = content.split('\n');
const uniqueLines = [];
const seenConsts = new Set();
const seenImports = new Set();

for (let line of lines) {
    const trimmed = line.trim();
    
    // Check for dynamic import declarations
    const constMatch = trimmed.match(/^const\s+([a-zA-Z0-9_]+)\s*=\s*dynamic\(/);
    if (constMatch) {
        const name = constMatch[1];
        if (!seenConsts.has(name)) {
            seenConsts.add(name);
            uniqueLines.push(line);
        }
        continue;
    }
    
    // Check for remaining static imports that might conflict
    const importMatch = trimmed.match(/^import\s+(?:\{\s*)?([a-zA-Z0-9_]+)(?:\s*\})?\s+from/);
    if (importMatch && (trimmed.includes('./') || trimmed.includes('@/'))) {
        const name = importMatch[1];
        if (!seenConsts.has(name) && !seenImports.has(name)) {
            seenImports.add(name);
            uniqueLines.push(line);
        }
        continue;
    }
    
    uniqueLines.push(line);
}

fs.writeFileSync(filePath, uniqueLines.join('\n'), 'utf-8');
console.log('Successfully deduplicated declarations in DynamicBlockRenderer.tsx');
