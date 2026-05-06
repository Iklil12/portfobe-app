const fs = require('fs');
let path = 'c:/Users/user/portfobe-app/components/themes/EditorialTheme.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Rename to EditorialTheme
content = content.replace(/export default function CanvasTheme/, 'export default function EditorialTheme');

// 2. Add @container
content = content.replace(/<main className=\"([^\"]+)\"/, '<main className=\"$1 @container\"');

// 3. Remove isMobileView logic and replace with container queries
content = content.replace(/\$\{isMobileView \? '([^']+)' : '([^']+)'\}/g, (match, mobile, desktop) => {
    const desktopClasses = desktop.split(' ').map(c => c.includes('@md:') ? c : c.replace(/^(md:|lg:|xl:)?/, '@md:')).join(' ');
    return mobile + ' ' + desktopClasses;
});
// Clean up any double @@
content = content.replace(/@@/g, '@');

// 4. Update md: to @md: globally
content = content.replace(/\bmd:/g, '@md:').replace(/\blg:/g, '@lg:').replace(/\bxl:/g, '@xl:');
content = content.replace(/@@md:/g, '@md:').replace(/@@lg:/g, '@lg:');

// 5. Inject theme variables for typography and button shapes
content = content.replace(/const rawHighlightColor = theme\?\.themeColor \|\| '#2563eb';/, 
`const fontHeading = theme?.fontHeading || 'Newsreader';
    const fontBody = theme?.fontBody || 'Instrument Sans';
    const radiusClass = theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[2rem]';
    
    const rawHighlightColor = theme?.themeColor || '#2563eb';`);

// 6. Update fonts CSS
content = content.replace(/\.font-sans \{ font-family: 'Instrument Sans', sans-serif; \}/, `.font-sans { font-family: '\\${fontBody}', sans-serif; }`);
content = content.replace(/\.font-serif \{ font-family: 'Newsreader', serif; \}/, `.font-serif { font-family: '\\${fontHeading}', serif; }`);

// 7. Update rounded values using string replace to properly inject literal strings
content = content.replace(/className=\"px-6 py-3 @md:px-8 @md:py-4 rounded-full bg-\[\#111\]/g, 'className={`px-6 py-3 @md:px-8 @md:py-4 \\${radiusClass} bg-[#111]');
content = content.replace(/className=\"px-6 py-3 @md:px-8 @md:py-4 rounded-full bg-white border/g, 'className={`px-6 py-3 @md:px-8 @md:py-4 \\${radiusClass} bg-white border');
content = content.replace(/rounded-\[2rem\] @md:rounded-\[3rem\]/g, '\\${radiusClass}');

fs.writeFileSync(path, content);
console.log('EditorialTheme refactored!');
