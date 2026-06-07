const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'components/blocks/faq/themes');
const files = fs.readdirSync(dir);

let totalReplaced = 0;

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const initialContent = content;
    
    content = content.replace(/outline-none\s+/g, '');
    content = content.replace(/cursor-text\s+/g, '');
    content = content.replace(/transition-all\s+/g, '');
    content = content.replace(/hover:shadow-\[[^\]]+\]\s*/g, '');
    content = content.replace(/focus:shadow-\[[^\]]+\]\s*/g, '');
    content = content.replace(/focus:bg-\[[^\]]+\]\/\d+\s*/g, '');

    if (content !== initialContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      totalReplaced++;
    }
  }
});

console.log("Total replaced files:", totalReplaced);
