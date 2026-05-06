const fs = require('fs');
let path = 'c:/Users/user/portfobe-app/components/themes/CinematicTheme.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/\$\{isMobileView \? '([^']+)' \: '([^']+)'\}/g, (match, trueBranch, falseBranch) => {
    let newStr = falseBranch.replace(/\bmd:/g, '@md:').replace(/\blg:/g, '@lg:').replace(/\bsm:/g, '@sm:');
    return newStr;
});

// For `{!isMobileView && <span ...>0{i + 1}</span>}`, replace with `<span ... hidden @md:block>0{i + 1}</span>`
content = content.replace(/\{!isMobileView && <span className=\"text-gray-600 font-mono text-sm md:text-lg hidden md:block\">0\{i \+ 1\}<\/span>\}/g, '<span className=\"text-gray-600 font-mono text-sm @md:text-lg hidden @md:block\">0{i + 1}</span>');

content = content.replace(/\{isMobileView \? \(\s*<span className=\"font-mono text-\[10px\]\">\{award\.year \|\| new Date\(award\.createdAt\)\.getFullYear\(\)\}<\/span>\s*\) \: \(\s*<span className=\"md:hidden font-mono text-\[10px\]\">\{award\.year \|\| new Date\(award\.createdAt\)\.getFullYear\(\)\}<\/span>\s*\)\}/g, '<span className=\"@md:hidden font-mono text-[10px]\">{award.year || new Date(award.createdAt).getFullYear()}</span>');

content = content.replace(/\{!isMobileView && \(\s*<div className=\"hidden md:flex flex-1 justify-center\">\s*<span className=\"text-\[10px\] md:text-sm uppercase tracking-widest cine-body\">\{award\.issuer\}<\/span>\s*<\/div>\s*\)\}/g, '<div className=\"hidden @md:flex flex-1 justify-center\"><span className=\"text-[10px] @md:text-sm uppercase tracking-widest cine-body\">{award.issuer}</span></div>');

content = content.replace(/\{!isMobileView && \(\s*<span className=\"hidden md:block font-mono text-sm\">\{award\.year \|\| new Date\(award\.createdAt\)\.getFullYear\(\)\}<\/span>\s*\)\}/g, '<span className=\"hidden @md:block font-mono text-sm\">{award.year || new Date(award.createdAt).getFullYear()}</span>');

content = content.replace(/<div className=\"([^\"]+)\"/, '<div className=\"$1 @container\"');

fs.writeFileSync(path, content);
console.log('CinematicTheme done safely!');
