const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/user/portfobe-app/components/themes';
const files = [
    'BentoGrid.tsx',
    'BrutalismTheme.tsx',
    'CinematicTheme.tsx',
    'MinimalistTheme.tsx',
    'SpatialTheme.tsx',
    'ViewfinderTheme.tsx'
];

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace standard isMobileView className ternaries
    content = content.replace(/\$\{isMobileView \? '([^']+)' \: '([^']+)'\}/g, (match, trueBranch, falseBranch) => {
        let newStr = falseBranch.replace(/\bmd:/g, '@md:').replace(/\blg:/g, '@lg:').replace(/\bsm:/g, '@sm:');
        return newStr;
    });

    // Handle BrutalismTheme `const res =`
    if (file === 'BrutalismTheme.tsx') {
        content = content.replace(/const res = \(desktopClasses: string\) => isMobileView \? '' \: desktopClasses;/, 
                                  "const res = (classes: string) => classes.replace(/\\bmd:/g, '@md:').replace(/\\blg:/g, '@lg:');");
    }

    // Handle BentoGrid specific JS logic
    if (file === 'BentoGrid.tsx') {
        content = content.replace(
            /const spanClass = isMobileView \? 'col-span-1 aspect-\[4\/5\]' \: \(i === 2 \|\| i === 3 \? 'lg:col-span-4 lg:row-span-3' \: 'lg:col-span-2 lg:row-span-3 aspect-square lg:aspect-auto'\);/g,
            "const spanClass = 'col-span-1 aspect-[4/5] ' + (i === 2 || i === 3 ? '@lg:col-span-4 @lg:row-span-3 @lg:aspect-auto' : '@lg:col-span-2 @lg:row-span-3 aspect-square @lg:aspect-auto');"
        );
    }

    // Handle SpatialTheme specific JS logic
    if (file === 'SpatialTheme.tsx') {
        content = content.replace(
            /const colSpan = isMobileView \? 'col-span-1' \: \(i % 4 === 0 \|\| i % 4 === 3 \? 'md:col-span-7' \: 'md:col-span-5'\);/g,
            "const colSpan = 'col-span-1 ' + (i % 4 === 0 || i % 4 === 3 ? '@md:col-span-7' : '@md:col-span-5');"
        );
    }
    
    // Handle conditional renders in CinematicTheme
    if (file === 'CinematicTheme.tsx') {
        content = content.replace(/\{!isMobileView && \(([\s\S]*?)\)\}/g, "$1");
        content = content.replace(/\{isMobileView \? \(([\s\S]*?)\) : \(([\s\S]*?)\)\}/g, (match, trueBranch, falseBranch) => {
            // For cinematic theme, if there was an isMobileView ? (mobile_element) : (desktop_element)
            // It's safer to just wrap them in classes if they are simple, or leave them.
            return match; // Actually, let's leave complex JSX ternaries as they might be structurally different
        });
    }

    // Add @container to the root wrapper
    content = content.replace(/<(div|main) className=\"([^\"]+)\"/, '<$1 className=\"$2 @container\"');

    fs.writeFileSync(filePath, content);
    console.log('Refactored ' + filePath);
}
