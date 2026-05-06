const fs = require('fs');

function refactorFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace standard isMobileView className ternaries
    content = content.replace(/\$\{isMobileView \? '([^']+)' \: '([^']+)'\}/g, (match, trueBranch, falseBranch) => {
        let newStr = falseBranch.replace(/\bmd:/g, '@md:').replace(/\blg:/g, '@lg:').replace(/\bsm:/g, '@sm:');
        return newStr;
    });

    // Replace isMobileView conditional blocks that just hide things on mobile
    content = content.replace(/\{!isMobileView && \(([\s\S]*?)\)\}/g, (match, inner) => {
        return inner;
    });
    
    content = content.replace(/\{!isMobileView && (.*?)\}/g, (match, inner) => {
        return inner;
    });

    // Add @container to the root wrapper
    content = content.replace(/<div className=\"([^\"]+)\"/, '<div className=\"$1 @container\"');

    fs.writeFileSync(filePath, content);
    console.log('Refactored ' + filePath);
}

refactorFile('c:/Users/user/portfobe-app/components/themes/AcidTheme.tsx');
