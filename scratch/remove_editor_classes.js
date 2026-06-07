const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'components/blocks/faq/themes');
const files = fs.readdirSync(dir);

let totalReplaced = 0;

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let modified = false;

    // This regex looks for className inside EditableText and removes editor-specific classes
    const replacePattern = /(<EditableText[^>]*className=\{?["'`])([^"'`\}]+)(["'`]\}?[^>]*>)/g;
    
    content = content.replace(replacePattern, (match, p1, classes, p3) => {
      let newClasses = classes
        .replace(/outline-none/g, '')
        .replace(/cursor-text/g, '')
        .replace(/transition-all/g, '')
        .replace(/hover:shadow-\[0_0_0_1px_#007bff\]/g, '')
        .replace(/focus:shadow-\[0_0_0_1px_#007bff\]/g, '')
        .replace(/focus:bg-\[#007bff\]\/\d+/g, '')
        .replace(/\s+/g, ' ')
        .trim();
        
      modified = true;
      return p1 + newClasses + p3;
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      totalReplaced++;
    }
  }
});

console.log("Total replaced files:", totalReplaced);
