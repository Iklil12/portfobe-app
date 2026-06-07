const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'components/blocks/faq/themes');
const files = fs.readdirSync(dir);

let totalReplaced = 0;

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('maxLength={1000}')) {
      content = content.replace(/maxLength=\{1000\}/g, 'maxLength={250}');
      fs.writeFileSync(filePath, content, 'utf8');
      totalReplaced++;
    }
  }
});

console.log("Total replaced files:", totalReplaced);
