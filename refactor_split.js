const fs = require('fs');
let path = 'c:/Users/user/portfobe-app/components/themes/SplitTheme.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace standard className ternaries
content = content.replace(/\$\{isMobileView \? '([^']*)' \: '([^']*)'\}/g, (match, mobileClasses, desktopClasses) => {
    // If mobile is empty, just add @md: to all desktop classes
    let newDesktop = desktopClasses.split(' ').map(c => {
        if (!c) return '';
        if (c.startsWith('md:') || c.startsWith('lg:') || c.startsWith('sm:') || c.startsWith('xl:')) {
            return '@' + c;
        }
        return '@md:' + c;
    }).join(' ').trim();
    
    // If desktop has classes that start with md:/lg:, and we added @md: to them, they would become @md:@md:. Let's fix that.
    newDesktop = newDesktop.replace(/@md:@/g, '@').replace(/@md:md:/g, '@md:').replace(/@md:lg:/g, '@lg:');
    
    if (!mobileClasses) return newDesktop;
    return `${mobileClasses} ${newDesktop}`.trim();
});

// Also replace `!isMobileView` with `hidden @md:block` for the hover image
content = content.replace(/\{!isMobileView && \(/g, '{ ('); // We'll just remove the condition, but we need to make sure the element inside is hidden on mobile
content = content.replace(/\{isMobileView && \(/g, '{ (');

// Manual fixes for specific lines
content = content.replace(/<div className=\"w-full aspect-\[16\/9\] rounded-xl overflow-hidden mt-6 border nexus-border\">/g, '<div className=\"w-full aspect-[16/9] rounded-xl overflow-hidden mt-6 border nexus-border @md:hidden\">');

content = content.replace(/<AnimatePresence>/g, '<AnimatePresence>\n                                                    <div className=\"hidden @md:block\">');
content = content.replace(/<\/AnimatePresence>/g, '</div>\n                                                </AnimatePresence>');

// Replace footer mobile block
content = content.replace(/<div className=\"flex items-center gap-6 my-2\">/g, '<div className=\"flex items-center gap-6 my-2 @md:hidden\">');

// Fix `isHovered && !isMobileView ? 'translate-x-4' : ''`
content = content.replace(/\$\{isHovered && !isMobileView \? 'translate-x-4' : ''\}/g, '${isHovered ? \'@md:translate-x-4\' : \'\'}');

// Fix root <main>
content = content.replace(/<main className=\"([^\"]+)\"/, '<main className=\"$1 @container\"');

// Replace standard md: and lg: with @md: and @lg: globally (careful with URLs or other things)
// We only want to replace standalone md: and lg: classes.
content = content.replace(/\bmd:/g, '@md:').replace(/\blg:/g, '@lg:').replace(/\bxl:/g, '@xl:');

// Let's fix the @md:@md: mistakes that might occur
content = content.replace(/@md:@md:/g, '@md:').replace(/@lg:@lg:/g, '@lg:').replace(/@md:@lg:/g, '@lg:');

fs.writeFileSync(path, content);
console.log('SplitTheme refactored safely!');
