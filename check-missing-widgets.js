const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'components', 'themes');
const files = fs.readdirSync(themesDir).filter(f => f.endsWith('.tsx'));

console.log("Menganalisis widget yang hilang di setiap tema...\n");

files.forEach(file => {
    const content = fs.readFileSync(path.join(themesDir, file), 'utf8');
    let missingWidgets = [];

    if (!content.includes('<GithubStats')) missingWidgets.push('GithubStats');
    if (!content.includes('<CanvaShowcase')) missingWidgets.push('CanvaShowcase');
    if (!content.includes('<PenpotShowcase')) missingWidgets.push('PenpotShowcase');

    if (missingWidgets.length > 0) {
        console.log(`- [${file}]: Kurang widget ${missingWidgets.join(', ')}`);
    }
});
