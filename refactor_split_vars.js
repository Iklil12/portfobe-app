const fs = require('fs');
let lines = fs.readFileSync('c:/Users/user/portfobe-app/components/themes/SplitTheme.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const rawHighlightColor = theme?.themeColor ||')) {
        lines.splice(i + 2, 0, 
            '    const fontHeading = theme?.fontHeading || \'Cabinet Grotesk\';',
            '    const fontBody = theme?.fontBody || \'Inter\';',
            '    const radiusClass = theme?.buttonShape === \'square\' ? \'rounded-none\' : theme?.buttonShape === \'pill\' ? \'rounded-full\' : \'rounded-xl\';'
        );
        break;
    }
}

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('@import url(\'https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,500,700,400,900&display=swap\');')) {
        lines.splice(i, 0, '        @import url(\'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600;1,700&display=swap\');');
        break;
    }
}

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('.font-display { font-family: \'Cabinet Grotesk\', sans-serif; }')) {
        lines[i] = '        .font-display { font-family: `${fontHeading}`, sans-serif; }';
    }
    if (lines[i].includes('.font-sans { font-family: \'Inter\', sans-serif; }')) {
        lines[i] = '        .font-sans { font-family: `${fontBody}`, sans-serif; }';
    }
}

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('transition-colors duration-300 rounded-xl py-3 px-4')) {
        lines[i] = lines[i].replace('rounded-xl', '${radiusClass}');
    }
    if (lines[i].includes('rounded-full font-sans font-bold text-sm uppercase tracking-widest transition-colors duration-300')) {
        lines[i] = lines[i].replace('rounded-full', '${radiusClass}');
    }
}

fs.writeFileSync('c:/Users/user/portfobe-app/components/themes/SplitTheme.tsx', lines.join('\n'));
console.log('Modified SplitTheme.tsx');
